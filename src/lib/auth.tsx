import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { User, AuthError } from "@supabase/supabase-js";
import toast from "react-hot-toast";

type Profile = {
  id: string;
  email: string;
  nome: string;
  role: "admin" | "editor" | "viewer";
  ambiente: "cadastro" | "consultor" | "tecnologia" | "ambos";
  ativo: boolean;
  is_super_admin?: boolean;
  departamento?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nome: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data as Profile | null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) fetchProfile(u.id);
        else setProfile(null);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const msg = errorMap(error);
      toast.error(msg);
      throw error;
    }
    toast.success("Login realizado!");
  }

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
  }

  async function register(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(errorMap(error));
      throw error;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        nome,
        role: "viewer",
      });
    }
    toast.success("Conta criada! Verifique seu email.");
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar`,
    });
    if (error) {
      toast.error(errorMap(error));
      throw error;
    }
    toast.success("Email de recuperação enviado!");
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, logout, register, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve estar dentro de AuthProvider");
  return ctx;
}

function errorMap(err: AuthError) {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email ou senha inválidos",
    "Email not confirmed": "Email não confirmado",
    "User already registered": "Email já cadastrado",
    "Password should be at least 6 characters": "Senha deve ter no mínimo 6 caracteres",
    "Rate limit exceeded": "Muitas tentativas. Aguarde e tente novamente.",
  };
  return map[err.message] || err.message;
}
