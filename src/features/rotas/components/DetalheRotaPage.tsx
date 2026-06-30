import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  ArrowLeft,
  Play,
  StopCircle,
  Navigation,
  MapPin,
  Clock,
  Route,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";
import { useRotaComClientes } from "../hooks/useRotas";
import { useAtualizarRota } from "../hooks/useRotas";
import { ClienteRotaCard } from "./ClienteRotaCard";
import { FormularioPosVisita } from "./FormularioPosVisita";
import { getCurrentPosition } from "../lib/geolocation";
import {
  ROTA_STATUS_LABEL,
  ROTA_STATUS_COLOR,
  ROTA_TIPO_LABEL,
} from "../types";
import type { RotaCliente } from "../types";
import { formatDate } from "~/features/crm/lib/comercial";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

export function DetalheRotaPage({ id }: Props) {
  const navigate = useNavigate();
  const { data: rota, isLoading } = useRotaComClientes(id);
  const atualizarRota = useAtualizarRota();

  const [showFinalizarVisita, setShowFinalizarVisita] = useState<string | null>(null);
  const [showCancelarRota, setShowCancelarRota] = useState(false);

  const handleIniciarRota = useCallback(async () => {
    try {
      const posicao = await getCurrentPosition();
      await atualizarRota.mutateAsync({
        id,
        updates: {
          status: "em_execucao",
          data_inicio: new Date().toISOString(),
          local_inicio: posicao,
        },
      });
      toast.success("Rota iniciada!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [id, atualizarRota]);

  const handleFinalizarRota = useCallback(async () => {
    try {
      const posicao = await getCurrentPosition();
      const clientes = rota?.clientes ?? [];
      const visitados = clientes.filter((c) => c.status === "visitado").length;

      await atualizarRota.mutateAsync({
        id,
        updates: {
          status: "realizada",
          data_fim: new Date().toISOString(),
          local_fim: posicao,
          total_visitas: visitados,
        },
      });
      toast.success("Rota finalizada!");
      navigate({ to: "/rotas" });
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [id, rota, atualizarRota, navigate]);

  const handleCancelarRota = useCallback(async () => {
    try {
      await atualizarRota.mutateAsync({
        id,
        updates: { status: "cancelada" },
      });
      toast.success("Rota cancelada");
      navigate({ to: "/rotas" });
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [id, atualizarRota, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!rota) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Rota não encontrada</p>
        <Button variant="ghost" onClick={() => navigate({ to: "/rotas" })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const clientes = rota.clientes ?? [];
  const todosVisitados = clientes.length > 0 && clientes.every((c) => c.status === "visitado");
  const podeFinalizarRota = rota.status === "em_execucao" && todosVisitados;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/rotas" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{rota.titulo}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatDate(rota.data_rota)}</span>
              <span>{ROTA_TIPO_LABEL[rota.tipo]}</span>
              <Badge className={ROTA_STATUS_COLOR[rota.status]}>
                {ROTA_STATUS_LABEL[rota.status]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {rota.status === "planejada" && (
            <Button onClick={handleIniciarRota} disabled={atualizarRota.isPending}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Rota
            </Button>
          )}
          {podeFinalizarRota && (
            <Button onClick={handleFinalizarRota} disabled={atualizarRota.isPending}>
              <StopCircle className="h-4 w-4 mr-2" />
              Finalizar Rota
            </Button>
          )}
          {rota.status === "planejada" && (
            <Button variant="destructive" onClick={() => setShowCancelarRota(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {rota.status === "em_execucao" && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {clientes.filter((c) => c.status === "visitado").length}
                </div>
                <div className="text-xs text-muted-foreground">Visitas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {clientes.filter((c) => c.status === "pendente").length}
                </div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {rota.total_km > 0 ? `${rota.total_km.toFixed(1)}km` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Percorrido</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {rota.valor_reembolso > 0
                    ? `R$ ${rota.valor_reembolso.toFixed(2)}`
                    : "—"}
                </div>
                <div className="text-xs text-muted-foreground">Reembolso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Clientes ({clientes.length})</h2>
        {clientes.length > 0 ? (
          clientes
            .sort((a, b) => a.ordem - b.ordem)
            .map((cliente) => (
              <ClienteRotaCard
                key={cliente.id}
                cliente={cliente}
                rotaStatus={rota.status}
                raioPermitido={300}
                onFinalizarVisita={() => setShowFinalizarVisita(cliente.id)}
              />
            ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Nenhum cliente nesta rota
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!showFinalizarVisita} onOpenChange={(o) => !o && setShowFinalizarVisita(null)}>
        <AlertDialogContent className="max-w-2xl">
          <FormularioPosVisita
            rotaClienteId={showFinalizarVisita!}
            onDone={() => setShowFinalizarVisita(null)}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelarRota} onOpenChange={setShowCancelarRota}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Rota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A rota será marcada como cancelada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelarRota}
              className="bg-destructive text-destructive-foreground"
            >
              Cancelar Rota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
