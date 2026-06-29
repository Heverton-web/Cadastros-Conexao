import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/integrations/supabase/client";
import { Button } from "~/components/ui/button";
import { ClientePickerModal } from "~/components/ClientePickerModal";
import { NovaVisitaModal } from "~/components/NovaVisitaModal";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  Users,
  ArrowLeftRight,
  BarChart3,
  ShieldCheck,
  Settings,
  UserPlus,
  ArrowRight,
  Building2,
  UserCog,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
});


function Dashboard() {
  const { perfil } = useAuth();
  const role = perfil?.role;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);

  const subtitle =
    role === "dev"
      ? "Ambiente do desenvolvedor: convites, usuários e demo cards."
      : role === "diretor_comercial"
      ? "Visão nacional: gestores, consultores e BI agregado."
      : role === "gestor"
      ? "Acompanhe a performance da sua equipe e a carteira agregada."
      : "Sua carteira de clientes e visitas em campo.";

  const tag =
    role === "dev"
      ? "Painel Desenvolvedor"
      : role === "diretor_comercial"
      ? "Painel Diretor Comercial"
      : role === "gestor"
      ? "Painel Gestor"
      : "Painel Consultor";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{tag}</p>
          <h1 className="text-2xl font-bold mt-1">
            Olá, {perfil?.nome_completo?.split(" ")[0] ?? "—"}
          </h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {role === "consultor" && (
          <Button
            onClick={() => setPickerOpen(true)}
            className="h-11 px-5 gap-2 shadow-[0_8px_24px_-8px_oklch(0.745_0.115_80/0.5)]"
          >
            <Plus className="h-4 w-4" />
            Nova visita
          </Button>
        )}
      </header>

      {role === "consultor" && <ConsultorPanel uid={perfil!.id} />}
      {role === "gestor" && <GestorPanel />}
      {role === "diretor_comercial" && <DiretorPanel />}
      {role === "dev" && <DevPanel />}

      {role === "consultor" && perfil && (
        <>
          <ClientePickerModal
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            consultorId={perfil.id}
            onSelect={(id) => {
              setPickerOpen(false);
              setClienteSelecionado(id);
            }}
          />
          {clienteSelecionado && (
            <NovaVisitaModal
              clienteId={clienteSelecionado}
              open={!!clienteSelecionado}
              onOpenChange={(v) => !v && setClienteSelecionado(null)}
            />
          )}
        </>
      )}
    </div>
  );
}


