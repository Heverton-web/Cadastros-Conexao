import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import {
  listarCadastros,
  deletarCadastro,
  atualizarCadastro,
  STATUS_LABEL,
  STATUS_COLOR,
  type Cadastro,
  type CadastroStatus,
} from "~/features/clientes";
import {
  Search,
  Trash2,
  Pencil,
  XCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { EmptyState } from "~/components/ui/empty-state";
import { Skeleton } from "~/components/ui/skeleton";

export const cadastrosClientesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/cadastros/clientes",
  component: ClientesPage,
});

function ClientesPage() {
  const navigate = useNavigate();
  const { profile, permissoes } = useAuth();
  const podeExcluir = permissoes?.excluir_cadastro === true;
  const [data, setData] = useState<
    (Cadastro & { profiles: { nome: string } | null })[]
  >([]);
  const [search, setSearch] = useState("");
  const [filtroConsultor, setFiltroConsultor] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Cadastro | null>(null);
  const [editForm, setEditForm] = useState({
    lead_nome: "",
    lead_email: "",
    lead_whatsapp: "",
    codigo_cliente: "",
    observacoes: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setEditForm({
        lead_nome: editTarget.lead_nome || "",
        lead_email: editTarget.lead_email || "",
        lead_whatsapp: editTarget.lead_whatsapp || "",
        codigo_cliente: editTarget.codigo_cliente || "",
        observacoes: editTarget.observacoes || "",
      });
    }
  }, [editTarget]);

  useEffect(() => {
    carregar();
  }, [profile]);

  async function carregar() {
    if (!profile) return;
    setLoading(true);
    try {
      const filters: { created_by?: string; status?: CadastroStatus } = {
        status: "aprovado",
      };
      if (permissoes?.ver_todos_cadastros !== true)
        filters.created_by = profile.id;
      const res = await listarCadastros(filters);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSave() {
    if (!editTarget) return;
    setEditSubmitting(true);
    try {
      await atualizarCadastro(editTarget.id, editForm);
      toast.success("Registro atualizado com sucesso");
      setEditTarget(null);
      carregar();
    } catch (e) {
      toast.error("Erro ao atualizar registro");
      console.error(e);
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletarCadastro(id);
      toast.success("Registro excluído com sucesso");
      setDeleteConfirm(null);
      carregar();
    } catch (e) {
      toast.error("Erro ao excluir registro");
      console.error(e);
    }
  }

  const consultores = [
    ...new Set(data.map((c) => c.profiles?.nome).filter(Boolean)),
  ].sort();

  const dataForConsultor = data.filter((c) => {
    if (filtroConsultor && (c.profiles?.nome || "") !== filtroConsultor)
      return false;
    return true;
  });

  const filtered = dataForConsultor.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.lead_nome || c.nome_temporario || "").toLowerCase().includes(q) ||
      (c.codigo_cliente || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Clientes
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {data.length}{" "}
            {data.length === 1 ? "cliente aprovado" : "clientes aprovados"}
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou código..."
            className="pl-11 h-12"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {permissoes?.ver_todos_cadastros && (
          <select
            value={filtroConsultor}
            onChange={(e) => setFiltroConsultor(e.target.value)}
            className="w-full lg:w-56 h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
          >
            <option value="">Todos os consultores</option>
            {consultores.map((nome) => (
              <option key={nome} value={nome!}>
                {nome}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-10 h-10 text-text-muted/30" />}
          title="Nenhum cliente encontrado"
          description="Tente ajustar seus filtros ou termos de busca."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onClick={() =>
                navigate({
                  to: "/cadastros/solicitacoes/$id",
                  params: { id: c.id },
                })
              }
              className="group flex flex-col gap-4 rounded-2xl bg-surface border border-border/60 p-5 text-left transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 active:scale-[0.99]"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Top row: avatar + name + actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition-colors">
                    <span className="text-sm font-bold text-green-400">
                      {(c.lead_nome ||
                        c.nome_temporario ||
                        "S")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-main truncate group-hover:text-accent transition-colors">
                      {c.lead_nome || c.nome_temporario || "Sem nome"}
                    </p>
                    {c.profiles?.nome && (
                      <p className="text-xs text-text-muted mt-0.5">
                        Por: {c.profiles.nome}
                      </p>
                    )}
                  </div>
                </div>
                {podeExcluir && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditTarget(c);
                      }}
                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(c.id);
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[c.status]}`}
                >
                  {STATUS_LABEL[c.status]}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  {c.tipo_pessoa && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/60">
                      {c.tipo_pessoa}
                    </span>
                  )}
                  {c.codigo_cliente && (
                    <span className="text-[10px] text-text-muted">
                      Cód: {c.codigo_cliente}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-text-muted/60">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Delete AlertDialog */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <div className="h-1 w-full bg-gradient-to-r from-error via-error to-error rounded-t-2xl" />
          <div className="p-6 sm:p-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-error/15 flex items-center justify-center">
                  <XCircle className="text-error" size={20} />
                </div>
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-text-muted leading-relaxed">
                Tem certeza que deseja excluir este cliente? Esta ação não pode
                ser desfeita e todos os dados associados serão removidos
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-error text-white hover:bg-error/90 shadow-lg shadow-error/25"
              >
                Excluir permanentemente
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary">
                Nome do Lead
              </label>
              <Input
                value={editForm.lead_nome}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    lead_nome: e.target.value,
                  }))
                }
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary">
                E-mail do Lead
              </label>
              <Input
                value={editForm.lead_email}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    lead_email: e.target.value,
                  }))
                }
                type="email"
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary">
                WhatsApp do Lead
              </label>
              <Input
                value={editForm.lead_whatsapp}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    lead_whatsapp: e.target.value,
                  }))
                }
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary">
                Código do Cliente
              </label>
              <Input
                value={editForm.codigo_cliente}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    codigo_cliente: e.target.value,
                  }))
                }
                placeholder="Código interno"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary">
                Observações
              </label>
              <textarea
                value={editForm.observacoes}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                rows={3}
                className="flex w-full rounded-xl border border-border bg-input-bg px-4 py-3 text-sm text-text-main font-medium shadow-sm transition-all duration-200 placeholder:text-text-muted/60 hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-accent resize-none"
                placeholder="Anotações sobre o cliente..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave} loading={editSubmitting}>
              {editSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
