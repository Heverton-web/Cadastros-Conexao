import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoTipoKit, CatalogoFresa, CatalogoChave, CatalogoComplementar, CatalogoOpcional } from "~/features/catalogo/types"

const kitSchema = z.object({
  tipo_kit_id: z.string().optional(),
  sku: z.string().min(1, "SKU é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  sigla: z.string().optional(),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
})

export type KitFormData = z.infer<typeof kitSchema>

interface Props {
  data: KitFormData
  onChange: (data: KitFormData) => void
  tiposKit: CatalogoTipoKit[] | undefined
  fresas: CatalogoFresa[] | undefined
  chaves: CatalogoChave[] | undefined
  complementares: CatalogoComplementar[] | undefined
  opcionais: CatalogoOpcional[] | undefined
  kitChaves: string[]
  kitFresas: string[]
  kitComplementares: string[]
  kitOpcionais: string[]
  onToggleChave: (sku: string) => void
  onToggleFresa: (sku: string) => void
  onToggleComplementar: (sku: string) => void
  onToggleOpcional: (sku: string) => void
}

export function KitForm({
  data, onChange, tiposKit,
  fresas, chaves, complementares, opcionais,
  kitChaves, kitFresas, kitComplementares, kitOpcionais,
  onToggleChave, onToggleFresa, onToggleComplementar, onToggleOpcional,
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

  function renderToggleList(
    items: { sku: string; nome: string }[] | undefined,
    selected: string[],
    onToggle: (sku: string) => void,
  ) {
    if (!items?.length) return <p className="text-xs text-gray-500 italic">Nenhum item disponível.</p>
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item.sku)
          return (
            <button
              key={item.sku}
              type="button"
              onClick={() => onToggle(item.sku)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                isSelected ? "bg-[#c9a655]/20 text-[#c9a655] border-[#c9a655]/30" : "bg-[var(--color-surface)] text-gray-400 border-white/10 hover:border-white/20"
              }`}
            >
              {item.nome}
            </button>
          )
        })}
      </div>
    )
  }

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
          <label className={labelCls}>Tipo de Kit</label>
          <select {...register("tipo_kit_id")} value={data.tipo_kit_id} onChange={(e) => onChange({ ...data, tipo_kit_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {tiposKit?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Nome *</label>
          <input type="text" {...register("nome")} value={data.nome} onChange={(e) => onChange({ ...data, nome: e.target.value })} className={inputCls} placeholder="Ex: Kit Master Flex" />
          {errors.nome && <p className="text-xs text-red-400">{errors.nome.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Sigla</label>
          <input type="text" {...register("sigla")} value={data.sigla} onChange={(e) => onChange({ ...data, sigla: e.target.value })} className={inputCls} placeholder="Ex: KMF" />
        </div>
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

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Chaves do Kit</h3>
        {renderToggleList(chaves, kitChaves, onToggleChave)}
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Fresas do Kit</h3>
        {renderToggleList(fresas, kitFresas, onToggleFresa)}
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Instrumentais Complementares</h3>
        {renderToggleList(complementares, kitComplementares, onToggleComplementar)}
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Instrumentais Opcionais</h3>
        {renderToggleList(opcionais, kitOpcionais, onToggleOpcional)}
      </div>
    </div>
  )
}
