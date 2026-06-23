import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, Clock } from 'lucide-react';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOUR_BUCKETS = [
  { label: '0-3h', range: [0, 3] },
  { label: '4-7h', range: [4, 7] },
  { label: '8-11h', range: [8, 11] },
  { label: '12-15h', range: [12, 15] },
  { label: '16-19h', range: [16, 19] },
  { label: '20-23h', range: [20, 23] },
];

const TimeHeatmap = ({ data }: { data: any[] }) => {
  const { grid, max } = useMemo(() => {
    const g: number[][] = Array.from({ length: 7 }, () => Array(HOUR_BUCKETS.length).fill(0));
    let m = 0;
    data.forEach((r) => {
      const d = new Date(r.created_at);
      const dow = d.getDay();
      const hour = d.getHours();
      const bucket = HOUR_BUCKETS.findIndex((b) => hour >= b.range[0] && hour <= b.range[1]);
      if (bucket >= 0) {
        g[dow][bucket]++;
        if (g[dow][bucket] > m) m = g[dow][bucket];
      }
    });
    return { grid: g, max: m };
  }, [data]);

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Horários de Resposta
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-xs leading-relaxed">
                Mapa de calor cruzando dia da semana × faixa horária. Quanto mais escuro o quadrado, mais respostas chegaram nesse intervalo. Use para planejar o melhor momento de enviar pesquisas e follow-ups.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left text-muted-foreground font-medium pr-2"></th>
                {HOUR_BUCKETS.map((b) => (
                  <th key={b.label} className="text-muted-foreground font-medium px-1 text-center">{b.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, i) => (
                <tr key={day}>
                  <td className="text-muted-foreground font-medium pr-2 text-right">{day}</td>
                  {HOUR_BUCKETS.map((_, j) => {
                    const v = grid[i][j];
                    const intensity = max ? v / max : 0;
                    return (
                      <td
                        key={j}
                        className="text-center font-medium rounded-md py-2 px-1 text-foreground"
                        style={{
                          backgroundColor: v === 0
                            ? 'hsl(222,40%,14%)'
                            : `hsla(38, 60%, 50%, ${0.15 + intensity * 0.7})`,
                        }}
                        title={`${day} ${HOUR_BUCKETS[j].label}: ${v} resposta(s)`}
                      >
                        {v || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeHeatmap;
