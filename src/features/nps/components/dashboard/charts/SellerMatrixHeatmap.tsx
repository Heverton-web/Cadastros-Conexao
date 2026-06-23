import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, Grid3x3 } from 'lucide-react';
import { computeSellerMetrics, MATRIX_CRITERIA_LABELS } from '~/lib/sellerMetrics';

const SellerMatrixHeatmap = ({ data }: { data: any[] }) => {
  const sellers = useMemo(() => computeSellerMetrics(data), [data]);
  if (!sellers.length) return null;

  const colorFor = (v: number) => {
    if (v === 0) return 'hsl(222,40%,14%)';
    // 1..5 → vermelho → verde
    const hue = ((v - 1) / 4) * 130; // 0 (vermelho) → 130 (verde)
    return `hsla(${hue}, 60%, 45%, 0.6)`;
  };

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-primary" />
          Critérios por Vendedor
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[320px] text-xs leading-relaxed">
                Heatmap com a média (0–5) de cada critério da matriz por vendedor. Cor varia do vermelho (notas baixas) ao verde (notas altas). Cinza indica que não há avaliação para aquele critério.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-muted-foreground font-medium pr-2">Vendedor</th>
              {MATRIX_CRITERIA_LABELS.map((c) => (
                <th key={c.key} className="text-muted-foreground font-medium px-1 text-center">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.vendor}>
                <td className="text-foreground font-medium pr-2 whitespace-nowrap">{s.vendor}</td>
                {MATRIX_CRITERIA_LABELS.map((c) => {
                  const v = s.criteria[c.key] || 0;
                  return (
                    <td
                      key={c.key}
                      className="text-center font-semibold rounded-md py-2 px-2 text-foreground min-w-[70px]"
                      style={{ backgroundColor: colorFor(v) }}
                      title={`${s.vendor} · ${c.label}: ${v > 0 ? v.toFixed(1) : 'sem dados'}`}
                    >
                      {v > 0 ? v.toFixed(1) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default SellerMatrixHeatmap;
