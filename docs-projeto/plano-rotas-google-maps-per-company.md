# Plano: Chave Google Maps por Empresa + Raio Personalizável

## Objetivo
- Admin de cada empresa configurar sua própria chave de API do Google Maps
- Chave **nunca exposta ao navegador** — proxy via Supabase Edge Function
- Admin poder personalizar `raio_permitido_metros`

## Arquitetura

```
Browser (React)           Supabase Edge Function (Deno)        Google Maps API
     │                              │                              │
     │── POST /calcular-distancia ──│                              │
     │   {empresa_id, origem, dest} │                              │
     │                              │── SELECT rotas_config ──────│
     │                              │   (busca google_maps_api_key)│
     │                              │                              │
     │                              │── GET distancematrix/json ──→│
     │                              │   ?key=CHAVE_SECRETA         │
     │                              │←───── {distance, duration} ──│
     │←──── {distance_km,          │                              │
     │       duracao_minutos} ──────│                              │
```

## Passos de Implementação

1. **Migration SQL** — Adicionar `google_maps_api_key TEXT` à `rotas_config`
2. **Types** — Adicionar campo na interface `RotasConfig`
3. **Edge Function** — Criar `supabase/functions/calcular-distancia/index.ts`
4. **Service client** — Criar `google-maps.service.ts` (chama Edge Function)
5. **Refatorar trajetos.service.ts** — Usar Edge Function + fallback Haversine
6. **Config UI** — Campo de texto para chave + raio no `ConfigRotasPage`
7. **DetalheRotaPage** — Carregar `raio_permitido_metros` do config
8. **Remover env var** — Eliminar `VITE_GOOGLE_MAPS_API_KEY`

## Segurança
- Chave armazenada em `rotas_config` (criptografada em repouso pelo Supabase)
- Edge Function busca a chave no banco e faz a chamada HTTP server-side
- Browser só recebe o resultado (distância/duração), nunca a chave
- Fallback Haversine quando não há chave configurada
