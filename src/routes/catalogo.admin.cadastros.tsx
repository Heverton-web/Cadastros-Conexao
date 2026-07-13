
import { RequirePermission } from "~/components/guards";import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import {
  useCategorias, useConexoes, useFamilias, useLinhas, useFresas,
  useTiposReabilitacao, useTiposAbutment, useCategoriasAcessorio,
  useCategoriasInstrumental, useCategoriasKit, useWorkflows, useEtapas,
  useAcessorios, useChavesFerramental, useInstrumentais,
} from "~/features/catalogo/hooks/useCatalogo"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { useState } from "react"
import { Layers, Scissors, Stethoscope, Wrench, Package, GitBranch, Plus, Pencil, Trash2 } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient } from "@tanstack/react-query"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"

export const catalogoAdminCadastrosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/cadastros",
  component: () => (
    <RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_cadastros"]}>
      <EmpresaCrudGuard>
        <AdminCadastrosPage />
      </EmpresaCrudGuard>
    </RequirePermission>
  ),
})

const TABS = [
  { key: "hierarquia", label: "Hierarquia", icon: Layers, subTabs: ["Categorias", "Conexões", "Famílias", "Linhas"] },
  { key: "cirurgico", label: "Cirúrgico", icon: Scissors, subTabs: ["Fresas"] },
  { key: "protetico", label: "Protético", icon: Stethoscope, subTabs: ["Tipos de Reabilitação", "Tipos de Abutment"] },
  { key: "acessorios", label: "Acessórios & Ferramentas", icon: Wrench, subTabs: ["Categorias de Acessório", "Acessórios", "Chaves & Ferramentas"] },
  { key: "instrumentais", label: "Instrumentais", icon: Package, subTabs: ["Categorias de Instrumental"] },
  { key: "kits", label: "Kits & Workflows", icon: GitBranch, subTabs: ["Categorias de Kit", "Workflows Protéticos", "Etapas de Workflow"] },
]

function AdminCadastrosPage() {
  const [tab, setTab] = useState("hierarquia")
  const [subTab, setSubTab] = useState("Categorias")
  const currentTab = TABS.find((t) => t.key === tab)!

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-white">Cadastros Auxiliares</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>
              Gerencie as tabelas que alimentam os relacionamentos de produtos do catálogo.
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSubTab(t.subTabs[0]) }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                tab === t.key
                ? "bg-[#c9a655] text-[#0f172a]"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] border border-transparent hover:border-white/5"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border bg-[var(--color-surface)]/50 backdrop-blur-md p-6 shadow-xl" style={{ borderColor: "rgba(201,166,85,0.15)" }}>
          <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
            {currentTab.subTabs.map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  subTab === st
                  ? "bg-[#c9a655]/10 text-[#c9a655] border border-[#c9a655]/20"
                  : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <CadastroContent tab={tab} subTab={subTab} />
        </div>
      </div>
    </AdminLayout>
  )
}

