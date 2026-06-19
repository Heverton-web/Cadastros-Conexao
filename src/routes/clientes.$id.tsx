import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { buscarCadastroCompleto, aprovarCadastro, reprovarCadastro, solicitarCorrecao, STATUS_LABEL, STATUS_COLOR, type Cadastro, type CadastroStatus } from "~/lib/clientes";
import { listarDocumentos, aprovarDocumento, reprovarDocumento, solicitarCorrecaoDocumento, reverterDocumento, setDocumentosMassa, getDocumentosStatus, DOC_STATUS_LABEL, DOC_STATUS_COLOR, getTipoLabel, type Documento } from "~/lib/documentos";
import { logAtividade } from "~/lib/atividades";
import { dispararWebhooks } from "~/lib/webhooks";
import { DocList } from "~/components/ui/doc-viewer";
import { getRevisoes, setRevisaoCampo, setRevisoesMassa, STATUS_REVISAO_LABEL, STATUS_REVISAO_COLOR, type Revisoes, type RevisaoStatus } from "~/lib/revisoes";
import { formatPhone } from "~/lib/utils";
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle, X, FileText, MapPin, Mail, MessageCircle, RotateCcw, Eye } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  "pf.nome": "Nome", "pf.cpf": "CPF", "pf.data_nascimento": "Data de Nascimento", "pf.cro": "CRO", "pf.data_emissao_cro": "Emissão CRO",
  "pj.razao_social": "Razão Social", "pj.nome_fantasia": "Nome Fantasia", "pj.cnpj": "CNPJ", "pj.inscricao_estadual": "Insc. Estadual",
  "pj.email_comunicacao": "Email Comunicação", "pj.tel_fixo": "Telefone Fixo", "pj.celular1": "Celular",
  "pf.email_comunicacao": "Email Comunicação", "pf.tel_fixo": "Telefone Fixo", "pf.celular1": "Celular",
  "email_comunicacao": "Email Comunicação", "tel_fixo": "Telefone Fixo", "celular1": "Celular",
  "end.cep": "CEP", "end.rua": "Logradouro", "end.numero": "Número", "end.bairro": "Bairro", "end.complemento": "Complemento", "end.cidade": "Cidade", "end.estado": "UF"
};

export const clienteDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/clientes/$id",
  component: ClienteDetailPage,
});

type Tab = "dados" | "endereco" | "documentos";
type FieldAction = { campo: string; label: string; tipo: "ok" | "reprovado" | "em_correcao" };

function limparLogradouro(rua: string): string {
  const p = rua.trim().replace(/\s+/g, " ");
  const prefixos = [
    "rua", "r", "avenida", "av\\.?", "travessa", "tv\\.?",
    "praça", "pça\\.?", "praca", "alameda", "al\\.?",
    "rodovia", "rod\\.?", "estrada", "est\\.?", "viela",
    "beco", "largo", "vila", "acesso", "passagem", "quadra", "q\\.?",
    "conjunto", "cj\\.?", "praca",
  ];
  for (const pref of prefixos) {
    const regex = new RegExp(`^${pref}\\s+`, "i");
    if (regex.test(p)) return p.replace(regex, "").trim();
  }
  return p;
}

