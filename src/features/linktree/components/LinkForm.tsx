import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { IconPicker } from "./IconPicker";
import type {
  EmpresaLinktreeLink,
  EmpresaLinktreeSection,
  EmpresaLinkInput,
} from "../types-empresa";

interface Props {
  sections: EmpresaLinktreeSection[];
  link?: EmpresaLinktreeLink | null;
  onSave: (input: EmpresaLinkInput, sectionId: string) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

export function LinkForm({ sections, link, onSave, onCancel, saving }: Props) {
  const [titulo, setTitulo] = useState(link?.titulo ?? "");
  const [url, setUrl] = useState(link?.url ?? "");
  const [icone, setIcone] = useState(link?.icone ?? "");
  const [destaque, setDestaque] = useState(link?.destaque ?? false);
  const [sectionId, setSectionId] = useState(
    link?.section_id ?? sections[0]?.id ?? "",
  );
  const [agendadoInicio, setAgendadoInicio] = useState(
    link?.agendado_inicio?.slice(0, 16) ?? "",
  );
  const [agendadoFim, setAgendadoFim] = useState(
    link?.agendado_fim?.slice(0, 16) ?? "",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !url.trim() || !sectionId) return;

    const input: EmpresaLinkInput = {
      titulo: titulo.trim(),
      url: url.trim(),
      icone: icone || undefined,
      destaque,
      agendado_inicio: agendadoInicio || null,
      agendado_fim: agendadoFim || null,
    };
    await onSave(input, sectionId);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Titulo *</Label>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Meu link"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>URL *</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label>Secao *</Label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-surface-hover px-2 text-sm"
          required
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.titulo}
            </option>
          ))}
        </select>
      </div>

      <IconPicker value={icone} onChange={setIcone} />

      <div className="flex items-center justify-between">
        <Label>Destaque</Label>
        <Switch checked={destaque} onCheckedChange={setDestaque} />
      </div>

      <div className="space-y-1.5">
        <Label>Agendamento (inicio)</Label>
        <Input
          type="datetime-local"
          value={agendadoInicio}
          onChange={(e) => setAgendadoInicio(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Agendamento (fim)</Label>
        <Input
          type="datetime-local"
          value={agendadoFim}
          onChange={(e) => setAgendadoFim(e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={saving || !titulo.trim() || !url.trim()}
          className="flex-1"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {link ? "Salvar" : "Adicionar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
