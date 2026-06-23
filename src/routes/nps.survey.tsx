import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export const npsSurveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nps-survey",
  component: NpsSurveyPage,
});

function NpsSurveyPage() {
  const [score, setScore] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleScoreSelect = (s: number) => {
    setScore(s);
    setTimeout(() => setStep(2), 300);
  };

  const handleFeedbackSubmit = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,6%)] to-[hsl(220,60%,8%)] flex items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-2xl">
        {step === 1 && (
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-6 md:p-10 transition-all">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Em uma escala de 0 a 10, o quanto você recomendaria nossa empresa para um amigo ou colega?</h1>
              
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScoreSelect(num)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center text-lg font-medium transition-all hover:scale-110
                      ${score === num ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/20' : 'bg-background hover:bg-muted text-foreground'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-2 px-2 font-medium">
                <span>0 - Pouco provável</span>
                <span>10 - Muito provável</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-6 md:p-10 transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <h1 className="text-xl font-bold text-foreground">
                O que motivou a sua nota {score}?
              </h1>
              <p className="text-sm text-muted-foreground">
                Nos conte um pouco mais sobre sua experiência (opcional).
              </p>
              
              <textarea 
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[120px] resize-y"
                placeholder="Deixe seu comentário aqui..."
              ></textarea>

              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={handleFeedbackSubmit} className="shadow-lg shadow-primary/20">Enviar Feedback</Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 transition-all text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Muito obrigado!</h1>
            <p className="text-muted-foreground">
              Agradecemos pelo seu tempo e por nos ajudar a melhorar nossos serviços.
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => { setStep(1); setScore(null); }}>
              Simular Novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
