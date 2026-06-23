import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { supabase } from "~/core/supabase";
import type { NpsPergunta } from "~/features/nps/types";

export const npsSurveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nps-survey",
  component: NpsSurveyPage,
});

function NpsSurveyPage() {
  const [questions, setQuestions] = useState<NpsPergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const e = searchParams.get("e");
    setEmpresaId(e);

    async function load() {
      if (!e) { setLoading(false); return; }
      const { data } = await supabase
        .from("nps_perguntas")
        .select("*")
        .eq("empresa_id", e)
        .eq("active", true)
        .order("order_index", { ascending: true });
      
      setQuestions((data as NpsPergunta[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,6%)] to-[hsl(220,60%,8%)] flex items-center justify-center"><p className="text-white">Carregando...</p></div>;
  if (!empresaId || questions.length === 0) return <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,6%)] to-[hsl(220,60%,8%)] flex items-center justify-center"><p className="text-white">Nenhuma pergunta configurada para esta empresa.</p></div>;

  const currentQ = questions[step];
  const isLast = step === questions.length;

  const handleNext = () => {
    if (currentQ?.required && !answers[currentQ.id]) {
      alert("Por favor, responda à pergunta antes de continuar.");
      return;
    }
    setStep(s => s + 1);
  };

  const setAnswer = (val: any) => {
    setAnswers(p => ({ ...p, [currentQ.id]: val }));
    if (currentQ.type === "nps") {
      setTimeout(() => handleNext(), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,6%)] to-[hsl(220,60%,8%)] flex flex-col items-center justify-center px-4 py-6 font-sans">
      <div className="w-full max-w-2xl">
        {isLast ? (
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 transition-all text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Muito obrigado!</h1>
            <p className="text-muted-foreground">Agradecemos pelo seu tempo e por nos ajudar a melhorar nossos serviços.</p>
            <Button variant="secondary" className="mt-8" onClick={() => { setStep(0); setAnswers({}); }}>
              Simular Novamente
            </Button>
          </div>
        ) : (
          <div key={currentQ.id} className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-6 md:p-10 transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6 text-center">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Passo {step + 1} de {questions.length}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {currentQ.question_text}
              </h1>
              
              {currentQ.type === "nps" && (
                <div className="mt-8">
                  <div className="flex flex-wrap justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setAnswer(num)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center text-lg font-medium transition-all hover:scale-110
                          ${answers[currentQ.id] === num ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/20' : 'bg-background hover:bg-muted text-foreground'}`}
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
              )}

              {currentQ.type === "text" && (
                <textarea 
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => setAnswers(p => ({ ...p, [currentQ.id]: e.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[120px] resize-y mt-6 text-left"
                  placeholder="Deixe seu comentário aqui..."
                ></textarea>
              )}

              {currentQ.type === "single_choice" && (
                <div className="space-y-3 mt-6 text-left">
                  {(currentQ.options || []).map((opt, i) => (
                    <label key={i} className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer">
                      <input 
                        type="radio" 
                        name={`q-${currentQ.id}`}
                        value={opt}
                        checked={answers[currentQ.id] === opt}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-4 h-4 text-primary bg-background border-border focus:ring-primary"
                      />
                      <span className="text-sm flex-1 text-foreground">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.type === "multi_choice" && (
                <div className="space-y-3 mt-6 text-left">
                  {(currentQ.options || []).map((opt, i) => {
                    const isChecked = (answers[currentQ.id] || []).includes(opt);
                    return (
                      <label key={i} className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentList = answers[currentQ.id] || [];
                            if (e.target.checked) setAnswer([...currentList, opt]);
                            else setAnswer(currentList.filter((x: string) => x !== opt));
                          }}
                          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm flex-1 text-foreground">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between items-center pt-6 mt-4 border-t border-border/20">
                <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Voltar</Button>
                {currentQ.type !== "nps" && (
                  <Button onClick={handleNext} className="shadow-lg shadow-primary/20">
                    {step === questions.length - 1 ? "Enviar" : "Próxima"}
                  </Button>
                )}
                {currentQ.type === "nps" && <div></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
