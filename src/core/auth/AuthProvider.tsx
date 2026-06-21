import { type ReactNode, useEffect, useState } from "react";
import { supabase } from "~/core/supabase";
import { AuthContext } from "./useAuth";
import { type Profile } from "./types";
import toast from "react-hot-toast";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissoes, setPermissoes] = useState<Record<string, boolean> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

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
      const perms = await getPermissoesDoUsuario(userId, p.is_super_admin);
      setPermissoes(perms);
    }
  }

  async function getPermissoesDoUsuario(
    userId: string,
    isSuperAdmin?: boolean
  ): Promise<Record<string, boolean> | null> {
    if (isSuperAdmin) {
      return {
        ver_todos_cadastros: true,
        aprovar_cadastro: true,
        reprovar_cadastro: true,
        solicitar_correcao_cadastro: true,
        aprovar_documento: true,
        reprovar_documento: true,
        solicitar_correcao_documento: true,
        aprovar_campo: true,
        reprovar_campo: true,
        solicitar_correcao_campo: true,
        visualizar_documento: true,
        excluir_cadastro: true,
        gerenciar_credenciais: true,
        gerenciar_credenciais_admin: true,
        gerenciar_config: true,
        gerar_links: true,
        ver_relatorios: true,
      };
    }
    const { data } = await supabase
      .from("permissoes")
      .select("permissoes")
      .eq("usuario_id", userId)
      .single();
    return data?.permissoes as Record<string, boolean> | null;
  }

  async function login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    toast.success("Login realizado!");
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
        loading,
        login,
        logout,
        register,
        resetPassword,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
