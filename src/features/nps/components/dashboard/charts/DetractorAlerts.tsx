import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

interface SurveyResponse {
  id: string;
  created_at: string;
  nps_score: number | null;
  nps_comment: string;
  client_id: string | null;
  client_name?: string | null;
  source: string | null;
}

const DetractorAlerts = ({ data }: { data: SurveyResponse[] }) => {
  const detractors = useMemo(() => {
    return data
      .filter((r) => r.nps_score !== null && r.nps_score <= 6)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 8);
  }, [data]);

  if (!detractors.length) return null;

  return (
    <div className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border border-red-500/20 rounded-lg shadow-lg p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <h3 className="text-foreground text-sm font-semibold">
          Alertas — Detratores Recentes
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {detractors.length} mais recente{detractors.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {detractors.map((r) => (
          <div
            key={r.id}
            className="bg-red-500/5 border border-red-500/15 rounded-lg p-3 flex flex-col gap-2 min-h-[120px] hover:border-red-500/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 text-red-400 text-sm font-bold shrink-0">
                {r.nps_score}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate font-medium">
                  {r.client_name || r.client_id || "Cliente anônimo"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                  {r.source && ` · ${r.source}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-foreground/90 line-clamp-3 leading-snug flex-1">
              {r.nps_comment || (
                <span className="text-muted-foreground italic">
                  Sem comentário
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetractorAlerts;
