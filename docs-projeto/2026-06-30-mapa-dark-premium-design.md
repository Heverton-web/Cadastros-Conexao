# Mapa de Presença — Dark Premium

**Data:** 2026-06-30
**Status:** Aprovado
**Branch:** `feature/mapa-dark-premium`

---

## 1. Paleta de Cores (globals.css)

```css
:root {
  --state-exclusive: #d4a843;
  --state-nonexclusive: #b8944a;
  --state-empty: #0f1724;
  --map-stroke: #1e2d45;
  --map-stroke-selected: #f0d080;
  --state-glow: drop-shadow(0 0 8px rgba(212, 168, 67, 0.5));
  --grad-exclusive-1: #d4a843;
  --grad-exclusive-2: #b8862e;
  --grad-partial-1: #b8944a;
  --grad-partial-2: #9a7a3a;
  --heat-1: #0f1724;
  --heat-2: #1a3a6a;
  --heat-3: #2563a0;
  --heat-4: #3b82f6;
  --heat-5: #60a5fa;
}
```

## 2. BrazilMap.tsx

- Gradientes via `<defs>` SVG com `linearGradient`
- Tooltip flutuante (div) com glassmorphism + Lucide icons
- Pins customizados SVG (formato gota) com cluster
- Animação de entrada em cascata (fade-in + translateY)
- Glow no estado selecionado via filter

## 3. PublicMapShell.tsx

- Header com stats por região (N/NE/CO/SE/S)
- Legenda contextual que muda conforme o modo
- Filtro por região com botões
- Accordion com borda esquerda colorida + barra de densidade

## 4. StateDetailSheet.tsx

- Abas Distribuidores/Consultores com badge de contagem
- Campo de busca com filtro em tempo real
- Grid de cards com borda esquerda colorida
- Drawer mode no mobile (< 640px)

## 5. EntityDetailDialog.tsx

- Avatar circular 48px com ícone Lucide + cor do pin
- Grid 2 colunas para informações
- Botões "Ver no mapa" e "Abrir rota"
