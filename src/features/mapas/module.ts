import { Map, Building2, UserCircle, BarChart3 } from "lucide-react";
import { registerModule, registerNavItem, registerPermission } from "~/registry";
import type { ModuleDefinition } from "~/registry";
import { MAPAS_PERMISSIONS } from "./permissions";

export const mapasModule: ModuleDefinition = {
  key: "mapas-interativos",
  nome: "Mapas",
  descricao: "Mapas interativos de presença comercial",
  icon: Map,
  routes: [
    "/mapas",
    "/mapas/distribuidores",
    "/mapas/consultores",
    "/mapas/admin",
    "/mapas/admin/insights",
    "/mapas/admin/distribuidores",
    "/mapas/admin/consultores",
  ],
  permissions: MAPAS_PERMISSIONS.map(p => p.key),
  ambientes: ["cadastro", "consultor"],
  abas: [
    { key: "geral", label: "Geral" },
    { key: "permissoes", label: "Permissões" },
  ],
  events: [],
  setup: () => {
    for (const p of MAPAS_PERMISSIONS) {
      registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
    }

    registerNavItem({
      id: "mapas-publico",
      label: "Mapa de Presença",
      icon: Map,
      to: "/mapas",
      permissionCheck: (perms) => perms?.mapas_ver_mapa_publico === true,
      order: 10,
      moduloKey: "mapas-interativos",
    });

    registerNavItem({
      id: "mapas-admin-distribuidores",
      label: "Distribuidores",
      icon: Building2,
      to: "/mapas/admin/distribuidores",
      permissionCheck: (perms) => perms?.mapas_gerir_distribuidores === true,
      order: 20,
      moduloKey: "mapas-interativos",
    });

    registerNavItem({
      id: "mapas-admin-consultores",
      label: "Consultores",
      icon: UserCircle,
      to: "/mapas/admin/consultores",
      permissionCheck: (perms) => perms?.mapas_gerir_consultores === true,
      order: 30,
      moduloKey: "mapas-interativos",
    });

    registerNavItem({
      id: "mapas-admin-insights",
      label: "Insights",
      icon: BarChart3,
      to: "/mapas/admin/insights",
      permissionCheck: (perms) => perms?.mapas_ver_insights === true,
      order: 40,
      moduloKey: "mapas-interativos",
    });
  },
};
