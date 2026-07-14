
import { RequirePermission } from "~/components/guards";import { createRoute } from "@tanstack/react-router"
import { authLayout } from "./_auth"
import { EmpresaCrudGuard } from "~/features/catalogo/components/EmpresaCrudGuard"
import { useAuth } from "~/core/auth/useAuth"
import { usePromocionais, useCriarPromocional, useAtualizarPromocional, useRemoverPromocional, useTodosImplantes, useAbutments, useKitsAtivos, useFresas, useChavesFerramental, useAcessorios, useInstrumentais } from "~/features/catalogo/hooks/useCatalogo"
import { useState, useCallback, useEffect } from "react"
import { Tag, Trash2, Plus, Pencil, Search, X, Package } from "lucide-react"
import { formatBRL } from "~/features/catalogo/services/carrinho.service"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import type { CatalogoPromocional, ProductSheetTipo } from "~/features/catalogo/types"
import { CATALOGO_TIPO_LABEL } from "~/features/catalogo/types"

interface PromocionalItem {
  sku: string
  tipo: ProductSheetTipo
  nome: string
}

const TIPO_OPTIONS: ProductSheetTipo[] = ["implante", "abutment", "fresa", "chave", "acessorio", "instrumental", "kit"]

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
  const { profile } = useAuth()
  const isSuperAdmin = profile?.is_super_admin === true
  const { data: promos } = usePromocionais()
  const criarMut = useCriarPromocional()
  const atualizarMut = useAtualizarPromocional()
  const removerMut = useRemoverPromocional()

  const { data: implantes } = useTodosImplantes()
  const { data: abutments } = useAbutments()
  const { data: kits } = useKitsAtivos()
  const { data: fresas } = useFresas()
  const { data: chaves } = useChavesFerramental()
  const { data: acessorios } = useAcessorios()
  const { data: instrumentais } = useInstrumentais()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogoPromocional | null>(null)
  const [itemParaDeletar, setItemParaDeletar] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: "", descricao: "", preco: 0, expira_em: "" })
  const [itens, setItens] = useState<PromocionalItem[]>([])

  // Busca de produtos
  const [buscaOpen, setBuscaOpen] = useState(false)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")

  function openNew() {
    setEditingItem(null)
    setForm({ nome: "", descricao: "", preco: 0, expira_em: "" })
    setItens([])
    setFormOpen(true)
  }

  function openEdit(item: CatalogoPromocional) {
    setEditingItem(item)
    setForm({ nome: item.nome, descricao: item.descricao ?? "", preco: item.preco, expira_em: item.expira_em ?? "" })
    setItens(item.itens?.map((i) => ({
      sku: i.sku,
      tipo: i.tipo as ProductSheetTipo,
      nome: i.sku,
    })) ?? [])
    setFormOpen(true)
  }

  function handleSave() {
    if (!form.nome.trim()) return
    const payload: Parameters<typeof criarMut.mutate>[0] = {
      nome: form.nome,
      descricao: form.descricao || undefined,
      preco: form.preco,
      expira_em: form.expira_em || undefined,
      itens: itens.map((i) => ({ sku: i.sku, tipo: i.tipo })),
    }
    if (editingItem) {
      atualizarMut.mutate({ id: editingItem.id, input: payload })
    } else {
      criarMut.mutate(payload)
    }
    setFormOpen(false)
    setEditingItem(null)
    setForm({ nome: "", descricao: "", preco: 0, expira_em: "" })
    setItens([])
  }

  function adicionarItem(item: PromocionalItem) {
    if (!itens.some((i) => i.sku === item.sku && i.tipo === item.tipo)) {
      setItens((prev) => [...prev, item])
    }
    setBuscaOpen(false)
    setBusca("")
  }

  function removerItem(sku: string, tipo: string) {
    setItens((prev) => prev.filter((i) => !(i.sku === sku && i.tipo === tipo)))
  }

  // Itens filtrados para busca
  const todosProdutos: PromocionalItem[] = [
    ...(implantes ?? []).map((p) => ({ sku: p.sku, tipo: "implante" as const, nome: p.sku })),
    ...(abutments ?? []).map((p) => ({ sku: p.sku, tipo: "abutment" as const, nome: p.sku })),
    ...(fresas ?? []).map((p) => ({ sku: p.sku, tipo: "fresa" as const, nome: p.nome })),
    ...(chaves ?? []).map((p) => ({ sku: p.sku, tipo: "chave" as const, nome: p.nome })),
    ...(acessorios ?? []).map((p) => ({ sku: p.sku, tipo: "acessorio" as const, nome: p.nome })),
    ...(instrumentais ?? []).map((p) => ({ sku: p.sku, tipo: "instrumental" as const, nome: p.nome })),
    ...(kits ?? []).map((p) => ({ sku: p.sku, tipo: "kit" as const, nome: p.nome })),
  ]

  const produtosFiltrados = todosProdutos.filter((p) => {
    const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase())
    const matchTipo = filtroTipo === "todos" || p.tipo === filtroTipo
    const jaAdicionado = itens.some((i) => i.sku === p.sku && i.tipo === p.tipo)
    return matchBusca && matchTipo && !jaAdicionado
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border-subtle)] shadow-lg">
        <div>
          <h1 className="text-2xl font-black text-white">Pacotes Promocionais</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted, #94a3b8)" }}>Crie pacotes (kits) com preços especiais e prazo de expiração.</p>
        </div>
        
        <Dialog open={formOpen} onOpenChange={(o) => { if (!o) { setEditingItem(null); setForm({ nome: "", descricao: "", preco: 0, expira_em: "" }); setItens([]) } setFormOpen(o) }}>
          <DialogTrigger asChild>
            <button onClick={openNew} className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)", color: "#0f172a" }}>
              <Plus className="h-4 w-4" /> NOVO PACOTE
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle>{editingItem ? "Editar Pacote Promocional" : "Criar Pacote Promocional"}</DialogTitle>
              <DialogDescription className="text-gray-400">Monte seu pacote de produtos com preço especial.</DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nome do Pacote *</label>
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Combo Implante + Componente" className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Descrição Comercial</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descritivo..." className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Preço Fixo (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Expiração</label>
                  <input type="date" value={form.expira_em} onChange={(e) => setForm({ ...form, expira_em: e.target.value })} className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white [color-scheme:dark]" />
                </div>
              </div>

              {/* Itens do Pacote */}
              <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Itens do Pacote</h3>
                  <button
                    onClick={() => setBuscaOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0f172a] transition-colors"
                    style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar
                  </button>
                </div>

                {itens.length === 0 && !buscaOpen && (
                  <p className="text-xs text-gray-500 italic">Nenhum item adicionado. Clique em "Adicionar" para incluir produtos.</p>
                )}

                {/* Busca de produto */}
                {buscaOpen && (
                  <div className="space-y-2 border border-[#c9a655]/20 rounded-lg p-3 bg-[var(--color-background)]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        autoFocus
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por nome ou SKU..."
                        className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 pl-9 text-white placeholder-gray-500 text-sm"
                      />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setFiltroTipo("todos")} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${filtroTipo === "todos" ? "bg-[#c9a655] text-[#0f172a]" : "bg-white/5 text-gray-400 hover:text-white"}`}>Todos</button>
                      {TIPO_OPTIONS.map((t) => (
                        <button key={t} onClick={() => setFiltroTipo(t)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${filtroTipo === t ? "bg-[#c9a655] text-[#0f172a]" : "bg-white/5 text-gray-400 hover:text-white"}`}>
                          {CATALOGO_TIPO_LABEL[t]}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-white/10">
                      {produtosFiltrados.length === 0 ? (
                        <p className="p-3 text-sm text-gray-400 text-center">Nenhum produto encontrado</p>
                      ) : (
                        produtosFiltrados.slice(0, 50).map((p) => (
                          <button
                            key={`${p.tipo}_${p.sku}`}
                            onClick={() => adicionarItem(p)}
                            className="w-full text-left p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                          >
                            <p className="text-sm font-medium text-white truncate">{p.nome}</p>
                            <p className="text-xs text-gray-400">{p.sku} · {CATALOGO_TIPO_LABEL[p.tipo]}</p>
                          </button>
                        ))
                      )}
                    </div>
                    <button onClick={() => { setBuscaOpen(false); setBusca("") }} className="text-xs text-gray-400 hover:text-white transition-colors">Cancelar</button>
                  </div>
                )}

                {/* Lista de itens */}
                {itens.map((item) => (
                  <div key={`${item.tipo}_${item.sku}`} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
                    <Package className="h-4 w-4 text-[#c9a655] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.nome}</p>
                      <p className="text-xs text-gray-400">{item.sku} · {CATALOGO_TIPO_LABEL[item.tipo]}</p>
                    </div>
                    <button onClick={() => removerItem(item.sku, item.tipo)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="shrink-0">
              <button onClick={handleSave} disabled={!form.nome.trim()} className="w-full px-6 py-3 rounded-xl text-[#0f172a] font-black disabled:opacity-50" style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}>{editingItem ? "Salvar" : "Cadastrar Pacote"}</button>
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
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#c9a655]/20 text-[var(--color-text-muted)] hover:text-[#c9a655] transition-colors"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setItemParaDeletar(p.id)} disabled={!isSuperAdmin} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title={isSuperAdmin ? "Excluir" : "Apenas super admin pode excluir"}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            {p.itens && p.itens.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {p.itens.slice(0, 4).map((i) => (
                  <span key={i.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 text-gray-400 border border-white/10">
                    {CATALOGO_TIPO_LABEL[i.tipo as ProductSheetTipo] ?? i.tipo}
                  </span>
                ))}
                {p.itens.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 text-gray-400">+{p.itens.length - 4}</span>
                )}
              </div>
            )}
            
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
