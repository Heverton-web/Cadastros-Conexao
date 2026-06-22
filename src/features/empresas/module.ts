import { Building2 } from "lucide-react";
import { registerModule } from "~/registry";
import type { ModuleDefinition } from "~/registry";

export const empresasModule: ModuleDefinition = {
  key: "empresas-core",
  nome: "Empresas",
  descricao: "Gerenciamento de empresas",
  icon: Building2,
  routes: ["/admin/super/empresas", "/admin/empresa"],
  permissions: [],
  ambientes: [],
  abas: [],
  events: [],
  setup: () => {},
};
