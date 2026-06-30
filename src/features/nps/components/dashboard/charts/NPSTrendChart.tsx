import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SurveyResponse {
  created_at: string;
  nps_score: number | null;
}

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(222,47%,11%)",
  border: "1px solid hsl(217,33%,25%)",
  borderRadius: 10,
  color: "#e1e1e1",
  padding: "10px 14px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const NPSTrendChart = ({ data }: { data: SurveyResponse[] }) => {
  const trendData = useMemo(() => {
    const scored = data.filter((r) => r.nps_score !== null);
    if (!scored.length) return [];

    const byWeek: Record<
      string,
      { promoters: number; detractors: number; total: number }
    > = {};

    scored.forEach((r) => {
      const d = new Date(r.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);

      if (!byWeek[key]) byWeek[key] = { promoters: 0, detractors: 0, total: 0 };
      byWeek[key].total++;
      if (r.nps_score! >= 9) byWeek[key].promoters++;
      if (r.nps_score! <= 6) byWeek[key].detractors++;
    });

    return Object.entries(byWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, { promoters, detractors, total }]) => ({
        week: new Date(week).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        nps: Math.round(((promoters - detractors) / total) * 100),
      }));
  }, [data]);

  if (trendData.length < 2) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold">
          Evolução do NPS (semanal)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
            <XAxis dataKey="week" stroke="hsl(215,20%,55%)" fontSize={12} />
            <YAxis
              stroke="hsl(215,20%,55%)"
              fontSize={12}
              domain={[-100, 100]}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: "#e1e1e1" }}
              labelStyle={{ color: "#e1e1e1" }}
              formatter={(value: number) => [`${value}`, "NPS"]}
            />
            <Line
              type="monotone"
              dataKey="nps"
              stroke="hsl(38,50%,50%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(38,50%,50%)", r: 4 }}
              activeDot={{ r: 6, fill: "hsl(38,60%,60%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NPSTrendChart;
