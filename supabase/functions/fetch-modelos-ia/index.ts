import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

interface ModeloRaw {
  id: string;
  displayName: string;
  providerDisplayName: string;
  modality: string[];
  overallWinRate?: number;
  topArenaDisplay?: string;
  contextWindow?: number;
  maxOutputTokens?: number;
  inputCostPerMTokens?: number;
  outputCostPerMTokens?: number;
}

interface ModeloOutput {
  modelo_id: string;
  nome: string;
  provedor: string;
  modalidade: string;
  win_rate: number | null;
  top_arena: string | null;
  input_cost: number | null;
  output_cost: number | null;
  context_window: number | null;
  max_output: number | null;
}

function parseNum(v: unknown): number | null {
  if (typeof v === "number" && !isNaN(v)) return v;
  return null;
}

function extractModels(html: string): ModeloRaw[] {
  const marker = '"rows":';
  const idx = html.indexOf(marker);
  if (idx === -1) return [];

  let start = idx + marker.length;
  while (start < html.length && html[start] === "\\") start++;
  if (html[start] === '"') start++;

  while (start < html.length && html[start] === "\\") start++;

  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = start;
  let arrStart = -1;

  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\" && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === "[") { depth++; if (arrStart === -1) arrStart = i; }
    else if (ch === "]") { depth--; if (depth === 0 && arrStart !== -1) { end = i + 1; break; } }
  }

  if (arrStart === -1) return [];

  let jsonStr = html.substring(arrStart, end);

  jsonStr = jsonStr
    .replace(/\\(["\\/bfnrt])/g, "$1")
    .replace(/\\u[0-9a-fA-F]{4}/g, "");

  try {
    const arr = JSON.parse(jsonStr);
    return Array.isArray(arr) ? arr : [];
  } catch {
    const cleaned = jsonStr
      .replace(/\\\"/g, '"')
      .replace(/\\\\/g, "\\");
    try {
      const arr = JSON.parse(cleaned);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
}

function transformModel(m: ModeloRaw): ModeloOutput | null {
  if (!m.id) return null;
  const mod = Array.isArray(m.modality) ? m.modality : [];
  const isText = mod.includes("text") || mod.includes("multimodal");
  return {
    modelo_id: m.id,
    nome: m.displayName || m.id,
    provedor: m.providerDisplayName || "",
    modalidade: m.modality?.join(", ") || "",
    win_rate: parseNum(m.overallWinRate),
    top_arena: m.topArenaDisplay || null,
    input_cost: isText ? parseNum(m.inputCostPerMTokens) : null,
    output_cost: isText ? parseNum(m.outputCostPerMTokens) : null,
    context_window: isText ? parseNum(m.contextWindow) : null,
    max_output: isText ? parseNum(m.maxOutputTokens) : null,
  };
}

serve(async (req: Request) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_super_admin) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch("https://www.designarena.ai/models", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const html = await res.text();
    const raw = extractModels(html);
    const models = raw.map(transformModel).filter(Boolean) as ModeloOutput[];

    return new Response(JSON.stringify({ total: models.length, models }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
