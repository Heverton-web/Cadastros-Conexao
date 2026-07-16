
import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useAuth } from "~/core/auth/useAuth"
import {
  useCategorias, useConexoes, useFamilias, useLinhas, useFresas,
  useTiposReabilitacao, useTiposAbutment, useCategoriasAcessorio,
  useCategoriasInstrumental, useCategoriasKit, useWorkflows, useEtapas,
  useAcessorios, useChavesFerramental, useInstrumentais,
  useToggleCategoriaAtivo, useToggleConexaoAtivo, useToggleLinhaAtivo,
  useToggleFamiliaAtivo, useToggleFresaAtivo, useToggleTipoReabilitacaoAtivo,
  useToggleTipoAbutmentAtivo, useToggleCategoriaAcessorioAtivo,
  useToggleAcessorioAtivo, useToggleChaveFerramentalAtivo,
  useToggleCategoriaInstrumentalAtivo, useToggleInstrumentalAtivo,
  useToggleCategoriaKitAtivo, useToggleWorkflowAtivo, useToggleEtapaAtivo,
} from "~/features/catalogo/hooks/useCatalogo"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { useState } from "react"
import { Layers, Scissors, Stethoscope, Package, Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { CadastroFormDialog } from "~/features/catalogo/components/admin/CadastroFormDialog"
import type { FieldConfig } from "~/features/catalogo/types/cadastros"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

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
  { key: "estrutura", label: "Estrutura", icon: Layers, subTabs: ["Categorias", "Conexões", "Famílias", "Linhas"] },
  { key: "protetico", label: "Componentes Protéticos", icon: Stethoscope, subTabs: ["Tipos de Reabilitação", "Tipos de Abutment", "Tipos de Componente", "Componentes", "Workflows Protéticos", "Etapas de Workflow"] },
  { key: "instrumentais", label: "Instrumentais", icon: Scissors, subTabs: ["Chaves Protéticas", "Chaves Cirúrgicas", "Fresas", "Instrumentos Opcionais", "Instrumentos Complementares", "Categorias de Instrumental"] },
  { key: "kits", label: "Kits", icon: Package, subTabs: ["Categorias de Kit"] },
]

