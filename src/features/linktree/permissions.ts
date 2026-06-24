import type { Permissoes } from "~/core/permissions/types";

export const LINKTREE_PERMISSIONS: { key: keyof Permissoes; label: string; description: string; group: string }[] = [
  { key: "lt_ver_dashboard", label: "Ver dashboard LinkTree", description: "Visualizar painel de colaboradores", group: "LinkTree" },
  { key: "lt_criar_colaborador", label: "Criar colaborador", description: "Criar novos colaboradores com Link Tree", group: "LinkTree" },
  { key: "lt_editar_colaborador", label: "Editar colaborador", description: "Editar dados de colaboradores existentes", group: "LinkTree" },
  { key: "lt_excluir_colaborador", label: "Excluir colaborador", description: "Excluir colaboradores permanentemente", group: "LinkTree" },
  { key: "lt_toggle_status", label: "Ativar/inativar colaborador", description: "Alterar status ativo/inativo do colaborador", group: "LinkTree" },
  { key: "lt_ver_link", label: "Visualizar link público", description: "Acessar o Link Tree público do colaborador", group: "LinkTree" },
  { key: "lt_ver_qr", label: "Visualizar QR Code", description: "Visualizar QR Code do colaborador", group: "LinkTree" },
  { key: "lt_baixar_qr", label: "Baixar QR Code", description: "Baixar QR Code em PNG", group: "LinkTree" },
  { key: "lt_gerenciar_tema", label: "Gerenciar tema", description: "Personalizar cores, fontes e layout dos Link Trees", group: "LinkTree" },
];
