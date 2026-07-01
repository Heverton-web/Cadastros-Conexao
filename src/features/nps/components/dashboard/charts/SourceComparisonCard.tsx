import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SurveyResponse {
  source: string | null;
  nps_score: number | null;
  matrix_facilidade_pedido: number;
  matrix_clareza_condicoes: number;
  matrix_prazo_entrega: number;
  matrix_disponibilidade_produtos: number;
  matrix_comunicacao: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(222,47%,11%)",
  border: "1px solid hsl(217,33%,25%)",
  borderRadius: 10,
  color: "#e1e1e1",
  padding: "10px 14px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const SourceComparisonCard = ({ data }: { data: SurveyResponse[] }) => {
  const sourceData = useMemo(() => {
    const sources: Record<
      string,
      { npsScores: number[]; matrixSums: number[]; count: number }
    > = {};

    data.forEach((r) => {
      const src = r.source || "Sem fonte";
      if (!sources[src])
        sources[src] = { npsScores: [], matrixSums: [], count: 0 };
      sources[src].count++;
      if (r.nps_score !== null) sources[src].npsScores.push(r.nps_score);
      const vals = [
        r.matrix_facilidade_pedido,
        r.matrix_clareza_condicoes,
        r.matrix_prazo_entrega,
        r.matrix_disponibilidade_produtos,
        r.matrix_comunicacao,
      ].filter((v) => v > 0);
      if (vals.length)
        sources[src].matrixSums.push(
          vals.reduce((a, b) => a + b, 0) / vals.length,
        );
    });

    return Object.entries(sources)
      .filter(([, v]) => v.count >= 2)
      .map(([source, { npsScores, matrixSums, count }]) => {
        const promoters = npsScores.filter((s) => s >= 9).length;
        const detractors = npsScores.filter((s) => s <= 6).length;
        const nps = npsScores.length
          ? Math.round(((promoters - detractors) / npsScores.length) * 100)
          : 0;
        const avgMatrix = matrixSums.length
          ? Number(
              (
                matrixSums.reduce((a, b) => a + b, 0) / matrixSums.length
              ).toFixed(1),
            )
          : 0;
        return { source, nps, media: avgMatrix, respostas: count };
      })
      .sort((a, b) => b.respostas - a.respostas);
  }, [data]);

  if (sourceData.length < 2) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold">
          Comparativo por Fonte/Canal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
            <XAxis dataKey="source" stroke="hsl(215,20%,55%)" fontSize={12} />
            <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: "#e1e1e1" }}
              labelStyle={{ color: "#e1e1e1" }}
            />
            <Bar
              dataKey="nps"
              name="NPS"
              fill="hsl(38,50%,50%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="media"
              name="Média Critérios"
              fill="hsl(210,50%,55%)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-3 text-xs text-muted-foreground">
          {sourceData.map((s) => (
            <span key={s.source}>
              📊 {s.source}: {s.respostas} respostas
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceComparisonCard;
