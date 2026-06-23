import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Switch } from '~/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { toast } from '~/hooks/use-toast';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, ListChecks } from 'lucide-react';

export interface SurveyQuestion {
  id: string;
  key: string;
  order_index: number;
  type: 'nps' | 'single_choice' | 'multi_choice' | 'text' | 'matrix';
  question_text: string;
  options: string[];
  required: boolean;
  active: boolean;
  is_system: boolean;
}

const TYPE_LABELS: Record<SurveyQuestion['type'], string> = {
  nps: 'NPS (0-10)',
  single_choice: 'Escolha única',
  multi_choice: 'Escolha múltipla',
  text: 'Texto livre',
  matrix: 'Matriz (1-5)',
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);

const emptyDraft = (): Partial<SurveyQuestion> => ({
  key: '', type: 'single_choice', question_text: '', options: [],
  required: true, active: true, is_system: false, order_index: 0,
});

const QuestionsManager = () => {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SurveyQuestion> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [optionInput, setOptionInput] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('survey_questions')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) {
      toast({ title: 'Erro ao carregar perguntas', description: error.message, variant: 'destructive' });
    }
    setQuestions((data as SurveyQuestion[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleActive = async (q: SurveyQuestion) => {
    const { data, error } = await supabase
      .from('survey_questions')
      .update({ active: !q.active, updated_at: new Date().toISOString() })
      .eq('id', q.id)
      .select();
    if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); return; }
    if (!data || data.length === 0) {
      toast({ title: 'Sem permissão (RLS)', description: 'Nada foi alterado. Reaplique o SQL de policies no Supabase e confirme role super_admin.', variant: 'destructive' });
      return;
    }
    fetchAll();
  };

  const move = async (q: SurveyQuestion, dir: -1 | 1) => {
    const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((x) => x.id === q.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await supabase.from('survey_questions').update({ order_index: swap.order_index }).eq('id', q.id);
    await supabase.from('survey_questions').update({ order_index: q.order_index }).eq('id', swap.id);
    fetchAll();
  };

  const remove = async (q: SurveyQuestion) => {
    if (q.is_system) {
      toast({ title: 'Perguntas do sistema não podem ser excluídas', description: 'Use o botão Desativar.', variant: 'destructive' });
      return;
    }
    if (!window.confirm(`Excluir "${q.question_text}"? Esta ação é permanente.`)) return;
    const { error } = await supabase.from('survey_questions').delete().eq('id', q.id);
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Pergunta excluída' }); fetchAll(); }
  };

  const openNew = () => {
    const maxOrder = Math.max(0, ...questions.map((q) => q.order_index));
    setEditing({ ...emptyDraft(), order_index: maxOrder + 1 });
    setIsNew(true);
  };
  const openEdit = (q: SurveyQuestion) => { setEditing({ ...q }); setIsNew(false); };
  const close = () => { setEditing(null); setOptionInput(''); };

  const addOption = () => {
    const v = optionInput.trim();
    if (!v) return;
    setEditing((e) => e ? { ...e, options: [...(e.options || []), v] } : e);
    setOptionInput('');
  };
  const removeOption = (i: number) => {
    setEditing((e) => e ? { ...e, options: (e.options || []).filter((_, idx) => idx !== i) } : e);
  };

  const save = async () => {
    if (!editing) return;
    const text = (editing.question_text || '').trim();
    if (!text) { toast({ title: 'Texto da pergunta é obrigatório', variant: 'destructive' }); return; }
    const type = editing.type as SurveyQuestion['type'];
    const needsOptions = type === 'single_choice' || type === 'multi_choice' || type === 'matrix';
    const opts = editing.options || [];
    if (needsOptions && opts.length < 2) {
      toast({ title: 'Adicione ao menos 2 opções', variant: 'destructive' });
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
    };
    if (isNew) {
      const base = (editing.key || slugify(text)) || `q_${Date.now()}`;
      payload.key = base;
      payload.is_system = false;
      const { data, error } = await supabase.from('survey_questions').insert(payload).select();
      if (error) { toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' }); return; }
      if (!data || data.length === 0) {
        toast({ title: 'Sem permissão (RLS)', description: 'Nenhuma linha criada. Aplique o SQL atualizado de policies no Supabase e confirme que seu usuário tem role=super_admin em dashboard_profiles.', variant: 'destructive' });
        return;
      }
      toast({ title: 'Pergunta criada!' });
    } else {
      const { data, error } = await supabase.from('survey_questions').update(payload).eq('id', editing.id!).select();
      if (error) { toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' }); return; }
      if (!data || data.length === 0) {
        toast({ title: 'Sem permissão (RLS)', description: 'A atualização foi silenciosamente bloqueada por RLS. Reaplique o SQL docs/sql/20260615_survey_questions.sql no Supabase e confirme que seu usuário tem role=super_admin.', variant: 'destructive' });
        return;
      }
      toast({ title: 'Pergunta atualizada!' });
    }
    close();
    fetchAll();
  };

  const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
  const needsOptions = editing?.type === 'single_choice' || editing?.type === 'multi_choice' || editing?.type === 'matrix';

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur border-border/30 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          Perguntas da Pesquisa
        </CardTitle>
        <Button onClick={openNew} size="sm" className="btn-gold gap-1.5">
          <Plus className="w-4 h-4" /> Nova pergunta
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        {!loading && sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma pergunta cadastrada. Execute o SQL <code className="text-primary/80">docs/sql/20260615_survey_questions.sql</code> no Supabase para popular as 10 iniciais.
          </p>
        )}
        {sorted.map((q, idx) => (
          <div key={q.id} className={`flex items-center gap-3 p-3 rounded-lg border ${q.active ? 'bg-secondary/40 border-border/40' : 'bg-secondary/10 border-border/20 opacity-60'}`}>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(q, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => move(q, 1)} disabled={idx === sorted.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-primary/80">#{idx + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{TYPE_LABELS[q.type]}</span>
                {q.is_system && <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">sistema</span>}
                {!q.required && <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">opcional</span>}
              </div>
              <p className="text-sm text-foreground mt-1 truncate">{q.question_text}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">key: {q.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch checked={q.active} onCheckedChange={() => toggleActive(q)} />
                <span className="text-xs text-muted-foreground hidden md:inline">{q.active ? 'Ativa' : 'Inativa'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openEdit(q)} className="text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={() => remove(q)}
                disabled={q.is_system}
                className="text-muted-foreground hover:text-red-400 disabled:opacity-30"
                title={q.is_system ? 'Pergunta do sistema — não pode ser excluída' : 'Excluir'}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && close()}>
        <DialogContent className="bg-card border-border max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-foreground">{isNew ? 'Nova pergunta' : 'Editar pergunta'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5 py-2">
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Select
                  value={editing.type}
                  onValueChange={(v) => setEditing({ ...editing, type: v as SurveyQuestion['type'] })}
                  disabled={editing.is_system}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editing.is_system && <p className="text-xs text-muted-foreground mt-1">Tipo de perguntas do sistema não pode ser alterado.</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Texto da pergunta</Label>
                <Textarea
                  value={editing.question_text || ''}
                  onChange={(e) => setEditing({ ...editing, question_text: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  rows={3}
                />
              </div>

              {isNew && (
                <div>
                  <Label className="text-xs text-muted-foreground">Identificador (key)</Label>
                  <Input
                    value={editing.key || ''}
                    onChange={(e) => setEditing({ ...editing, key: slugify(e.target.value) })}
                    placeholder={slugify(editing.question_text || '') || 'identificador_unico'}
                    className="bg-secondary border-border text-foreground font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Gerado automaticamente se vazio. Usado como chave nas respostas.</p>
                </div>
              )}

              {needsOptions && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {editing.type === 'matrix' ? 'Itens da matriz' : 'Opções'}
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                      placeholder="Digite e pressione Enter"
                      className="bg-secondary border-border text-foreground"
                    />
                    <Button type="button" onClick={addOption} variant="outline" size="sm" className="border-border">
                      Adicionar
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {(editing.options || []).map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-md px-3 py-2">
                        <span className="text-sm text-foreground flex-1">{opt}</span>
                        <button onClick={() => removeOption(i)} className="text-muted-foreground hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={!!editing.required} onCheckedChange={(v) => setEditing({ ...editing, required: v })} />
                  <Label className="text-sm text-foreground cursor-pointer">Obrigatória</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={!!editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                  <Label className="text-sm text-foreground cursor-pointer">Ativa</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 border-t border-border/30">
            <Button variant="outline" onClick={close} className="border-border text-foreground">Cancelar</Button>
            <Button onClick={save} className="btn-gold">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuestionsManager;
