import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { buscarCadastroCompleto, aprovarCadastro, reprovarCadastro, solicitarCorrecao, STATUS_LABEL, STATUS_COLOR, type Cadastro, type CadastroStatus } from "~/lib/clientes";
import { listarDocumentos, aprovarDocumento, reprovarDocumento, solicitarCorrecaoDocumento, getDocumentosStatus, DOC_STATUS_LABEL, DOC_STATUS_COLOR, type Documento } from "~/lib/documentos";
import { logAtividade } from "~/lib/atividades";
import { dispararWebhooks } from "~/lib/webhooks";
import { DocList } from "~/components/ui/doc-viewer";
import { getRevisoes, setRevisaoCampo, STATUS_REVISAO_LABEL, STATUS_REVISAO_COLOR, type Revisoes, type RevisaoStatus } from "~/lib/revisoes";
import { formatPhone } from "~/lib/utils";
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle, X, FileText, MapPin, Mail, MessageCircle } from "lucide-react";

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
  const { profile } = useAuth();
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
  const [codigoCliente, setCodigoCliente] = useState("");
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldAction, setFieldAction] = useState<FieldAction | null>(null);

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
    if (!codigoCliente) return;
    setSubmitting(true);
    try {
      await aprovarCadastro(id, codigoCliente);
      await logAtividade("cadastro", id, "aprovado", `Aprovado código ${codigoCliente}`);
      dispararWebhooks("botao_aprovar", { cadastro_id: id, codigo_cliente: codigoCliente });
      dispararWebhooks("aprovado", { cadastro_id: id, codigo_cliente: codigoCliente });
      setShowAprovar(false); carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  async function handleReprovar() {
    if (!motivo) return;
    setSubmitting(true);
    try {
      await reprovarCadastro(id, motivo);
      await logAtividade("cadastro", id, "reprovado", motivo);
      dispararWebhooks("botao_reprovar", { cadastro_id: id, motivo });
      dispararWebhooks("reprovado", { cadastro_id: id, motivo });
      setShowReprovar(false); carregar();
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  }

  async function handleCorrecao() {
    if (!motivo) return;
    setSubmitting(true);
    try {
      await solicitarCorrecao(id, motivo);
      await logAtividade("cadastro", id, "correcao", motivo);
      dispararWebhooks("botao_corrigir", { cadastro_id: id, motivo });
      dispararWebhooks("em_correcao", { cadastro_id: id, motivo });
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
        partes.push(`- ${campo}: ${r.comentario || r.status}`);
      }
    }
    for (const doc of docs) {
      if (doc.status === "reprovado" || doc.status === "em_correcao") {
        partes.push(`- Documento ${doc.tipo}: ${doc.comentario_reprovacao || doc.status}`);
      }
    }
    setMotivo(partes.length > 0 ? partes.join("\n") + "\n\n" : "");
    setShowReprovar(true);
  }

  function abrirCorrecao() {
    const partes: string[] = [];
    for (const [campo, r] of Object.entries(revisoes)) {
      if (r.status === "reprovado" || r.status === "em_correcao") {
        partes.push(`- ${campo}: ${r.comentario || r.status}`);
      }
    }
    for (const doc of docs) {
      if (doc.status === "reprovado" || doc.status === "em_correcao") {
        partes.push(`- Documento ${doc.tipo}: ${doc.comentario_reprovacao || doc.status}`);
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
  const podeAcaoCampo = profile?.ambiente === "cadastro" || (profile?.ambiente === "ambos" && profile?.role === "admin");

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
        <span className={`flex items-center gap-1 self-start rounded-full px-3 py-1 text-[10px] font-medium ${DOC_STATUS_COLOR[docStatus as keyof typeof DOC_STATUS_COLOR]}`}>
          <FileText size={12} />
          {DOC_STATUS_LABEL[docStatus as keyof typeof DOC_STATUS_LABEL]}
        </span>
      </div>

      {c.comentario_reprovacao && !isFinal && (
        <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-3">
          <p className="text-xs font-semibold text-orange-400 mb-1">Correção Solicitada</p>
          <p className="text-sm text-text-main whitespace-pre-wrap">{c.comentario_reprovacao}</p>
        </div>
      )}
      {c.comentario_reprovacao && c.status === "reprovado" && (
        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
          <p className="text-xs font-semibold text-red-400 mb-1">Motivo da Reprovação</p>
          <p className="text-sm text-text-main whitespace-pre-wrap">{c.comentario_reprovacao}</p>
        </div>
      )}
      {c.codigo_cliente && (
        <div className="rounded-xl bg-accent/5 border border-accent/20 p-3">
          <p className="text-xs font-semibold text-accent mb-1">Código do Cliente (Protheus)</p>
          <p className="text-sm text-text-main font-mono">{c.codigo_cliente}</p>
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
  return email ? <CampoRevisavel campoKey={pf ? "pf.email_comunicacao" : "pj.email_comunicacao"} label="E-mail Comunicação" value={email} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.email_comunicacao" : "pj.email_comunicacao", label: "E-mail Comunicação", tipo })} actions={<a href={`mailto:${email}`} className="rounded-lg p-1 text-accent hover:bg-accent/10 transition" title="Enviar e-mail"><Mail size={14} /></a>} /> : null;
})()}
{(pf?.tel_fixo || pj?.tel_fixo) && <CampoRevisavel campoKey={pf ? "pf.tel_fixo" : "pj.tel_fixo"} label="Telefone Fixo" value={formatPhone(pf?.tel_fixo || pj?.tel_fixo)} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.tel_fixo" : "pj.tel_fixo", label: "Telefone Fixo", tipo })} />}
{(() => {
  const cel = pf?.celular1 || pj?.celular1;
  return cel ? <CampoRevisavel campoKey={pf ? "pf.celular1" : "pj.celular1"} label="Celular" value={formatPhone(cel)} revisoes={revisoes} podeAcao={podeAcaoCampo && !isFinal} onAction={(tipo) => setFieldAction({ campo: pf ? "pf.celular1" : "pj.celular1", label: "Celular", tipo })} actions={<a href={`https://wa.me/${cel.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1 text-green-400 hover:bg-green-500/10 transition" title="Abrir WhatsApp"><MessageCircle size={14} /></a>} /> : null;
})()}
          </div>
        </div>
      )}

      {tab === "endereco" && end && (
        <div className="rounded-xl bg-card p-4 shadow-lg">
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
            const parts = [ruaLimpa, end.numero && `nº ${end.numero}`, end.complemento, end.bairro, end.cidade && end.estado && `${end.cidade} - ${end.estado}`, end.cep].filter(Boolean);
            const enderecoFull = parts.join(", ");
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
          <DocList
            docs={docs}
            podeVisualizar={profile?.is_super_admin === true || profile?.ambiente !== "consultor"}
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

      {profile?.ambiente !== "consultor" && !isFinal && (c.status === "em_analise" || c.status === "dados_enviados" || c.status === "em_correcao") && (
        <div className="fixed bottom-20 left-0 right-0 flex gap-2 px-4 py-3 bg-gradient-to-t from-bg-dark via-bg-dark/95 to-transparent">
          <button onClick={abrirCorrecao} className="flex-1 rounded-xl border border-orange-500/50 py-3 text-sm font-medium text-orange-400">Corrigir</button>
          <button onClick={() => { setCodigoCliente(""); setShowAprovar(true); }} className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-medium text-white">Aprovar</button>
          <button onClick={abrirReprovar} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-medium text-white">Reprovar</button>
        </div>
      )}

      {showAprovar && <Modal titulo="Aprovar Cadastro" descricao="Insira o Código do Novo Cliente gerado no Protheus" onClose={() => setShowAprovar(false)}>
        <input value={codigoCliente} onChange={(e) => setCodigoCliente(e.target.value)} placeholder="Código do Cliente" className="mb-4 w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent min-h-[44px]" />
        <div className="flex gap-3"><button onClick={() => setShowAprovar(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button><button onClick={handleAprovar} disabled={!codigoCliente || submitting} className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-medium text-white disabled:opacity-50">Aprovar</button></div>
      </Modal>}

      {showReprovar && <Modal titulo="Reprovar Cadastro" descricao="Descreva os Motivos da Reprovação" onClose={() => setShowReprovar(false)}>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo..." rows={6} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent" />
        <div className="flex gap-3"><button onClick={() => setShowReprovar(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button><button onClick={handleReprovar} disabled={!motivo || submitting} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-medium text-white disabled:opacity-50">Reprovar</button></div>
      </Modal>}

      {showCorrecao && <Modal titulo="Solicitar Correção" descricao="Descreva o que precisa ser corrigido" onClose={() => setShowCorrecao(false)}>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Correções necessárias..." rows={6} className="mb-4 w-full resize-none rounded-lg border border-input-border bg-input-bg px-4 py-3 text-sm text-text-main outline-none focus:border-accent" />
        <div className="flex gap-3"><button onClick={() => setShowCorrecao(false)} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button><button onClick={handleCorrecao} disabled={!motivo || submitting} className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-medium text-white disabled:opacity-50">Solicitar</button></div>
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
    </div>
  );
}

function CampoRevisavel({ campoKey, label, value, revisoes, podeAcao, onAction, actions }: {
  campoKey: string;
  label: string;
  value: string;
  revisoes: Revisoes;
  podeAcao: boolean;
  onAction: (tipo: "ok" | "reprovado" | "em_correcao") => void;
  actions?: React.ReactNode;
}) {
  const rev = revisoes[campoKey];
  const status: RevisaoStatus = rev?.status || "pendente";

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-text-main truncate">{value || "—"}</p>
          {status !== "pendente" && (
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
            {status !== "ok" && (
              <button onClick={() => onAction("ok")} className="rounded-lg p-1 text-green-400 hover:bg-green-500/10 transition" title="Aprovar campo">
                <CheckCircle size={14} />
              </button>
            )}
            {status !== "reprovado" && (
              <button onClick={() => onAction("reprovado")} className="rounded-lg p-1 text-red-400 hover:bg-red-500/10 transition" title="Reprovar campo">
                <XCircle size={14} />
              </button>
            )}
            {status !== "em_correcao" && (
              <button onClick={() => onAction("em_correcao")} className="rounded-lg p-1 text-orange-400 hover:bg-orange-500/10 transition" title="Solicitar correção">
                <AlertTriangle size={14} />
              </button>
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
          <button onClick={onClose} className="flex-1 rounded-xl border border-input-border py-3 text-sm font-medium text-text-muted">Cancelar</button>
          <button onClick={() => onConfirm(comentario)}
            disabled={action.tipo !== "ok" && !comentario.trim()}
            className={`flex-1 rounded-xl py-3 text-sm font-medium text-white disabled:opacity-50 ${
              action.tipo === "ok" ? "bg-green-600" : action.tipo === "reprovado" ? "bg-red-600" : "bg-orange-600"
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
