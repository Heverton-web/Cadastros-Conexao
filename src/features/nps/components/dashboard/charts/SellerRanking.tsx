import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, Trophy, ArrowUpDown } from 'lucide-react';
import { computeSellerMetrics, SellerMetric } from '~/lib/sellerMetrics';

type SortKey = 'nps' | 'matrixAvg' | 'total';

const SellerRanking = ({ data }: { data: any[] }) => {
  const [sort, setSort] = useState<SortKey>('nps');
  const sellers = useMemo(() => {
    const list = computeSellerMetrics(data);
    return [...list].sort((a, b) => (b[sort] as number) - (a[sort] as number));
  }, [data, sort]);

  if (!sellers.length) return null;

  const npsColor = (s: number) => s >= 50 ? 'text-green-400' : s >= 0 ? 'text-yellow-400' : 'text-red-400';

  const headers: { key: SortKey | null; label: string; align?: string }[] = [
    { key: null, label: '#' },
    { key: null, label: 'Vendedor' },
    { key: 'total', label: 'Respostas', align: 'text-right' },
    { key: 'nps', label: 'NPS', align: 'text-right' },
    { key: 'matrixAvg', label: 'Média Matriz', align: 'text-right' },
    { key: null, label: 'Distribuição', align: 'text-right' },
  ];

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Ranking de Vendedores
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[320px] text-xs leading-relaxed">
                Cada vendedor é agregado a partir do campo <code>vendor_name</code> nas respostas filtradas. NPS = ((promotores − detratores) ÷ notas válidas) × 100. Média Matriz = média de todos os critérios (Facilidade, Clareza, Prazo, Disponibilidade, Comunicação). Clique nos cabeçalhos para ordenar.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground text-xs">
              {headers.map((h, i) => (
                <th key={i} className={`py-2 px-2 font-medium ${h.align || 'text-left'}`}>
                  {h.key ? (
                    <button onClick={() => setSort(h.key as SortKey)} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      {h.label}
                      <ArrowUpDown className={`w-3 h-3 ${sort === h.key ? 'text-primary' : ''}`} />
                    </button>
                  ) : h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sellers.map((s: SellerMetric, i) => {
              const totalNps = s.promoters + s.passives + s.detractors || 1;
              return (
                <tr key={s.vendor} className="border-b border-border/20 text-foreground">
                  <td className="py-2 px-2 text-muted-foreground">{i + 1}</td>
                  <td className="py-2 px-2 font-medium">{s.vendor}</td>
                  <td className="py-2 px-2 text-right">{s.total}</td>
                  <td className={`py-2 px-2 text-right font-bold ${npsColor(s.nps)}`}>{s.nps}</td>
                  <td className="py-2 px-2 text-right">{s.matrixAvg > 0 ? s.matrixAvg.toFixed(1) : '—'}</td>
                  <td className="py-2 px-2">
                    <div className="flex h-2 rounded-full overflow-hidden ml-auto w-32">
                      <div className="bg-red-500/70" style={{ width: `${(s.detractors / totalNps) * 100}%` }} title={`Detratores: ${s.detractors}`} />
                      <div className="bg-yellow-500/70" style={{ width: `${(s.passives / totalNps) * 100}%` }} title={`Neutros: ${s.passives}`} />
                      <div className="bg-green-500/70" style={{ width: `${(s.promoters / totalNps) * 100}%` }} title={`Promotores: ${s.promoters}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default SellerRanking;
