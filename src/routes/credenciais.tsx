import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { listarCredenciais, criarCredencial, toggleCredencial, type Credencial } from "~/lib/credenciais";
import { dispararWebhooks } from "~/lib/webhooks";
import { Loader2, Plus, UserPlus, ToggleLeft, ToggleRight, Shield, X } from "lucide-react";

export const credenciaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/credenciais",
  component: CredenciaisPage,
});

function CredenciaisPage() {
  const { permissoes } = useAuth();
  const [credenciais, setCredenciais] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome_completo: "", email_corporativo: "", whatsapp_corporativo: "", departamento: "" });
  const [submitting, setSubmitting] = useState(false);
  const podeVer = permissoes?.gerenciar_credenciais === true;
  const podeAdmin = permissoes?.gerenciar_credenciais_admin === true;

  useEffect(() => { if (podeVer) carregar(); else setLoading(false); }, [podeVer]);

  async function carregar() {
    setLoading(true);
    try { setCredenciais(await listarCredenciais()); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await criarCredencial(form);
      try {
        await dispararWebhooks("criacao_credencial", {
          nome: form.nome_completo,
          email: form.email_corporativo,
          whatsapp: form.whatsapp_corporativo || "",
          departamento: form.departamento || "",
        });
      } catch (err) {
        console.error("Erro ao disparar webhook de credencial:", err);
      }
      setShowForm(false); setForm({ nome_completo: "", email_corporativo: "", whatsapp_corporativo: "", departamento: "" });
      carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  if (!podeVer) return <div className="flex flex-col items-center justify-center gap-3 p-8 pt-20"><Shield size={40} className="text-text-muted" /><p className="text-sm text-text-muted">Acesso restrito</p></div>;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text-main">Credenciais de Acesso</h1>
        {podeAdmin && <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white"><Plus size={16} />Nova</button>}
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      : credenciais.length === 0 ? <p className="py-12 text-center text-sm text-text-muted">Nenhuma credencial cadastrada</p>
      : <div className="flex flex-col gap-2">{credenciais.map((c) => (
        <div key={c.id} className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10"><UserPlus size={18} className="text-accent" /></div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-text-main">{c.nome_completo}</p><p className="text-[11px] text-text-muted">{c.email_corporativo}</p>{c.departamento && <p className="text-[10px] text-text-muted">{c.departamento}</p>}</div>
          <button onClick={() => toggleCredencial(c.id, !c.ativo)} className={c.ativo ? "text-green-400" : "text-text-muted"}>{c.ativo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}</button>
        </div>
      ))}</div>}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-main">Nova Credencial</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <input value={form.nome_completo} onChange={(e) => setForm(prev => ({ ...prev, nome_completo: e.target.value }))} placeholder="Nome Completo" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.email_corporativo} onChange={(e) => setForm(prev => ({ ...prev, email_corporativo: e.target.value }))} placeholder="Email Corporativo" type="email" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <input value={form.whatsapp_corporativo} onChange={(e) => setForm(prev => ({ ...prev, whatsapp_corporativo: e.target.value }))} placeholder="WhatsApp Corporativo" className="mb-3 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <select value={form.departamento} onChange={(e) => setForm(prev => ({ ...prev, departamento: e.target.value }))} className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              <option value="">Departamento</option>
              {["Vendas","Administrativo","Financeiro","TI"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
              <button onClick={handleSubmit} disabled={!form.nome_completo || !form.email_corporativo || submitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
