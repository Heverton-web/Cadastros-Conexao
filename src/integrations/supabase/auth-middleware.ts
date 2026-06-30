import { supabase } from "~/core/supabase";

export async function requireSupabaseAuth(ctx: {
  data: unknown;
  context: Record<string, unknown>;
}) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return {
    ...ctx,
    context: {
      ...ctx.context,
      supabase,
      userId: user.id,
    },
  };
}
