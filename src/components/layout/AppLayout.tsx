import { Outlet, useNavigate, useLocation, Link } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { ModuleDrawer } from "./ModuleDrawer";
import { NavSidebar } from "./NavSidebar";
import { useAuth } from "~/lib/auth";
import { LogOut, Bell, Building2, Grid3X3 } from "lucide-react";
import { useModulos } from "./useNavItems";
import { getAllModules } from "~/registry";
import { cn } from "~/lib/utils";
import { DeviceGate } from "./DeviceGate";
import { PwaInstallPrompt } from "./PwaInstallPrompt";
import { useState, useEffect } from "react";
import { listarNotificacoes, marcarComoLida, marcarTodasComoLidas, type Notificacao } from "~/lib/notificacoes";
import { useEmpresaTheme } from "~/core/theme";

const LS_KEY = "selectedModule";
const LS_SIDEBAR = "sidebarCollapsed";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout, empresa, permissoes, modulosAcesso, modulosAtivos } = useAuth();
  const { logoAppUrl } = useEmpresaTheme();
  const modulos = useModulos();
  const [showDrawer, setShowDrawer] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem(LS_SIDEBAR) === "true"; }
    catch { return false; }
  });
  const toggleSidebar = () => setSidebarCollapsed(p => {
    const next = !p;
    localStorage.setItem(LS_SIDEBAR, String(next));
    return next;
  });
  const [selectedModuleKey, setSelectedModuleKey] = useState<string | undefined>(() => {
    try { const saved = localStorage.getItem(LS_KEY); return saved && getAllModules().some(m => m.key === saved) ? saved : undefined; }
    catch { return undefined; }
  });
  useEffect(() => {
    if (selectedModuleKey !== undefined) {
      localStorage.setItem(LS_KEY, selectedModuleKey);
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [selectedModuleKey]);

  useEffect(() => {
    if (!profile?.is_super_admin) {
      const temAcesso = selectedModuleKey ? modulos.some(m => m.key === selectedModuleKey) : false;
      if (!temAcesso && modulos.length > 0) {
        setSelectedModuleKey(modulos[0].key);
      }
    }
  }, [profile, modulos, selectedModuleKey]);

  const [notifs, setNotifs] = useState<Notificacao[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [ocultarLidas, setOcultarLidas] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      carregarNotifs();
      const interval = setInterval(carregarNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [profile?.id]);

  async function carregarNotifs() {
    if (!profile?.id) return;
    try {
      const data = await listarNotificacoes(profile.id);
      setNotifs(data);
    } catch (e) {
      console.error("Erro ao carregar notificações:", e);
    }
  }

  async function handleMarcarLida(id: string, cadastroId?: string, jaLida?: boolean) {
    try {
      if (!jaLida) {
        await marcarComoLida(id);
        await carregarNotifs();
      }
      if (cadastroId) {
        setShowNotifs(false);
        navigate({ to: "/clientes/$id", params: { id: cadastroId } });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleMarcarTodasLidas() {
    if (!profile?.id) return;
    try {
      await marcarTodasComoLidas(profile.id);
      await carregarNotifs();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <DeviceGate>
      <div className="min-h-dvh bg-bg-dark">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-header-bg/95 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3 lg:h-[70px] max-w-7xl mx-auto w-full relative">
          <div className="flex items-center gap-1">
            {logoAppUrl ? (
              <img src={logoAppUrl} alt={empresa?.nome ?? "Conexão"} className="h-7 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-accent" />
                <span className="text-sm font-bold text-text-main truncate max-w-[160px]">
                  {empresa?.nome ?? "Conexão"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {modulos.length > 1 && (
              <button onClick={() => setShowDrawer(true)} className="lg:hidden flex items-center justify-center p-1.5 rounded-lg text-text-muted hover:bg-input-bg hover:text-text-main transition-colors" title="Módulos e navegação">
                <Grid3X3 size={18} />
              </button>
            )}

            <div className="relative">
              {(() => {
                const naoLidas = notifs.filter(n => !n.lida);
                const notificacoesExibidas = ocultarLidas ? naoLidas : notifs;
                return (
                  <>
                    <button onClick={() => setShowNotifs(!showNotifs)} className="relative flex items-center justify-center p-1.5 rounded-lg text-text-muted hover:bg-input-bg hover:text-text-main transition-colors" title="Notificações">
                      <Bell size={18} />
                      {naoLidas.length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-header-bg">{naoLidas.length}</span>
                      )}
                    </button>
                    {showNotifs && (
                      <div className="absolute right-0 mt-2 w-72 max-sm:fixed max-sm:inset-x-4 max-sm:top-16 max-sm:w-auto rounded-xl bg-card border border-border-subtle shadow-2xl z-50 p-2 flex flex-col gap-1.5 max-h-[350px] max-sm:max-h-[60dvh] overflow-y-auto">
                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-border-subtle/50 mb-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-text-main">Notificações</span>
                            <button onClick={() => setOcultarLidas(!ocultarLidas)} className="text-[9px] text-text-muted hover:text-accent font-semibold flex items-center gap-1 transition-colors self-start">{ocultarLidas ? "Ver lidas" : "Ocultar lidas"}</button>
                          </div>
                          {naoLidas.length > 0 && <button onClick={handleMarcarTodasLidas} className="text-[10px] text-accent font-medium hover:underline">Limpar tudo</button>}
                        </div>
                        {notificacoesExibidas.length === 0 ? (
                          <p className="text-center text-xs text-text-muted py-6">Nenhuma notificação {ocultarLidas ? "nova" : "no histórico"}</p>
                        ) : (
                          notificacoesExibidas.map(n => (
                            <button key={n.id} onClick={() => handleMarcarLida(n.id, n.dados?.cadastro_id, n.lida)}
                              className={cn("w-full text-left rounded-lg p-2 transition flex flex-col gap-0.5 border text-text-main", n.lida ? "bg-transparent border-transparent opacity-60 hover:bg-bg-dark" : "bg-accent/5 border-accent/20 hover:bg-accent/10")}>
                              <div className="flex items-center justify-between w-full">
                                <span className={cn("text-xs font-bold", n.lida ? "text-text-muted" : "text-text-main")}>{n.titulo}</span>
                                {!n.lida && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
                              </div>
                              <span className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{n.mensagem}</span>
                              <span className="text-[8px] text-text-muted mt-1 font-mono">{new Date(n.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - {new Date(n.created_at).toLocaleDateString("pt-BR")}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <span className="text-[11px] text-text-muted block truncate max-w-[120px]">{profile?.nome}</span>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      <NavSidebar selectedModuleKey={selectedModuleKey} onModuleChange={setSelectedModuleKey} modulos={modulos} collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      <ModuleDrawer open={showDrawer} onClose={() => setShowDrawer(false)} selectedModuleKey={selectedModuleKey} onModuleChange={setSelectedModuleKey} modulos={modulos} />
      <main className={cn("mx-auto max-w-7xl w-full transition-all duration-200 pb-20 lg:pb-0", sidebarCollapsed ? "lg:ml-16" : "lg:ml-60")}>
        <Outlet />
      </main>
      <BottomNav selectedModuleKey={selectedModuleKey} />
      </div>
      <PwaInstallPrompt />
    </DeviceGate>
  );
}
