import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { useMapasDistributors, useMapasConsultants } from "~/features/mapas/hooks/useMapasData";
import { Building2, Users2, MapPin } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const mapasAdminInsightsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/mapas/admin/insights",
  component: MapasInsightsPage,
});

function MapasInsightsPage() {
  const { profile, permissoes } = useAuth();
  const navigate = useNavigate();
  const p = permissoes;

  const canDist = p?.mapas_gerir_distribuidores === true;
  const canCons = p?.mapas_gerir_consultores === true;
  const canInsights = p?.mapas_ver_insights === true;
  const isSuper = profile?.is_super_admin === true;

  const enabled = canDist || canInsights || isSuper;
  const distQ = useMapasDistributors();
  const consQ = useMapasConsultants();

  const distTotal = distQ.data?.length ?? 0;
  const consTotal = consQ.data?.length ?? 0;
  const distStates = new Set((distQ.data ?? []).map((d) => d.state)).size;
  const consStates = new Set((consQ.data ?? []).map((c) => c.state)).size;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {profile?.nome || "—"}</h1>
        <p className="text-sm text-muted-foreground">Visão geral dos dados de presença comercial.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(canDist || isSuper) && (
          <>
            <StatCard icon={Building2} label="Distribuidores" value={distTotal} />
            <StatCard icon={MapPin} label="Estados com distribuidor" value={distStates} />
          </>
        )}
        {(canCons || isSuper) && (
          <>
            <StatCard icon={Users2} label="Consultores" value={consTotal} />
            <StatCard icon={MapPin} label="Estados com consultor" value={consStates} />
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(canDist || isSuper) && (
          <QuickLink
            to="/mapas/admin/distribuidores"
            title="Gerenciar distribuidores"
            desc="Adicionar, editar ou remover distribuidores."
            navigate={navigate}
          />
        )}
        {(canCons || isSuper) && (
          <QuickLink
            to="/mapas/admin/consultores"
            title="Gerenciar consultores"
            desc="Adicionar, editar ou remover consultores."
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-surface bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-2 text-3xl font-bold text-accent">{value}</p>
    </div>
  );
}

function QuickLink({ to, title, desc, navigate }: { to: string; title: string; desc: string; navigate: any }) {
  return (
    <button onClick={() => navigate({ to })} className="block w-full text-left rounded-xl border border-surface bg-card p-4 transition-colors hover:bg-surface-hover">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}