function ConsultorPanel({ uid }: { uid: string }) {
  const { data: stats } = useQuery({
    queryKey: ["dash-consultor", uid],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [vis, cli, prox] = await Promise.all([
        supabase.from("visitas").select("id", { count: "exact", head: true })
          .eq("data_visita", today).eq("consultor_executor_id", uid),
        supabase.from("clientes").select("id", { count: "exact", head: true })
          .eq("consultor_atual_id", uid),
        supabase.from("visitas")
          .select("id, data_proximo_contato, acao_prevista, cliente_id, clientes(nome_doutor)")
          .gte("data_proximo_contato", today)
          .eq("consultor_executor_id", uid)
          .order("data_proximo_contato", { ascending: true })
          .limit(5),
      ]);
      return {
        visitasHoje: vis.count ?? 0,
        totalClientes: cli.count ?? 0,
        followups: prox.data ?? [],
      };
    },
  });

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard icon={Calendar} label="Visitas hoje" value={stats?.visitasHoje ?? "—"} />
        <KpiCard icon={Briefcase} label="Meus clientes" value={stats?.totalClientes ?? "—"} />
        <KpiCard icon={TrendingUp} label="Meta diária" value="3" hint="visitas" />
      </section>

      <QuickAction to="/carteira" icon={Briefcase}
        title="Abrir minha Carteira"
        subtitle="Kanban por temperatura, registrar nova visita" />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Próximos follow-ups
        </h2>
        <div className="glass rounded-2xl divide-y divide-border">
          {!stats?.followups?.length && (
            <p className="p-5 text-sm text-muted-foreground">Nenhum follow-up agendado.</p>
          )}
          {stats?.followups?.map((f: any) => (
            <Link key={f.id} to="/cliente/$id" params={{ id: f.cliente_id }}
              className="flex items-center justify-between p-4 hover:bg-secondary/30 transition">
              <div>
                <p className="font-medium text-sm">{f.clientes?.nome_doutor}</p>
                <p className="text-xs text-muted-foreground">{f.acao_prevista}</p>
              </div>
              <span className="text-xs text-gold font-medium">
                {new Date(f.data_proximo_contato).toLocaleDateString("pt-BR")}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function GestorPanel() {
  const { data } = useQuery({
    queryKey: ["dash-gestor"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [vis, cli, consultores] = await Promise.all([
        supabase.from("visitas").select("id", { count: "exact", head: true }).eq("data_visita", today),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("role", "consultor"),
      ]);
      return {
        visitasHoje: vis.count ?? 0,
        totalClientes: cli.count ?? 0,
        consultores: consultores.count ?? 0,
      };
    },
  });

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard icon={Users} label="Consultores" value={data?.consultores ?? "—"} />
        <KpiCard icon={Briefcase} label="Carteira total" value={data?.totalClientes ?? "—"} />
        <KpiCard icon={Calendar} label="Visitas hoje" value={data?.visitasHoje ?? "—"} />
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <QuickAction to="/equipe" icon={Users} title="Equipe" subtitle="Performance por consultor" />
        <QuickAction to="/transferencia" icon={ArrowLeftRight} title="Transferir clientes" subtitle="Reatribuir carteira" />
        <QuickAction to="/bi" icon={BarChart3} title="BI da equipe" subtitle="Pipeline e conversão" />
      </div>
    </>
  );
}

function DiretorPanel() {
  const { data } = useQuery({
    queryKey: ["dash-diretor"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [gestores, consultores, vis, cli] = await Promise.all([
        supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("role", "gestor"),
        supabase.from("usuarios").select("id", { count: "exact", head: true }).eq("role", "consultor"),
        supabase.from("visitas").select("id", { count: "exact", head: true }).eq("data_visita", today),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
      ]);
      return {
        gestores: gestores.count ?? 0,
        consultores: consultores.count ?? 0,
        visitasHoje: vis.count ?? 0,
        carteira: cli.count ?? 0,
      };
    },
  });

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Building2} label="Gestores" value={data?.gestores ?? "—"} />
        <KpiCard icon={Users} label="Consultores" value={data?.consultores ?? "—"} />
        <KpiCard icon={Calendar} label="Visitas hoje" value={data?.visitasHoje ?? "—"} />
        <KpiCard icon={Briefcase} label="Carteira" value={data?.carteira ?? "—"} />
      </section>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <QuickAction to="/diretoria" icon={Building2} title="Diretoria" subtitle="Gestores e equipes" />
        <QuickAction to="/transferencia/consultores" icon={UserCog} title="Transferir consultor" subtitle="Mover entre gestores" />
        <QuickAction to="/transferencia" icon={ArrowLeftRight} title="Transferir cliente" subtitle="Realocar carteiras" />
        <QuickAction to="/bi" icon={BarChart3} title="BI nacional" subtitle="Filtros e funil" />
      </div>
    </>
  );
}

function DevPanel() {
  const { data } = useQuery({
    queryKey: ["dash-dev"],
    queryFn: async () => {
      const [users, convites] = await Promise.all([
        supabase.from("usuarios").select("id", { count: "exact", head: true }),
        supabase.from("convites_acesso").select("id", { count: "exact", head: true }).eq("status", "pendente"),
      ]);
      return { users: users.count ?? 0, convitesPendentes: convites.count ?? 0 };
    },
  });

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard icon={ShieldCheck} label="Usuários" value={data?.users ?? "—"} />
        <KpiCard icon={UserPlus} label="Convites pendentes" value={data?.convitesPendentes ?? "—"} />
        <KpiCard icon={Settings} label="Demo cards" value="4" hint="papéis" />
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <QuickAction to="/dev/usuarios" icon={ShieldCheck} title="Usuários" subtitle="Ativar, inativar, vincular" />
        <QuickAction to="/dev/convites" icon={UserPlus} title="Convites" subtitle="CRUD com magic link" />
        <QuickAction to="/dev/demo" icon={Settings} title="Cartões demo" subtitle="Habilitar/ocultar acesso rápido" />
      </div>
    </>
  );
}

function KpiCard({ icon: Icon, label, value, hint }: {
  icon: typeof Users; label: string; value: string | number; hint?: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className="h-4 w-4 text-gold" />
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">
        {label} {hint && <span className="text-gold">· {hint}</span>}
      </p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, subtitle }: {
  to: string; icon: typeof Users; title: string; subtitle: string;
}) {
  return (
    <Link to={to}
      className="group glass rounded-2xl p-4 flex items-center justify-between hover:border-primary/40 transition">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-gold">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-gold transition" />
    </Link>
  );
}
