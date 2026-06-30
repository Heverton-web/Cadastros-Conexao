import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  useCriarTipoDespesa,
  useAtualizarTipoDespesa,
} from "../../hooks/useTiposDespesa";
import type { DespesaTipo } from "../../types";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor_maximo: z.coerce.number().positive("Valor deve ser positivo"),
});

type FormData = z.infer<typeof schema>;

export function TipoDespesaForm({
  open,
  onOpenChange,
  editando,
  empresaId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editando: DespesaTipo | null;
  empresaId?: string;
}) {
  const criar = useCriarTipoDespesa(empresaId);
  const atualizar = useAtualizarTipoDespesa(empresaId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", valor_maximo: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        editando
          ? { nome: editando.nome, valor_maximo: editando.valor_maximo }
          : { nome: "", valor_maximo: 0 },
      );
    }
  }, [open, editando, reset]);

  async function onSubmit(data: FormData) {
    if (editando) {
      await atualizar.mutateAsync({ id: editando.id, updates: data });
    } else {
      await criar.mutateAsync(data);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar Tipo de Despesa" : "Novo Tipo de Despesa"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex: Jantar, Almoço, Uber..."
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-xs text-error">{errors.nome.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor_maximo">Valor Máximo de Reembolso (R$)</Label>
            <Input
              id="valor_maximo"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("valor_maximo")}
            />
            {errors.valor_maximo && (
              <p className="text-xs text-error">
                {errors.valor_maximo.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={criar.isPending || atualizar.isPending}
            >
              {criar.isPending || atualizar.isPending
                ? "Salvando..."
                : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
