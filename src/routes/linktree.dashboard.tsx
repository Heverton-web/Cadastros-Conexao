import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, ExternalLink, Pencil, QrCode, Trash2, Loader2, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
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
import { useAuth } from "~/core/auth";
import {
  listarColaboradores,
  toggleColaboradorStatus,
  deletarColaborador,
  buildCardUrl,
  downloadQrPng,
} from "~/features/linktree/index";
import { LinktreeColaboradorModal } from "~/features/linktree/components/LinktreeColaboradorModal";
import { LinktreeQrModal } from "~/features/linktree/components/LinktreeQrModal";
import type { LinktreeColaborador } from "~/features/linktree/types";

export const Route = createFileRoute("/linktree/dashboard")({
  component: LinktreeDashboardPage,
});

function LinktreeDashboardPage() {
  const { profile, permissoes } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<LinktreeColaborador[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LinktreeColaborador | null>(null);
  const [toDelete, setToDelete] = useState<LinktreeColaborador | null>(null);
  const [qrView, setQrView] = useState<LinktreeColaborador | null>(null);

  const can = (key: string) => permissoes?.[key] === true;

  useEffect(() => {
    if (!permissoes && !profile?.is_super_admin) return;
    if (!profile?.is_super_admin && !can("lt_ver_dashboard")) {
      toast.error("Voce nao tem permissao para acessar o Dashboard");
      navigate({ to: "/", replace: true });
    }
  }, [permissoes, profile, navigate]);

  async function load() {
    try {
      const data = await listarColaboradores(profile?.empresa_id ?? undefined);
      setRows(data);
    } catch (e: any) {
      toast.error("Erro ao carregar", { description: e.message });
    }
  }

  useEffect(() => {
    if (profile) load();
  }, [profile]);

  async function toggleStatus(c: LinktreeColaborador) {
    const next = c.status === "ativo" ? "inativo" : "ativo";
    try {
      await toggleColaboradorStatus(c.id, next);
      setRows((prev) => prev?.map((r) => (r.id === c.id ? { ...r, status: next } : r)) ?? null);
    } catch {
      toast.error("Falha ao atualizar status");
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deletarColaborador(toDelete.id);
      toast.success("Colaborador excluido");
      setToDelete(null);
      load();
    } catch (e: any) {
      toast.error("Falha ao excluir", { description: e.message });
    }
  }

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-text-main">Link Tree Corporativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os cartoes digitais e QR Codes dos colaboradores.
          </p>
        </div>
        {can("lt_criar_colaborador") && (
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Novo Colaborador</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        )}
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {rows === null ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Carregando...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Nenhum colaborador cadastrado ainda. Clique em <strong>Novo</strong> para comecar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="p-4">Colaborador</th>
                  <th className="hidden p-4 md:table-cell">Cargo</th>
                  <th className="hidden p-4 lg:table-cell">E-mail</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50">
                    <td className="p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-hover">
                          {c.foto_url ? (
                            <img src={c.foto_url} alt={c.nome} className="size-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold">{c.nome.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-text-main">{c.nome}</div>
                          <div className="truncate text-xs text-muted-foreground md:hidden">{c.cargo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-4 text-muted-foreground md:table-cell">{c.cargo}</td>
                    <td className="hidden p-4 text-muted-foreground lg:table-cell">{c.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={c.status === "ativo"} onCheckedChange={() => toggleStatus(c)}
                          disabled={!can("lt_toggle_status")} />
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: c.status === "ativo" ? "color-mix(in srgb, var(--color-success) 15%, transparent)" : "color-mix(in srgb, var(--color-warning) 15%, transparent)",
                            color: c.status === "ativo" ? "var(--color-success)" : "var(--color-warning)",
                          }}>
                          {c.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {can("lt_ver_link") && (
                          <Button variant="ghost" size="icon" title="Visualizar Link Tree" asChild>
                            <a href={buildCardUrl(c.id)} target="_blank" rel="noreferrer">
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        )}
                        {can("lt_editar_colaborador") && (
                          <Button variant="ghost" size="icon" title="Editar"
                            onClick={() => { setEditing(c); setModalOpen(true); }}>
                            <Pencil className="size-4" />
                          </Button>
                        )}
                        {can("lt_ver_qr") && (
                          <Button variant="ghost" size="icon" title="Visualizar QR Code"
                            onClick={() => setQrView(c)}>
                            <QrCode className="size-4" />
                          </Button>
                        )}
                        {can("lt_baixar_qr") && (
                          <Button variant="ghost" size="icon" title="Baixar QR Code"
                            onClick={() => downloadQrPng(c.id, c.nome)}>
                            <Download className="size-4" />
                          </Button>
                        )}
                        {can("lt_excluir_colaborador") && (
                          <Button variant="ghost" size="icon" title="Excluir"
                            className="text-error hover:bg-error/10 hover:text-error"
                            onClick={() => setToDelete(c)}>
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LinktreeColaboradorModal open={modalOpen} onOpenChange={setModalOpen} collaborator={editing} onSaved={load} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir colaborador?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao e irreversivel. O Link Tree de <strong>{toDelete?.nome}</strong> sera removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LinktreeQrModal open={!!qrView} onOpenChange={(o) => !o && setQrView(null)} collaborator={qrView} />
    </div>
  );
}
