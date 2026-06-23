import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface SurveyResponse {
  nps_comment: string;
  melhoria_atendimento: string;
  expansao_produtos: string;
  oportunidade: string;
  pergunta_final: string;
}

const STOP_WORDS = new Set([
  'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'não', 'que',
  'no', 'na', 'os', 'as', 'dos', 'das', 'por', 'mais', 'se', 'muito', 'já', 'ou',
  'ser', 'é', 'são', 'tem', 'ter', 'mas', 'como', 'ao', 'nos', 'nas', 'essa', 'esse',
  'esta', 'este', 'isso', 'isto', 'ela', 'ele', 'eu', 'me', 'meu', 'minha', 'seu',
  'sua', 'nos', 'também', 'foi', 'está', 'bem', 'só', 'quando', 'ainda', 'entre',
  'sem', 'mesmo', 'até', 'sobre', 'pode', 'nem', 'seus', 'suas', 'uns', 'umas',
  'pelo', 'pela', 'pelos', 'pelas', 'todo', 'toda', 'todos', 'todas', 'cada',
  'nao', 'voces', 'vocês', 'nós', 'eles', 'elas', 'lo', 'la', 'lhe',
]);

const KeyPhrasesCard = ({ data }: { data: SurveyResponse[] }) => {
  const topWords = useMemo(() => {
    const wordCount: Record<string, number> = {};
    data.forEach(r => {
      const texts = [r.nps_comment, r.melhoria_atendimento, r.expansao_produtos, r.oportunidade, r.pergunta_final];
      texts.forEach(text => {
        if (!text) return;
        text.toLowerCase()
          .replace(/[^a-záàâãéèêíïóôõúüç\s]/g, '')
          .split(/\s+/)
          .filter(w => w.length > 2 && !STOP_WORDS.has(w))
          .forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
      });
    });
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15);
  }, [data]);

  if (!topWords.length) return null;

  const maxCount = topWords[0]?.[1] || 1;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Palavras Mais Mencionadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topWords.map(([word, count]) => (
            <div key={word} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-28 truncate font-medium">{word}</span>
              <div className="flex-1 h-5 bg-secondary/50 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md bg-primary/40 transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyPhrasesCard;
