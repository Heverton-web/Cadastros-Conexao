import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Settings, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useFunil } from "../hooks/useFunisData";
import { KanbanView } from "./KanbanView";
import { ShareModal } from "./ShareModal";

export function FunilDetallePage() {
  const { funilId } = useParams();
  const navigate = useNavigate();
  const { data: funil, isLoading } = useFunil(funilId);
  const [showShare, setShowShare] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-center text-text-muted">Carregando...</div>;
  }

  if (!funil) {
    return <div className="p-6 text-center text-text-muted">Funil nao encontrado</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/funis/dashboard" })}
            className="text-text-muted hover:text-text-main"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text-main">{funil.titulo}</h1>
            {funil.descricao && (
              <p className="text-xs text-text-muted">{funil.descricao}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowShare(true)} variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanView funil={funil} />
      </div>

      {showShare && (
        <ShareModal funilId={funilId} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
