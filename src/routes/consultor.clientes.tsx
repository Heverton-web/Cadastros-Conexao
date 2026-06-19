import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState, useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { supabase } from "~/lib/supabase";
import { Loader2, ArrowLeft, Search, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

export const consultorClientesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/consultor/clientes",
  component: ConsultorClientes,
});

function ConsultorClientes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { if (user?.id) carregar(); }, [user]);

  async function carregar() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await supabase.from("clientes").select("*").eq("created_by", user.id).eq("status", "aprovado").order("created_at", { ascending: false });
      setClientes(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const filtered = clientes.filter((c) => {
    if (!search) return true; const q = search.toLowerCase();
    return (c.nome || "").toLowerCase().includes(q) || (c.codigo_cliente || "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/consultor" })} className="text-text-muted hover:text-text-main"><ArrowLeft size={20} /></button>
          <h1 className="text-lg font-bold text-text-main">Meus Clientes</h1>
          <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">{clientes.length}</span>
        </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar clientes..." className="w-full rounded-lg border border-input-border bg-input-bg py-3 pl-10 pr-4 text-sm text-text-main outline-none focus:border-accent focus:ring-2 focus:ring-ring min-h-[44px]" />
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      : filtered.length === 0 ? <p className="py-12 text-center text-sm text-text-muted">Nenhum cliente encontrado</p>
      : <div className="flex flex-col gap-2">{filtered.map((c) => (
        <button key={c.id} onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}
          className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg transition active:scale-[0.98] w-full text-left hover:ring-1 hover:ring-accent/30"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <CheckCircle size={16} className="text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-main truncate">{c.nome}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {c.codigo_cliente && <span className="text-[10px] text-text-muted">#{c.codigo_cliente}</span>}
              {c.tipo_pessoa && <span className="text-[10px] text-text-muted">{c.tipo_pessoa}</span>}
            </div>
          </div>
          <ArrowRight size={16} className="text-text-muted shrink-0" />
        </button>
      ))}</div>}
    </div>
  );
}
