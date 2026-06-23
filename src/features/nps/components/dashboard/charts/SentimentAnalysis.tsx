import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, Smile } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { classifySentiment, extractAllText } from '~/lib/sentiment';

const COLORS: Record<string, string> = {
  positivo: 'hsl(150,60%,42%)',
  neutro: 'hsl(45,80%,50%)',
  negativo: 'hsl(0,70%,50%)',
};

const SentimentAnalysis = ({ data }: { data: any[] }) => {
  const chart = useMemo(() => {
    const counts: Record<string, number> = { positivo: 0, neutro: 0, negativo: 0 };
    data.forEach((r) => {
      const text = extractAllText(r);
      if (!text.trim()) return;
      counts[classifySentiment(text)]++;
    });
    const total = counts.positivo + counts.neutro + counts.negativo;
    return { items: Object.entries(counts).map(([name, value]) => ({ name, value })), total };
  }, [data]);

  if (!chart.total) {
    return (
      <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
            <Smile className="w-4 h-4 text-primary" /> Sentimento dos Comentários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Sem comentários no recorte.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Smile className="w-4 h-4 text-primary" />
          Sentimento dos Comentários
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[320px] text-xs leading-relaxed">
                Classificação automática (positivo / neutro / negativo) baseada em léxico português. Cada comentário recebe +1 por palavra positiva e -1 por palavra negativa (palavras precedidas por "não/nunca" são invertidas). Análise feita no navegador, sem custo de IA — útil como sinal direcional.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chart.items} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {chart.items.map((e, i) => <Cell key={i} fill={COLORS[e.name]} />)}
            </Pie>
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'hsl(222,47%,11%)', border: '1px solid hsl(217,33%,25%)', borderRadius: 10, color: '#e1e1e1' }}
              formatter={(v: number, n: string) => [`${v} comentário(s)`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">{chart.total} comentários analisados</p>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
