# AGENTS.md — ERP Conexão & Bubble Reverse Engineering

**Idioma:** PT-BR obrigatório.

## Estrutura do Projeto

- **Raiz** → `bubble_reverse_engineering/`: Engenharia reversa de Bubble.io + configs globais.
- **`erp-conexao/`** → Aplicação ERP (TanStack Start + React Router + Vite + Supabase).
- **`supabase-mcp-server/`** → MCP server TypeScript para gerenciar banco Supabase.

---

## Comandos de Desenvolvimento (ERP Conexão)

```bash
npm run dev      # dev server (Vite)
npm run build    # build produção
npm run format   # Prettier
npm run lint     # ESLint
```

---

## MCP Supabase

Server em `supabase-mcp-server/` (build: `npm run build` em `src/index.ts`).

**Tools disponíveis:**

| Tool                       | Uso                                     |
| -------------------------- | --------------------------------------- |
| `supabase_execute_sql`     | SQL arbitrário (SELECT, DDL, DML)       |
| `supabase_list_tables`     | Lista tabelas de um schema              |
| `supabase_describe_table`  | Descreve colunas, constraints, RLS      |
| `supabase_apply_migration` | Aplica `.sql` de `supabase/migrations/` |

---

## Regras de UI (ERP Conexão)

### NUNCA usar alertas nativos do navegador/Sistema

