import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/lib/auth";
import { getDashboardStats } from "../services/tracking.service";

export function useDashboardStats(dataInicio?: string, dataFim?: string) {
  const { profile } = useAuth();
  const empresaId = profile?.empresa_id;
  return useQuery({
    queryKey: ["gerador-links-dashboard", empresaId, dataInicio, dataFim],
    queryFn: () => getDashboardStats(empresaId!, dataInicio, dataFim),
    enabled: !!empresaId,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
