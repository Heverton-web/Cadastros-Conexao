import type { EmpresaConfig } from "~/features/empresas";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Defaults for the expanded NPS survey theme (stored in config.theme.nps_survey) */
export const NPS_SURVEY_DEFAULTS: Record<string, string> = {
  survey_bg: "#09090b",
  survey_accent: "#C5A880",
  survey_accent_hover: "#b0946d",
  survey_glow: "#C5A880",
  card_bg: "rgba(24,24,27,0.5)",
  card_border: "#18181b",
  header_logo_text: "#fafafa",
  header_divider: "#27272a",
  step_text: "#71717a",
  question_text: "#fafafa",
  nps_btn_bg: "rgba(24,24,27,0.8)",
  nps_btn_text: "#71717a",
  nps_btn_hover_bg: "#3f3f46",
  nps_btn_hover_text: "#fafafa",
  nps_btn_selected_bg: "#C5A880",
  nps_btn_selected_text: "#09090b",
  option_bg: "rgba(9,9,11,0.3)",
  option_border: "#18181b",
  option_hover_border: "#52525b",
  option_selected_bg: "rgba(197,168,128,0.05)",
  option_selected_border: "#C5A880",
  option_text: "#71717a",
  option_text_selected: "#fafafa",
  option_hover_text: "#d4d4d8",
  radio_border: "#52525b",
  radio_hover_border: "#71717a",
  radio_selected: "#C5A880",
  input_bg: "rgba(9,9,11,0.5)",
  input_border: "#18181b",
  input_focus_border: "#C5A880",
  input_text: "#fafafa",
  input_placeholder: "#71717a",
  divider_footer: "rgba(24,24,27,0.8)",
  btn_back_text: "#71717a",
  btn_back_hover_bg: "#27272a",
  btn_next_bg: "#C5A880",
  btn_next_hover: "#b0946d",
  btn_next_text: "#09090b",
  complete_icon_bg: "rgba(197,168,128,0.1)",
  complete_icon_border: "rgba(197,168,128,0.2)",
  complete_icon_color: "#C5A880",
  complete_title: "#fafafa",
  complete_subtitle: "#71717a",
  modal_overlay: "rgba(0,0,0,0.6)",
  modal_bg: "#18181b",
  modal_border: "#3f3f46",
  modal_icon_bg: "rgba(234,179,8,0.1)",
  modal_icon_border: "rgba(234,179,8,0.2)",
  modal_icon_color: "#facc15",
  modal_title: "#fafafa",
  modal_subtitle: "#71717a",
  modal_btn_bg: "#C5A880",
  modal_btn_hover: "#b0946d",
  modal_btn_text: "#09090b",
  no_borders: "false",
};

export interface NpsColorDef {
  key: string;
  label: string;
}

export interface NpsColorGroup {
  group: string;
  label: string;
  colors: NpsColorDef[];
}

