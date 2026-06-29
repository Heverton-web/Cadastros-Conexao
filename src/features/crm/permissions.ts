export const CRM_PERMISSIONS = [
  { key: "crm_dashboard" as const, label: "Acessar dashboard CRM", description: "Visualizar dashboard do CRM", group: "CRM" },
  { key: "crm_carteira" as const, label: "Visualizar carteira", description: "Visualizar carteira de clientes", group: "CRM" },
  { key: "crm_cliente_detalhe" as const, label: "Ver detalhes do cliente", description: "Visualizar detalhes do cliente", group: "CRM" },
  { key: "crm_equipe" as const, label: "Visualizar equipe", description: "Visualizar equipe de vendas", group: "CRM" },
  { key: "crm_bi" as const, label: "Acessar BI", description: "Acessar Business Intelligence", group: "CRM" },
  { key: "crm_transferencia" as const, label: "Gerenciar transferências", description: "Gerenciar transferências de clientes", group: "CRM" },
  { key: "crm_diretoria" as const, label: "Acessar diretoria", description: "Acessar visão da diretoria", group: "CRM" },
  { key: "crm_dev_convites" as const, label: "Gerenciar convites", description: "Gerenciar convites (dev)", group: "CRM" },
  { key: "crm_dev_demo" as const, label: "Acessar demo", description: "Acessar modo demo (dev)", group: "CRM" },
  { key: "crm_dev_usuarios" as const, label: "Gerenciar usuários", description: "Gerenciar usuários (dev)", group: "CRM" },
];
