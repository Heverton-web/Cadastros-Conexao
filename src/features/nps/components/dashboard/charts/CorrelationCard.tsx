import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SurveyResponse {
  nps_score: number | null;
  matrix_facilidade_pedido: number;
  matrix_clareza_condicoes: number;
  matrix_prazo_entrega: number;
  matrix_disponibilidade_produtos: number;
  matrix_comunicacao: number;
}

const CRITERIA = [
  { key: 'matrix_facilidade_pedido', label: 'Facilidade de Pedido' },
  { key: 'matrix_clareza_condicoes', label: 'Clareza Comercial' },
  { key: 'matrix_prazo_entrega', label: 'Prazo de Entrega' },
  { key: 'matrix_disponibilidade_produtos', label: 'Disponibilidade' },
  { key: 'matrix_comunicacao', label: 'Comunicação' },
];

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 3) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

const CorrelationCard = ({ data }: { data: SurveyResponse[] }) => {
  const correlations = useMemo(() => {
    const valid = data.filter(r => r.nps_score !== null);
    if (valid.length < 5) return [];

    const npsScores = valid.map(r => r.nps_score!);

    return CRITERIA.map(({ key, label }) => {
      const criteriaScores = valid.map(r => (r as any)[key] || 0);
      const corr = pearsonCorrelation(npsScores, criteriaScores);
      return { label, correlation: Number(corr.toFixed(2)) };
    }).sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [data]);

  if (!correlations.length) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold">Impacto no NPS (Correlação)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Quanto maior o valor, mais esse critério influencia positivamente o NPS.
        </p>
        <div className="space-y-3">
          {correlations.map(({ label, correlation }) => {
            const absCorr = Math.abs(correlation);
            const isPositive = correlation >= 0;
            return (
              <div key={label} className="flex items-center gap-3">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-sm text-foreground w-36 truncate">{label}</span>
                <div className="flex-1 h-5 bg-secondary/50 rounded-md overflow-hidden">
                  <div
                    className={`h-full rounded-md transition-all ${isPositive ? 'bg-green-500/40' : 'bg-red-500/40'}`}
                    style={{ width: `${absCorr * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-mono font-semibold w-12 text-right ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {correlation > 0 ? '+' : ''}{correlation}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationCard;