function AdminCadastrosPage() {
  const [tab, setTab] = useState("estrutura")
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
  const { profile } = useAuth()
  const isSuperAdmin = profile?.is_super_admin === true
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

  const toggleCategoria = useToggleCategoriaAtivo()
  const toggleConexao = useToggleConexaoAtivo()
  const toggleLinha = useToggleLinhaAtivo()
  const toggleFamilia = useToggleFamiliaAtivo()
  const toggleFresa = useToggleFresaAtivo()
  const toggleTipoReab = useToggleTipoReabilitacaoAtivo()
  const toggleTipoAbutment = useToggleTipoAbutmentAtivo()
  const toggleCatAcessorio = useToggleCategoriaAcessorioAtivo()
  const toggleAcessorio = useToggleAcessorioAtivo()
  const toggleChave = useToggleChaveFerramentalAtivo()
  const toggleCatInstrumental = useToggleCategoriaInstrumentalAtivo()
  const toggleInstrumental = useToggleInstrumentalAtivo()
  const toggleCatKit = useToggleCategoriaKitAtivo()
  const toggleWorkflow = useToggleWorkflowAtivo()
  const toggleEtapa = useToggleEtapaAtivo()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string; pkColumn: string } | null>(null)

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
    const { error } = await supabase.from(deleteItem.table).delete().eq(deleteItem.pkColumn, deleteItem.id)
    if (!error) {
      qc.invalidateQueries({ queryKey: ["catalogo"] })
    }
    setDeleteItem(null)
  }

  function getSubTabConfig() {
    if (tab === "estrutura") {
      if (subTab === "Categorias") return {
        headers: ["Nome", "Pré-definido", "Ativo", "Ações"],
        rows: (categorias ?? []).map((c) => ({ ...c })),
        fields: [
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "ativo", label: "Ativo", type: "toggle" as const },
        ],
        table: "catalogo_categorias",
        pk: "id",
      }
      if (subTab === "Conexões") return {
        headers: ["Nome", "Sigla", "Categoria", "Pré-definido", "Ativo", "Ações"],
        rows: (conexoes ?? []).map((c) => ({ ...c })),
        fields: [
          { key: "categoria_id", label: "Categoria", type: "select" as const, required: true, options: (categorias ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "sigla", label: "Sigla", type: "text" as const },
          { key: "ativo", label: "Ativo", type: "toggle" as const },
        ],
        table: "catalogo_conexoes",
        pk: "id",
      }
      if (subTab === "Famílias") return {
        headers: ["Nome", "Cor", "Conexão", "Ativo", "Ações"],
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

    if (tab === "protetico") {
      if (subTab === "Tipos de Reabilitação") return {
        headers: ["Nome", "Ativo", "Ações"],
        rows: (tiposReab ?? []).map((t) => ({ ...t })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_tipos_reabilitacao",
        pk: "id",
      }
      if (subTab === "Tipos de Abutment") return {
        headers: ["Nome", "Sigla", "Ativo", "Ações"],
        rows: (tiposAbutment ?? []).map((t) => ({ ...t })),
        fields: [
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "sigla", label: "Sigla", type: "text" as const },
        ],
        table: "catalogo_tipos_abutment",
        pk: "id",
      }
      if (subTab === "Tipos de Componente") return {
        headers: ["Nome", "Ativo", "Ações"],
        rows: (catsAcessorio ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_acessorio",
        pk: "id",
      }
      if (subTab === "Componentes") return {
        headers: ["SKU", "Nome", "Tipo", "Ø (mm)", "Ativo", "Ações"],
        rows: (acessorios ?? []).map((a) => ({ ...a })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "categoria_id", label: "Tipo", type: "select" as const, required: true, options: (catsAcessorio ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "diametro_mm", label: "Diâmetro (mm)", type: "number" as const },
          { key: "altura_mm", label: "Altura (mm)", type: "number" as const },
        ],
        table: "catalogo_acessorios",
        pk: "sku",
      }
      if (subTab === "Workflows Protéticos") return {
        headers: ["Nome", "Ativo", "Ações"],
        rows: (workflows ?? []).map((w) => ({ ...w })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_workflows",
        pk: "id",
      }
      if (subTab === "Etapas de Workflow") return {
        headers: ["Ordem", "Nome", "Ativo", "Ações"],
        rows: (etapas ?? []).map((e) => ({ ...e })),
        fields: [
          { key: "ordem", label: "Ordem", type: "number" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
        ],
        table: "catalogo_etapas_workflow",
        pk: "id",
      }
    }

    if (tab === "instrumentais") {
      if (subTab === "Chaves Protéticas") return {
        headers: ["SKU", "Nome", "Tipo", "Ativo", "Ações"],
        rows: (chaves ?? []).filter((c) => c.tipo_ferramenta !== "Cirúrgica").map((c) => ({ ...c })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "tipo_ferramenta", label: "Tipo", type: "select" as const, required: true, options: [
            { value: "Aperto", label: "Aperto" },
            { value: "Medição", label: "Medição" },
          ]},
        ],
        table: "catalogo_chaves_ferramental",
        pk: "sku",
      }
      if (subTab === "Chaves Cirúrgicas") return {
        headers: ["SKU", "Nome", "Tipo", "Ativo", "Ações"],
        rows: (chaves ?? []).filter((c) => c.tipo_ferramenta === "Cirúrgica").map((c) => ({ ...c })),
        fields: [
          { key: "sku", label: "SKU", type: "text" as const, required: true },
          { key: "nome", label: "Nome", type: "text" as const, required: true },
          { key: "tipo_ferramenta", label: "Tipo", type: "select" as const, required: true, options: [
            { value: "Cirúrgica", label: "Cirúrgica" },
          ]},
        ],
        table: "catalogo_chaves_ferramental",
        pk: "sku",
      }
      if (subTab === "Fresas") return {
        headers: ["SKU", "Nome", "Ø (mm)", "Venda Avulsa", "Ativo", "Ações"],
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
      if (subTab === "Instrumentos Opcionais") {
        const catOpcional = (catsInstrumental ?? []).find((c) => c.nome.toLowerCase().includes("opcion"))
        return {
          headers: ["SKU", "Nome", "Categoria", "Ativo", "Ações"],
          rows: (instrumentais ?? []).filter((i) => catOpcional ? i.categoria_id === catOpcional.id : false).map((i) => ({ ...i })),
          fields: [
            { key: "sku", label: "SKU", type: "text" as const, required: true },
            { key: "nome", label: "Nome", type: "text" as const, required: true },
            { key: "categoria_id", label: "Categoria", type: "select" as const, required: true, options: (catsInstrumental ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          ],
          table: "catalogo_instrumentais_gerais",
          pk: "sku",
        }
      }
      if (subTab === "Instrumentos Complementares") {
        const catCompl = (catsInstrumental ?? []).find((c) => c.nome.toLowerCase().includes("compl"))
        return {
          headers: ["SKU", "Nome", "Categoria", "Ativo", "Ações"],
          rows: (instrumentais ?? []).filter((i) => catCompl ? i.categoria_id === catCompl.id : false).map((i) => ({ ...i })),
          fields: [
            { key: "sku", label: "SKU", type: "text" as const, required: true },
            { key: "nome", label: "Nome", type: "text" as const, required: true },
            { key: "categoria_id", label: "Categoria", type: "select" as const, required: true, options: (catsInstrumental ?? []).map((c) => ({ value: c.id, label: c.nome })) },
          ],
          table: "catalogo_instrumentais_gerais",
          pk: "sku",
        }
      }
      if (subTab === "Categorias de Instrumental") return {
        headers: ["Nome", "Ativo", "Ações"],
        rows: (catsInstrumental ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_instrumental",
        pk: "id",
      }
    }

    if (tab === "kits") {
      if (subTab === "Categorias de Kit") return {
        headers: ["Nome", "Ativo", "Ações"],
        rows: (catsKit ?? []).map((c) => ({ ...c })),
        fields: [{ key: "nome", label: "Nome", type: "text" as const, required: true }],
        table: "catalogo_categorias_kit",
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

      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#c9a655]/20">
            {config.headers.map((h) => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {config.rows.map((row, i) => (
            <TableRow key={i} className={`${i % 2 === 0 ? "bg-[var(--color-surface)]/30" : "bg-transparent"} hover:bg-[#c9a655]/5 transition-colors border-b border-[var(--color-border-subtle)]/50`}>
              {config.headers.filter((h) => h !== "Ações").map((h) => {
                if (h === "Ativo") {
                  const tabela = config.table
                  return (
                    <TableCell key={h}>
                      <button
                        onClick={() => {
                          if (tabela === "catalogo_categorias") toggleCategoria.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_conexoes") toggleConexao.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_linhas") toggleLinha.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_familias") toggleFamilia.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_fresas") toggleFresa.mutate({ sku: row.sku, ativo: !row.ativo })
                          else if (tabela === "catalogo_tipos_reabilitacao") toggleTipoReab.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_tipos_abutment") toggleTipoAbutment.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_categorias_acessorio") toggleCatAcessorio.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_acessorios") toggleAcessorio.mutate({ sku: row.sku, ativo: !row.ativo })
                          else if (tabela === "catalogo_chaves_ferramental") toggleChave.mutate({ sku: row.sku, ativo: !row.ativo })
                          else if (tabela === "catalogo_categorias_instrumental") toggleCatInstrumental.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_instrumentais_gerais") toggleInstrumental.mutate({ sku: row.sku, ativo: !row.ativo })
                          else if (tabela === "catalogo_categorias_kit") toggleCatKit.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_workflows") toggleWorkflow.mutate({ id: row.id, ativo: !row.ativo })
                          else if (tabela === "catalogo_etapas_workflow") toggleEtapa.mutate({ id: row.id, ativo: !row.ativo })
                        }}
                        className="transition-colors"
                      >
                        {row.ativo ? (
                          <ToggleRight className="h-7 w-7 text-green-400" />
                        ) : (
                          <ToggleLeft className="h-7 w-7 text-gray-500" />
                        )}
                      </button>
                    </TableCell>
                  )
                }
                let value = ""
                if (h === "Nome") value = String(row.nome ?? "")
                else if (h === "Sigla") value = String(row.sigla ?? "")
                else if (h === "Pré-definido") value = row.locked ? "Sim" : "Não"
                else if (h === "Categoria") value = String(row.categoria?.nome ?? "")
                else if (h === "Conexão") value = String(row.conexao?.nome ?? "")
                else if (h === "Família") value = String(row.familia?.nome ?? "")
                else if (h === "Cor") value = String(row.cor_identificacao ?? "")
                else if (h === "SKU") value = String(row.sku ?? "")
                else if (h === "Ø (mm)") value = String(row.diametro_mm ?? "")
                else if (h === "Venda Avulsa") value = row.venda_avulsa ? "Sim" : "Não"
                else if (h === "Ordem") value = String(row.ordem ?? "")
                else if (h === "Tipo") value = String(row.tipo_ferramenta ?? "")
                else value = String(row[h.toLowerCase().replace(/ /g, "_")] ?? "")
                return <TableCell key={h} className="text-sm">{value}</TableCell>
              })}
              <TableCell>
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
                      pkColumn: config.pk,
                    })}
                    disabled={!isSuperAdmin && !!row.locked}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={!isSuperAdmin && !!row.locked ? "Registro pré-definido não pode ser excluído" : "Excluir"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {config.rows.length === 0 && (
            <TableRow><TableCell colSpan={config.headers.length} className="p-4 text-center text-text-muted">Nenhum registro</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

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


