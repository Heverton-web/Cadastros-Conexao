# Plano de Implementação - Fluxo de Cadastro Seguro e Central de Notificações

Este plano detalha o design técnico, as migrations do banco de dados, as rotas e componentes necessários para implementar o fluxo de cadastro robusto, verificação 2FA inicial, expiração e auto-limpeza de links, temporizador de 24h no formulário de preenchimento, e a Central de Notificações gerenciável pelo Super Admin.

---

## Proposed Changes

### 1. Banco de Dados (Supabase - SQL Migrations)

#### [NEW] [00014_notifications_and_expiry.sql](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/supabase/migrations/00014_notifications_and_expiry.sql)

Criar migração contendo:

- Novas colunas na tabela `public.cadastros`:
  - `link_acessado` (boolean default false) - Para rastrear o primeiro clique no link.
  - `inicio_preenchimento` (timestamptz) - Registra quando o 2FA inicial foi validado.
  - `2fa_canal` (text) - Canal escolhido ('email' ou 'whatsapp').
  - `2fa_contato` (text) - O e-mail ou telefone destino do 2FA.
  - `2fa_token` (text) - PIN de 6 dígitos temporário.
  - `2fa_expiracao` (timestamptz) - Validade do PIN (5 minutos).
- Atualização da View `public.clientes` para incluir as novas colunas.
- Criação da tabela `public.notificacoes_templates`:
  - `id` uuid primary key default gen_random_uuid()
  - `evento` text unique not null (ex: 'cadastro_correcao', 'cadastro_reprovado', 'cadastro_aprovado', 'cadastro_em_analise', 'criacao_credencial')
  - `titulo` text not null
  - `corpo_template` text not null
  - `ativo` boolean default true
  - `created_at` timestamptz default now()
  - `updated_at` timestamptz default now()
- Criação da tabela `public.notificacoes`:
  - `id` uuid primary key default gen_random_uuid()
  - `usuario_id` uuid references public.profiles(id) on delete cascade
  - `titulo` text not null
  - `mensagem` text not null
  - `lida` boolean default false
  - `dados` jsonb - Armazena dados contextuais (ex: cadastro_id)
  - `created_at` timestamptz default now()
- Políticas RLS para `notificacoes` e `notificacoes_templates`.
- Criação de RPC `public.limpar_links_expirados()` que exclui registros da tabela `cadastros` que tenham `status = 'link_gerado'` e `link_expiracao < now()`.
- Criação de RPC `public.registrar_acesso_token(token_text text)` para marcar `link_acessado = true` e executar a limpeza de expirados simultaneamente.

---

### 2. Geração de Credenciais (Webhook)

#### [MODIFY] [credenciais.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/credenciais.tsx)

- No `handleSubmit`, disparar o webhook com o evento `criacao_credencial`:
  ```typescript
  await dispararWebhooks("criacao_credencial", {
    nome: form.nome_completo,
    email: form.email_corporativo,
    departamento: form.departamento,
  });
  ```

#### [MODIFY] [webhooks.ts](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/lib/webhooks.ts)

- Adicionar `"criacao_credencial"` na lista de eventos de botão/ação (`EVENTOS_BUTTON_ACTION`).

---

### 3. Geração e Validação do Link de Cadastro

#### [MODIFY] [clientes.ts](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/lib/clientes.ts)

- Ao listar cadastros, chamar a RPC `limpar_links_expirados()` de forma silenciosa para limpar registros órfãos que venceram sem ser acessados.

#### [MODIFY] [pre-cadastro.$token.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/pre-cadastro.$token.tsx)

- No carregamento do token (`validarToken`), chamar a RPC `registrar_acesso_token(token)`.
- Se o token estiver com `link_expiracao < now()`, o cadastro não existirá (por ter sido deletado) ou o validador retornará "expirado".

---

### 4. Fluxo do Cliente Final (2FA Inicial & Timer de 24 horas)

