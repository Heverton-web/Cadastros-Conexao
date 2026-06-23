import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { listarCadastros, criarCadastro, STATUS_LABEL, STATUS_COLOR, type Cadastro, type CadastroStatus } from "~/lib/clientes";
import { getDocumentosStatusMap, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type DocStatus } from "~/lib/documentos";
import { logAtividade } from "~/lib/atividades";
import { dispararWebhooks } from "~/lib/webhooks";
import { Loader2, Link2, Plus, Share2, ArrowRight, Copy, X, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const consultorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/consultor",
  component: ConsultorPage,
});

const PAISES = [
  { nome: "Brasil", ddi: "55", bandeira: "🇧🇷" },
  { nome: "Portugal", ddi: "351", bandeira: "🇵🇹" },
  { nome: "Estados Unidos / Canadá", ddi: "1", bandeira: "🇺🇸" },
  { nome: "Argentina", ddi: "54", bandeira: "🇦🇷" },
  { nome: "Chile", ddi: "56", bandeira: "🇨🇱" },
  { nome: "Colômbia", ddi: "57", bandeira: "🇨🇴" },
  { nome: "Uruguai", ddi: "598", bandeira: "🇺🇾" },
  { nome: "Paraguai", ddi: "595", bandeira: "🇵🇾" },
  { nome: "Peru", ddi: "51", bandeira: "🇵🇪" },
  { nome: "Equador", ddi: "593", bandeira: "🇪🇨" },
  { nome: "Venezuela", ddi: "58", bandeira: "🇻🇪" },
  { nome: "Bolívia", ddi: "591", bandeira: "🇧🇴" },
  { nome: "México", ddi: "52", bandeira: "🇲🇽" },
  { nome: "Espanha", ddi: "34", bandeira: "🇪🇸" },
  { nome: "Itália", ddi: "39", bandeira: "🇮🇹" },
  { nome: "França", ddi: "33", bandeira: "🇫🇷" },
  { nome: "Alemanha", ddi: "49", bandeira: "🇩🇪" },
  { nome: "Reino Unido", ddi: "44", bandeira: "🇬🇧" },
  { nome: "Japão", ddi: "81", bandeira: "🇯🇵" },
  { nome: "China", ddi: "86", bandeira: "🇨🇳" },
];

function ConsultorPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [cadastros, setCadastros] = useState<(Cadastro & { profiles: { nome: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const [showGerarLink, setShowGerarLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ tipo_acao: "solicitar_cadastro" as "solicitar_cadastro" | "atualizar_cadastro", receber_por: "whatsapp" as "whatsapp" | "email", nome_lead: "", email_lead: "", ddi: "55", ddd: "", whatsapp_num: "", expiracao_dias: "5" });
  const [linkGerado, setLinkGerado] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [docsStatus, setDocsStatus] = useState<Record<string, DocStatus>>({});

  useEffect(() => { if (user?.id) carregar(); }, [user]);

  // Trava scroll do body quando modal está aberto (previne desconfiguração no Samsung)
  useEffect(() => {
    const isModalOpen = showGerarLink || showSuccess;
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.classList.add("modal-open");
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.body.classList.remove("modal-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showGerarLink, showSuccess]);

  async function carregar() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await listarCadastros({ created_by: user.id });
      setCadastros(res);
      const status = await getDocumentosStatusMap(res.map((c) => ({ id: c.id, tipo_pessoa: c.tipo_pessoa })));
      setDocsStatus(status);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const numeroCompleto = linkForm.ddi + linkForm.ddd + linkForm.whatsapp_num;

  async function gerarLink() {
    setSubmitting(true);
    setShowGerarLink(false);
    try {
      const expiracao = new Date(); expiracao.setDate(expiracao.getDate() + parseInt(linkForm.expiracao_dias));
      const s = await criarCadastro({
        tipo_acao: linkForm.tipo_acao,
        forma_compartilhamento: linkForm.receber_por,
        lead_nome: linkForm.nome_lead || null,
        lead_email: linkForm.email_lead || null,
        lead_whatsapp: numeroCompleto || null,
        link_expiracao: expiracao.toISOString(),
      });
      await logAtividade("cadastro", s.id, "link_gerado", `Link gerado para ${linkForm.nome_lead}`);
      const dataFormatada = new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR");
      dispararWebhooks("botao_compartilhar_link", {
        cadastro_id: s.id,
        token_acesso: s.token_acesso,
        status: "link_gerado",
        data_gerado: dataFormatada,
        usuario_nome: profile?.nome || "",
        usuario_id: profile?.id || "",
        tipo_acao: linkForm.tipo_acao,
        forma_compartilhamento: linkForm.receber_por,
        lead_nome: linkForm.nome_lead,
        lead_email: linkForm.email_lead,
        lead_ddi: linkForm.ddi,
        lead_ddd: linkForm.ddd,
        lead_whatsapp_num: linkForm.whatsapp_num,
        expiracao_dias: linkForm.expiracao_dias,
      }, profile?.empresa_id);
      dispararWebhooks("link_gerado", {
        cadastro_id: s.id,
        token_acesso: s.token_acesso,
        status: "link_gerado",
        data_gerado: dataFormatada,
        usuario_nome: profile?.nome || "",
        usuario_id: profile?.id || "",
        tipo_acao: linkForm.tipo_acao,
        forma_compartilhamento: linkForm.receber_por,
        lead_nome: linkForm.nome_lead,
        lead_email: linkForm.email_lead,
        lead_ddi: linkForm.ddi,
        lead_ddd: linkForm.ddd,
        lead_whatsapp_num: linkForm.whatsapp_num,
        expiracao_dias: linkForm.expiracao_dias,
      }, profile?.empresa_id);
      const link = `${window.location.origin}/pre-cadastro/${s.token_acesso}`;
      setLinkGerado(link);
      setShowSuccess(true);
      setLinkForm({ tipo_acao: "solicitar_cadastro", receber_por: "whatsapp", nome_lead: "", email_lead: "", ddi: "55", ddd: "", whatsapp_num: "", expiracao_dias: "5" });
      if (linkForm.receber_por === "whatsapp" && numeroCompleto) {
        window.open(`https://wa.me/${numeroCompleto.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá! Acesse o link para seu cadastro: ${link}`)}`, "_blank");
      }
      carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 p-4 pb-24">
      <div>
        <h1 className="text-lg font-bold text-text-main">Dashboard do Consultor</h1>
        <p className="text-xs text-text-muted">Gerencie seus cadastros e crie novos links para clientes</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <button onClick={() => { setLinkForm(prev => ({ ...prev, tipo_acao: "solicitar_cadastro" })); setShowGerarLink(true); }} className="flex flex-col items-center justify-center gap-2 rounded-xl bg-accent p-5 text-white shadow-lg transition active:scale-[0.98] min-h-[80px]">
          <Plus size={24} /><span className="text-xs font-bold">Solicitar Cadastro</span>
        </button>
        <button onClick={() => { setLinkForm(prev => ({ ...prev, tipo_acao: "atualizar_cadastro" })); setShowGerarLink(true); }} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-accent/50 p-5 text-accent shadow-lg transition active:scale-[0.98] min-h-[80px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          <span className="text-xs font-bold">Atualizar Cadastro</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-3">
        <FiltroCard label="Todos" value={cadastros.length} color="text-accent" ativo={filtroStatus === null} onClick={() => setFiltroStatus(null)} />
        <FiltroCard label="Links" value={cadastros.filter(s => s.status === "link_gerado").length} color="text-blue-400" ativo={filtroStatus === "link_gerado"} onClick={() => setFiltroStatus("link_gerado")} />
        <FiltroCard label="Análise" value={cadastros.filter(s => s.status === "em_analise" || s.status === "dados_enviados").length} color="text-yellow-400" ativo={filtroStatus === "em_analise"} onClick={() => setFiltroStatus("em_analise")} />
        <FiltroCard label="Aprovados" value={cadastros.filter(s => s.status === "aprovado").length} color="text-green-400" ativo={filtroStatus === "aprovado"} onClick={() => setFiltroStatus("aprovado")} />
        <FiltroCard label="Reprovados" value={cadastros.filter(s => s.status === "reprovado").length} color="text-red-400" ativo={filtroStatus === "reprovado"} onClick={() => setFiltroStatus("reprovado")} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-main">{filtroStatus ? STATUS_LABEL[filtroStatus as CadastroStatus] || filtroStatus : "Minhas Solicitações"}</h2>
          {filtroStatus && <button onClick={() => setFiltroStatus(null)} className="text-[10px] text-accent underline">Limpar filtro</button>}
        </div>
        {loading ? <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-accent" /></div>
        : cadastros.length === 0 ? <p className="text-center text-sm text-text-muted py-8">Nenhuma solicitação ainda. Crie seu primeiro link!</p>
        : (() => {
          const lista = filtroStatus ? cadastros.filter(s => s.status === filtroStatus || (filtroStatus === "em_analise" && (s.status === "em_analise" || s.status === "dados_enviados"))) : cadastros;
          return lista.length === 0 ? <p className="text-center text-sm text-text-muted py-8">Nenhuma solicitação com este status.</p>
          : <div className="flex flex-col gap-2">{lista.slice(0, 10).map((s) => (
            <button key={s.id} onClick={() => navigate({ to: "/clientes/$id", params: { id: s.id } })}
              className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98] w-full text-left hover:ring-1 hover:ring-accent/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                {s.status === "aprovado" ? <CheckCircle size={16} className="text-green-400" /> :
                 s.status === "reprovado" ? <XCircle size={16} className="text-red-400" /> :
                 s.status === "em_correcao" ? <AlertTriangle size={16} className="text-orange-400" /> :
                 s.status === "em_analise" || s.status === "dados_enviados" ? <Clock size={16} className="text-yellow-400" /> :
                 <Link2 size={16} className="text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{s.lead_nome || "Sem nome"}</p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_COLOR[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${DOC_STATUS_COLOR[docsStatus[s.id]]}`}>{DOC_STATUS_LABEL[docsStatus[s.id]]}</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-text-muted shrink-0" />
            </button>
          ))}</div>;
        })()}
      </div>

      {/* Gerar Link Modal */}
      {showGerarLink && !linkGerado && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60" onClick={() => { setShowGerarLink(false); setLinkGerado(null); }}>
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-text-main">Gerar Link de Cadastro</h2>
              <button onClick={() => { setShowGerarLink(false); setLinkGerado(null); }} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <p className="mb-4 text-xs text-text-muted">Crie um novo link de cadastro para enviar ao cliente.</p>
            <p className="mb-1 text-xs font-medium text-text-muted">Indique a forma que o Lead receberá o link:</p>
            <div className="mb-4 flex gap-2">
              <button onClick={() => setLinkForm(prev => ({ ...prev, receber_por: "whatsapp" }))} className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${linkForm.receber_por === "whatsapp" ? "bg-accent text-white" : "bg-input-bg text-text-muted"}`}>WhatsApp</button>
              <button onClick={() => setLinkForm(prev => ({ ...prev, receber_por: "email" }))} className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${linkForm.receber_por === "email" ? "bg-accent text-white" : "bg-input-bg text-text-muted"}`}>E-mail</button>
            </div>
            <p className="mb-1 text-xs font-medium text-text-muted">Prazo de expiração</p>
            <select value={linkForm.expiracao_dias} onChange={(e) => setLinkForm(prev => ({ ...prev, expiracao_dias: e.target.value }))} className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
              {[1,3,5,7].map(d => <option key={d} value={d}>{d} {d === 1 ? "dia" : "dias"}</option>)}
            </select>
            <InputField label="Nome do Lead" value={linkForm.nome_lead} onChange={v => setLinkForm(prev => ({ ...prev, nome_lead: v }))} placeholder="Nome do cliente" />
            {linkForm.receber_por === "whatsapp" ? (
              <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <p className="mb-1 text-xs font-medium text-text-muted">WhatsApp do Lead</p>
                <div className="mb-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <select value={linkForm.ddi} onChange={(e) => setLinkForm(prev => ({ ...prev, ddi: e.target.value }))}
                      className="min-w-0 flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]">
                      {PAISES.map(p => <option key={p.ddi} value={p.ddi}>{p.bandeira} {p.nome} (+{p.ddi})</option>)}
                    </select>
                    <input value={linkForm.ddd} onChange={(e) => setLinkForm(prev => ({ ...prev, ddd: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                      placeholder="DDD" autoComplete="tel-area-code" className="w-[80px] max-w-[80px] shrink-0 rounded-lg border border-input-border bg-input-bg px-3 py-3 text-base text-text-main outline-none focus:border-accent min-h-[44px]" />
                  </div>
                  <input value={linkForm.whatsapp_num} onChange={(e) => setLinkForm(prev => ({ ...prev, whatsapp_num: e.target.value.replace(/\D/g, "").slice(0, 9) }))}
                    placeholder="Número" autoComplete="tel-national" className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-3 text-base text-text-main outline-none focus:border-accent min-h-[44px]" />
                </div>
                {numeroCompleto.length > 2 && (
                  <p className="mb-3 text-[11px] text-text-muted italic">Número configurado: <span className="not-italic font-mono">{numeroCompleto}</span></p>
                )}
              </form>
            ) : (
              <InputField label="E-mail do Lead" value={linkForm.email_lead} onChange={v => setLinkForm(prev => ({ ...prev, email_lead: v }))} placeholder="cliente@email.com" type="email" />
            )}
            {linkForm.receber_por === "whatsapp" && <p className="mb-4 text-[11px] text-text-muted">O WhatsApp será aberto em uma nova guia.</p>}
            <button onClick={gerarLink} disabled={submitting || !linkForm.nome_lead} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} Compartilhar Link
            </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60" onClick={() => { setShowSuccess(false); setLinkGerado(null); }}>
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <div className="relative w-full max-w-xs rounded-2xl bg-card p-8 shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setShowSuccess(false); setLinkGerado(null); }} className="absolute right-4 top-4 text-text-muted hover:text-text-main"><X size={20} /></button>
              <div className="mb-3 flex justify-center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <h2 className="text-lg font-bold text-green-400">Link Gerado com Sucesso!</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltroCard({ label, value, color, ativo, onClick }: { label: string; value: number; color: string; ativo: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 rounded-xl p-2 shadow-lg transition active:scale-[0.98] ${ativo ? 'bg-accent/20 ring-2 ring-accent/50' : 'bg-card'}`}>
      <span className={`text-sm sm:text-base font-bold ${color}`}>{value}</span>
      <span className={`text-[9px] leading-tight ${ativo ? 'text-accent' : 'text-text-muted'}`}>{label}</span>
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <div className="mb-4"><p className="mb-1 text-xs font-medium text-text-muted">{label}</p><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type || "text"} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-base text-text-main outline-none focus:border-accent focus:ring-2 focus:ring-ring min-h-[44px]" /></div>;
}
