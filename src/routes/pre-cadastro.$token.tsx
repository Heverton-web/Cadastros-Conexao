import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "~/lib/supabase";
import { buscarCepResiliente } from "~/lib/integracoes";
import { uploadDocumento } from "~/lib/documentos";
import { dispararWebhooks } from "~/lib/webhooks";
import { Loader2, CheckCircle, AlertTriangle, Send, KeyRound, Upload, Clock, ShieldCheck, Lock, XCircle } from "lucide-react";

// ─── Funções de Máscara ──────────────────────────────────────────────────────
function limpar(v: string) { return v.replace(/\D/g, ""); }

function mascaraCPF(v: string): string {
  const d = limpar(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
}

function mascaraCNPJ(v: string): string {
  const d = limpar(v).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`;
}

function mascaraTelFixo(v: string): string {
  const d = limpar(v).slice(0, 10);
  if (d.length <= 2) return d.length ? `(${d}` : d;
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
}

function mascaraCelular(v: string): string {
  const d = limpar(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function mascaraCEP(v: string): string {
  const d = limpar(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0,5)}-${d.slice(5)}`;
}

type TipoMascara = "cpf" | "cnpj" | "tel_fixo" | "celular" | "cep" | "none";

function aplicarMascara(valor: string, mascara: TipoMascara): string {
  switch (mascara) {
    case "cpf": return mascaraCPF(valor);
    case "cnpj": return mascaraCNPJ(valor);
    case "tel_fixo": return mascaraTelFixo(valor);
    case "celular": return mascaraCelular(valor);
    case "cep": return mascaraCEP(valor);
    default: return valor;
  }
}

export const preCadastroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pre-cadastro/$token",
  component: PreCadastroPage,
});

type Step = "2fa_solicitar" | "2fa_validar" | "tipo" | "dados" | "endereco" | "documentos" | "timer_expirado" | "sucesso" | "expirado";

type FormData = {
  tipo: "PF" | "PJ" | null;
  pf: {
    nome: string; data_nascimento: string; cpf: string; cro: string; cro_uf: string;
    data_emissao_cro: string; email_comunicacao: string; email_nf: string;
    tel_fixo: string; celular1: string; celular2: string; estado: string;
  };
  pj: {
    razao_social: string; nome_fantasia: string; cnpj: string; inscricao_estadual: string;
    cro: string; cro_uf: string; data_emissao_cro: string;
    email_comunicacao: string; email_nf: string;
    tel_fixo: string; celular1: string; celular2: string;
  };
  endereco: {
    cep: string; rua: string; numero: string; bairro: string;
    complemento: string; cidade: string; estado: string;
  };
};

const PAISES = [
  { nome: "Brasil", ddi: "55", bandeira: "🇧🇷" },
  { nome: "Portugal", ddi: "351", bandeira: "🇵🇹" },
  { nome: "Estados Unidos", ddi: "1", bandeira: "🇺🇸" },
  { nome: "Argentina", ddi: "54", bandeira: "🇦🇷" },
  { nome: "Chile", ddi: "56", bandeira: "🇨🇱" },
  { nome: "Colômbia", ddi: "57", bandeira: "🇨🇴" },
  { nome: "Uruguai", ddi: "598", bandeira: "🇺🇾" },
  { nome: "Paraguai", ddi: "595", bandeira: "🇵🇾" },
  { nome: "Peru", ddi: "51", bandeira: "🇵🇪" },
  { nome: "Equador", ddi: "593", bandeira: "🇪🇨" },
];

