import { supabase } from "~/core/supabase";
import type { Empresa, EmpresaConfig, ModuloEmpresa } from "./types";

export async function listarEmpresas(): Promise<Empresa[]> {
  const { data } = await supabase.from("empresas").select("*").order("nome");
  return (data ?? []) as Empresa[];
}

export async function buscarEmpresa(id: string): Promise<Empresa | null> {
  const { data } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();
  return data as Empresa | null;
}

export async function criarEmpresa(input: {
  nome: string;
  slug: string;
  cnpj?: string;
  razao_social?: string;
  nome_app?: string;
  email?: string;
  celular?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  site?: string;
  theme?: Record<string, string>;
  logo_index_url?: string;
  logo_app_url?: string;
  favicon_url?: string;
}): Promise<Empresa> {
  const { theme, logo_index_url, logo_app_url, favicon_url, ...empresaData } =
    input;
  const { data, error } = await supabase
    .from("empresas")
    .insert(empresaData)
    .select()
    .single();
  if (error) throw error;
  const empresa = data as Empresa;
  const { error: configError } = await supabase.from("empresas_config").upsert({
    empresa_id: empresa.id,
    logo_url: null,
    logo_index_url: logo_index_url || null,
    logo_app_url: logo_app_url || null,
    favicon_url: favicon_url || null,
    theme: theme || {},
    updated_at: new Date().toISOString(),
  });
  if (configError) console.error("Erro ao criar config:", configError);
  return empresa;
}

export async function atualizarEmpresa(
  id: string,
  input: Partial<{
    nome: string;
    slug: string;
    cnpj: string;
    razao_social: string;
    nome_app: string;
    email: string;
    celular: string;
    telefone: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    site: string;
    ativo: boolean;
  }>,
): Promise<void> {
  const { error } = await supabase
    .from("empresas")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deletarEmpresa(id: string): Promise<void> {
  const { error } = await supabase.from("empresas").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleEmpresa(id: string, ativo: boolean): Promise<void> {
  await atualizarEmpresa(id, { ativo });
}

export async function buscarEmpresaConfig(
  empresaId: string,
): Promise<EmpresaConfig | null> {
  const { data } = await supabase
    .from("empresas_config")
    .select("*")
    .eq("empresa_id", empresaId)
    .single();
  return data as EmpresaConfig | null;
}

export async function salvarEmpresaConfig(
  empresaId: string,
  input: {
    logo_url?: string;
    logo_index_url?: string;
    logo_app_url?: string;
    favicon_url?: string;
    theme?: Record<string, string>;
    db_config?: Record<string, string>;
  },
): Promise<void> {
  const payload = { ...input, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("empresas_config")
    .upsert({ empresa_id: empresaId, ...payload });
  if (error) throw error;
}

export async function listarModulosEmpresa(
  empresaId: string,
): Promise<ModuloEmpresa[]> {
  const { data } = await supabase
    .from("modulos_empresa")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("modulo_key");
  return (data ?? []) as ModuloEmpresa[];
}

export async function toggleModuloEmpresa(
  id: string,
  ativo: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("modulos_empresa")
    .update({ ativo })
    .eq("id", id);
  if (error) throw error;
}

export async function upsertModuloEmpresa(
  empresaId: string,
  moduloKey: string,
  ativo: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("modulos_empresa")
    .upsert(
      { empresa_id: empresaId, modulo_key: moduloKey, ativo },
      { onConflict: "empresa_id,modulo_key" },
    );
  if (error) throw error;
}

export async function uploadEmpresaLogo(
  empresaId: string,
  tipo: "logo_index" | "logo_app" | "favicon",
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const fileName = `logos/${empresaId}/${tipo}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("logos")
    .getPublicUrl(fileName);

  return urlData?.publicUrl || "";
}

export async function deletarEmpresaLogo(
  empresaId: string,
  tipo: "logo_index" | "logo_app" | "favicon",
) {
  const { data: files } = await supabase.storage
    .from("logos")
    .list(`logos/${empresaId}`);
  const match = files?.find((f) => f.name.startsWith(tipo));
  if (match) {
    await supabase.storage
      .from("logos")
      .remove([`logos/${empresaId}/${match.name}`]);
  }
}

export async function ativarModulosParaEmpresa(
  empresaId: string,
  modulos: string[],
): Promise<void> {
  const inserts = modulos.map((modulo_key) => ({
    empresa_id: empresaId,
    modulo_key,
    ativo: true,
  }));
  const { error } = await supabase.from("modulos_empresa").insert(inserts);
  if (error) throw error;
}
