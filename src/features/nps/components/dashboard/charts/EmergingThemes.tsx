import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '~/components/ui/tooltip';
import { HelpCircle, Tags } from 'lucide-react';
import { THEMES, classifyThemes } from '~/lib/themes';
import { extractAllText } from '~/lib/sentiment';

const EmergingThemes = ({ data }: { data: any[] }) => {
  const themes = useMemo(() => {
    const counts: Record<string, number> = {};
    THEMES.forEach((t) => counts[t.id] = 0);
    let totalWithComment = 0;
    data.forEach((r) => {
      const text = extractAllText(r);
      if (!text.trim()) return;
      totalWithComment++;
      classifyThemes(text).forEach((id) => counts[id]++);
    });
    const max = Math.max(1, ...Object.values(counts));
    return { rows: THEMES.map((t) => ({ ...t, count: counts[t.id], pct: totalWithComment ? Math.round((counts[t.id] / totalWithComment) * 100) : 0 })).sort((a, b) => b.count - a.count), max, totalWithComment };
  }, [data]);

  if (!themes.totalWithComment) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <Tags className="w-4 h-4 text-primary" />
          Temas Emergentes
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help opacity-60 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[320px] text-xs leading-relaxed">
                Cada comentário é classificado nos temas (Preço, Entrega, Atendimento, Produto, Pagamento, Sistema) com base em palavras-chave. Um mesmo comentário pode aparecer em mais de um tema. % é calculado sobre o total de comentários do recorte ({themes.totalWithComment}).
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {themes.rows.map((t) => (
          <div key={t.id} className="flex items-center gap-3">
            <span className="text-sm text-foreground w-44 truncate font-medium">{t.label}</span>
            <div className="flex-1 h-5 bg-secondary/50 rounded-md overflow-hidden">
              <div className="h-full rounded-md bg-primary/40 transition-all" style={{ width: `${(t.count / themes.max) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-20 text-right">{t.count} ({t.pct}%)</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmergingThemes;
