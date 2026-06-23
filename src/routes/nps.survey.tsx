import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const npsSurveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nps/survey",
  component: NpsSurveyPage,
});

function NpsSurveyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,6%)] to-[hsl(220,60%,8%)] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-5 md:p-10">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-foreground">Pesquisa de Satisfação</h1>
            <p className="text-sm text-muted-foreground">
              Em breve esta página exibirá a pesquisa de satisfação NPS.
            </p>
            <p className="text-xs text-muted-foreground">
              Componente SurveyWizard será integrado aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
