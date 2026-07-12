export const CATALOGO_PERMISSIONS = [
  { key: "catalogo_ver_catalogo" as const, label: "Ver catálogo", description: "Visualizar produtos do catálogo na loja", group: "Catálogo" },
  { key: "catalogo_gerenciar_produtos" as const, label: "Gerenciar produtos", description: "CRUD de implantes, componentes e kits", group: "Catálogo" },
  { key: "catalogo_gerenciar_cadastros" as const, label: "Gerenciar cadastros", description: "Gerenciar tabelas auxiliares (famílias, linhas, tipos)", group: "Catálogo" },
  { key: "catalogo_gerenciar_cupons" as const, label: "Gerenciar cupons", description: "Criar e editar cupons de desconto", group: "Catálogo" },
  { key: "catalogo_gerenciar_frete" as const, label: "Gerenciar frete", description: "Configurar regras e faixas de frete", group: "Catálogo" },
  { key: "catalogo_gerenciar_promocionais" as const, label: "Gerenciar promoções", description: "Gerenciar pacotes promocionais", group: "Catálogo" },
  { key: "catalogo_dashboard" as const, label: "Dashboard catálogo", description: "Visualizar KPIs do catálogo", group: "Catálogo" },
] as const
