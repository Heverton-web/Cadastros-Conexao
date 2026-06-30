import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useMemo, useState, useEffect } from "react";
import {
  useMapasDistributors,
  useUpsertDistributor,
  useDeleteDistributor,
} from "~/features/mapas/hooks/useMapasData";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ALL_UFS } from "~/features/mapas/constants/brazil-states";
import type { MapasDistributor } from "~/features/mapas/types";

export const mapasAdminDistribuidoresRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/gestao/distribuidores",
  component: MapasAdminDistribuidoresPage,
});

const empty = (empresa_id: string): Partial<MapasDistributor> => ({
  empresa_id,
  name: "",
  state: "SP",
  category: "EXCLUSIVE",
  code: "",
  city: "",
  pin_color: "#4169e1",
});

function MapasAdminDistribuidoresPage() {
  const { profile } = useAuth();
  const distQ = useMapasDistributors();
  const upsertM = useUpsertDistributor(() => setEditing(null));
  const deleteM = useDeleteDistributor();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<MapasDistributor> | null>(
    null,
  );
  const [toDelete, setToDelete] = useState<MapasDistributor | null>(null);

  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  async function getEmpresaId(): Promise<string | null> {
    if (profile?.empresa_id) return profile.empresa_id;
    const { data } = await supabase
      .from("empresas")
      .select("id")
      .limit(1)
      .single();
    return data?.id ?? null;
  }

  useEffect(() => {
    if (!editing?.state) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCities(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${editing.state}/municipios`,
    )
      .then((res) => res.json())
      .then((data: Array<{ nome: string }>) => {
        if (!active) return;
        setCities(data.map((c) => c.nome).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {
        if (active) setCities([]);
      })
      .finally(() => {
        if (active) setLoadingCities(false);
      });
    return () => {
      active = false;
    };
  }, [editing?.state]);

  const rows = useMemo(() => {
    const s = search.toLowerCase().trim();
    return (distQ.data ?? []).filter(
      (r) =>
        !s ||
        r.name.toLowerCase().includes(s) ||
        (r.city ?? "").toLowerCase().includes(s) ||
        (r.code ?? "").toLowerCase().includes(s),
    );
  }, [distQ.data, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Distribuidores</h1>
          <p className="text-sm text-muted-foreground">
            {distQ.data?.length ?? 0} cadastrados
          </p>
        </div>
        <Button
          onClick={async () => {
            const eid = await getEmpresaId();
            if (eid) setEditing(empty(eid));
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Novo distribuidor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, cidade ou código…"
          className="pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-surface bg-card">
        <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_100px_140px_120px] gap-2 border-b border-surface bg-surface/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Nome</span>
          <span>Código</span>
          <span>Cidade</span>
          <span>UF</span>
          <span>Categoria</span>
          <span className="text-right">Ações</span>
        </div>
        {distQ.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado.
          </p>
        ) : (
          <ul className="divide-y divide-surface">
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-1 gap-1 px-4 py-3 md:grid-cols-[1fr_120px_140px_100px_140px_120px] md:items-center"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: r.pin_color ?? "#4169e1" }}
                  />
                  <span className="truncate font-medium">{r.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {r.code ?? "—"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {r.city ?? "—"}
                </span>
                <span className="text-sm">{r.state}</span>
                <span className="text-sm">
                  {r.category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}
                </span>
                <div className="flex justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost-edit"
                    onClick={() => setEditing(r)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost-destructive"
                    onClick={() => setToDelete(r)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Plus className="h-5 w-5 text-accent" />
              </div>
              <div>
                <DialogTitle>
                  {editing?.id ? "Editar Distribuidor" : "Novo Distribuidor"}
                </DialogTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  Preencha os dados do distribuidor
                </p>
              </div>
            </div>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-4 px-6 pb-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (editing) {
                  const color =
                    editing.category === "EXCLUSIVE" ? "#4169e1" : "#333333";
                  upsertM.mutate({ ...editing, pin_color: color });
                }
              }}
            >
              <fieldset className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Nome *
                </label>
                <Input
                  required
                  value={editing.name ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="Nome do distribuidor"
                />
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <fieldset className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Código
                  </label>
                  <Input
                    value={editing.code ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, code: e.target.value })
                    }
                    placeholder="Código interno"
                  />
                </fieldset>
                <fieldset className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Categoria *
                  </label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) =>
                      setEditing({
                        ...editing,
                        category: v as MapasDistributor["category"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCLUSIVE">Exclusivo</SelectItem>
                      <SelectItem value="NON_EXCLUSIVE">
                        Não-exclusivo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </fieldset>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-3">
                <fieldset className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    UF *
                  </label>
                  <Select
                    value={editing.state}
                    onValueChange={(v) =>
                      setEditing({ ...editing, state: v, city: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {ALL_UFS.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </fieldset>
                <fieldset className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Cidade
                  </label>
                  <Input
                    list="dist-cities-list"
                    value={editing.city ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, city: e.target.value })
                    }
                    placeholder={
                      loadingCities ? "Carregando..." : "Digite a cidade..."
                    }
                  />
                  <datalist id="dist-cities-list">
                    {cities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </fieldset>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={upsertM.isPending}>
                  {upsertM.isPending ? "Salvando…" : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir distribuidor?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.name} será removido. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteM.mutate(toDelete.id)}
              className="bg-destructive"
            >
              {deleteM.isPending ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
