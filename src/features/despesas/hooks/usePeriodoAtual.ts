import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { buscarPeriodoAtual } from "../services/periodos.service";

export function usePeriodoAtual(overrideEmpresaId?: string) {
  const { profile } = useAuth();
  const empresa_id = overrideEmpresaId || (profile?.empresa_id ?? "");

  return useQuery({
    queryKey: ["despesa-periodo-atual", empresa_id],
    queryFn: () => buscarPeriodoAtual(empresa_id),
    enabled: !!empresa_id,
  });
}
