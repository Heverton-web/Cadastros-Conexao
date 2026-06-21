import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "~/lib/supabase";
import { buscarCepResiliente } from "~/lib/integracoes";
import { uploadDocumento } from "~/lib/documentos";
import { dispararWebhooks } from "~/lib/webhooks";
import { carregarSchema, type CampoSchema } from "~/lib/form-schema";
import toast from "react-hot-toast";
import { Loader2, CheckCircle, AlertTriangle, Send, KeyRound, Upload, Clock, ShieldCheck, Lock, XCircle } from "lucide-react";
import { BannerCorrecao } from "~/components/BannerCorrecao";


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

  // States para gerenciar correção do lead
  const [cadastroStatus, setCadastroStatus] = useState<string | null>(null);
  const [comentarioGeral, setComentarioGeral] = useState<string | null>(null);
  const [revisoes, setRevisoes] = useState<Record<string, any>>({});
  const [camposCorrecao, setCamposCorrecao] = useState<string[]>([]);
  const [documentosSalvos, setDocumentosSalvos] = useState<any[]>([]);

  
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

  // Schema dinâmico do formulário
  const [schemaDados, setSchemaDados] = useState<CampoSchema[]>([]);
  const [schemaEndereco, setSchemaEndereco] = useState<CampoSchema[]>([]);
  const [schemaDocs, setSchemaDocs] = useState<CampoSchema[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Campos extras (custom) preenchidos pelo lead
  const [extras, setExtras] = useState<Record<string, string | string[]>>({});

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

  // Carrega schema dinâmico quando o tipo de pessoa é definido
  useEffect(() => {
    if (!form.tipo) return;
    const tipo = form.tipo as "PF" | "PJ";
    setSchemaLoading(true);
    Promise.all([
      carregarSchema(tipo, "dados"),
      carregarSchema(tipo, "endereco"),
      carregarSchema(tipo, "documentos"),
    ]).then(([dados, endereco, docs]) => {
      setSchemaDados(dados);
      setSchemaEndereco(endereco);
      setSchemaDocs(docs);
      setSchemaLoading(false);
    });
  }, [form.tipo]);

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
      setCadastroStatus(c.status);
      setComentarioGeral(c.comentario_reprovacao);
      setRevisoes(c.revisoes || {});
      setCamposCorrecao(c.campos_correcao || []);

      // Buscar dados PF/PJ/endereços/documentos para pré-população
      const { data: pfData } = await supabase.from("cadastros_pf").select("*").eq("cadastro_id", c.id).maybeSingle();
      const { data: pjData } = await supabase.from("cadastros_pj").select("*").eq("cadastro_id", c.id).maybeSingle();
      const { data: endData } = await supabase.from("cadastros_enderecos").select("*").eq("cadastro_id", c.id).maybeSingle();
      const { data: docsData } = await supabase.from("documentos").select("*").eq("cadastro_id", c.id);

      setForm(prev => ({
        tipo: c.tipo_pessoa || prev.tipo,
        pf: {
          nome: pfData?.nome || "",
          data_nascimento: pfData?.data_nascimento ? new Date(pfData.data_nascimento).toISOString().split('T')[0] : "",
          cpf: pfData?.cpf ? aplicarMascara(pfData.cpf, "cpf") : "",
          cro: pfData?.cro || "",
          cro_uf: pfData?.cro_uf || "",
          data_emissao_cro: pfData?.data_emissao_cro ? new Date(pfData.data_emissao_cro).toISOString().split('T')[0] : "",
          email_comunicacao: pfData?.email_comunicacao || "",
          email_nf: pfData?.email_nf || "",
          tel_fixo: pfData?.tel_fixo ? aplicarMascara(pfData.tel_fixo, "tel_fixo") : "",
          celular1: pfData?.celular1 ? aplicarMascara(pfData.celular1, "celular") : "",
          celular2: pfData?.celular2 ? aplicarMascara(pfData.celular2, "celular") : "",
          estado: pfData?.estado || "",
        },
        pj: {
          razao_social: pjData?.razao_social || "",
          nome_fantasia: pjData?.nome_fantasia || "",
          cnpj: pjData?.cnpj ? aplicarMascara(pjData.cnpj, "cnpj") : "",
          inscricao_estadual: pjData?.inscricao_estadual || "",
          cro: pjData?.cro || "",
          cro_uf: pjData?.cro_uf || "",
          data_emissao_cro: pjData?.data_emissao_cro ? new Date(pjData.data_emissao_cro).toISOString().split('T')[0] : "",
          email_comunicacao: pjData?.email_comunicacao || "",
          email_nf: pjData?.email_nf || "",
          tel_fixo: pjData?.tel_fixo ? aplicarMascara(pjData.tel_fixo, "tel_fixo") : "",
          celular1: pjData?.celular1 ? aplicarMascara(pjData.celular1, "celular") : "",
          celular2: pjData?.celular2 ? aplicarMascara(pjData.celular2, "celular") : "",
        },
        endereco: {
          cep: endData?.cep ? aplicarMascara(endData.cep, "cep") : "",
          rua: endData?.rua || "",
          numero: endData?.numero || "",
          bairro: endData?.bairro || "",
          complemento: endData?.complemento || "",
          cidade: endData?.cidade || "",
          estado: endData?.estado || "",
        }
      }));

      if (c.dados_extras) {
        setExtras(c.dados_extras);
      }

      if (docsData) {
        setDocumentosSalvos(docsData);
      }
      
      // Armazena contato de email inicial
      if (c.lead_email && !contatoEmail) setContatoEmail(c.lead_email);

      // Regra de Expiração do Link Geral
      if (c.link_expiracao && new Date(c.link_expiracao) < new Date()) {
        setStep("expirado");
        return;
      }

      // Se já finalizou o preenchimento, vai para sucesso
      // Nota: permitimos o acesso se status for "em_correcao"
      if (["dados_enviados", "em_analise", "aprovado", "reprovado"].includes(c.status)) {
        setStep("sucesso");
        return;
      }

      // Verificação 2FA (pula se status for em_correcao ou se status_verificacao_token for true)
      if (!c.status_verificacao_token && c.status !== "em_correcao") {
        setStep("2fa_solicitar");
      } else {
        // 2FA já validado
        let dataInicio = c.inicio_preenchimento;
        if (!dataInicio) {
          dataInicio = new Date().toISOString();
          await supabase.from("cadastros").update({ inicio_preenchimento: dataInicio }).eq("id", c.id);
        }
        setInicioPreenchimento(dataInicio);
        const limite = new Date(dataInicio).getTime() + 24 * 60 * 60 * 1000;
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

      // Persiste campos extras (custom) preenchidos pelo lead
      if (cadastroId && Object.keys(extras).length > 0) {
        await supabase.from("cadastros").update({ dados_extras: extras }).eq("id", cadastroId);
      }

      // Atualiza status do cadastro para dados_enviados após envio de dados e docs e limpa campos_correcao
      await supabase.from("cadastros").update({ 
        status: "dados_enviados",
        campos_correcao: []
      }).eq("id", cadastroId);

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

        {cadastroStatus === "em_correcao" && (
          <BannerCorrecao comentarioGeral={comentarioGeral} />
        )}

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

        {step === "dados" && form.tipo && (() => {
          // Função auxiliar: lê valor do estado correto por campo_key
          function lerValor(key: string): string {
            const escopo = form.tipo === "PF" ? form.pf : form.pj;
            return (escopo as any)[key] ?? (extras[key] as string) ?? "";
          }
          function setValor(key: string, v: string) {
            const camposPF = ["nome","data_nascimento","cpf","cro","cro_uf","data_emissao_cro","email_comunicacao","email_nf","tel_fixo","celular1","celular2","estado"];
            const camposPJ = ["razao_social","nome_fantasia","cnpj","inscricao_estadual","cro","cro_uf","data_emissao_cro","email_comunicacao","email_nf","tel_fixo","celular1","celular2"];
            if (form.tipo === "PF" && camposPF.includes(key)) {
              setForm(prev => ({ ...prev, pf: { ...prev.pf, [key]: v } }));
            } else if (form.tipo === "PJ" && camposPJ.includes(key)) {
              setForm(prev => ({ ...prev, pj: { ...prev.pj, [key]: v } }));
            } else {
              setExtras(prev => ({ ...prev, [key]: v }));
            }
          }

          function renderCampoDinamico(c: CampoSchema) {
            const label = c.label + (c.obrigatorio ? " *" : "");
            const val = lerValor(c.campo_key);
            const onChange = (v: string) => setValor(c.campo_key, v);

            const prefixo = form.tipo === "PF" ? "pf." : "pj.";
            const chaveRevisao = prefixo + c.campo_key;
            const revisao = revisoes[chaveRevisao];
            const isCorrigir = camposCorrecao.includes(chaveRevisao) || (revisao?.status === "em_correcao" || revisao?.status === "reprovado");
            const motivoCorrecao = isCorrigir ? (revisao?.comentario || "Campo necessita de correção") : undefined;

            if (c.tipo_input === "tel") {
              // Detecta máscara pelo campo_key
              const mascara = c.campo_key === "cpf" ? "cpf"
                : c.campo_key === "cnpj" ? "cnpj"
                : c.campo_key === "tel_fixo" ? "tel_fixo"
                : "celular";
              const ph = mascara === "cpf" ? "000.000.000-00"
                : mascara === "cnpj" ? "00.000.000/0000-00"
                : mascara === "tel_fixo" ? "(00) 0000-0000"
                : "(00) 00000-0000";
              return <CampoMascarado key={c.id} label={label} value={val} onChange={onChange} mascara={mascara} placeholder={ph} motivoCorrecao={motivoCorrecao} />;
            }
            if (c.tipo_input === "textarea") {
              return (
                <div key={c.id}>
                  <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
                  <textarea value={val} onChange={e => onChange(e.target.value)} rows={3}
                    className={`w-full rounded-lg border ${motivoCorrecao ? 'border-orange-500 bg-orange-500/5 focus:border-orange-400' : 'border-input-border bg-input-bg focus:border-accent'} px-4 py-3 text-sm text-text-main outline-none resize-none transition`} />
                  {motivoCorrecao && (
                    <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={11} /> {motivoCorrecao}
                    </span>
                  )}
                </div>
              );
            }
            if (c.tipo_input === "select") {
              return (
                <div key={c.id}>
                  <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
                  <select value={val} onChange={e => onChange(e.target.value)}
                    className={`w-full rounded-lg border ${motivoCorrecao ? 'border-orange-500 bg-orange-500/5 focus:border-orange-400' : 'border-input-border bg-input-bg focus:border-accent'} px-4 py-3 text-sm text-text-main outline-none transition`}>
                    <option value="">Selecione…</option>
                    {(c.opcoes ?? []).map((op: string) => <option key={op} value={op}>{op}</option>)}
                  </select>
                  {motivoCorrecao && (
                    <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={11} /> {motivoCorrecao}
                    </span>
                  )}
                </div>
              );
            }
            if (c.tipo_input === "multiselect" || c.tipo_input === "checkbox") {
              const selecionados: string[] = Array.isArray(extras[c.campo_key]) ? extras[c.campo_key] as string[] : [];
              return (
                <div key={c.id}>
                  <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
                  <div className="flex flex-col gap-1.5">
                    {(c.opcoes ?? []).map((op: string) => (
                      <button key={op} type="button"
                        onClick={() => {
                          const novo = selecionados.includes(op)
                            ? selecionados.filter(s => s !== op)
                            : [...selecionados, op];
                          setExtras(prev => ({ ...prev, [c.campo_key]: novo }));
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition ${
                          selecionados.includes(op)
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-input-border bg-input-bg text-text-muted"
                        }`}>
                        <div className={`h-4 w-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          selecionados.includes(op) ? "border-accent bg-accent" : "border-input-border"
                        }`}>
                          {selecionados.includes(op) && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        {op}
                      </button>
                    ))}
                  </div>
                  {motivoCorrecao && (
                    <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={11} /> {motivoCorrecao}
                    </span>
                  )}
                </div>
              );
            }
            // text, email, date e fallback
            return <Campo key={c.id} label={label} value={val} onChange={onChange} type={c.tipo_input} motivoCorrecao={motivoCorrecao} />;
          }

          return (
            <div className="flex flex-col gap-3">
              {schemaLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-accent" />
                </div>
              ) : (
                <>
                  <p className="text-xs text-text-muted mb-2">Preencha todos os campos obrigatórios sinalizados com *</p>
                  {schemaDados.map(c => renderCampoDinamico(c))}
                </>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("tipo")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
                <button onClick={handleAvancarDados} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
              </div>
            </div>
          );
        })()}

        {step === "endereco" && (() => {
          function setEnd(key: string, v: string) {
            setForm(prev => ({ ...prev, endereco: { ...prev.endereco, [key]: v } }));
          }
          function renderEndDinamico(c: CampoSchema) {
            const label = c.label + (c.obrigatorio ? " *" : "");
            const endKey = c.campo_key === "estado_end" ? "estado" : c.campo_key;
            const val = (form.endereco as any)[endKey] ?? "";

            const chaveRevisaoEnd = "end." + (c.campo_key === "estado_end" ? "estado" : c.campo_key);
            const revisaoEnd = revisoes[chaveRevisaoEnd];
            const isCorrigirEnd = camposCorrecao.includes(chaveRevisaoEnd) || (revisaoEnd?.status === "em_correcao" || revisaoEnd?.status === "reprovado");
            const motivoCorrecaoEnd = isCorrigirEnd ? (revisaoEnd?.comentario || "Endereço necessita de correção") : undefined;

            if (c.campo_key === "cep") {
              return (
                <div key={c.id} className="flex gap-2">
                  <div className="flex-1">
                    <CampoMascarado label={label} value={val} onChange={v => setEnd("cep", v)} mascara="cep" placeholder="00000-000" motivoCorrecao={motivoCorrecaoEnd} />
                  </div>
                  <button onClick={handleBuscarCEP} className="mt-6 rounded-lg bg-accent px-4 py-3 text-xs font-medium text-white min-h-[44px]">Buscar</button>
                </div>
              );
            }
            return <Campo key={c.id} label={label} value={val} onChange={v => setEnd(endKey, v)} motivoCorrecao={motivoCorrecaoEnd} />;
          }
          return (
            <div className="flex flex-col gap-3">
              {schemaLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-accent" /></div>
              ) : (
                <>
                  <p className="text-xs text-text-muted mb-2">As informações de endereço serão preenchidas automaticamente pelo CEP</p>
                  {schemaEndereco.map(c => renderEndDinamico(c))}
                </>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("dados")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
                <button onClick={() => setStep("documentos")} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
              </div>
            </div>
          );
        })()}

        {step === "documentos" && (
          <div className="flex flex-col gap-3">
            {schemaLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-accent" /></div>
            ) : (
              <>
                <p className="text-xs text-text-muted mb-2">Formatos permitidos: .jpeg | .jpg | .png | .pdf</p>
                {schemaDocs.map(c => {
                  const docSalvo = documentosSalvos.find(d => d.tipo === c.campo_key);
                  return (
                    <DocUpload 
                      key={c.id} 
                      label={c.label} 
                      tipo={c.campo_key} 
                      cadastroId={cadastroId} 
                      obrigatorio={c.obrigatorio}
                      docStatus={docSalvo?.status}
                      docComentario={docSalvo?.comentario_reprovacao}
                      docUrl={docSalvo?.url}
                    />
                  );
                })}
              </>
            )}
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

function Campo({ label, value, onChange, type, placeholder, motivoCorrecao }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  type?: string; 
  placeholder?: string;
  motivoCorrecao?: string;
}) {
  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
    <input value={value} onChange={e => onChange(e.target.value)} type={type || "text"} placeholder={placeholder}
      className={`w-full rounded-lg border ${motivoCorrecao ? 'border-orange-500 bg-orange-500/5 focus:border-orange-400' : 'border-input-border bg-input-bg focus:border-accent'} px-4 py-3 text-sm text-text-main outline-none min-h-[44px] placeholder:text-text-muted/40 transition`} />
    {motivoCorrecao && (
      <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
        <AlertTriangle size={11} /> {motivoCorrecao}
      </span>
    )}
  </div>;
}

function CampoMascarado({ label, value, onChange, mascara, placeholder, motivoCorrecao }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mascara: TipoMascara;
  placeholder?: string;
  motivoCorrecao?: string;
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
      className={`w-full rounded-lg border ${motivoCorrecao ? 'border-orange-500 bg-orange-500/5 focus:border-orange-400' : 'border-input-border bg-input-bg focus:border-accent'} px-4 py-3 text-sm text-text-main outline-none min-h-[44px] placeholder:text-text-muted/40 font-mono tracking-wide transition`}
    />
    {motivoCorrecao && (
      <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
        <AlertTriangle size={11} /> {motivoCorrecao}
      </span>
    )}
  </div>;
}

function DocUpload({ label, tipo, cadastroId, obrigatorio, docStatus, docComentario, docUrl }: { 
  label: string; 
  tipo: string; 
  cadastroId: string | null; 
  obrigatorio?: boolean;
  docStatus?: string;
  docComentario?: string | null;
  docUrl?: string;
}) {
  const [nome, setNome] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (docUrl) {
      setNome("Documento já enviado");
    }
  }, [docUrl]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !cadastroId) return;
    setNome(file.name);
    setSubmitting(true);
    try {
      await uploadDocumento(cadastroId, tipo, file);
    } catch (e) { toast.error("Erro ao enviar documento: " + (e instanceof Error ? e.message : "tente novamente")); } finally { setSubmitting(false); }
  };

  const isOk = docStatus === "ok";
  const needsCorrection = docStatus === "em_correcao" || docStatus === "reprovado";

  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">
      {label}
      {obrigatorio && <span className="text-accent ml-0.5">*</span>}
      {isOk && <span className="text-green-400 ml-2 text-[10px] font-bold uppercase tracking-wider">(Aprovado)</span>}
    </p>
    <label className={`flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 transition-colors ${
      isOk ? "border-green-500/30 bg-green-500/5 cursor-not-allowed" :
      needsCorrection ? "border-orange-500 bg-orange-500/5 hover:border-orange-400 cursor-pointer" :
      "border-input-border bg-input-bg hover:border-accent/50 cursor-pointer"
    }`}>
      <Upload size={16} className={isOk ? "text-green-400" : needsCorrection ? "text-orange-400 animate-bounce" : nome ? "text-green-400" : "text-accent"} />
      <span className={`flex-1 text-sm truncate ${isOk ? "text-green-400" : needsCorrection ? "text-orange-300" : "text-text-muted"}`}>
        {nome || "Clique para anexar"}
      </span>
      {submitting && <Loader2 size={14} className="animate-spin text-accent" />}
      {isOk && <span className="text-[10px] text-green-400 font-medium">✓</span>}
      {!isOk && <input type="file" accept=".jpeg,.jpg,.png,.pdf" onChange={handleFile} className="hidden" />}
    </label>
    {needsCorrection && docComentario && (
      <span className="text-orange-400 text-[10px] mt-1 block font-semibold flex items-center gap-1 animate-pulse">
        <AlertTriangle size={11} /> Ajuste necessário: {docComentario}
      </span>
    )}
  </div>;
}
