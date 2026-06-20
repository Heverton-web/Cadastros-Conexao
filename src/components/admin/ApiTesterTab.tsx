import { useState, useEffect } from "react";
import { Loader2, Plus, Save, Play, Trash2, Code, Settings2, Webhook, Link2, PlusCircle, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  listApiConnectors,
  createApiConnector,
  updateApiConnector,
  deleteApiConnector,
  executeApiConnector,
  type ApiConnector,
  type ApiConnectorInput,
} from "~/lib/api_connectors";
import { EVENTOS_STATUS_CHANGE, EVENTOS_BUTTON_ACTION } from "~/lib/webhooks";

export function ApiTesterTab() {
  const [connectors, setConnectors] = useState<ApiConnector[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [form, setForm] = useState<ApiConnectorInput>({
    name: "Nova Conexão",
    type: "api_call",
    method: "POST",
    url: "https://",
    headers: {},
    query_params: {},
    body_template: "",
    response_schema: null,
    is_active: true,
    evento: null,
    tipo_evento: null,
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  // States para o testador
  const [testVars, setTestVars] = useState<string>("{}");
  const [testResult, setTestResult] = useState<any>(null);
  
  // Abas do editor
  const [editorTab, setEditorTab] = useState<"headers" | "query" | "body" | "test">("headers");

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listApiConnectors();
      setConnectors(data);
      if (data.length > 0 && !activeId) {
        selecionar(data[0]);
      }
    } catch {
      toast.error("Erro ao carregar conexões");
    } finally {
      setLoading(false);
    }
  }

  function selecionar(c: ApiConnector) {
    setActiveId(c.id);
    setForm({
      name: c.name,
      type: c.type,
      method: c.method,
      url: c.url,
      headers: c.headers || {},
      query_params: c.query_params || {},
      body_template: c.body_template || "",
      response_schema: c.response_schema,
      evento: c.evento,
      tipo_evento: c.tipo_evento,
      is_active: c.is_active,
    });
    setTestResult(null);
  }

  function criarNovo(tipo: "api_call" | "webhook") {
    setActiveId("new");
    setForm({
      name: tipo === "api_call" ? "Nova API Call" : "Novo Webhook",
      type: tipo,
      method: "POST",
      url: "https://",
      headers: { "Content-Type": "application/json" },
      query_params: {},
      body_template: "{\n  \"chave\": \"{{variavel}}\"\n}",
      response_schema: null,
      evento: null,
      tipo_evento: null,
      is_active: true,
    });
    setTestResult(null);
  }

  async function handleSalvar() {
    if (!form.name || !form.url) return toast.error("Nome e URL são obrigatórios");
    setSaving(true);
    try {
      if (activeId === "new") {
        const novo = await createApiConnector(form);
        toast.success("Criado!");
        setActiveId(novo.id);
      } else if (activeId) {
        await updateApiConnector(activeId, form);
        toast.success("Atualizado!");
      }
      await carregar();
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleExcluir() {
    if (!activeId || activeId === "new") return;
    if (!confirm("Deletar permanentemente?")) return;
    try {
      await deleteApiConnector(activeId);
      toast.success("Excluído!");
      setActiveId(null);
      carregar();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  async function handleTestar() {
    if (activeId === "new") return toast.error("Salve antes de testar!");
    let vars = {};
    try {
      vars = JSON.parse(testVars || "{}");
    } catch {
      return toast.error("As variáveis de teste precisam ser um JSON válido");
    }

    setTesting(true);
    try {
      const result = await executeApiConnector(activeId!, vars);
      setTestResult(result);
      
      // Atualizar o schema de response
      if (result && result.data && activeId) {
        setForm(f => ({ ...f, response_schema: result.data }));
        await updateApiConnector(activeId, { response_schema: result.data });
      }
      
      toast.success("Teste concluído!");
    } catch (e: any) {
      toast.error("Erro no teste: " + e.message);
    } finally {
      setTesting(false);
    }
  }

  // KV Editor Helper
  function KVEditor({ data, onChange }: { data: Record<string, string>, onChange: (v: Record<string, string>) => void }) {
    const entries = Object.entries(data);
    
    const updateKey = (idx: number, newKey: string) => {
      const newObj: Record<string, string> = {};
      entries.forEach(([k, v], i) => {
        if (i === idx) {
          if (newKey) newObj[newKey] = v;
        } else {
          newObj[k] = v;
        }
      });
      onChange(newObj);
    };

    const updateVal = (key: string, newVal: string) => {
      onChange({ ...data, [key]: newVal });
    };

    const remove = (key: string) => {
      const newObj = { ...data };
      delete newObj[key];
      onChange(newObj);
    };

    const add = () => {
      onChange({ ...data, ["nova_chave_" + Date.now()]: "" });
    };

    return (
      <div className="flex flex-col gap-2">
        {entries.map(([k, v], i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <input value={k} onChange={e => updateKey(i, e.target.value)} className="w-full sm:w-1/3 rounded border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main focus:border-accent" placeholder="Key" />
            <div className="flex gap-2 flex-1">
              <input value={v} onChange={e => updateVal(k, e.target.value)} className="flex-1 rounded border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main focus:border-accent" placeholder="Value {{variavel}}" />
              <button onClick={() => remove(k)} className="p-2 text-red-400 hover:bg-red-400/10 rounded shrink-0"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        <button onClick={add} className="text-xs font-medium text-accent hover:underline self-start flex items-center gap-1 mt-2"><PlusCircle size={12}/> Adicionar Linha</button>
      </div>
    );
  }

  if (loading && connectors.length === 0) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <div className={`w-full lg:w-64 flex flex-col gap-4 bg-card rounded-xl border border-input-border p-4 shadow-lg ${activeId ? "hidden lg:flex" : "flex"}`}>
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Settings2 size={16} className="text-accent" /> Conexões
        </h2>
        
        <div className="flex gap-2">
          <button onClick={() => criarNovo("api_call")} className="flex-1 text-[10px] font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white py-1.5 rounded transition-colors flex justify-center items-center gap-1">
            <Link2 size={12}/> Nova API
          </button>
          <button onClick={() => criarNovo("webhook")} className="flex-1 text-[10px] font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white py-1.5 rounded transition-colors flex justify-center items-center gap-1">
            <Webhook size={12}/> Novo Webhook
          </button>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">APIs Externas</p>
          {connectors.filter(c => c.type === "api_call").map(c => (
            <button key={c.id} onClick={() => selecionar(c)} className={`text-left px-3 py-2 rounded-lg text-xs font-medium truncate flex items-center justify-between ${activeId === c.id ? "bg-accent/20 text-accent" : "text-text-main hover:bg-input-bg"}`}>
              <span className="truncate">{c.name}</span>
              {!c.is_active && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
            </button>
          ))}
          
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 mt-4">Webhooks Ativos</p>
          {connectors.filter(c => c.type === "webhook").map(c => (
            <button key={c.id} onClick={() => selecionar(c)} className={`text-left px-3 py-2 rounded-lg text-xs font-medium truncate flex items-center justify-between ${activeId === c.id ? "bg-accent/20 text-accent" : "text-text-main hover:bg-input-bg"}`}>
              <span className="truncate">{c.name}</span>
              {!c.is_active && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeId ? (
        <div className="flex-1 bg-card rounded-xl border border-input-border shadow-lg flex flex-col overflow-hidden h-[calc(100vh-140px)] lg:h-auto">
          {/* Header Editor */}
          <div className="p-4 lg:p-5 border-b border-input-border flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between bg-bg-dark/50">
            <div className="flex items-center gap-2 flex-1 w-full">
              <button onClick={() => setActiveId(null)} className="lg:hidden p-2 text-text-muted hover:bg-input-bg rounded shrink-0">{"<"}</button>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="text-base sm:text-lg font-bold bg-transparent text-text-main outline-none w-full border-b border-transparent focus:border-accent" placeholder="Nome da Conexão" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end w-full sm:w-auto">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-main">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="accent-accent w-4 h-4" />
                Ativo
              </label>
              <button onClick={handleSalvar} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Salvar
              </button>
              {activeId !== "new" && (
                <button onClick={handleExcluir} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg shrink-0">
                  <Trash2 size={14}/>
                </button>
              )}
            </div>
          </div>

          {/* URL & Method Row */}
          {form.type === "webhook" && (
            <div className="px-4 pt-4 lg:px-5 lg:pt-5 pb-2 flex flex-col sm:flex-row gap-2">
              <select value={form.tipo_evento || ""} onChange={e => setForm({...form, tipo_evento: e.target.value as any, evento: ""})} className="w-full sm:w-1/3 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs font-bold text-accent outline-none">
                <option value="" disabled>Qual tipo de gatilho?</option>
                <option value="status_change">Mudança de Status</option>
                <option value="button_action">Ação de Botão</option>
              </select>
              {form.tipo_evento === "status_change" && (
                <select value={form.evento || ""} onChange={e => setForm({...form, evento: e.target.value})} className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent">
                   <option value="" disabled>Qual status?</option>
                   {EVENTOS_STATUS_CHANGE.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              )}
              {form.tipo_evento === "button_action" && (
                <select value={form.evento || ""} onChange={e => setForm({...form, evento: e.target.value})} className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent">
                   <option value="" disabled>Qual botão?</option>
                   {EVENTOS_BUTTON_ACTION.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              )}
            </div>
          )}

          <div className={`p-4 lg:p-5 flex flex-col sm:flex-row gap-2 border-b border-input-border bg-input-bg/30 ${form.type === "webhook" ? "pt-2 lg:pt-2" : ""}`}>
            <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} className="w-full sm:w-28 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs font-bold text-accent outline-none">
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m} value={m} className="text-black bg-white">{m}</option>)}
            </select>
            <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent font-mono" placeholder="https://api.exemplo.com/v1/user/{{user_id}}" />
          </div>

          {/* Abas Secundárias */}
          <div className="flex border-b border-input-border px-2 sm:px-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {[
              { id: "headers", label: "Headers" },
              { id: "query", label: "Query Params" },
              { id: "body", label: "Body Template" },
              { id: "test", label: "Testar & Inicializar" }
            ].map(t => (
              <button key={t.id} onClick={() => setEditorTab(t.id as any)} className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${editorTab === t.id ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-main"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Conteúdo Aba */}
          <div className="p-5 flex-1 overflow-y-auto">
            {editorTab === "headers" && (
              <div className="max-w-3xl">
                <p className="text-xs text-text-muted mb-4">Envie cabeçalhos HTTP na requisição. Você pode usar `{"{{var}}"}` para injetar dados dinâmicos.</p>
                <KVEditor data={form.headers} onChange={v => setForm({...form, headers: v})} />
              </div>
            )}
            
            {editorTab === "query" && (
              <div className="max-w-3xl">
                <p className="text-xs text-text-muted mb-4">Parâmetros de query anexados ao final da URL (ex: ?id=123). Suporta `{"{{var}}"}`.</p>
                <KVEditor data={form.query_params} onChange={v => setForm({...form, query_params: v})} />
              </div>
            )}

            {editorTab === "body" && (
              <div className="flex flex-col h-full max-w-4xl">
                <p className="text-xs text-text-muted mb-2">Defina o template do corpo da requisição. Use `{"{{var}}"}` para injetar os dados do sistema ou das rotas da API.</p>
                <textarea 
                  value={form.body_template || ""} 
                  onChange={e => setForm({...form, body_template: e.target.value})}
                  className="flex-1 w-full rounded-lg border border-input-border bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm outline-none focus:border-accent resize-none shadow-inner"
                  spellCheck={false}
                  placeholder={'{\n  "cliente": "{{nome_cliente}}"\n}'}
                />
              </div>
            )}

            {editorTab === "test" && (
              <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
                <div className="flex-1 flex flex-col w-full lg:max-w-md">
                  <h3 className="text-sm font-bold text-text-main mb-2">Variáveis Mock para Teste</h3>
                  <p className="text-xs text-text-muted mb-4">Insira um JSON válido com chaves equivalentes aos seus `{"{{placeholders}}"}`.</p>
                  <textarea 
                    value={testVars} 
                    onChange={e => setTestVars(e.target.value)}
                    className="h-48 w-full rounded-lg border border-input-border bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-xs outline-none focus:border-accent resize-none mb-4"
                    spellCheck={false}
                  />
                  <button onClick={handleTestar} disabled={testing || activeId === "new"} className="flex justify-center items-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50">
                    {testing ? <Loader2 size={16} className="animate-spin"/> : <Play size={16}/>} Inicializar Teste
                  </button>
                  {activeId === "new" && <p className="text-[10px] text-center text-red-400 mt-2">Salve o conector antes de poder testá-lo.</p>}
                </div>

                <div className="flex-1 flex flex-col bg-bg-dark rounded-lg border border-input-border overflow-hidden">
                  <div className="bg-input-bg p-3 border-b border-input-border flex justify-between items-center">
                    <h3 className="text-xs font-bold text-text-main flex items-center gap-1"><Code size={14}/> Resposta</h3>
                    {testResult && (
                      <div className="flex gap-3 text-[10px] font-mono">
                        <span className={testResult.status >= 200 && testResult.status < 300 ? "text-green-400" : "text-red-400"}>Status: {testResult.status}</span>
                        <span className="text-accent">Tempo: {testResult.duration}ms</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    {!testResult ? (
                      <div className="h-full flex items-center justify-center text-text-muted text-xs">Execute o teste para ver a resposta da API</div>
                    ) : (
                      <pre className="text-xs font-mono text-[#d4d4d4] whitespace-pre-wrap break-all">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-card rounded-xl border border-input-border shadow-lg flex items-center justify-center p-8 text-center flex-col">
          <Webhook size={48} className="text-input-border mb-4"/>
          <h2 className="text-lg font-bold text-text-main mb-2">Integrações de API e Webhooks</h2>
          <p className="text-sm text-text-muted max-w-md">Gerencie as conexões externas do sistema ou crie webhooks personalizados. Selecione um item na barra lateral ou crie um novo.</p>
        </div>
      )}
    </div>
  );
}
