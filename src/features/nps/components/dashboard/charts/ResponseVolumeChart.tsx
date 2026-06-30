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

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(222,47%,11%)",
  border: "1px solid hsl(217,33%,25%)",
  borderRadius: 10,
  color: "#e1e1e1",
  padding: "10px 14px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
};

const ResponseVolumeChart = ({ data }: { data: { created_at: string }[] }) => {
  const volumeData = useMemo(() => {
    const byDay: Record<string, number> = {};
    data.forEach((r) => {
      const day = new Date(r.created_at).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([day, count]) => ({
        day: new Date(day).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        count,
      }));
  }, [data]);

  if (volumeData.length < 2) return null;

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground text-base font-semibold">
          Volume de Respostas (últimos 30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,20%)" />
            <XAxis
              dataKey="day"
              stroke="hsl(215,20%,55%)"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              stroke="hsl(215,20%,55%)"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: "#e1e1e1" }}
              labelStyle={{ color: "#e1e1e1" }}
              formatter={(value: number) => [`${value} resposta(s)`, "Volume"]}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              fill="hsl(210,50%,55%)"
              fillOpacity={0.6}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResponseVolumeChart;
