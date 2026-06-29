export interface EmpresaLinktreeConfig {
  id: string;
  empresa_id: string;
  slug: string;
  bio: string | null;
  banner_url: string | null;
  theme: EmpresaLinktreeTheme;
  updated_at: string;
  updated_by: string | null;
}

export interface EmpresaLinktreeSection {
  id: string;
  empresa_id: string;
  titulo: string;
  ordem: number;
  created_at: string;
}

export interface EmpresaLinktreeLink {
  id: string;
  section_id: string;
  empresa_id: string;
  titulo: string;
  url: string;
  icone: string | null;
  destaque: boolean;
  ativo: boolean;
  agendado_inicio: string | null;
  agendado_fim: string | null;
  ordem: number;
  created_at: string;
}

export interface EmpresaLinktreeClick {
  id: string;
  link_id: string;
  empresa_id: string;
  clicked_at: string;
  ip_hash: string | null;
  user_agent: string | null;
}

export interface EmpresaLinktreeTheme {
  background: {
    mode: "solid" | "gradient2" | "gradient3";
    solid: string;
    gradientFrom: string;
    gradientTo: string;
    gradientAngle: number;
    gradient3From: string;
    gradient3Mid: string;
    gradient3To: string;
    gradient3Angle: number;
  };
  buttons: {
    style: "rounded" | "square" | "pill";
    bgColor: string;
    textColor: string;
    borderRadius: number;
    shadow: boolean;
  };
  typography: {
    font: string;
    titleColor: string;
    bioColor: string;
  };
}

export const DEFAULT_EMPRESA_THEME: EmpresaLinktreeTheme = {
  background: {
    mode: "gradient2",
    solid: "#0f172a",
    gradientFrom: "#0f172a",
    gradientTo: "#1e293b",
    gradientAngle: 160,
    gradient3From: "#0f172a",
    gradient3Mid: "#1e293b",
    gradient3To: "#0f172a",
    gradient3Angle: 160,
  },
  buttons: {
    style: "rounded",
    bgColor: "#ffffff",
    textColor: "#0f172a",
    borderRadius: 12,
    shadow: true,
  },
  typography: {
    font: "Inter",
    titleColor: "#ffffff",
    bioColor: "#94a3b8",
  },
};

export const SLUG_RESERVED = ["admin", "dashboard", "api", "auth", "linktree", "e"];

export function normalizeEmpresaTheme(input: unknown): EmpresaLinktreeTheme {
  const t = (input ?? {}) as Partial<EmpresaLinktreeTheme>;
  return {
    ...DEFAULT_EMPRESA_THEME,
    ...t,
    background: { ...DEFAULT_EMPRESA_THEME.background, ...(t.background ?? {}) },
    buttons: { ...DEFAULT_EMPRESA_THEME.buttons, ...(t.buttons ?? {}) },
    typography: { ...DEFAULT_EMPRESA_THEME.typography, ...(t.typography ?? {}) },
  };
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{1,48}[a-z0-9])?$/.test(slug) && !SLUG_RESERVED.includes(slug);
}

export type EmpresaLinkInput = {
  titulo: string;
  url: string;
  icone?: string;
  destaque?: boolean;
  ativo?: boolean;
  agendado_inicio?: string | null;
  agendado_fim?: string | null;
  ordem?: number;
};

export type EmpresaSectionInput = {
  titulo: string;
  ordem?: number;
};

export type AnalyticsPeriodo = "7d" | "30d" | "90d";

export interface ClickAnalytics {
  link_id: string;
  link_titulo: string;
  total_cliques: number;
}
