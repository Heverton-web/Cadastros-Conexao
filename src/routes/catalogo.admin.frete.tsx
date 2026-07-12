import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { useFretes, useCriarFrete, useRemoverFrete } from "~/features/catalogo/hooks/useCatalogo"
import { useState } from "react"
import { Truck, Trash2, Plus } from "lucide-react"
import { formatBRL } from "~/features/catalogo/services/carrinho.service"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"

export const catalogoAdminFreteRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/catalogo/admin/frete",
  component: AdminFretePage,
})

function AdminFretePage() {
  const { data: fretes } = useFretes()
  const criarMut = useCriarFrete()
  const removerMut = useRemoverFrete()
  const [formOpen, setFormOpen] = useState(false)
  const [itemParaDeletar, setItemParaDeletar] = useState<string | null>(null)
  const [form, setForm] = useState({ cep_inicio: "", cep_fim: "", valor: 0, prazo_dias: 7 })

  function handleCriar() {
    criarMut.mutate(form)
    setFormOpen(false)
    setForm({ cep_inicio: "", cep_fim: "", valor: 0, prazo_dias: 7 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-white">Regras de Frete</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>Configure faixas de CEP e valores de entrega.</p>
        </div>
        
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}>
              <Plus className="h-4 w-4" /> NOVA REGRA
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white overflow-hidden">
            <DialogHeader>
              <DialogTitle>Cadastrar Regra de Frete</DialogTitle>
              <DialogDescription className="text-gray-400">Defina o CEP inicial, final e o valor.</DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">CEP Início</label>
                  <input value={form.cep_inicio} onChange={(e) => setForm({ ...form, cep_inicio: e.target.value })} placeholder="00000-000" className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">CEP Fim</label>
                  <input value={form.cep_fim} onChange={(e) => setForm({ ...form, cep_fim: e.target.value })} placeholder="99999-999" className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Valor (R$)</label>
                  <input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Prazo (Dias)</label>
                  <input type="number" value={form.prazo_dias} onChange={(e) => setForm({ ...form, prazo_dias: Number(e.target.value) })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <button onClick={handleCriar} className="w-full px-6 py-3 rounded-xl text-[#0f172a] font-black" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}>Salvar Regra</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fretes?.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] p-4 shadow-sm hover:border-[#c9a655]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#c9a655]/10 flex items-center justify-center shrink-0">
                 <Truck className="h-4 w-4 text-[#c9a655]" />
              </div>
              <div>
                <p className="font-mono font-black text-white text-sm tracking-wider leading-none mb-1">{f.cep_inicio} a {f.cep_fim}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gradient-gold">{formatBRL(f.valor)}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">• {f.prazo_dias} dias úteis</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => setItemParaDeletar(f.id)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {fretes?.length === 0 && <p className="col-span-full text-[var(--color-text-muted)] text-center py-8 font-mono tracking-widest text-sm uppercase">Nenhuma regra cadastrada</p>}
      </div>

      <AlertDialog open={!!itemParaDeletar} onOpenChange={(o) => !o && setItemParaDeletar(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader><AlertDialogTitle>Excluir regra de frete?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (itemParaDeletar) removerMut.mutate(itemParaDeletar); setItemParaDeletar(null) }} className="bg-destructive">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
