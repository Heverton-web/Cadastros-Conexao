import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { computeSellerMetrics } from '~/lib/sellerMetrics';

const SellerComparison = ({ data }: { data: any[] }) => {
  const chartData = useMemo(() => computeSellerMetrics(data).map((s) => ({ name: s.vendor, nps: s.nps, total: s.total })), [data]);

  if (!chartData.length) return null;

  const colorFor = (n: number) => n >= 50 ? 'hsl(150,60%,42%)' : n >= 0 ? 'hsl(45,80%,50%)' : 'hsl(0,70%,50%)';

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          NPS por Vendedor
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-xs leading-relaxed">
                Comparativo direto do NPS de cada vendedor. Cor segue o padrão semântico: verde (≥50), amarelo (0–49), vermelho (&lt;0).
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 36)}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
            <XAxis type="number" domain={[-100, 100]} stroke="hsl(215,20%,55%)" fontSize={12} />
            <YAxis type="category" dataKey="name" width={120} stroke="hsl(215,20%,55%)" fontSize={12} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'hsl(222,47%,11%)', border: '1px solid hsl(217,33%,25%)', borderRadius: 10, color: '#e1e1e1' }}
              itemStyle={{ color: '#e1e1e1' }}
              labelStyle={{ color: '#e1e1e1' }}
              formatter={(value: number, name: string, props: any) => [`NPS ${value} (${props.payload.total} respostas)`, 'NPS']}
            />
            <Bar dataKey="nps" radius={[0, 4, 4, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={colorFor(d.nps)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SellerComparison;
