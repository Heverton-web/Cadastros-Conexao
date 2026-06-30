import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const computeNps = (rows: any[]) => {
  const scored = rows.filter(
    (r) => r.nps_score !== null && r.nps_score !== undefined,
  );
  if (!scored.length) return { nps: 0, count: 0 };
  const promoters = scored.filter((r) => r.nps_score >= 9).length;
  const detractors = scored.filter((r) => r.nps_score <= 6).length;
  return {
    nps: Math.round(((promoters - detractors) / scored.length) * 100),
    count: scored.length,
  };
};

const MonthOverMonthCard = ({ data }: { data: any[] }) => {
  const { current, previous, delta } = useMemo(() => {
    const now = new Date();
    const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endPrev = startCurrent;

    const cur = data.filter((r) => new Date(r.created_at) >= startCurrent);
    const prev = data.filter((r) => {
      const d = new Date(r.created_at);
      return d >= startPrev && d < endPrev;
    });
    const c = computeNps(cur);
    const p = computeNps(prev);
    return { current: c, previous: p, delta: c.nps - p.nps };
  }, [data]);

  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const trendColor =
    delta > 0
      ? "text-green-400"
      : delta < 0
        ? "text-red-400"
        : "text-muted-foreground";

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          Comparativo Mês a Mês
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[300px] text-xs leading-relaxed"
              >
                NPS do mês atual (até hoje) comparado ao NPS do mês anterior
                inteiro. O delta mostra a variação em pontos NPS. Considera
                apenas as respostas presentes no recorte de filtros ativos.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mês anterior</p>
            <p className="text-2xl font-bold text-foreground">{previous.nps}</p>
            <p className="text-xs text-muted-foreground">
              {previous.count} respostas
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mês atual</p>
            <p className="text-2xl font-bold text-primary">{current.nps}</p>
            <p className="text-xs text-muted-foreground">
              {current.count} respostas
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Variação</p>
            <p
              className={`text-2xl font-bold flex items-center gap-1 ${trendColor}`}
            >
              <TrendIcon className="w-5 h-5" />
              {delta > 0 ? "+" : ""}
              {delta}
            </p>
            <p className="text-xs text-muted-foreground">pontos NPS</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthOverMonthCard;
