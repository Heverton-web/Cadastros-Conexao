import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/core/supabase";
import { type Permissoes, type ModulosAcesso, type ModuloAcesso } from "~/core/permissions/types";
import { setPermissoes, getModulosAcesso, setModulosAcesso } from "~/core/permissions/services";

import { listarEmpresas, type Empresa } from "~/lib/empresas";
import { getAllModules, getNavItemsByModule, getAllPermissionDefs } from "~/registry";
import { useState, useEffect, useMemo } from "react";
import {
  Shield, Loader2, Save, Check, X, ChevronDown, ChevronRight, Building2,
  Lock, Unlock,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";

export const adminSuperPermissoesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/admin/super/permissoes",
  component: AdminSuperPermissoes,
});

type ProfileRow = {
  id: string;
  email: string;
  nome: string;
  ambiente: string;
  is_super_admin: boolean;
  empresa_id?: string | null;
  role?: string;
};

type ModuloUIO = {
  key: string;
  nome: string;
  icon: any;
  paginas: { id: string; label: string }[];
  acoes: { key: string; label: string; group: string }[];
};

function AdminSuperPermissoes() {
  const { profile } = useAuth();
  const isSuper = profile?.is_super_admin === true;
  const empresaVinculada = profile?.empresa_id as string | undefined;

  const [usuarios, setUsuarios] = useState<ProfileRow[]>([]);
  const [permMap, setPermMap] = useState<Record<string, Permissoes>>({});
  const [modulosMap, setModulosMap] = useState<Record<string, ModulosAcesso>>({});
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>(empresaVinculada || "");

  // Load modules once
  const modulos = useMemo(() => {
    const defs = getAllModules();
    const permDefs = getAllPermissionDefs();
    const permDefsMap = new Map(permDefs.map((p) => [p.key, p]));

    return defs.map((m) => {
      const paginas = getNavItemsByModule(m.key).map((n) => ({
        id: n.id,
        label: n.label,
      }));
      const acoes = (m.permissions || [])
        .map((pk) => permDefsMap.get(pk))
        .filter(Boolean)
        .map((p) => ({
          key: p!.key,
          label: p!.label,
          group: p!.group,
        }));
      return {
        key: m.key,
        nome: m.nome,
        icon: m.icon,
        paginas,
        acoes,
      } as ModuloUIO;
    });
  }, []);

  useEffect(() => {
    if (profile?.is_super_admin || (!profile?.is_super_admin && empresaVinculada)) {
      Promise.all([carregarUsuarios(filtroEmpresa || undefined), listarEmpresas()])
        .then(([_, emps]) => {
          if (isSuper) setEmpresas(emps);
          else setEmpresas(emps.filter((e) => e.id === empresaVinculada));
        });
    }
  }, [profile]);

  async function carregarUsuarios(empresaId?: string) {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("id, email, nome, ambiente, is_super_admin, empresa_id, role")
      .order("nome");

    if (!isSuper && empresaVinculada) {
      query = query.eq("empresa_id", empresaVinculada).neq("is_super_admin", true);
    } else if (empresaId) {
      query = query.eq("empresa_id", empresaId);
    } else if (!isSuper) {
      query = query.eq("empresa_id", null).neq("is_super_admin", true);
    }

    const { data: profiles } = await query;
    const rows = (profiles ?? []) as ProfileRow[];
    setUsuarios(rows);

    const { data: perms } = await supabase
      .from("permissoes")
      .select("usuario_id, permissoes, modulos_acesso");

    const permMap: Record<string, Permissoes> = {};
    const modMap: Record<string, ModulosAcesso> = {};
    for (const row of rows) {
      permMap[row.id] = { ...ALL_FALSE };
      modMap[row.id] = {};
    }
    for (const p of perms ?? []) {
      const uid = p.usuario_id as string;
      if (permMap[uid]) {
        permMap[uid] = { ...ALL_FALSE, ...(p.permissoes as any as Permissoes) };
      }
      if (modMap[uid]) {
        modMap[uid] = (p.modulos_acesso as ModulosAcesso) || {};
      }
    }
    setPermMap(permMap);
    setModulosMap(modMap);
    setDirtyMap({});
    setLoading(false);
  }

  if (!profile?.is_super_admin && !empresaVinculada) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text-muted text-sm">Acesso restrito a Super Admin ou Admin de empresa.</p>
      </div>
    );
  }

  function togglePerm(userId: string, key: keyof Permissoes) {
    setPermMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [key]: !prev[userId]?.[key] },
    }));
    setDirtyMap((prev) => ({ ...prev, [userId]: true }));
  }

  function setAllPerms(userId: string, value: boolean) {
    const all: Permissoes = {} as Permissoes;
    for (const k of Object.keys(ALL_FALSE) as (keyof Permissoes)[]) all[k] = value;
    setPermMap((prev) => ({ ...prev, [userId]: all }));
    setDirtyMap((prev) => ({ ...prev, [userId]: true }));
  }

  function toggleModuloAcessar(userId: string, modKey: string) {
    setModulosMap((prev) => {
      const current = prev[userId]?.[modKey];
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          [modKey]: {
            acessar: !current?.acessar,
            paginas: current?.acessar ? [] : modulos.find((m) => m.key === modKey)?.paginas.map((p) => p.id) || [],
            acoes: current?.acessar ? [] : modulos.find((m) => m.key === modKey)?.acoes.map((a) => a.key) || [],
          },
        },
      };
    });
    setDirtyMap((prev) => ({ ...prev, [userId]: true }));
  }

  function togglePagina(userId: string, modKey: string, paginaId: string) {
    setModulosMap((prev) => {
      const mod = prev[userId]?.[modKey];
      if (!mod?.acessar) return prev;
      const paginas = mod.paginas.includes(paginaId)
        ? mod.paginas.filter((p) => p !== paginaId)
        : [...mod.paginas, paginaId];
      return {
        ...prev,
        [userId]: { ...prev[userId], [modKey]: { ...mod, paginas } },
      };
    });
    setDirtyMap((prev) => ({ ...prev, [userId]: true }));
  }

  function toggleAcao(userId: string, modKey: string, acaoKey: string) {
    setModulosMap((prev) => {
      const mod = prev[userId]?.[modKey];
      if (!mod?.acessar) return prev;
      const acoes = mod.acoes.includes(acaoKey)
        ? mod.acoes.filter((a) => a !== acaoKey)
        : [...mod.acoes, acaoKey];
      return {
        ...prev,
        [userId]: { ...prev[userId], [modKey]: { ...mod, acoes } },
      };
    });
    setDirtyMap((prev) => ({ ...prev, [userId]: true }));
  }

  async function handleSave(userId: string) {
    setSaving(userId);
    try {
      await Promise.all([
        setPermissoes(userId, permMap[userId]),
        setModulosAcesso(userId, modulosMap[userId] || {}),
      ]);
      setDirtyMap((prev) => ({ ...prev, [userId]: false }));
      toast.success("Permissões salvas!");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(null);
  }

  function toggleExpand(userId: string) {
    setExpanded((prev) => ({ ...prev, [userId]: !prev[userId] }));
  }

  function handleEmpresaChange(val: string) {
    setFiltroEmpresa(val);
    carregarUsuarios(val || undefined);
  }

  const usuariosFiltrados = filtroEmpresa
    ? usuarios.filter((u) => u.empresa_id === filtroEmpresa)
    : usuarios;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Shield size={18} className="text-accent" /> Permissões
          </h1>
          <p className="text-xs text-text-muted">
            Configure quais módulos, páginas e ações cada credencial pode acessar por empresa.
          </p>
        </div>
      </div>

      {isSuper && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-text-muted" />
            <select
              value={filtroEmpresa}
              onChange={(e) => handleEmpresaChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-sm"
            >
              <option value="">Todas as empresas</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.nome}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : usuariosFiltrados.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-8">Nenhum usuário encontrado.</p>
      ) : (
        <div className="space-y-2">
          {usuariosFiltrados.map((u) => {
            const perms = permMap[u.id] ?? ALL_FALSE;
            const mods = modulosMap[u.id] ?? {};
            const isDirty = dirtyMap[u.id];
            const isOpen = expanded[u.id];

            return (
              <div key={u.id} className="rounded-lg bg-card border border-border-subtle overflow-hidden">
                <button
                  onClick={() => toggleExpand(u.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-surface-hover transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isOpen ? <ChevronDown size={14} className="shrink-0 text-text-muted" /> : <ChevronRight size={14} className="shrink-0 text-text-muted" />}
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-text-main block truncate">{u.nome}</span>
                      <span className="text-[10px] text-text-muted block truncate">{u.email} | {u.ambiente}{u.empresa_id ? ` | ${empresas.find((e) => e.id === u.empresa_id)?.nome || "—"}` : ""}</span>
                    </div>
                  </div>
                  {isDirty && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium shrink-0">Não salvo</span>
                  )}
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 pt-1 border-t border-border-subtle/50">

                    {/* Module-level permissions */}
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                      Acesso por módulo
                    </p>
                    <div className="space-y-2">
                      {modulos.map((mod) => {
                        const modAcesso = mods[mod.key];
                        const ativo = modAcesso?.acessar === true;
                        const Icon = mod.icon;
                        return (
                          <div key={mod.key} className="rounded-lg bg-input-bg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn("p-1 rounded-lg transition-colors", ativo ? "bg-accent/10 text-accent" : "bg-bg-dark text-text-muted")}>
                                <Icon size={14} />
                              </div>
                              <span className={cn("text-xs font-medium", ativo ? "text-text-main" : "text-text-muted")}>
                                {mod.nome}
                              </span>
                              <button onClick={() => toggleModuloAcessar(u.id, mod.key)}
                                className={cn("ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors",
                                  ativo ? "bg-accent/10 text-accent" : "bg-bg-dark text-text-muted hover:text-text-main"
                                )}
                              >
                                {ativo ? <Unlock size={12} /> : <Lock size={12} />}
                                {ativo ? "Acesso liberado" : "Sem acesso"}
                              </button>
                            </div>

                            {ativo && (
                              <div className="pl-6 space-y-2 border-l border-border-subtle/30 ml-[7px]">
                                {mod.paginas.length > 0 && (
                                  <div>
                                    <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Páginas</p>
                                    <div className="flex flex-wrap gap-1">
                                      {mod.paginas.map((pag) => {
                                        const ativa = modAcesso?.paginas?.includes(pag.id) || false;
                                        return (
                                          <button key={pag.id} onClick={() => togglePagina(u.id, mod.key, pag.id)}
                                            className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border",
                                              ativa ? "bg-accent/10 text-accent border-accent/20" : "bg-bg-dark text-text-muted border-transparent hover:text-text-main"
                                            )}
                                          >
                                            {ativa ? <Check size={8} /> : <X size={8} />}
                                            {pag.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {mod.acoes.length > 0 && (
                                  <div className="space-y-3 mt-2">
                                    {Object.entries(
                                      mod.acoes.reduce((acc, acao) => {
                                        const g = acao.group || 'Outras Ações';
                                        if (!acc[g]) acc[g] = [];
                                        acc[g].push(acao);
                                        return acc;
                                      }, {} as Record<string, typeof mod.acoes>)
                                    ).map(([groupName, acoesList]) => (
                                      <div key={groupName}>
                                        <p className="text-[9px] font-bold text-text-muted uppercase mb-1">{groupName}</p>
                                        <div className="flex flex-wrap gap-1">
                                          {acoesList.map((acao) => {
                                            const ativa = modAcesso?.acoes?.includes(acao.key) || false;
                                            return (
                                              <button key={acao.key} onClick={() => toggleAcao(u.id, mod.key, acao.key)}
                                                className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border",
                                                  ativa ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
                                                )}
                                              >
                                                {ativa ? <Check size={8} /> : <X size={8} />}
                                                {acao.label}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Botão salvar */}
                    {isDirty && (
                      <div className="flex justify-end mt-3 pt-2 border-t border-border-subtle/30">
                        <button onClick={() => handleSave(u.id)} disabled={saving === u.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50">
                          {saving === u.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                          Salvar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ALL_FALSE: Permissoes = {
  ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false,
  solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false,
  solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false,
  solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false,
  gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false,
  gerar_links: false, ver_relatorios: false,
};
