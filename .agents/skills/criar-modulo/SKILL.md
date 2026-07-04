# Skill: criar-modulo

## Descrição
Cria estrutura completa de um novo módulo no ERP Conexão.

## Trigger
- "criar módulo"
- "novo módulo"
- "adicionar módulo"

## Pré-requisitos
- Nome do módulo em kebab-case (ex: `relatorios-avancados`)
- Nome display em PascalCase (ex: `Relatórios Avançados`)

## Steps

### 1. Validar nome do módulo
- Formato kebab-case: `^[a-z0-9-]+$
- Não existir em `src/features/`
- Não estar em `src/registry/modules.ts`

### 2. Criar estrutura de diretórios
```
src/features/<modulo>/
├── module.ts
├── permissions.ts
├── index.ts
├── types.ts
├── components/
├── pages/
├── services/
├── hooks/
├── lib/
└── constants/
```

### 3. Gerar arquivos base
Copiar templates de `.agents/skills/criar-modulo/templates/` e substituir placeholders:

| Placeholder | Exemplo | Descrição |
|---|---|---|
| `{{MODULO_KEY}}` | `meu-modulo` | Nome kebab-case para chave de registro |
| `{{MODULO_PASCAL}}` | `MeuModulo` | Nome PascalCase para constantes e types |
| `{{MODULO_CAMEL}}` | `meuModulo` | Nome camelCase para variáveis de export |
| `{{MODULO_NOME}}` | `Meu Módulo` | Nome display (label) |
| `{{MODULO_DESCRICAO}}` | `Descrição do módulo` | Texto de descrição |
| `{{TABELA}}` | `minha_tabela` | Nome da tabela no Supabase |

**Arquivos gerados:**
- `module.ts` — definição do módulo (já inclui `events[]`, `abas` com "eventos", `setup()` com permissões + nav items + permission defaults)
- `permissions.ts` — lista de permissões tipadas
- `types.ts` — interfaces
- `index.ts` — barrel export
- `services/service.ts` — CRUD com `dispararEventoModulo()` embutido

### 4. Registrar módulo
- Adicionar em `src/registry/modules.ts`
- Chamar `registerModule(meuModuloModule)` no `main.tsx`

### 5. Verificar cobertura de eventos
- `module.ts` já vem com 3 eventos padrão (`entidade.criada`, `entidade.atualizada`, `entidade.excluida`)
- A aba `eventos` já está registrada no array `abas`
- O `service.ts` já dispara eventos nos métodos `criar()`, `atualizar()`, `excluir()`
- **Personalizar** os nomes dos eventos no module.ts para refletir o domínio real (ex: `lead.capturado` ao invés de `entidade.criada`)

### 6. Criar rotas
- Usar template de rota protegida em `src/routes/`

### 6.5. Criar configuração de Design System (automático)
- Executar skill `criar-design-modulo`
- Adicionar `hasDesignConfig: true, designRoute: "/<modulo>/design"` ao module.ts

### 7. Validar
```bash
npm run build   # deve passar sem erros
npm run lint    # deve passar
```

### 8. Commit
```bash
git add src/features/<modulo>/
git commit -m "feat(<modulo>): criar módulo <modulo>"
```

## Lembretes
- Eventos aparecem **automaticamente** na Central de Ações — não precisa modificar `CentralAcoesTab.tsx`
- Sempre usar `.catch(() => {})` (fire-and-forget) nos `dispararEventoModulo()`
- Sempre passar `empresa_id` no payload e como 4º argumento
- Se o módulo tiver CRUDs adicionais, adicionar `dispararEventoModulo()` nos services correspondentes
