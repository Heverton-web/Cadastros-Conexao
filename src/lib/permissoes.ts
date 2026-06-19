import { supabase } from "./supabase";

export type Permissoes = {
  ver_todos_cadastros: boolean;
  aprovar_cadastro: boolean;
  reprovar_cadastro: boolean;
  solicitar_correcao_cadastro: boolean;
  aprovar_documento: boolean;
  reprovar_documento: boolean;
  solicitar_correcao_documento: boolean;
  aprovar_campo: boolean;
  reprovar_campo: boolean;
  solicitar_correcao_campo: boolean;
  visualizar_documento: boolean;
  excluir_cadastro: boolean;
  gerenciar_credenciais: boolean;
  gerenciar_credenciais_admin: boolean;
  gerenciar_config: boolean;
  gerar_links: boolean;
  ver_relatorios: boolean;
};

export type Ambiente = "cadastro" | "consultor" | "tecnologia" | "suporte";

export function getPermissoesPadrao(ambiente: Ambiente): Permissoes {
  switch (ambiente) {
    case "consultor":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: true, ver_relatorios: true };
    case "cadastro":
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: false, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: true };
    case "tecnologia":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: false, ver_relatorios: false };
    case "suporte":
      return { ver_todos_cadastros: false, aprovar_cadastro: false, reprovar_cadastro: false, solicitar_correcao_cadastro: false, aprovar_documento: false, reprovar_documento: false, solicitar_correcao_documento: false, aprovar_campo: false, reprovar_campo: false, solicitar_correcao_campo: false, visualizar_documento: false, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: false, gerenciar_config: false, gerar_links: false, ver_relatorios: false };
    default:
      return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: false, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: false, gerar_links: true, ver_relatorios: true };
  }
}

export const PERMISSOES_GROUPS: { label: string; keys: (keyof Permissoes)[] }[] = [
  {
    label: "Visualização",
    keys: ["ver_todos_cadastros", "ver_relatorios", "visualizar_documento"],
  },
  {
    label: "Aprovação de Cadastro",
    keys: ["aprovar_cadastro", "reprovar_cadastro", "solicitar_correcao_cadastro"],
  },
  {
    label: "Aprovação de Documentos",
    keys: ["aprovar_documento", "reprovar_documento", "solicitar_correcao_documento"],
  },
  {
    label: "Aprovação de Campos",
    keys: ["aprovar_campo", "reprovar_campo", "solicitar_correcao_campo"],
  },
  {
    label: "Credenciais",
    keys: ["gerenciar_credenciais", "gerenciar_credenciais_admin"],
  },
  {
    label: "Administração",
    keys: ["excluir_cadastro", "gerenciar_config"],
  },
  {
    label: "Geração de Links",
    keys: ["gerar_links"],
  },
];

export const PERMISSOES_LABEL: Record<keyof Permissoes, string> = {
  ver_todos_cadastros: "Ver todos os cadastros",
  aprovar_cadastro: "Aprovar cadastro",
  reprovar_cadastro: "Reprovar cadastro",
  solicitar_correcao_cadastro: "Solicitar correção de cadastro",
  aprovar_documento: "Aprovar documento",
  reprovar_documento: "Reprovar documento",
  solicitar_correcao_documento: "Solicitar correção de documento",
  aprovar_campo: "Aprovar campo",
  reprovar_campo: "Reprovar campo",
  solicitar_correcao_campo: "Solicitar correção de campo",
  visualizar_documento: "Visualizar arquivos dos documentos",
  excluir_cadastro: "Excluir cadastro",
  gerenciar_credenciais: "Gerenciar credenciais (ver + ativar/inativar)",
  gerenciar_credenciais_admin: "Gerenciar credenciais (criar/editar/deletar)",
  gerenciar_config: "Gerenciar configurações do sistema",
  gerar_links: "Gerar links de cadastro",
  ver_relatorios: "Ver relatórios",
};

export const PERMISSOES_DESC: Record<keyof Permissoes, string> = {
  ver_todos_cadastros: "Permite visualizar todos os cadastros do sistema",
  aprovar_cadastro: "Permite aprovar um cadastro (definir código do cliente)",
  reprovar_cadastro: "Permite reprovar um cadastro",
  solicitar_correcao_cadastro: "Permite solicitar correção de um cadastro",
  aprovar_documento: "Permite aprovar documentos anexados",
  reprovar_documento: "Permite reprovar documentos",
  solicitar_correcao_documento: "Permite solicitar correção de documentos",
  aprovar_campo: "Permite aprovar campos individuais do formulário",
  reprovar_campo: "Permite reprovar campos individuais",
  solicitar_correcao_campo: "Permite solicitar correção de campos",
  visualizar_documento: "Permite abrir e visualizar arquivos dos documentos",
  excluir_cadastro: "Permite excluir cadastros permanentemente",
  gerenciar_credenciais: "Acessar página de credenciais e ativar/inativar usuários",
  gerenciar_credenciais_admin: "Criar, editar e deletar credenciais de acesso",
  gerenciar_config: "Acessar configurações do sistema (variáveis, webhooks)",
  gerar_links: "Permite gerar links de cadastro para leads",
  ver_relatorios: "Permite acessar a página de relatórios",
};

export async function getPermissoes(usuarioId: string, isSuperAdmin?: boolean): Promise<Permissoes | null> {
  if (isSuperAdmin) {
    return { ver_todos_cadastros: true, aprovar_cadastro: true, reprovar_cadastro: true, solicitar_correcao_cadastro: true, aprovar_documento: true, reprovar_documento: true, solicitar_correcao_documento: true, aprovar_campo: true, reprovar_campo: true, solicitar_correcao_campo: true, visualizar_documento: true, excluir_cadastro: true, gerenciar_credenciais: true, gerenciar_credenciais_admin: true, gerenciar_config: true, gerar_links: true, ver_relatorios: true };
  }
  const { data } = await supabase
    .from("permissoes")
    .select("permissoes")
    .eq("usuario_id", usuarioId)
    .single();
  return data?.permissoes as Permissoes | null;
}

export async function setPermissoes(usuarioId: string, permissoes: Permissoes): Promise<void> {
  const { error } = await supabase
    .from("permissoes")
    .upsert({
      usuario_id: usuarioId,
      permissoes: permissoes as any,
      updated_by: (await supabase.auth.getUser()).data.user?.id || null,
    }, { onConflict: "usuario_id" });
  if (error) throw error;
}

export async function listarPermissoesUsuarios(): Promise<{ usuario_id: string; permissoes: Permissoes; profiles: { id: string; email: string; nome: string; ambiente: string; is_super_admin: boolean } }[]> {
  const { data, error } = await supabase
    .from("permissoes")
    .select("usuario_id, permissoes, profiles!inner(id, email, nome, ambiente, is_super_admin)")
    .order("profiles(nome)");
  if (error) throw error;
  return data as any;
}
