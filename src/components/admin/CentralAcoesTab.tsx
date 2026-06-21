import { useState, useEffect } from "react";
import { 
  Loader2, Plus, Save, Play, Trash2, Code, Settings2, Webhook, 
  Link2, PlusCircle, Bell, History, Settings, RefreshCw, X, ToggleRight, ToggleLeft, ShieldAlert
} from "lucide-react";
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
import {
  listarWebhooks,
  criarWebhook,
  atualizarWebhook,
  toggleWebhook,
  deletarWebhook,
  listarWebhookLogs,
  EVENTOS_STATUS_CHANGE,
  EVENTOS_BUTTON_ACTION,
  type Webhook as WebhookLegacy,
  type WebhookInput as WebhookLegacyInput,
  type WebhookLog
} from "~/lib/webhooks";
import {
  listarTemplates,
  criarTemplate,
  atualizarTemplatePorId,
  deletarTemplate,
  type NotificacaoTemplate
} from "~/lib/notificacoes";

type ItemType = "api_call" | "webhook" | "notification";

type ListItem = {
  id: string;
  name: string;
  type: ItemType;
  subtitle: string;
  isActive: boolean;
  raw: any;
};

export function CentralAcoesTab() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<ListItem | null>(null);
  const [activeTab, setActiveTab] = useState<"actions" | "logs">("actions");
  
  // States para Formulários
  const [formName, setFormName] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  
  // States específicos de API/Webhook
  const [apiMethod, setApiMethod] = useState("POST");
  const [apiUrl, setApiUrl] = useState("https://");
  const [apiHeaders, setApiHeaders] = useState<Record<string, string>>({});
  const [apiQuery, setApiQuery] = useState<Record<string, string>>({});
  const [apiBody, setApiBody] = useState("");
  const [apiEvento, setApiEvento] = useState<string | null>(null);
  const [apiTipoEvento, setApiTipoEvento] = useState<"status_change" | "button_action" | null>(null);

  // States específicos de Notificação
  const [notifTitulo, setNotifTitulo] = useState("");
  const [notifCorpo, setNotifCorpo] = useState("");
  const [notifEvento, setNotifEvento] = useState("");
  
  // State de editor secundário
  const [editorTab, setEditorTab] = useState<"headers" | "query" | "body" | "template" | "test">("headers");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Playground de Testes
  const [testVars, setTestVars] = useState<string>("{}");
  const [testResult, setTestResult] = useState<any>(null);

  // Logs
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    setLoading(true);
    try {
      const [apis, webhooks, templates] = await Promise.all([
        listApiConnectors(),
        listarWebhooks(),
        listarTemplates()
      ]);

      const list: ListItem[] = [];

      // APIs e Webhooks do api_connectors
      apis.forEach(a => {
        list.push({
          id: a.id,
          name: a.name,
          type: a.type,
          subtitle: a.type === "api_call" ? "API Externa" : `Webhook: ${a.evento || "Sem gatilho"}`,
          isActive: a.is_active,
          raw: a
        });
      });

      // Webhooks legados (tabela webhooks)
      webhooks.forEach(w => {
        list.push({
          id: `legacy-${w.id}`,
          name: w.nome,
          type: "webhook",
          subtitle: `Gatilho: ${w.evento} (Legado)`,
          isActive: w.ativo,
          raw: w
        });
      });

      // Templates de notificações
      templates.forEach(t => {
        list.push({
          id: `notif-${t.id}`,
          name: t.titulo,
          type: "notification",
          subtitle: `Notificação: ${t.evento}`,
          isActive: t.ativo,
          raw: t
        });
      });

      setItems(list);

      // Tenta manter selecionado se houver ID ativo
      if (activeItem) {
        const found = list.find(l => l.id === activeItem.id);
        if (found) selecionar(found);
      } else if (list.length > 0) {
        selecionar(list[0]);
      }
    } catch (err) {
      toast.error("Erro ao carregar os dados da central");
    } finally {
      setLoading(false);
    }
  }

  async function carregarLogs() {
    setLoadingLogs(true);
    try {
      const data = await listarWebhookLogs();
      setLogs(data);
    } catch {
      toast.error("Erro ao carregar logs");
    } finally {
      setLoadingLogs(false);
    }
  }

  function selecionar(item: ListItem) {
    setActiveItem(item);
    setFormName(item.name);
    setFormIsActive(item.isActive);
    setTestResult(null);

    if (item.type === "notification") {
      setNotifTitulo(item.raw.titulo);
      setNotifCorpo(item.raw.corpo_template);
      setNotifEvento(item.raw.evento);
      setEditorTab("template");
    } else {
      const isLegacy = item.id.startsWith("legacy-");
      if (isLegacy) {
        const w = item.raw as WebhookLegacy;
        setApiMethod(w.metodo || "POST");
        setApiUrl(w.url || "");
        setApiHeaders(w.headers || {});
        setApiQuery({});
        setApiBody(w.body_template ? JSON.stringify(w.body_template, null, 2) : "");
        setApiEvento(w.evento || null);
        setApiTipoEvento(w.tipo_evento || null);
      } else {
        const c = item.raw as ApiConnector;
        setApiMethod(c.method || "POST");
        setApiUrl(c.url || "");
        setApiHeaders(c.headers || {});
        setApiQuery(c.query_params || {});
        setApiBody(c.body_template || "");
        setApiEvento(c.evento || null);
        setApiTipoEvento(c.tipo_evento || null);
      }
      setEditorTab("headers");
    }
  }

  function iniciarCriacao(tipo: ItemType) {
    const tempId = `new-${tipo}-${Date.now()}`;
    const newItem: ListItem = {
      id: tempId,
      name: tipo === "api_call" ? "Nova Chamada de API" : tipo === "webhook" ? "Novo Webhook Gatilho" : "Novo Template de Notificação",
      type: tipo,
      subtitle: "Criando novo...",
      isActive: true,
      raw: {}
    };

    setActiveItem(newItem);
    setFormName(newItem.name);
    setFormIsActive(true);
    setTestResult(null);

    if (tipo === "notification") {
      setNotifTitulo("Novo Alerta de Sistema");
      setNotifCorpo("Olá {{lead_nome}}, seu cadastro está pendente.");
      setNotifEvento("");
      setEditorTab("template");
    } else {
      setApiMethod("POST");
      setApiUrl("https://");
      setApiHeaders({ "Content-Type": "application/json" });
      setApiQuery({});
      setApiBody("{\n  \"lead_id\": \"{{cadastro_id}}\"\n}");
      setApiEvento(null);
      setApiTipoEvento(null);
      setEditorTab("headers");
    }
  }

  async function handleSalvar() {
    if (!activeItem) return;
    if (!formName.trim()) return toast.error("Por favor, informe um nome");
    if (activeItem.type !== "notification" && !apiUrl.trim()) return toast.error("URL é obrigatória");
    if (activeItem.type === "notification" && (!notifTitulo.trim() || !notifCorpo.trim() || !notifEvento.trim())) {
      return toast.error("Título, Corpo e Evento são obrigatórios para Notificações");
    }

    setSaving(true);
    try {
      const isNew = activeItem.id.startsWith("new-");
      
      if (activeItem.type === "notification") {
        const payload = {
          evento: notifEvento,
          titulo: notifTitulo,
          corpo_template: notifCorpo,
          ativo: formIsActive
        };

        if (isNew) {
          await criarTemplate(payload);
          toast.success("Notificação criada com sucesso!");
        } else {
          const id = activeItem.id.replace("notif-", "");
          await atualizarTemplatePorId(id, payload);
          toast.success("Notificação atualizada com sucesso!");
        }
      } else {
        // Tratar APIs e Webhooks
        const isLegacy = activeItem.id.startsWith("legacy-");
        
        if (isLegacy) {
          // Salvar na tabela legada webhooks
          let parsedBody = {};
          try {
            if (apiBody.trim()) parsedBody = JSON.parse(apiBody);
          } catch {
            setSaving(false);
            return toast.error("O Body Template precisa ser um JSON válido");
          }

          const id = activeItem.id.replace("legacy-", "");
          await atualizarWebhook(id, {
            nome: formName,
            url: apiUrl,
            metodo: apiMethod,
            headers: apiHeaders,
            body_template: parsedBody,
            evento: apiEvento || undefined,
            tipo_evento: apiTipoEvento || undefined,
            ativo: formIsActive
          });
          toast.success("Webhook atualizado!");
        } else {
          // Salvar na tabela api_connectors (Padrão)
          const payload = {
            name: formName,
            type: activeItem.type as "api_call" | "webhook",
            method: apiMethod,
            url: apiUrl,
            headers: apiHeaders,
            query_params: apiQuery,
            body_template: apiBody,
            response_schema: isNew ? null : activeItem.raw.response_schema || null,
            evento: apiEvento,
            tipo_evento: apiTipoEvento,
            is_active: formIsActive
          };

          if (isNew) {
            const created = await createApiConnector(payload);
            setActiveItem({
              id: created.id,
              name: created.name,
              type: created.type,
              subtitle: created.type === "api_call" ? "API Externa" : `Webhook: ${created.evento}`,
              isActive: created.is_active,
              raw: created
            });
            toast.success("Conexão criada com sucesso!");
          } else {
            await updateApiConnector(activeItem.id, payload);
            toast.success("Conexão atualizada com sucesso!");
          }
        }
      }

      await carregarTudo();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + (err.message || "Tente novamente"));
    } finally {
      setSaving(false);
    }
  }

  async function handleExcluir() {
    if (!activeItem || activeItem.id.startsWith("new-")) return;
    if (!confirm("Tem certeza que deseja excluir esta ação permanentemente?")) return;

    try {
      if (activeItem.type === "notification") {
        const id = activeItem.id.replace("notif-", "");
        await deletarTemplate(id);
      } else if (activeItem.id.startsWith("legacy-")) {
        const id = activeItem.id.replace("legacy-", "");
        await deletarWebhook(id);
      } else {
        await deleteApiConnector(activeItem.id);
      }
      toast.success("Ação excluída com sucesso!");
      setActiveItem(null);
      await carregarTudo();
    } catch {
      toast.error("Erro ao excluir ação");
    }
  }

  async function handleTestar() {
    if (!activeItem || activeItem.id.startsWith("new-")) return toast.error("Salve antes de testar!");
    let vars = {};
    try {
      vars = JSON.parse(testVars || "{}");
    } catch {
      return toast.error("As variáveis de teste precisam ser um JSON válido");
    }

    setTesting(true);
    try {
      if (activeItem.type === "notification") {
        // Testar interpolação da notificação localmente na tela
        let tituloFinal = notifTitulo;
        let msgFinal = notifCorpo;

        for (const [chave, valor] of Object.entries(vars)) {
          const placeholder = new RegExp(`{{${chave}}}`, "g");
          tituloFinal = tituloFinal.replace(placeholder, String(valor));
          msgFinal = msgFinal.replace(placeholder, String(valor));
        }

        setTestResult({
          status: 200,
          duration: 1,
          data: {
            destinatario_simulado: "Usuário Logado",
            titulo_interpolado: tituloFinal,
            mensagem_interpolada: msgFinal,
            variaveis_recebidas: vars
          }
        });
        toast.success("Notificação testada com sucesso!");
      } else if (activeItem.id.startsWith("legacy-")) {
        toast.error("Testes diretos de Webhooks legados não são suportados. Converta para nova estrutura.");
      } else {
        const result = await executeApiConnector(activeItem.id, vars);
        setTestResult(result);
        toast.success("Teste de API concluído!");
      }
    } catch (e: any) {
      toast.error("Erro no teste: " + e.message);
    } finally {
      setTesting(false);
    }
  }

  // KV Editor Helper para headers/query params
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
            <input value={k} onChange={e => updateKey(i, e.target.value)} className="w-full sm:w-1/3 rounded border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main focus:border-accent" placeholder="Chave" />
            <div className="flex gap-2 flex-1">
              <input value={v} onChange={e => updateVal(k, e.target.value)} className="flex-1 rounded border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main focus:border-accent" placeholder="Valor {{variavel}}" />
              <button onClick={() => remove(k)} className="p-2 text-red-400 hover:bg-red-400/10 rounded shrink-0"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        <button onClick={add} className="text-xs font-medium text-accent hover:underline self-start flex items-center gap-1 mt-2"><PlusCircle size={12}/> Adicionar Linha</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Navegação da Central */}
      <div className="flex gap-2 border-b border-input-border pb-2">
        <button 
          onClick={() => setActiveTab("actions")} 
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === "actions" ? "bg-accent text-white" : "bg-card text-text-muted hover:text-text-main"}`}
        >
          <Settings2 size={14}/> Gerenciador de Ações
        </button>
        <button 
          onClick={() => { setActiveTab("logs"); carregarLogs(); }} 
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === "logs" ? "bg-accent text-white" : "bg-card text-text-muted hover:text-text-main"}`}
        >
          <History size={14}/> Logs de Execução
        </button>
      </div>

      {activeTab === "actions" ? (
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-210px)]">
          {/* Barra Lateral de Ações */}
          <div className={`w-full lg:w-80 flex flex-col gap-4 bg-card rounded-xl border border-input-border p-4 shadow-lg ${activeItem ? "hidden lg:flex" : "flex"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-main uppercase tracking-wider">Ações Configuradas</h2>
              <button onClick={carregarTudo} title="Atualizar dados" className="text-text-muted hover:text-text-main"><RefreshCw size={14}/></button>
            </div>

            {/* Ações Rápidas de Criação */}
            <div className="grid grid-cols-3 gap-1 bg-bg-dark p-1 rounded-lg">
              <button onClick={() => iniciarCriacao("api_call")} className="text-[9px] font-bold py-2 rounded text-accent hover:bg-card flex flex-col items-center gap-1">
                <Link2 size={12}/> API
              </button>
              <button onClick={() => iniciarCriacao("webhook")} className="text-[9px] font-bold py-2 rounded text-accent hover:bg-card flex flex-col items-center gap-1">
                <Webhook size={12}/> Webhook
              </button>
              <button onClick={() => iniciarCriacao("notification")} className="text-[9px] font-bold py-2 rounded text-accent hover:bg-card flex flex-col items-center gap-1">
                <Bell size={12}/> Notificação
              </button>
            </div>

            {/* Listagem */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 max-h-[400px] lg:max-h-none">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-accent" /></div>
              ) : items.length === 0 ? (
                <p className="text-center text-xs text-text-muted py-8">Nenhuma ação cadastrada</p>
              ) : (
                items.map(item => {
                  const Icon = item.type === "api_call" ? Link2 : item.type === "webhook" ? Webhook : Bell;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => selecionar(item)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition ${activeItem?.id === item.id ? "bg-accent/20 border-l-2 border-accent" : "hover:bg-bg-dark border-l-2 border-transparent"}`}
                    >
                      <Icon size={14} className={`mt-0.5 ${item.isActive ? "text-accent" : "text-text-muted"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-main truncate">{item.name}</p>
                        <p className="text-[10px] text-text-muted truncate">{item.subtitle}</p>
                      </div>
                      {!item.isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Área de Edição e Configuração */}
          {activeItem ? (
            <div className="flex-1 bg-card rounded-xl border border-input-border shadow-lg flex flex-col overflow-hidden h-[calc(100vh-210px)] lg:h-auto">
              
              {/* Header do Editor */}
              <div className="p-4 border-b border-input-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-bg-dark/50">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <button onClick={() => setActiveItem(null)} className="lg:hidden p-2 text-text-muted hover:bg-input-bg rounded shrink-0">{"<"}</button>
                  <input 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    className="text-sm font-bold bg-transparent text-text-main outline-none w-full border-b border-transparent focus:border-accent" 
                    placeholder="Nome da Ação" 
                  />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-main">
                    <input 
                      type="checkbox" 
                      checked={formIsActive} 
                      onChange={e => setFormIsActive(e.target.checked)} 
                      className="accent-accent w-4 h-4" 
                    />
                    Ativo
                  </label>
                  <button onClick={handleSalvar} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90 disabled:opacity-50">
                    {saving ? <Loader2 size={12} className="animate-spin"/> : <Save size={12}/>} Salvar
                  </button>
                  {!activeItem.id.startsWith("new-") && (
                    <button onClick={handleExcluir} title="Excluir ação" className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <Trash2 size={14}/>
                    </button>
                  )}
                </div>
              </div>

              {/* Parâmetros do Gatilho (Webhooks e Notificações) */}
              {(activeItem.type === "webhook" || activeItem.type === "notification") && (
                <div className="px-5 pt-4 pb-2 border-b border-input-border bg-bg-dark/30 flex flex-col sm:flex-row gap-3">
                  {activeItem.type === "webhook" ? (
                    <>
                      <select 
                        value={apiTipoEvento || ""} 
                        onChange={e => {
                          const val = e.target.value as any;
                          setApiTipoEvento(val);
                          setApiEvento(null);
                        }} 
                        className="w-full sm:w-1/3 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs font-bold text-accent outline-none"
                      >
                        <option value="">Tipo de Gatilho...</option>
                        <option value="status_change">Mudança de Status</option>
                        <option value="button_action">Ação de Botão</option>
                      </select>
                      {apiTipoEvento === "status_change" && (
                        <select value={apiEvento || ""} onChange={e => setApiEvento(e.target.value)} className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main outline-none focus:border-accent">
                          <option value="">Selecione o Status...</option>
                          {EVENTOS_STATUS_CHANGE.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                        </select>
                      )}
                      {apiTipoEvento === "button_action" && (
                        <select value={apiEvento || ""} onChange={e => setApiEvento(e.target.value)} className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main outline-none focus:border-accent">
                          <option value="">Selecione o Botão...</option>
                          {EVENTOS_BUTTON_ACTION.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                        </select>
                      )}
                    </>
                  ) : (
                    <div className="w-full">
                      <label className="text-[10px] font-bold text-text-muted mb-1 block uppercase">Gatilho do Evento</label>
                      <select 
                        value={notifEvento} 
                        onChange={e => setNotifEvento(e.target.value)} 
                        className="w-full rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main outline-none focus:border-accent"
                      >
                        <option value="">Vincular a qual evento?</option>
                        <optgroup label="Mudanças de Status">
                          {EVENTOS_STATUS_CHANGE.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                        </optgroup>
                        <optgroup label="Ações de Botões">
                          {EVENTOS_BUTTON_ACTION.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                        </optgroup>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes HTTP (Apenas para APIs e Webhooks) */}
              {activeItem.type !== "notification" && (
                <div className="p-4 flex flex-col sm:flex-row gap-2 border-b border-input-border bg-bg-dark/10">
                  <select 
                    value={apiMethod} 
                    onChange={e => setApiMethod(e.target.value)} 
                    className="w-full sm:w-28 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs font-bold text-accent outline-none"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input 
                    value={apiUrl} 
                    onChange={e => setApiUrl(e.target.value)} 
                    className="flex-1 rounded-lg border border-input-border bg-bg-dark px-3 py-2 text-xs text-text-main outline-none focus:border-accent font-mono" 
                    placeholder="https://api.exemplo.com/v1/lead/{{cadastro_id}}" 
                  />
                </div>
              )}

              {/* Abas Secundárias do Editor */}
              <div className="flex border-b border-input-border px-4 my-1 overflow-x-auto whitespace-nowrap scrollbar-hide bg-bg-dark/20">
                {activeItem.type === "notification" ? (
                  <>
                    <button onClick={() => setEditorTab("template")} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${editorTab === "template" ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-main"}`}>
                      Layout da Notificação
                    </button>
                    <button onClick={() => setEditorTab("test")} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${editorTab === "test" ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-main"}`}>
                      Visualizar & Testar
                    </button>
                  </>
                ) : (
                  <>
                    {[
                      { id: "headers", label: "Headers" },
                      { id: "query", label: "Query Params" },
                      { id: "body", label: "Body Template" },
                      { id: "test", label: "Testar & Inicializar" }
                    ].map(t => (
                      <button key={t.id} onClick={() => setEditorTab(t.id as any)} className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${editorTab === t.id ? "border-accent text-accent" : "border-transparent text-text-muted hover:text-text-main"}`}>
                        {t.label}
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Conteúdo do Editor */}
              <div className="p-5 flex-1 overflow-y-auto bg-card">
                
                {editorTab === "headers" && activeItem.type !== "notification" && (
                  <div className="max-w-3xl">
                    <p className="text-[11px] text-text-muted mb-4">Envie cabeçalhos HTTP na requisição. Suporta variáveis `{"{{var}}"}`.</p>
                    <KVEditor data={apiHeaders} onChange={v => setApiHeaders(v)} />
                  </div>
                )}

                {editorTab === "query" && activeItem.type !== "notification" && (
                  <div className="max-w-3xl">
                    <p className="text-[11px] text-text-muted mb-4">Parâmetros anexados ao final da URL (ex: ?origem=app). Suporta variáveis `{"{{var}}"}`.</p>
                    <KVEditor data={apiQuery} onChange={v => setApiQuery(v)} />
                  </div>
                )}

                {editorTab === "body" && activeItem.type !== "notification" && (
                  <div className="flex flex-col h-full max-w-4xl min-h-[250px]">
                    <p className="text-[11px] text-text-muted mb-2">Defina o corpo JSON da chamada. Use `{"{{campo}}"}` para interpolar informações dinâmicas do lead.</p>
                    <textarea 
                      value={apiBody} 
                      onChange={e => setApiBody(e.target.value)}
                      className="flex-1 w-full rounded-lg border border-input-border bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-xs outline-none focus:border-accent resize-none min-h-[200px]"
                      spellCheck={false}
                      placeholder={'{\n  "lead": "{{lead_nome}}"\n}'}
                    />
                  </div>
                )}

                {editorTab === "template" && activeItem.type === "notification" && (
                  <div className="flex flex-col gap-4 max-w-2xl">
                    <div>
                      <label className="text-xs font-bold text-text-muted mb-1 block">Título da Notificação</label>
                      <input 
                        value={notifTitulo} 
                        onChange={e => setNotifTitulo(e.target.value)}
                        className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-2.5 text-xs text-text-main outline-none focus:border-accent"
                        placeholder="Ex: Lead Atualizado!"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-muted mb-1 block">Corpo da Mensagem (Suporta templates `{"{{lead_nome}}"}`, `{"{{motivo}}"}`, etc.)</label>
                      <textarea 
                        value={notifCorpo} 
                        onChange={e => setNotifCorpo(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-2.5 text-xs text-text-main outline-none focus:border-accent resize-none font-mono"
                        placeholder="Ex: Olá {{lead_nome}}, seu cadastro está sob revisão."
                      />
                    </div>
                  </div>
                )}

                {editorTab === "test" && (
                  <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[350px]">
                    <div className="flex-1 flex flex-col w-full lg:max-w-xs">
                      <h3 className="text-xs font-bold text-text-main mb-2">Variáveis de Teste (Mock)</h3>
                      <p className="text-[10px] text-text-muted mb-4">JSON contendo os valores para testar a injeção nos templates e parâmetros.</p>
                      <textarea 
                        value={testVars} 
                        onChange={e => setTestVars(e.target.value)}
                        className="h-32 w-full rounded-lg border border-input-border bg-[#1e1e1e] text-[#d4d4d4] p-3 font-mono text-xs outline-none focus:border-accent resize-none mb-3"
                        spellCheck={false}
                      />
                      <button 
                        onClick={handleTestar} 
                        disabled={testing || activeItem.id.startsWith("new-")} 
                        className="flex justify-center items-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {testing ? <Loader2 size={14} className="animate-spin"/> : <Play size={14}/>} Testar Ação
                      </button>
                      {activeItem.id.startsWith("new-") && <p className="text-[9px] text-center text-red-400 mt-2">Salve antes de poder testar.</p>}
                    </div>

                    <div className="flex-1 flex flex-col bg-bg-dark rounded-lg border border-input-border overflow-hidden">
                      <div className="bg-input-bg p-3 border-b border-input-border flex justify-between items-center">
                        <h3 className="text-xs font-bold text-text-main flex items-center gap-1"><Code size={14}/> Retorno</h3>
                        {testResult && (
                          <div className="flex gap-3 text-[10px] font-mono">
                            <span className={testResult.status >= 200 && testResult.status < 300 ? "text-green-400" : "text-red-400"}>Status: {testResult.status}</span>
                            <span className="text-accent">Duração: {testResult.duration}ms</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 overflow-auto">
                        {!testResult ? (
                          <div className="h-full flex items-center justify-center text-text-muted text-xs">Execute o teste para visualizar a resposta</div>
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
            <div className="flex-1 bg-card rounded-xl border border-input-border shadow-lg flex items-center justify-center p-8 text-center flex-col h-[300px] lg:h-auto">
              <Settings2 size={48} className="text-input-border mb-4"/>
              <h2 className="text-sm font-bold text-text-main mb-2">Central de Integrações, Ações & Notificações</h2>
              <p className="text-xs text-text-muted max-w-sm">Selecione uma ação existente na barra lateral para começar a configurar ou crie uma nova.</p>
            </div>
          )}
        </div>
      ) : (
        /* Aba de Logs Unificada */
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">Histórico das últimas 100 execuções de Webhooks e chamadas de API.</p>
            <button onClick={carregarLogs} disabled={loadingLogs} className="flex items-center gap-1.5 rounded-lg bg-card border border-input-border px-3 py-1.5 text-xs text-text-muted hover:text-text-main">
              {loadingLogs ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Atualizar
            </button>
          </div>
          {loadingLogs && logs.length === 0 ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
          ) : logs.length === 0 ? (
            <p className="py-12 text-center text-xs text-text-muted bg-card rounded-xl border border-input-border">Nenhum log registrado</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="rounded-xl bg-card border border-input-border p-3.5 shadow-sm hover:border-border-subtle transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${log.sucesso ? "bg-green-400" : "bg-red-400"}`} />
                      <span className="text-xs font-bold text-text-main">{log.evento}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${log.status_code && log.status_code < 300 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        Status: {log.status_code || "FALHA"}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono">{new Date(log.created_at).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-text-muted break-all font-mono">
                    <span className="font-bold text-text-main">URL:</span> {log.url || "N/A"}
                  </div>
                  {log.resposta && (
                    <div className="mt-1.5 bg-bg-dark p-2 rounded text-[10px] text-text-muted font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                      {log.resposta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
