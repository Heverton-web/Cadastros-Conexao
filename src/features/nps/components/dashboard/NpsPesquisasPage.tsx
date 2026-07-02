import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  ListChecks,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { EmptyState } from "~/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { supabase } from "~/core/supabase";
import { toast } from "react-hot-toast";
import type { NpsPergunta, SurveyQuestionType } from "../../types";
import { useAuth } from "~/lib/auth";
import { Badge } from "~/components/ui/badge";
import { listarEmpresas } from "~/shared/empresas";
import type { Empresa } from "~/core/empresa";

const TYPE_LABELS: Record<SurveyQuestionType, string> = {
  nps: "NPS (0-10)",
  single_choice: "Escolha única",
  multi_choice: "Escolha múltipla",
  text: "Texto livre",
  matrix: "Matriz (1-5)",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);

const emptyDraft = (): Partial<NpsPergunta> => ({
  key: "",
  type: "single_choice",
  question_text: "",
  options: [],
  required: true,
  active: true,
  is_system: false,
  order_index: 0,
});

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-accent shadow-md shadow-accent/20" : "bg-border"}`}
    >
      <span
        className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

export function NpsPesquisasPage() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<NpsPergunta[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NpsPergunta> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [optionInput, setOptionInput] = useState("");
  const [deletingQuestion, setDeletingQuestion] = useState<NpsPergunta | null>(
    null,
  );

  if (profile && !profile.is_super_admin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-text-main">Acesso Negado</h2>
        <p className="text-sm text-text-muted mt-2">
          Você não tem permissão para gerenciar as pesquisas.
        </p>
      </div>
    );
  }

  useEffect(() => {
    async function loadConfig() {
      try {
        const emps = await listarEmpresas();
        setEmpresas(emps);
        if (emps.length > 0) {
          const conexao = emps.find(
            (e) =>
              e.nome.toLowerCase().includes("conexão") ||
              e.nome.toLowerCase().includes("conexao"),
          );
          setSelectedEmpresaId(conexao ? conexao.id : emps[0].id);
        }
      } catch (err) {
        toast.error("Erro ao carregar empresas");
      }
    }
    loadConfig();
  }, []);

  const fetchAll = async (empId: string) => {
    if (!empId) return;
    setLoading(true);

    // MIGRATION TEMPORÁRIA: "atribua a pesquisa atual a empresa conexão"
    // Puxa as que estão nulas
    const { data: nulas } = await supabase
      .from("nps_perguntas")
      .select("id")
      .is("empresa_id", null);
    if (nulas && nulas.length > 0) {
      await supabase
        .from("nps_perguntas")
        .update({ empresa_id: empId })
        .is("empresa_id", null);
    }

    const { data, error } = await supabase
      .from("nps_perguntas")
      .select("*")
      .eq("empresa_id", empId)
      .order("order_index", { ascending: true });
    if (error) toast.error("Erro ao carregar perguntas");
    setQuestions((data as NpsPergunta[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedEmpresaId) {
      fetchAll(selectedEmpresaId);
    }
  }, [selectedEmpresaId]);

  const toggleActive = async (q: NpsPergunta) => {
    const { error } = await supabase
      .from("nps_perguntas")
      .update({ active: !q.active, updated_at: new Date().toISOString() })
      .eq("id", q.id);
    if (error) toast.error("Erro ao alterar status");
    else fetchAll(selectedEmpresaId);
  };

  const move = async (q: NpsPergunta, dir: -1 | 1) => {
    const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((x) => x.id === q.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await supabase
      .from("nps_perguntas")
      .update({ order_index: swap.order_index })
      .eq("id", q.id);
    await supabase
      .from("nps_perguntas")
      .update({ order_index: q.order_index })
      .eq("id", swap.id);
    fetchAll(selectedEmpresaId);
  };

  const remove = (q: NpsPergunta) => {
    if (q.is_system && !profile?.is_super_admin) {
      toast.error("Perguntas do sistema não podem ser excluídas");
      return;
    }
    setDeletingQuestion(q);
  };

  const confirmDelete = async () => {
    if (!deletingQuestion) return;
    const { error } = await supabase
      .from("nps_perguntas")
      .delete()
      .eq("id", deletingQuestion.id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Pergunta excluída");
      fetchAll(selectedEmpresaId);
    }
    setDeletingQuestion(null);
  };

  const openNew = () => {
    if (!selectedEmpresaId) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }
    const maxOrder = Math.max(0, ...questions.map((q) => q.order_index));
    setEditing({
      ...emptyDraft(),
      empresa_id: selectedEmpresaId,
      order_index: maxOrder + 1,
    });
    setIsNew(true);
  };

  const openEdit = (q: NpsPergunta) => {
    setEditing({ ...q });
    setIsNew(false);
  };
  const close = () => {
    setEditing(null);
    setOptionInput("");
  };

  const addOption = () => {
    const v = optionInput.trim();
    if (!v) return;
    setEditing((e) => (e ? { ...e, options: [...(e.options || []), v] } : e));
    setOptionInput("");
  };

  const removeOption = (i: number) => {
    setEditing((e) =>
      e
        ? { ...e, options: (e.options || []).filter((_, idx) => idx !== i) }
        : e,
    );
  };

  const save = async () => {
    if (!editing) return;
    const text = (editing.question_text || "").trim();
    if (!text) {
      toast.error("Texto da pergunta é obrigatório");
      return;
    }
    const type = editing.type as SurveyQuestionType;
    const needsOptions =
      type === "single_choice" || type === "multi_choice" || type === "matrix";
    const opts = editing.options || [];
    if (needsOptions && opts.length < 2) {
      toast.error("Adicione ao menos 2 opções");
      return;
    }

    const payload: any = {
      question_text: text,
      type,
      options: needsOptions ? opts : [],
      required: !!editing.required,
      active: !!editing.active,
      order_index: editing.order_index ?? 0,
      updated_at: new Date().toISOString(),
      empresa_id: selectedEmpresaId,
    };

    if (isNew) {
      payload.key = editing.key || slugify(text) || `q_${Date.now()}`;
      payload.is_system = false;
      const { error } = await supabase.from("nps_perguntas").insert(payload);
      if (error) {
        toast.error("Erro ao criar");
        return;
      }
      toast.success("Pergunta criada!");
    } else {
      const { error } = await supabase
        .from("nps_perguntas")
        .update(payload)
        .eq("id", editing.id!);
      if (error) {
        toast.error("Erro ao salvar");
        return;
      }
      toast.success("Pergunta atualizada!");
    }
    close();
    fetchAll(selectedEmpresaId);
  };

  const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
  const needsOptions =
    editing?.type === "single_choice" ||
    editing?.type === "multi_choice" ||
    editing?.type === "matrix";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0">
            <ListChecks className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight">
              Perguntas da Pesquisa
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Configure as perguntas enviadas nas pesquisas NPS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <Select
              value={selectedEmpresaId}
              onValueChange={(v) => setSelectedEmpresaId(v)}
            >
              <SelectTrigger className="h-12 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200">
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-xs">
                    {emp.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={openNew}
            size="sm"
            className="gap-1.5 shadow-md shadow-accent/20"
            disabled={!selectedEmpresaId}
          >
            <Plus className="w-4 h-4" /> Nova pergunta
          </Button>
        </div>
      </div>

      <div className="space-y-3">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          )}
          {!loading && sorted.length === 0 && (
            <EmptyState
              icon={<ListChecks className="w-10 h-10 text-text-muted/30" />}
              title="Nenhuma pergunta"
              description="Crie a primeira pergunta da pesquisa."
            />
          )}
          {sorted.map((q, idx) => (
            <div
              key={q.id}
              className={`group flex items-center gap-3 sm:gap-4 rounded-xl bg-surface border border-border p-3 sm:p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 ${!q.active ? "opacity-50" : ""}`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(q, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(q, 1)}
                  disabled={idx === sorted.length - 1}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-medium text-primary">
                    #{idx + 1}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    {TYPE_LABELS[q.type]}
                  </Badge>
                  {q.is_system && (
                    <Badge
                      variant="outline"
                      className="text-text-muted border-border/50"
                    >
                      Sistema
                    </Badge>
                  )}
                  {!q.required && (
                    <Badge
                      variant="outline"
                      className="text-text-muted border-border/50"
                    >
                      Opcional
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] text-text-muted/70 bg-transparent border-dashed"
                  >
                    key: {q.key}
                  </Badge>
                </div>
                <p className="text-base font-medium text-text-main mt-2 truncate">
                  {q.question_text}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <Toggle
                  checked={q.active}
                  onCheckedChange={() => toggleActive(q)}
                />
                <Button
                  variant="ghost-edit"
                  size="sm"
                  onClick={() => openEdit(q)}
                  className="hover:bg-accent/10"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost-destructive"
                  size="sm"
                  onClick={() => remove(q)}
                  disabled={q.is_system && !profile?.is_super_admin}
                  className="hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle>
              {isNew ? "Nova pergunta" : "Editar pergunta"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5 py-2">
              <div>
                <Label className="text-xs text-text-muted font-medium">Tipo</Label>
                <Select
                  value={editing.type}
                  onValueChange={(v) =>
                    setEditing({ ...editing, type: v as SurveyQuestionType })
                  }
                  disabled={editing.is_system && !profile?.is_super_admin}
                >
                  <SelectTrigger className="h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-text-muted font-medium">
                  Texto da pergunta
                </Label>
                <textarea
                  value={editing.question_text || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, question_text: e.target.value })
                  }
                  rows={3}
                  className="flex w-full rounded-xl border border-border bg-input-bg px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                />
              </div>
              {isNew && (
                <div>
                  <Label className="text-xs text-text-muted font-medium">
                    Identificador (key)
                  </Label>
                  <Input
                    value={editing.key || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, key: slugify(e.target.value) })
                    }
                    placeholder={slugify(editing.question_text || "")}
                    className="h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main font-mono placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                  />
                </div>
              )}
              {needsOptions && (
                <div>
                  <Label className="text-xs text-text-muted font-medium">
                    {editing.type === "matrix" ? "Itens da matriz" : "Opções"}
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addOption();
                        }
                      }}
                      placeholder="Digite e pressione Enter"
                      className="h-11 rounded-xl border border-border bg-input-bg px-4 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                    />
                    <Button
                      type="button"
                      onClick={addOption}
                      variant="secondary"
                      size="sm"
                      className="h-11 rounded-xl"
                    >
                      Adicionar
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {(editing.options || []).map((opt, i) => (
                      <div
                        key={i}
                        className="group/opt flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2.5 transition-all duration-200 hover:border-accent/30"
                      >
                        <span className="text-sm flex-1 text-text-main">{opt}</span>
                        <button
                          onClick={() => removeOption(i)}
                          className="text-text-muted hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 p-0.5 opacity-0 group-hover/opt:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={!!editing.required}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, required: v })
                    }
                  />
                  <Label className="text-sm cursor-pointer">Obrigatória</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={!!editing.active}
                    onCheckedChange={(v) =>
                      setEditing({ ...editing, active: v })
                    }
                  />
                  <Label className="text-sm cursor-pointer">Ativa</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 border-t border-border/30">
            <Button variant="secondary" onClick={close} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={save} className="rounded-xl shadow-md shadow-accent/20">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingQuestion}
        onOpenChange={(o) => !o && setDeletingQuestion(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-main">
              Excluir Pergunta?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-muted">
              Tem certeza que deseja excluir a pergunta &ldquo;
              {deletingQuestion?.question_text}&rdquo;? Esta ação é permanente e
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-text-main rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white border-0 rounded-xl"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
