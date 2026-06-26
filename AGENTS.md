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
