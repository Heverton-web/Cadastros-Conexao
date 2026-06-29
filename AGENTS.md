# ERP Conexão — AGENTS.md

**Language:** Brazilian Portuguese (pt-BR)

## Regras de UI

### NUNCA usar alertas nativos do navegador/Sistema

- **PROIBIDO**: `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO**: Usar componentes de modal da aplicação

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

## Regras de Arquitetura

### Multi-tenant por empresa_id
- Toda tabela criada DEVE ter coluna `empresa_id` (UUID, FK para `empresas.id`)
- RLS policies devem filtrar por `empresa_id`
- Super Admin filtra por empresa; Admin vê apenas sua empresa

### Módulos independentes
- Cada módulo é self-contained em `src/features/<modulo>/`
- A única camada de conexão entre módulos é o BANCO DE DADOS
- Excluir um módulo não deve afetar outros
- Tabelas do módulo devem ser criadas no mesmo banco (multi-tenant)

### Economia de tokens
- Sempre seguir diretrizes de `AGENTS.md` do projeto
- Sub-agentes escrevem arquivos direto, retornam só status
- Relatórios finais NUNCA são comprimidos

## Regras de Deploy

- Deploy somente quando usuário disser "deploy" ou "/deploy"
- Seguir skill `deploy-vps` para o fluxo completo
- Build deve passar antes do push

## Skills Disponíveis

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
| `planejar-modulo-repo-externo` | Analisar repo externo e planejar integração |
| `gerenciar-nav-items` | Gerenciar itens de navegação lateral |