- **PROIBIDO**: `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO**: Usar componentes de modal da aplicação (`AlertDialog` ou `Dialog`)

### Componentes de modal disponíveis

- `AlertDialog` de `~/components/ui/alert-dialog` — para confirmações de exclusão e ações destrutivas
- `Dialog` de `~/components/ui/dialog` — para modais de conteúdo genérico

### Padrão para exclusões

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "~/components/ui/alert-dialog";

// Estado para controlar o modal
const [itemParaDeletar, setItemParaDeletar] = useState<ItemType | null>(null);

// Botão de delete abre o modal
<button onClick={() => setItemParaDeletar(item)}>
  <Trash2 size={14} />
</button>

// AlertDialog no JSX
<AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
  <AlertDialogContent className="bg-card border-border">
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir item?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive">
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Regras de Arquitetura (ERP Conexão)

### Multi-tenant por empresa_id

- Toda tabela criada DEVE ter coluna `empresa_id` (UUID, FK para `empresas.id`)
- RLS policies devem filtrar por `empresa_id`
- Super Admin filtra por empresa; Admin vê apenas sua empresa

### Módulos independentes

- Cada módulo é self-contained em `src/features/<modulo>/`
- A única camada de conexão entre módulos é o BANCO DE DADOS
- Excluir um módulo não deve afetar outros
- Tabelas do módulo devem ser criadas no mesmo banco (multi-tenant)
- Arquivos críticos: `src/registry/modules.ts`, `src/features/cadastros/permissions.ts`

---

## Eficiência de Tokens

- **Skill-First**: Antes de tarefa complexa, checar `.agents/skills/` ou skills do OpenCode.
- **Caveman**: Utilize o estilo ultra‑condensado (`caveman` skill) – sem markdown decorativo, apenas patches ou linhas alteradas.
- **Headroom**: Ative o filtro (`headroom-filter.js`) para logs longos; ele remove ruído e mantém apenas as linhas de erro relevantes.
- **Lean‑Context**: Prefira inspeções de AST/TS (`lean-ctx` skill) ao invés de leitura completa de arquivos.
- **Pre‑flight Check**: Rode `npm run check:types` e `npm run test:safe` antes de modificações estruturais (`pre-flight-check` skill).
- **Lazy Reading**: Leia arquivos somente quando necessário.
- **Context Clearing**: Sugira `/clear` ao finalizar etapas longas.

---

## Regras Estritas do Sistema de Agente

### 🛑 MÉTODO CAVEMAN ATIVADO

- **SEM greetings ou explicações desnecessárias**: Não dizer "Claro, posso ajudar com isso".
- **SEM re-emitir arquivos inteiros**: Apenas diffs unificados ou chunks cirúrgicos.
- **Direto ao ponto**: "[Arquivo] alterado. [Razão]". Minimizar palavras geradas.
- **Explicações SOMENTE com "?"**: Se o usuário pergunta "Por quê?" com interrogação, aí explica.

### 🔍 ESTRATÉGIA LEAN-CTX (LIMITAÇÕES DE CONTEXTO)

- **Não usar ferramentas genéricas**: Evitar `cat` ou `grep` em diretórios grandes.
- **Ler assinaturas primeiro**: Priorizar interfaces TypeScript e `index.d.ts` antes de pedir corpos inteiros.
- **Agrupar edições**: Usar multi-file writes em vez de trocas incrementais de chat.
- **Executar com cache interno**: Quando editar arquivo, consolidar subtarefas em comando único.

### 💾 ESQUEMA RTK (REAL-TIME KNOWLEDGE)

- **Manter lições aprendidas**: Se descobrir regra de sistema, comportamento de infraestrutura (e.g., quirks do Supabase MCP) ou bug repetível, registrar IMEDIATAMENTE no scratchpad abaixo.
- **Consultar scratchpad**: Antes de qualquer plano de execução, revisar learnings prévios.

---

### 📝 SCRATCHPAD RTK (Agente: Registre aprendizados aqui durante execução)

- **Learnt**: [Agente preencherá durante runtime]

---

## Deploy e Skills

### Deploy

- Só executar quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
- Usar skill `deploy-vps`. Build deve passar antes do push.

### Bubble Reverse Engineering

- Pipeline completo via `/bubble-tech-lead` + skills em `.agents/skills/`.

### Skills Disponíveis

| Skill                          | Descrição                                   |
| ------------------------------ | ------------------------------------------- |
| `criar-modulo`                 | Cria estrutura completa de novo módulo           |
| `criar-rota`                   | Cria rota protegida no ERP Conexão                |
| `gerar-crud`                   | Operações CRUD com React Query              |
| `criar-componente-modulo`      | Cria componente React seguindo padrões shadcn/ui do ERP Conexão                    |
| `adicionar-permissao`          | Adiciona permissão ao sistema de permissões do ERP Conexão                    |
| `validar-modulo`               | Verificar integridade do módulo             |
| `documentar-modulo`            | Gerar documentação do módulo                |
| `deploy-vps`                   | Deploy via Docker + VPS                     |
| `planejar-modulo-repo-externo` | Analisar repo externo e planejar integração como módulo independente no ERP Conexão |
| `gerenciar-nav-items`          | Gerencia nav items (itens de navegação lateral) de módulos do ERP Conexão. Adiciona, renomeia, reordena ou remove nav items mantendo consistência de rotas, permissões e module.ts                    |
| `design-frontend`              | Embeleza o frontend de uma rota do ERP Conexao aplicando classes de estilo do design system do dashboard. Trigger: /design <rota> — Exemplo: /design /cadastros/solicitacoes |
| `responsividade`               | Analisa a responsividade de um módulo do ERP Conexão, gera documentação e IMPLEMENTA o plano de correção sem quebrar o funcionamento do módulo ou aplicação. Trigger: /responsividade <nome_modulo> |
| `criar-design-modulo`          | Cria a estrutura de configuração de Design System para um módulo existente do ERP Conexão — gera rota /modulo/design e registra hasDesignConfig no module.ts. Inclui padrões de UI/UX baseados no módulo cadastros. |
| `gerar-pagina`                 | Gera página React completa com PageHeader, breadcrumb, layout responsivo mobile-first e tokens do Design System para um módulo do ERP Conexão. Inclui estados de loading, erro e vazio. |
| `gerar-formulario`             | Gera formulário React completo com React Hook Form + Zod + componentes do Design System (CSS vars / Tailwind v4) para um módulo existente do ERP Conexão. |
| `gerar-modal`                  | Gera componente Modal/Dialog completo usando shadcn/ui Dialog com variantes (confirmação, formulário, informação) e tokens do Design System para um módulo do ERP Conexão. |
| `google-maps-platform`         | Collection of skills for architecting and implementing production-ready code using Google Maps Platform APIs and SDKs for any map, place, address, geocoding, routing/ETA, nearby search, 3D / Street View / static map, marker clustering, custom styling, drawing, geofencing, heatmap, or environmental features — across Web, Android, iOS, and Web Services APIs. |
| `loop`                         | Especifica um loop de agente autônomo para tarefas iterativas com verificação e parada. |
| `rtk-memory`                   | Memória RTK (Real-Time Knowledge) para agentes - registra lições aprendidas durante execução. |
| `lean-ctx`                     | Estratégia LEAN-CTX para limitação de contexto - evita grep em diretórios grandes, lê assinaturas primeiro. |
| `caveman`                      | Modo comunicação ultra-curtas (Caveman Style) - respostas diretas, sem greetings ou explicações desnecessárias. |
| `pre-flight-check`             | Verificação prévia antes de implementações complexas. |
| `implementar-mapa-dark-premium`| Implementa mapa dark premium com tokens CSS e componentes para o módulo de presença. |
| `headroom`                     | Framework para componentes UI reutilizáveis em React com Tailwind CSS. |
| `modulo-completo`              | Workflow completo: Documentação → Design → Responsividade |
| `loop-modulo-completo`         | Roda pipeline iterativo de módulo até tudo passar |
