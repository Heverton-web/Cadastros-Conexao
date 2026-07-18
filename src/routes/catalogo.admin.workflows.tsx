import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState } from "react"
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { Switch } from "~/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import toast from "react-hot-toast"

export const catalogoAdminWorkflowsRoute = createRoute({
  getParentRoute: () => authLayout, path: "/catalogo/admin/workflows",
  component: () => (<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}><EmpresaCrudGuard><AdminWorkflowsPage /></EmpresaCrudGuard></RequirePermission>),
})

const SUB_TABS = ["Tipos de Workflow", "Etapas do Workflow"]
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

function AdminWorkflowsPage() {
  const [subTab, setSubTab] = useState("Tipos de Workflow")
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()

  const { data: tiposWorkflow } = useQuery({ queryKey: ["catalogo", "tipos-workflow"], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_tipos_workflows").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: etapas } = useQuery({ queryKey: ["catalogo", "etapas-workflow"], queryFn: async () => { const { data } = await supabase.from("catalogo_cps_etapas_workflows").select("*, tipo_workflow:catalogo_cps_tipos_workflows(*)").eq("empresa_id", empresaId).order("ordem"); return (data ?? []) as any[] }, enabled: !!empresaId })

  // Tipo modal
  const [tipoModalOpen, setTipoModalOpen] = useState(false)
  const [tipoEditing, setTipoEditing] = useState<any>(null)
  const [tipoNome, setTipoNome] = useState("")
  const [tipoSigla, setTipoSigla] = useState("")
  const [tipoAtivo, setTipoAtivo] = useState(true)
  const [tipoError, setTipoError] = useState("")

  // Etapa modal
  const [etapaModalOpen, setEtapaModalOpen] = useState(false)
  const [etapaEditing, setEtapaEditing] = useState<any>(null)
  const [etapaData, setEtapaData] = useState({ tipo_workflow_id: "", nome: "", sigla: "", ordem: 1, ativo: true })
  const [etapaError, setEtapaError] = useState("")

  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string } | null>(null)

  // Tipo handlers
  function openNewTipo() { setTipoEditing(null); setTipoNome(""); setTipoSigla(""); setTipoAtivo(true); setTipoError(""); setTipoModalOpen(true) }
  function openEditTipo(item: any) { setTipoEditing(item); setTipoNome(item.nome); setTipoSigla(item.sigla ?? ""); setTipoAtivo(item.ativo !== false); setTipoError(""); setTipoModalOpen(true) }

  async function handleSaveTipo() {
    setTipoError("")
    if (!tipoNome.trim()) { setTipoError("Nome é obrigatório"); return }
    const payload = { empresa_id: empresaId, nome: tipoNome.trim(), sigla: tipoSigla.trim() || null, ativo: tipoAtivo }
    if (tipoEditing) { const { error } = await supabase.from("catalogo_cps_tipos_workflows").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", tipoEditing.id); if (error) { setTipoError(error.message); return } }
    else { const { error } = await supabase.from("catalogo_cps_tipos_workflows").insert(payload); if (error) { setTipoError(error.message); return } }
    toast.success(tipoEditing ? "Atualizado!" : "Criado!")
    setTipoModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Etapa handlers
  function openNewEtapa() { setEtapaEditing(null); setEtapaData({ tipo_workflow_id: "", nome: "", sigla: "", ordem: 1, ativo: true }); setEtapaError(""); setEtapaModalOpen(true) }
  function openEditEtapa(item: any) { setEtapaEditing(item); setEtapaData({ tipo_workflow_id: item.tipo_workflow_id ?? "", nome: item.nome, sigla: item.sigla ?? "", ordem: item.ordem ?? 1, ativo: item.ativo !== false }); setEtapaError(""); setEtapaModalOpen(true) }

  async function handleSaveEtapa() {
    setEtapaError("")
    if (!etapaData.nome.trim()) { setEtapaError("Nome é obrigatório"); return }
    if (!etapaData.tipo_workflow_id) { setEtapaError("Tipo de Workflow é obrigatório"); return }
    const payload = { ...etapaData, empresa_id: empresaId }
    if (etapaEditing) { const { error } = await supabase.from("catalogo_cps_etapas_workflows").update(payload).eq("id", etapaEditing.id); if (error) { setEtapaError(error.message); return } }
    else { const { error } = await supabase.from("catalogo_cps_etapas_workflows").insert(payload); if (error) { setEtapaError(error.message); return } }
    toast.success(etapaEditing ? "Atualizada!" : "Criada!")
    setEtapaModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function handleDelete() {
    if (!deleteItem) return
    const { error } = await supabase.from(deleteItem.table).delete().eq("id", deleteItem.id)
    if (error) { toast.error(error.message); return }
    toast.success("Excluído!"); setDeleteItem(null); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <h1 className="text-2xl font-black text-white">Workflows</h1>
          <p className="text-sm mt-1" style={{color:"var(--color-text-muted, #94a3b8)"}}>Gerencie tipos de workflow e etapas.</p>
        </div>
        <div className="flex gap-2 flex-wrap">{SUB_TABS.map(st => <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subTab === st ? "bg-[#c9a655] text-[#0f172a]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-white/5"}`}>{st}</button>)}</div>
        <div className="rounded-2xl border bg-[var(--color-surface)]/50 p-6 shadow-xl" style={{borderColor:"rgba(201,166,85,0.15)"}}>
          <div className="flex justify-end mb-4">
            <button onClick={subTab === "Tipos de Workflow" ? openNewTipo : openNewEtapa} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
          </div>

          {/* Tipos de Workflow */}
          {subTab === "Tipos de Workflow" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposWorkflow??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={async()=>{await supabase.from("catalogo_cps_tipos_workflows").update({ativo:!item.ativo}).eq("id",item.id);qc.invalidateQueries({queryKey:["catalogo"]})}}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditTipo(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_cps_tipos_workflows"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposWorkflow??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Etapas do Workflow */}
          {subTab === "Etapas do Workflow" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Ordem","Nome","Sigla","Tipo Workflow","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(etapas??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-bold text-[#c9a655]">{item.ordem}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_workflow?.nome??"—"}</TableCell>
              <TableCell><button onClick={async()=>{await supabase.from("catalogo_cps_etapas_workflows").update({ativo:!item.ativo}).eq("id",item.id);qc.invalidateQueries({queryKey:["catalogo"]})}}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditEtapa(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_cps_etapas_workflows"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(etapas??[]).length===0&&<TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhuma etapa cadastrada</TableCell></TableRow>}</TableBody></Table>
          )}
        </div>
      </div>

      {/* Modal Tipo de Workflow */}
      <Dialog open={tipoModalOpen} onOpenChange={setTipoModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{tipoEditing?"Editar":"Novo"} Tipo de Workflow</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="space-y-2"><label className={labelCls}>Nome <span className="text-red-400">*</span></label><input type="text" value={tipoNome} onChange={e=>setTipoNome(e.target.value)} className={inputCls} /></div>
            <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={tipoSigla} onChange={e=>setTipoSigla(e.target.value)} className={inputCls} /></div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5">
              <div><p className="text-sm font-bold text-white">{tipoAtivo?"Ativo":"Inativo"}</p></div>
              <Switch checked={tipoAtivo} onCheckedChange={setTipoAtivo} />
            </div>
            {tipoError&&<p className="text-sm text-red-400 text-center">{tipoError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setTipoModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveTipo} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Etapa do Workflow */}
      <Dialog open={etapaModalOpen} onOpenChange={setEtapaModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{etapaEditing?"Editar":"Nova"} Etapa do Workflow</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="space-y-2"><label className={labelCls}>Tipo de Workflow <span className="text-red-400">*</span></label><select value={etapaData.tipo_workflow_id} onChange={e=>setEtapaData({...etapaData,tipo_workflow_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposWorkflow?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
            <div className="space-y-2"><label className={labelCls}>Nome <span className="text-red-400">*</span></label><input type="text" value={etapaData.nome} onChange={e=>setEtapaData({...etapaData,nome:e.target.value})} className={inputCls} /></div>
            <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={etapaData.sigla} onChange={e=>setEtapaData({...etapaData,sigla:e.target.value})} className={inputCls} /></div>
            <div className="space-y-2"><label className={labelCls}>Ordem</label><input type="number" min="1" value={etapaData.ordem} onChange={e=>setEtapaData({...etapaData,ordem:Number(e.target.value)})} className={inputCls} /></div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5">
              <div><p className="text-sm font-bold text-white">{etapaData.ativo?"Ativo":"Inativo"}</p></div>
              <Switch checked={etapaData.ativo} onCheckedChange={v=>setEtapaData({...etapaData,ativo:v})} />
            </div>
            {etapaError&&<p className="text-sm text-red-400 text-center">{etapaError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setEtapaModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveEtapa} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
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
