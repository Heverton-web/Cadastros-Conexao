import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import {
  BrainCircuit, RefreshCw, Loader2, ChevronDown, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { RequireSuperAdmin } from "~/components/guards";

export const globalModelosIaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/modelos-ia",
  component: () => (
    <RequireSuperAdmin>
      <GlobalModelosIaPage />
    </RequireSuperAdmin>
  ),
});

type Modelo = {
  id: string;
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
  created_at: string;
};

type Versao = {
  id: string;
  created_at: string;
  total_modelos: number;
};

function GlobalModelosIaPage() {
  const { profile } = useAuth();
  if (!profile?.is_super_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Acesso restrito a Super Admin.</p>
      </div>
    );
  }
  return <Page />;
}

function Page() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [versoes, setVersoes] = useState<Versao[]>([]);
  const [versaoAtiva, setVersaoAtiva] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarVersoes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("modelos_ia_versoes")
        .select("id, created_at, total_modelos")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setVersoes(data || []);
      if (data?.length && !versaoAtiva) {
        setVersaoAtiva(data[0].id);
      }
    } catch (e: any) {
      setErro(e.message);
    }
  }, [versaoAtiva]);

  const carregarModelos = useCallback(async (versaoId: string) => {
    if (!versaoId) return;
    setLoading(true);
    setErro("");
    try {
      const { data, error } = await supabase
        .from("modelos_ia")
        .select("*")
        .eq("versao_id", versaoId)
        .order("win_rate", { ascending: false });
      if (error) throw error;
      setModelos(data || []);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarVersoes();
  }, []);

  useEffect(() => {
    if (versaoAtiva) carregarModelos(versaoAtiva);
  }, [versaoAtiva, carregarModelos]);

  async function handleAtualizar() {
    setAtualizando(true);
    setErro("");
    try {
      const { data, error } = await supabase.functions.invoke("fetch-modelos-ia");
      if (error) throw new Error(error.message);
      if (!data?.models?.length) throw new Error("Nenhum modelo retornado");

      const { data: versao, error: errVersao } = await supabase
        .from("modelos_ia_versoes")
        .insert({ total_modelos: data.models.length })
        .select()
        .single();
      if (errVersao) throw errVersao;

      const inserts = data.models.map((m: any) => ({
        versao_id: versao.id,
        modelo_id: m.modelo_id,
        nome: m.nome,
        provedor: m.provedor,
        modalidade: m.modalidade,
        win_rate: m.win_rate,
        top_arena: m.top_arena,
        input_cost: m.input_cost,
        output_cost: m.output_cost,
        context_window: m.context_window,
        max_output: m.max_output,
      }));

      const { error: errInsert } = await supabase
        .from("modelos_ia")
        .insert(inserts);
      if (errInsert) throw errInsert;

      toast.success(`${data.models.length} modelos atualizados!`);
      await carregarVersoes();
      setVersaoAtiva(versao.id);
    } catch (e: any) {
      toast.error("Erro ao atualizar: " + (e.message || "desconhecido"));
      setErro(e.message);
    } finally {
      setAtualizando(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <BrainCircuit size={24} className="text-accent" />
              Modelos de IA
            </h1>
            <p className="text-sm text-text-muted">
              Acompanhamento de modelos de IA do mercado e seus custos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {versoes.length > 0 && (
              <div className="relative">
                <select
                  value={versaoAtiva}
                  onChange={(e) => setVersaoAtiva(e.target.value)}
                  className="appearance-none rounded-xl border border-input-border bg-input-bg px-3 py-2 pr-8 text-xs text-text-main outline-none focus:border-accent cursor-pointer"
                >
                  {versoes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {new Date(v.created_at).toLocaleString("pt-BR")} ({v.total_modelos} modelos)
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            )}

            <button
              onClick={handleAtualizar}
              disabled={atualizando}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              {atualizando ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {atualizando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </div>

        {erro && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-sm text-red-400">{erro}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-accent" />
          </div>
        ) : modelos.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <BrainCircuit size={48} className="mx-auto mb-3 text-text-muted" />
            <h2 className="text-lg font-semibold text-text-main mb-1">Nenhum modelo</h2>
            <p className="text-sm text-text-muted">
              Clique em "Atualizar" para buscar os modelos mais recentes do mercado.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Modelo</th>
                    <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Provedor</th>
                    <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Modalidade</th>
                    <th className="text-right p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Win Rate</th>
                    <th className="text-left p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Top Arena</th>
                    <th className="text-right p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Input $</th>
                    <th className="text-right p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Output $</th>
                    <th className="text-right p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Contexto</th>
                    <th className="text-right p-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Max Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {modelos.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-hover transition-colors">
                      <td className="p-3 text-text-main font-medium">{m.nome}</td>
                      <td className="p-3 text-text-muted">{m.provedor}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent">
                          {m.modalidade}
                        </span>
                      </td>
                      <td className="p-3 text-right text-text-main font-mono">
                        {m.win_rate != null ? `${m.win_rate}%` : "-"}
                      </td>
                      <td className="p-3 text-text-muted text-xs">{m.top_arena || "-"}</td>
                      <td className="p-3 text-right text-text-main font-mono">
                        {m.input_cost != null ? `$${Number(m.input_cost).toFixed(2)}` : "-"}
                      </td>
                      <td className="p-3 text-right text-text-main font-mono">
                        {m.output_cost != null ? `$${Number(m.output_cost).toFixed(2)}` : "-"}
                      </td>
                      <td className="p-3 text-right text-text-muted font-mono text-xs">
                        {m.context_window != null ? formatTokens(m.context_window) : "-"}
                      </td>
                      <td className="p-3 text-right text-text-muted font-mono text-xs">
                        {m.max_output != null ? formatTokens(m.max_output) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-border text-xs text-text-muted">
              {modelos.length} modelo(s) · {versoes.find(v => v.id === versaoAtiva)?.created_at
                ? new Date(versoes.find(v => v.id === versaoAtiva)!.created_at).toLocaleString("pt-BR")
                : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTokens(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return String(val);
}
