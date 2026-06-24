import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { supabase } from "~/core/supabase";
import { compressImage } from "~/features/linktree/lib/image-utils";
import type { LinktreeColaborador } from "~/features/linktree/types";
import {
  decodeTelefone,
  encodePhone,
  encodeTelefone,
  type PhoneParts,
  type TelefoneKind,
} from "~/features/linktree/types";

const schema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatorio").max(120),
  cargo: z.string().trim().min(2, "Cargo obrigatorio").max(120),
  email: z.string().trim().email("E-mail invalido").max(255),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  collaborator: LinktreeColaborador | null;
  onSaved: () => void;
}

const EMPTY_PHONE: PhoneParts = { ddi: "55", ddd: "", number: "" };

export function LinktreeColaboradorModal({ open, onOpenChange, collaborator, onSaved }: Props) {
  const editing = !!collaborator;
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<string | null>("");
  const [whats, setWhats] = useState<PhoneParts>(EMPTY_PHONE);
  const [telKind, setTelKind] = useState<TelefoneKind>("fixo");
  const [telFixo, setTelFixo] = useState<PhoneParts>(EMPTY_PHONE);
  const [ramal, setRamal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNome(collaborator?.nome ?? "");
    setCargo(collaborator?.cargo ?? "");
    setEmail(collaborator?.email ?? "");
    setFoto(collaborator?.foto_url ?? "");
    const w = decodeTelefone(null);
    const decoded = collaborator?.whatsapp ? (() => {
      const parts = collaborator.whatsapp.replace(/\D/g, "");
      return { ddi: parts.slice(0, 2) || "55", ddd: parts.slice(2, 4), number: parts.slice(4) };
    })() : EMPTY_PHONE;
    setWhats(decoded);
    const t = decodeTelefone(collaborator?.telefone_fixo ?? "");
    setTelKind(t.kind);
    setTelFixo({ ddi: t.phone.ddi || "55", ddd: t.phone.ddd, number: t.phone.number });
    setRamal(t.ramal);
  }, [open, collaborator]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Imagem muito grande (max 8MB)");
      return;
    }
    try {
      setFoto(await compressImage(f, 480, 0.82));
    } catch {
      toast.error("Falha ao processar imagem");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ nome, cargo, email });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    if (!whats.ddd || !whats.number) {
      toast.error("Informe DDD e numero do WhatsApp");
      return;
    }
    if (telKind === "ramal" && !ramal) {
      toast.error("Informe o ramal");
      return;
    }
    setSaving(true);
    const payload = {
      ...parsed.data,
      whatsapp: encodePhone(whats),
      telefone_fixo: encodeTelefone({ kind: telKind, phone: telFixo, ramal }) || null,
      foto_url: foto || null,
    };
    const { error } = editing
      ? await supabase.from("linktree_colaboradores").update(payload).eq("id", collaborator!.id)
      : await supabase.from("linktree_colaboradores").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(`Nao foi possivel salvar: ${error.message}`);
      return;
    }
    toast.success(editing ? "Colaborador atualizado" : "Link Tree gerado com sucesso");
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editing ? "Editar colaborador" : "Novo colaborador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-border bg-surface-hover">
              {foto ? (
                <img src={foto} alt="Preview" className="size-full object-cover" />
              ) : (
                <Upload className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Label className="mb-1 block">Foto</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-surface-hover file:px-3 file:py-2 file:text-sm file:text-text-main file:cursor-pointer"
              />
              <p className="mt-1 text-xs text-muted-foreground">JPG/PNG ate 8MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Nome completo">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Field>
            <Field label="Cargo">
              <Input value={cargo} onChange={(e) => setCargo(e.target.value)} required />
            </Field>
            <div className="sm:col-span-2">
              <Field label="E-mail institucional">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border p-3">
            <Label className="text-sm font-semibold">WhatsApp</Label>
            <PhoneFields value={whats} onChange={setWhats} />
          </div>

          <div className="space-y-3 rounded-xl border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-sm font-semibold">Telefone</Label>
              <div className="inline-flex rounded-lg bg-surface-hover p-1">
                <KindBtn active={telKind === "fixo"} onClick={() => setTelKind("fixo")}>
                  Telefone fixo
                </KindBtn>
                <KindBtn active={telKind === "ramal"} onClick={() => setTelKind("ramal")}>
                  Ramal
                </KindBtn>
              </div>
            </div>
            {telKind === "fixo" ? (
              <PhoneFields value={telFixo} onChange={setTelFixo} />
            ) : (
              <Field label="Numero do ramal">
                <Input
                  inputMode="numeric"
                  placeholder="Ex: 1234"
                  value={ramal}
                  onChange={(e) => setRamal(e.target.value.replace(/\D/g, "").slice(0, 8))}
                />
              </Field>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? <Loader2 className="size-4 animate-spin" /> : editing ? "Salvar" : "Gerar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PhoneFields({ value, onChange }: { value: PhoneParts; onChange: (v: PhoneParts) => void }) {
  const set = (k: keyof PhoneParts, max: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value.replace(/\D/g, "").slice(0, max) });
  return (
    <div className="grid grid-cols-[80px_80px_1fr] gap-2">
      <Field label="DDI">
        <Input inputMode="numeric" placeholder="55" value={value.ddi} onChange={set("ddi", 4)} />
      </Field>
      <Field label="DDD">
        <Input inputMode="numeric" placeholder="11" value={value.ddd} onChange={set("ddd", 3)} />
      </Field>
      <Field label="Numero">
        <Input inputMode="numeric" placeholder="999999999" value={value.number} onChange={set("number", 9)} />
      </Field>
    </div>
  );
}

function KindBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-text-main"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
