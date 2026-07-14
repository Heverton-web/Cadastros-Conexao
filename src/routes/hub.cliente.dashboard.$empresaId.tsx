import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { HubDashboardPage } from "~/features/hub/pages/HubDashboardPage";
import { WalkthroughDialog } from "~/core/onboarding/WalkthroughDialog";
import { useWalkthrough } from "~/core/onboarding/useWalkthrough";
import { HUB_CLIENTE_ONBOARDING_STEPS } from "~/features/hub/onboarding-cliente";
import { HelpCircle } from "lucide-react";

function HubClienteLayout() {
  const { open, setOpen, dismiss, reopen } = useWalkthrough("hub-cliente");

  return (
    <>
      <HubDashboardPage roleFilter="client" />
      <button
        onClick={reopen}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#f59e0b] text-[#0f172a] shadow-lg hover:scale-110 transition-all flex items-center justify-center"
        title="Ajuda - Tour guiado"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      <WalkthroughDialog
        open={open}
        onOpenChange={setOpen}
        steps={HUB_CLIENTE_ONBOARDING_STEPS}
        moduleKey="hub-cliente"
        onDismiss={dismiss}
      />
    </>
  );
}

export const hubClienteDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hub/cliente/dashboard/$empresaId",
  component: HubClienteLayout,
});
