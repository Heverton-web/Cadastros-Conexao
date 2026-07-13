import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmpresaLinktreeEditor } from "~/features/linktree/components/EmpresaLinktreeEditor";
import { RequirePermission } from "~/components/guards";

export const empresaLinktreeEditorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/empresa/editor",
  component: () => (
    <RequirePermission modulo="linktree" permissions={["lt_empresa_editar"]}>
      <EmpresaLinktreeEditor />
    </RequirePermission>
  ),
});