function ClienteDetailPage() {
  const navigate = useNavigate();
  const { profile, permissoes } = useAuth();
  const { id } = clienteDetailRoute.useParams();
  const [data, setData] = useState<{ cadastro: any; pf: any; pj: any; endereco: any } | null>(null);
  const [docs, setDocs] = useState<Documento[]>([]);
  const [revisoes, setRevisoes] = useState<Revisoes>({});
  const [docStatus, setDocStatus] = useState<string>("nao_enviada");
  const [endAddressType, setEndAddressType] = useState<"clinica" | "entrega" | "faturamento">("clinica");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dados");
  const [showAprovar, setShowAprovar] = useState(false);
  const [showReprovar, setShowReprovar] = useState(false);
  const [showCorrecao, setShowCorrecao] = useState(false);
  const [showResumo, setShowResumo] = useState(false);
  const [codigoCliente, setCodigoCliente] = useState("");
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldAction, setFieldAction] = useState<FieldAction | null>(null);
  const [massaAction, setMassaAction] = useState<{ aba: Tab, tipo: RevisaoStatus } | null>(null);

  useEffect(() => { carregar(); }, [id]);

  async function carregar() {
    setLoading(true);
    try {
      const res = await buscarCadastroCompleto(id);
      setData(res);
      const d = await listarDocumentos(id);
      setDocs(d);
      const st = await getDocumentosStatus(id, data?.cadastro?.tipo_pessoa || null);
      setDocStatus(st);
      const r = await getRevisoes(id);
      setRevisoes(r);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleAprovar() {
    if (!codigoCliente || !data) return;
    setSubmitting(true);
    try {
      await aprovarCadastro(id, codigoCliente);
      await logAtividade("cadastro", id, "aprovado", `Aprovado código ${codigoCliente}`);

      const c = data.cadastro;
      const pf = data.pf;
      const pj = data.pj;
      
      const nomeCliente = c.lead_nome || c.nome_temporario || pf?.nome || pj?.razao_social || "";
      const emailCliente = c.lead_email || pf?.email_comunicacao || pj?.email_comunicacao || "";
      const whatsappCliente = c.lead_whatsapp || pf?.celular1 || pj?.celular1 || "";
      
      const emailConsultor = (c as any).profiles?.email || "";
      const nomeConsultor = (c as any).profiles?.nome || c.colaborador || "";
      const whatsappConsultor = "";
      
      const nomeUsuarioQueAprovou = profile?.nome || profile?.email || "Usuário do Sistema";
      
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      const dataAprovacao = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

      const payload = {
        cadastro_id: id,
        codigo_cliente: codigoCliente,
        nome_cliente: nomeCliente,
        whatsapp_cliente: whatsappCliente,
        email_cliente: emailCliente,
        nome_consultor: nomeConsultor,
        email_consultor: emailConsultor,
        whatsapp_consultor: whatsappConsultor,
        nome_usuario_que_aprovou: nomeUsuarioQueAprovou,
        data_aprovacao: dataAprovacao,
        status_cadastro: "aprovado"
      };

      dispararWebhooks("botao_aprovar", payload);
      dispararWebhooks("aprovado", payload);
      setShowAprovar(false); carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  async function handleReprovar() {
    if (!motivo || !data) return;
    setSubmitting(true);
    try {
      await reprovarCadastro(id, motivo);
      await logAtividade("cadastro", id, "reprovado", motivo);
      
      const c = data.cadastro;
      const pf = data.pf;
      const pj = data.pj;
      
      const nomeCliente = c.lead_nome || c.nome_temporario || pf?.nome || pj?.razao_social || "";
      const emailCliente = c.lead_email || pf?.email_comunicacao || pj?.email_comunicacao || "";
      const whatsappCliente = c.lead_whatsapp || pf?.celular1 || pj?.celular1 || "";
      
      const emailConsultor = (c as any).profiles?.email || "";
      const nomeConsultor = (c as any).profiles?.nome || c.colaborador || "";
      const whatsappConsultor = "";
      
      const nomeUsuarioQueAnalisou = profile?.nome || profile?.email || "Usuário do Sistema";
      
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      const dataAnalise = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

      const payload = {
        cadastro_id: id,
        motivo,
        nome_cliente: nomeCliente,
        codigo_cliente: c.codigo_cliente || "",
        whatsapp_cliente: whatsappCliente,
        email_cliente: emailCliente,
        nome_consultor: nomeConsultor,
        email_consultor: emailConsultor,
        whatsapp_consultor: whatsappConsultor,
        texto_correcoes: motivo,
        nome_usuario_que_analisou: nomeUsuarioQueAnalisou,
        data_analise: dataAnalise,
        status_cadastro: "reprovado"
      };

      dispararWebhooks("botao_reprovar", payload);
      dispararWebhooks("reprovado", payload);
      setShowReprovar(false); carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  async function handleCorrecao() {
    if (!motivo || !data) return;
    setSubmitting(true);
    try {
      await solicitarCorrecao(id, motivo);
      await logAtividade("cadastro", id, "correcao", motivo);
      
      const c = data.cadastro;
      const pf = data.pf;
      const pj = data.pj;
      
      const nomeCliente = c.lead_nome || c.nome_temporario || pf?.nome || pj?.razao_social || "";
      const emailCliente = c.lead_email || pf?.email_comunicacao || pj?.email_comunicacao || "";
      const whatsappCliente = c.lead_whatsapp || pf?.celular1 || pj?.celular1 || "";
      
      const emailConsultor = (c as any).profiles?.email || "";
      const nomeConsultor = (c as any).profiles?.nome || c.colaborador || "";
      const whatsappConsultor = "";
      
      const nomeUsuarioQueSolicitou = profile?.nome || profile?.email || "Usuário do Sistema";
      
      const date = new Date();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      const dataSolicitacao = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

      const payload = {
        cadastro_id: id,
        motivo,
        nome_cliente: nomeCliente,
        codigo_cliente: c.codigo_cliente || "",
        whatsapp_cliente: whatsappCliente,
        email_cliente: emailCliente,
        nome_consultor: nomeConsultor,
        email_consultor: emailConsultor,
        whatsapp_consultor: whatsappConsultor,
        texto_correcoes: motivo,
        nome_usuario_solicitante: nomeUsuarioQueSolicitou,
        data_solicitacao: dataSolicitacao,
        status_cadastro: "em_correcao"
      };

      dispararWebhooks("botao_corrigir", payload);
      dispararWebhooks("em_correcao", payload);
      setShowCorrecao(false); carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  async function handleFieldAction(campo: string, tipo: string, label: string, comentario: string) {
    try {
      const comentarioFinal = tipo === "ok" ? null : comentario;
      await setRevisaoCampo(id, campo, tipo as any, comentarioFinal);
      await logAtividade("cadastro", id, `campo_${tipo}`, `${label}: ${comentarioFinal || "ok"}`);
      setFieldAction(null);
      setMotivo("");
      const r = await getRevisoes(id);
      setRevisoes(r);
    } catch (e) { console.error(e); }
  }

  function abrirReprovar() {
    const partes: string[] = [];
    for (const [campo, r] of Object.entries(revisoes)) {
      if (r.status === "reprovado" || r.status === "em_correcao") {
        const labelText = LABEL_MAP[campo] || campo;
        const statusText = r.status === "em_correcao" ? "correção" : "reprovado";
        partes.push(`- ${labelText}: ${r.comentario || "Nenhum comentário"} (${statusText})`);
      }
    }
    for (const doc of docs) {
      if (doc.status === "reprovado" || doc.status === "em_correcao") {
        const labelText = getTipoLabel(doc.tipo);
        const statusText = doc.status === "em_correcao" ? "correção" : "reprovado";
        partes.push(`- Documento ${labelText}: ${doc.comentario_reprovacao || "Nenhum comentário"} (${statusText})`);
      }
    }
    setMotivo(partes.length > 0 ? partes.join("\n") + "\n\n" : "");
    setShowReprovar(true);
  }

  function abrirCorrecao() {
    const partes: string[] = [];
    for (const [campo, r] of Object.entries(revisoes)) {
      if (r.status === "reprovado" || r.status === "em_correcao") {
        const labelText = LABEL_MAP[campo] || campo;
        const statusText = r.status === "em_correcao" ? "correção" : "reprovado";
        partes.push(`- ${labelText}: ${r.comentario || "Nenhum comentário"} (${statusText})`);
      }
    }
    for (const doc of docs) {
      if (doc.status === "reprovado" || doc.status === "em_correcao") {
        const labelText = getTipoLabel(doc.tipo);
        const statusText = doc.status === "em_correcao" ? "correção" : "reprovado";
        partes.push(`- Documento ${labelText}: ${doc.comentario_reprovacao || "Nenhum comentário"} (${statusText})`);
      }
    }
    setMotivo(partes.length > 0 ? partes.join("\n") + "\n\n" : "");
    setShowCorrecao(true);
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 size={24} className="animate-spin text-accent" /></div>;
  if (!data) return <p className="p-4 text-text-muted">Cliente não encontrado</p>;

  const { cadastro: c, pf, pj, endereco: end } = data;
  const nome = c.lead_nome || c.nome_temporario || pf?.nome || pj?.razao_social || "—";
  const isFinal = c.status === "aprovado" || c.status === "reprovado";
  const podeAcaoCampo = permissoes?.aprovar_campo === true;

  const camposDados = [
    pf?.nome && "pf.nome", pf?.cpf && "pf.cpf", pf?.data_nascimento && "pf.data_nascimento",
    pf?.cro && "pf.cro", pf?.data_emissao_cro && "pf.data_emissao_cro",
    pj?.razao_social && "pj.razao_social", pj?.nome_fantasia && "pj.nome_fantasia",
    pj?.cnpj && "pj.cnpj", pj?.inscricao_estadual && "pj.inscricao_estadual",
    (pf?.email_comunicacao || pj?.email_comunicacao) && (pf ? "pf.email_comunicacao" : "pj.email_comunicacao"),
    (pf?.tel_fixo || pj?.tel_fixo) && (pf ? "pf.tel_fixo" : "pj.tel_fixo"),
    (pf?.celular1 || pj?.celular1) && (pf ? "pf.celular1" : "pj.celular1")
  ].filter(Boolean) as string[];

  const camposEndereco = [
    end?.cep && "end.cep", end?.rua && "end.rua", end?.numero && "end.numero",
    end?.bairro && "end.bairro", end?.complemento && "end.complemento",
    end?.cidade && "end.cidade", end?.estado && "end.estado"
  ].filter(Boolean) as string[];

  function BotoesAcaoMassa({ aba }: { aba: Tab }) {
    if (!podeAcaoCampo || isFinal) return null;
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button onClick={() => handleMassaAction(aba, "ok")} disabled={submitting} className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-2.5 py-1.5 text-[10px] font-medium text-green-500 hover:bg-green-500/20 transition">
            <CheckCircle size={14} /> Aprovar Todos
          </button>
          <button onClick={() => handleMassaAction(aba, "reprovado")} disabled={submitting} className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[10px] font-medium text-red-500 hover:bg-red-500/20 transition">
            <XCircle size={14} /> Reprovar Todos
          </button>
          <button onClick={() => handleMassaAction(aba, "em_correcao")} disabled={submitting} className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1.5 text-[10px] font-medium text-orange-500 hover:bg-orange-500/20 transition">
            <AlertTriangle size={14} /> Corrigir Todos
          </button>
          <button onClick={() => handleMassaAction(aba, "pendente")} disabled={submitting} className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1.5 text-[10px] font-medium text-accent hover:bg-accent/20 transition">
            <RotateCcw size={14} /> Revisar Todos
          </button>
        </div>
      </div>
    );
  }

  function handleMassaAction(aba: Tab, tipo: RevisaoStatus) {
    if (tipo === "reprovado" || tipo === "em_correcao") {
      setMassaAction({ aba, tipo });
      setMotivo("");
    } else {
      executarMassaAction(aba, tipo, "");
    }
  }

  async function executarMassaAction(aba: Tab, tipo: RevisaoStatus, comentario: string) {
    if (!podeAcaoCampo || isFinal) return;
    setSubmitting(true);
    try {
      if (aba === "documentos") {
        const pendentes = docs.filter(d => d.status !== tipo);
        if (pendentes.length > 0) {
          await setDocumentosMassa(
            pendentes.map(d => d.id),
            tipo,
            (tipo === "ok" || tipo === "pendente") ? null : comentario
          );
          await logAtividade("cadastro", id, `massa_${tipo}`, `${pendentes.length} documentos alterados para ${tipo}`);
          const d = await listarDocumentos(id);
          setDocs(d);
        }
      } else {
        const campos = aba === "dados" ? camposDados : camposEndereco;
        const pendentes = campos.filter(c => (revisoes[c]?.status || "pendente") !== tipo);
        if (pendentes.length > 0) {
          const updates: Record<string, any> = {};
          pendentes.forEach(c => {
            updates[c] = { status: tipo, comentario: (tipo === "ok" || tipo === "pendente") ? null : comentario };
          });
          await setRevisoesMassa(id, updates);
          await logAtividade("cadastro", id, `massa_${tipo}`, `${pendentes.length} campos alterados para ${tipo}`);
          const r = await getRevisoes(id);
          setRevisoes(r);
        }
      }
      setMassaAction(null);
      setMotivo("");
    } catch(e) { console.error(e); } finally { setSubmitting(false); }
  }
  const hasPendingOrErrors = camposDados.some(c => revisoes[c]?.status !== "ok") || 
                             (end ? camposEndereco.some(c => revisoes[c]?.status !== "ok") : false) || 
                             docs.length === 0 || docs.some(d => d.status !== "ok");
  const isAprovacaoBloqueada = hasPendingOrErrors;

  return (
    <div className="flex flex-col gap-4 p-4 pb-28">
      <div className="flex items-center gap-3">
        <button onClick={() => window.history.back()} className="text-text-muted hover:text-text-main"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-text-main truncate">{nome}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`flex items-center gap-1 self-start rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[c.status as CadastroStatus]}`}>
          {c.status === "aprovado" ? <CheckCircle size={14} /> : c.status === "reprovado" ? <XCircle size={14} /> : <AlertTriangle size={14} />}
          {STATUS_LABEL[c.status as CadastroStatus]}
        </span>
        {c.status !== "aprovado" && (
          <span className={`flex items-center gap-1 self-start rounded-full px-3 py-1 text-[10px] font-medium ${DOC_STATUS_COLOR[docStatus as keyof typeof DOC_STATUS_COLOR]}`}>
            <FileText size={12} />
            {DOC_STATUS_LABEL[docStatus as keyof typeof DOC_STATUS_LABEL]}
          </span>
        )}
        {c.status === "aprovado" && c.codigo_cliente && (
          <span className="flex items-center gap-1 self-start rounded-full px-3 py-1 text-xs font-bold bg-accent/10 text-accent border border-accent/20" title="Código do Cliente">
            CLI-{c.codigo_cliente}
          </span>
        )}
        {c.comentario_reprovacao && !isFinal && (
          <button onClick={() => setShowResumo(true)} className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition" title="Ver Resumo">
            <Eye size={14} />
          </button>
        )}
        {c.comentario_reprovacao && c.status === "reprovado" && (
          <button onClick={() => setShowResumo(true)} className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition" title="Ver Resumo">
            <Eye size={14} />
          </button>
        )}
      </div>

      {permissoes?.aprovar_cadastro === true && !isFinal && (c.status === "em_analise" || c.status === "dados_enviados" || c.status === "em_correcao") && (
        <div className="w-full flex gap-2 px-4 py-3 bg-card rounded-xl shadow-lg">
          <button onClick={abrirCorrecao} className="flex-1 rounded-xl bg-orange-600/80 py-3 text-sm font-medium text-white max-h-[45px]">Corrigir</button>
          <button onClick={() => isAprovacaoBloqueada ? alert("Não é possível aprovar. Todos os dados e documentos precisam estar aprovados.") : (setCodigoCliente(""), setShowAprovar(true))} disabled={isAprovacaoBloqueada} title={isAprovacaoBloqueada ? "Todos os campos devem estar aprovados" : ""} className="flex-1 rounded-xl bg-green-700/80 py-3 text-sm font-medium text-white max-h-[45px] disabled:opacity-50">Aprovar</button>
          <button onClick={abrirReprovar} className="flex-1 rounded-xl bg-red-700/80 py-3 text-sm font-medium text-white max-h-[45px]">Reprovar</button>
        </div>
      )}

      <div className="flex gap-1 rounded-xl bg-card p-1">
        {(["dados","endereco","documentos"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${tab === t ? "bg-accent text-white" : "text-text-muted hover:text-text-main"}`}>
            {t === "dados" ? "Dados" : t === "endereco" ? "Endereço" : "Documentos"}
          </button>
        ))}
      </div>

      {tab === "dados" && (
        <div className="rounded-xl bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-text-main">Dados do Cliente</h2>
            <BotoesAcaoMassa aba="dados" />
          </div>
          <div className="flex flex-col gap-3">
            {c.tipo_pessoa && <span className="self-start rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{c.tipo_pessoa}</span>}
            {pf?.nome && <CampoRevisavel campoKey="pf.nome" label="Nome Completo" value={pf.nome} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pf.nome", label: "Nome Completo", tipo })} />}
            {pf?.cpf && <CampoRevisavel campoKey="pf.cpf" label="CPF" value={pf.cpf} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pf.cpf", label: "CPF", tipo })} />}
            {pf?.data_nascimento && <CampoRevisavel campoKey="pf.data_nascimento" label="Data de Nascimento" value={new Date(pf.data_nascimento).toLocaleDateString("pt-BR")} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pf.data_nascimento", label: "Data de Nascimento", tipo })} />}
            {pf?.cro && <CampoRevisavel campoKey="pf.cro" label="CRO/TPD" value={pf.cro} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pf.cro", label: "CRO/TPD", tipo })} />}
            {pf?.data_emissao_cro && <CampoRevisavel campoKey="pf.data_emissao_cro" label="Emissão CRO" value={new Date(pf.data_emissao_cro).toLocaleDateString("pt-BR")} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pf.data_emissao_cro", label: "Emissão CRO", tipo })} />}
            {pj?.razao_social && <CampoRevisavel campoKey="pj.razao_social" label="Razão Social" value={pj.razao_social} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pj.razao_social", label: "Razão Social", tipo })} />}
            {pj?.nome_fantasia && <CampoRevisavel campoKey="pj.nome_fantasia" label="Nome Fantasia" value={pj.nome_fantasia} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pj.nome_fantasia", label: "Nome Fantasia", tipo })} />}
            {pj?.cnpj && <CampoRevisavel campoKey="pj.cnpj" label="CNPJ" value={pj.cnpj} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pj.cnpj", label: "CNPJ", tipo })} />}
            {pj?.inscricao_estadual && <CampoRevisavel campoKey="pj.inscricao_estadual" label="Inscrição Estadual" value={pj.inscricao_estadual} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "pj.inscricao_estadual", label: "Inscrição Estadual", tipo })} />}
{(() => {
  const email = pf?.email_comunicacao || pj?.email_comunicacao;
  return email ? <CampoRevisavel campoKey={pf ? "pf.email_comunicacao" : "pj.email_comunicacao"} label="E-mail Comunicação" value={email} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.email_comunicacao" : "pj.email_comunicacao", label: "E-mail Comunicação", tipo })} iconBefore={<a href={`mailto:${email}`} className="inline-flex items-center justify-center rounded-lg bg-accent/10 p-1.5 text-accent hover:bg-accent/20 transition" title="Enviar e-mail"><Mail size={14} /></a>} /> : null;
})()}
{(pf?.tel_fixo || pj?.tel_fixo) && <CampoRevisavel campoKey={pf ? "pf.tel_fixo" : "pj.tel_fixo"} label="Telefone Fixo" value={formatPhone(pf?.tel_fixo || pj?.tel_fixo)} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.tel_fixo" : "pj.tel_fixo", label: "Telefone Fixo", tipo })} />}
{(() => {
  const cel = pf?.celular1 || pj?.celular1;
  return cel ? <CampoRevisavel campoKey={pf ? "pf.celular1" : "pj.celular1"} label="Celular" value={formatPhone(cel)} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.celular1" : "pj.celular1", label: "Celular", tipo })} iconBefore={<a href={`https://wa.me/${cel.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-green-500/10 p-1.5 text-green-400 hover:bg-green-500/20 transition" title="Abrir WhatsApp"><MessageCircle size={14} /></a>} /> : null;
})()}
          </div>
        </div>
      )}

      {tab === "endereco" && end && (
        <div className="rounded-xl bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-text-main">Endereço</h2>
            <BotoesAcaoMassa aba="endereco" />
          </div>
          <div className="flex gap-1 rounded-lg bg-bg-dark p-1 mb-4">
            {(["clinica","entrega","faturamento"] as const).map((t) => (
              <button key={t} onClick={() => setEndAddressType(t)}
                className={`flex-1 rounded-md py-1.5 text-[10px] font-medium transition ${endAddressType === t ? "bg-accent text-white" : "text-text-muted hover:text-text-main"}`}>
                {t === "clinica" ? "Clínica" : t === "entrega" ? "Entrega" : "Faturamento"}
              </button>
            ))}
          </div>
          {(() => {
            const ruaLimpa = limparLogradouro(end.rua || "");
            let enderecoFull = ruaLimpa;
            if (end.numero) enderecoFull += `, ${end.numero}`;
            if (end.complemento) enderecoFull += ` - ${end.complemento}`;
            if (end.bairro) enderecoFull += ` - ${end.bairro}`;
            if (end.cidade) enderecoFull += `, ${end.cidade}`;
            if (end.estado) enderecoFull += ` - ${end.estado}`;
            if (end.cep) enderecoFull += `, ${end.cep}`;
            
            if (!ruaLimpa && enderecoFull.startsWith(", ")) enderecoFull = enderecoFull.substring(2);
            if (!ruaLimpa && enderecoFull.startsWith(" - ")) enderecoFull = enderecoFull.substring(3);
            return enderecoFull ? (
              <div className="flex items-start gap-2 mb-4 rounded-xl bg-accent/5 border border-accent/10 p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-muted mb-0.5">Endereço Completo</p>
                  <p className="text-sm text-text-main">{enderecoFull}</p>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFull)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 shrink-0 rounded-lg bg-accent/10 px-3 py-2 text-[11px] font-medium text-accent hover:bg-accent/20 transition">
                  <MapPin size={14} /> Abrir no Mapa
                </a>
              </div>
            ) : null;
          })()}
          <div className="flex flex-col gap-3">
            {end.cep && <CampoRevisavel campoKey="end.cep" label="CEP" value={end.cep} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.cep", label: "CEP", tipo })} />}
            {end.rua && <CampoRevisavel campoKey="end.rua" label="Rua" value={end.rua} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.rua", label: "Rua", tipo })} />}
            {end.numero && <CampoRevisavel campoKey="end.numero" label="Número" value={end.numero} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.numero", label: "Número", tipo })} />}
            {end.bairro && <CampoRevisavel campoKey="end.bairro" label="Bairro" value={end.bairro} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.bairro", label: "Bairro", tipo })} />}
            {end.complemento && <CampoRevisavel campoKey="end.complemento" label="Complemento" value={end.complemento} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.complemento", label: "Complemento", tipo })} />}
            {end.cidade && <CampoRevisavel campoKey="end.cidade" label="Cidade" value={end.cidade} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.cidade", label: "Cidade", tipo })} />}
            {end.estado && <CampoRevisavel campoKey="end.estado" label="Estado" value={end.estado} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: "end.estado", label: "Estado", tipo })} />}
          </div>
        </div>
      )}

      {tab === "documentos" && (
        <div className="rounded-xl bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-text-main">Documentos</h2>
            <BotoesAcaoMassa aba="documentos" />
          </div>
          <DocList
            docs={docs}
            podeVisualizar={permissoes?.visualizar_documento === true}
            podeAcao={podeAcaoCampo}
            onAprovar={async (docId) => {
              try {
                await aprovarDocumento(docId);
                const doc = docs.find(d => d.id === docId);
                await logAtividade("cadastro", id, "doc_aprovado", `Documento ${doc?.tipo} aprovado`);
                dispararWebhooks("botao_aprovar", { cadastro_id: id, documento_id: docId });
                const d = await listarDocumentos(id);
                setDocs(d);
              } catch (e) { console.error(e); }
            }}
            onReprovar={async (docId, motivo) => {
              try {
                await reprovarDocumento(docId, motivo);
                const doc = docs.find(d => d.id === docId);
                await logAtividade("cadastro", id, "doc_reprovado", `Documento ${doc?.tipo} reprovado: ${motivo}`);
                dispararWebhooks("botao_reprovar", { cadastro_id: id, documento_id: docId, motivo });
                const d = await listarDocumentos(id);
                setDocs(d);
              } catch (e) { console.error(e); }
            }}
            onCorrigir={async (docId, comentario) => {
              try {
                await solicitarCorrecaoDocumento(docId, comentario);
                const doc = docs.find(d => d.id === docId);
                await logAtividade("cadastro", id, "doc_correcao", `Correção solicitada para ${doc?.tipo}: ${comentario}`);
                dispararWebhooks("botao_corrigir", { cadastro_id: id, documento_id: docId, comentario });
                const d = await listarDocumentos(id);
                setDocs(d);
              } catch (e) { console.error(e); }
            }}
          />
        </div>
      )}

      {showAprovar && <Modal titulo="Aprovar Cadastro" descricao="Insira o Código do Novo Cliente gerado no Protheus" onClose={() => setShowAprovar(false)}>
        <input value={codigoCliente} onChange={(e) => setCodigoCliente(e.target.value)} placeholder="Código do Cliente" className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
        <div className="flex gap-3"><button onClick={() => setShowAprovar(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted max-h-[45px]">Cancelar</button><button onClick={handleAprovar} disabled={!codigoCliente || submitting} className="flex-1 rounded-xl bg-green-700/80 py-3 text-sm font-medium text-white disabled:opacity-50 max-h-[45px]">Aprovar</button></div>
      </Modal>}

      {showReprovar && <Modal titulo="Reprovar Cadastro" descricao="Revise os Motivos da Reprovação" onClose={() => setShowReprovar(false)}>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Nenhuma pendência encontrada. Motivo adicional..." rows={6} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent" />
        <div className="flex gap-3"><button onClick={() => setShowReprovar(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted max-h-[45px]">Cancelar</button><button onClick={handleReprovar} disabled={!motivo || submitting} className="flex-1 rounded-xl bg-red-700/80 py-3 text-sm font-medium text-white disabled:opacity-50 max-h-[45px]">Reprovar</button></div>
      </Modal>}

      {showCorrecao && <Modal titulo="Solicitar Correção" descricao="Revise o que precisa ser corrigido" onClose={() => setShowCorrecao(false)}>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Nenhuma pendência encontrada. Correções..." rows={6} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent" />
        <div className="flex gap-3"><button onClick={() => setShowCorrecao(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted max-h-[45px]">Cancelar</button><button onClick={handleCorrecao} disabled={!motivo || submitting} className="flex-1 rounded-xl bg-orange-600/80 py-3 text-sm font-medium text-white disabled:opacity-50 max-h-[45px]">Solicitar</button></div>
      </Modal>}

      {massaAction && <Modal titulo={`Ação em Massa (${massaAction.tipo === "reprovado" ? "Reprovação" : "Correção"})`} descricao={`Descreva o motivo para todos os itens da aba ${massaAction.aba === "dados" ? "Dados do Cliente" : massaAction.aba === "endereco" ? "Endereço" : "Documentos"}`} onClose={() => { setMassaAction(null); setMotivo(""); }}>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Descreva o motivo..." rows={5} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent" autoFocus />
        <div className="flex gap-3"><button onClick={() => { setMassaAction(null); setMotivo(""); }} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted max-h-[45px]">Cancelar</button><button onClick={() => executarMassaAction(massaAction.aba, massaAction.tipo, motivo)} disabled={!motivo.trim() || submitting} className={`flex-1 rounded-xl py-3 text-sm font-medium text-white disabled:opacity-50 max-h-[45px] ${massaAction.tipo === "reprovado" ? "bg-red-700/80" : "bg-orange-600/80"}`}>{massaAction.tipo === "reprovado" ? "Reprovar Todos" : "Solicitar Correção"}</button></div>
      </Modal>}

      {fieldAction && (
        <FieldActionModal
          action={fieldAction}
          onClose={() => { setFieldAction(null); setMotivo(""); }}
          onConfirm={async (comentario) => {
            await handleFieldAction(fieldAction.campo, fieldAction.tipo, fieldAction.label, comentario);
          }}
        />
      )}

      {showResumo && c.comentario_reprovacao && (
        <Modal titulo={c.status === "reprovado" ? "Motivo da Reprovação" : "Correção Solicitada"} descricao="Resumo das pendências" onClose={() => setShowResumo(false)}>
          <div className={`rounded-xl p-4 border ${c.status === "reprovado" ? "bg-red-500/5 border-red-500/20" : "bg-orange-500/5 border-orange-500/20"}`}>
            <p className="text-sm whitespace-pre-wrap text-text-main font-mono leading-relaxed">{c.comentario_reprovacao}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CampoRevisavel({ campoKey, label, value, revisoes, podeAcao, onAction, actions, iconBefore }: {
  campoKey: string;
  label: string;
  value: string;
  revisoes: Revisoes;
  podeAcao: boolean;
  onAction: (tipo: "ok" | "reprovado" | "em_correcao") => void;
  actions?: React.ReactNode;
  iconBefore?: React.ReactNode;
}) {
  const rev = revisoes[campoKey];
  const status: RevisaoStatus = rev?.status || "pendente";

  const [isRevising, setIsRevising] = useState(false);

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
        <div className="flex items-center gap-2">
          {iconBefore && <span className="shrink-0">{iconBefore}</span>}
          <p className="text-sm text-text-main truncate">{value || "—"}</p>
          {status !== "pendente" && !isRevising && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_REVISAO_COLOR[status]}`}>{STATUS_REVISAO_LABEL[status]}</span>
          )}
        </div>
        {rev?.comentario && (
          <p className="text-[10px] text-text-muted mt-0.5 italic">{rev.comentario}</p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0 pt-4">
        {actions}
        {podeAcao && (
          <>
            {status !== "pendente" && !isRevising ? (
              <button onClick={() => setIsRevising(true)} className="rounded-lg px-2 py-1 text-[10px] font-medium text-accent hover:bg-accent/10 transition border border-accent/20">
                Revisar
              </button>
            ) : (
              <>
                <button onClick={() => { setIsRevising(false); onAction("ok"); }} className="rounded-lg p-1 text-green-400 hover:bg-green-500/10 transition" title="Aprovar campo">
                  <CheckCircle size={14} />
                </button>
                <button onClick={() => { setIsRevising(false); onAction("reprovado"); }} className="rounded-lg p-1 text-red-400 hover:bg-red-500/10 transition" title="Reprovar campo">
                  <XCircle size={14} />
                </button>
                <button onClick={() => { setIsRevising(false); onAction("em_correcao"); }} className="rounded-lg p-1 text-orange-400 hover:bg-orange-500/10 transition" title="Solicitar correção">
                  <AlertTriangle size={14} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FieldActionModal({ action, onClose, onConfirm }: {
  action: FieldAction;
  onClose: () => void;
  onConfirm: (comentario: string) => void;
}) {
  const [comentario, setComentario] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-base font-bold text-text-main mb-2">
          {action.tipo === "ok" ? "Aprovar" : action.tipo === "reprovado" ? "Reprovar" : "Solicitar Correção"} — {action.label}
        </h2>
        <p className="text-xs text-text-muted mb-4">
          {action.tipo === "ok" ? "Confirma a aprovação deste campo?" :
           action.tipo === "reprovado" ? "Descreva o motivo da reprovação:" :
           "Descreva o que precisa ser corrigido:"}
        </p>
        {action.tipo !== "ok" && (
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
            rows={3} placeholder="Motivo..." autoFocus
            className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent resize-none min-h-[80px]"
          />
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted max-h-[45px]">Cancelar</button>
          <button onClick={() => onConfirm(comentario)}
            disabled={action.tipo !== "ok" && !comentario.trim()}
            className={`flex-1 rounded-xl py-3 text-sm font-medium text-white disabled:opacity-50 max-h-[45px] ${
              action.tipo === "ok" ? "bg-green-700/80" : action.tipo === "reprovado" ? "bg-red-700/80" : "bg-orange-600/80"
            }`}>
            {action.tipo === "ok" ? "Aprovar" : action.tipo === "reprovado" ? "Reprovar" : "Solicitar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ titulo, descricao, onClose, children }: { titulo: string; descricao?: string; onClose?: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
    <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-text-main">{titulo}</h2>
        {onClose && <button onClick={onClose} className="text-text-muted hover:text-text-main"><X size={20} /></button>}
      </div>
      {descricao && <p className="mb-3 text-xs text-text-muted">{descricao}</p>}{children}
    </div>
  </div>;
}
