import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, LucideIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface DistributionBarsCardProps {
  data: any[];
  field: string;
  title: string;
  hint: string;
  order: string[];
  colorMap?: Record<string, string>;
  icon?: LucideIcon;
  layout?: 'horizontal' | 'vertical';
}

const DEFAULT_COLOR = 'hsl(38,55%,50%)';

const DistributionBarsCard = ({ data, field, title, hint, order, colorMap, icon: Icon, layout = 'horizontal' }: DistributionBarsCardProps) => {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((r) => {
      const v = r[field];
      if (typeof v === 'string' && v.trim()) counts[v] = (counts[v] || 0) + 1;
    });
    const sortedKeys = [
      ...order.filter((k) => counts[k]),
      ...Object.keys(counts).filter((k) => !order.includes(k)),
    ];
    return sortedKeys.map((name) => ({ name, value: counts[name] }));
  }, [data, field, order]);

  if (!chartData.length) {
    return (
      <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Sem dados nesse recorte.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          {title}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] text-xs leading-relaxed">
                {hint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 42)}>
          <BarChart data={chartData} layout={layout === 'vertical' ? 'vertical' : 'horizontal'}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
            {layout === 'vertical' ? (
              <>
                <XAxis type="number" stroke="hsl(215,20%,55%)" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={140} stroke="hsl(215,20%,55%)" fontSize={12} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" stroke="hsl(215,20%,55%)" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="hsl(215,20%,55%)" fontSize={12} allowDecimals={false} />
              </>
            )}
            <RechartsTooltip
              contentStyle={{ backgroundColor: 'hsl(222,47%,11%)', border: '1px solid hsl(217,33%,25%)', borderRadius: 10, color: '#e1e1e1' }}
              itemStyle={{ color: '#e1e1e1' }}
              labelStyle={{ color: '#e1e1e1' }}
              formatter={(value: number) => [`${value} resposta(s)`, 'Quantidade']}
            />
            <Bar dataKey="value" radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={colorMap?.[entry.name] || DEFAULT_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DistributionBarsCard;