export const SURVEY_COLOR_GROUPS: NpsColorGroup[] = [
  {
    group: "bg-card",
    label: "Plano de Fundo e Card",
    colors: [
      { key: "survey_bg", label: "Fundo da página" },
      { key: "card_bg", label: "Fundo do card" },
      { key: "card_border", label: "Borda do card" },
      { key: "survey_glow", label: "Brilho do card" },
    ],
  },
  {
    group: "header",
    label: "Cabeçalho",
    colors: [
      { key: "header_logo_text", label: "Cor do nome da empresa" },
      { key: "header_divider", label: "Linha divisória" },
    ],
  },
  {
    group: "texts",
    label: "Textos",
    colors: [
      { key: "step_text", label: "Texto da etapa" },
      { key: "question_text", label: "Pergunta" },
    ],
  },
  {
    group: "nps-buttons",
    label: "Botões NPS (0–10)",
    colors: [
      { key: "nps_btn_bg", label: "Fundo normal" },
      { key: "nps_btn_text", label: "Texto normal" },
      { key: "nps_btn_hover_bg", label: "Fundo ao passar mouse" },
      { key: "nps_btn_hover_text", label: "Texto ao passar mouse" },
      { key: "nps_btn_selected_bg", label: "Fundo selecionado" },
      { key: "nps_btn_selected_text", label: "Texto selecionado" },
    ],
  },
  {
    group: "options",
    label: "Opções (Escolha Única / Múltipla)",
    colors: [
      { key: "option_bg", label: "Fundo normal" },
      { key: "option_border", label: "Borda normal" },
      { key: "option_hover_border", label: "Borda ao passar mouse" },
      { key: "option_selected_bg", label: "Fundo selecionado" },
      { key: "option_selected_border", label: "Borda selecionado" },
      { key: "option_text", label: "Texto normal" },
      { key: "option_text_selected", label: "Texto selecionado" },
      { key: "option_hover_text", label: "Texto ao passar mouse" },
      { key: "radio_border", label: "Borda rádio/checkbox" },
      { key: "radio_hover_border", label: "Borda rádio ao passar mouse" },
      { key: "radio_selected", label: "Rádio/checkbox selecionado" },
    ],
  },
  {
    group: "input",
    label: "Campo de Texto",
    colors: [
      { key: "input_bg", label: "Fundo" },
      { key: "input_border", label: "Borda" },
      { key: "input_focus_border", label: "Borda em foco" },
      { key: "input_text", label: "Texto" },
      { key: "input_placeholder", label: "Placeholder" },
    ],
  },
  {
    group: "footer",
    label: "Rodapé e Navegação",
    colors: [
      { key: "divider_footer", label: "Linha divisória" },
      { key: "btn_back_text", label: "Texto botão Voltar" },
      { key: "btn_back_hover_bg", label: "Fundo Voltar (hover)" },
      { key: "btn_next_bg", label: "Fundo Próximo/Finalizar" },
      { key: "btn_next_hover", label: "Fundo Próximo (hover)" },
      { key: "btn_next_text", label: "Texto Próximo/Finalizar" },
    ],
  },
  {
    group: "completion",
    label: "Tela de Conclusão",
    colors: [
      { key: "complete_icon_bg", label: "Fundo do ícone" },
      { key: "complete_icon_border", label: "Borda do ícone" },
      { key: "complete_icon_color", label: "Cor do ícone" },
      { key: "complete_title", label: "Título (Obrigado!)" },
      { key: "complete_subtitle", label: "Subtítulo" },
    ],
  },
  {
    group: "modal",
    label: "Modal de Alerta",
    colors: [
      { key: "modal_overlay", label: "Overlay" },
      { key: "modal_bg", label: "Fundo do modal" },
      { key: "modal_border", label: "Borda do modal" },
      { key: "modal_icon_bg", label: "Fundo do ícone" },
      { key: "modal_icon_border", label: "Borda do ícone" },
      { key: "modal_icon_color", label: "Cor do ícone" },
      { key: "modal_title", label: "Título" },
      { key: "modal_subtitle", label: "Subtítulo" },
      { key: "modal_btn_bg", label: "Fundo do botão" },
      { key: "modal_btn_hover", label: "Fundo do botão (hover)" },
      { key: "modal_btn_text", label: "Texto do botão" },
    ],
  },
];

/** Reads no_borders flag from empresa config */
export function getNpsNoBorders(config: EmpresaConfig | null): boolean {
  const survey = (config?.theme?.nps_survey ?? {}) as Record<string, string>;
  return survey.no_borders === "true";
}

/** Returns CSS vars for NPS survey pages — old keys (backward compat) + expanded survey keys */
export function getNpsThemeVars(config: EmpresaConfig | null): Record<string, string> {
  const t = config?.theme ?? {};
  const survey = (t.nps_survey ?? {}) as Record<string, string>;

  const s = (key: string, fallbackRootKey?: string) =>
    survey[key] ?? (fallbackRootKey ? (t[fallbackRootKey] as string) : undefined) ?? NPS_SURVEY_DEFAULTS[key] ?? "";

  const accent = s("survey_accent", "accent");
  const accentHover = s("survey_accent_hover", "accent_hover");
  const npsBg = s("survey_bg", "nps_bg");
  const npsSurface = s("card_border", "nps_surface");
  const npsText = s("question_text", "nps_text");
  const npsTextMuted = s("step_text", "nps_text_muted");

  const surveyVars: Record<string, string> = {};
  for (const key of Object.keys(NPS_SURVEY_DEFAULTS)) {
    surveyVars[`--nps-${key}`] = s(key);
  }

  return {
    "--nps-accent": accent,
    "--nps-accent-hover": accentHover,
    "--nps-bg": npsBg,
    "--nps-surface": npsSurface,
    "--nps-text": npsText,
    "--nps-text-muted": npsTextMuted,
    "--nps-accent-10": hexToRgba(accent, 0.1),
    "--nps-accent-20": hexToRgba(accent, 0.2),
    "--nps-accent-5": hexToRgba(accent, 0.05),
    "--nps-surface-50": hexToRgba(npsSurface, 0.5),
    "--nps-bg-50": hexToRgba(npsBg, 0.5),
    ...surveyVars,
  };
}
