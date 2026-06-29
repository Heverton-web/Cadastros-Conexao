import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Link as LinkIcon, Camera } from "lucide-react";
import { useCriarDespesa } from "../../hooks/useDespesas";
import { useTiposDespesaAtivos } from "../../hooks/useTiposDespesa";
import { usePeriodosAbertos } from "../../hooks/usePeriodos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const schema = z.object({
  periodo_id: z.string().min(1, "Período é obrigatório"),
  tipo_id: z.string().min(1, "Tipo é obrigatório"),
  data_despesa: z.string().min(1, "Data é obrigatória"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  descricao: z.string().optional(),
  comprovante_tipo: z.enum(["upload", "link"]),
  comprovante_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function NovaDespesaModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const criar = useCriarDespesa();
  const { data: tipos } = useTiposDespesaAtivos();
  const { data: periodos } = usePeriodosAbertos();
  const [file, setFile] = useState<File | null>(null);
  const [comprovanteMode, setComprovanteMode] = useState<"upload" | "link">("upload");

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      comprovante_tipo: "upload",
      comprovante_url: "",
      descricao: "",
    },
  });

  async function onSubmit(data: FormData) {
    await criar.mutateAsync({
      despesa: {
        tipo_id: data.tipo_id,
        data_despesa: data.data_despesa,
        valor: data.valor,
        descricao: data.descricao ?? "",
        comprovante_url: data.comprovante_url ?? "",
        comprovante_tipo: comprovanteMode,
      },
      file: comprovanteMode === "upload" ? file ?? undefined : undefined,
    });
    reset();
    setFile(null);
    setComprovanteMode("upload");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="periodo_id">Período *</Label>
            <select id="periodo_id" {...register("periodo_id")} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main">
              <option value="">Selecione o período</option>
              {periodos?.map((p) => (
                <option key={p.id} value={p.id}>
                  {new Date(p.data_inicio + "T00:00:00").toLocaleDateString("pt-BR")} — {new Date(p.data_fim + "T00:00:00").toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
            {errors.periodo_id && <p className="text-xs text-error">{errors.periodo_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_id">Tipo de Despesa *</Label>
            <select id="tipo_id" {...register("tipo_id")} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main">
              <option value="">Selecione o tipo</option>
              {tipos?.map((t) => (
                <option key={t.id} value={t.id}>{t.nome} — máx. {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(t.valor_maximo)}</option>
              ))}
            </select>
            {errors.tipo_id && <p className="text-xs text-error">{errors.tipo_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_despesa">Data da Despesa *</Label>
              <Input id="data_despesa" type="date" {...register("data_despesa")} />
              {errors.data_despesa && <p className="text-xs text-error">{errors.data_despesa.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input id="valor" type="number" step="0.01" min="0" placeholder="0.00" {...register("valor")} />
              {errors.valor && <p className="text-xs text-error">{errors.valor.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Input id="descricao" placeholder="Ex: Jantar com cliente XPTO" {...register("descricao")} />
          </div>

          <div className="space-y-3">
            <Label>Comprovante</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setComprovanteMode("upload"); setValue("comprovante_tipo", "upload"); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${comprovanteMode === "upload" ? "bg-accent/10 text-accent border border-accent/20" : "bg-input-bg text-text-muted border border-transparent"}`}
              >
                <Camera size={16} /> Upload
              </button>
              <button
                type="button"
                onClick={() => { setComprovanteMode("link"); setValue("comprovante_tipo", "link"); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${comprovanteMode === "link" ? "bg-accent/10 text-accent border border-accent/20" : "bg-input-bg text-text-muted border border-transparent"}`}
              >
                <LinkIcon size={16} /> Link
              </button>
            </div>

            {comprovanteMode === "upload" ? (
              <div>
                <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors">
                  <Upload size={24} className="text-text-muted" />
                  <span className="text-sm text-text-muted">{file ? file.name : "Clique para selecionar uma foto"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            ) : (
              <Input placeholder="https://exemplo.com/comprovante.jpg" {...register("comprovante_url")} />
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={criar.isPending}>
              {criar.isPending ? "Salvando..." : "Salvar Despesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
