export type MarketingPixel = {
  id: string;
  empresa_id: string;
  nome: string;
  pixel_id: string;
  tipo: "meta" | "google" | "tiktok" | "custom";
  ativo: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type MarketingPixelInput = {
  nome: string;
  pixel_id: string;
  tipo: MarketingPixel["tipo"];
  ativo?: boolean;
  config?: Record<string, unknown>;
};
