import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { CriativosList } from "~/features/marketing/criativos/components/CriativosList";
import { RequirePermission } from "~/components/guards";

export const marketingCriativosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/criativos",
  component: () => (
    <RequirePermission modulo="marketing" permissions={["mktg_criativo_ver"]}>
      <CriativosList />
    </RequirePermission>
  ),
});
