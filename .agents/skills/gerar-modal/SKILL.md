---
name: gerar-modal
description: Gera componente Modal/Dialog completo usando shadcn/ui Dialog com variantes (confirmação, formulário, informação) e tokens do Design System para um módulo do ERP Conexão.
triggers:
  - "gerar modal"
  - "criar modal"
  - "novo modal"
  - "criar dialog"
---

# Skill: gerar-modal

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
- Variante do modal: `confirm` | `form` | `info`

## Steps

### 1. Coletar informações
- Nome do modal (PascalCase, ex: `ModalConfirmarDelete`)
- Módulo alvo
- Variante: `confirm` | `form` | `info`
- Props necessárias

### 2. Gerar componente
```typescript
// src/features/<modulo>/components/<Modal>.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  // outras props
}

export function <Modal>({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="border border-[var(--color-border)]"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--comp-modal-radius)",
          boxShadow: "var(--comp-modal-shadow)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--color-text-main)" }}>Título</DialogTitle>
        </DialogHeader>
        {/* conteúdo */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onClose}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 3. Para variante `confirm`
- Incluir ícone de alerta
- Botão de confirmação vermelho (destructive)

### 4. Para variante `form`
- Integrar com skill `gerar-formulario`
- Submit dentro do DialogFooter

### 5. Exportar e commitar
```bash
git add src/features/<modulo>/components/<Modal>.tsx
git commit -m "feat(<modulo>): gerar modal <Modal>"
```
