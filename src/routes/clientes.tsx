import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { listarCadastros, deletarCadastro, atualizarCadastro, STATUS_LABEL, STATUS_COLOR, type Cadastro, type CadastroStatus } from "~/lib/clientes";
import { getDocumentosStatusMap, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type DocStatus } from "~/lib/documentos";
import { Search, Loader2, ArrowRight, Trash2, Pencil, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export const clientesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/clientes",
  component: ClientesPage,
});

function ClientesPage() {
  const navigate = useNavigate();
  const { profile, permissoes } = useAuth();
  const podeExcluir = permissoes?.excluir_cadastro === true;
  const [data, setData] = useState<(Cadastro & { profiles: { nome: string } | null })[]>([]);
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<CadastroStatus | "">("");
  const [filtroConsultor, setFiltroConsultor] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Cadastro | null>(null);
  const [editForm, setEditForm] = useState({ lead_nome: "", lead_email: "", lead_whatsapp: "", codigo_cliente: "", observacoes: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

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
    if (profile?.ambiente === "consultor") {
      navigate({ to: "/consultor/clientes", replace: true });
      return;
    }
    carregar();
  }, [profile]);

  async function carregar() {
    if (!profile) return;
    setLoading(true);
    try {
      const filters: { created_by?: string } = {};
      if (permissoes?.ver_todos_cadastros !== true) filters.created_by = profile.id;
      const res = await listarCadastros(Object.keys(filters).length ? filters : undefined);
      setData(res);
      const status = await getDocumentosStatusMap(res.map((c) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })));
      setDocsStatus(status);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleEditSave() {
    if (!editTarget) return;
    setEditSubmitting(true);
    try {
      await atualizarCadastro(editTarget.id, editForm);
      toast.success("Registro atualizado");
      setEditTarget(null);
      carregar();
    } catch (e) {
      toast.error("Erro ao atualizar");
      console.error(e);
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletarCadastro(id);
      toast.success("Registro excluído");
      setDeleteConfirm(null);
      carregar();
    } catch (e) {
      toast.error("Erro ao excluir");
      console.error(e);
    }
  }

  const consultores = [...new Set(data.map(c => c.profiles?.nome).filter(Boolean))].sort();
  
  const dataForConsultor = data.filter((c) => {
    if (filtroConsultor && (c.profiles?.nome || "") !== filtroConsultor) return false;
    return true;
  });

  const getCount = (s: CadastroStatus | "") => {
    if (!s) return dataForConsultor.length;
    return dataForConsultor.filter(c => c.status === s).length;
  };

  const filtered = dataForConsultor.filter((c) => {
    if (filtroStatus && c.status !== filtroStatus) return false;
    if (!search) return true; const q = search.toLowerCase();
    return (c.lead_nome || c.nome_temporario || "").toLowerCase().includes(q) ||
      (c.codigo_cliente || "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="text-lg font-bold text-text-main">Clientes</h1>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar clientes..." className="w-full rounded-lg border border-input-border bg-input-bg py-3 pl-10 pr-4 text-sm text-text-main outline-none focus:border-accent focus:ring-2 focus:ring-ring min-h-[44px]" />
        </div>
      </div>
      {permissoes?.ver_todos_cadastros && (
        <>
          <div className="flex gap-2">
            <select value={filtroConsultor} onChange={(e) => setFiltroConsultor(e.target.value)} className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              <option value="">Todos os consultores</option>
              {consultores.map(nome => <option key={nome} value={nome!}>{nome}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => setFiltroStatus("")} 
              className={`flex h-10 flex-col items-center justify-center rounded-lg px-1 transition ${filtroStatus === "" ? "bg-accent text-white shadow-md" : "bg-card text-text-muted hover:text-text-main border border-input-border"}`}
            >
              <span className="w-full truncate text-center text-[10px] leading-tight">Todos</span>
              <span className="text-[11px] font-bold leading-none mt-0.5">{getCount("")}</span>
            </button>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <button 
                key={k} 
                onClick={() => setFiltroStatus(k as CadastroStatus)} 
                className={`flex h-10 flex-col items-center justify-center rounded-lg px-1 transition ${filtroStatus === k ? "bg-accent text-white shadow-md" : "bg-card text-text-muted hover:text-text-main border border-input-border"}`}
              >
                <span className="w-full truncate text-center text-[10px] leading-tight">{v}</span>
                <span className="text-[11px] font-bold leading-none mt-0.5">{getCount(k as CadastroStatus)}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">Nenhum cliente encontrado</p>
      ) : (
          <div className="flex flex-col gap-2">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}
              className="flex flex-col gap-2 rounded-xl bg-card p-4 text-left shadow-lg transition active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-main text-sm">{c.lead_nome || c.nome_temporario || "Sem nome"}</span>
                <div className="flex items-center gap-1">
                  {podeExcluir && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setEditTarget(c); }} className="rounded-lg p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 transition">
                        <Pencil size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(c.id); }} className="rounded-lg p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 transition">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <ArrowRight size={16} className="text-text-muted shrink-0" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLOR[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                {c.status !== "aprovado" && (
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${DOC_STATUS_COLOR[docsStatus[c.id]]}`}>
                    {DOC_STATUS_LABEL[docsStatus[c.id]]}
                  </span>
                )}
                {c.tipo_pessoa && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent">{c.tipo_pessoa}</span>}
                {c.codigo_cliente && <span className="text-[10px] text-text-muted">Cód: {c.codigo_cliente}</span>}
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span>{c.profiles?.nome || "—"}</span>
                <span>{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl text-center">
            <div className="mb-3 flex justify-center"><XCircle size={40} className="text-red-400" /></div>
            <h2 className="text-base font-bold text-text-main mb-2">Confirmar exclusão</h2>
            <p className="text-sm text-text-muted mb-5">Tem certeza? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-main">Editar Cliente</h2>
              <button onClick={() => setEditTarget(null)} className="text-text-muted hover:text-text-main"><XCircle size={20} /></button>
            </div>
            <label className="mb-1 block text-xs font-medium text-text-muted">Nome do Lead</label>
            <input value={editForm.lead_nome} onChange={(e) => setEditForm(prev => ({ ...prev, lead_nome: e.target.value }))} className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <label className="mb-1 block text-xs font-medium text-text-muted">E-mail do Lead</label>
            <input value={editForm.lead_email} onChange={(e) => setEditForm(prev => ({ ...prev, lead_email: e.target.value }))} type="email" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <label className="mb-1 block text-xs font-medium text-text-muted">WhatsApp do Lead</label>
            <input value={editForm.lead_whatsapp} onChange={(e) => setEditForm(prev => ({ ...prev, lead_whatsapp: e.target.value }))} className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <label className="mb-1 block text-xs font-medium text-text-muted">Código do Cliente</label>
            <input value={editForm.codigo_cliente} onChange={(e) => setEditForm(prev => ({ ...prev, codigo_cliente: e.target.value }))} className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <label className="mb-1 block text-xs font-medium text-text-muted">Observações</label>
            <textarea value={editForm.observacoes} onChange={(e) => setEditForm(prev => ({ ...prev, observacoes: e.target.value }))} rows={3} className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setEditTarget(null)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={handleEditSave} disabled={editSubmitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">{editSubmitting ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
