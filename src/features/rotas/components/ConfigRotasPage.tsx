import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
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
import { Loader2, Save, Plus, Trash2, GripVertical, Upload, Download } from "lucide-react";
import { useEmpresa } from "~/core/empresa/useEmpresa";
import { useAuth } from "~/core/auth";
import { getConfig, upsertConfig } from "../services/config.service";
import {
  listarPerguntas,
  criarPergunta,
  atualizarPergunta,
  excluirPergunta,
  reordenarPerguntas,
} from "../services/form.service";
import { useCriarClientesBaseEmLote } from "../hooks/useClientesBase";
import { FORM_PERGUNTA_TIPO_LABEL } from "../types";
import type { RotasConfig, RotasFormPergunta, FormPerguntaTipo } from "../types";
import toast from "react-hot-toast";

export function ConfigRotasPage() {
  const { empresa } = useEmpresa();
  const { user } = useAuth();
  const uploadEmLote = useCriarClientesBaseEmLote();

  const [config, setConfig] = useState<RotasConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formulário
  const [perguntas, setPerguntas] = useState<RotasFormPergunta[]>([]);
  const [novaPergunta, setNovaPergunta] = useState({
    titulo: "",
    tipo: "texto_curto" as FormPerguntaTipo,
    opcoes: [] as string[],
    obrigatorio: true,
  });
  const [showExcluir, setShowExcluir] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!empresa?.id) return;
      try {
        const [configData, perguntasData] = await Promise.all([
          getConfig(empresa.id),
          listarPerguntas(empresa.id),
        ]);
        setConfig(configData);
        setPerguntas(perguntasData);
      } catch (err) {
        console.error("Erro ao carregar config:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [empresa?.id]);

  async function handleSaveConfig() {
    if (!empresa?.id || !config) return;
    setSaving(true);
    try {
      await upsertConfig(empresa.id, {
        valor_km_reembolso: config.valor_km_reembolso,
        raio_permitido_metros: config.raio_permitido_metros,
      });
      toast.success("Configurações salvas!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPergunta() {
    if (!empresa?.id) return;
    if (!novaPergunta.titulo.trim()) {
      toast.error("Digite o título da pergunta");
      return;
    }

    if (["multipla_escolha", "selecao", "radio"].includes(novaPergunta.tipo) && novaPergunta.opcoes.length === 0) {
      toast.error("Adicione pelo menos uma opção");
      return;
    }

    try {
      const pergunta = await criarPergunta({
        empresa_id: empresa.id,
        titulo: novaPergunta.titulo,
        tipo: novaPergunta.tipo,
        opcoes: novaPergunta.opcoes,
        obrigatorio: novaPergunta.obrigatorio,
        ordem: perguntas.length + 1,
        ativo: true,
      });
      setPerguntas((prev) => [...prev, pergunta]);
      setNovaPergunta({ titulo: "", tipo: "texto_curto", opcoes: [], obrigatorio: true });
      toast.success("Pergunta adicionada!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleExcluirPergunta(id: string) {
    try {
      await excluirPergunta(id);
      setPerguntas((prev) => prev.filter((p) => p.id !== id));
      setShowExcluir(null);
      toast.success("Pergunta excluída!");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  function handleDownloadTemplate() {
    const csv = "nome,telefone,cidade,estado,bairro,rua,numero,cep,ticket_medio,categoria\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_base_clientes.csv";
    link.click();
  }

  async function handleUploadCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !empresa?.id || !user?.id) return;

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      toast.error("CSV vazio ou sem dados");
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const required = ["nome"];
    const missing = required.filter((r) => !headers.includes(r));
    if (missing.length > 0) {
      toast.error(`Colunas obrigatórias faltando: ${missing.join(", ")}`);
      return;
    }

    const clientes = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => (row[h] = values[i] ?? ""));

        return {
          empresa_id: empresa.id,
          usuario_id: user.id,
          nome: row.nome,
          telefone: row.telefone || null,
          cidade: row.cidade || null,
          estado: row.estado || null,
          bairro: row.bairro || null,
          rua: row.rua || null,
          numero: row.numero || null,
          cep: row.cep || null,
          endereco_completo: null,
          latitude: null,
          longitude: null,
          ticket_medio: row.ticket_medio ? Number(row.ticket_medio) : null,
          categoria: row.categoria || null,
          ultima_visita: null,
          fonte: "csv" as const,
          fonte_id: null,
          ativo: true,
        };
      });

    try {
      const result = await uploadEmLote.mutateAsync(clientes);
      toast.success(`${result.inseridos} clientes importados!`);
      if (result.erros.length > 0) {
        toast.error(`${result.erros.length} erros na importação`);
      }
    } catch (err) {
      toast.error((err as Error).message);
    }

    e.target.value = "";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações das Rotas</h1>
        <p className="text-muted-foreground">
          Configure valores, formulário e importação de clientes
        </p>
      </div>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="formulario">Formulário</TabsTrigger>
          <TabsTrigger value="importacao">Importação</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valores de Reembolso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Valor por KM (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={config?.valor_km_reembolso ?? 0}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? { ...prev, valor_km_reembolso: Number(e.target.value) }
                          : null
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Raio Permitido (metros)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="1000"
                    value={config?.raio_permitido_metros ?? 300}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? { ...prev, raio_permitido_metros: Number(e.target.value) }
                          : null
                      )
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSaveConfig} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formulário Pós-Visita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {perguntas.map((pergunta) => (
                  <div
                    key={pergunta.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{pergunta.titulo}</div>
                      <div className="text-sm text-muted-foreground">
                        {FORM_PERGUNTA_TIPO_LABEL[pergunta.tipo]}
                        {pergunta.obrigatorio && " • Obrigatória"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowExcluir(pergunta.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium">Nova Pergunta</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Título</Label>
                    <Input
                      value={novaPergunta.titulo}
                      onChange={(e) =>
                        setNovaPergunta((prev) => ({ ...prev, titulo: e.target.value }))
                      }
                      placeholder="Ex: Observações gerais"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo</Label>
                    <Select
                      value={novaPergunta.tipo}
                      onValueChange={(v) =>
                        setNovaPergunta((prev) => ({
                          ...prev,
                          tipo: v as FormPerguntaTipo,
                          opcoes: ["multipla_escolha", "selecao", "radio"].includes(v)
                            ? prev.opcoes
                            : [],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FORM_PERGUNTA_TIPO_LABEL).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {["multipla_escolha", "selecao", "radio"].includes(novaPergunta.tipo) && (
                  <div className="space-y-1.5">
                    <Label>Opções (uma por linha)</Label>
                    <Textarea
                      value={novaPergunta.opcoes.join("\n")}
                      onChange={(e) =>
                        setNovaPergunta((prev) => ({
                          ...prev,
                          opcoes: e.target.value.split("\n").filter((o) => o.trim()),
                        }))
                      }
                      placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Switch
                    checked={novaPergunta.obrigatorio}
                    onCheckedChange={(v) =>
                      setNovaPergunta((prev) => ({ ...prev, obrigatorio: v }))
                    }
                  />
                  <Label className="font-normal">Obrigatória</Label>
                </div>

                <Button onClick={handleAddPergunta}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="importacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Base de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template CSV
                </Button>
                <div>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleUploadCSV}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar CSV
                    </label>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                O template CSV contém as colunas: nome, telefone, cidade, estado, bairro, rua, numero, cep, ticket_medio, categoria.
                Apenas a coluna "nome" é obrigatória.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!showExcluir} onOpenChange={(o) => !o && setShowExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showExcluir && handleExcluirPergunta(showExcluir)}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
