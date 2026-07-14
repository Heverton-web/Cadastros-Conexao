import { useState } from "react";
import { Globe, Key, Cpu, Loader2, CheckCircle2, XCircle, ChevronDown, RefreshCw, Webhook, Sparkles } from "lucide-react";
import { useTestarConexao, useBuscarModelos } from "../hooks/useAgentes";

interface ProvedorInfo {
  key: string;
  nome: string;
  url: string;
  modelos: string[];
  placeholderKey: string;
}

const PROVEDORES: ProvedorInfo[] = [
  {
    key: "opencode",
    nome: "OpenCode",
    url: "https://api.opencode.ai/v1",
    modelos: ["mimo/mimo-v2.5-pro", "mimo/mimo-v2.5-flash"],
    placeholderKey: "oc-...",
  },
  {
    key: "groq",
    nome: "Groq",
    url: "https://api.groq.com/openai/v1",
    modelos: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it", "mixtral-8x7b-32768"],
    placeholderKey: "gsk_...",
  },
  {
    key: "openai",
    nome: "OpenAI",
    url: "https://api.openai.com/v1",
    modelos: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o3-mini"],
    placeholderKey: "sk-...",
  },
  {
    key: "google",
    nome: "Google AI Studio",
    url: "https://generativelanguage.googleapis.com/v1beta",
    modelos: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"],
    placeholderKey: "AIza...",
  },
  {
    key: "mimo",
    nome: "Mimo (Xiaomi)",
    url: "https://api.mimo.ai/v1",
    modelos: ["mimo-v2.5-pro", "mimo-v2.5-flash"],
    placeholderKey: "",
  },
  {
    key: "openrouter",
    nome: "OpenRouter",
    url: "https://openrouter.ai/api/v1",
    modelos: ["openai/gpt-4o", "anthropic/claude-sonnet-4", "google/gemini-2.5-flash", "meta-llama/llama-4-maverick", "deepseek/deepseek-chat-v3-0324"],
    placeholderKey: "sk-or-v1-...",
  },
  {
    key: "deepseek",
    nome: "DeepSeek",
    url: "https://api.deepseek.com/v1",
    modelos: ["deepseek-chat", "deepseek-reasoner"],
    placeholderKey: "sk-...",
  },
  {
    key: "together",
    nome: "Together AI",
    url: "https://api.together.xyz/v1",
    modelos: ["meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "mistralai/Mixtral-8x7B-Instruct-v0.1"],
    placeholderKey: "",
  },
  {
    key: "ollama",
    nome: "Ollama (local)",
    url: "http://localhost:11434/v1",
    modelos: ["llama3.3", "llama3.1", "mistral", "phi3", "gemma2"],
    placeholderKey: "ollama",
  },
  {
    key: "custom",
    nome: "Outro (personalizado)",
    url: "",
    modelos: [],
    placeholderKey: "",
  },
];

interface Props {
  apiUrl: string;
  setApiUrl: (v: string) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  modelo: string;
  setModelo: (v: string) => void;
  executionMode: "ai_provider" | "webhook";
  setExecutionMode: (v: "ai_provider" | "webhook") => void;
  webhookUrl: string;
  setWebhookUrl: (v: string) => void;
}

export function EtapaApiConfig({
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
  modelo,
  setModelo,
  executionMode,
  setExecutionMode,
  webhookUrl,
  setWebhookUrl,
}: Props) {
  const teste = useTestarConexao();
  const buscarModelos = useBuscarModelos();
  const [testeResultado, setTesteResultado] = useState<"ok" | "erro" | null>(null);
  const [modelosAPI, setModelosAPI] = useState<string[]>([]);
  const [buscandoModelos, setBuscandoModelos] = useState(false);

  const [provedorKey, setProvedorKey] = useState(() => {
    const found = PROVEDORES.find((p) => p.url === apiUrl);
    return found?.key ?? (apiUrl ? "custom" : "");
  });

  function handleProvedorChange(key: string) {
    setProvedorKey(key);
    const provedor = PROVEDORES.find((p) => p.key === key);
    if (provedor && provedor.key !== "custom") {
      setApiUrl(provedor.url);
      if (provedor.modelos.length > 0 && !provedor.modelos.includes(modelo)) {
        setModelo(provedor.modelos[0]);
      }
    } else {
      setApiUrl("");
    }
    setTesteResultado(null);
    setModelosAPI([]);
  }

  const provedorSelecionado = PROVEDORES.find((p) => p.key === provedorKey);

  async function handleTestar() {
    setTesteResultado(null);
    setModelosAPI([]);

    const resultado = await teste.mutateAsync({ provedorUrl: apiUrl, apiKey, modelo });
    setTesteResultado(resultado.ok ? "ok" : "erro");

    if (resultado.ok) {
      setBuscandoModelos(true);
      const modelos = await buscarModelos.mutateAsync({ provedorUrl: apiUrl, apiKey });
      setModelosAPI(modelos);
      setBuscandoModelos(false);

      if (modelos.length > 0 && !modelos.includes(modelo)) {
        setModelo(modelos[0]);
      }
    }
  }

  const modelosDisponiveis = modelosAPI.length > 0
    ? modelosAPI
    : provedorSelecionado?.modelos ?? [];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
          <Globe className="h-6 w-6 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-white">Configuracao da API</h3>
        <p className="text-sm text-gray-400">
          Escolha o provedor de IA e configure sua chave
        </p>
      </div>

      <div className="space-y-3">
        {/* Execution Mode Toggle */}
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 block">
            Modo de Execucao
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExecutionMode("ai_provider")}
              className={`p-3 rounded-xl border text-left transition-all ${
                executionMode === "ai_provider"
                  ? "border-accent bg-accent/10"
                  : "border-border-subtle hover:border-white/20"
              }`}
            >
              <Sparkles size={18} className={executionMode === "ai_provider" ? "text-accent" : "text-text-muted"} />
              <p className="text-xs font-bold text-text-main mt-1.5">Resposta com IA</p>
              <p className="text-[10px] text-text-muted mt-0.5">Provedor de IA direto</p>
            </button>
            <button
              type="button"
              onClick={() => setExecutionMode("webhook")}
              className={`p-3 rounded-xl border text-left transition-all ${
                executionMode === "webhook"
                  ? "border-accent bg-accent/10"
                  : "border-border-subtle hover:border-white/20"
              }`}
            >
              <Webhook size={18} className={executionMode === "webhook" ? "text-accent" : "text-text-muted"} />
              <p className="text-xs font-bold text-text-main mt-1.5">Webhook</p>
              <p className="text-[10px] text-text-muted mt-0.5">N8N, Zapier, API propia</p>
            </button>
          </div>
        </div>

        {executionMode === "webhook" ? (
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              URL do Webhook *
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-n8n.com/webhook/agentes-ia"
              className="w-full px-3 py-2 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40/40 font-mono"
            />
            <p className="text-[10px] text-text-muted mt-1">
              POST com JSON: {'{'} "mensagem", "historico", "agente_id" {'}'}
            </p>
          </div>
        ) : (
        <>
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
            Provedor de IA *
          </label>
          <div className="relative">
            <select
              value={provedorKey}
              onChange={(e) => handleProvedorChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40 cursor-pointer"
            >
              <option value="">Selecione um provedor</option>
              {PROVEDORES.map((p) => (
                <option key={p.key} value={p.key}>{p.nome}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* URL */}
        {provedorKey === "custom" ? (
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
              URL Base da API *
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.exemplo.com/v1"
              className="w-full px-3 py-2 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40"
            />
          </div>
        ) : provedorKey ? (
          <div className="rounded-lg bg-card border border-border-subtle p-2.5 flex items-center gap-2">
            <Globe size={12} className="text-text-muted shrink-0" />
            <span className="text-xs text-text-muted font-mono truncate">{apiUrl}</span>
          </div>
        ) : null}

        {/* API Key */}
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
            API Key *
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={provedorSelecionado?.placeholderKey || "Cole sua API key aqui"}
            className="w-full px-3 py-2 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40 font-mono"
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
            Modelo *
            {buscandoModelos && (
              <span className="ml-2 text-accent normal-case">
                <RefreshCw size={8} className="inline animate-spin" /> Buscando modelos...
              </span>
            )}
            {modelosAPI.length > 0 && !buscandoModelos && (
              <span className="ml-2 text-green-400 normal-case">
                {modelosAPI.length} modelos encontrados
              </span>
            )}
          </label>
          {modelosDisponiveis.length > 0 ? (
            <div className="relative">
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40 cursor-pointer font-mono"
              >
                {modelosDisponiveis.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="__custom__">Outro modelo...</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="nome-do-modelo"
              className="w-full px-3 py-2 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40 font-mono"
            />
          )}
          {modelo === "__custom__" && (
            <input
              type="text"
              value=""
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Digite o nome do modelo"
              className="w-full mt-2 px-3 py-2 rounded-lg bg-card border border-input-border text-text-main text-sm outline-none focus:border-accent/40 font-mono"
              autoFocus
            />
          )}
        </div>

        {/* Testar conexao */}
        <div className="pt-2">
          <button
            onClick={handleTestar}
            disabled={!apiUrl || !apiKey || teste.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-accent/30 text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
          >
            {teste.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : testeResultado === "ok" ? (
              <CheckCircle2 size={14} className="text-green-400" />
            ) : testeResultado === "erro" ? (
              <XCircle size={14} className="text-red-400" />
            ) : (
              <Key size={14} />
            )}
            {teste.isPending
              ? "Testando..."
              : testeResultado === "ok"
                ? buscandoModelos
                  ? "Conexao OK! Buscando modelos..."
                  : `Conexao OK! ${modelosAPI.length > 0 ? modelosAPI.length + " modelos" : ""}`
                : testeResultado === "erro"
                  ? "Falhou - Verifique as credenciais"
                  : "Testar Conexao e Buscar Modelos"}
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
