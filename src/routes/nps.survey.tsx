import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { supabase } from "~/core/supabase";
import type { NpsPergunta } from "~/features/nps/types";
import { buscarEmpresa, buscarEmpresaConfig, type Empresa, type EmpresaConfig } from "~/features/empresas";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export const npsSurveyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nps-survey",
  component: NpsSurveyPage,
});

function NpsSurveyPage() {
  const [questions, setQuestions] = useState<NpsPergunta[]>([]);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empresaConfig, setEmpresaConfig] = useState<EmpresaConfig | null>(null);
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
      
      const [empData, configData, { data: perguntas }] = await Promise.all([
        buscarEmpresa(e).catch(() => null),
        buscarEmpresaConfig(e).catch(() => null),
        supabase
          .from("nps_perguntas")
          .select("*")
          .eq("empresa_id", e)
          .eq("active", true)
          .order("order_index", { ascending: true })
      ]);
      
      setEmpresa(empData);
      setEmpresaConfig(configData);
      setQuestions((perguntas as NpsPergunta[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-zinc-800 border-t-[#C5A880] rounded-full animate-spin"></div>
    </div>
  );

  if (!empresaId || questions.length === 0) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900/50 p-10 rounded-2xl border border-zinc-800 max-w-md text-center backdrop-blur-lg">
        <p className="text-zinc-400 font-medium">Esta pesquisa não está disponível no momento.</p>
      </div>
    </div>
  );

  const currentQ = questions[step];
  const isLast = step === questions.length;
  const logoUrl = empresaConfig?.logo_app_url || empresaConfig?.logo_index_url;

  const handleNext = () => {
    if (currentQ?.required && answers[currentQ.id] === undefined) {
      alert("Por favor, responda a pergunta antes de continuar.");
      return;
    }
    setStep(s => s + 1);
  };

  const setAnswer = (val: any) => {
    setAnswers(p => ({ ...p, [currentQ.id]: val }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12 font-sans bg-zinc-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-zinc-950 to-zinc-950 selection:bg-[#C5A880]/30 selection:text-white">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect internally */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/20 to-transparent"></div>

        {logoUrl ? (
          <img src={logoUrl} alt={empresa?.nome || "Logo"} className="h-8 md:h-10 w-auto mx-auto mb-6 object-contain" />
        ) : empresa?.nome ? (
          <h2 className="text-xl font-bold text-white text-center mb-6 tracking-tight">{empresa.nome}</h2>
        ) : null}

        {isLast ? (
          <div className="text-center animate-in zoom-in-95 duration-700 py-6">
            <div className="w-16 h-16 bg-[#C5A880]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C5A880]/20">
              <CheckCircle2 className="w-8 h-8 text-[#C5A880]" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-3 tracking-tight">Obrigado!</h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">Seu feedback é muito importante para nós.</p>
          </div>
        ) : (
          <div key={currentQ.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                Etapa {step + 1} de {questions.length}
              </span>
              <h1 className="text-xl md:text-2xl font-semibold text-white text-center tracking-tight mt-2">
                {currentQ.question_text}
              </h1>
            </div>
            
            {currentQ.type === "nps" && (
              <div className="mt-8 mb-4">
                <div className="flex w-full justify-between items-center gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = answers[currentQ.id] === num;
                    return (
                      <button
                        key={num}
                        onClick={() => setAnswer(num)}
                        className={`aspect-square w-full max-w-[36px] flex items-center justify-center rounded-md md:rounded-lg font-medium text-[13px] md:text-sm transition-all duration-200 outline-none
                          ${isSelected 
                            ? 'bg-[#C5A880] text-zinc-950 shadow-lg shadow-amber-500/20 font-bold scale-110 z-10' 
                            : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-transparent hover:border-zinc-600'
                          }
                        `}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 mt-4 px-1">
                  <span>Nada provável</span>
                  <span>Extremamente provável</span>
                </div>
              </div>
            )}

            {currentQ.type === "text" && (
              <div className="mt-6">
                <textarea 
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => setAnswers(p => ({ ...p, [currentQ.id]: e.target.value }))}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-200 text-sm focus-visible:outline-none focus-visible:border-[#C5A880] min-h-[120px] resize-y transition-colors placeholder:text-zinc-600"
                  placeholder="Sinta-se livre para detalhar..."
                ></textarea>
              </div>
            )}

            {currentQ.type === "single_choice" && (
              <div className="space-y-3 mt-6">
                {(currentQ.options || []).map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${isSelected ? "border-[#C5A880] bg-[#C5A880]/5" : "border-zinc-800 bg-zinc-950/30 hover:border-zinc-700"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#C5A880]" : "border-zinc-600 group-hover:border-zinc-500"}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#C5A880] rounded-full" />}
                      </div>
                      <input type="radio" name={`q-${currentQ.id}`} value={opt} checked={isSelected} onChange={(e) => setAnswer(e.target.value)} className="hidden" />
                      <span className={`text-sm flex-1 ${isSelected ? "text-white font-medium" : "text-zinc-400 group-hover:text-zinc-300"}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQ.type === "multi_choice" && (
              <div className="space-y-3 mt-6">
                {(currentQ.options || []).map((opt, i) => {
                  const isChecked = (answers[currentQ.id] || []).includes(opt);
                  return (
                    <label key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${isChecked ? "border-[#C5A880] bg-[#C5A880]/5" : "border-zinc-800 bg-zinc-950/30 hover:border-zinc-700"}`}>
                      <div className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${isChecked ? "border-[#C5A880] bg-[#C5A880]" : "border-zinc-600 group-hover:border-zinc-500"}`}>
                        {isChecked && <svg className="w-3.5 h-3.5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <input 
                        type="checkbox" checked={isChecked}
                        onChange={(e) => {
                          const list = answers[currentQ.id] || [];
                          if (e.target.checked) setAnswer([...list, opt]);
                          else setAnswer(list.filter((x: string) => x !== opt));
                        }}
                        className="hidden"
                      />
                      <span className={`text-sm flex-1 ${isChecked ? "text-white font-medium" : "text-zinc-400 group-hover:text-zinc-300"}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-800/80">
              {step > 0 ? (
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(s => s - 1)} 
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg px-4 h-10 font-medium text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
              ) : <div></div>}
              
              <Button 
                onClick={handleNext} 
                className="bg-[#C5A880] hover:bg-[#b0946d] text-zinc-950 rounded-lg px-6 h-10 font-bold text-sm transition-colors"
              >
                {step === questions.length - 1 ? "Finalizar" : "Próxima"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

