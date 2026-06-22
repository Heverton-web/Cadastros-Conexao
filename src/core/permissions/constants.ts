export {
  ALL_PERMISSIONS,
  PERMISSOES_GROUPS,
  PERMISSOES_LABEL,
  PERMISSOES_DESC,
  type PermGroup,
  getPermissoesPadrao,
} from "~/features/cadastros/permissions";

import { registerPermission, getAllPermissionDefs } from "~/registry";
import { ALL_PERMISSIONS } from "~/features/cadastros/permissions";

export function registerCorePermissions(): void {
  for (const p of ALL_PERMISSIONS) {
    registerPermission({ key: p.key, label: p.label, description: p.description, group: p.group });
  }
}
