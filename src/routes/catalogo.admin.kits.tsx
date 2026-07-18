import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft, X, CheckSquare, Square } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog"
import { Switch } from "~/components/ui/switch"
import { ImageUploader } from "~/features/catalogo/components/admin/produtos/ImageUploader"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import toast from "react-hot-toast"

export const catalogoAdminKitsRoute = createRoute({
  getParentRoute: () => authLayout, path: "/catalogo/admin/kits",
  component: () => (<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}><EmpresaCrudGuard><AdminKitsPage /></EmpresaCrudGuard></RequirePermission>),
})

const SUB_TABS = ["Tipos de Kit", "Kits"]
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

function AdminKitsPage() {
  const [subTab, setSubTab] = useState("Tipos de Kit")
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()

  // Data
  const { data: tiposKit } = useQuery({ queryKey: ["catalogo", "tipos-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_tipos_kits").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: kits } = useQuery({ queryKey: ["catalogo", "kits-list"], queryFn: async () => { const { data } = await supabase.from("catalogo_kits").select("*, tipo_kit:catalogo_tipos_kits(*)").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: chavesList } = useQuery({ queryKey: ["catalogo", "chaves-for-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_chaves").select("sku, nome").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: fresasList } = useQuery({ queryKey: ["catalogo", "fresas-for-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_fresas").select("sku, nome").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: complementaresList } = useQuery({ queryKey: ["catalogo", "complementares-for-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_complementares").select("sku, nome").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: opcionaisList } = useQuery({ queryKey: ["catalogo", "opcionais-for-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_opcionais").select("sku, nome").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: implantesList } = useQuery({ queryKey: ["catalogo", "implantes-for-kit"], queryFn: async () => { const { data } = await supabase.from("catalogo_implantes").select("sku, nome, diametro_mm, conexao_id, familia_id, linha_id, conexao:catalogo_ips_conexoes!inner(nome), familia:catalogo_ips_familias!inner(nome), linha:catalogo_ips_linhas!inner(nome)").eq("empresa_id", empresaId).eq("ativo", true).order("sku"); return (data ?? []) as any[] }, enabled: !!empresaId })

  // Type modal
  const [tipoModalOpen, setTipoModalOpen] = useState(false)
  const [tipoEditing, setTipoEditing] = useState<any>(null)
  const [tipoNome, setTipoNome] = useState("")
  const [tipoSigla, setTipoSigla] = useState("")
  const [tipoAtivo, setTipoAtivo] = useState(true)
  const [tipoError, setTipoError] = useState("")

  // Kit modal
  const [kitModalOpen, setKitModalOpen] = useState(false)
  const [kitEditing, setKitEditing] = useState<any>(null)
  const [kitData, setKitData] = useState({ sku: "", nome: "", sigla: "", descricao: "", tipo_kit_id: "", preco: 0, ativo: true })
  const [kitChaves, setKitChaves] = useState<string[]>([])
  const [kitFresas, setKitFresas] = useState<string[]>([])
  const [kitComplementares, setKitComplementares] = useState<string[]>([])
  const [kitOpcionais, setKitOpcionais] = useState<string[]>([])
  const [kitImplantes, setKitImplantes] = useState<string[]>([])
  const [kitTodosDiametros, setKitTodosDiametros] = useState(false)
  const [kitError, setKitError] = useState("")

  // Select helpers for composition
  const [selChave, setSelChave] = useState("")
  const [selFresa, setSelFresa] = useState("")
  const [selComplementar, setSelComplementar] = useState("")
  const [selOpcional, setSelOpcional] = useState("")
  const [selImplante, setSelImplante] = useState("")

  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string } | null>(null)

  // Type handlers
  function openNewTipo() { setTipoEditing(null); setTipoNome(""); setTipoSigla(""); setTipoAtivo(true); setTipoError(""); setTipoModalOpen(true) }
  function openEditTipo(item: any) { setTipoEditing(item); setTipoNome(item.nome); setTipoSigla(item.sigla ?? ""); setTipoAtivo(item.ativo !== false); setTipoError(""); setTipoModalOpen(true) }

  async function handleSaveTipo() {
    setTipoError("")
    if (!tipoNome.trim()) { setTipoError("Nome é obrigatório"); return }
    const payload = { empresa_id: empresaId, nome: tipoNome.trim(), sigla: tipoSigla.trim() || null, ativo: tipoAtivo }
    if (tipoEditing) { const { error } = await supabase.from("catalogo_tipos_kits").update({ nome: payload.nome, sigla: payload.sigla, ativo }).eq("id", tipoEditing.id); if (error) { setTipoError(error.message); return } }
    else { const { error } = await supabase.from("catalogo_tipos_kits").insert(payload); if (error) { setTipoError(error.message); return } }
    toast.success(tipoEditing ? "Atualizado!" : "Criado!")
    setTipoModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  // Kit handlers
  function openNewKit() { setKitEditing(null); setKitData({ sku: "", nome: "", sigla: "", descricao: "", tipo_kit_id: "", preco: 0, ativo: true }); setKitChaves([]); setKitFresas([]); setKitComplementares([]); setKitOpcionais([]); setKitImplantes([]); setKitTodosDiametros(false); setKitError(""); setSelChave(""); setSelFresa(""); setSelComplementar(""); setSelOpcional(""); setSelImplante(""); setKitModalOpen(true) }

  async function openEditKit(item: any) {
    setKitEditing(item); setKitData({ sku: item.sku, nome: item.nome ?? "", sigla: item.sigla ?? "", descricao: item.descricao ?? "", tipo_kit_id: item.tipo_kit_id ?? "", preco: item.preco ?? 0, ativo: item.ativo !== false }); setKitError("")
    // Load composition
    const [chRes, frRes, coRes, opRes, imRes] = await Promise.all([
      supabase.from("catalogo_kit_chaves").select("chave_id").eq("empresa_id", empresaId).eq("kit_sku", item.sku),
      supabase.from("catalogo_kit_fresas").select("fresa_id").eq("empresa_id", empresaId).eq("kit_sku", item.sku),
      supabase.from("catalogo_kit_complementares").select("complementar_id").eq("empresa_id", empresaId).eq("kit_sku", item.sku),
      supabase.from("catalogo_kit_opcionais").select("opcional_id").eq("empresa_id", empresaId).eq("kit_sku", item.sku),
      supabase.from("catalogo_kit_implantes").select("implante_sku, todos_diametros").eq("empresa_id", empresaId).eq("kit_sku", item.sku),
    ])
    setKitChaves((chRes.data ?? []).map((r: any) => r.chave_id))
    setKitFresas((frRes.data ?? []).map((r: any) => r.fresa_id))
    setKitComplementares((coRes.data ?? []).map((r: any) => r.complementar_id))
    setKitOpcionais((opRes.data ?? []).map((r: any) => r.opcional_id))
    const implData = (imRes.data ?? []) as any[]
    const todosD = implData.some((r: any) => r.todos_diametros)
    setKitTodosDiametros(todosD)
    setKitImplantes(todosD ? [] : implData.map((r: any) => r.implante_sku))
    setSelChave(""); setSelFresa(""); setSelComplementar(""); setSelOpcional(""); setSelImplante("")
    setKitModalOpen(true)
  }

  async function handleSaveKit() {
    setKitError("")
    if (!kitData.sku.trim()) { setKitError("SKU é obrigatório"); return }
    if (!kitData.nome.trim()) { setKitError("Nome é obrigatório"); return }
    const payload = { ...kitData, empresa_id: empresaId }
    if (kitEditing) { const { error } = await supabase.from("catalogo_kits").update(payload).eq("sku", kitEditing.sku).eq("empresa_id", empresaId); if (error) { setKitError(error.message); return } }
    else { const { error } = await supabase.from("catalogo_kits").insert(payload); if (error) { setKitError(error.message); return } }
    // Save N:M composition
    const sku = kitData.sku
    await Promise.all([
      supabase.from("catalogo_kit_chaves").delete().eq("empresa_id", empresaId).eq("kit_sku", sku),
      supabase.from("catalogo_kit_fresas").delete().eq("empresa_id", empresaId).eq("kit_sku", sku),
      supabase.from("catalogo_kit_complementares").delete().eq("empresa_id", empresaId).eq("kit_sku", sku),
      supabase.from("catalogo_kit_opcionais").delete().eq("empresa_id", empresaId).eq("kit_sku", sku),
      supabase.from("catalogo_kit_implantes").delete().eq("empresa_id", empresaId).eq("kit_sku", sku),
    ])
    if (kitChaves.length > 0) await supabase.from("catalogo_kit_chaves").insert(kitChaves.map(id => ({ empresa_id: empresaId, kit_sku: sku, chave_id: id })))
    if (kitFresas.length > 0) await supabase.from("catalogo_kit_fresas").insert(kitFresas.map(id => ({ empresa_id: empresaId, kit_sku: sku, fresa_id: id })))
    if (kitComplementares.length > 0) await supabase.from("catalogo_kit_complementares").insert(kitComplementares.map(id => ({ empresa_id: empresaId, kit_sku: sku, complementar_id: id })))
    if (kitOpcionais.length > 0) await supabase.from("catalogo_kit_opcionais").insert(kitOpcionais.map(id => ({ empresa_id: empresaId, kit_sku: sku, opcional_id: id })))
    // Save implantes compatibility
    if (kitTodosDiametros) {
      await supabase.from("catalogo_kit_implantes").insert({ empresa_id: empresaId, kit_sku: sku, implante_sku: "*", todos_diametros: true })
    } else if (kitImplantes.length > 0) {
      await supabase.from("catalogo_kit_implantes").insert(kitImplantes.map(s => ({ empresa_id: empresaId, kit_sku: sku, implante_sku: s, todos_diametros: false })))
    }
    toast.success(kitEditing ? "Kit atualizado!" : "Kit criado!")
    setKitModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function handleDelete() {
    if (!deleteItem) return
    if (deleteItem.table === "catalogo_kits") {
      await Promise.all([
        supabase.from("catalogo_kit_chaves").delete().eq("empresa_id", empresaId).eq("kit_sku", deleteItem.id),
        supabase.from("catalogo_kit_fresas").delete().eq("empresa_id", empresaId).eq("kit_sku", deleteItem.id),
        supabase.from("catalogo_kit_complementares").delete().eq("empresa_id", empresaId).eq("kit_sku", deleteItem.id),
        supabase.from("catalogo_kit_opcionais").delete().eq("empresa_id", empresaId).eq("kit_sku", deleteItem.id),
        supabase.from("catalogo_kit_implantes").delete().eq("empresa_id", empresaId).eq("kit_sku", deleteItem.id),
      ])
    }
    const { error } = await supabase.from(deleteItem.table).delete().eq(deleteItem.id.includes("-") ? "id" : "sku", deleteItem.id)
    if (error) { toast.error(error.message); return }
    toast.success("Excluído!"); setDeleteItem(null); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <h1 className="text-2xl font-black text-white">Kits</h1>
          <p className="text-sm mt-1" style={{color:"var(--color-text-muted, #94a3b8)"}}>Gerencie tipos e composição de kits.</p>
        </div>
        <div className="flex gap-2 flex-wrap">{SUB_TABS.map(st => <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subTab === st ? "bg-[#c9a655] text-[#0f172a]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-white/5"}`}>{st}</button>)}</div>
        <div className="rounded-2xl border bg-[var(--color-surface)]/50 p-6 shadow-xl" style={{borderColor:"rgba(201,166,85,0.15)"}}>
          <div className="flex justify-end mb-4">
            {subTab === "Kits" ? (
              <button onClick={openNewKit} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO KIT</button>
            ) : (
              <button onClick={openNewTipo} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
            )}
          </div>

          {/* Tipos de Kit */}
          {subTab === "Tipos de Kit" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["Nome","Sigla","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(tiposKit??[]).map((item:any,i:number)=><TableRow key={item.id} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.sigla??"—"}</TableCell>
              <TableCell><button onClick={async()=>{await supabase.from("catalogo_tipos_kits").update({ativo:!item.ativo}).eq("id",item.id);qc.invalidateQueries({queryKey:["catalogo"]})}}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditTipo(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.id,label:item.nome,table:"catalogo_tipos_kits"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(tiposKit??[]).length===0&&<TableRow><TableCell colSpan={4} className="p-4 text-center text-text-muted">Nenhum tipo cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}

          {/* Kits */}
          {subTab === "Kits" && (
            <Table><TableHeader><TableRow className="border-b border-[#c9a655]/20">{["SKU","Nome","Tipo","Preço","Ativo","Ações"].map(h=><TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{(kits??[]).map((item:any,i:number)=><TableRow key={item.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
              <TableCell className="text-sm font-mono">{item.sku}</TableCell>
              <TableCell className="text-sm font-medium text-white">{item.nome}</TableCell>
              <TableCell className="text-sm text-gray-300">{item.tipo_kit?.nome??"—"}</TableCell>
              <TableCell className="text-sm text-gray-300">R$ {item.preco?.toFixed(2) ?? "0,00"}</TableCell>
              <TableCell><button onClick={async()=>{await supabase.from("catalogo_kits").update({ativo:!item.ativo}).eq("sku",item.sku).eq("empresa_id",empresaId);qc.invalidateQueries({queryKey:["catalogo"]})}}>{item.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
              <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditKit(item)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:item.sku,label:item.nome,table:"catalogo_kits"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
            </TableRow>)}{(kits??[]).length===0&&<TableRow><TableCell colSpan={6} className="p-4 text-center text-text-muted">Nenhum kit cadastrado</TableCell></TableRow>}</TableBody></Table>
          )}
        </div>
      </div>

      {/* Modal Tipo de Kit */}
      <Dialog open={tipoModalOpen} onOpenChange={setTipoModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{tipoEditing?"Editar":"Novo"} Tipo de Kit</DialogTitle></DialogHeader>
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

      {/* Modal Kit */}
      <Dialog open={kitModalOpen} onOpenChange={setKitModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{kitEditing?"Editar":"Novo"} Kit</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Tipo de Kit *</label><select value={kitData.tipo_kit_id} onChange={e=>setKitData({...kitData,tipo_kit_id:e.target.value})} className={selectCls}><option value="">Selecione...</option>{tiposKit?.map((t:any)=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={kitData.sku} onChange={e=>setKitData({...kitData,sku:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={kitData.nome} onChange={e=>setKitData({...kitData,nome:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={kitData.sigla} onChange={e=>setKitData({...kitData,sigla:e.target.value})} className={inputCls} /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={kitData.descricao} onChange={e=>setKitData({...kitData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} /></div>
            </div>

            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="kit" produtoSku={kitData.sku} empresaId={empresaId} />

            {/* Composição do Kit */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Composição do Kit</h3>

            {/* Chaves */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Chaves</p>
              <div className="flex gap-2">
                <select value={selChave} onChange={e=>setSelChave(e.target.value)} className={selectCls+" flex-1"}><option value="">Selecione uma chave...</option>{chavesList?.filter((c:any)=>!kitChaves.includes(c.sku)).map((c:any)=><option key={c.sku} value={c.sku}>{c.nome}</option>)}</select>
                <button onClick={()=>{if(selChave){setKitChaves([...kitChaves,selChave]);setSelChave("")}}} disabled={!selChave} className="px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors disabled:opacity-30 shrink-0">Adicionar</button>
              </div>
              {kitChaves.map((sku,i)=><div key={i} className="flex items-center justify-between bg-[var(--color-background)] rounded-lg px-3 py-2 border border-white/5"><span className="text-sm text-white">{chavesList?.find((c:any)=>c.sku===sku)?.nome??sku}</span><button onClick={()=>setKitChaves(kitChaves.filter(s=>s!==sku))} className="text-red-400 hover:text-red-300"><X className="h-4 w-4"/></button></div>)}
            </div>

            {/* Fresas */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Fresas</p>
              <div className="flex gap-2">
                <select value={selFresa} onChange={e=>setSelFresa(e.target.value)} className={selectCls+" flex-1"}><option value="">Selecione uma fresa...</option>{fresasList?.filter((f:any)=>!kitFresas.includes(f.sku)).map((f:any)=><option key={f.sku} value={f.sku}>{f.nome}</option>)}</select>
                <button onClick={()=>{if(selFresa){setKitFresas([...kitFresas,selFresa]);setSelFresa("")}}} disabled={!selFresa} className="px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors disabled:opacity-30 shrink-0">Adicionar</button>
              </div>
              {kitFresas.map((sku,i)=><div key={i} className="flex items-center justify-between bg-[var(--color-background)] rounded-lg px-3 py-2 border border-white/5"><span className="text-sm text-white">{fresasList?.find((f:any)=>f.sku===sku)?.nome??sku}</span><button onClick={()=>setKitFresas(kitFresas.filter(s=>s!==sku))} className="text-red-400 hover:text-red-300"><X className="h-4 w-4"/></button></div>)}
            </div>

            {/* Complementares */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Instrumentais Complementares</p>
              <div className="flex gap-2">
                <select value={selComplementar} onChange={e=>setSelComplementar(e.target.value)} className={selectCls+" flex-1"}><option value="">Selecione...</option>{complementaresList?.filter((c:any)=>!kitComplementares.includes(c.sku)).map((c:any)=><option key={c.sku} value={c.sku}>{c.nome}</option>)}</select>
                <button onClick={()=>{if(selComplementar){setKitComplementares([...kitComplementares,selComplementar]);setSelComplementar("")}}} disabled={!selComplementar} className="px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors disabled:opacity-30 shrink-0">Adicionar</button>
              </div>
              {kitComplementares.map((sku,i)=><div key={i} className="flex items-center justify-between bg-[var(--color-background)] rounded-lg px-3 py-2 border border-white/5"><span className="text-sm text-white">{complementaresList?.find((c:any)=>c.sku===sku)?.nome??sku}</span><button onClick={()=>setKitComplementares(kitComplementares.filter(s=>s!==sku))} className="text-red-400 hover:text-red-300"><X className="h-4 w-4"/></button></div>)}
            </div>

            {/* Opcionais */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Instrumentais Opcionais</p>
              <div className="flex gap-2">
                <select value={selOpcional} onChange={e=>setSelOpcional(e.target.value)} className={selectCls+" flex-1"}><option value="">Selecione...</option>{opcionaisList?.filter((o:any)=>!kitOpcionais.includes(o.sku)).map((o:any)=><option key={o.sku} value={o.sku}>{o.nome}</option>)}</select>
                <button onClick={()=>{if(selOpcional){setKitOpcionais([...kitOpcionais,selOpcional]);setSelOpcional("")}}} disabled={!selOpcional} className="px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors disabled:opacity-30 shrink-0">Adicionar</button>
              </div>
              {kitOpcionais.map((sku,i)=><div key={i} className="flex items-center justify-between bg-[var(--color-background)] rounded-lg px-3 py-2 border border-white/5"><span className="text-sm text-white">{opcionaisList?.find((o:any)=>o.sku===sku)?.nome??sku}</span><button onClick={()=>setKitOpcionais(kitOpcionais.filter(s=>s!==sku))} className="text-red-400 hover:text-red-300"><X className="h-4 w-4"/></button></div>)}
            </div>

            {/* Implantes Compatíveis */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Implantes Compatíveis</h3>

            {/* Toggle Todos os Diâmetros */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
              <button
                type="button"
                onClick={() => { setKitTodosDiametros(!kitTodosDiametros); if (!kitTodosDiametros) setKitImplantes([]) }}
                className="flex items-center gap-3 w-full text-left"
              >
                {kitTodosDiametros ? (
                  <CheckSquare className="h-5 w-5 text-[#c9a655] shrink-0" />
                ) : (
                  <Square className="h-5 w-5 text-gray-500 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold text-white">Todos os diâmetros e linhas</p>
                  <p className="text-xs text-gray-400">Compatível com todos os implantes da empresa</p>
                </div>
              </button>
            </div>

            {/* Seleção manual de implantes (só aparece se NÃO está "todos") */}
            {!kitTodosDiametros && (
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Selecionar implantes específicos</p>
                <div className="flex gap-2">
                  <select value={selImplante} onChange={e=>setSelImplante(e.target.value)} className={selectCls+" flex-1"}>
                    <option value="">Selecione um implante...</option>
                    {implantesList?.filter((imp:any)=>!kitImplantes.includes(imp.sku)).map((imp:any)=>
                      <option key={imp.sku} value={imp.sku}>{imp.nome} — Ø{imp.diametro_mm}mm ({imp.conexao?.nome} / {imp.familia?.nome} / {imp.linha?.nome})</option>
                    )}
                  </select>
                  <button onClick={()=>{if(selImplante){setKitImplantes([...kitImplantes,selImplante]);setSelImplante("")}}} disabled={!selImplante} className="px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors disabled:opacity-30 shrink-0">Adicionar</button>
                </div>
                {kitImplantes.map((sku,i)=>{
                  const imp = implantesList?.find((x:any)=>x.sku===sku)
                  return (
                    <div key={i} className="flex items-center justify-between bg-[var(--color-background)] rounded-lg px-3 py-2 border border-white/5">
                      <span className="text-sm text-white">{imp?.nome??sku} <span className="text-xs text-gray-400">— Ø{imp?.diametro_mm}mm ({imp?.conexao?.nome} / {imp?.familia?.nome} / {imp?.linha?.nome})</span></span>
                      <button onClick={()=>setKitImplantes(kitImplantes.filter(s=>s!==sku))} className="text-red-400 hover:text-red-300"><X className="h-4 w-4"/></button>
                    </div>
                  )
                })}
                {kitImplantes.length === 0 && <p className="text-xs text-gray-500 italic">Nenhum implante selecionado</p>}
              </div>
            )}

            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={kitData.preco} onChange={e=>setKitData({...kitData,preco:Number(e.target.value)})} className={inputCls} /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{kitData.ativo?"Ativo":"Inativo"}</p></div>
                <Switch checked={kitData.ativo} onCheckedChange={v=>setKitData({...kitData,ativo:v})} />
              </div>
            </div>
            {kitError&&<p className="text-sm text-red-400 text-center">{kitError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setKitModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveKit} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
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
