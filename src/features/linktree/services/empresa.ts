import { supabase } from "~/core/supabase";
import { EMPRESA_ID } from "~/config/empresa"
import { dispararEventoModulo } from "~/core/services/webhooks";
import type {
  EmpresaLinktreeConfig,
  EmpresaLinktreeSection,
  EmpresaLinktreeLink,
  EmpresaLinkInput,
  EmpresaSectionInput,
  AnalyticsPeriodo,
  ClickAnalytics,
} from "../types-empresa";

const MODULO_KEY = "linktree";

export async function listarEmpresaConfig(
  EMPRESA_ID: string,
): Promise<EmpresaLinktreeConfig | null> {
  const { data, error } = await supabase
    .from("linktree_empresa_config")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function buscarConfigPorSlug(
  slug: string,
): Promise<EmpresaLinktreeConfig | null> {
  const { data, error } = await supabase
    .from("linktree_empresa_config")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarEmpresaConfig(
  EMPRESA_ID: string,
  config: Partial<
    Pick<EmpresaLinktreeConfig, "slug" | "bio" | "banner_url" | "avatar_url" | "theme">
  >,
): Promise<EmpresaLinktreeConfig> {
  const { data, error } = await supabase
    .from("linktree_empresa_config")
    .upsert({ empresa_id: EMPRESA_ID, ...config }, { onConflict: "empresa_id" })
    .select()
    .single();
  if (error) throw error;

  return data;
}

export async function verificarSlugDisponivel(
  slug: string,
  EMPRESA_ID?: string,
): Promise<boolean> {
  let query = supabase
    .from("linktree_empresa_config")
    .select("empresa_id")
    .eq("slug", slug);
  if (EMPRESA_ID) query = query.neq("empresa_id", EMPRESA_ID);
  const { data } = await query.maybeSingle();
  return !data;
}

export async function listarSecoes(
  EMPRESA_ID: string,
): Promise<EmpresaLinktreeSection[]> {
  const { data, error } = await supabase
    .from("linktree_empresa_sections")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .order("ordem");
  if (error) throw error;
  return data ?? [];
}

export async function criarSecao(
  EMPRESA_ID: string,
  input: EmpresaSectionInput,
): Promise<EmpresaLinktreeSection> {
  const { data, error } = await supabase
    .from("linktree_empresa_sections")
    .insert({
      empresa_id: EMPRESA_ID,
      titulo: input.titulo,
      imagem_url: input.imagem_url ?? null,
      ordem: input.ordem ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarSecao(
  id: string,
  input: Partial<EmpresaSectionInput>,
): Promise<EmpresaLinktreeSection> {
  const { data, error } = await supabase
    .from("linktree_empresa_sections")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarSecao(id: string): Promise<void> {
  const { error } = await supabase
    .from("linktree_empresa_sections")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function listarLinks(
  EMPRESA_ID: string,
): Promise<EmpresaLinktreeLink[]> {
  const { data, error } = await supabase
    .from("linktree_empresa_links")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .order("ordem");
  if (error) throw error;
  return data ?? [];
}

export async function listarLinksPublicos(
  EMPRESA_ID: string,
): Promise<EmpresaLinktreeLink[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("linktree_empresa_links")
    .select("*")
    .eq("empresa_id", EMPRESA_ID)
    .eq("ativo", true)
    .order("ordem");
  if (error) throw error;
  return (data ?? []).filter((l) => {
    if (l.agendado_inicio && now < l.agendado_inicio) return false;
    if (l.agendado_fim && now > l.agendado_fim) return false;
    return true;
  });
}

export async function criarLink(
  EMPRESA_ID: string,
  sectionId: string,
  input: EmpresaLinkInput,
): Promise<EmpresaLinktreeLink> {
  const { data, error } = await supabase
    .from("linktree_empresa_links")
    .insert({ empresa_id: EMPRESA_ID, section_id: sectionId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarLink(
  id: string,
  input: Partial<EmpresaLinkInput>,
): Promise<EmpresaLinktreeLink> {
  const { data, error } = await supabase
    .from("linktree_empresa_links")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletarLink(id: string): Promise<void> {
  const { error } = await supabase
    .from("linktree_empresa_links")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function reordenarLinks(
  ordens: { id: string; ordem: number }[],
): Promise<void> {
  for (const { id, ordem } of ordens) {
    await supabase
      .from("linktree_empresa_links")
      .update({ ordem })
      .eq("id", id);
  }
}

export async function reordenarSecoes(
  ordens: { id: string; ordem: number }[],
): Promise<void> {
  for (const { id, ordem } of ordens) {
    await supabase
      .from("linktree_empresa_sections")
      .update({ ordem })
      .eq("id", id);
  }
}

export async function registrarClique(
  linkId: string,
  EMPRESA_ID: string,
  ipHash?: string,
  userAgent?: string,
): Promise<void> {
  await supabase.from("linktree_empresa_clicks").insert({
    link_id: linkId,
    empresa_id: EMPRESA_ID,
    ip_hash: ipHash,
    user_agent: userAgent,
  });
}

export async function listarAnalytics(
  EMPRESA_ID: string,
  periodo: AnalyticsPeriodo,
): Promise<ClickAnalytics[]> {
  const dias = periodo === "7d" ? 7 : periodo === "30d" ? 30 : 90;
  const desde = new Date(Date.now() - dias * 86400000).toISOString();

  const { data, error } = await supabase
    .from("linktree_empresa_clicks")
    .select("link_id")
    .eq("empresa_id", EMPRESA_ID)
    .gte("clicked_at", desde);
  if (error) throw error;

  const linksIds = [...new Set((data ?? []).map((r) => r.link_id))];
  if (linksIds.length === 0) return [];

  const { data: links } = await supabase
    .from("linktree_empresa_links")
    .select("id, titulo")
    .in("id", linksIds);

  const tituloMap = new Map((links ?? []).map((l) => [l.id, l.titulo]));
  const contagem = new Map<string, number>();
  for (const row of data ?? []) {
    contagem.set(row.link_id, (contagem.get(row.link_id) ?? 0) + 1);
  }

  return Array.from(contagem.entries()).map(([link_id, total]) => ({
    link_id,
    link_titulo: tituloMap.get(link_id) ?? "Desconhecido",
    total_cliques: total,
  }));
}

export function buildEmpresaLinktreeUrl(slug: string): string {
  if (typeof window === "undefined") return `/e/${slug}`;
  return `${window.location.origin}/e/${slug}`;
}
