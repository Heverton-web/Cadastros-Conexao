import { supabase } from "~/core/supabase";
import type { RotaTrajeto, RotaVisita } from "../types";

// Haversine formula for distance calculation (fallback)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate distance between two points
export async function calcularDistancia(
  origem: { lat: number; lng: number },
  destino: { lat: number; lng: number }
): Promise<{ distancia_km: number; duracao_minutos: number }> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origem.lat},${origem.lng}&destinations=${destino.lat},${destino.lng}&key=${apiKey}&mode=driving`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.rows?.[0]?.elements?.[0]?.status === "OK") {
        const element = data.rows[0].elements[0];
        return {
          distancia_km: Math.round((element.distance.value / 1000) * 100) / 100,
          duracao_minutos: Math.round(element.duration.value / 60),
        };
      }
    } catch (err) {
      console.warn("[trajetos] Erro ao usar Google Distance Matrix, usando Haversine:", err);
    }
  }

  // Fallback: Haversine
  const distancia = haversineDistance(origem.lat, origem.lng, destino.lat, destino.lng);
  const duracaoMinutos = Math.round((distancia / 40) * 60); // Assume 40km/h average

  return {
    distancia_km: Math.round(distancia * 100) / 100,
    duracao_minutos: duracaoMinutos,
  };
}

export async function criarTrajeto(trajeto: Omit<RotaTrajeto, "id" | "created_at">): Promise<RotaTrajeto> {
  const { data, error } = await supabase
    .from("rotas_trajetos")
    .insert(trajeto)
    .select()
    .single();
  if (error) throw error;
  return data as RotaTrajeto;
}

export async function atualizarTrajeto(id: string, updates: Partial<RotaTrajeto>): Promise<RotaTrajeto> {
  const { data, error } = await supabase
    .from("rotas_trajetos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as RotaTrajeto;
}

export async function buscarTrajetoPorCliente(rotaClienteId: string): Promise<RotaTrajeto | null> {
  const { data, error } = await supabase
    .from("rotas_trajetos")
    .select("*")
    .eq("rota_cliente_id", rotaClienteId)
    .maybeSingle();
  if (error) throw error;
  return data as RotaTrajeto | null;
}

export async function criarVisita(visita: Omit<RotaVisita, "id" | "created_at">): Promise<RotaVisita> {
  const { data, error } = await supabase
    .from("rotas_visitas")
    .insert(visita)
    .select()
    .single();
  if (error) throw error;
  return data as RotaVisita;
}

export async function atualizarVisita(id: string, updates: Partial<RotaVisita>): Promise<RotaVisita> {
  const { data, error } = await supabase
    .from("rotas_visitas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as RotaVisita;
}

export async function buscarVisitaPorCliente(rotaClienteId: string): Promise<RotaVisita | null> {
  const { data, error } = await supabase
    .from("rotas_visitas")
    .select("*")
    .eq("rota_cliente_id", rotaClienteId)
    .maybeSingle();
  if (error) throw error;
  return data as RotaVisita | null;
}

export async function calcularEstatisticasRota(rotaId: string): Promise<{
  total_visitas: number;
  total_km: number;
  total_tempo_trajeto_min: number;
  valor_reembolso: number;
}> {
  const { data: trajetos } = await supabase
    .from("rotas_trajetos")
    .select("distancia_km, duracao_minutos, valor_reembolso")
    .eq("rota_id", rotaId);

  const { data: visitas } = await supabase
    .from("rotas_visitas")
    .select("id")
    .eq("rota_id", rotaId);

  const total_km = (trajetos ?? []).reduce((sum, t) => sum + (t.distancia_km ?? 0), 0);
  const total_tempo_trajeto_min = (trajetos ?? []).reduce((sum, t) => sum + (t.duracao_minutos ?? 0), 0);
  const valor_reembolso = (trajetos ?? []).reduce((sum, t) => sum + (t.valor_reembolso ?? 0), 0);

  return {
    total_visitas: visitas?.length ?? 0,
    total_km: Math.round(total_km * 100) / 100,
    total_tempo_trajeto_min,
    valor_reembolso: Math.round(valor_reembolso * 100) / 100,
  };
}
