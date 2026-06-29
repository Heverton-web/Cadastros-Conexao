import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/core/supabase";
import { listarCredenciais, criarCredencial, atualizarCredencial, toggleCredencial, deletarCredencial, listarCredenciaisPorEmpresa, type Credencial } from "~/features/credenciais";
import { getPermissoes, setPermissoes, getPermissoesPadrao, PERMISSOES_GROUPS, PERMISSOES_LABEL, PERMISSOES_DESC, type Permissoes } from "~/core/permissions";
import { Loader2, Plus, UserPlus, ToggleLeft, ToggleRight, Shield, ShieldCheck, ShieldX, X, Save, Settings, Trash2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";

export const credenciaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/credenciais",
  component: CredenciaisPage,
});

function CredenciaisPage() {
  const { profile, permissoes } = useAuth();
  const isSuper = profile?.is_super_admin === true;
  const minhaEmpresaId = profile?.empresa_id as string | undefined;
  const podeVer = permissoes?.gerenciar_credenciais === true || isSuper;
  const podeAdmin = permissoes?.gerenciar_credenciais_admin === true || isSuper;

  const [credenciais, setCredenciais] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);

  // Super Admin: filtros de empresa
  const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>("todas");

  // Create/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome_completo: "", email_corporativo: "", whatsapp_corporativo: "", departamento: "" });
  const [submitting, setSubmitting] = useState(false);

  // Permissions modal
  const [permCredencial, setPermCredencial] = useState<Credencial | null>(null);
  const [editPerms, setEditPerms] = useState<Permissoes | null>(null);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [savingPerms, setSavingPerms] = useState(false);

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState<Credencial | null>(null);

  useEffect(() => {
    if (podeVer) {
      carregar();
      if (isSuper) {
        carregarEmpresas();
      }
    } else {
      setLoading(false);
    }
  }, [podeVer, selectedEmpresaId]);

  async function carregarEmpresas() {
    try {
      const { data } = await supabase
        .from("empresas")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome");
      setEmpresas(data ?? []);
    } catch (e) {
      console.error("Erro ao carregar empresas:", e);
    }
  }

  async function carregar() {
    setLoading(true);
    try {
      if (isSuper) {
        if (selectedEmpresaId === "todas") {
          setCredenciais(await listarCredenciais());
        } else {
          setCredenciais(await listarCredenciaisPorEmpresa(selectedEmpresaId));
        }
      } else if (minhaEmpresaId) {
        setCredenciais(await listarCredenciaisPorEmpresa(minhaEmpresaId));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function abrirNova() {
    setEditId(null);
    setForm({ nome_completo: "", email_corporativo: "", whatsapp_corporativo: "", departamento: "" });
    setShowForm(true);
  }

  function abrirEditar(c: Credencial) {
    setEditId(c.id);
    setForm({ nome_completo: c.nome_completo, email_corporativo: c.email_corporativo, whatsapp_corporativo: c.whatsapp_corporativo || "", departamento: c.departamento || "" });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.nome_completo || !form.email_corporativo) return;
    setSubmitting(true);
    try {
      if (editId) {
        await atualizarCredencial(editId, { nome_completo: form.nome_completo, email_corporativo: form.email_corporativo, whatsapp_corporativo: form.whatsapp_corporativo || undefined, departamento: form.departamento || undefined });
        toast.success("Credencial atualizada!");
      } else {
        const empresaIdParaCriar = isSuper ? (selectedEmpresaId === "todas" ? null : selectedEmpresaId) : minhaEmpresaId;
        await criarCredencial({ ...form, empresa_id: empresaIdParaCriar });
        toast.success("Credencial criada!");
      }
      setShowForm(false);
      carregar();
    } catch (e) { console.error("Erro ao salvar credencial:", e); toast.error("Erro ao salvar"); }
    setSubmitting(false);
  }

  async function handleToggle(c: Credencial) {
    try {
      await toggleCredencial(c.id, !c.ativo);
      carregar();
    } catch (e) { console.error("Erro ao toggle credencial:", e); toast.error("Erro"); }
  }

  async function handleDelete(id: string) {
    try {
      await deletarCredencial(id);
      toast.success("Removida");
      carregar();
    } catch (e) {
      console.error("Erro ao deletar credencial:", e);
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast.error(msg);
    }
  }

  async function abrirPermissoes(c: Credencial) {
    setPermCredencial(c);
    setLoadingPerms(true);
    try {
      const { data: prof } = await supabase.from("profiles").select("id, ambiente, is_super_admin").eq("email", c.email_corporativo).maybeSingle();
      if (prof) {
        const perms = await getPermissoes(prof.id, prof.is_super_admin);
        setEditPerms(perms || getPermissoesPadrao(prof.ambiente as any));
      } else {
        setEditPerms(null);
      }
    } catch (e) { console.error("Erro ao carregar permissões:", e); toast.error("Erro ao carregar permissões"); }
    setLoadingPerms(false);
  }

  function togglePerm(key: keyof Permissoes) {
    if (!editPerms) return;
    setEditPerms(p => p ? { ...p, [key]: !p[key] } : p);
  }

  async function salvarPermissoes() {
    if (!permCredencial || !editPerms) return;
    setSavingPerms(true);
    try {
      const { data: prof } = await supabase.from("profiles").select("id").eq("email", permCredencial.email_corporativo).maybeSingle();
      if (prof) {
        await setPermissoes(prof.id, editPerms);
        toast.success("Permissões salvas!");
      }
      setPermCredencial(null);
      setEditPerms(null);
    } catch (e) { console.error("Erro ao salvar permissões:", e); toast.error("Erro"); }
    setSavingPerms(false);
  }

  if (!podeVer)
    return <div className="flex flex-col items-center justify-center gap-3 p-8 pt-20"><Shield size={40} className="text-text-muted" /><p className="text-sm text-text-muted">Acesso restrito</p></div>;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-main">Credenciais de Acesso</h1>
        {podeAdmin && (
          <button onClick={abrirNova} className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white">
            <Plus size={16} /> Nova
          </button>
        )}
      </div>

      {isSuper && (
        <div className="flex items-center gap-2.5 rounded-xl bg-card p-4 shadow-lg border border-border-subtle/50">
          <Building2 size={16} className="text-accent shrink-0" />
          <span className="text-xs font-semibold text-text-muted">Filtrar por Empresa:</span>
          <select 
            value={selectedEmpresaId} 
            onChange={(e) => setSelectedEmpresaId(e.target.value)}
            className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-xs text-text-main outline-none focus:border-accent min-h-[36px]"
          >
            <option value="todas">Todas as Empresas</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : credenciais.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">Nenhuma credencial cadastrada</p>
      ) : (
        <div className="flex flex-col gap-2">
          {credenciais.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <UserPlus size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{c.nome_completo}</p>
                <p className="text-[11px] text-text-muted truncate">{c.email_corporativo}</p>
                {c.departamento && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent mt-1 inline-block">{c.departamento}</span>}
              </div>
              {podeAdmin && (
                <>
                  <button onClick={() => abrirPermissoes(c)} className="rounded-lg p-2 text-text-muted hover:text-accent" title="Permissões">
                    <Shield size={16} />
                  </button>
                  <button onClick={() => abrirEditar(c)} className="rounded-lg p-2 text-text-muted hover:text-text-main" title="Editar">
                    <Settings size={16} />
                  </button>
                </>
              )}
              <button onClick={() => handleToggle(c)} className={c.ativo ? "text-green-400" : "text-text-muted"}>
                {c.ativo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
              {podeAdmin && (
                <button onClick={() => setDeleteTarget(c)} className="text-text-muted hover:text-red-400" title="Remover">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-main">{editId ? "Editar" : "Nova"} Credencial</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <input value={form.nome_completo} onChange={(e) => setForm(p => ({ ...p, nome_completo: e.target.value }))} placeholder="Nome Completo"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.email_corporativo} onChange={(e) => setForm(p => ({ ...p, email_corporativo: e.target.value }))} placeholder="Email Corporativo" type="email"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.whatsapp_corporativo} onChange={(e) => setForm(p => ({ ...p, whatsapp_corporativo: e.target.value }))} placeholder="WhatsApp (opcional)"
              className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <select value={form.departamento} onChange={(e) => setForm(p => ({ ...p, departamento: e.target.value }))}
              className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              <option value="">Departamento</option>
              {["Vendas", "Administrativo", "Financeiro", "TI"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={handleSubmit} disabled={!form.nome_completo || !form.email_corporativo || submitting}
                className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {permCredencial && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl mt-8 mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-text-main truncate">{permCredencial.nome_completo}</h2>
              <button onClick={() => { setPermCredencial(null); setEditPerms(null); }} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <p className="text-xs text-text-muted mb-1">{permCredencial.email_corporativo}</p>

            {loadingPerms ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
            ) : !editPerms ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldX size={36} className="text-yellow-400 mb-2" />
                <p className="text-sm font-semibold text-text-main">Usuário não registrado</p>
                <p className="text-[11px] text-text-muted mt-1">O e-mail ainda não realizou o primeiro acesso.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-4">
                  <button onClick={() => setEditPerms(getPermissoesPadrao("cadastro"))} className="ml-auto text-[10px] text-accent underline">Restaurar padrões</button>
                </div>
                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {PERMISSOES_GROUPS.map((group) => (
                    <div key={group.label} className="rounded-xl bg-input-bg p-3">
                      <p className="text-xs font-bold text-text-main mb-2">{group.label}</p>
                      <div className="flex flex-col gap-2">
                        {group.keys.map((key) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer group">
                            <button onClick={() => togglePerm(key)}
                              className={cn("shrink-0 rounded-lg p-1.5 transition", editPerms[key] ? 'bg-accent text-white' : 'bg-bg-dark text-text-muted group-hover:text-text-main')}>
                              {editPerms[key] ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-medium", editPerms[key] ? 'text-text-main' : 'text-text-muted')}>{PERMISSOES_LABEL[key]}</p>
                              <p className="text-[9px] text-text-muted">{PERMISSOES_DESC[key]}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setPermCredencial(null); setEditPerms(null); }} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
                  <button onClick={salvarPermissoes} disabled={savingPerms}
                    className="flex items-center justify-center gap-1 flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">
                    {savingPerms ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h2 className="text-base font-bold text-text-main mb-2">Remover Credencial</h2>
            <p className="text-sm text-text-muted mb-1">Tem certeza que deseja remover <strong className="text-text-main">{deleteTarget.nome_completo}</strong>?</p>
            <p className="text-xs text-text-muted mb-5">{deleteTarget.email_corporativo}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={async () => {
                await handleDelete(deleteTarget.id);
                setDeleteTarget(null);
              }} className="flex-1 rounded-xl bg-error py-3 text-sm font-medium text-white">Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
