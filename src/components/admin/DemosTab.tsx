import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Link2, Copy, Shield, Database } from "lucide-react";
import toast from "react-hot-toast";
import { listarLinksTestes, criarLinkTeste, excluirLinkTeste, listarDemoCredentials, criarDemoCredential, excluirDemoCredential, type LinkTeste, type DemoCredential } from "~/lib/demos";

export function DemosTab() {
  const [links, setLinks] = useState<LinkTeste[]>([]);
  const [demos, setDemos] = useState<DemoCredential[]>([]);
  const [loading, setLoading] = useState(true);

  // Link form
  const [criandoLink, setCriandoLink] = useState(false);
  const [descLink, setDescLink] = useState("");
  const [tipoLink, setTipoLink] = useState<"PF" | "PJ">("PJ");
  const [confirmDeleteLink, setConfirmDeleteLink] = useState<string | null>(null);

  // Demo form
  const [criandoDemo, setCriandoDemo] = useState(false);
  const [emailDemo, setEmailDemo] = useState("");
  const [senhaDemo, setSenhaDemo] = useState("");
  const [roleDemo, setRoleDemo] = useState("editor");
  const [qtdMock, setQtdMock] = useState(5);
  const [confirmDeleteDemo, setConfirmDeleteDemo] = useState<{id: string, userId: string} | null>(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const [l, d] = await Promise.all([listarLinksTestes(), listarDemoCredentials()]);
      setLinks(l);
      setDemos(d);
    } catch {
      toast.error("Erro ao carregar laboratório");
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarLink() {
    if (!descLink.trim()) return toast.error("Preencha a descrição");
    setCriandoLink(true);
    try {
      await criarLinkTeste(descLink, tipoLink);
      toast.success("Link gerado!");
      setDescLink("");
      carregar();
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setCriandoLink(false);
    }
  }

  async function handleExcluirLink(id: string) {
    try {
      await excluirLinkTeste(id);
      toast.success("Excluído");
      setConfirmDeleteLink(null);
      carregar();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  async function handleCriarDemo() {
    if (!emailDemo || !senhaDemo) return toast.error("Preencha email e senha");
    setCriandoDemo(true);
    try {
      await criarDemoCredential(emailDemo, senhaDemo, roleDemo, qtdMock);
      toast.success("Conta Demo Criada com Sucesso!");
      setEmailDemo(""); setSenhaDemo("");
      carregar();
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    } finally {
      setCriandoDemo(false);
    }
  }

  async function handleExcluirDemo(id: string, userId: string) {
    try {
      await excluirDemoCredential(id, userId);
      toast.success("Conta Demo aniquilada");
      setConfirmDeleteDemo(null);
      carregar();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-card p-5 shadow-lg">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4">
          <Link2 size={16} className="text-accent" /> Links de Teste Rota Coleta
        </h2>
        <div className="flex flex-col gap-3 md:flex-row items-end mb-4 bg-input-bg p-3 rounded-lg border border-input-border">
          <div className="flex-1 w-full">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Descrição do Teste</label>
            <input value={descLink} onChange={e => setDescLink(e.target.value)} placeholder="Ex: QA Pessoa Física" className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent" />
          </div>
          <div className="w-full md:w-32">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Tipo Cliente</label>
            <select value={tipoLink} onChange={e => setTipoLink(e.target.value as any)} className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent">
              <option value="PF" className="text-black bg-white">Física</option>
              <option value="PJ" className="text-black bg-white">Jurídica</option>
            </select>
          </div>
          <button onClick={handleCriarLink} disabled={criandoLink} className="flex items-center justify-center gap-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {criandoLink ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Gerar Link
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {links.length === 0 && <p className="text-xs text-text-muted py-4 text-center">Nenhum link gerado.</p>}
          {links.map(l => (
            <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-input-border bg-bg-dark p-3">
              <div>
                <p className="text-xs font-bold text-text-main">{l.descricao}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-text-muted font-mono bg-black/20 px-2 py-0.5 rounded truncate max-w-[200px]">{l.token}</p>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/pre-cadastro/${l.token}`); toast.success("URL Copiada!"); }} className="text-accent hover:text-accent/80 p-1" title="Copiar URL completa"><Copy size={12} /></button>
                </div>
              </div>
              <button onClick={() => setConfirmDeleteLink(l.id)} className="text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-card p-5 shadow-lg">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4">
          <Shield size={16} className="text-accent" /> Credenciais Demo (Mocks)
        </h2>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap items-end mb-4 bg-input-bg p-3 rounded-lg border border-input-border">
          <div className="flex-1 w-full min-w-[200px]">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Email Demo</label>
            <input type="email" value={emailDemo} onChange={e => setEmailDemo(e.target.value)} placeholder="demo@teste.com" className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent" />
          </div>
          <div className="w-full md:w-32">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Senha Livre</label>
            <input value={senhaDemo} onChange={e => setSenhaDemo(e.target.value)} className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent" />
          </div>
          <div className="w-full md:w-32">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Papel</label>
            <select value={roleDemo} onChange={e => setRoleDemo(e.target.value)} className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent">
              <option value="admin" className="text-black bg-white">Admin</option>
              <option value="editor" className="text-black bg-white">Editor</option>
              <option value="consultor" className="text-black bg-white">Consultor</option>
            </select>
          </div>
          <div className="w-full md:w-20">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Mocks</label>
            <input type="number" min="0" max="20" value={qtdMock} onChange={e => setQtdMock(Number(e.target.value))} className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent" />
          </div>
          <button onClick={handleCriarDemo} disabled={criandoDemo} className="flex items-center justify-center gap-1 w-full md:w-auto rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 mt-2 md:mt-0">
            {criandoDemo ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} Criar Demo
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {demos.length === 0 && <p className="text-xs text-text-muted py-4 text-center">Nenhuma conta demo ativa.</p>}
          {demos.map(d => (
            <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-input-border bg-bg-dark p-3">
              <div>
                <p className="text-xs font-bold text-text-main flex items-center gap-2">
                  {d.email_demo} <span className="text-[9px] font-normal bg-accent/20 text-accent px-1.5 py-0.5 rounded">{d.role_escolhida}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-text-muted font-mono">Senha: {d.senha_demo}</p>
                  <p className="text-[10px] text-text-muted border-l border-input-border pl-2 ml-1">{d.qtd_cadastros_mock} cadastros mockados</p>
                </div>
              </div>
              <button onClick={() => setConfirmDeleteDemo({ id: d.id, userId: d.user_id })} className="text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Excluir Link */}
      {confirmDeleteLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm" onClick={() => setConfirmDeleteLink(null)}>
          <div className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-xl border border-input-border" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-main mb-2">Excluir Link de Teste?</h3>
            <p className="text-sm text-text-muted mb-6">Tem certeza? O cadastro vinculado será deletado permanentemente.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDeleteLink(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => handleExcluirLink(confirmDeleteLink)} className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-600 rounded-xl transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Demo */}
      {confirmDeleteDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm" onClick={() => setConfirmDeleteDemo(null)}>
          <div className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-xl border border-input-border" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-text-main mb-2">Excluir Conta Demo?</h3>
            <p className="text-sm text-text-muted mb-6">Isso excluirá a conta, os perfis e <strong className="text-red-400 font-medium">TODOS</strong> os cadastros mock vinculados! Prosseguir?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDeleteDemo(null)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main hover:bg-input-bg rounded-xl transition-colors">Cancelar</button>
              <button onClick={() => handleExcluirDemo(confirmDeleteDemo.id, confirmDeleteDemo.userId)} className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-600 rounded-xl transition-colors">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
