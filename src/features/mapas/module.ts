import { Map, Building2, UserCircle, BarChart3, Globe, Palette } from "lucide-react";
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
    "/mapas/gestao",
    "/mapas/insights",
    "/mapas/gestao/distribuidores",
    "/mapas/gestao/consultores",
  ],
  permissions: MAPAS_PERMISSIONS.map(p => p.key),
  ambientes: ["cadastro", "consultor"],
  abas: [
    { key: "geral", label: "Geral" },
    { key: "permissoes", label: "Permissões" },
  ],
  events: [
    { key: "mapas.distribuidor.criado", label: "Distribuidor Criado", descricao: "Dispara quando um novo distribuidor é adicionado" },
    { key: "mapas.distribuidor.atualizado", label: "Distribuidor Atualizado", descricao: "Dispara quando um distribuidor é editado" },
    { key: "mapas.distribuidor.excluido", label: "Distribuidor Excluído", descricao: "Dispara quando um distribuidor é removido" },
    { key: "mapas.consultor.criado", label: "Consultor Criado", descricao: "Dispara quando um novo consultor é adicionado" },
    { key: "mapas.consultor.atualizado", label: "Consultor Atualizado", descricao: "Dispara quando um consultor é editado" },
    { key: "mapas.consultor.excluido", label: "Consultor Excluído", descricao: "Dispara quando um consultor é removido" },
    { key: "mapas.estado.clicado", label: "Estado Clicado", descricao: "Dispara quando um estado é clicado no mapa" },
    { key: "mapas.pin.clicado", label: "Pin Clicado", descricao: "Dispara quando um pin é clicado no mapa" },
  ],
  hasDesignConfig: true,
  designRoute: "/empresa/mapas/design",
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
      noChildMatch: true,
      matchPaths: ["/mapas/distribuidores", "/mapas/consultores"],
    });

    registerNavItem({
      id: "mapas-admin-distribuidores",
      label: "Distribuidores",
      icon: Building2,
      to: "/mapas/gestao/distribuidores",
      permissionCheck: (perms) => perms?.mapas_gerir_distribuidores === true,
      order: 20,
      moduloKey: "mapas-interativos",
    });

    registerNavItem({
      id: "mapas-admin-consultores",
      label: "Consultores",
      icon: UserCircle,
      to: "/mapas/gestao/consultores",
      permissionCheck: (perms) => perms?.mapas_gerir_consultores === true,
      order: 30,
      moduloKey: "mapas-interativos",
    });

    registerNavItem({
      id: "mapas-admin-insights",
      label: "Insights",
      icon: BarChart3,
      to: "/mapas/insights",
      permissionCheck: (perms) => perms?.mapas_ver_insights === true,
      order: 40,
      moduloKey: "mapas-interativos",
    });


  },
};
