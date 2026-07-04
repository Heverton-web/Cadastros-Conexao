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
import { Plus, Pencil, Trash2, Search, Loader2, Building2 } from "lucide-react";
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Distribuidores</h1>
          <p className="text-sm text-text-muted mt-1">
            {distQ.data?.length ?? 0} cadastrados
          </p>
        </div>
        <Button
          onClick={async () => {
            const eid = await getEmpresaId();
            if (eid) setEditing(empty(eid));
          }}
          className="flex items-center gap-2 rounded-xl bg-accent text-accent-fg px-5 py-2.5 text-sm font-semibold hover:bg-accent-hover transition-all duration-200 min-h-[44px] shadow-lg shadow-accent/20"
        >
          <Plus className="h-4 w-4" /> Novo distribuidor
        </Button>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, cidade ou código…"
          className="pl-11 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
        />
      </div>

      <div className="relative w-full overflow-x-auto rounded-xl border border-border">
        <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_100px_140px_120px] gap-2 bg-surface-hover/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <span>Nome</span>
          <span>Código</span>
          <span>Cidade</span>
          <span>UF</span>
          <span>Categoria</span>
          <span className="text-right">Ações</span>
        </div>
        {distQ.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <p className="text-sm text-text-muted">Carregando…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface mb-4">
              <Building2 className="w-8 h-8 text-text-muted/40" />
            </div>
            <p className="text-lg font-semibold text-text-main mb-1">
              Nenhum distribuidor encontrado
            </p>
            <p className="text-sm text-text-muted max-w-sm">
              {search
                ? "Ajuste os filtros para ver resultados."
                : "Comece adicionando um novo distribuidor."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {rows.map((r) => (
              <li
                key={r.id}
                className="group grid grid-cols-1 gap-1 px-4 py-3 md:grid-cols-[1fr_120px_140px_100px_140px_120px] md:items-center hover:bg-surface-hover/20 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: r.pin_color ?? "#4169e1" }}
                  />
                  <span className="truncate font-semibold text-text-main group-hover:text-accent transition-colors">{r.name}</span>
                </div>
                <span className="text-sm text-text-muted">
                  {r.code ?? "—"}
                </span>
                <span className="text-sm text-text-muted">
                  {r.city ?? "—"}
                </span>
                <span className="text-sm text-text-main">{r.state}</span>
                <span className="text-sm text-text-main">
                  {r.category === "EXCLUSIVE" ? "Exclusivo" : "Não-exclusivo"}
                </span>
                <div className="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost-edit"
                    onClick={() => setEditing(r)}
                    className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost-destructive"
                    onClick={() => setToDelete(r)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
        <DialogContent className="max-w-lg bg-card border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-0 overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent px-6 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-text-main tracking-tight">
                  {editing?.id ? "Editar Distribuidor" : "Novo Distribuidor"}
                </DialogTitle>
                <p className="text-sm text-text-muted mt-0.5">
                  Preencha os dados do distribuidor
                </p>
              </div>
            </div>
          </div>
          {editing && (
            <form
              className="space-y-5 px-6 pb-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (editing) {
                  const color =
                    editing.category === "EXCLUSIVE" ? "#4169e1" : "#333333";
                  upsertM.mutate({ ...editing, pin_color: color });
                }
              }}
            >
              {/* Seção: Dados Básicos */}
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  Dados Básicos
                </p>
                <div className="space-y-4">
                  <fieldset className="space-y-2">
                    <label className="block text-sm font-semibold text-text-main">
                      Nome *
                    </label>
                    <Input
                      required
                      value={editing.name ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      placeholder="Nome do distribuidor"
                      className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text-main font-medium transition-all duration-200 placeholder:text-text-muted hover:border-accent/30 focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    />
                  </fieldset>
                  <div className="grid grid-cols-2 gap-4">
                    <fieldset className="space-y-2">
                      <label className="block text-sm font-semibold text-text-main">
                        Código
                      </label>
                      <Input
                        value={editing.code ?? ""}
                        onChange={(e) =>
                          setEditing({ ...editing, code: e.target.value })
                        }
                        placeholder="Código interno"
                        className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text-main font-medium transition-all duration-200 placeholder:text-text-muted hover:border-accent/30 focus:ring-2 focus:ring-accent/40 focus:border-accent"
                      />
                    </fieldset>
                    <fieldset className="space-y-2">
                      <label className="block text-sm font-semibold text-text-main">
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
                        <SelectTrigger className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text-main font-medium focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200">
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
                </div>
              </div>

              {/* Seção: Localização */}
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  Localização
                </p>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <fieldset className="space-y-2">
                    <label className="block text-sm font-semibold text-text-main">
                      UF *
                    </label>
                    <Select
                      value={editing.state}
                      onValueChange={(v) =>
                        setEditing({ ...editing, state: v, city: "" })
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text-main font-medium focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200">
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
                  <fieldset className="space-y-2">
                    <label className="block text-sm font-semibold text-text-main">
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
                      className="h-12 rounded-xl border border-border bg-surface px-4 text-sm text-text-main font-medium transition-all duration-200 placeholder:text-text-muted hover:border-accent/30 focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    />
                    <datalist id="dist-cities-list">
                      {cities.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </fieldset>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                  className="rounded-xl px-6"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={upsertM.isPending}
                  className="rounded-xl px-6 bg-accent hover:bg-accent-hover text-accent-fg font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200"
                >
                  {upsertM.isPending ? "Salvando…" : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-0 overflow-hidden max-w-sm">
          {/* Header vermelho */}
          <div className="bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent px-6 pt-6 pb-4 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-bold text-text-main">
                  Excluir distribuidor?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-text-muted mt-0.5">
                  Esta ação não pode ser desfeita
                </AlertDialogDescription>
              </div>
            </div>
          </div>

          {/* Corpo */}
          <div className="px-6 py-4">
            <p className="text-sm text-text-muted">
              O distribuidor{" "}
              <span className="font-semibold text-text-main">
                {toDelete?.name}
              </span>{" "}
              será removido permanentemente.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end px-6 pb-6 pt-2 border-t border-border">
            <AlertDialogCancel className="rounded-xl px-6 border-border text-text-main hover:bg-surface-hover">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteM.mutate(toDelete.id)}
              className="rounded-xl px-6 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200"
            >
              {deleteM.isPending ? "Excluindo…" : "Excluir"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
