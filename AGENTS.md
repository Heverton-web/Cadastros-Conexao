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

| Tool | Uso |
|------|-----|
| `supabase_execute_sql` | SQL arbitrário (SELECT, DDL, DML) |
| `supabase_list_tables` | Lista tabelas de um schema |
| `supabase_describe_table` | Descreve colunas, constraints, RLS |
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
- **Caveman Style**: Respostas ultra-curtas. Comunicação mínima sobre código, código robusto (DRY, Clean Code).
- **Sem `rewrite_file`**: Usar edição cirúrgica (substituição de linhas específicas).
- **Lazy Reading**: Ler arquivos só quando o plano de ação estiver definido.
- **Context Clearing**: Sugerir `/clear` ao finalizar etapas longas.

---

## Deploy e Skills

### Deploy
- Só executar quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
- Usar skill `deploy-vps`. Build deve passar antes do push.

### Bubble Reverse Engineering
- Pipeline completo via `/bubble-tech-lead` + skills em `.agents/skills/`.

### Skills Disponíveis

| Skill | Descrição |
|-------|-----------|
| `criar-modulo` | Estrutura completa de novo módulo |
| `criar-rota` | Rota protegida com AuthGuard |
| `gerar-crud` | Operações CRUD com React Query |
| `criar-componente-modulo` | Componente React com CVA |
| `adicionar-permissao` | Permissão no sistema RBAC |
| `validar-modulo` | Verificar integridade do módulo |
| `documentar-modulo` | Gerar documentação do módulo |
| `deploy-vps` | Deploy via Docker + VPS |
| `planejar-modulo-repo-externo`| Analisar repo externo e planejar integração |
| `gerenciar-nav-items` | Gerar/gerenciar itens de navegação lateral |
