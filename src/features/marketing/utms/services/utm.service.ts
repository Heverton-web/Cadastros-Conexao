import { supabase } from "~/core/supabase";

export type Utm = {
  id: string;
  empresa_id: string;
  nome: string;
  url_destino: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string | null;
  utm_content: string | null;
  cliques: number;
  created_at: string;
};

export async function listarUtms(empresaId: string): Promise<Utm[]> {
  const { data } = await supabase
    .from("mktg_utms")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  return (data as Utm[]) || [];
}

export async function deletarUtm(id: string): Promise<void> {
  await supabase.from("mktg_utms").delete().eq("id", id);
}
