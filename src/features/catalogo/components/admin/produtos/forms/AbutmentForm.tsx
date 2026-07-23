import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoFamilia, CatalogoTipoReabilitacao, CatalogoTipoAbutment, CatalogoChave, CatalogoKit, CatalogoParafusoRetencao } from "~/features/catalogo/types"
import type { CatalogoSeqProtetica } from "~/features/catalogo/services/sequencia-protetica.service"

const abutmentSchema = z.object({
  familia_id: z.string().min(1, "Família é obrigatória"),
  tipo_reabilitacao_id: z.string().min(1, "Tipo de reabilitação é obrigatório"),
  tipo_abutment_id: z.string().min(1, "Tipo de abutment é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  diametro_plataforma: z.string().optional(),
  angulacao_graus: z.coerce.number().optional(),
  altura_transmucoso: z.coerce.number().optional(),
  altura_corpo: z.coerce.number().optional(),
  torque_ncm: z.coerce.number().optional(),
  preco: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
})

export type AbutmentFormData = z.infer<typeof abutmentSchema>

interface Props {
  data: AbutmentFormData
  onChange: (data: AbutmentFormData) => void
  familias: CatalogoFamilia[] | undefined
  tiposReab: CatalogoTipoReabilitacao[] | undefined
  tiposAbutment: CatalogoTipoAbutment[] | undefined
  sequencias: CatalogoSeqProtetica[] | undefined
  sequenciasIds: string[]
  onSequenciasChange: (ids: string[]) => void
  // Composição
  chaves: CatalogoChave[] | undefined
  chavesIds: string[]
  onChavesChange: (ids: string[]) => void
  kits: CatalogoKit[] | undefined
  kitsIds: string[]
  onKitsChange: (ids: string[]) => void
  parafusos: CatalogoParafusoRetencao[] | undefined
  parafusosIds: string[]
  onParafusosChange: (ids: string[]) => void
}

export function AbutmentForm({
  data, onChange, familias, tiposReab, tiposAbutment,
  sequencias, sequenciasIds, onSequenciasChange,
  chaves, chavesIds, onChavesChange,
  kits, kitsIds, onKitsChange,
  parafusos, parafusosIds, onParafusosChange,
}: Props) {
  const { register, formState: { errors } } = useForm<AbutmentFormData>({
    resolver: zodResolver(abutmentSchema),
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
      <div className="space-y-2">
        <label className={labelCls}>SKU *</label>
        <input type="text" {...register("sku")} value={data.sku} onChange={(e) => onChange({ ...data, sku: e.target.value })} className={inputCls} placeholder="Ex: AB1002" />
        {errors.sku && <p className="text-xs text-red-400">{errors.sku.message}</p>}
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Relacionamentos</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Família *</label>
          <select {...register("familia_id")} value={data.familia_id} onChange={(e) => onChange({ ...data, familia_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {familias?.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          {errors.familia_id && <p className="text-xs text-red-400">{errors.familia_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Tipo Reabilitação *</label>
          <select {...register("tipo_reabilitacao_id")} value={data.tipo_reabilitacao_id} onChange={(e) => onChange({ ...data, tipo_reabilitacao_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {tiposReab?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          {errors.tipo_reabilitacao_id && <p className="text-xs text-red-400">{errors.tipo_reabilitacao_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Tipo Abutment *</label>
          <select {...register("tipo_abutment_id")} value={data.tipo_abutment_id} onChange={(e) => onChange({ ...data, tipo_abutment_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {tiposAbutment?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          {errors.tipo_abutment_id && <p className="text-xs text-red-400">{errors.tipo_abutment_id.message}</p>}
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Especificações</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Ø Plataforma (mm)</label>
          <input type="text" {...register("diametro_plataforma")} value={data.diametro_plataforma} onChange={(e) => onChange({ ...data, diametro_plataforma: e.target.value })} className={inputCls} placeholder="Ex: 3.5" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Angulação (graus)</label>
          <input type="number" {...register("angulacao_graus")} value={data.angulacao_graus} onChange={(e) => onChange({ ...data, angulacao_graus: Number(e.target.value) })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Altura Transmucoso (mm)</label>
          <input type="number" step="0.1" {...register("altura_transmucoso")} value={data.altura_transmucoso} onChange={(e) => onChange({ ...data, altura_transmucoso: Number(e.target.value) })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Altura Corpo (mm)</label>
          <input type="number" step="0.1" {...register("altura_corpo")} value={data.altura_corpo} onChange={(e) => onChange({ ...data, altura_corpo: Number(e.target.value) })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Torque (N·cm)</label>
          <input type="number" {...register("torque_ncm")} value={data.torque_ncm} onChange={(e) => onChange({ ...data, torque_ncm: Number(e.target.value) })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Preço (R$)</label>
          <input type="number" step="0.01" min="0" {...register("preco")} value={data.preco} onChange={(e) => onChange({ ...data, preco: Number(e.target.value) })} className={inputCls} placeholder="0,00" />
          {errors.preco && <p className="text-xs text-red-400">{errors.preco.message}</p>}
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Composição do Abutment</h3>

      {/* Chaves */}
      <CompositionSection
        label="Chaves Compatíveis"
        selectedIds={chavesIds}
        options={chaves?.map((c) => ({ id: c.sku, label: `${c.nome} (${c.sigla ?? c.sku})` })) ?? []}
        placeholder="Selecione uma chave..."
        onChange={onChavesChange}
      />

      {/* Kits */}
      <CompositionSection
        label="Kits"
        selectedIds={kitsIds}
        options={kits?.map((k) => ({ id: k.sku, label: k.nome })) ?? []}
        placeholder="Selecione um kit..."
        onChange={onKitsChange}
      />

      {/* Parafusos */}
      <CompositionSection
        label="Parafusos"
        selectedIds={parafusosIds}
        options={parafusos?.map((p) => ({ id: p.sku, label: p.nome })) ?? []}
        placeholder="Selecione um parafuso..."
        onChange={onParafusosChange}
      />



      <CompositionSection
        label="Sequências Protéticas"
        selectedIds={sequenciasIds}
        options={sequencias?.map((s) => ({ id: s.id, label: s.sigla ? `${s.nome} (${s.sigla})` : s.nome })) ?? []}
        placeholder="Selecione uma sequência..."
        onChange={onSequenciasChange}
      />
    </div>
  )
}
// ============================================================
// CompositionSection — select + Adicionar button pattern
// ============================================================

function CompositionSection({
  label, selectedIds, options, placeholder, onChange,
}: {
  label: string
  selectedIds: string[]
  options: { id: string; label: string }[]
  placeholder: string
  onChange: (ids: string[]) => void
}) {
  const [selected, setSelected] = useState("")

  function handleAdd() {
    if (selected && !selectedIds.includes(selected)) {
      onChange([...selectedIds, selected])
      setSelected("")
    }
  }

  function handleRemove(id: string) {
    onChange(selectedIds.filter((s) => s !== id))
  }

  const allOptions = options.length > 0 ? options : []
  const selectedLabels = selectedIds.map((id) => {
    const found = allOptions.find((o) => o.id === id)
    return { id, label: found?.label ?? id }
  })

  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-surface)]/50 p-4 space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
      <div className="flex gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#c9a655]/50 transition-colors"
        >
          <option value="">{placeholder}</option>
          {allOptions.filter((o) => !selectedIds.includes(o.id)).map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selected}
          className="px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-[#0f172a] bg-gradient-to-r from-[#c9a655] to-[#e8d48b] hover:from-[#e8d48b] hover:to-[#c9a655] transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
      </div>
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedLabels.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c9a655]/10 border border-[#c9a655]/20 text-xs font-medium text-[#c9a655]">
              {item.label}
              <button type="button" onClick={() => handleRemove(item.id)} className="ml-0.5 text-[#c9a655]/50 hover:text-red-400 transition-colors">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
