import { type ReactNode, useEffect, useState, useCallback } from "react";
import { supabase } from "~/core/supabase";
import { AuthContext } from "./useAuth";
import { type Profile, type EmpresaInfo, type ModulosAcesso } from "./types";
import { getAllPermissionKeys } from "~/registry";
import toast from "react-hot-toast";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissoes, setPermissoes] = useState<Record<string, boolean> | null>(
    null,
  );
  const [modulosAcesso, setModulosAcesso] = useState<ModulosAcesso | null>(
    null,
  );
  const [empresa, setEmpresa] = useState<EmpresaInfo | null>(null);
  const [modulosAtivos, setModulosAtivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarEmpresa = useCallback(async (empresaId: string) => {
    const { data: emp } = await supabase
      .from("empresas")
      .select("id, nome, slug")
      .eq("id", empresaId)
      .single();
    if (!emp) return;

    const { data: config } = await supabase
      .from("empresas_config")
      .select("logo_url, logo_index_url, logo_app_url, favicon_url, theme")
      .eq("empresa_id", empresaId)
      .single();

    setEmpresa({
      id: emp.id,
      nome: emp.nome,
      slug: emp.slug,
      logo_url: config?.logo_url,
      logo_index_url: config?.logo_index_url,
      logo_app_url: config?.logo_app_url,
      favicon_url: config?.favicon_url,
      theme: (config?.theme ?? {}) as Record<string, string>,
    });

    const { data: modulos } = await supabase
      .from("modulos_empresa")
      .select("modulo_key, ativo")
      .eq("empresa_id", empresaId)
      .eq("ativo", true);

    setModulosAtivos((modulos ?? []).map((m) => m.modulo_key));
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setPermissoes(null);
        setModulosAcesso(null);
        setEmpresa(null);
        setModulosAtivos([]);
      }
      setLoading(false);
    });

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) await fetchProfile(user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string): Promise<void> {
    const { data: p, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && p) {
      setProfile(p as Profile);

      if (p.is_super_admin) {
        const allPerms: Record<string, boolean> = {};
        for (const key of getAllPermissionKeys()) {
          allPerms[key] = true;
        }
        setPermissoes(allPerms);
        setModulosAcesso(null);
      } else {
        const { data } = await supabase
          .from("permissoes")
          .select("permissoes, modulos_acesso")
          .eq("usuario_id", userId)
          .maybeSingle();

        const flatPerms = {
          ...((data?.permissoes as Record<string, boolean>) || {}),
        };
        const modulosAcc = data?.modulos_acesso as ModulosAcesso | null;

        if (modulosAcc) {
          for (const [, modulo] of Object.entries(modulosAcc)) {
            if (modulo?.acessar && Array.isArray(modulo.acoes)) {
              for (const acao of modulo.acoes) {
                flatPerms[acao] = true;
              }
            }
          }
        }

        setPermissoes(Object.keys(flatPerms).length > 0 ? flatPerms : null);
        setModulosAcesso(modulosAcc);
      }

      if (p.empresa_id) {
        await carregarEmpresa(p.empresa_id);
      }
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    toast.success("Login realizado!");
  }

  function refreshPermissoes(): void {
    if (profile?.is_super_admin) {
      const allPerms: Record<string, boolean> = {};
      for (const key of getAllPermissionKeys()) {
        allPerms[key] = true;
      }
      setPermissoes(allPerms);
    }
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async function register(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    toast.success("Cadastro realizado! Verifique seu email.");
  }

  async function resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissoes,
        modulosAcesso,
        empresa,
        modulosAtivos,
        loading,
        login,
        logout,
        register,
        resetPassword,
        fetchProfile,
        refreshPermissoes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
