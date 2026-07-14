import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoFamilia, CatalogoTipoReabilitacao, CatalogoTipoAbutment, CatalogoAcessorio } from "~/features/catalogo/types"

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

interface SeqEtapa { etapa_nome: string; acessorio_sku: string }

interface Props {
  data: AbutmentFormData
  onChange: (data: AbutmentFormData) => void
  familias: CatalogoFamilia[] | undefined
  tiposReab: CatalogoTipoReabilitacao[] | undefined
  tiposAbutment: CatalogoTipoAbutment[] | undefined
  acessorios: CatalogoAcessorio[] | undefined
  seqAnalógica: SeqEtapa[]
  seqDigital: SeqEtapa[]
  addSeqEtapa: (tipo: "analógico" | "digital") => void
  removeSeqEtapa: (tipo: "analógico" | "digital", idx: number) => void
  updateSeqEtapa: (tipo: "analógico" | "digital", idx: number, field: string, value: string) => void
}

export function AbutmentForm({
  data, onChange, familias, tiposReab, tiposAbutment,
  acessorios, seqAnalógica, seqDigital,
  addSeqEtapa, removeSeqEtapa, updateSeqEtapa,
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

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência Protética — Analógica</h3>
        {seqAnalógica.length === 0 && <p className="text-xs text-gray-500 italic">Nenhuma etapa adicionada.</p>}
        {seqAnalógica.map((e, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
            <input type="text" value={e.etapa_nome} onChange={(e2) => updateSeqEtapa("analógico", i, "etapa_nome", e2.target.value)} className={inputCls + " flex-1"} placeholder="Nome da etapa (ex: Cicatrização)" />
            <select value={e.acessorio_sku} onChange={(e2) => updateSeqEtapa("analógico", i, "acessorio_sku", e2.target.value)} className={selectCls + " flex-1"}>
              <option value="">Selecione o acessório...</option>
              {acessorios?.map((a) => <option key={a.sku} value={a.sku}>{a.nome}</option>)}
            </select>
            <button onClick={() => removeSeqEtapa("analógico", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button onClick={() => addSeqEtapa("analógico")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
          <span className="text-lg leading-none">+</span> Adicionar etapa Analógica
        </button>
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência Protética — Digital</h3>
        {seqDigital.length === 0 && <p className="text-xs text-gray-500 italic">Nenhuma etapa adicionada.</p>}
        {seqDigital.map((e, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
            <input type="text" value={e.etapa_nome} onChange={(e2) => updateSeqEtapa("digital", i, "etapa_nome", e2.target.value)} className={inputCls + " flex-1"} placeholder="Nome da etapa (ex: Cicatrização)" />
            <select value={e.acessorio_sku} onChange={(e2) => updateSeqEtapa("digital", i, "acessorio_sku", e2.target.value)} className={selectCls + " flex-1"}>
              <option value="">Selecione o acessório...</option>
              {acessorios?.map((a) => <option key={a.sku} value={a.sku}>{a.nome}</option>)}
            </select>
            <button onClick={() => removeSeqEtapa("digital", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button onClick={() => addSeqEtapa("digital")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
          <span className="text-lg leading-none">+</span> Adicionar etapa Digital
        </button>
      </div>
    </div>
  )
}
