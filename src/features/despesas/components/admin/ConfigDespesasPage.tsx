import { useState } from "react";
import { Settings, List, Calendar } from "lucide-react";
import { TiposDespesaTable } from "./TiposDespesaTable";
import { PeriodosTable } from "./PeriodosTable";
import { PageHeader } from "~/components/ui/page-header";
import { cn } from "~/lib/utils";

const TABS = [
  { key: "tipos", label: "Tipos", icon: List },
  { key: "periodos", label: "Períodos", icon: Calendar },
];

export function ConfigDespesasPage() {
  const [tab, setTab] = useState("tipos");

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Configurações de Despesas"
        description="Gerencie os tipos de despesa, valores máximos e períodos de envio."
        icon={Settings}
      />

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
              tab === t.key
                ? "text-accent border-accent"
                : "text-text-muted border-transparent hover:text-text-main"
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "tipos" && <TiposDespesaTable />}
      {tab === "periodos" && <PeriodosTable />}
    </div>
  );
}
