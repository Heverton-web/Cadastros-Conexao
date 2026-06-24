import { useEffect, useState } from "react";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/lib/auth";
import type { NpsPergunta } from "~/features/nps/types";
import { buscarEmpresa, buscarEmpresaConfig, listarEmpresas, type Empresa, type EmpresaConfig } from "~/features/empresas";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowRight, ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { getNpsThemeVars, getNpsNoBorders } from "~/features/nps/theme";

export default function NpsPreviewPage() {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.is_super_admin === true;

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>("");
  const [questions, setQuestions] = useState<NpsPergunta[]>([]);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [empresaConfig, setEmpresaConfig] = useState<EmpresaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showRequiredAlert, setShowRequiredAlert] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      listarEmpresas()
        .then((emp) => {
          setEmpresas(emp.filter((e) => e.ativo));
          setLoadingEmpresas(false);
        })
        .catch(() => setLoadingEmpresas(false));
    } else if (profile?.empresa_id) {
      setSelectedEmpresaId(profile.empresa_id);
      setLoadingEmpresas(false);
    } else {
      setLoadingEmpresas(false);
    }
  }, [isSuperAdmin, profile?.empresa_id]);

  useEffect(() => {
    if (!selectedEmpresaId) {
      setQuestions([]);
      setEmpresa(null);
      setEmpresaConfig(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setStep(0);
    setAnswers({});

    Promise.all([
      buscarEmpresa(selectedEmpresaId).catch(() => null),
      buscarEmpresaConfig(selectedEmpresaId).catch(() => null),
      supabase
        .from("nps_perguntas")
        .select("*")
        .eq("empresa_id", selectedEmpresaId)
        .eq("active", true)
        .order("order_index", { ascending: true }),
    ]).then(([empData, configData, { data: perguntas }]) => {
      setEmpresa(empData);
      setEmpresaConfig(configData);
      const normalizadas = (perguntas as NpsPergunta[])?.map((q) => {
        let opts: string[] = [];
        if (Array.isArray(q.options)) opts = q.options;
        else if (typeof q.options === "string") try { opts = JSON.parse(q.options); } catch { opts = []; }
        return { ...q, options: opts };
      }) || [];
      setQuestions(normalizadas);
      setLoading(false);
    });
  }, [selectedEmpresaId]);

  const currentQ = questions[step];
  const isLast = step === questions.length;
  const logoUrl = empresaConfig?.logo_app_url || empresaConfig?.logo_index_url;
  const npsTheme = getNpsThemeVars(empresaConfig) as React.CSSProperties;
  const noBorders = getNpsNoBorders(empresaConfig);

  const handleNext = () => {
    if (currentQ?.required && answers[currentQ.id] === undefined) {
      setShowRequiredAlert(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const setAnswer = (val: any) => {
    setAnswers((p) => ({ ...p, [currentQ.id]: val }));
  };

  const isReady = !loadingEmpresas && selectedEmpresaId;
  const hasQuestions = questions.length > 0;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${noBorders ? 'nps-no-borders' : ''}`} style={npsTheme}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-2 flex items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Preview da Pesquisa
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize a pesquisa como o cliente a verá. Nenhuma resposta é gravada.
            </p>
          </div>
        </div>

        {/* Seletor de empresa (Super Admin) */}
        {isSuperAdmin && (
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">Empresa:</label>
              <Select
                value={selectedEmpresaId}
                onValueChange={setSelectedEmpresaId}
                disabled={loadingEmpresas}
              >
                <SelectTrigger className="w-full max-w-xs bg-secondary/80 border-border/50 text-foreground text-sm">
                  <SelectValue
                    placeholder={loadingEmpresas ? "Carregando..." : "Selecione a empresa"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id} className="text-xs">
                      {emp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Preview da pesquisa */}
        {isReady && (
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              {!hasQuestions && !loading && (
                <div className="bg-[var(--nps-surface-50)] border border-[var(--nps-surface)] backdrop-blur-lg rounded-2xl p-10 text-center">
                  <p className="text-[var(--nps-text-muted)] font-medium">
                    Nenhuma pergunta ativa para esta empresa.
                  </p>
                </div>
              )}

              {loading && (
                <div className="bg-[var(--nps-surface-50)] border border-[var(--nps-surface)] backdrop-blur-lg rounded-2xl p-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--nps-surface)] border-t-[var(--nps-accent)] rounded-full animate-spin" />
                </div>
              )}

              {hasQuestions && (
                <div className="bg-[var(--nps-surface-50)] border border-[var(--nps-surface)] backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--nps-accent-20)] to-transparent" />

                  {logoUrl || empresa?.nome ? (
                    <div className="flex items-center justify-center gap-3 mb-6">
                      {logoUrl && (
                        <img src={logoUrl} alt={empresa?.nome || "Logo"} className="h-8 w-auto object-contain flex-shrink-0" />
                      )}
                      {logoUrl && empresa?.nome && (
                        <div className="h-8 w-px bg-[var(--nps-header-divider)] flex-shrink-0" />
                      )}
                      {empresa?.nome && (
                        <h2 className="text-lg font-bold text-[var(--nps-header-logo-text)] tracking-tight">{empresa.nome}</h2>
                      )}
                    </div>
                  ) : null}

                  {isLast ? (
                    <div className="text-center animate-in zoom-in-95 duration-700 py-6">
                      <div className="w-16 h-16 bg-[var(--nps-accent-10)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--nps-accent-20)]">
                        <CheckCircle2 className="w-8 h-8 text-[var(--nps-accent)]" />
                      </div>
                      <h1 className="text-2xl font-semibold text-[var(--nps-text)] mb-3 tracking-tight">
                        Obrigado!
                      </h1>
                      <p className="text-[var(--nps-text-muted)] text-sm md:text-base leading-relaxed">
                        Seu feedback é muito importante para nós.
                      </p>
                      <p className="text-[var(--nps-text-muted)] text-xs mt-4 italic">
                        (Preview — nenhuma resposta foi gravada)
                      </p>
                    </div>
                  ) : (
                    <div
                      key={currentQ.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <div className="mb-6 flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-[var(--nps-text-muted)] font-semibold">
                          Etapa {step + 1} de {questions.length}
                        </span>
                        <h1 className="text-xl md:text-2xl font-semibold text-[var(--nps-text)] text-center tracking-tight mt-2">
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
                                    ${
                                      isSelected
                                        ? "bg-[var(--nps-accent)] text-zinc-950 shadow-lg shadow-amber-500/20 font-bold scale-110 z-10"
                                        : "bg-[rgba(24,24,27,0.8)] text-[var(--nps-text-muted)] hover:bg-zinc-700 hover:text-white border border-transparent hover:border-zinc-600"
                                    }
                                  `}
                                >
                                  {num}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[11px] text-[var(--nps-text-muted)] mt-4 px-1">
                            <span>Nada provável</span>
                            <span>Extremamente provável</span>
                          </div>
                        </div>
                      )}

                      {currentQ.type === "text" && (
                        <div className="mt-6">
                          <textarea
                            value={answers[currentQ.id] || ""}
                            onChange={(e) =>
                              setAnswers((p) => ({ ...p, [currentQ.id]: e.target.value }))
                            }
                            className="w-full bg-[var(--nps-bg-50)] border border-[var(--nps-surface)] rounded-xl px-4 py-4 text-[var(--nps-text)] text-sm focus-visible:outline-none focus-visible:border-[var(--nps-accent)] min-h-[120px] resize-y transition-colors placeholder:text-[var(--nps-text-muted)]"
                            placeholder="Sinta-se livre para detalhar..."
                          />
                        </div>
                      )}

                      {currentQ.type === "single_choice" && (
                        <div className="space-y-3 mt-6">
                          {(currentQ.options || []).map((opt, i) => {
                            const isSelected = answers[currentQ.id] === opt;
                            return (
                              <label
                                key={i}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                                  isSelected
                                    ? "border-[var(--nps-accent)] bg-[var(--nps-accent-5)]"
                                    : "border-[var(--nps-surface)] bg-[var(--nps-bg-50)] hover:border-zinc-700"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isSelected ? "border-[var(--nps-accent)]" : "border-zinc-600 group-hover:border-zinc-500"
                                  }`}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 bg-[var(--nps-accent)] rounded-full" />}
                                </div>
                                <input
                                  type="radio"
                                  name={`q-${currentQ.id}`}
                                  value={opt}
                                  checked={isSelected}
                                  onChange={() => setAnswer(opt)}
                                  className="hidden"
                                />
                                <span
                                  className={`text-sm flex-1 ${
                                    isSelected ? "text-[var(--nps-text)] font-medium" : "text-[var(--nps-text-muted)] group-hover:text-zinc-300"
                                  }`}
                                >
                                  {opt}
                                </span>
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
                              <label
                                key={i}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${
                                  isChecked
                                    ? "border-[var(--nps-accent)] bg-[var(--nps-accent-5)]"
                                    : "border-[var(--nps-surface)] bg-[var(--nps-bg-50)] hover:border-zinc-700"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                                    isChecked
                                      ? "border-[var(--nps-accent)] bg-[var(--nps-accent)]"
                                      : "border-zinc-600 group-hover:border-zinc-500"
                                  }`}
                                >
                                  {isChecked && (
                                    <svg
                                      className="w-3.5 h-3.5 text-zinc-950"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const list = answers[currentQ.id] || [];
                                    if (e.target.checked) setAnswer([...list, opt]);
                                    else setAnswer(list.filter((x: string) => x !== opt));
                                  }}
                                  className="hidden"
                                />
                                <span
                                  className={`text-sm flex-1 ${
                                    isChecked ? "text-[var(--nps-text)] font-medium" : "text-[var(--nps-text-muted)] group-hover:text-zinc-300"
                                  }`}
                                >
                                  {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--nps-surface)]/80">
                        {step > 0 ? (
                          <Button
                            variant="ghost"
                            onClick={() => setStep((s) => s - 1)}
                            className="text-[var(--nps-text-muted)] hover:text-white hover:bg-zinc-800 rounded-lg px-4 h-10 font-medium text-sm"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                          </Button>
                        ) : (
                          <div />
                        )}
                        <Button
                          onClick={handleNext}
                          className="bg-[var(--nps-accent)] hover:bg-[var(--nps-accent-hover)] text-zinc-950 rounded-lg px-6 h-10 font-bold text-sm transition-colors"
                        >
                          {step === questions.length - 1 ? "Finalizar" : "Próxima"}{" "}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de pergunta obrigatória */}
        {showRequiredAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--nps-modal-overlay)] backdrop-blur-sm" onClick={() => setShowRequiredAlert(false)}>
            <div className="bg-[var(--nps-modal-bg)] border border-[var(--nps-modal-border)] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--nps-modal-icon-bg)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--nps-modal-icon-border)]">
                  <svg className="w-6 h-6 text-[var(--nps-modal-icon-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--nps-modal-title)] mb-2">Pergunta obrigatória</h3>
                <p className="text-sm text-[var(--nps-modal-subtitle)] mb-6">Por favor, responda a pergunta antes de continuar.</p>
                <button
                  onClick={() => setShowRequiredAlert(false)}
                  className="w-full bg-[var(--nps-modal-btn-bg)] hover:bg-[var(--nps-modal-btn-hover)] text-[var(--nps-modal-btn-text)] rounded-lg px-6 py-2.5 text-sm font-bold transition-colors"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
