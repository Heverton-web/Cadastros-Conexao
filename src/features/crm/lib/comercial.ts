export type Temperatura = "Frio" | "Morno" | "Quente";

export function sugerirTemperatura({
  gerou_pedido,
  gerou_orcamento,
  interesse_escala,
}: {
  gerou_pedido: boolean;
  gerou_orcamento: boolean;
  interesse_escala: number;
}): Temperatura {
  if (gerou_pedido || interesse_escala >= 4) return "Quente";
  if (gerou_orcamento || interesse_escala === 3) return "Morno";
  return "Frio";
}

export function formatBRL(value: number | null | undefined) {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date + (date.length === 10 ? "T00:00:00" : "")).toLocaleDateString("pt-BR");
}
