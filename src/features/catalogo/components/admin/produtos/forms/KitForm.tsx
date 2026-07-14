import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoFamilia, CatalogoCategoriaKit, CatalogoFresa, CatalogoChaveFerramental, CatalogoAcessorio, CatalogoInstrumentalGeral, CatalogoImplante } from "~/features/catalogo/types"

const kitSchema = z.object({
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  sku: z.string().min(1, "SKU é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  familia_ids: z.array(z.string()),
  preco: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
})

export type KitFormData = z.infer<typeof kitSchema>

interface BomItem { tipo: "fresa" | "chave" | "acessorio" | "instrumental" | "implante"; sku: string; quantidade: number }

interface Props {
  data: KitFormData
  onChange: (data: KitFormData) => void
  catsKit: CatalogoCategoriaKit[] | undefined
  familias: CatalogoFamilia[] | undefined
  fresas: CatalogoFresa[] | undefined
  chaves: CatalogoChaveFerramental[] | undefined
  acessorios: CatalogoAcessorio[] | undefined
  instrumentais: CatalogoInstrumentalGeral[] | undefined
  implantes: CatalogoImplante[] | undefined
  kitBom: BomItem[]
  addBomItem: () => void
  removeBomItem: (idx: number) => void
  updateBomItem: (idx: number, field: string, value: string | number) => void
}

export function KitForm({
  data, onChange, catsKit, familias,
  fresas, chaves, acessorios, instrumentais, implantes,
  kitBom, addBomItem, removeBomItem, updateBomItem,
}: Props) {
  const { register, formState: { errors } } = useForm<KitFormData>({
    resolver: zodResolver(kitSchema),
    defaultValues: data,
    values: data,
    mode: "onChange",
  })

  const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>SKU *</label>
          <input type="text" {...register("sku")} value={data.sku} onChange={(e) => onChange({ ...data, sku: e.target.value })} className={inputCls} placeholder="Ex: 950000-KIT" />
          {errors.sku && <p className="text-xs text-red-400">{errors.sku.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Categoria Kit</label>
          <select {...register("categoria_id")} value={data.categoria_id} onChange={(e) => onChange({ ...data, categoria_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {catsKit?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {errors.categoria_id && <p className="text-xs text-red-400">{errors.categoria_id.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Nome *</label>
        <input type="text" {...register("nome")} value={data.nome} onChange={(e) => onChange({ ...data, nome: e.target.value })} className={inputCls} placeholder="Ex: Kit Master Flex" />
        {errors.nome && <p className="text-xs text-red-400">{errors.nome.message}</p>}
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Descrição</label>
        <textarea {...register("descricao")} value={data.descricao} onChange={(e) => onChange({ ...data, descricao: e.target.value })} className={inputCls + " min-h-[80px]"} placeholder="Descrição do kit..." />
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Preço (R$)</label>
        <input type="number" step="0.01" min="0" {...register("preco")} value={data.preco} onChange={(e) => onChange({ ...data, preco: Number(e.target.value) })} className={inputCls} placeholder="0,00" />
        {errors.preco && <p className="text-xs text-red-400">{errors.preco.message}</p>}
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Famílias Compatíveis</h3>
      <div className="flex flex-wrap gap-2">
        {familias?.map((f) => {
          const selected = data.familia_ids.includes(f.id)
          return (
            <button
              key={f.id}
              onClick={() => onChange({
                ...data,
                familia_ids: selected ? data.familia_ids.filter((id) => id !== f.id) : [...data.familia_ids, f.id],
              })}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                selected ? "bg-[#c9a655]/20 text-[#c9a655] border-[#c9a655]/30" : "bg-[var(--color-surface)] text-gray-400 border-white/10 hover:border-white/20"
              }`}
            >
              {f.nome}
            </button>
          )
        })}
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Composição do Kit (BOM)</h3>
        {kitBom.length === 0 && <p className="text-xs text-gray-500 italic">Nenhum item adicionado.</p>}
        {kitBom.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
            <select value={item.tipo} onChange={(e) => updateBomItem(i, "tipo", e.target.value)} className={selectCls + " w-36"}>
              <option value="fresa">Fresa</option>
              <option value="chave">Chave</option>
              <option value="acessorio">Acessório</option>
              <option value="instrumental">Instrumental</option>
              <option value="implante">Implante</option>
            </select>
            <select value={item.sku} onChange={(e) => updateBomItem(i, "sku", e.target.value)} className={selectCls + " flex-1"}>
              <option value="">Selecione o produto...</option>
              {item.tipo === "fresa" && fresas?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
              {item.tipo === "chave" && chaves?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
              {item.tipo === "acessorio" && acessorios?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
              {item.tipo === "instrumental" && instrumentais?.map((p) => <option key={p.sku} value={p.sku}>{p.nome}</option>)}
              {item.tipo === "implante" && implantes?.map((p) => <option key={p.sku} value={p.sku}>{p.sku}</option>)}
            </select>
            <input type="number" min={1} value={item.quantidade} onChange={(e) => updateBomItem(i, "quantidade", Number(e.target.value))} className={inputCls + " w-20 text-center"} />
            <button onClick={() => removeBomItem(i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button onClick={addBomItem} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
          <span className="text-lg leading-none">+</span> Adicionar item ao kit
        </button>
      </div>
    </div>
  )
}
