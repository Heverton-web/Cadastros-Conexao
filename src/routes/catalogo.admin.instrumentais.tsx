import { EMPRESA_ID } from "~/config/empresa"
import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { Switch } from "~/components/ui/switch"
import { ImageUploader } from "~/features/catalogo/components/admin/produtos/ImageUploader"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import toast from "react-hot-toast"

export const catalogoAdminInstrumentaisRoute = createRoute({
  getParentRoute: () => authLayout, path: "/catalogo/admin/instrumentais",
  component: () => (<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}><EmpresaCrudGuard><AdminInstrumentaisPage /></EmpresaCrudGuard></RequirePermission>),
})

const SUB_TABS = ["Tipos de Chaves", "Tipos de Fresas", "Tipos Complementares", "Tipos Opcionais", "Chaves", "Fresas", "Complementares", "Opcionais"]
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

function AdminInstrumentaisPage() {
  const [subTab, setSubTab] = useState("Tipos de Chaves")
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()

  // Data
  const { data: tiposChave } = useQuery({ queryKey: ["catalogo", "tipos-chave"], queryFn: async () => { const { data } = await supabase.from("catalogo_tipos_chaves").select("*").order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposFresa } = useQuery({ queryKey: ["catalogo", "tipos-fresa"], queryFn: async () => { const { data } = await supabase.from("catalogo_tipos_fresas").select("*").order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: chaves } = useQuery({ queryKey: ["catalogo", "chaves-list2"], queryFn: async () => { const { data } = await supabase.from("catalogo_chaves").select("*, tipo_chave:catalogo_tipos_chaves(*)").order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: fresas } = useQuery({ queryKey: ["catalogo", "fresas-list2"], queryFn: async () => { const { data } = await supabase.from("catalogo_fresas").select("*, tipo_fresa:catalogo_tipos_fresas(*)").order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposComplementar } = useQuery({ queryKey: ["catalogo", "tipos-complementar"], queryFn: async () => { const { data } = await supabase.from("catalogo_tipos_complementares").select("*").order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: complementares } = useQuery({ queryKey: ["catalogo", "complementares-list"], queryFn: async () => { const { data } = await supabase.from("catalogo_complementares").select("*, tipo_complementar:catalogo_tipos_complementares(*)").order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: tiposOpcional } = useQuery({ queryKey: ["catalogo", "tipos-opcional"], queryFn: async () => { const { data } = await supabase.from("catalogo_tipos_opcionais").select("*").order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: opcionais } = useQuery({ queryKey: ["catalogo", "opcionais-list"], queryFn: async () => { const { data } = await supabase.from("catalogo_opcionais").select("*, tipo_opcional:catalogo_tipos_opcionais(*)").order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [nome, setNome] = useState("")
  const [sigla, setSigla] = useState("")
  const [ativo, setAtivo] = useState(true)
  const [error, setError] = useState("")
  const [activeModal, setActiveModal] = useState<"tipo_chave" | "tipo_fresa" | "tipo_complementar" | "tipo_opcional" | "chave" | "fresa" | "complementar" | "opcional">("tipo_chave")

  // Product modal state
  const [prodModalOpen, setProdModalOpen] = useState(false)
  const [prodEditing, setProdEditing] = useState<any>(null)
  const [prodData, setProdData] = useState({ sku: "", nome: "", sigla: "", descricao: "", tipo_chave_id: "", tipo_fresa_id: "", tipo_complementar_id: "", tipo_opcional_id: "", kit_id: "", tipo: "", comprimento: "", diametro_mm: 0, material: "", preco: 0, ativo: true })
  const [prodError, setProdError] = useState("")

  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string } | null>(null)

  // Type handlers
  function openNew() {
    if (subTab === "Tipos de Chaves") { setActiveModal("tipo_chave"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Fresas") { setActiveModal("tipo_fresa"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos Complementares") { setActiveModal("tipo_complementar"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos Opcionais") { setActiveModal("tipo_opcional"); setEditing(null); setNome(""); setSigla(""); setAtivo(true); setError(""); setModalOpen(true) }
  }

  function openEdit(item: any) {
    if (subTab === "Tipos de Chaves") { setActiveModal("tipo_chave"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos de Fresas") { setActiveModal("tipo_fresa"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos Complementares") { setActiveModal("tipo_complementar"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
    else if (subTab === "Tipos Opcionais") { setActiveModal("tipo_opcional"); setEditing(item); setNome(item.nome); setSigla(item.sigla ?? ""); setAtivo(item.ativo !== false); setError(""); setModalOpen(true) }
  }

  async function handleSave() {
    setError("")
    if (!nome.trim()) { setError("Nome é obrigatório"); return }
    const table = activeModal === "tipo_chave" ? "catalogo_tipos_chaves" : activeModal === "tipo_fresa" ? "catalogo_tipos_fresas" : activeModal === "tipo_complementar" ? "catalogo_tipos_complementares" : "catalogo_tipos_opcionais"
    const payload = { nome: nome.trim(), sigla: sigla.trim() || null, ativo }
    if (editing) { const { error } = await supabase.from(table).update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", editing.id); if (error) { setError(error.message); return } }
    else { const { error } = await supabase.from(table).insert(payload); if (error) { setError(error.message); return } }
    toast.success(editing ? "Atualizado!" : "Criado!")
    setModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function handleDelete() {
    if (!deleteItem) return
    const { error } = await supabase.from(deleteItem.table).delete().eq("id", deleteItem.id)
    if (error) { toast.error(error.message); return }
    toast.success("Excluído!"); setDeleteItem(null); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Product handlers
  function openNewProd() {
    if (subTab === "Chaves" || subTab === "Fresas" || subTab === "Complementares" || subTab === "Opcionais") { setProdEditing(null); setProdData({ sku: "", nome: "", sigla: "", descricao: "", tipo_chave_id: "", tipo_fresa_id: "", tipo_complementar_id: "", tipo_opcional_id: "", kit_id: "", tipo: "", comprimento: "", diametro_mm: 0, material: "", preco: 0, ativo: true }); setProdError(""); setProdModalOpen(true) }
  }

  function openEditProd(item: any) {
    setProdEditing(item); setProdData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", tipo_chave_id: item.tipo_chave_id ?? "", tipo_fresa_id: item.tipo_fresa_id ?? "", tipo_complementar_id: item.tipo_complementar_id ?? "", tipo_opcional_id: item.tipo_opcional_id ?? "", kit_id: item.kit_id ?? "", tipo: item.tipo ?? "", comprimento: item.comprimento ?? "", diametro_mm: item.diametro_mm ?? 0, material: item.material ?? "", preco: item.preco ?? 0, ativo: item.ativo !== false }); setProdError(""); setProdModalOpen(true)
  }

  async function handleSaveProd() {
    setProdError("")
    if (!prodData.sku.trim()) { setProdError("SKU é obrigatório"); return }
    if (!prodData.nome.trim()) { setProdError("Nome é obrigatório"); return }
    const table = subTab === "Chaves" ? "catalogo_chaves" : subTab === "Fresas" ? "catalogo_fresas" : subTab === "Complementares" ? "catalogo_complementares" : "catalogo_opcionais"
    
    const payload: any = { 
      sku: prodData.sku.trim(),
      nome: prodData.nome.trim(),
      sigla: prodData.sigla?.trim() || null,
      descricao: prodData.descricao?.trim() || null,
      tipo: prodData.tipo?.trim() || null,
      comprimento: prodData.comprimento?.trim() || null,
      diametro_mm: prodData.diametro_mm || null,
      material: prodData.material?.trim() || null,
      preco: prodData.preco || 0,
      ativo: prodData.ativo
    }

    if (prodData.kit_id) payload.kit_id = prodData.kit_id

    if (subTab === "Chaves") {
      if (prodData.tipo_chave_id) payload.tipo_chave_id = prodData.tipo_chave_id
    } else if (subTab === "Fresas") {
      if (prodData.tipo_fresa_id) payload.tipo_fresa_id = prodData.tipo_fresa_id
    } else if (subTab === "Complementares") {
      if (prodData.tipo_complementar_id) payload.tipo_complementar_id = prodData.tipo_complementar_id
    } else if (subTab === "Opcionais") {
      if (prodData.tipo_opcional_id) payload.tipo_opcional_id = prodData.tipo_opcional_id
    }

    if (prodEditing) { const { error } = await supabase.from(table).update(payload).eq("sku", prodEditing.sku); if (error) { setProdError(error.message); return } }
    else { const { error } = await supabase.from(table).insert(payload); if (error) { setProdError(error.message); return } }
    toast.success(prodEditing ? "Atualizado!" : "Criado!")
    setProdModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleProdAtivo(sku: string, ativo: boolean) {
    const table = subTab === "Chaves" ? "catalogo_chaves" : subTab === "Fresas" ? "catalogo_fresas" : subTab === "Complementares" ? "catalogo_complementares" : "catalogo_opcionais"
    await supabase.from(table).update({ ativo }).eq("sku", sku)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function toggleTypeAtivo(id: string, ativo: boolean, table: string) {
    await supabase.from(table).update({ ativo }).eq("id", id)
    qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <h1 className="text-2xl font-black text-white">Instrumentais</h1>
          <p className="text-sm mt-1" style={{color:"var(--color-text-muted, #94a3b8)"}}>Gerencie tipos e produtos de instrumentais.</p>
        </div>
        <div className="flex gap-2 flex-wrap">{SUB_TABS.map(st => <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subTab === st ? "bg-[#c9a655] text-[#0f172a]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-white/5"}`}>{st}</button>)}</div>
        <div className="rounded-2xl border bg-[var(--color-surface)]/50 p-6 shadow-xl" style={{borderColor:"rgba(201,166,85,0.15)"}}>
          <div className="flex justify-end mb-4">
            {(subTab === "Chaves" || subTab === "Fresas" || subTab === "Complementares" || subTab === "Opcionais") ? (
              <button onClick={openNewProd} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
            ) : (
              <button onClick={openNew} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
            )}
          </div>

          {/* Tipos de Chaves */}
          {subTab === "Tipos de Chaves" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposChave??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleTypeAtivo(item.id,!item.ativo,"catalogo_tipos_chaves")}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_tipos_chaves"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposChave??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Tipos Opcionais */}
          {subTab === "Tipos Opcionais" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposOpcional??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleTypeAtivo(item.id,!item.ativo,"catalogo_tipos_opcionais")}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_tipos_opcionais"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposOpcional??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Opcionais */}
          {subTab === "Opcionais" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["SKU","Nome","Tipo","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(opcionais??[]).map((item:any,i:number)=><TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-mono">{item.sku}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_opcional?.nome??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleProdAtivo(item.sku,!item.ativo)}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditProd(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.sku,label:item.nome,table:"catalogo_opcionais"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(opcionais??[]).length===0&&<TableRow><TableCell colSpan={5} className="p-4 text-center text-text-muted">Nenhum opcional cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Chaves */}
          {subTab === "Chaves" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["SKU","Nome","Tipo","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(chaves??[]).map((item:any,i:number)=><TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-mono">{item.sku}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_chave?.nome??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleProdAtivo(item.sku,!item.ativo)}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditProd(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.sku,label:item.nome,table:"catalogo_chaves"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(chaves??[]).length===0&&<TableRow><TableCell colSpan={5} className="p-4 text-center text-text-muted">Nenhuma chave cadastrada</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Tipos de Fresas */}
          {subTab === "Tipos de Fresas" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposFresa??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleTypeAtivo(item.id,!item.ativo,"catalogo_tipos_fresas")}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_tipos_fresas"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposFresa??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Tipos Complementares */}
          {subTab === "Tipos Complementares" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposComplementar??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleTypeAtivo(item.id,!item.ativo,"catalogo_tipos_complementares")}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_tipos_complementares"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposComplementar??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Complementares */}
          {subTab === "Complementares" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["SKU","Nome","Tipo","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(complementares??[]).map((item:any,i:number)=><TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-mono">{item.sku}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_complementar?.nome??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleProdAtivo(item.sku,!item.ativo)}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditProd(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.sku,label:item.nome,table:"catalogo_complementares"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(complementares??[]).length===0&&<TableRow><TableCell colSpan={5} className="p-4 text-center text-text-muted">Nenhum complementar cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Fresas */}
          {subTab === "Fresas" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["SKU","Nome","Tipo","Ø (mm)","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(fresas??[]).map((item:any,i:number)=><TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-mono">{item.sku}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_fresa?.nome??"—"}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.diametro_mm??"—"}</TableCell>
              <TableCell><button onClick={()=>toggleProdAtivo(item.sku,!item.ativo)}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditProd(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.sku,label:item.nome,table:"catalogo_fresas"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(fresas??[]).length===0&&<TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhuma fresa cadastrada</TableCell></TableRow>}</TableBody></Table>
          )}
        </div>
      </div>

      {/* Modal Tipo */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{editing?"Editar":"Novo"} {activeModal==="tipo_chave"?"Tipo de Chave":activeModal==="tipo_fresa"?"Tipo de Fresa":activeModal==="tipo_complementar"?"Tipo Complementar":"Tipo Opcional"}</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="space-y-2"><label className={labelCls}>Nome <span className="text-red-400">*</span></label><input type="text" value={nome} onChange={e=>setNome(e.target.value)} className={inputCls} /></div>
            <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={sigla} onChange={e=>setSigla(e.target.value)} className={inputCls} /></div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5">
              <div><p className="text-sm font-bold text-white">{ativo?"Ativo":"Inativo"}</p></div>
              <Switch checked={ativo} onCheckedChange={setAtivo} />
            </div>
            {error&&<p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Produto */}
      <Dialog open={prodModalOpen} onOpenChange={setProdModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{prodEditing?"Editar":"Novo"} {subTab==="Chaves"?"Chave":subTab==="Fresas"?"Fresa":subTab==="Complementares"?"Complementar":"Opcional"}</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Vinculações</h3>
            <div className="space-y-2">
              <label className={labelCls}>Tipo {subTab==="Chaves"?"de Chave":subTab==="Fresas"?"de Fresa":subTab==="Complementares"?"Complementar":"Opcional"} *</label>
              <select value={subTab==="Chaves"?prodData.tipo_chave_id:subTab==="Fresas"?prodData.tipo_fresa_id:subTab==="Complementares"?prodData.tipo_complementar_id:prodData.tipo_opcional_id} onChange={e=>subTab==="Chaves"?setProdData({...prodData,tipo_chave_id:e.target.value}):subTab==="Fresas"?setProdData({...prodData,tipo_fresa_id:e.target.value}):subTab==="Complementares"?setProdData({...prodData,tipo_complementar_id:e.target.value}):setProdData({...prodData,tipo_opcional_id:e.target.value})} className={selectCls}>
                <option value="">Selecione...</option>
                {(subTab==="Chaves"?tiposChave:subTab==="Fresas"?tiposFresa:subTab==="Complementares"?tiposComplementar:tiposOpcional)?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Vincular a Kit</label>
              <select value={prodData.kit_id} onChange={e=>setProdData({...prodData,kit_id:e.target.value})} className={selectCls}>
                <option value="">Nenhum</option>
              </select>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={prodData.sku} onChange={e=>setProdData({...prodData,sku:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={prodData.nome} onChange={e=>setProdData({...prodData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={prodData.sigla} onChange={e=>setProdData({...prodData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={prodData.descricao} onChange={e=>setProdData({...prodData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Tipo</label><input type="text" value={prodData.tipo} onChange={e=>setProdData({...prodData,tipo:e.target.value})} className={inputCls} placeholder="Ex: Hexagonal" /></div>
              <div className="space-y-2"><label className={labelCls}>Comprimento</label><input type="text" value={prodData.comprimento} onChange={e=>setProdData({...prodData,comprimento:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Ø (mm)</label><input type="number" step="0.1" value={prodData.diametro_mm} onChange={e=>setProdData({...prodData,diametro_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={prodData.material} onChange={e=>setProdData({...prodData,material:e.target.value})} className={inputCls} /></div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo={subTab==="Chaves"?"chave":subTab==="Fresas"?"fresa":subTab==="Complementares"?"complementar":"opcional"} produtoSku={prodData.sku} />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={prodData.preco} onChange={e=>setProdData({...prodData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{prodData.ativo?"Ativo":"Inativo"}</p></div>
                <Switch checked={prodData.ativo} onCheckedChange={v=>setProdData({...prodData,ativo:v})} />
              </div>
            </div>
            {prodError&&<p className="text-sm text-red-400 text-center">{prodError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setProdModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveProd} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Excluir */}
      <AlertDialog open={!!deleteItem} onOpenChange={o=>!o&&setDeleteItem(null)}>
        <AlertDialogContent style={{background:"var(--color-card, #1e293b)",borderColor:"rgba(201,166,85,0.15)"}}>
          <AlertDialogHeader><AlertDialogTitle className="text-white">Excluir?</AlertDialogTitle><AlertDialogDescription><strong>{deleteItem?.label}</strong> será removido.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Excluir</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
