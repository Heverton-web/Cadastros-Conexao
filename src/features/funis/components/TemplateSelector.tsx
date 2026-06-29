import { useState } from "react";
import { FileText, Plus, Layout } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useTemplates } from "../hooks/useTemplates";
import type { Template } from "../types";

type TemplateSelectorProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (template: Template | null) => void;
};

export function TemplateSelector({ open, onClose, onSelect }: TemplateSelectorProps) {
  const { data: templates = [], isLoading } = useTemplates();
  const [selected, setSelected] = useState<Template | null>(null);

  const handleSelect = () => {
    onSelect(selected);
    onClose();
  };

  const handleFromScratch = () => {
    onSelect(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar funil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <button
            onClick={handleFromScratch}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selected === null ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Começar do zero</p>
                <p className="text-xs text-muted-foreground">Criar funil com colunas personalizadas</p>
              </div>
            </div>
          </button>

          {isLoading ? (
            <div className="text-center py-6 text-xs text-muted-foreground">Carregando templates...</div>
          ) : templates.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelected(template)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selected?.id === template.id ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{template.nome}</p>
                        {template.is_public && <Badge variant="secondary" className="text-[9px]">Público</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{template.descricao || "Sem descrição"}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {template.colunas?.length ?? 0} colunas
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {template.tarefas?.length ?? 0} tarefas
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Layout className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum template disponível.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSelect}>
            {selected ? `Usar "${selected.nome}"` : "Criar do zero"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
