import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { HelpCircle, Sparkles } from "lucide-react";

interface Props {
  data: any[];
}

const DynamicQuestionsChart = ({ data }: Props) => {
  const questions = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    data.forEach((r) => {
      const dyn = r.dynamic_answers;
      if (!dyn || typeof dyn !== "object") return;
      Object.entries(dyn).forEach(([q, v]) => {
        if (typeof v !== "string" || !v.trim()) return;
        // ignora textos longos (provavelmente livre): mais de 30 caracteres → não conta como categoria
        if (v.length > 40) return;
        map[q] = map[q] || {};
        map[q][v] = (map[q][v] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([question, counts]) => ({
        question,
        total: Object.values(counts).reduce((a, b) => a + b, 0),
        items: Object.entries(counts).sort(([, a], [, b]) => b - a),
      }))
      .filter((q) => Object.keys(q.items).length > 0)
      .sort((a, b) => b.total - a.total);
  }, [data]);

  if (!questions.length) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Perguntas Dinâmicas
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[300px] text-xs leading-relaxed"
              >
                Distribuição das respostas para cada pergunta dinâmica
                cadastrada. Mostra somente respostas curtas (até 40 caracteres),
                tratadas como categorias. Respostas longas em texto livre
                aparecem em "Insights Qualitativos".
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map(({ question, items, total }) => (
          <div key={question}>
            <p className="text-sm font-medium text-foreground mb-2">
              {question}{" "}
              <span className="text-xs text-muted-foreground">
                ({total} respostas)
              </span>
            </p>
            <div className="space-y-1.5">
              {items.map(([answer, count]) => (
                <div key={answer} className="flex items-center gap-3">
                  <span className="text-xs text-foreground w-40 truncate">
                    {answer}
                  </span>
                  <div className="flex-1 h-4 bg-secondary/50 rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md bg-primary/40"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {count} ({Math.round((count / total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DynamicQuestionsChart;
