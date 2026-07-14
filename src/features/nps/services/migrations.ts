import { supabase } from "~/core/supabase";

export async function migrarPerguntasEmpresa(empId: string) {
  if (!empId) return;
  try {
    const { data: nulas } = await supabase
      .from("nps_perguntas")
      .select("id")
      .is("empresa_id", null);
    if (nulas && nulas.length > 0) {
      await supabase
        .from("nps_perguntas")
        .update({ empresa_id: empId })
        .is("empresa_id", null);
    }
  } catch {}
}
