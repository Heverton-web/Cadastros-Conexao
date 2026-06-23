import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { supabase } from "~/core/supabase";
import type { NpsPergunta } from "~/features/nps/types";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

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

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!empresaId || questions.length === 0) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4"><div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md text-center"><p className="text-slate-600 font-medium">Esta pesquisa nao esta disponivel no momento.</p></div></div>;

  const currentQ = questions[step];
  const isLast = step === questions.length;
  const progress = isLast ? 100 : Math.round((step / questions.length) * 100);

  const handleNext = () => {
    if (currentQ?.required && !answers[currentQ.id]) {
      alert("Por favor, responda a pergunta antes de continuar.");
      return;
    }
    setStep(s => s + 1);
  };

  const setAnswer = (val: any) => {
    setAnswers(p => ({ ...p, [currentQ.id]: val }));
    if (currentQ.type === "nps") {
      setTimeout(() => handleNext(), 400);
    }
  };

  const getNpsColor = (num: number, isSelected: boolean) => {
    if (!isSelected) return "bg-white border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-slate-50";
    if (num <= 6) return "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110";
    if (num <= 8) return "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110";
    return "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-8 md:py-12 font-sans selection:bg-primary/20">
      <div className="w-full max-w-3xl mb-8 flex justify-center"></div>

      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: progress + "%" }}></div>
          </div>
          {!isLast && (
            <div className="text-center mt-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Pergunta {step + 1} de {questions.length}
              </span>
            </div>
          )}
        </div>

        {isLast ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 md:p-16 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Muito obrigado!</h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">Agradecemos pelo seu tempo e por nos ajudar a melhorar continuamente a sua experiencia conosco.</p>
            <Button variant="outline" className="mt-10 rounded-full px-8 py-6 text-slate-600 border-slate-200 hover:bg-slate-50 transition-all" onClick={() => { setStep(0); setAnswers({}); }}>
              Responder Novamente
            </Button>
          </div>
        ) : (
          <div key={currentQ.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-12 transition-all animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-10">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug text-center tracking-tight">
                {currentQ.question_text}
              </h1>
              
              {currentQ.type === "nps" && (
                <div className="mt-12">
                  <div className="flex flex-wrap justify-center sm:justify-between gap-2 md:gap-3">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = answers[currentQ.id] === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setAnswer(num)}
                          className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl border-2 flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${getNpsColor(num, isSelected)}`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 mt-6 px-1 font-medium tracking-wide">
                    <span>0 - Pouco provavel</span>
                    <span>10 - Muito provavel</span>
                  </div>
                </div>
              )}

              {currentQ.type === "text" && (
                <div className="mt-8 animate-in fade-in duration-500">
                  <textarea 
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => setAnswers(p => ({ ...p, [currentQ.id]: e.target.value }))}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-6 py-5 text-slate-800 text-lg focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white min-h-[160px] resize-y transition-all shadow-inner"
                    placeholder="Deixe seu comentario detalhado aqui..."
                  ></textarea>
                </div>
              )}

              {currentQ.type === "single_choice" && (
                <div className="space-y-4 mt-8 animate-in fade-in duration-500">
                  {(currentQ.options || []).map((opt, i) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <label key={i} className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50"}`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary" : "border-slate-300 group-hover:border-slate-400"}`}>
                          {isSelected && <div className="w-3 h-3 bg-primary rounded-full animate-in zoom-in" />}
                        </div>
                        <input 
                          type="radio" 
                          name={`q-${currentQ.id}`}
                          value={opt}
                          checked={isSelected}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="hidden"
                        />
                        <span className={`text-lg flex-1 transition-colors ${isSelected ? "text-slate-900 font-medium" : "text-slate-600"}`}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQ.type === "multi_choice" && (
                <div className="space-y-4 mt-8 animate-in fade-in duration-500">
                  {(currentQ.options || []).map((opt, i) => {
                    const isChecked = (answers[currentQ.id] || []).includes(opt);
                    return (
                      <label key={i} className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${isChecked ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50"}`}>
                        <div className={`w-6 h-6 rounded-[0.4rem] border-2 flex items-center justify-center transition-colors ${isChecked ? "border-primary bg-primary" : "border-slate-300 group-hover:border-slate-400"}`}>
                          {isChecked && <svg className="w-4 h-4 text-white animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentList = answers[currentQ.id] || [];
                            if (e.target.checked) setAnswer([...currentList, opt]);
                            else setAnswer(currentList.filter((x: string) => x !== opt));
                          }}
                          className="hidden"
                        />
                        <span className={`text-lg flex-1 transition-colors ${isChecked ? "text-slate-900 font-medium" : "text-slate-600"}`}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between items-center pt-8 mt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="text-slate-500 hover:text-slate-800 rounded-full px-6 py-6 font-medium">
                  <ArrowLeft className="w-5 h-5 mr-2" /> Anterior
                </Button>
                {currentQ.type !== "nps" && (
                  <Button onClick={handleNext} className="rounded-full px-8 py-6 font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 text-base">
                    {step === questions.length - 1 ? "Finalizar" : "Proxima"} <ArrowRight className="w-5 h-5 ml-2" />
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
