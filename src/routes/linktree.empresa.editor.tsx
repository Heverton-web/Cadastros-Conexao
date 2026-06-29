import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { EmpresaLinktreeEditor } from "~/features/linktree/components/EmpresaLinktreeEditor";

export const empresaLinktreeEditorRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/linktree/empresa/editor",
  component: EmpresaLinktreeEditor,
});