#### [MODIFY] [pre-cadastro.$token.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/pre-cadastro.$token.tsx)

- **Nova Estrutura de Passos (Steps)**:
  `"2fa_solicitar" | "2fa_validar" | "tipo" | "dados" | "endereco" | "documentos" | "timer_expirado" | "sucesso" | "expirado"`
- **Funcionamento**:
  1. Se `status_verificacao_token` for `false`, direcionar o Lead para `"2fa_solicitar"`.
  2. O Lead digita o e-mail ou WhatsApp e clica em "Receber PIN".
     - Gera PIN de 6 dígitos, define expiração em 5 minutos (`now() + 5 minutes`).
     - Dispara o webhook correspondente para o envio da mensagem.
  3. Na tela `"2fa_validar"`, o Lead digita o PIN.
     - Se validado, define `status_verificacao_token = true`, `inicio_preenchimento = now()` no banco e atualiza o estado para a etapa `"tipo"`.
  4. Ao entrar nas etapas de preenchimento (`tipo`, `dados`, etc.):
     - Calcula o tempo decorrido desde `inicio_preenchimento`.
     - Exibe um **Timer Regressivo** de 24 horas fixado no topo da tela.
     - Se o tempo restante atingir `<= 0`, altera o passo para `"timer_expirado"`, exibe o modal explicativo de tempo esgotado e bloqueia a tela.

---

### 5. Central de Notificações e Templates

#### [NEW] [notificacoes.ts](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/lib/notificacoes.ts)

Criar funções de integração:

- `listarNotificacoes(usuarioId: string)` - Busca notificações não lidas.
- `marcarComoLida(notificacaoId: string)` - Altera `lida = true` no banco.
- `marcarTodasComoLidas(usuarioId: string)` - Altera todas as notificações daquele usuário para `lida = true`.
- `enviarNotificacaoComTemplate(evento: string, cadastroId: string, destinatarioId: string, variaveis: Record<string, string>)` - Resolve o template de notificação cadastrado no banco e insere o registro na tabela `notificacoes`.

#### [MODIFY] [clientes.$id.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/clientes.$id.tsx)

- Ao aprovar o cadastro (`handleAprovar`), reprovar (`handleReprovar`) ou solicitar correção (`handleCorrecao`), invocar a função `enviarNotificacaoComTemplate` para notificar o consultor comercial associado ao cadastro.

#### [MODIFY] [AppLayout.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/components/layout/AppLayout.tsx)

- Adicionar o ícone do **Sino de Notificações** (`Bell` do Lucide) ao lado do avatar.
- Exibir badge numérico vermelho com a quantidade de notificações com `lida = false`.
- Adicionar popover flutuante para visualização rápida das notificações e botão "Marcar todas como lidas".
- Ao clicar na notificação, marcá-la como lida e redirecionar para a rota do cliente em `/clientes/$id` (ou recarregar dados).

#### [MODIFY] [admin.config.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/admin.config.tsx)

- Adicionar aba `"notificacoes"` para gerenciamento de templates de notificações pelo Super Admin.
- Permitir editar o título e o corpo de cada evento disponível (ex: `cadastro_correcao`, `cadastro_reprovado`, etc.).

---

## Verification Plan

### Automated Tests

- Executar `npx tsc --noEmit` para garantir integridade estrutural.

### Manual Verification

- Criar uma credencial e checar se o webhook dispara.
- Gerar um link, simular expiração no banco e ver se o registro é excluído automaticamente.
- Acessar a rota de pré-cadastro pública, validar a etapa de 2FA por e-mail/WhatsApp, e verificar se o timer de 24h aparece no topo.
- Simular o estouro do cronômetro de 24h e checar se a tela bloqueia com o modal explicativo.
- Executar ações de auditoria (Aprovar, Reprovar, Corrigir) em um cadastro e checar se o consultor recebe a notificação no sino do cabeçalho em tempo real, mudando a contagem do badge ao marcar como lida.
