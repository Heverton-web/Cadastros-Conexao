# Regras de UI — ERP Odonto

## NUNCA usar alertas nativos do navegador/Sistema

- **PROIBIDO**: `window.confirm()`, `window.alert()`, `window.prompt()`
- **OBRIGATÓRIO**: Usar componentes de modal da aplicação (`AlertDialog` ou `Dialog`)

## Componentes de modal disponíveis

- `AlertDialog` de `~/components/ui/alert-dialog` — para confirmações de exclusão e ações destrutivas
- `Dialog` de `~/components/ui/dialog` — para modais de conteúdo genérico

## Padrão para exclusões

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

## Padrão de scroll em Dialogs (OBRIGATÓRIO)

**TODOS os `DialogContent` com formulários ou conteúdo extenso DEVEM ter scroll funcional.** Sem isso, o conteúdo fica cortado e o usuário não consegue acessar todos os campos.

**Padrão obrigatório:**

```tsx
// DialogContent: flex-col + max-h + overflow-hidden
<DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white flex flex-col max-h-[85vh] overflow-hidden">

  {/* Header: shrink-0 para não encolher */}
  <DialogHeader className="shrink-0">
    <DialogTitle>Título</DialogTitle>
    <DialogDescription>Descrição</DialogDescription>
  </DialogHeader>

  {/* Body: overflow-y-auto + flex-1 + min-h-0 → scrolla quando conteúdo é maior que max-h */}
  <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
    {/* campos do formulário */}
  </div>

  {/* Footer: shrink-0 para não encolher */}
  <DialogFooter className="shrink-0">
    <button>Salvar</button>
  </DialogFooter>
</DialogContent>
```

**Checklist ao criar/editar Dialog:**
- [ ] `DialogContent` tem `flex flex-col max-h-[85vh] overflow-hidden`
- [ ] `DialogHeader` tem `shrink-0`
- [ ] Body div tem `overflow-y-auto flex-1 min-h-0`
- [ ] `DialogFooter` tem `shrink-0`
- [ ] Testar: conteúdo maior que viewport → scroll deve funcionar
