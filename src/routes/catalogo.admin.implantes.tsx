import { RequirePermission } from "~/components/guards"
import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { AdminLayout } from "~/features/catalogo/components/AdminLayout"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react"
import { supabase } from "~/core/supabase"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useCategorias, useConexoes, useFamilias, useLinhas, useFresas, useToggleConexaoAtivo, useToggleFamiliaAtivo, useToggleLinhaAtivo } from "~/features/catalogo/hooks/useCatalogo"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog"
import { Switch } from "~/components/ui/switch"
import { ImageUploader } from "~/features/catalogo/components/admin/produtos/ImageUploader"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import type { CatalogoIpsConexao, CatalogoIpsFamilia, CatalogoIpsLinha, CatalogoImplante, CatalogoFresa } from "~/features/catalogo/types"

export const catalogoAdminImplantesRoute = createRoute({
  getParentRoute: () => authLayout, path: "/catalogo/admin/implantes",
  component: () => (<RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_produtos"]}><EmpresaCrudGuard><AdminImplantesPage /></EmpresaCrudGuard></RequirePermission>),
})

const SUB_TABS = ["Conexões", "Famílias", "Linhas", "Implantes"]
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

function AdminImplantesPage() {
  const [subTab, setSubTab] = useState("Conexões")
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()
  const { data: categorias } = useCategorias()
  const { data: conexoes } = useConexoes()
  const { data: familias } = useFamilias()
  const { data: linhas } = useLinhas()
  const toggleConexao = useToggleConexaoAtivo()
  const toggleFamilia = useToggleFamiliaAtivo()
  const toggleLinha = useToggleLinhaAtivo()
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null)
  const [deleteItem, setDeleteItem] = useState<{ id: string; label: string; table: string; pkColumn: string } | null>(null)

  // Implante modal state
  const [implModalOpen, setImplModalOpen] = useState(false)
  const [implEditing, setImplEditing] = useState<CatalogoImplante | null>(null)
  const [implData, setImplData] = useState({ categoria_id: "", conexao_id: "", familia_id: "", linha_id: "", sku: "", nome: "", sigla: "", descricao: "", osso_soft: "", osso_hard: "", diametro_mm: 0, comprimento_mm: 0, rosca_interna: "", macrogeometria: "", torque_insercao: 0, material: "", superficie: "", preco: 0, ativo: true })
  const [implChaves, setImplChaves] = useState<string[]>([])
  const [implError, setImplError] = useState("")

  const { data: implantes } = useQuery({ queryKey: ["catalogo", "implantes", empresaId], queryFn: async () => { const { data } = await supabase.from("catalogo_implantes").select("*, linha:catalogo_ips_linhas(*, familia:catalogo_ips_familias(*, conexao:catalogo_ips_conexoes(*, categoria:catalogo_categorias(*))))").eq("empresa_id", empresaId).order("sku"); return (data ?? []) as CatalogoImplante[] }, enabled: !!empresaId })
  const { data: allChaves } = useQuery({ queryKey: ["catalogo", "chaves"], queryFn: async () => { const { data } = await supabase.from("catalogo_chaves").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })
  const { data: protocolos } = useQuery({ queryKey: ["catalogo", "protocolos"], queryFn: async () => { const { data } = await supabase.from("catalogo_protocolos_fresagens").select("*").eq("empresa_id", empresaId).order("nome"); return (data ?? []) as any[] }, enabled: !!empresaId })

  function openNewImpl() {
    setImplEditing(null)
    setImplData({ categoria_id: categorias?.[0]?.id ?? "", conexao_id: "", familia_id: "", linha_id: "", sku: "", nome: "", sigla: "", descricao: "", osso_soft: "", osso_hard: "", diametro_mm: 0, comprimento_mm: 0, rosca_interna: "", macrogeometria: "", torque_insercao: 0, material: "", superficie: "", preco: 0, ativo: true })
    setImplChaves([]); setImplError(""); setImplModalOpen(true)
  }
  function openEditImpl(impl: CatalogoImplante) {
    setImplEditing(impl)
    setImplData({ categoria_id: impl.categoria_id ?? "", conexao_id: impl.conexao_id ?? "", familia_id: impl.familia_id ?? "", linha_id: impl.linha_id ?? "", sku: impl.sku, nome: impl.nome ?? "", sigla: impl.sigla ?? "", descricao: impl.descricao ?? "", osso_soft: impl.osso_soft ?? "", osso_hard: impl.osso_hard ?? "", diametro_mm: impl.diametro_mm ?? 0, comprimento_mm: impl.comprimento_mm ?? 0, rosca_interna: impl.rosca_interna ?? "", macrogeometria: impl.macrogeometria ?? "", torque_insercao: impl.torque_insercao ?? 0, material: impl.material ?? "", superficie: impl.superficie ?? "", preco: impl.preco ?? 0, ativo: impl.ativo !== false })
    setImplChaves([]); setImplError(""); setImplModalOpen(true)
  }

  async function handleSaveImpl() {
    setImplError("")
    if (!implData.sku.trim()) { setImplError("SKU é obrigatório"); return }
    if (!implData.nome.trim()) { setImplError("Nome é obrigatório"); return }
    if (!implData.conexao_id) { setImplError("Conexão é obrigatória"); return }
    if (!implData.familia_id) { setImplError("Família é obrigatória"); return }
    if (!implData.linha_id) { setImplError("Linha é obrigatória"); return }

    const payload = { ...implData, empresa_id: empresaId }
    if (implEditing) {
      const { error } = await supabase.from("catalogo_implantes").update(payload).eq("sku", implEditing.sku).eq("empresa_id", empresaId)
      if (error) { setImplError(error.message); return }
    } else {
      const { error } = await supabase.from("catalogo_implantes").insert(payload)
      if (error) { setImplError(error.message); return }
    }
    // Salvar chaves N:M
    if (implData.sku) {
      await supabase.from("catalogo_implante_chaves").delete().eq("empresa_id", empresaId).eq("implante_sku", implData.sku)
      if (implChaves.length > 0) {
        const rows = implChaves.map(id => ({ empresa_id: empresaId, implante_sku: implData.sku, chave_id: id }))
        await supabase.from("catalogo_implante_chaves").insert(rows)
      }
    }
    setImplModalOpen(false); qc.invalidateQueries({ queryKey: ["catalogo"] })
  }

  async function handleDelete() { if (!deleteItem) return; await supabase.from(deleteItem.table).delete().eq(deleteItem.pkColumn, deleteItem.id); qc.invalidateQueries({ queryKey: ["catalogo"] }); setDeleteItem(null) }

  // Filtered selects for cascading
  const filteredConexoes = conexoes?.filter(c => !implData.conexao_id || true) ?? []
  const filteredFamilias = familias?.filter(f => f.conexao_id === implData.conexao_id) ?? []
  const filteredLinhas = linhas?.filter(l => l.familia_id === implData.familia_id) ?? []

  function getSimpleConfig() {
    if (subTab === "Conexões") return { headers: ["Nome", "Sigla", "Categoria", "Ativo", "Ações"], rows: (conexoes ?? []) as Record<string,unknown>[], table: "catalogo_ips_conexoes", pk: "id" as const, toggle: (row: Record<string,unknown>) => toggleConexao.mutate({ id: row.id as string, ativo: !row.ativo }) }
    if (subTab === "Famílias") return { headers: ["Nome", "Cor", "Conexão", "Ativo", "Ações"], rows: (familias ?? []) as Record<string,unknown>[], table: "catalogo_ips_familias", pk: "id" as const, toggle: (row: Record<string,unknown>) => toggleFamilia.mutate({ id: row.id as string, ativo: !row.ativo }) }
    if (subTab === "Linhas") return { headers: ["Nome", "Família", "Ativo", "Ações"], rows: (linhas ?? []) as Record<string,unknown>[], table: "catalogo_ips_linhas", pk: "id" as const, toggle: (row: Record<string,unknown>) => toggleLinha.mutate({ id: row.id as string, ativo: !row.ativo }) }
    return null
  }

  const simpleConfig = getSimpleConfig()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
          <h1 className="text-2xl font-black text-white">Implantes</h1>
          <p className="text-sm mt-1" style={{color:"var(--color-text-muted, #94a3b8)"}}>Gerencie a estrutura e produtos de implantes.</p>
        </div>
        <div className="flex gap-2 flex-wrap">{SUB_TABS.map(st => <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${subTab === st ? "bg-[#c9a655] text-[#0f172a]" : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-white/5"}`}>{st}</button>)}</div>

        <div className="rounded-2xl border bg-[var(--color-surface)]/50 p-6 shadow-xl" style={{borderColor:"rgba(201,166,85,0.15)"}}>
          <div className="flex justify-end mb-4">
            {subTab === "Implantes" ? (
              <button onClick={openNewImpl} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO IMPLANTE</button>
            ) : (
              <button onClick={() => { setEditingItem(null); setFormOpen(true) }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)",color:"#0f172a"}}><Plus className="h-4 w-4" /> NOVO</button>
            )}
          </div>

          {/* Simple structure tables */}
          {simpleConfig && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">{simpleConfig.headers.map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {simpleConfig.rows.map((row,i) => (
                  <TableRow key={i} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    {simpleConfig.headers.filter(h=>h!=="Ações").map(h => {
                      if(h==="Ativo") return <TableCell key={h}><button onClick={()=>simpleConfig.toggle(row)}>{row.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
                      let v=""; if(h==="Nome")v=String(row.nome??""); else if(h==="Sigla")v=String(row.sigla??""); else if(h==="Categoria")v=String((row as any).categoria?.nome??""); else if(h==="Cor")v=String(row.cor_identificacao??""); else if(h==="Conexão")v=String((row as any).conexao?.nome??""); else if(h==="Família")v=String((row as any).familia?.nome??""); return <TableCell key={h} className="text-sm">{v}</TableCell>
                    })}
                    <TableCell><div className="flex items-center gap-2"><button onClick={()=>{setEditingItem(row);setFormOpen(true)}} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:String(row[simpleConfig.pk]),label:String(row.nome??row[simpleConfig.pk]),table:simpleConfig.table,pkColumn:simpleConfig.pk})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {simpleConfig.rows.length===0&&<TableRow><TableCell colSpan={simpleConfig.headers.length} className="p-4 text-center text-text-muted">Nenhum registro</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}

          {/* Implantes table */}
          {subTab === "Implantes" && (
            <Table>
              <TableHeader><TableRow className="border-b border-[#c9a655]/20">
                {["SKU","Nome","Ø (mm)","Comp. mm","Conexão","Família","Linha","Ativo","Ações"].map(h => <TableHead key={h} className="bg-gradient-to-r from-[#c9a655]/10 to-transparent text-[#c9a655] font-black uppercase tracking-wider text-[10px]">{h}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {(implantes ?? []).map((impl,i) => (
                  <TableRow key={impl.sku} className={`${i%2===0?"bg-[var(--color-surface)]/30":""} hover:bg-[#c9a655]/5 border-b border-[var(--color-border-subtle)]/50`}>
                    <TableCell className="text-sm font-mono">{impl.sku}</TableCell>
                    <TableCell className="text-sm">{impl.nome}</TableCell>
                    <TableCell className="text-sm">{impl.diametro_mm}</TableCell>
                    <TableCell className="text-sm">{impl.comprimento_mm}</TableCell>
                    <TableCell className="text-sm">{impl.linha?.familia?.conexao?.nome ?? ""}</TableCell>
                    <TableCell className="text-sm">{impl.linha?.familia?.nome ?? ""}</TableCell>
                    <TableCell className="text-sm">{impl.linha?.nome ?? ""}</TableCell>
                    <TableCell><button onClick={async()=>{await supabase.from("catalogo_implantes").update({ativo:!impl.ativo}).eq("sku",impl.sku).eq("empresa_id",empresaId);qc.invalidateQueries({queryKey:["catalogo"]})}}>{impl.ativo?<ToggleRight className="h-7 w-7 text-green-400"/>:<ToggleLeft className="h-7 w-7 text-gray-500"/>}</button></TableCell>
                    <TableCell><div className="flex items-center gap-2"><button onClick={()=>openEditImpl(impl)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655]"><Pencil className="h-3.5 w-3.5"/></button><button onClick={()=>setDeleteItem({id:impl.sku,label:impl.nome??impl.sku,table:"catalogo_implantes",pkColumn:"sku"})} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div></TableCell>
                  </TableRow>
                ))}
                {(!implantes||implantes.length===0)&&<TableRow><TableCell colSpan={9} className="p-4 text-center text-text-muted">Nenhum implante</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Simple structure modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-lg flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{editingItem ? "Editar" : "Novo"} {subTab.replace(/s$/,"").replace(/ç/g,"c")}</DialogTitle></DialogHeader>
          <SimpleForm subTab={subTab} editingItem={editingItem} table={simpleConfig?.table ?? ""} empresaId={empresaId} onClose={()=>setFormOpen(false)} onSuccess={()=>{setFormOpen(false);qc.invalidateQueries({queryKey:["catalogo"]})}} />
        </DialogContent>
      </Dialog>

      {/* Implante modal com todos os campos */}
      <Dialog open={implModalOpen} onOpenChange={setImplModalOpen}>
        <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
          <DialogHeader className="shrink-0"><DialogTitle className="text-white">{implEditing ? "Editar" : "Novo"} Implante</DialogTitle></DialogHeader>
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">

            {/* Hierarquia em Cascata */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Hierarquia</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Conexão *</label><select value={implData.conexao_id} onChange={e=>setImplData({...implData,conexao_id:e.target.value,familia_id:"",linha_id:""})} className={selectCls}><option value="">Selecione...</option>{filteredConexoes.map(c=><option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Família *</label><select value={implData.familia_id} onChange={e=>setImplData({...implData,familia_id:e.target.value,linha_id:""})} className={selectCls} disabled={!implData.conexao_id}><option value="">Selecione...</option>{filteredFamilias.map(f=><option key={f.id} value={f.id}>{f.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Linha *</label><select value={implData.linha_id} onChange={e=>setImplData({...implData,linha_id:e.target.value})} className={selectCls} disabled={!implData.familia_id}><option value="">Selecione...</option>{filteredLinhas.map(l=><option key={l.id} value={l.id}>{l.nome}</option>)}</select></div>
            </div>

            {/* Identificação */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>SKU *</label><input type="text" value={implData.sku} onChange={e=>setImplData({...implData,sku:e.target.value})} className={inputCls} placeholder="Ex: 524385" /></div>
              <div className="space-y-2"><label className={labelCls}>Nome *</label><input type="text" value={implData.nome} onChange={e=>setImplData({...implData,nome:e.target.value})} className={inputCls} placeholder="Nome do implante" /></div>
              <div className="space-y-2"><label className={labelCls}>Sigla</label><input type="text" value={implData.sigla} onChange={e=>setImplData({...implData,sigla:e.target.value})} className={inputCls} placeholder="Ex: IMP" /></div>
              <div className="space-y-2 col-span-2"><label className={labelCls}>Descrição</label><textarea value={implData.descricao} onChange={e=>setImplData({...implData,descricao:e.target.value})} className={inputCls+" min-h-[60px]"} placeholder="Descrição do implante..." /></div>
            </div>

            {/* Protocolos de Fresagem */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Protocolos de Fresagem</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Protocolo Osso Soft (III-IV)</label><select value={implData.osso_soft} onChange={e=>setImplData({...implData,osso_soft:e.target.value})} className={selectCls}><option value="">Nenhum</option>{protocolos?.filter((p:any)=>["D3","D4","D5"].includes(p.tipo_osso)).map((p:any)=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
              <div className="space-y-2"><label className={labelCls}>Protocolo Osso Hard (I-II)</label><select value={implData.osso_hard} onChange={e=>setImplData({...implData,osso_hard:e.target.value})} className={selectCls}><option value="">Nenhum</option>{protocolos?.filter((p:any)=>["D1","D2"].includes(p.tipo_osso)).map((p:any)=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
            </div>

            {/* Chaves (Multi-select) */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Chaves Compatíveis</h3>
            <div className="flex flex-wrap gap-2">
              {allChaves?.map((ch:any) => { const sel = implChaves.includes(ch.sku); return <button key={ch.sku} type="button" onClick={()=>setImplChaves(sel ? implChaves.filter(s=>s!==ch.sku) : [...implChaves, ch.sku])} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${sel ? "bg-[#c9a655]/20 text-[#c9a655] border-[#c9a655]/30" : "bg-[var(--color-surface)] text-gray-400 border-white/10 hover:border-white/20"}`}>{ch.nome}</button> })}
              {(!allChaves || allChaves.length === 0) && <p className="text-xs text-gray-500 italic">Nenhuma chave cadastrada</p>}
            </div>

            {/* Especificações Técnicas */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Ø Diâmetro (mm)</label><input type="number" step="0.1" value={implData.diametro_mm} onChange={e=>setImplData({...implData,diametro_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Comprimento (mm)</label><input type="number" step="0.1" value={implData.comprimento_mm} onChange={e=>setImplData({...implData,comprimento_mm:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Rosca Interna</label><input type="text" value={implData.rosca_interna} onChange={e=>setImplData({...implData,rosca_interna:e.target.value})} className={inputCls} placeholder="Ex: M 1.6" /></div>
              <div className="space-y-2"><label className={labelCls}>Macrogeometria</label><input type="text" value={implData.macrogeometria} onChange={e=>setImplData({...implData,macrogeometria:e.target.value})} className={inputCls} placeholder="Ex: Taper" /></div>
              <div className="space-y-2"><label className={labelCls}>Torque (N·cm)</label><input type="number" value={implData.torque_insercao} onChange={e=>setImplData({...implData,torque_insercao:Number(e.target.value)})} className={inputCls} /></div>
              <div className="space-y-2"><label className={labelCls}>Material</label><input type="text" value={implData.material} onChange={e=>setImplData({...implData,material:e.target.value})} className={inputCls} placeholder="Ex: Titânio Grau 4" /></div>
              <div className="space-y-2"><label className={labelCls}>Superfície</label><input type="text" value={implData.superficie} onChange={e=>setImplData({...implData,superficie:e.target.value})} className={inputCls} placeholder="Ex: Porous" /></div>
            </div>

            {/* Imagens do Produto */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Imagens do Produto</h3>
            <ImageUploader produtoTipo="implante" produtoSku={implData.sku} empresaId={empresaId} />

            {/* Comercial */}
            <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Comercial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className={labelCls}>Preço (R$)</label><input type="number" step="0.01" min="0" value={implData.preco} onChange={e=>setImplData({...implData,preco:Number(e.target.value)})} className={inputCls} placeholder="0,00" /></div>
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5 mt-6">
                <div><p className="text-sm font-bold text-white">{implData.ativo ? "Ativo" : "Inativo"}</p><p className="text-xs text-gray-400">Produto visível no catálogo</p></div>
                <Switch checked={implData.ativo} onCheckedChange={v=>setImplData({...implData,ativo:v})} />
              </div>
            </div>

            {implError && <p className="text-sm text-red-400 text-center">{implError}</p>}
          </div>
          <DialogFooter className="shrink-0 p-6 border-t border-[var(--color-border-subtle)]">
            <button onClick={()=>setImplModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
            <button onClick={handleSaveImpl} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={o=>!o&&setDeleteItem(null)}>
        <AlertDialogContent style={{background:"var(--color-card, #1e293b)",borderColor:"rgba(201,166,85,0.15)"}}>
          <AlertDialogHeader><AlertDialogTitle className="text-white">Excluir?</AlertDialogTitle><AlertDialogDescription>{deleteItem?.label} será removido.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">Excluir</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}

function SimpleForm({ subTab, editingItem, table, empresaId, onClose, onSuccess }: { subTab: string; editingItem: Record<string,unknown>|null; table: string; empresaId: string; onClose: () => void; onSuccess: () => void }) {
  const [nome, setNome] = useState("")
  const [sigla, setSigla] = useState("")
  const [cor, setCor] = useState("#c9a655")
  const [parentId, setParentId] = useState("")
  const [ativo, setAtivo] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingItem) {
      setNome(String(editingItem.nome??""))
      setSigla(String(editingItem.sigla??""))
      setCor(String(editingItem.cor_identificacao??"#c9a655"))
      setParentId(String(editingItem.categoria_id??editingItem.conexao_id??editingItem.familia_id??""))
      setAtivo(editingItem.ativo !== false)
    } else {
      setNome(""); setSigla(""); setCor("#c9a655"); setParentId(""); setAtivo(true)
    }
  }, [editingItem])

  const { data: cats } = useCategorias()
  const { data: concs } = useConexoes()
  const { data: fams } = useFamilias()

  const isConexao = subTab === "Conexões"
  const isFamilia = subTab === "Famílias"
  const isLinha = subTab === "Linhas"

  async function save() {
    setError("")
    // Validação
    if (!nome.trim()) { setError("Nome é obrigatório"); return }
    if (isConexao && !sigla.trim()) { setError("Sigla é obrigatória"); return }
    if (isConexao && !parentId) { setError("Categoria é obrigatória"); return }
    if (isFamilia && !parentId) { setError("Conexão é obrigatória"); return }
    if (isFamilia && !cor.trim()) { setError("Cor de identificação é obrigatória"); return }
    if (isLinha && !parentId) { setError("Família é obrigatória"); return }

    const payload: Record<string,unknown> = { empresa_id: empresaId, nome: nome.trim(), sigla: sigla.trim(), ativo }

    if (isConexao) {
      payload.categoria_id = parentId
      payload.locked = editingItem ? editingItem.locked : true // default true, não muda
    }
    if (isFamilia) {
      payload.conexao_id = parentId
      payload.cor_identificacao = cor
    }
    if (isLinha) {
      payload.familia_id = parentId
    }

    if (editingItem) {
      const { error } = await supabase.from(table).update(payload).eq("id", editingItem.id)
      if (error) { setError(error.message); return }
    } else {
      const { error } = await supabase.from(table).insert(payload)
      if (error) { setError(error.message); return }
    }
    onSuccess()
  }

  return (
    <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
      {/* Conexões: Categoria primeiro */}
      {isConexao && (
        <div className="space-y-2">
          <label className={labelCls}>Categoria <span className="text-red-400">*</span></label>
          <select value={parentId} onChange={e => setParentId(e.target.value)} className={selectCls}>
            <option value="">Selecione a categoria...</option>
            {(cats ?? []).map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
      )}

      {/* Nome */}
      <div className="space-y-2">
        <label className={labelCls}>Nome <span className="text-red-400">*</span></label>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={inputCls} placeholder="Ex: Conexão hexagonal" />
      </div>

      {/* Sigla */}
      <div className="space-y-2">
        <label className={labelCls}>Sigla {isConexao && <span className="text-red-400">*</span>}</label>
        <input type="text" value={sigla} onChange={e => setSigla(e.target.value)} className={inputCls} placeholder={isConexao ? "Ex: HEX" : "Ex: AB"} />
      </div>

      {/* Famílias: Conexão */}
      {isFamilia && (
        <div className="space-y-2">
          <label className={labelCls}>Conexão <span className="text-red-400">*</span></label>
          <select value={parentId} onChange={e => setParentId(e.target.value)} className={selectCls}>
            <option value="">Selecione a conexão...</option>
            {(concs ?? []).map(c => <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>)}
          </select>
        </div>
      )}

      {/* Famílias: Cor */}
      {isFamilia && (
        <div className="space-y-2">
          <label className={labelCls}>Cor de Identificação</label>
          <div className="flex items-center gap-3">
            <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border-0" />
            <input type="text" value={cor} onChange={e => setCor(e.target.value)} className="flex-1 bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white font-mono text-sm" />
          </div>
        </div>
      )}

      {/* Linhas: Família */}
      {isLinha && (
        <div className="space-y-2">
          <label className={labelCls}>Família <span className="text-red-400">*</span></label>
          <select value={parentId} onChange={e => setParentId(e.target.value)} className={selectCls}>
            <option value="">Selecione a família...</option>
            {(fams ?? []).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </div>
      )}

      {/* Ativo */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-white/5">
        <div>
          <p className="text-sm font-bold text-white">{ativo ? "Ativo" : "Inativo"}</p>
          <p className="text-xs text-gray-400">Registro visível no sistema</p>
        </div>
        <Switch checked={ativo} onCheckedChange={setAtivo} />
      </div>

      {/* Erro */}
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      <DialogFooter className="border-t border-[var(--color-border-subtle)] pt-4">
        <button onClick={onClose} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancelar</button>
        <button onClick={save} className="px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform" style={{background:"linear-gradient(135deg, #c9a655, #e8d48b)"}}>Salvar</button>
      </DialogFooter>
    </div>
  )
}
