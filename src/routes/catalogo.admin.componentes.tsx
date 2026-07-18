import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useFamilias, useToggleTipoReabilitacaoAtivo, useToggleTipoAbutmentAtivo, useToggleParafusoRetencaoAtivo, useToggleCicatrizadorAtivo } from "~/features/catalogo/hooks/useCatalogo"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { Switch } from "~/components/ui/switch"
import { ImageUploader } from "~/features/catalogo/components/admin/produtos/ImageUploader"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import toast from "react-hot-toast"
import type { CatalogoCpsTipoReabilitacao } from "~/features/catalogo/types"

export const catalogoAdminComponentesRoute = createRoute({
  getParentRoute: () => authLayout, path: "/catalogo/admin/componentes",
  component: () => (<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}><EmpresaCrudGuard><AdminComponentesPage /></EmpresaCrudGuard></RequirePermission>),
})

const SUB_TABS = ["Tipos de Reabilitação", "Tipos de Abutment", "Tipos de Componentes", "Tipos de Parafusos", "Tipos de Cicatrizadores", "Abutments", "Componentes", "Parafusos", "Cicatrizadores"]
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

function AdminComponentesPage() {
  const [subTab, setSubTab] = useState("Tipos de Reabilitação")
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()

  // Data
  const { data: tiposReab } = useQuery({ queryKey: ["catalogo", "tipos-reabilitacao", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_reabilitacao").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as CatalogoCpsTipoReabilitacao[] }, enabled: !!empresaId })
  const { data: tiposAbutment } = useQuery({ queryKey: ["catalogo", "tipos-abutment", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_abutments").select("*, tipo_reabilitacao:catalogo_cps_tipos_reabilitacao(*)").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposComponente } = useQuery({ queryKey: ["catalogo", "tipos-componente", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_componentes").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposParafuso } = useQuery({ queryKey: ["catalogo", "tipos-parafuso", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_parafusos").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposCicatrizador } = useQuery({ queryKey: ["catalogo", "tipos-cicatrizador", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_cicatrizadores").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: abutments } = useQuery({ queryKey: ["catalogo", "abutments", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_abutments").select("*, tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: parafusosList } = useQuery({ queryKey: ["catalogo", "parafusos-list"], queryFn: async () => { const { data } = await supabase.from("catalogo_parafusos").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: chavesList } = useQuery({ queryKey: ["catalogo", "chaves-list"], queryFn: async () => { const { data } = await supabase.from("catalogo_chaves").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: componentesList } = useQuery({ queryKey: ["catalogo", "componentes", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_componentes").select("*, tipo_componente:catalogo_cps_tipos_componentes(*), tipo_abutment:catalogo_cps_tipos_abutments(*), parafuso:catalogo_parafusos(*), chave:catalogo_chaves(*)").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: parafusosProdutos } = useQuery({ queryKey: ["catalogo", "parafusos-produtos", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_parafusos").select("*, tipo_parafuso:catalogo_cps_tipos_parafusos(*), chave:catalogo_chaves(*)").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: cicatrizadoresProdutos } = useQuery({ queryKey: ["catalogo", "cicatrizadores-produtos", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_cicatrizadores").select("*, implante:catalogo_implantes(*), chave:catalogo_chaves(*)").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: implantesList } = useQuery({ queryKey: ["catalogo", "implantes-list", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_implantes").select("sku, nome").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: familias } = useFamilias()

  // Toggles
  const toggleTipoReab = useToggleTipoReabilitacaoAtivo()
  const toggleTipoAbutment = useToggleTipoAbutmentAtivo()

  // Toggle para tipos de componente (via supabase direto)
  async function toggleTipoComponente(id: string, ativo: boolean) {
    await supabase.from("catalogo_cps_tipos_componentes").update({ ativo }).eq("id", id)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleTipoParafuso(id: string, ativo: boolean) {
    await supabase.from("catalogo_cps_tipos_parafusos").update({ ativo }).eq("id", id)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleTipoCicatrizador(id: string, ativo: boolean) {
    await supabase.from("catalogo_cps_tipos_cicatrizadores").update({ ativo }).eq("id", id)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Abutment modal
  const [abutModalOpen, setAbutModalOpen] = useState(false)
  const [abutEditing, setAbutEditing] = useState<any>(null)
  const [abutData, setAbutData] = useState({ sku: "", nome: "", sigla: "", descricao: "", tipo_abutment_id: "", parafuso_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, angulacao_graus: 0, torque_ncm: 0, preco: 0, ativo: true })
  const [abutError, setAbutError] = useState("")

  function openNewAbut() { setAbutEditing(null); setAbutData({ sku: "", nome: "", sigla: "", descricao: "", tipo_abutment_id: "", parafuso_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, angulacao_graus: 0, torque_ncm: 0, preco: 0, ativo: true }); setAbutError(""); setAbutModalOpen(true) }
  function openEditAbut(item: any) { setAbutEditing(item); setAbutData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", tipo_abutment_id: item.tipo_abutment_id ?? "", parafuso_id: item.parafuso_id ?? "", chave_id: item.chave_id ?? "", diametro_plataforma_mm: item.diametro_plataforma_mm ?? 0, altura_transmucoso_mm: item.altura_transmucoso_mm ?? 0, altura_corpo_mm: item.altura_corpo_mm ?? 0, angulacao_graus: item.angulacao_graus ?? 0, torque_ncm: item.torque_ncm ?? 0, preco: item.preco ?? 0, ativo: item.ativo !== false }); setAbutError(""); setAbutModalOpen(true) }

  async function handleSaveAbut() {
    setAbutError("")
    if (!abutData.sku.trim()) { setAbutError("SKU é obrigatório"); return }
    if (!abutData.nome.trim()) { setAbutError("Nome é obrigatório"); return }
    if (!abutData.tipo_abutment_id) { setAbutError("Tipo de Abutment é obrigatório"); return }
    if (!abutData.parafuso_id) { setAbutError("Parafuso é obrigatório"); return }
    const payload = { ...abutData, empresa_id: empresaId }
    if (abutEditing) {
      const { error } = await supabase.from("catalogo_abutments").update(payload).eq("sku", abutEditing.sku).eq("empresa_id", empresaId)
      if (error) { setAbutError(error.message); return }
    } else {
      const { error } = await supabase.from("catalogo_abutments").insert(payload)
      if (error) { setAbutError(error.message); return }
    }
    toast.success(abutEditing ? "Abutment atualizado!" : "Abutment criado!")
    setAbutModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleAbutAtivo(sku: string, ativo: boolean) {
    await supabase.from("catalogo_abutments").update({ ativo }).eq("sku", sku).eq("empresa_id", empresaId)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Componente modal
  const [compModalOpen, setCompModalOpen] = useState(false)
  const [compEditing, setCompEditing] = useState<any>(null)
  const [compData, setCompData] = useState({ sku: "", nome: "", sigla: "", descricao: "", tipo_componente_id: "", tipo_abutment_id: "", parafuso_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, angulacao_graus: 0, tipo: "", tipo_travamento: "", material: "", preco: 0, ativo: true })
  const [compError, setCompError] = useState("")

  function openNewComp() { setCompEditing(null); setCompData({ sku: "", nome: "", sigla: "", descricao: "", tipo_componente_id: "", tipo_abutment_id: "", parafuso_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, angulacao_graus: 0, tipo: "", tipo_travamento: "", material: "", preco: 0, ativo: true }); setCompError(""); setCompModalOpen(true) }
  function openEditComp(item: any) { setCompEditing(item); setCompData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", tipo_componente_id: item.tipo_componente_id ?? "", tipo_abutment_id: item.tipo_abutment_id ?? "", parafuso_id: item.parafuso_id ?? "", chave_id: item.chave_id ?? "", diametro_plataforma_mm: item.diametro_plataforma_mm ?? 0, altura_transmucoso_mm: item.altura_transmucoso_mm ?? 0, altura_corpo_mm: item.altura_corpo_mm ?? 0, angulacao_graus: item.angulacao_graus ?? 0, tipo: item.tipo ?? "", tipo_travamento: item.tipo_travamento ?? "", material: item.material ?? "", preco: item.preco ?? 0, ativo: item.ativo !== false }); setCompError(""); setCompModalOpen(true) }

  async function handleSaveComp() {
    setCompError("")
    if (!compData.sku.trim()) { setCompError("SKU é obrigatório"); return }
    if (!compData.nome.trim()) { setCompError("Nome é obrigatório"); return }
    if (!compData.tipo_componente_id) { setCompError("Tipo de Componente é obrigatório"); return }
    if (!compData.tipo_abutment_id) { setCompError("Tipo de Abutment é obrigatório"); return }
    if (!compData.parafuso_id) { setCompError("Parafuso é obrigatório"); return }
    const payload = { ...compData, empresa_id: empresaId }
    if (compEditing) {
      const { error } = await supabase.from("catalogo_componentes").update(payload).eq("sku", compEditing.sku).eq("empresa_id", empresaId)
      if (error) { setCompError(error.message); return }
    } else {
      const { error } = await supabase.from("catalogo_componentes").insert(payload)
      if (error) { setCompError(error.message); return }
    }
    toast.success(compEditing ? "Componente atualizado!" : "Componente criado!")
    setCompModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleCompAtivo(sku: string, ativo: boolean) {
    await supabase.from("catalogo_componentes").update({ ativo }).eq("sku", sku).eq("empresa_id", empresaId)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Parafuso modal
  const [parModalOpen, setParModalOpen] = useState(false)
  const [parEditing, setParEditing] = useState<any>(null)
  const [parData, setParData] = useState({ sku: "", nome: "", sigla: "", descricao: "", tipo_parafuso_id: "", chave_id: "", torque_ncm: 0, material: "", preco: 0, ativo: true })
  const [parError, setParError] = useState("")

  function openNewPar() { setParEditing(null); setParData({ sku: "", nome: "", sigla: "", descricao: "", tipo_parafuso_id: "", chave_id: "", torque_ncm: 0, material: "", preco: 0, ativo: true }); setParError(""); setParModalOpen(true) }
  function openEditPar(item: any) { setParEditing(item); setParData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", tipo_parafuso_id: item.tipo_parafuso_id ?? "", chave_id: item.chave_id ?? "", torque_ncm: item.torque_ncm ?? 0, material: item.material ?? "", preco: item.preco ?? 0, ativo: item.ativo !== false }); setParError(""); setParModalOpen(true) }

  async function handleSavePar() {
    setParError("")
    if (!parData.sku.trim()) { setParError("SKU é obrigatório"); return }
    if (!parData.nome.trim()) { setParError("Nome é obrigatório"); return }
    if (!parData.tipo_parafuso_id) { setParError("Tipo de Parafuso é obrigatório"); return }
    const payload = { ...parData, empresa_id: empresaId }
    if (parEditing) {
      const { error } = await supabase.from("catalogo_parafusos").update(payload).eq("sku", parEditing.sku).eq("empresa_id", empresaId)
      if (error) { setParError(error.message); return }
    } else {
      const { error } = await supabase.from("catalogo_parafusos").insert(payload)
      if (error) { setParError(error.message); return }
    }
    toast.success(parEditing ? "Parafuso atualizado!" : "Parafuso criado!")
    setParModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleParAtivo(sku: string, ativo: boolean) {
    await supabase.from("catalogo_parafusos").update({ ativo }).eq("sku", sku).eq("empresa_id", empresaId)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Cicatrizador modal
  const [cicModalOpen, setCicModalOpen] = useState(false)
  const [cicEditing, setCicEditing] = useState<any>(null)
  const [cicData, setCicData] = useState({ sku: "", nome: "", sigla: "", descricao: "", implante_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, torque_ncm: 0, material: "", preco: 0, ativo: true })
  const [cicError, setCicError] = useState("")

  function openNewCic() { setCicEditing(null); setCicData({ sku: "", nome: "", sigla: "", descricao: "", implante_id: "", chave_id: "", diametro_plataforma_mm: 0, altura_transmucoso_mm: 0, altura_corpo_mm: 0, torque_ncm: 0, material: "", preco: 0, ativo: true }); setCicError(""); setCicModalOpen(true) }
  function openEditCic(item: any) { setCicEditing(item); setCicData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", implante_id: item.implante_id ?? "", chave_id: item.chave_id ?? "", diametro_plataforma_mm: item.diametro_plataforma_mm ?? 0, altura_transmucoso_mm: item.altura_transmucoso_mm ?? 0, altura_corpo_mm: item.altura_corpo_mm ?? 0, torque_ncm: item.torque_ncm ?? 0, material: item.material ?? "", preco: item.preco ?? 0, ativo: item.ativo !== false }); setCicError(""); setCicModalOpen(true) }

  async function handleSaveCic() {
    setCicError("")
    if (!cicData.sku.trim()) { setCicError("SKU é obrigatório"); return }
    if (!cicData.nome.trim()) { setCicError("Nome é obrigatório"); return }
    if (!cicData.implante_id) { setCicError("Implante é obrigatório"); return }
    const payload = { ...cicData, empresa_id: empresaId }
    if (cicEditing) {
      const { error } = await supabase.from("catalogo_cicatrizadores").update(payload).eq("sku", cicEditing.sku).eq("empresa_id", empresaId)
      if (error) { setCicError(error.message); return }
    } else {
      const { error } = await supabase.from("catalogo_cicatrizadores").insert(payload)
      if (error) { setCicError(error.message); return }
    }
    toast.success(cicEditing ? "Cicatrizador atualizado!" : "Cicatrizador criado!")
    setCicModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleCicAtivo(sku: string, ativo: boolean) {
    await supabase.from("catalogo_cicatrizadores").update({ ativo }).eq("sku", sku).eq("empresa_id", empresaId)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Modal state - Tipos de Reabilitação
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [nome, setNome] = useState("")
  const [sigla, setSigla] = useState("")
  const [ativo, setAtivo] = useState(true)
  const [familiasIds, setFamiliasIds] = useState<string[]>([])
  const [parentId, setParentId] = useState("")
  const [error, setError] = useState("")
  const [activeModal, setActiveModal] = useState<"reab" | "abutment" | "componente" | "parafuso" | "cicatrizador">("reab")

  // Delete
  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string } | null>(null)

  function openNew() {
    if (subTab === "Tipos de Abutment") { setActiveModal("abutment"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setParentId(""); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Componentes") { setActiveModal("componente"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Parafusos") { setActiveModal("parafuso"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Cicatrizadores") { setActiveModal("cicatrizador"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else { setActiveModal("reab"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setFamiliasIds([]); setError(""); setModalOpen(true) }
  }

  function openEdit(item: any) {
    if (subTab === "Tipos de Abutment") { setActiveModal("abutment"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setParentId(item.tipo_reabilitacao_id ?? ""); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Componentes") { setActiveModal("componente"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Parafusos") { setActiveModal("parafuso"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Cicatrizadores") { setActiveModal("cicatrizador"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else { setActiveModal("reab"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setFamiliasIds([]); setError(""); setModalOpen(true) }
  }

  async function handleSave() {
    setError("")
    if (!nome.trim()) { setError("Nome é obrigatório"); return }

    if (activeModal === "abutment") {
      if (!parentId) { setError("Tipo de Reabilitação é obrigatório"); return }
      const payload = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim() || null, ativo, tipo_reabilitacao_id: parentId }
      if (editing) {
        const { error } = await supabase.from("catalogo_cps_tipos_abutments").update({ nome: payload.nome, sigla: payload.sigla, ativo, tipo_reabilitacao_id: parentId }).eq("id", editing.id)
        if (error) { setError(error.message); return }
      } else {
        const { error } = await supabase.from("catalogo_cps_tipos_abutments").insert(payload)
        if (error) { setError(error.message); return }
      }
      toast.success(editing ? "Tipo de Abutment atualizado!" : "Tipo de Abutment criado!")
    } else if (activeModal === "componente") {
      const payload = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim() || null, ativo }
      if (editing) {
        const { error } = await supabase.from("catalogo_cps_tipos_componentes").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", editing.id)
        if (error) { setError(error.message); return }
      } else {
        const { error } = await supabase.from("catalogo_cps_tipos_componentes").insert(payload)
        if (error) { setError(error.message); return }
      }
      toast.success(editing ? "Tipo de Componente atualizado!" : "Tipo de Componente criado!")
    } else if (activeModal === "parafuso") {
      const payload = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim() || null, ativo }
      if (editing) {
        const { error } = await supabase.from("catalogo_cps_tipos_parafusos").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", editing.id)
        if (error) { setError(error.message); return }
      } else {
        const { error } = await supabase.from("catalogo_cps_tipos_parafusos").insert(payload)
        if (error) { setError(error.message); return }
      }
      toast.success(editing ? "Tipo de Parafuso atualizado!" : "Tipo de Parafuso criado!")
    } else if (activeModal === "cicatrizador") {
      const payload = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim() || null, ativo }
      if (editing) {
        const { error } = await supabase.from("catalogo_cps_tipos_cicatrizadores").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", editing.id)
        if (error) { setError(error.message); return }
      } else {
        const { error } = await supabase.from("catalogo_cps_tipos_cicatrizadores").insert(payload)
        if (error) { setError(error.message); return }
      }
      toast.success(editing ? "Tipo de Cicatrizador atualizado!" : "Tipo de Cicatrizador criado!")
    } else {
      const payload: Record<string, unknown> = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim() || null, ativo }
      if (editing) {
        const { error } = await supabase.from("catalogo_cps_tipos_reabilitacao").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", editing.id)
        if (error) { setError(error.message); return }
      } else {
        const { data, error } = await supabase.from("catalogo_cps_tipos_reabilitacao").insert(payload).select().single()
        if (error) { setError(error.message); return }
        if (data && familiasIds.length > 0) {
          const rows = familiasIds.map(fid => ({ tipo_reabilitacao_id: data.id, familia_id: fid, empresa_id: empresaId }))
          await supabase.from("catalogo_cps_tipos_reabilitacao_familias").insert(rows)
        }
      }
      toast.success(editing ? "Tipo de Reabilitação atualizado!" : "Tipo de Reabilitação criado!")
    }
    setModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function handleDelete() {
    if (!deleteItem) return
    if (deleteItem.table === "catalogo_cps_tipos_reabilitacao") {
      await supabase.from("catalogo_cps_tipos_reabilitacao_familias").delete().eq("tipo_reabilitacao_id", deleteItem.id)
    }
    const { error } = await supabase.from(deleteItem.table).delete().eq("id", deleteItem.id)
    if (error) { toast.error(error.message); return }
    toast.success("Excluído!"); setDeleteItem(null); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <h1 className="text-2xl font-black text-white">Componentes</h1>
          <p className="text-sm mt-1" style={{color:"var(--color-text-muted, #94a3b8)"}}>Gerencie tipos e produtos de componentes protéticos.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SUB_TABS.map(st => <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subTab === st ? "bg-[#c9a655] text-[#0f172a]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-white/5"}`}>{st}</button>)}
        </div>
        <div className="rounded-2xl border bg-[var(--color-surface)]/50 p-6 shadow-xl" style={{borderColor:"rgba(201,166,85,0.15)"}}>
          <div className="flex justify-end mb-4">
            {subTab === "Abutments" ? (
              <button onClick={openNewAbut} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO ABUTMENT</button>
            ) : subTab === "Componentes" ? (
              <button onClick={openNewComp} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO COMPONENTE</button>
            ) : subTab === "Parafusos" ? (
              <button onClick={openNewPar} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO PARAFUSO</button>
            ) : subTab === "Cicatrizadores" ? (
              <button onClick={openNewCic} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO CICATRIZADOR</button>
            ) : (
              <button onClick={openNew} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
            )}
          </div>

          {/* Tabela de Tipos de Reabilitação */}
          {subTab === "Tipos de Reabilitação" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["Nome", "Sigla", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(tiposReab ?? []).map((item, i) => (
                  <TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.sigla ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleTipoReab.mutate({ id: item.id, ativo: !item.ativo })}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.id, label: item.nome, table: "catalogo_cps_tipos_reabilitacao" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(tiposReab ?? []).length === 0 && <TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Tipos de Abutment */}
          {subTab === "Tipos de Abutment" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["Nome", "Sigla", "Tipo de Reabilitação", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(tiposAbutment ?? []).map((item: any, i: number) => (
                  <TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.sigla ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.tipo_reabilitacao?.nome ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleTipoAbutment.mutate({ id: item.id, ativo: !item.ativo })}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.id, label: item.nome, table: "catalogo_cps_tipos_abutments" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(tiposAbutment ?? []).length === 0 && <TableRow><TableCell colSpan={5} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Tipos de Componentes */}
          {subTab === "Tipos de Componentes" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["Nome", "Sigla", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(tiposComponente ?? []).map((item: any, i: number) => (
                  <TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.sigla ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleTipoComponente(item.id, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.id, label: item.nome, table: "catalogo_cps_tipos_componentes" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(tiposComponente ?? []).length === 0 && <TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Tipos de Parafusos */}
          {subTab === "Tipos de Parafusos" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["Nome", "Sigla", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(tiposParafuso ?? []).map((item: any, i: number) => (
                  <TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.sigla ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleTipoParafuso(item.id, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.id, label: item.nome, table: "catalogo_cps_tipos_parafusos" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(tiposParafuso ?? []).length === 0 && <TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Tipos de Cicatrizadores */}
          {subTab === "Tipos de Cicatrizadores" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["Nome", "Sigla", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(tiposCicatrizador ?? []).map((item: any, i: number) => (
                  <TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.sigla ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleTipoCicatrizador(item.id, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.id, label: item.nome, table: "catalogo_cps_tipos_cicatrizadores" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(tiposCicatrizador ?? []).length === 0 && <TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Abutments */}
          {subTab === "Abutments" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["SKU", "Nome", "Tipo", "Ø (mm)", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(abutments ?? []).map((item: any, i: number) => (
                  <TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-mono">{item.sku}</TableCell>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.tipo_abutment?.nome ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.diametro_plataforma_mm ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleAbutAtivo(item.sku, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEditAbut(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.sku, label: item.nome, table: "catalogo_abutments" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(abutments ?? []).length === 0 && <TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhum abutment cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Componentes */}
          {subTab === "Componentes" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["SKU", "Nome", "Tipo Comp.", "Tipo Abut.", "Ø (mm)", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(componentesList ?? []).map((item: any, i: number) => (
                  <TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-mono">{item.sku}</TableCell>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.tipo_componente?.nome ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.tipo_abutment?.nome ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.diametro_plataforma_mm ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleCompAtivo(item.sku, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEditComp(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.sku, label: item.nome, table: "catalogo_componentes" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(componentesList ?? []).length === 0 && <TableRow><TableCell colSpan={7} className="p-4 text-center text-text-muted">Nenhum componente cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Parafusos */}
          {subTab === "Parafusos" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["SKU", "Nome", "Tipo", "Torque", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(parafusosProdutos ?? []).map((item: any, i: number) => (
                  <TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-mono">{item.sku}</TableCell>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.tipo_parafuso?.nome ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.torque_ncm ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleParAtivo(item.sku, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEditPar(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.sku, label: item.nome, table: "catalogo_parafusos" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(parafusosProdutos ?? []).length === 0 && <TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhum parafuso cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Tabela de Cicatrizadores */}
          {subTab === "Cicatrizadores" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["SKU", "Nome", "Implante", "Ø (mm)", "Ativo", "Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(cicatrizadoresProdutos ?? []).map((item: any, i: number) => (
                  <TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-mono">{item.sku}</TableCell>
                    <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.implante?.nome ?? item.implante?.sku ?? "—"}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.diametro_plataforma_mm ?? "—"}</TableCell>
                    <TableCell><button onClick={() => toggleCicAtivo(item.sku, !item.ativo)}>{item.ativo ? <ToggleRight className="h-7 w-7 text-green-400" /> : <ToggleLeft className="h-7 w-7 text-gray-500" />}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={() => openEditCic(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={() => setDeleteItem({ id: item.sku, label: item.nome, table: "catalogo_cicatrizadores" })} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(cicatrizadoresProdutos ?? []).length === 0 && <TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhum cicatrizador cadastrado</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Outras sub-abas (placeholder) */}
          {subTab !== "Tipos de Reabilitação" && subTab !== "Tipos de Abutment" && subTab !== "Tipos de Componentes" && subTab !== "Tipos de Parafusos" && subTab !== "Tipos de Cicatrizadores" && subTab !== "Abutments" && subTab !== "Componentes" && subTab !== "Parafusos" && subTab !== "Cicatrizadores" && (
            <p className="text-center text-text-muted py-8">Em desenvolvimento...</p>
          )}
        </div>
      </div>

      {/* Modal Criar/Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-white">
              {editing ? "Editar" : "Novo"} {activeModal === "abutment" ? "Tipo de Abutment" : activeModal === "componente" ? "Tipo de Componente" : activeModal === "parafuso" ? "Tipo de Parafuso" : activeModal === "cicatrizador" ? "Tipo de Cicatrizador" : "Tipo de Reabilitação"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados do tipo.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* Tipo de Reabilitação (apenas para Abutment) */}
            {activeModal === "abutment" && (
              <div className="space-y-2">
                <label className={labelCls}>Tipo de Reabilitação <span className="text-red-400">*</span></label>
                <select value={parentId} onChange={e => setParentId(e.target.value)} className={selectCls}>
                  <option value="">Selecione...</option>
                  {(tiposReab ?? []).map((t: any) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
            )}
            {/* Nome */}
            <div className="space-y-2">
              <label className={labelCls}>Nome <span className="text-red-400">*</span></label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={inputCls} placeholder={activeModal === "abutment" ? "Ex: hexagonal, abutment..." : "Ex: Coroa, Ponte..."} />
            </div>
            {/* Sigla */}
            <div className="space-y-2">
              <label className={labelCls}>Sigla</label>
              <input type="text" value={sigla} onChange={e => setSigla(e.target.value)} className={inputCls} placeholder="Ex: HEX, CRP" />
            </div>
            {/* Famílias (apenas para Tipos de Reabilitação) */}
            {activeModal === "reab" && (
              <div className="space-y-2">
                <label className={labelCls}>Famílias Compatíveis <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {(familias ?? []).map(f => {
                    const sel = familiasIds.includes(f.id)
                    return <button key={f.id} type="button" onClick={() => setFamiliasIds(sel ? familiasIds.filter(id => id !== f.id) : [...familiasIds, f.id])} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${sel ? "bg-[#c9a655]/20 text-[#c9a655] border-[#c9a655]/30" : "bg-[var(--color-surface)] text-gray-400 border-white/10 hover:border-white/20"}`}>{f.nome}</button>
                  })}
                </div>
              </div>
            )}
            {/* Ativo */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5">
              <div><p className="text-sm font-bold text-white">{ativo ? "Ativo" : "Inativo"}</p><p className="text-xs text-gray-400">Tipo visível no sistema</p></div>
              <Switch checked={ativo} onCheckedChange={setAtivo} />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Excluir */}
      <AlertDialog open={!!deleteItem} onOpenChange={o => !o && setDeleteItem(null)}>
        <AlertDialogContent style={{background:"var(--color-card, #1e293b)",borderColor:"rgba(201,166,85,0.15)"}}>
          <AlertDialogHeader><AlertDialogTitle className="text-white">Excluir tipo?</AlertDialogTitle><AlertDialogDescription><strong>{deleteItem?.nome}</strong> será removido permanentemente.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Excluir</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Abutment */}
      <Dialog open={abutModalOpen} onOpenChange={setAbutModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{abutEditing ? "Editar" : "Novo"} Abutment</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Vinculações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Tipo de Abutment *</label><select value={abutData.tipo_abutment_id} onChange={e=>setAbutData({...abutData,tipo_abutment_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposAbutment?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Parafuso *</label><select value={abutData.parafuso_id} onChange={e=>setAbutData({...abutData,parafuso_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{parafusosList?.map((p:any)=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Chave</label><select value={abutData.chave_id} onChange={e=>setAbutData({...abutData,chave_id:e.target.value})} className={selectCls}><option value="">Nenhuma</option>{chavesList?.map((c:any)=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={abutData.sku} onChange={e=>setAbutData({...abutData,sku:e.target.value})} className={inputCls} placeholder="Ex: ABT-001" /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={abutData.nome} onChange={e=>setAbutData({...abutData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={abutData.sigla} onChange={e=>setAbutData({...abutData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={abutData.descricao} onChange={e=>setAbutData({...abutData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Ø Plataforma (mm)</label><input type="number" step="0.1" value={abutData.diametro_plataforma_mm} onChange={e=>setAbutData({...abutData,diametro_plataforma_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Transmucoso (mm)</label><input type="number" step="0.1" value={abutData.altura_transmucoso_mm} onChange={e=>setAbutData({...abutData,altura_transmucoso_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Corpo (mm)</label><input type="number" step="0.1" value={abutData.altura_corpo_mm} onChange={e=>setAbutData({...abutData,altura_corpo_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Ângulo (graus)</label><input type="number" value={abutData.angulacao_graus} onChange={e=>setAbutData({...abutData,angulacao_graus:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Torque (N·cm)</label><input type="number" value={abutData.torque_ncm} onChange={e=>setAbutData({...abutData,torque_ncm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={abutData.material} onChange={e=>setAbutData({...abutData,material:e.target.value})} className={inputCls} placeholder="Ex: Titânio" /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="abutment" produtoSku={abutData.sku} empresaId={empresaId} />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={abutData.preco} onChange={e=>setAbutData({...abutData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{abutData.ativo ? "Ativo" : "Inativo"}</p></div>
                <Switch checked={abutData.ativo} onCheckedChange={v=>setAbutData({...abutData,ativo:v})} />
              </div>
            </div>
            {abutError && <p className="text-sm text-red-400 text-center">{abutError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setAbutModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveAbut} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Componente */}
      <Dialog open={compModalOpen} onOpenChange={setCompModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{compEditing ? "Editar" : "Novo"} Componente</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Vinculações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Tipo de Componente *</label><select value={compData.tipo_componente_id} onChange={e=>setCompData({...compData,tipo_componente_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposComponente?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Tipo de Abutment *</label><select value={compData.tipo_abutment_id} onChange={e=>setCompData({...compData,tipo_abutment_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposAbutment?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Parafuso *</label><select value={compData.parafuso_id} onChange={e=>setCompData({...compData,parafuso_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{parafusosList?.map((p:any)=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Chave</label><select value={compData.chave_id} onChange={e=>setCompData({...compData,chave_id:e.target.value})} className={selectCls}><option value="">Nenhuma</option>{chavesList?.map((c:any)=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={compData.sku} onChange={e=>setCompData({...compData,sku:e.target.value})} className={inputCls} placeholder="Ex: CPS-001" /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={compData.nome} onChange={e=>setCompData({...compData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={compData.sigla} onChange={e=>setCompData({...compData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={compData.descricao} onChange={e=>setCompData({...compData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Ø Plataforma (mm)</label><input type="number" step="0.1" value={compData.diametro_plataforma_mm} onChange={e=>setCompData({...compData,diametro_plataforma_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Transmucoso (mm)</label><input type="number" step="0.1" value={compData.altura_transmucoso_mm} onChange={e=>setCompData({...compData,altura_transmucoso_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Corpo (mm)</label><input type="number" step="0.1" value={compData.altura_corpo_mm} onChange={e=>setCompData({...compData,altura_corpo_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Ângulo (graus)</label><input type="number" value={compData.angulacao_graus} onChange={e=>setCompData({...compData,angulacao_graus:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Tipo</label><input type="text" value={compData.tipo} onChange={e=>setCompData({...compData,tipo:e.target.value})} className={inputCls} placeholder="Ex: Hexagonal" /></div>
              <div className="space-y-2"><label className={labelCls}>Tipo Travamento</label><input type="text" value={compData.tipo_travamento} onChange={e=>setCompData({...compData,tipo_travamento:e.target.value})} className={inputCls} placeholder="Ex: Rosca" /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={compData.material} onChange={e=>setCompData({...compData,material:e.target.value})} className={inputCls} placeholder="Ex: Titânio" /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="componente" produtoSku={compData.sku} empresaId={empresaId} />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={compData.preco} onChange={e=>setCompData({...compData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{compData.ativo ? "Ativo" : "Inativo"}</p></div>
                <Switch checked={compData.ativo} onCheckedChange={v=>setCompData({...compData,ativo:v})} />
              </div>
            </div>
            {compError && <p className="text-sm text-red-400 text-center">{compError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setCompModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveComp} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Parafuso */}
      <Dialog open={parModalOpen} onOpenChange={setParModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{parEditing ? "Editar" : "Novo"} Parafuso</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Vinculações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Tipo de Parafuso *</label><select value={parData.tipo_parafuso_id} onChange={e=>setParData({...parData,tipo_parafuso_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposParafuso?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Chave</label><select value={parData.chave_id} onChange={e=>setParData({...parData,chave_id:e.target.value})} className={selectCls}><option value="">Nenhuma</option>{chavesList?.map((c:any)=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={parData.sku} onChange={e=>setParData({...parData,sku:e.target.value})} className={inputCls} placeholder="Ex: PAR-001" /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={parData.nome} onChange={e=>setParData({...parData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={parData.sigla} onChange={e=>setParData({...parData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={parData.descricao} onChange={e=>setParData({...parData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Torque (N·cm)</label><input type="number" value={parData.torque_ncm} onChange={e=>setParData({...parData,torque_ncm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={parData.material} onChange={e=>setParData({...parData,material:e.target.value})} className={inputCls} placeholder="Ex: Titânio" /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="parafuso" produtoSku={parData.sku} empresaId={empresaId} />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={parData.preco} onChange={e=>setParData({...parData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{parData.ativo ? "Ativo" : "Inativo"}</p></div>
                <Switch checked={parData.ativo} onCheckedChange={v=>setParData({...parData,ativo:v})} />
              </div>
            </div>
            {parError && <p className="text-sm text-red-400 text-center">{parError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setParModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSavePar} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Cicatrizador */}
      <Dialog open={cicModalOpen} onOpenChange={setCicModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{cicEditing ? "Editar" : "Novo"} Cicatrizador</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Vinculações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Implante *</label><select value={cicData.implante_id} onChange={e=>setCicData({...cicData,implante_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{implantesList?.map((im:any)=><option key={im.id} value={im.id}>{im.sku} - {im.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Chave</label><select value={cicData.chave_id} onChange={e=>setCicData({...cicData,chave_id:e.target.value})} className={selectCls}><option value="">Nenhuma</option>{chavesList?.map((c:any)=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={cicData.sku} onChange={e=>setCicData({...cicData,sku:e.target.value})} className={inputCls} placeholder="Ex: CIC-001" /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={cicData.nome} onChange={e=>setCicData({...cicData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={cicData.sigla} onChange={e=>setCicData({...cicData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={cicData.descricao} onChange={e=>setCicData({...cicData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Ø Plataforma (mm)</label><input type="number" step="0.1" value={cicData.diametro_plataforma_mm} onChange={e=>setCicData({...cicData,diametro_plataforma_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Transmucoso (mm)</label><input type="number" step="0.1" value={cicData.altura_transmucoso_mm} onChange={e=>setCicData({...cicData,altura_transmucoso_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Altura Corpo (mm)</label><input type="number" step="0.1" value={cicData.altura_corpo_mm} onChange={e=>setCicData({...cicData,altura_corpo_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Torque (N·cm)</label><input type="number" value={cicData.torque_ncm} onChange={e=>setCicData({...cicData,torque_ncm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={cicData.material} onChange={e=>setCicData({...cicData,material:e.target.value})} className={inputCls} placeholder="Ex: Titânio" /></div>
            </div>
            {/* Imagens do Produto */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="cicatrizador" produtoSku={cicData.sku} empresaId={empresaId} />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={cicData.preco} onChange={e=>setCicData({...cicData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{cicData.ativo ? "Ativo" : "Inativo"}</p></div>
                <Switch checked={cicData.ativo} onCheckedChange={v=>setCicData({...cicData,ativo:v})} />
              </div>
            </div>
            {cicError && <p className="text-sm text-red-400 text-center">{cicError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setCicModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveCic} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