function CadastroContent({ tab, subTab }: { tab: string; subTab: string }) {
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()

  const { data: categorias } = useCategorias()
  const { data: conexoes } = useConexoes()
  const { data: familias } = useFamilias()
  const { data: linhas } = useLinhas()
  const { data: fresas } = useFresas()
  const { data: tiposReab } = useTiposReabilitacao()
  const { data: tiposAbutment } = useTiposAbutment()
  const { data: catsAcessorio } = useCategoriasAcessorio()
  const { data: catsInstrumental } = useCategoriasInstrumental()
  const { data: catsKit } = useCategoriasKit()
  const { data: workflows } = useWorkflows()
  const { data: etapas } = useEtapas()
  const { data: acessorios } = useAcessorios()
  const { data: chaves } = useChavesFerramental()
  const { data: instrumentais } = useInstrumentais()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string } | null>(null)

  const tableStyle = "w-full text-left"
  const thStyle = "p-3 text-xs font-bold uppercase border-b"
  const thColor = { color: "var(--color-text-muted, #94a3b8)", borderColor: "rgba(201,166,85,0.1)" }
  const tdStyle = "p-3 border-b"
  const tdColor = { borderColor: "rgba(201,166,85,0.1)" }

  function openNew() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function openEdit(item: Record<string, unknown>) {
    setEditingItem(item)
    setFormOpen(true)
  }

  async function handleDelete() {
    if (!deleteItem) return
    const { error } = await supabase.from(deleteItem.table).delete().eq("id", deleteItem.id)
    if (!error) {
      qc.invalidateQueries({ queryKey: ["catalogo"] })
    }
    setDeleteItem(null)
  }

  function getSubTabConfig() {
    if (tab === "hierarquia") {
      if (subTab === "Categorias") return {
        headers: ["Nome", "Ações"],
        rows: (categorias ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias",
        pk: "id",
      }
      if (subTab === "Conexões") return {
        headers: ["Nome", "Sigla", "Categoria", "Ações"],
        rows: (conexoes ?? []).map((c) => ({ ...c })),
        fields: [
          { key: "categoria_id", label: "Categoria", type: "select" as const, required: true, options: (categorias ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "sigla", label: "Sigla", type: "text" as const },
        ],
        table: "catalogo_conexoes",
        pk: "id",
      }
      if (subTab === "Famílias") return {
        headers: ["Nome", "Cor", "Conexão", "Ações"],
        rows: (familias ?? []).map((f) => ({ ...f })),
        fields: [
          { key: "conexao_id", label: "Conexão", type: "select" as const, required: true, options: (conexoes ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "cor_identificacao", label: "Cor de Identificação", type: "color" as const },
        ],
        table: "catalogo_familias",
        pk: "id",
      }
      if (subTab === "Linhas") return {
        headers: ["Nome", "Família", "Ativo", "Ações"],
        rows: (linhas ?? []).map((l) => ({ ...l })),
        fields: [
          { key: "familia_id", label: "Família", type: "select" as const, required: true, options: (familias ?? []).map((f) => ({ value: f.id, label: f.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "ativo", label: "Ativo", type: "toggle" as const },
        ],
        table: "catalogo_linhas",
        pk: "id",
      }
    }

    if (tab === "cirurgico") {
      if (subTab === "Fresas") return {
        headers: ["SKU", "Nome", "Ø (mm)", "Venda Avulsa", "Ações"],
        rows: (fresas ?? []).map((f) => ({ ...f })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "diametro_mm", label: "Diâmetro (mm)", type: "number" as const },
          { key: "venda_avulsa", label: "Venda Avulsa", type: "toggle" as const },
        ],
        table: "catalogo_fresas",
        pk: "sku",
      }
    }

    if (tab === "protetico") {
      if (subTab === "Tipos de Reabilitação") return {
        headers: ["Nome", "Ações"],
        rows: (tiposReab ?? []).map((t) => ({ ...t })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_tipos_reabilitacao",
        pk: "id",
      }
      if (subTab === "Tipos de Abutment") return {
        headers: ["Nome", "Sigla", "Ações"],
        rows: (tiposAbutment ?? []).map((t) => ({ ...t })),
        fields: [
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "sigla", label: "Sigla", type: "text" as const },
        ],
        table: "catalogo_tipos_abutment",
        pk: "id",
      }
    }

    if (tab === "acessorios") {
      if (subTab === "Categorias de Acessório") return {
        headers: ["Nome", "Ações"],
        rows: (catsAcessorio ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_acessorio",
        pk: "id",
      }
      if (subTab === "Acessórios") return {
        headers: ["SKU", "Nome", "Categoria", "Ø (mm)", "Ações"],
        rows: (acessorios ?? []).map((a) => ({ ...a })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "categoria_id", label: "Categoria", type: "select" as const, required: true, options: (catsAcessorio ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "diametro_mm", label: "Diâmetro (mm)", type: "number" as const },
          { key: "altura_mm", label: "Altura (mm)", type: "number" as const },
        ],
        table: "catalogo_acessorios",
        pk: "sku",
      }
      if (subTab === "Chaves & Ferramentas") return {
        headers: ["SKU", "Nome", "Tipo", "Ações"],
        rows: (chaves ?? []).map((c) => ({ ...c })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "tipo_ferramenta", label: "Tipo", type: "select" as const, required: true, options: [
            { value: "Aperto", label: "Aperto" },
            { value: "Medição", label: "Medição" },
            { value: "Cirúrgica", label: "Cirúrgica" },
          ]},
        ],
        table: "catalogo_chaves_ferramental",
        pk: "sku",
      }
    }

    if (tab === "instrumentais") {
      if (subTab === "Categorias de Instrumental") return {
        headers: ["Nome", "Ações"],
        rows: (catsInstrumental ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_instrumental",
        pk: "id",
      }
    }

    if (tab === "kits") {
      if (subTab === "Categorias de Kit") return {
        headers: ["Nome", "Ações"],
        rows: (catsKit ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_kit",
        pk: "id",
      }
      if (subTab === "Workflows Protéticos") return {
        headers: ["Nome", "Ações"],
        rows: (workflows ?? []).map((w) => ({ ...w })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_workflows",
        pk: "id",
      }
      if (subTab === "Etapas de Workflow") return {
        headers: ["Ordem", "Nome", "Ações"],
        rows: (etapas ?? []).map((e) => ({ ...e })),
        fields: [
          { key: "ordem", label: "Ordem", type: "number" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
        ],
        table: "catalogo_etapas_workflow",
        pk: "id",
      }
    }

    return null
  }

  const config = getSubTabConfig()
  if (!config) return <p style={{ color: "var(--color-text-muted, #94a3b8)" }}>Selecione uma tabela</p>

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}
        >
          <Plus className="h-4 w-4" /> NOVO REGISTRO
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={tableStyle}>
          <thead>
            <tr>
              {config.headers.map((h) => <th key={h} className={thStyle} style={thColor}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {config.rows.map((row, i) => (
              <tr key={i} className="hover:bg-[rgba(201,166,85,0.04)]">
                {config.headers.filter((h) => h !== "Ações").map((h) => {
                  const key = h.toLowerCase().replace(/[^a-z_]/g, "_")
                  let value = ""
                  if (h === "Nome") value = String(row.nome ?? "")
                  else if (h === "Sigla") value = String(row.sigla ?? "")
                  else if (h === "Categoria") value = String(row.categoria?.nome ?? "")
                  else if (h === "Conexão") value = String(row.conexao?.nome ?? "")
                  else if (h === "Família") value = String(row.familia?.nome ?? "")
                  else if (h === "Cor") value = String(row.cor_identificacao ?? "")
                  else if (h === "Ativo") value = row.ativo ? "Sim" : "Não"
                  else if (h === "SKU") value = String(row.sku ?? "")
                  else if (h === "Ø (mm)") value = String(row.diametro_mm ?? "")
                  else if (h === "Venda Avulsa") value = row.venda_avulsa ? "Sim" : "Não"
                  else if (h === "Ordem") value = String(row.ordem ?? "")
                  else if (h === "Tipo") value = String(row.tipo_ferramenta ?? "")
                  else value = String(row[h.toLowerCase().replace(/ /g, "_")] ?? "")
                  return <td key={h} className={tdStyle} style={tdColor}>{value}</td>
                })}
                <td className={tdStyle} style={tdColor}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(row)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655] transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteItem({
                        id: String(row[config.pk]),
                        label: String(row.nome ?? row.sku ?? row[config.pk]),
                        table: config.table,
                      })}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {config.rows.length === 0 && (
              <tr><td colSpan={config.headers.length} className="p-4 text-center" style={{ color: "var(--color-text-muted, #94a3b8)" }}>Nenhum registro</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <CadastroFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        fields={config.fields}
        table={config.table}
        pk={config.pk}
        editingItem={editingItem}
        empresaId={empresaId}
        onSuccess={() => qc.invalidateQueries({ queryKey: ["catalogo"] })}
      />

      <AlertDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <AlertDialogContent style={{ background: "var(--color-card, #1e293b)", borderColor: "rgba(201,166,85,0.15)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem?.label} será removido permanentemente. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface FieldConfig {
  key: string
  label: string
  type: "text" | "number" | "color" | "toggle" | "select"
  required?: boolean
  options?: { value: string; label: string }[]
}

function CadastroFormDialog({
  open, onOpenChange, fields, table, pk, editingItem, empresaId, onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: FieldConfig[]
  table: string
  pk: string
  editingItem: Record<string, unknown> | null
  empresaId: string
  onSuccess: () => void
}) {
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  useState(() => {
    if (editingItem) {
      const init: Record<string, unknown> = {}
      fields.forEach((f) => { init[f.key] = editingItem[f.key] ?? (f.type === "toggle" ? false : "") })
      setForm(init)
    } else {
      const init: Record<string, unknown> = {}
      fields.forEach((f) => { init[f.key] = f.type === "toggle" ? false : f.type === "number" ? 0 : "" })
      setForm(init)
    }
  })

  function resetForm() {
    const init: Record<string, unknown> = {}
    fields.forEach((f) => { init[f.key] = f.type === "toggle" ? false : f.type === "number" ? 0 : "" })
    setForm(init)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { empresa_id: empresaId }
      fields.forEach((f) => {
        const val = form[f.key]
        if (val !== undefined && val !== "" && val !== null) {
          payload[f.key] = f.type === "number" ? Number(val) : val
        }
      })

      if (editingItem) {
        const id = editingItem[pk]
        const { error } = await supabase.from(table).update(payload).eq(pk, id)
        if (error) throw error
      } else {
        const { error } = await supabase.from(table).insert(payload)
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (err) {
      console.error("Erro ao salvar:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-white">
            {editingItem ? "Editar Registro" : "Novo Registro"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingItem ? "Altere os campos abaixo." : "Preencha os campos para criar um novo registro."}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  value={String(form[field.key] ?? "")}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
                  placeholder={`Digite ${field.label.toLowerCase()}...`}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  value={Number(form[field.key] ?? 0)}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
                  step="any"
                />
              )}

              {field.type === "color" && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={String(form[field.key] ?? "#c9a655")}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={String(form[field.key] ?? "")}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="flex-1 bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white font-mono text-sm"
                    placeholder="#c9a655"
                  />
                </div>
              )}

              {field.type === "toggle" && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [field.key]: !form[field.key] })}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    form[field.key]
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {form[field.key] ? "Ativo" : "Inativo"}
                </button>
              )}

              {field.type === "select" && (
                <select
                  value={String(form[field.key] ?? "")}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
                >
                  <option value="">Selecione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
