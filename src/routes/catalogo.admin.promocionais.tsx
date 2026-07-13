
import { RequirePermission } from "~/components/guards";import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { usePromocionais, useCriarPromocional, useRemoverPromocional } from "~/features/catalogo/hooks/useCatalogo"
import { useState } from "react"
import { Tag, Trash2, Plus } from "lucide-react"
import { formatBRL } from "~/features/catalogo/services/carrinho.service"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"

export const catalogoAdminPromocionaisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/promocionais",
  component: () => (
    <RequirePermission modulo="catalogo" permissions={["catalogo_gerenciar_promocionais"]}>
      <EmpresaCrudGuard>
        <AdminPromocionaisPage />
      </EmpresaCrudGuard>
    </RequirePermission>
  ),
})

function AdminPromocionaisPage() {
  const { data: promos } = usePromocionais()
  const criarMut = useCriarPromocional()
  const removerMut = useRemoverPromocional()
  const [formOpen, setFormOpen] = useState(false)
  const [itemParaDeletar, setItemParaDeletar] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: "", descricao: "", preco: 0, expira_em: "" })

  function handleCriar() {
    criarMut.mutate({
      nome: form.nome,
      descricao: form.descricao || undefined,
      preco: form.preco,
      expira_em: form.expira_em || undefined,
    })
    setFormOpen(false)
    setForm({ nome: "", descricao: "", preco: 0, expira_em: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-white">Pacotes Promocionais</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>Crie pacotes (kits) com preços especiais e prazo de expiração.</p>
        </div>
        
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}>
              <Plus className="h-4 w-4" /> NOVO PACOTE
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white flex flex-col max-h-[85vh] overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle>Criar Pacote Promocional</DialogTitle>
              <DialogDescription className="text-gray-400">Monte seu pacote de produtos com preço especial.</DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome do Pacote</label>
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Combo Implante + Componente" className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Descrição Comercial</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descritivo..." className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Preço Fixo (R$)</label>
                  <input type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Expiração</label>
                  <input type="date" value={form.expira_em} onChange={(e) => setForm({ ...form, expira_em: e.target.value })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white [color-scheme:dark]" />
                </div>
              </div>
            </div>
            <DialogFooter className="shrink-0">
              <button onClick={handleCriar} className="w-full px-6 py-3 rounded-xl text-[#0f172a] font-black" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}>Cadastrar Pacote</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos?.map((p) => (
          <div key={p.id} className="flex flex-col gap-4 rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] p-5 shadow-sm hover:border-[#c9a655]/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c9a655]/10 flex items-center justify-center shrink-0">
                   <Tag className="h-4 w-4 text-[#c9a655]" />
                </div>
                <div>
                  <p className="font-bold text-white text-md leading-tight">{p.nome}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.ativo ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
                    {p.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <button onClick={() => setItemParaDeletar(p.id)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
            
            <div className="pt-3 border-t border-white/5 flex items-end justify-between">
              <div>
                 <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold mb-1">Preço do Pacote</p>
                 <p className="text-xl font-black text-gradient-gold leading-none">{formatBRL(p.preco)}</p>
              </div>
              {p.expira_em && (
                <div className="text-right">
                   <p className="text-[10px] uppercase tracking-widest text-red-400/70 mb-0.5">Expira em</p>
                   <p className="text-xs font-mono text-red-400">{new Date(p.expira_em).toLocaleDateString("pt-BR")}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {promos?.length === 0 && <p className="col-span-full text-[var(--color-text-muted)] text-center py-8 font-mono tracking-widest text-sm uppercase">Nenhum pacote criado</p>}
      </div>

      <AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader><AlertDialogTitle>Excluir pacote promocional?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (itemParaDeletar) removerMut.mutate(itemParaDeletar); setItemParaDeletar(null) }} className="bg-destructive">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
