import { createRoute, useNavigate, useParams } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "~/lib/supabase";
import { buscarCEP } from "~/lib/viacep";
import { uploadDocumento } from "~/lib/documentos";
import { dispararWebhooks } from "~/lib/webhooks";
import { Loader2, CheckCircle, ArrowLeft, AlertTriangle, Send, KeyRound, Upload } from "lucide-react";

export const preCadastroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pre-cadastro/$token",
  component: PreCadastroPage,
});

type Step = "tipo" | "dados" | "endereco" | "documentos" | "verificacao" | "token" | "sucesso" | "expirado";

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

function PreCadastroPage() {
  const { token } = useParams({ from: preCadastroRoute.id });
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("tipo");
  const [loading, setLoading] = useState(true);
  const [cadastroId, setCadastroId] = useState<string | null>(null);
  const [emailToken, setEmailToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);
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

  async function validarToken() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_cadastro_by_token", { token_text: token });
      if (error || !data) { setStep("expirado"); return; }
      const c = typeof data === "string" ? JSON.parse(data) : data;
      setCadastroId(c.id);
      setEmailToken(c.lead_email || "");
      if (c.tipo_pessoa) {
        setForm(prev => ({ ...prev, tipo: c.tipo_pessoa }));
        if (c.status === "dados_enviados" || c.status === "em_analise" || c.status === "em_correcao") {
          setStep("sucesso");
        } else if (c.status_verificacao_token) {
          setStep("sucesso");
        } else {
          setStep("dados");
        }
      }
      if (c.link_expiracao && new Date(c.link_expiracao) < new Date()) {
        setStep("expirado");
      }
    } catch (e) {
      setStep("expirado");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuscarCEP() {
    const cep = form.endereco.cep;
    if (cep.length < 8) return;
    const result = await buscarCEP(cep);
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
      dispararWebhooks("dados_enviados", { cadastro_id: cadastroId, token });
      setStep("verificacao");
    } catch (e: any) {
      setErro(e.message || "Erro ao salvar dados");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnviarToken() {
    try {
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      await supabase
        .from("cadastros")
        .update({
          token_gerado: codigo,
          email_token: emailToken,
          token_expiracao: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          status: "em_analise",
        })
        .eq("id", cadastroId);
      dispararWebhooks("em_analise", { cadastro_id: cadastroId, email: emailToken });
      console.log(`[2FA] Token ${codigo} enviado para ${emailToken}`);
      setStep("token");
    } catch (e) {
      setErro("Erro ao enviar token");
    }
  }

  async function handleValidarToken() {
    try {
      const { data } = await supabase
        .from("cadastros")
        .select("token_gerado, token_expiracao")
        .eq("id", cadastroId)
        .single();
      if (!data) { setTokenValido(false); return; }
      if (new Date(data.token_expiracao) < new Date()) { setTokenValido(false); return; }
      if (data.token_gerado === tokenInput) {
        await supabase.from("cadastros").update({ status_verificacao_token: true }).eq("id", cadastroId);
        setTokenValido(true);
        setStep("sucesso");
      } else {
        setTokenValido(false);
      }
    } catch (e) {
      setTokenValido(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center bg-bg-dark"><Loader2 size={32} className="animate-spin text-accent" /></div>;
  }

  if (step === "expirado") {
    return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-dark p-8">
      <AlertTriangle size={48} className="text-red-400" />
      <h1 className="text-xl font-bold text-text-main">Link Expirado</h1>
      <p className="text-center text-sm text-text-muted">O link acessado expirou. Solicite um novo link ao seu Consultor(a).</p>
    </div>;
  }

  if (step === "sucesso") {
    return <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg-dark p-8">
      <CheckCircle size={48} className="text-green-400" />
      <h1 className="text-xl font-bold text-text-main">Cadastro Enviado!</h1>
      <p className="text-center text-sm text-text-muted">Seus dados foram enviados com sucesso. Nossa equipe analisará as informações e você receberá um retorno em breve.</p>
    </div>;
  }

  const steps = ["tipo","dados","endereco","documentos","verificacao","token"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-dvh bg-bg-dark">
      <div className="flex items-center gap-3 border-b border-border-subtle bg-card px-4 py-3">
        <div className="flex gap-1">
          {["tipo","dados","endereco","documentos","verificacao"].map((s, i) => (
            <div key={s} className={`h-1 w-6 rounded-full ${i <= currentIdx ? "bg-accent" : "bg-input-bg"}`} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-accent">Conexão Implantes</h1>
          <p className="text-xs text-text-muted">Cadastro de Novos Clientes</p>
        </div>

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
            <Campo label="CPF *" value={form.pf.cpf} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, cpf: v } }))} type="tel" />
            <Campo label="E-mail para Comunicação *" value={form.pf.email_comunicacao} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, email_comunicacao: v } }))} type="email" />
            <Campo label="E-mail para NF" value={form.pf.email_nf} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, email_nf: v } }))} type="email" />
            <Campo label="Telefone Fixo" value={form.pf.tel_fixo} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, tel_fixo: v } }))} type="tel" />
            <Campo label="Celular 01" value={form.pf.celular1} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, celular1: v } }))} type="tel" />
            <Campo label="Celular 02" value={form.pf.celular2} onChange={v => setForm(prev => ({ ...prev, pf: { ...prev.pf, celular2: v } }))} type="tel" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("tipo")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={() => setStep("endereco")} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === "dados" && form.tipo === "PJ" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">Preencha todos os campos obrigatórios sinalizados com *</p>
            <Campo label="Razão Social *" value={form.pj.razao_social} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, razao_social: v } }))} />
            <Campo label="Nome Fantasia *" value={form.pj.nome_fantasia} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, nome_fantasia: v } }))} />
            <Campo label="CNPJ *" value={form.pj.cnpj} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, cnpj: v } }))} type="tel" />
            <Campo label="Inscrição Estadual *" value={form.pj.inscricao_estadual} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, inscricao_estadual: v } }))} />
            <Campo label="Número do CRO/TPD *" value={form.pj.cro} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, cro: v } }))} />
            <Campo label="Data emissão CRO/TPD" value={form.pj.data_emissao_cro} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, data_emissao_cro: v } }))} type="date" />
            <Campo label="E-mail para Comunicação *" value={form.pj.email_comunicacao} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, email_comunicacao: v } }))} type="email" />
            <Campo label="E-mail para NF" value={form.pj.email_nf} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, email_nf: v } }))} type="email" />
            <Campo label="Telefone Fixo" value={form.pj.tel_fixo} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, tel_fixo: v } }))} type="tel" />
            <Campo label="Celular 01" value={form.pj.celular1} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, celular1: v } }))} type="tel" />
            <Campo label="Celular 02" value={form.pj.celular2} onChange={v => setForm(prev => ({ ...prev, pj: { ...prev.pj, celular2: v } }))} type="tel" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("tipo")} className="flex-1 rounded-xl border border-input-border py-3 text-sm text-text-muted">Voltar</button>
              <button onClick={() => setStep("endereco")} className="flex-1 rounded-xl bg-accent py-3 text-sm font-medium text-white">Próximo</button>
            </div>
          </div>
        )}

        {step === "endereco" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted mb-2">As informações completas de seu endereço serão exibidas ao digitar o CEP</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Campo label="CEP *" value={form.endereco.cep} onChange={v => setForm(prev => ({ ...prev, endereco: { ...prev.endereco, cep: v } }))} type="tel" />
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

        {step === "verificacao" && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <Send size={48} className="text-accent" />
            <h2 className="text-base font-bold text-text-main">Verificação de 2 Fatores</h2>
            <p className="text-center text-sm text-text-muted">Digite seu e-mail para receber o Token de Verificação</p>
            <input value={emailToken} onChange={e => setEmailToken(e.target.value)} placeholder="Digite seu e-mail" type="email" className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
            <button onClick={handleEnviarToken} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white">Receber Token de Validação</button>
          </div>
        )}

        {step === "token" && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <KeyRound size={48} className="text-accent" />
            <h2 className="text-base font-bold text-text-main">Insira o Token de Validação</h2>
            <p className="text-xs text-text-muted">Token expira em 10 minutos</p>
            <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="000000" type="text" maxLength={6} className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-center text-lg font-mono tracking-widest text-text-main outline-none focus:border-accent min-h-[44px]" />
            {tokenValido === false && <p className="text-xs text-red-400">Token inválido ou expirado. Solicite um novo.</p>}
            <button onClick={handleValidarToken} className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white">Validar Token</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <div>
    <p className="mb-1 text-xs font-medium text-text-muted">{label}</p>
    <input value={value} onChange={e => onChange(e.target.value)} type={type || "text"}
      className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
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
