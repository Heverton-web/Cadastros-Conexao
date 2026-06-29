import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import type { EmpresaLinktreeTheme } from "../types-empresa";

const BG_MODES = [
  { value: "solid" as const, label: "Solido" },
  { value: "gradient2" as const, label: "Gradiente 2 cores" },
  { value: "gradient3" as const, label: "Gradiente 3 cores" },
];

const BUTTON_STYLES = [
  { value: "rounded" as const, label: "Arredondado" },
  { value: "square" as const, label: "Quadrado" },
  { value: "pill" as const, label: "Pill" },
];

const FONT_OPTIONS = ["Inter", "Outfit", "Playfair Display", "Georgia", "system-ui", "Helvetica"];

interface Props {
  theme: EmpresaLinktreeTheme;
  onChange: (theme: EmpresaLinktreeTheme) => void;
}

export function ThemePanel({ theme, onChange }: Props) {
  function patchBg<K extends keyof EmpresaLinktreeTheme["background"]>(key: K, value: EmpresaLinktreeTheme["background"][K]) {
    onChange({ ...theme, background: { ...theme.background, [key]: value } });
  }

  function patchBtn<K extends keyof EmpresaLinktreeTheme["buttons"]>(key: K, value: EmpresaLinktreeTheme["buttons"][K]) {
    onChange({ ...theme, buttons: { ...theme.buttons, [key]: value } });
  }

  function patchTypo<K extends keyof EmpresaLinktreeTheme["typography"]>(key: K, value: EmpresaLinktreeTheme["typography"][K]) {
    onChange({ ...theme, typography: { ...theme.typography, [key]: value } });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Fundo</Label>
        <div className="flex flex-wrap gap-2">
          {BG_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => patchBg("mode", m.value)}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                theme.background.mode === m.value
                  ? "border-primary bg-primary/10 text-text-main"
                  : "border-border text-muted-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {theme.background.mode === "solid" && (
          <ColorRow label="Cor" value={theme.background.solid} onChange={(v) => patchBg("solid", v)} />
        )}
        {theme.background.mode === "gradient2" && (
          <>
            <ColorRow label="Cor 1" value={theme.background.gradientFrom} onChange={(v) => patchBg("gradientFrom", v)} />
            <ColorRow label="Cor 2" value={theme.background.gradientTo} onChange={(v) => patchBg("gradientTo", v)} />
            <RangeRow label="Angulo" value={theme.background.gradientAngle} onChange={(v) => patchBg("gradientAngle", v)} />
          </>
        )}
        {theme.background.mode === "gradient3" && (
          <>
            <ColorRow label="Cor 1" value={theme.background.gradient3From} onChange={(v) => patchBg("gradient3From", v)} />
            <ColorRow label="Cor central" value={theme.background.gradient3Mid} onChange={(v) => patchBg("gradient3Mid", v)} />
            <ColorRow label="Cor 3" value={theme.background.gradient3To} onChange={(v) => patchBg("gradient3To", v)} />
            <RangeRow label="Angulo" value={theme.background.gradient3Angle} onChange={(v) => patchBg("gradient3Angle", v)} />
          </>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Botoes</Label>
        <div className="flex flex-wrap gap-2">
          {BUTTON_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => patchBtn("style", s.value)}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                theme.buttons.style === s.value
                  ? "border-primary bg-primary/10 text-text-main"
                  : "border-border text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <ColorRow label="Cor de fundo" value={theme.buttons.bgColor} onChange={(v) => patchBtn("bgColor", v)} />
        <ColorRow label="Cor do texto" value={theme.buttons.textColor} onChange={(v) => patchBtn("textColor", v)} />
        <RangeRow label="Border radius" value={theme.buttons.borderRadius} onChange={(v) => patchBtn("borderRadius", v)} min={0} max={32} />
        <div className="flex items-center justify-between">
          <Label>Sombra</Label>
          <Switch checked={theme.buttons.shadow} onCheckedChange={(v) => patchBtn("shadow", v)} />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Tipografia</Label>
        <div className="space-y-1.5">
          <Label className="text-xs">Fonte</Label>
          <select
            value={theme.typography.font}
            onChange={(e) => patchTypo("font", e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-surface-hover px-2 text-sm"
          >
            {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <ColorRow label="Cor do titulo" value={theme.typography.titleColor} onChange={(v) => patchTypo("titleColor", v)} />
        <ColorRow label="Cor da bio" value={theme.typography.bioColor} onChange={(v) => patchTypo("bioColor", v)} />
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </div>
  );
}

function RangeRow({ label, value, onChange, min = 0, max = 360 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}: {value}</Label>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}
