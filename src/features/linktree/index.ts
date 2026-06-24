import QRCode from "qrcode";
import { supabase } from "~/core/supabase";
import type { LinktreeColaborador, LinktreeColaboradorInput, LinktreeThemeConfig } from "./types";
import { normalizeLinktreeTheme } from "./types";

export async function listarColaboradores(empresaId?: string) {
  let query = supabase
    .from("linktree_colaboradores")
    .select("*")
    .order("created_at", { ascending: false });
  if (empresaId) query = query.eq("empresa_id", empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data as LinktreeColaborador[];
}

export async function criarColaborador(input: LinktreeColaboradorInput) {
  const { data, error } = await supabase
    .from("linktree_colaboradores")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as LinktreeColaborador;
}

export async function atualizarColaborador(id: string, input: Partial<LinktreeColaboradorInput>) {
  const { data, error } = await supabase
    .from("linktree_colaboradores")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as LinktreeColaborador;
}

export async function toggleColaboradorStatus(id: string, status: "ativo" | "inativo") {
  const { data, error } = await supabase
    .from("linktree_colaboradores")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as LinktreeColaborador;
}

export async function deletarColaborador(id: string) {
  const { error } = await supabase
    .from("linktree_colaboradores")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function buscarColaboradorPorId(id: string) {
  const { data, error } = await supabase
    .from("linktree_colaboradores")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as LinktreeColaborador | null;
}

export async function buscarTemaConfig(empresaId?: string) {
  const id = empresaId || "global";
  const { data, error } = await supabase
    .from("linktree_tema_config")
    .select("config")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return normalizeLinktreeTheme(data?.config);
}

export async function salvarTemaConfig(empresaId: string | null, config: LinktreeThemeConfig) {
  const id = empresaId || "global";
  const { error } = await supabase
    .from("linktree_tema_config")
    .upsert({ id, empresa_id: empresaId, config: config as any }, { onConflict: "id" });
  if (error) throw error;
}

export function buildCardUrl(id: string): string {
  if (typeof window === "undefined") return `/linktree/${id}`;
  return `${window.location.origin}/linktree/${id}`;
}

export async function gerarQrCodeDataUrl(id: string): Promise<string> {
  return QRCode.toDataURL(buildCardUrl(id), {
    width: 1024,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
}

export async function downloadQrPng(id: string, name: string) {
  const dataUrl = await gerarQrCodeDataUrl(id);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `qrcode-${slug(name)}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
