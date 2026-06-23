import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useMemo, useState, useEffect } from "react";
import { useMapasConsultants, useUpsertConsultant, useDeleteConsultant } from "~/features/mapas/hooks/useMapasData";
import { useAuth } from "~/lib/auth";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { ALL_UFS } from "~/features/mapas/constants/brazil-states";
import type { MapasConsultant } from "~/features/mapas/types";

export const mapasAdminConsultoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/admin/consultores",
  component: MapasAdminConsultoresPage,
});

const empty = (empresa_id: string): Partial<MapasConsultant> => ({
  empresa_id,
  name: "", state: "SP", registration: "", region: "", supervisor: "", pin_color: "#4169e1",
});

function MapasAdminConsultoresPage() {
  const { profile } = useAuth();
  const consQ = useMapasConsultants();
  const upsertM = useUpsertConsultant();
  const deleteM = useDeleteConsultant();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<MapasConsultant> | null>(null);
  const [toDelete, setToDelete] = useState<MapasConsultant | null>(null);

  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    if (!editing?.state) { setCities([]); return; }
    let active = true;
    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${editing.state}/municipios`)
      .then((res) => res.json())
      .then((data: Array<{ nome: string }>) => {
        if (!active) return;
        setCities(data.map((c) => c.nome).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => { if (active) setCities([]); })
      .finally(() => { if (active) setLoadingCities(false); });
    return () => { active = false; };
  }, [editing?.state]);

  const rows = useMemo(() => {
    const s = search.toLowerCase().trim();
    return (consQ.data ?? []).filter((r) =>
      !s || r.name.toLowerCase().includes(s) || (r.region ?? "").toLowerCase().includes(s) || (r.registration ?? "").toLowerCase().includes(s),
    );
  }, [consQ.data, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consultores</h1>
          <p className="text-sm text-muted-foreground">{consQ.data?.length ?? 0} cadastrados</p>
        </div>
        <Button onClick={() => profile?.empresa_id && setEditing(empty(profile.empresa_id))} className="gap-2">
          <Plus className="h-4 w-4" /> Novo consultor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, região ou matrícula…" className="pl-10" />
      </div>

      <div className="overflow-hidden rounded-xl border border-surface bg-card">
        <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_100px_140px_120px] gap-2 border-b border-surface bg-surface/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Nome</span><span>Matrícula</span><span>Região</span><span>UF</span><span>Supervisor</span><span className="text-right">Ações</span>
        </div>
        {consQ.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Nenhum registro encontrado.</p>
        ) : (
          <ul className="divide-y divide-surface">
            {rows.map((r) => (
              <li key={r.id} className="grid grid-cols-1 gap-1 px-4 py-3 md:grid-cols-[1fr_120px_140px_100px_140px_120px] md:items-center">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="size-3 shrink-0 rounded-full" style={{ background: r.pin_color ?? "#4169e1" }} />
                  <span className="truncate font-medium">{r.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{r.registration ?? "—"}</span>
                <span className="text-sm text-muted-foreground">{r.region ?? "—"}</span>
                <span className="text-sm">{r.state}</span>
                <span className="text-sm text-muted-foreground">{r.supervisor ?? "—"}</span>
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setToDelete(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Editar consultor" : "Novo consultor"}</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              editing && upsertM.mutate(editing);
            }}>
              <fieldset>
                <label className="text-sm font-medium">Nome *</label>
                <Input required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <fieldset>
                  <label className="text-sm font-medium">Matrícula</label>
                  <Input value={editing.registration ?? ""} onChange={(e) => setEditing({ ...editing, registration: e.target.value })} />
                </fieldset>
                <fieldset>
                  <label className="text-sm font-medium">Região</label>
                  <Input value={editing.region ?? ""} onChange={(e) => setEditing({ ...editing, region: e.target.value })} />
                </fieldset>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <fieldset>
                  <label className="text-sm font-medium">UF *</label>
                  <Select value={editing.state} onValueChange={(v) => setEditing({ ...editing, state: v, region: "" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {ALL_UFS.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </fieldset>
                <fieldset>
                  <label className="text-sm font-medium">Supervisor</label>
                  <Input value={editing.supervisor ?? ""} onChange={(e) => setEditing({ ...editing, supervisor: e.target.value })} />
                </fieldset>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
                <Button type="submit" disabled={upsertM.isPending}>{upsertM.isPending ? "Salvando…" : "Salvar"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir consultor?</AlertDialogTitle>
            <AlertDialogDescription>{toDelete?.name} será removido. Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && deleteM.mutate(toDelete.id)} className="bg-destructive">
              {deleteM.isPending ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