function PreCadastroPage() {
  const { token } = useParams({ from: preCadastroRoute.id });
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("tipo");
  const [loading, setLoading] = useState(true);
  const [cadastroId, setCadastroId] = useState<string | null>(null);
  
  // 2FA Inicial States
  const [canal2FA, setCanal2FA] = useState<"email" | "whatsapp">("whatsapp");
  const [contatoEmail, setContatoEmail] = useState("");
  const [contatoDdi, setContatoDdi] = useState("55");
  const [contatoDdd, setContatoDdd] = useState("");
  const [contatoPhone, setContatoPhone] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [pinErro, setPinErro] = useState("");
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [tempo2FA, setTempo2FA] = useState<number | null>(null);

  // Timer States
  const [inicioPreenchimento, setInicioPreenchimento] = useState<string | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);

  // Modal Duplicado
  const [modalDuplicado, setModalDuplicado] = useState<{ tipo: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState<FormData>({
    tipo: null,
    pf: { nome: "", data_nascimento: "", cpf: "", cro: "", cro_uf: "", data_emissao_cro: "",
      email_comunicacao: "", email_nf: "", tel_fixo: "", celular1: "", celular2: "", estado: "" },
    pj: { razao_social: "", nome_fantasia: "", cnpj: "", inscricao_estadual: "",
      cro: "", cro_uf: "", data_emissao_cro: "", email_comunicacao: "", email_nf: "",
      tel_fixo: "", celular1: "", celular2: "" },
    endereco: { cep: "", rua: "", numero: "", bairro: "", complemento: "", cidade: "", estado: "" },
  });

  useEffect(() => {
    validarToken();
  }, [token]);

  // Hook do Timer de 24 Horas
  useEffect(() => {
    if (!inicioPreenchimento || ["sucesso", "expirado", "timer_expirado"].includes(step)) return;

    const interval = setInterval(() => {
      const limite = new Date(inicioPreenchimento).getTime() + 24 * 60 * 60 * 1000;
      const restante = limite - Date.now();
      if (restante <= 0) {
        setStep("timer_expirado");
        setTempoRestante(0);
        clearInterval(interval);
      } else {
        setTempoRestante(restante);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [inicioPreenchimento, step]);

  // Hook do Timer do PIN 2FA (5 minutos)
  useEffect(() => {
    if (step !== "2fa_validar" || tempo2FA === null) return;

    const interval = setInterval(() => {
      setTempo2FA(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setPinErro("PIN expirado. Solicite um novo código.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, tempo2FA === null]);

  async function validarToken() {
    setLoading(true);
    try {
      // Registra acesso e limpa expirados de uma vez só
      const { data, error } = await supabase.rpc("registrar_acesso_token", { token_text: token });
      if (error || !data) { setStep("expirado"); return; }
      
      const c = typeof data === "string" ? JSON.parse(data) : data;
      setCadastroId(c.id);
      
      // Armazena contato de email inicial
      if (c.lead_email && !contatoEmail) setContatoEmail(c.lead_email);

      // Regra de Expiração do Link Geral
      if (c.link_expiracao && new Date(c.link_expiracao) < new Date()) {
        setStep("expirado");
        return;
      }

      // Se já finalizou o preenchimento, vai para sucesso
      if (["dados_enviados", "em_analise", "aprovado", "reprovado"].includes(c.status)) {
        setStep("sucesso");
        return;
      }

      // Verificação 2FA
      if (!c.status_verificacao_token) {
        setStep("2fa_solicitar");
      } else {
        // 2FA já validado
        setInicioPreenchimento(c.inicio_preenchimento);
        const limite = new Date(c.inicio_preenchimento).getTime() + 24 * 60 * 60 * 1000;
        const restante = limite - Date.now();
        if (restante <= 0) {
          setStep("timer_expirado");
        } else {
          setTempoRestante(restante);
          if (c.tipo_pessoa) {
            setForm(prev => ({ ...prev, tipo: c.tipo_pessoa }));
            setStep("dados");
          } else {
            setStep("tipo");
          }
        }
      }
    } catch (e) {
      setStep("expirado");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnviarPIN() {
    setPinSubmitting(true);
    setPinErro("");
    try {
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const contatoFormatado = canal2FA === "email" ? contatoEmail : (contatoDdi + contatoDdd + contatoPhone);

      if (canal2FA === "email" && !contatoEmail.includes("@")) {
        setPinErro("E-mail inválido");
        return;
      }
      if (canal2FA === "whatsapp" && (!contatoDdd || contatoPhone.length < 8)) {
        setPinErro("Telefone celular incompleto");
        return;
      }

      // Salva dados no banco via RPC segura
      await supabase.rpc("gerar_2fa_pin", {
        token_text: token,
        canal_text: canal2FA,
        contato_text: contatoFormatado,
        pin_text: pin,
      });

      // Dispara webhook de PIN
      await dispararWebhooks("enviar_pin_2fa", {
        cadastro_id: cadastroId,
        canal: canal2FA,
        contato: contatoFormatado,
        pin,
      });

      console.log(`[2FA] PIN ${pin} enviado para ${contatoFormatado}`);
      setTempo2FA(300);
      setPinInput("");
      setStep("2fa_validar");
    } catch (e) {
      setPinErro("Erro ao gerar PIN. Tente novamente.");
    } finally {
      setPinSubmitting(false);
    }
  }

  async function handleValidarPIN() {
    setPinSubmitting(true);
    setPinErro("");
    try {
      const { data: valido } = await supabase.rpc("validar_2fa_pin", {
        token_text: token,
        pin_text: pinInput,
      });

      if (valido) {
        // Recarregar dados e iniciar timer
        await validarToken();
      } else {
        setPinErro("PIN inválido ou expirado. Tente novamente.");
      }
    } catch (e) {
      setPinErro("Erro na validação do PIN.");
    } finally {
      setPinSubmitting(false);
    }
  }

  async function handleAvancarDados() {
    // Verifica duplicidade de CPF (PF) ou CNPJ (PJ) antes de avançar
    try {
      if (form.tipo === "PF" && form.pf.cpf) {
        const cpfLimpo = limpar(form.pf.cpf);
        if (cpfLimpo.length === 11) {
          const { data } = await supabase.rpc("verificar_documento_duplicado", {
            documento_texto: cpfLimpo,
            tipo_documento: "CPF",
          });
          if (data?.duplicado) {
            setModalDuplicado({ tipo: "CPF" });
            return;
          }
        }
      }
      if (form.tipo === "PJ" && form.pj.cnpj) {
        const cnpjLimpo = limpar(form.pj.cnpj);
        if (cnpjLimpo.length === 14) {
          const { data } = await supabase.rpc("verificar_documento_duplicado", {
            documento_texto: cnpjLimpo,
            tipo_documento: "CNPJ",
          });
          if (data?.duplicado) {
            setModalDuplicado({ tipo: "CNPJ" });
            return;
          }
        }
      }
    } catch {
      // Em caso de erro na verificação, permite avançar normalmente
    }
    setStep("endereco");
  }

  async function handleBuscarCEP() {
    const cep = limpar(form.endereco.cep);
    if (cep.length < 8) return;
    const result = await buscarCepResiliente(cep);
    if (result) {
      setForm(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          rua: result.logradouro,
          bairro: result.bairro,
          cidade: result.localidade,
          estado: result.uf,
        },
      }));
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErro("");
    try {
      const pf = form.tipo === "PF" ? form.pf : {};
      const pj = form.tipo === "PJ" ? form.pj : {};
      await supabase.rpc("update_cadastro_from_precadastro", {
        token_text: token,
        tipo_pessoa: form.tipo,
        pf_data: pf,
        pj_data: pj,
        endereco_data: form.endereco,
      });

      // Atualiza status do cadastro para em análise após envio de dados e docs
      await supabase.from("cadastros").update({ status: "em_analise" }).eq("id", cadastroId);

      // Dispara webhooks de finalização
      dispararWebhooks("dados_enviados", { cadastro_id: cadastroId, token });
      dispararWebhooks("em_analise", { cadastro_id: cadastroId, email: contatoEmail || form.pf.email_comunicacao || form.pj.email_comunicacao });

      // Dispara notificação com template para o consultor comercial
      const { data: cad } = await supabase.from("cadastros").select("created_by, lead_nome").eq("id", cadastroId).single();
      if (cad && cad.created_by) {
        // Salva notificação interna para o consultor
        await supabase.from("notificacoes").insert({
          usuario_id: cad.created_by,
          titulo: "Novo Cadastro Enviado",
          mensagem: `O lead ${cad.lead_nome || "Sem Nome"} concluiu o envio de dados e documentos. Está aguardando análise.`,
          dados: { cadastro_id: cadastroId }
        });
      }

      setStep("sucesso");
    } catch (e: any) {
      setErro(e.message || "Erro ao salvar dados");
    } finally {
      setSubmitting(false);
    }
  }

  function formatarTempo(ms: number) {
    const totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center bg-bg-dark"><Loader2 size={32} className="animate-spin text-accent" /></div>;
  }

  if (step === "expirado") {
    return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-dark p-8 text-center">
      <AlertTriangle size={48} className="text-red-400 animate-bounce" />
      <h1 className="text-xl font-bold text-text-main">Link Expirado</h1>
      <p className="text-sm text-text-muted max-w-sm">O link acessado expirou. Solicite um novo link ao seu Consultor(a) comercial.</p>
    </div>;
  }

  if (step === "timer_expirado") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black/85 px-6">
        <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-red-500/20 text-center flex flex-col items-center">
          <Clock size={48} className="text-red-500 mb-3 animate-pulse" />
          <h2 className="text-lg font-bold text-text-main mb-2">Tempo Esgotado!</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            O prazo limite de 24 horas para preenchimento dos seus dados expirou. O link foi bloqueado por motivos de segurança.
          </p>
        </div>
      </div>
    );
  }

  if (step === "sucesso") {
    return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-dark p-8 text-center">
      <CheckCircle size={48} className="text-green-400 animate-pulse" />
      <h1 className="text-xl font-bold text-text-main">Cadastro Enviado!</h1>
      <p className="text-sm text-text-muted max-w-sm">Seus dados foram enviados com sucesso. Nossa equipe analisará as informações e você receberá um retorno em breve.</p>
    </div>;
  }

  const steps = ["tipo", "dados", "endereco", "documentos"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-dvh bg-bg-dark flex flex-col">
      {/* Timer de 24 Horas */}
      {tempoRestante !== null && currentIdx >= 0 && (
        <div className="w-full bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 flex items-center justify-center gap-2 text-xs text-orange-400 font-semibold sticky top-0 z-50 backdrop-blur-md">
          <Clock size={14} className="animate-pulse" />
          <span>Tempo restante para concluir o preenchimento:</span>
          <span className="font-mono text-sm">{formatarTempo(tempoRestante)}</span>
        </div>
      )}

      <div className="flex items-center gap-3 border-b border-border-subtle bg-card px-4 py-3">
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div key={s} className={`h-1 w-6 rounded-full ${i <= currentIdx ? "bg-accent" : "bg-input-bg"}`} />
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-accent">Conexão Implantes</h1>
          <p className="text-xs text-text-muted">Cadastro de Novos Clientes</p>
        </div>

        {/* 2FA Solicitar PIN */}
        {step === "2fa_solicitar" && (
          <div className="rounded-2xl bg-card p-6 shadow-xl flex flex-col gap-4 border border-border-subtle">
            <div className="flex flex-col items-center gap-2 mb-2">
              <Lock size={36} className="text-accent" />
              <h2 className="text-base font-bold text-text-main">Autenticação de Segurança</h2>
              <p className="text-center text-xs text-text-muted">Por segurança, verifique sua identidade para prosseguir.</p>
            </div>
            
            <p className="text-xs font-semibold text-text-muted">Selecione onde deseja receber o PIN:</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCanal2FA("whatsapp")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${canal2FA === "whatsapp" ? "bg-accent text-white" : "bg-input-bg text-text-muted"}`}>WhatsApp</button>
              <button type="button" onClick={() => setCanal2FA("email")} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition ${canal2FA === "email" ? "bg-accent text-white" : "bg-input-bg text-text-muted"}`}>E-mail</button>
            </div>

            {canal2FA === "email" ? (
              <Campo label="Seu E-mail de Contato *" value={contatoEmail} onChange={setContatoEmail} type="email" />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-text-muted mb-0.5">Seu Celular (WhatsApp) *</p>
                <div className="flex gap-2">
                  <select value={contatoDdi} onChange={e => setContatoDdi(e.target.value)}
                    className="min-w-0 flex-[1.5] rounded-lg border border-input-border bg-input-bg px-2.5 py-3 text-xs text-text-main outline-none focus:border-accent min-h-[44px]">
                    {PAISES.map(p => <option key={p.ddi} value={p.ddi}>{p.bandeira} +{p.ddi}</option>)}
                  </select>
                  <input value={contatoDdd} onChange={e => setContatoDdd(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    placeholder="DDD" className="w-[60px] text-center rounded-lg border border-input-border bg-input-bg px-2 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
                  <input value={contatoPhone} onChange={e => setContatoPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="Número" className="flex-[3] rounded-lg border border-input-border bg-input-bg px-3 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
                </div>
              </div>
            )}

            {pinErro && <p className="text-xs text-red-400 mt-1 font-medium">{pinErro}</p>}
            <button onClick={handleEnviarPIN} disabled={pinSubmitting} className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white mt-2 flex items-center justify-center gap-2">
              {pinSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Receber PIN de Acesso
            </button>
          </div>
        )}

        {/* 2FA Validar PIN */}
        {step === "2fa_validar" && (
          <div className="rounded-2xl bg-card p-6 shadow-xl flex flex-col gap-4 border border-border-subtle">
            <div className="flex flex-col items-center gap-2 mb-2">
              <KeyRound size={36} className="text-accent" />
              <h2 className="text-base font-bold text-text-main">Insira o PIN de 6 Dígitos</h2>
              <div className="text-center text-xs text-text-muted leading-relaxed">
                <p>Insira o código enviado para o seu {canal2FA === "email" ? "e-mail" : "WhatsApp"}.</p>
                {tempo2FA !== null && tempo2FA > 0 ? (
                  <p className="mt-1.5 flex items-center justify-center gap-1.5 text-orange-400 font-semibold">
                    <Clock size={12} className="animate-pulse" />
                    O código expira em: <span className="font-mono text-sm">{Math.floor(tempo2FA / 60)}:{(tempo2FA % 60).toString().padStart(2, "0")}</span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-red-400 font-semibold">Código expirado</p>
                )}
              </div>
            </div>
            
            <input value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))} 
              placeholder="000000" type="text" maxLength={6} disabled={tempo2FA === 0}
              className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-center text-lg font-mono tracking-widest text-text-main outline-none focus:border-accent min-h-[44px] disabled:opacity-50" />

            {pinErro && <p className="text-xs text-red-400 font-medium text-center">{pinErro}</p>}
            
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => setStep("2fa_solicitar")} className="flex-1 rounded-xl border border-input-border py-3 text-xs font-semibold text-text-muted">Voltar</button>
              <button onClick={handleValidarPIN} disabled={pinSubmitting || pinInput.length < 6 || tempo2FA === 0} className="flex-1 rounded-xl bg-accent py-3 text-xs font-semibold text-white flex items-center justify-center gap-1.5 disabled:opacity-50">
                {pinSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Validar PIN
              </button>
            </div>
          </div>
        )}

        {step === "tipo" && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-text-main">Que tipo de cadastro deseja realizar?</p>
            <button onClick={() => setForm(prev => ({ ...prev, tipo: "PF" }))} className={`rounded-xl border-2 p-6 text-center transition ${form.tipo === "PF" ? "border-accent bg-accent/10" : "border-border-subtle bg-card"}`}>
              <span className="text-2xl font-bold text-accent">PF</span>
              <p className="text-xs text-text-muted mt-1">Pessoa Física</p>
            </button>
            <button onClick={() => setForm(prev => ({ ...prev, tipo: "PJ" }))} className={`rounded-xl border-2 p-6 text-center transition ${form.tipo === "PJ" ? "border-accent bg-accent/10" : "border-border-subtle bg-card"}`}>
              <span className="text-2xl font-bold text-accent">PJ</span>
              <p className="text-xs text-text-muted mt-1">Pessoa Jurídica</p>
            </button>
            <button disabled={!form.tipo} onClick={() => setStep("dados")} className="mt-4 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">Continuar</button>
          </div>
        )}

        {step === "dados" && form.tipo === "PF" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">Preencha todos os campos obrigatórios sinalizados com *</p>
            <Campo label="Nome Completo *" value={form.pf.nome} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, nome: v } }))} />
            <Campo label="Data de Nascimento *" value={form.pf.data_nascimento} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, data_nascimento: v } }))} type="date" />
            <Campo label="Estado" value={form.pf.estado} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, estado: v } }))} />
            <Campo label="Número do CRO/TPD *" value={form.pf.cro} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, cro: v } }))} />
            <Campo label="Data emissão CRO/TPD" value={form.pf.data_emissao_cro} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, data_emissao_cro: v } }))} type="date" />
            <CampoMascarado label="CPF *" value={form.pf.cpf} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, cpf: v } }))} mascara="cpf" placeholder="000.000.000-00" />
            <Campo label="E-mail para Comunicação *" value={form.pf.email_comunicacao} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, email_comunicacao: v } }))} type="email" />
            <Campo label="E-mail para NF" value={form.pf.email_nf} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, email_nf: v } }))} type="email" />
            <CampoMascarado label="Telefone Fixo" value={form.pf.tel_fixo} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, tel_fixo: v } }))} mascara="tel_fixo" placeholder="(00) 0000-0000" />
            <CampoMascarado label="Celular 01" value={form.pf.celular1} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, celular1: v } }))} mascara="celular" placeholder="(00) 00000-0000" />
            <CampoMascarado label="Celular 02" value={form.pf.celular2} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, celular2: v } }))} mascara="celular" placeholder="(00) 00000-0000" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("tipo")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={handleAvancarDados} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === "dados" && form.tipo === "PJ" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">Preencha todos os campos obrigatórios sinalizados com *</p>
            <Campo label="Razão Social *" value={form.pj.razao_social} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, razao_social: v } }))} />
            <Campo label="Nome Fantasia *" value={form.pj.nome_fantasia} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, nome_fantasia: v } }))} />
            <CampoMascarado label="CNPJ *" value={form.pj.cnpj} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, cnpj: v } }))} mascara="cnpj" placeholder="00.000.000/0000-00" />
            <Campo label="Inscrição Estadual *" value={form.pj.inscricao_estadual} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, inscricao_estadual: v } }))} />
            <Campo label="Número do CRO/TPD *" value={form.pj.cro} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, cro: v } }))} />
            <Campo label="Data emissão CRO/TPD" value={form.pj.data_emissao_cro} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, data_emissao_cro: v } }))} type="date" />
            <Campo label="E-mail para Comunicação *" value={form.pj.email_comunicacao} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, email_comunicacao: v } }))} type="email" />
            <Campo label="E-mail para NF" value={form.pj.email_nf} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, email_nf: v } }))} type="email" />
            <CampoMascarado label="Telefone Fixo" value={form.pj.tel_fixo} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, tel_fixo: v } }))} mascara="tel_fixo" placeholder="(00) 0000-0000" />
            <CampoMascarado label="Celular 01" value={form.pj.celular1} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, celular1: v } }))} mascara="celular" placeholder="(00) 00000-0000" />
            <CampoMascarado label="Celular 02" value={form.pj.celular2} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, celular2: v } }))} mascara="celular" placeholder="(00) 00000-0000" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("tipo")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={handleAvancarDados} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === "endereco" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">As informações completas de seu endereço serão exibidas ao digitar o CEP</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <CampoMascarado label="CEP *" value={form.endereco.cep} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, cep: v } }))} mascara="cep" placeholder="00000-000" />
              </div>
              <button onClick={handleBuscarCEP} className="mt-6 rounded-lg bg-accent px-4 py-3 text-xs font-medium text-white min-h-[44px]">Buscar</button>
            </div>
            <Campo label="Rua *" value={form.endereco.rua} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, rua: v } }))} />
            <div className="flex gap-2">
              <div className="flex-1"><Campo label="Número *" value={form.endereco.numero} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, numero: v } }))} /></div>
              <div className="flex-1"><Campo label="Bairro *" value={form.endereco.bairro} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, bairro: v } }))} /></div>
            </div>
            <Campo label="Complemento" value={form.endereco.complemento} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, complemento: v } }))} />
            <div className="flex gap-2">
              <div className="flex-1"><Campo label="Cidade *" value={form.endereco.cidade} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, cidade: v } }))} /></div>
              <div className="flex-1"><Campo label="Estado *" value={form.endereco.estado} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, estado: v } }))} /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("dados")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={() => setStep("documentos")} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === "documentos" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">Atente-se para os formatos permitidos: .jpeg | .jpg | .png | .pdf</p>
            <DocUpload label="CRO/TPD - Frente" tipo="cro_frente" cadastroId={cadastroId} />
            <DocUpload label="CRO/TPD - Verso" tipo="cro_verso" cadastroId={cadastroId} />
            <DocUpload label="CNH/CPF/RG - Frente" tipo="cnh_frente" cadastroId={cadastroId} />
            <DocUpload label="CNH/CPF/RG - Verso" tipo="cnh_verso" cadastroId={cadastroId} />
            <DocUpload label="Comprovante de Endereço" tipo="comprovante_endereco" cadastroId={cadastroId} />
            {form.tipo === "PJ" && <DocUpload label="Contrato Social" tipo="contrato_social" cadastroId={cadastroId} />}
            {form.tipo === "PJ" && <DocUpload label="Declaração de Prestação de Serviço" tipo="declaracao_prestacao_servico" cadastroId={cadastroId} />}
            {erro && <p className="text-xs text-red-400">{erro}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("endereco")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white disabled:opacity-50">
                {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Enviar Dados"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de CPF/CNPJ Duplicado */}
      {modalDuplicado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-red-500/30 p-6 shadow-2xl flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-base font-bold text-text-main text-center">
              {modalDuplicado.tipo} já cadastrado
            </h2>
            <p className="text-xs text-text-muted text-center leading-relaxed">
              Este <strong className="text-text-main">{modalDuplicado.tipo}</strong> já possui uma solicitação de cadastro em andamento em nosso sistema.
              <br /><br />
              Por favor, entre em contato com o seu <strong className="text-accent">consultor responsável</strong> para mais informações.
            </p>
            <button
              onClick={() => setModalDuplicado(null)}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, onChange, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
    <input value={value} onChange={e => onChange(e.target.value)} type={type || "text"} placeholder={placeholder}
      className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] placeholder:text-text-muted/40" />
  </div>;
}

function CampoMascarado({ label, value, onChange, mascara, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mascara: TipoMascara;
  placeholder?: string;
}) {
  // value no estado é o valor com máscara; enviamos limpo para o pai apenas para persistência
  // mas exibimos formatado
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = aplicarMascara(e.target.value, mascara);
    onChange(formatado);
  }, [mascara, onChange]);

  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
    <input
      value={value}
      onChange={handleChange}
      type="tel"
      inputMode="numeric"
      placeholder={placeholder}
      className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px] placeholder:text-text-muted/40 font-mono tracking-wide"
    />
  </div>;
}

function DocUpload({ label, tipo, cadastroId }: { label: string; tipo: string; cadastroId: string | null }) {
  const [nome, setNome] = useState("");
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cadastroId) return;
    setNome(file.name);
    try {
      await uploadDocumento(cadastroId, tipo, file);
    } catch { }
  };
  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
    <label className="flex items-center gap-2 rounded-lg border border-dashed border-input-border bg-input-bg px-4 py-3 cursor-pointer">
      <Upload size={16} className="text-accent" />
      <span className="flex-1 text-sm text-text-muted truncate">{nome || "Clique para anexar"}</span>
      <input type="file" accept=".jpeg,.jpg,.png,.pdf" onChange={handleFile} className="hidden" />
    </label>
  </div>;
}
