import { type User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string;
  nome: string;
  role: "admin" | "editor" | "viewer";
  avatar_url?: string;
  ambiente: string;
  departamento?: string;
  ativo: boolean;
  is_super_admin: boolean;
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  permissoes: Record<string, boolean> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchProfile?: (userId: string) => Promise<void>;
};
