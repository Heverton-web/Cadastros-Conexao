import { useState, useEffect } from "react";
import {
  listarTodosCampos, salvarCampo, excluirCampo, reordenarCampos,
  toggleCampo, editarLabel,
  type CampoSchema, type Etapa, type TipoInput, type TipoPessoa,
} from "~/lib/form-schema";
import {
  Eye, EyeOff, Star, StarOff, ArrowUp, ArrowDown, Pencil, Trash2,
  Plus, X, Check, ChevronDown, GripVertical, FileText, FormInput,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Constantes ───────────────────────────────────────────────────────────────

type SecaoKey = "pf_dados" | "pj_dados" | "endereco" | "pf_docs" | "pj_docs";

const SECOES: { key: SecaoKey; label: string; tipo_pessoa: TipoPessoa; etapa: Etapa }[] = [
  { key: "pf_dados",  label: "Dados — PF",    tipo_pessoa: "PF",    etapa: "dados" },
  { key: "pj_dados",  label: "Dados — PJ",    tipo_pessoa: "PJ",    etapa: "dados" },
  { key: "endereco",  label: "Endereço",       tipo_pessoa: "ambos", etapa: "endereco" },
  { key: "pf_docs",   label: "Docs — PF",      tipo_pessoa: "PF",    etapa: "documentos" },
  { key: "pj_docs",   label: "Docs — PJ",      tipo_pessoa: "PJ",    etapa: "documentos" },
];

const TIPOS_INPUT: { value: TipoInput; label: string }[] = [
  { value: "text",        label: "Texto curto" },
  { value: "textarea",    label: "Texto longo" },
  { value: "email",       label: "E-mail" },
  { value: "tel",         label: "Telefone" },
  { value: "date",        label: "Data" },
  { value: "select",      label: "Select (escolha única)" },
  { value: "multiselect", label: "Múltipla escolha" },
  { value: "checkbox",    label: "Checkbox" },
  { value: "documento",   label: "Upload de Documento" },
];

// ─── Sub-componente: linha de campo ──────────────────────────────────────────

function LinhaCampo({
  campo,
  onToggleVisivel,
  onToggleObrigatorio,
  onMoverCima,
  onMoverBaixo,
  onEditarLabel,
  onExcluir,
  isPrimeiro,
  isUltimo,
}: {
  campo: CampoSchema;
  onToggleVisivel: () => void;
  onToggleObrigatorio: () => void;
  onMoverCima: () => void;
  onMoverBaixo: () => void;
  onEditarLabel: (label: string) => void;
  onExcluir: () => void;
  isPrimeiro: boolean;
  isUltimo: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [labelTemp, setLabelTemp] = useState(campo.label);

  function salvar() {
    if (labelTemp.trim()) {
      onEditarLabel(labelTemp.trim());
    }
    setEditando(false);
  }

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
      campo.visivel ? "border-border-subtle bg-card" : "border-border-subtle/40 bg-bg-dark opacity-60"
    }`}>
      {/* Grip / Ordem */}
      <GripVertical size={14} className="text-text-muted/40 flex-shrink-0" />

      {/* Label / Edit inline */}
      <div className="flex-1 min-w-0">
        {editando ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={labelTemp}
              onChange={e => setLabelTemp(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") salvar(); if (e.key === "Escape") setEditando(false); }}
              className="flex-1 rounded-lg border border-accent bg-input-bg px-2 py-1 text-xs text-text-main outline-none"
            />
            <button onClick={salvar} className="text-green-400 hover:text-green-300">
              <Check size={14} />
            </button>
            <button onClick={() => setEditando(false)} className="text-text-muted hover:text-red-400">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-text-main truncate">{campo.label}</span>
            {campo.is_custom && (
              <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">custom</span>
            )}
            {campo.obrigatorio && (
              <span className="text-accent text-xs font-bold leading-none">*</span>
            )}
          </div>
        )}
        <span className="text-[10px] text-text-muted">{campo.tipo_input} · {campo.campo_key}</span>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {/* Editar label */}
        <button
          onClick={() => { setLabelTemp(campo.label); setEditando(true); }}
          title="Editar rótulo"
          className="rounded-lg p-1.5 text-text-muted hover:bg-input-bg hover:text-accent transition"
        >
          <Pencil size={13} />
        </button>

        {/* Toggle obrigatório */}
        <button
          onClick={onToggleObrigatorio}
          title={campo.obrigatorio ? "Tornar opcional" : "Tornar obrigatório"}
          className={`rounded-lg p-1.5 transition ${
            campo.obrigatorio ? "text-accent hover:text-text-muted" : "text-text-muted hover:text-accent"
          }`}
        >
          {campo.obrigatorio ? <Star size={13} /> : <StarOff size={13} />}
        </button>

        {/* Toggle visível */}
        <button
          onClick={onToggleVisivel}
          title={campo.visivel ? "Ocultar campo" : "Exibir campo"}
          className={`rounded-lg p-1.5 transition ${
            campo.visivel ? "text-green-400 hover:text-text-muted" : "text-text-muted hover:text-green-400"
          }`}
        >
          {campo.visivel ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>

        {/* Mover cima */}
        <button
          onClick={onMoverCima}
          disabled={isPrimeiro}
          className="rounded-lg p-1.5 text-text-muted hover:text-accent disabled:opacity-25 transition"
        >
          <ArrowUp size={13} />
        </button>

        {/* Mover baixo */}
        <button
          onClick={onMoverBaixo}
          disabled={isUltimo}
          className="rounded-lg p-1.5 text-text-muted hover:text-accent disabled:opacity-25 transition"
        >
          <ArrowDown size={13} />
        </button>

        {/* Excluir (só custom) */}
        {campo.is_custom && (
          <button
            onClick={onExcluir}
            title="Excluir campo"
            className="rounded-lg p-1.5 text-text-muted hover:text-red-400 transition"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal Novo Campo ──────────────────────────────────────────────────────────

function ModalNovoCampo({
  onClose,
  onSalvar,
}: {
  onClose: () => void;
  onSalvar: (campo: Partial<CampoSchema>) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("PF");
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [label, setLabel] = useState("");
  const [campoKey, setCampoKey] = useState("");
  const [tipoInput, setTipoInput] = useState<TipoInput>("text");
  const [obrigatorio, setObrigatorio] = useState(false);
  const [opcoes, setOpcoes] = useState<string[]>([""]);

  const temOpcoes = ["select", "multiselect", "checkbox"].includes(tipoInput);

  async function handleSalvar() {
    if (!label.trim() || !campoKey.trim()) {
      toast.error("Preencha o rótulo e o identificador do campo");
      return;
    }
    setSaving(true);
    await onSalvar({
      tipo_pessoa: tipoPessoa,
      etapa,
      campo_key: campoKey.toLowerCase().replace(/\s+/g, "_"),
      label: label.trim(),
      tipo_input: tipoInput,
      opcoes: temOpcoes ? opcoes.filter(o => o.trim()) : [],
      obrigatorio,
      visivel: true,
      ordem: 99,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-card border border-border-subtle p-5 flex flex-col gap-4 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FormInput size={18} className="text-accent" />
            <h2 className="text-sm font-bold text-text-main">Novo Campo</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-red-400">
            <X size={18} />
          </button>
        </div>

        {/* Tipo de Pessoa */}
        <div>
          <p className="mb-1 text-xs font-medium text-text-muted">Tipo de Pessoa</p>
          <div className="flex gap-2">
            {(["PF","PJ","ambos"] as TipoPessoa[]).map(t => (
              <button
                key={t}
                onClick={() => setTipoPessoa(t)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                  tipoPessoa === t ? "bg-accent text-white" : "bg-input-bg text-text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Etapa */}
        <div>
          <p className="mb-1 text-xs font-medium text-text-muted">Etapa</p>
          <div className="flex gap-2">
            {(["dados","endereco","documentos"] as Etapa[]).map(e => (
              <button
                key={e}
                onClick={() => setEtapa(e)}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition ${
                  etapa === e ? "bg-accent text-white" : "bg-input-bg text-text-muted"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Input */}
        <div>
          <p className="mb-1 text-xs font-medium text-text-muted">Tipo de Campo</p>
          <div className="relative">
            <select
              value={tipoInput}
              onChange={e => setTipoInput(e.target.value as TipoInput)}
              className="w-full appearance-none rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-xs text-text-main outline-none focus:border-accent pr-8"
            >
              {TIPOS_INPUT.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Label */}
        <div>
          <p className="mb-1 text-xs font-medium text-text-muted">Rótulo (exibido ao lead)</p>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Ex: Especialidade Clínica"
            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-xs text-text-main outline-none focus:border-accent"
          />
        </div>

        {/* Identificador */}
        <div>
          <p className="mb-1 text-xs font-medium text-text-muted">Identificador único (campo_key)</p>
          <input
            value={campoKey}
            onChange={e => setCampoKey(e.target.value.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,""))}
            placeholder="Ex: especialidade_clinica"
            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-xs text-text-main font-mono outline-none focus:border-accent"
          />
          <p className="mt-1 text-[10px] text-text-muted">Apenas letras minúsculas, números e underscore</p>
        </div>

        {/* Opções (para select/multiselect/checkbox) */}
        {temOpcoes && (
          <div>
            <p className="mb-1 text-xs font-medium text-text-muted">Opções</p>
            <div className="flex flex-col gap-1.5">
              {opcoes.map((op, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={op}
                    onChange={e => {
                      const novas = [...opcoes];
                      novas[i] = e.target.value;
                      setOpcoes(novas);
                    }}
                    placeholder={`Opção ${i + 1}`}
                    className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                  />
                  {opcoes.length > 1 && (
                    <button
                      onClick={() => setOpcoes(opcoes.filter((_, j) => j !== i))}
                      className="text-text-muted hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setOpcoes([...opcoes, ""])}
                className="text-xs text-accent hover:underline text-left"
              >
                + Adicionar opção
              </button>
            </div>
          </div>
        )}

        {/* Obrigatório */}
        <button
          onClick={() => setObrigatorio(!obrigatorio)}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-main"
        >
          <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition ${
            obrigatorio ? "border-accent bg-accent" : "border-input-border"
          }`}>
            {obrigatorio && <Check size={10} className="text-white" />}
          </div>
          Campo obrigatório
        </button>

        <div className="flex gap-2 mt-1">
          <button onClick={onClose} className="flex-1 rounded-xl border border-input-border py-2.5 text-xs text-text-muted">
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={saving || !label.trim() || !campoKey.trim()}
            className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Salvando…" : "Criar Campo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export function FormBuilderTab() {
  const [secao, setSecao] = useState<SecaoKey>("pf_dados");
  const [campos, setCampos] = useState<CampoSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const secaoAtual = SECOES.find(s => s.key === secao)!;

  async function carregar() {
    setLoading(true);
    const data = await listarTodosCampos({
      etapa: secaoAtual.etapa,
      tipo_pessoa: secaoAtual.tipo_pessoa === "ambos" ? undefined : secaoAtual.tipo_pessoa,
    });
    // Para endereço, filtra só os de tipo_pessoa = 'ambos'
    const tipoPessoaFiltro = secaoAtual.tipo_pessoa === "ambos" ? null : secaoAtual.tipo_pessoa;
    const filtrado = tipoPessoaFiltro
      ? data.filter(c => c.tipo_pessoa === tipoPessoaFiltro)
      : data.filter(c => c.tipo_pessoa === "ambos");
    setCampos(filtrado);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [secao]);

  async function handleToggleVisivel(campo: CampoSchema) {
    const novoValor = !campo.visivel;
    await toggleCampo(campo.id, "visivel", novoValor);
    setCampos(prev => prev.map(c => c.id === campo.id ? { ...c, visivel: novoValor } : c));
    toast.success(novoValor ? "Campo visível" : "Campo ocultado");
  }

  async function handleToggleObrigatorio(campo: CampoSchema) {
    const novoValor = !campo.obrigatorio;
    await toggleCampo(campo.id, "obrigatorio", novoValor);
    setCampos(prev => prev.map(c => c.id === campo.id ? { ...c, obrigatorio: novoValor } : c));
    toast.success(novoValor ? "Campo obrigatório" : "Campo opcional");
  }

  async function handleEditarLabel(campo: CampoSchema, novoLabel: string) {
    await editarLabel(campo.id, novoLabel);
    setCampos(prev => prev.map(c => c.id === campo.id ? { ...c, label: novoLabel } : c));
    toast.success("Rótulo atualizado");
  }

  async function handleExcluir(campo: CampoSchema) {
    const ok = await excluirCampo(campo.id);
    if (ok) {
      setCampos(prev => prev.filter(c => c.id !== campo.id));
      toast.success("Campo excluído");
    } else {
      toast.error("Erro ao excluir campo");
    }
  }

  async function handleMover(index: number, direcao: "cima" | "baixo") {
    const novoIndex = direcao === "cima" ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= campos.length) return;

    const novos = [...campos];
    [novos[index], novos[novoIndex]] = [novos[novoIndex], novos[index]];

    // Recalcula ordens
    const atualizacoes = novos.map((c, i) => ({ id: c.id, ordem: i + 1 }));
    await reordenarCampos(atualizacoes);
    setCampos(novos.map((c, i) => ({ ...c, ordem: i + 1 })));
  }

  async function handleNovoCampo(dados: Partial<CampoSchema>) {
    const novo = await salvarCampo(dados);
    if (novo) {
      toast.success("Campo criado com sucesso!");
      setShowModal(false);
      await carregar();
    } else {
      toast.error("Erro ao criar campo. Verifique se o identificador é único.");
    }
  }

  // Filtragem final por seção para garantir consistência
  const camposFiltrados = campos.filter(c => {
    if (secaoAtual.tipo_pessoa === "ambos") return c.tipo_pessoa === "ambos";
    return c.tipo_pessoa === secaoAtual.tipo_pessoa;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FormInput size={18} className="text-accent" />
          <div>
            <h2 className="text-sm font-bold text-text-main">Formulário do Lead</h2>
            <p className="text-xs text-text-muted">Configure campos e documentos por seção</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white"
        >
          <Plus size={14} />
          Novo Campo
        </button>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 rounded-xl bg-card border border-border-subtle p-3 text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><Eye size={11} className="text-green-400" /> visível</span>
        <span className="flex items-center gap-1"><EyeOff size={11} /> oculto</span>
        <span className="flex items-center gap-1"><Star size={11} className="text-accent" /> obrigatório</span>
        <span className="flex items-center gap-1"><StarOff size={11} /> opcional</span>
        <span className="flex items-center gap-1"><span className="rounded-full bg-accent/15 px-1 text-accent font-semibold">custom</span> campo criado pelo admin</span>
      </div>

      {/* Navegação de seções */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {SECOES.map(s => (
          <button
            key={s.key}
            onClick={() => setSecao(s.key)}
            className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              secao === s.key
                ? "bg-accent text-white"
                : "bg-input-bg text-text-muted hover:text-text-main"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Lista de campos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : camposFiltrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <FileText size={32} className="text-text-muted/40" />
          <p className="text-xs text-text-muted">Nenhum campo nesta seção.</p>
          <button onClick={() => setShowModal(true)} className="text-xs text-accent hover:underline">
            Criar o primeiro campo
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {camposFiltrados.map((campo, i) => (
            <LinhaCampo
              key={campo.id}
              campo={campo}
              isPrimeiro={i === 0}
              isUltimo={i === camposFiltrados.length - 1}
              onToggleVisivel={() => handleToggleVisivel(campo)}
              onToggleObrigatorio={() => handleToggleObrigatorio(campo)}
              onMoverCima={() => handleMover(i, "cima")}
              onMoverBaixo={() => handleMover(i, "baixo")}
              onEditarLabel={novoLabel => handleEditarLabel(campo, novoLabel)}
              onExcluir={() => handleExcluir(campo)}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {!loading && camposFiltrados.length > 0 && (
        <p className="text-center text-[10px] text-text-muted">
          {camposFiltrados.filter(c => c.visivel).length} visíveis ·{" "}
          {camposFiltrados.filter(c => !c.visivel).length} ocultos ·{" "}
          {camposFiltrados.filter(c => c.is_custom).length} custom
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <ModalNovoCampo
          onClose={() => setShowModal(false)}
          onSalvar={handleNovoCampo}
        />
      )}
    </div>
  );
}
