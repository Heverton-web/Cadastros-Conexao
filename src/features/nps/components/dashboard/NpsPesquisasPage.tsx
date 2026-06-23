import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, ListChecks } from "lucide-react";
import { supabase } from "~/core/supabase";
import { toast } from "react-hot-toast";
import type { NpsPergunta, SurveyQuestionType } from "../../types";
import { useAuth } from "~/lib/auth";
import { Badge } from "~/components/ui/badge";

const TYPE_LABELS: Record<SurveyQuestionType, string> = {
  nps: "NPS (0-10)",
  single_choice: "Escolha única",
  multi_choice: "Escolha múltipla",
  text: "Texto livre",
  matrix: "Matriz (1-5)",
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);

const emptyDraft = (): Partial<NpsPergunta> => ({
  key: "", type: "single_choice", question_text: "", options: [],
  required: true, active: true, is_system: false, order_index: 0,
});

function Toggle({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function NpsPesquisasPage() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<NpsPergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NpsPergunta> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [optionInput, setOptionInput] = useState("");

  if (profile && !profile.is_super_admin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Acesso Negado</h2>
        <p className="text-muted-foreground mt-2">Você não tem permissão para gerenciar as pesquisas.</p>
      </div>
    );
  }

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("nps_perguntas")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) toast.error("Erro ao carregar perguntas");
    setQuestions((data as NpsPergunta[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleActive = async (q: NpsPergunta) => {
    const { error } = await supabase
      .from("nps_perguntas")
      .update({ active: !q.active, updated_at: new Date().toISOString() })
      .eq("id", q.id);
    if (error) toast.error("Erro ao alterar status");
    else fetchAll();
  };

  const move = async (q: NpsPergunta, dir: -1 | 1) => {
    const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((x) => x.id === q.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await supabase.from("nps_perguntas").update({ order_index: swap.order_index }).eq("id", q.id);
    await supabase.from("nps_perguntas").update({ order_index: q.order_index }).eq("id", swap.id);
    fetchAll();
  };

  const remove = async (q: NpsPergunta) => {
    if (q.is_system) { toast.error("Perguntas do sistema não podem ser excluídas"); return; }
    if (!window.confirm(`Excluir "${q.question_text}"?`)) return;
    const { error } = await supabase.from("nps_perguntas").delete().eq("id", q.id);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("Pergunta excluída"); fetchAll(); }
  };

  const openNew = () => {
    const maxOrder = Math.max(0, ...questions.map((q) => q.order_index));
    setEditing({ ...emptyDraft(), order_index: maxOrder + 1 });
    setIsNew(true);
  };

  const openEdit = (q: NpsPergunta) => { setEditing({ ...q }); setIsNew(false); };
  const close = () => { setEditing(null); setOptionInput(""); };

  const addOption = () => {
    const v = optionInput.trim();
    if (!v) return;
    setEditing((e) => e ? { ...e, options: [...(e.options || []), v] } : e);
    setOptionInput("");
  };

  const removeOption = (i: number) => {
    setEditing((e) => e ? { ...e, options: (e.options || []).filter((_, idx) => idx !== i) } : e);
  };

  const save = async () => {
    if (!editing) return;
    const text = (editing.question_text || "").trim();
    if (!text) { toast.error("Texto da pergunta é obrigatório"); return; }
    const type = editing.type as SurveyQuestionType;
    const needsOptions = type === "single_choice" || type === "multi_choice" || type === "matrix";
    const opts = editing.options || [];
    if (needsOptions && opts.length < 2) { toast.error("Adicione ao menos 2 opções"); return; }

    const payload: any = {
      question_text: text, type,
      options: needsOptions ? opts : [],
      required: !!editing.required, active: !!editing.active,
      order_index: editing.order_index ?? 0,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      payload.key = (editing.key || slugify(text)) || `q_${Date.now()}`;
      payload.is_system = false;
      const { error } = await supabase.from("nps_perguntas").insert(payload);
      if (error) { toast.error("Erro ao criar"); return; }
      toast.success("Pergunta criada!");
    } else {
      const { error } = await supabase.from("nps_perguntas").update(payload).eq("id", editing.id!);
      if (error) { toast.error("Erro ao salvar"); return; }
      toast.success("Pergunta atualizada!");
    }
    close();
    fetchAll();
  };

  const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
  const needsOptions = editing?.type === "single_choice" || editing?.type === "multi_choice" || editing?.type === "matrix";

  return (
    <div className="flex flex-col gap-6 p-4 pb-24 lg:p-8 lg:pb-8">
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-card-foreground flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" /> Perguntas da Pesquisa
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <a href="/nps-survey" target="_blank" rel="noopener noreferrer">Ver Pesquisa do Cliente</a>
            </Button>
            <Button onClick={openNew} size="sm" className="gap-1.5 shadow-md shadow-primary/20"><Plus className="w-4 h-4" /> Nova pergunta</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
          {!loading && sorted.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma pergunta cadastrada.</p>}
          {sorted.map((q, idx) => (
            <div key={q.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${q.active ? "bg-card border-border" : "bg-muted/30 border-border/40 opacity-70"}`}>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => move(q, -1)} disabled={idx === 0} className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => move(q, 1)} disabled={idx === sorted.length - 1} className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-medium text-primary">#{idx + 1}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{TYPE_LABELS[q.type]}</Badge>
                  {q.is_system && <Badge variant="outline" className="text-muted-foreground border-border/50">Sistema</Badge>}
                  {!q.required && <Badge variant="outline" className="text-muted-foreground border-border/50">Opcional</Badge>}
                  <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground/70 bg-transparent border-dashed">key: {q.key}</Badge>
                </div>
                <p className="text-base font-medium text-foreground mt-2 truncate">{q.question_text}</p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle checked={q.active} onCheckedChange={() => toggleActive(q)} />
                <Button variant="ghost" size="sm" onClick={() => openEdit(q)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => remove(q)} disabled={q.is_system}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{isNew ? "Nova pergunta" : "Editar pergunta"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v as SurveyQuestionType })} disabled={editing.is_system}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Texto da pergunta</Label>
                <textarea
                  value={editing.question_text || ""}
                  onChange={(e) => setEditing({ ...editing, question_text: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              {isNew && (
                <div>
                  <Label className="text-xs text-muted-foreground">Identificador (key)</Label>
                  <Input value={editing.key || ""} onChange={(e) => setEditing({ ...editing, key: slugify(e.target.value) })} placeholder={slugify(editing.question_text || "")} className="font-mono text-xs" />
                </div>
              )}
              {needsOptions && (
                <div>
                  <Label className="text-xs text-muted-foreground">{editing.type === "matrix" ? "Itens da matriz" : "Opções"}</Label>
                  <div className="flex gap-2 mb-2">
                    <Input value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }} placeholder="Digite e pressione Enter" />
                    <Button type="button" onClick={addOption} variant="secondary" size="sm">Adicionar</Button>
                  </div>
                  <div className="space-y-1.5">
                    {(editing.options || []).map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-md px-3 py-2">
                        <span className="text-sm flex-1">{opt}</span>
                        <button onClick={() => removeOption(i)} className="text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Toggle checked={!!editing.required} onCheckedChange={(v) => setEditing({ ...editing, required: v })} />
                  <Label className="text-sm cursor-pointer">Obrigatória</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                  <Label className="text-sm cursor-pointer">Ativa</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
