import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoCategoria, CatalogoConexao, CatalogoFamilia, CatalogoLinha, CatalogoFresa, CatalogoChaveFerramental } from "~/features/catalogo/types"

const implanteSchema = z.object({
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  conexao_id: z.string().min(1, "Conexão é obrigatória"),
  familia_id: z.string().min(1, "Família é obrigatória"),
  linha_id: z.string().min(1, "Linha é obrigatória"),
  sku: z.string().min(1, "SKU é obrigatório"),
  diametro_mm: z.coerce.number().positive("Ø deve ser positivo"),
  comprimento_mm: z.coerce.number().positive("Comp. deve ser positivo"),
  torque_insercao: z.coerce.number().optional(),
  rosca_interna: z.string().optional(),
  regiao_apical: z.string().optional(),
  regiao_cervical: z.string().optional(),
  material: z.string().optional(),
  superficie: z.string().optional(),
  tratamento: z.string().optional(),
  chave_sku: z.string().optional(),
  preco: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
})

export type ImplanteFormData = z.infer<typeof implanteSchema>

interface FresagemItem { fresa_sku: string; ordem: number }

interface Props {
  data: ImplanteFormData
  onChange: (data: ImplanteFormData) => void
  categorias: CatalogoCategoria[] | undefined
  conexoes: CatalogoConexao[] | undefined
  familias: CatalogoFamilia[] | undefined
  linhas: CatalogoLinha[] | undefined
  fresas: CatalogoFresa[] | undefined
  chaves: CatalogoChaveFerramental[] | undefined
  fresagemHard: FresagemItem[]
  fresagemSoft: FresagemItem[]
  addFresagem: (tipo: "hard" | "soft") => void
  removeFresagem: (tipo: "hard" | "soft", idx: number) => void
  updateFresagem: (tipo: "hard" | "soft", idx: number, field: string, value: string | number) => void
  onGerarSku: () => void
}

export function ImplanteForm({
  data, onChange, categorias, conexoes, familias, linhas,
  fresas, chaves, fresagemHard, fresagemSoft,
  addFresagem, removeFresagem, updateFresagem, onGerarSku,
}: Props) {
  const { register, formState: { errors } } = useForm<ImplanteFormData>({
    resolver: zodResolver(implanteSchema),
    defaultValues: data,
    values: data,
    mode: "onChange",
  })

  const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Hierarquia</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Categoria *</label>
          <select {...register("categoria_id")} value={data.categoria_id} onChange={(e) => onChange({ ...data, categoria_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {categorias?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {errors.categoria_id && <p className="text-xs text-red-400">{errors.categoria_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Conexão *</label>
          <select {...register("conexao_id")} value={data.conexao_id} onChange={(e) => onChange({ ...data, conexao_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {conexoes?.filter((c) => !data.categoria_id || c.categoria_id === data.categoria_id).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          {errors.conexao_id && <p className="text-xs text-red-400">{errors.conexao_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Família *</label>
          <select {...register("familia_id")} value={data.familia_id} onChange={(e) => onChange({ ...data, familia_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {familias?.filter((f) => !data.conexao_id || f.conexao_id === data.conexao_id).map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          {errors.familia_id && <p className="text-xs text-red-400">{errors.familia_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Linha *</label>
          <select {...register("linha_id")} value={data.linha_id} onChange={(e) => onChange({ ...data, linha_id: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {linhas?.filter((l) => !data.familia_id || l.familia_id === data.familia_id).map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
          {errors.linha_id && <p className="text-xs text-red-400">{errors.linha_id.message}</p>}
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
      <div className="space-y-2">
        <label className={labelCls}>SKU *</label>
        <div className="flex gap-2">
          <input type="text" {...register("sku")} value={data.sku} onChange={(e) => onChange({ ...data, sku: e.target.value })} className={inputCls + " flex-1"} placeholder="Ex: 524385" />
          <button type="button" onClick={onGerarSku} className="px-3 py-2 rounded-lg text-xs font-bold bg-[#c9a655]/20 text-[#c9a655] border border-[#c9a655]/30 hover:bg-[#c9a655]/30 transition-colors shrink-0" title="Gerar SKU automaticamente">Gerar</button>
        </div>
        {errors.sku && <p className="text-xs text-red-400">{errors.sku.message}</p>}
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Especificações Cirúrgicas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Ø mm *</label>
          <input type="number" step="0.1" {...register("diametro_mm")} value={data.diametro_mm} onChange={(e) => onChange({ ...data, diametro_mm: Number(e.target.value) })} className={inputCls} />
          {errors.diametro_mm && <p className="text-xs text-red-400">{errors.diametro_mm.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Comp. mm *</label>
          <input type="number" step="0.1" {...register("comprimento_mm")} value={data.comprimento_mm} onChange={(e) => onChange({ ...data, comprimento_mm: Number(e.target.value) })} className={inputCls} />
          {errors.comprimento_mm && <p className="text-xs text-red-400">{errors.comprimento_mm.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Torque N·cm</label>
          <input type="number" {...register("torque_insercao")} value={data.torque_insercao} onChange={(e) => onChange({ ...data, torque_insercao: Number(e.target.value) })} className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Rosca Interna</label>
          <input type="text" {...register("rosca_interna")} value={data.rosca_interna} onChange={(e) => onChange({ ...data, rosca_interna: e.target.value })} className={inputCls} placeholder="Ex: M 1.6" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Região Apical</label>
          <input type="text" {...register("regiao_apical")} value={data.regiao_apical} onChange={(e) => onChange({ ...data, regiao_apical: e.target.value })} className={inputCls} placeholder="Ex: Cônico" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Região Cervical</label>
          <input type="text" {...register("regiao_cervical")} value={data.regiao_cervical} onChange={(e) => onChange({ ...data, regiao_cervical: e.target.value })} className={inputCls} placeholder="Ex: Cilíndrico" />
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Material & Superfície</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Material</label>
          <input type="text" {...register("material")} value={data.material} onChange={(e) => onChange({ ...data, material: e.target.value })} className={inputCls} placeholder="Ex: Titânio Grau 4" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Superfície</label>
          <input type="text" {...register("superficie")} value={data.superficie} onChange={(e) => onChange({ ...data, superficie: e.target.value })} className={inputCls} placeholder="Ex: Porous" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Tratamento</label>
          <input type="text" {...register("tratamento")} value={data.tratamento} onChange={(e) => onChange({ ...data, tratamento: e.target.value })} className={inputCls} placeholder="Ex: SLA" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Chave de Instalação</label>
          <select {...register("chave_sku")} value={data.chave_sku} onChange={(e) => onChange({ ...data, chave_sku: e.target.value })} className={selectCls}>
            <option value="">Selecione...</option>
            {chaves?.map((c) => <option key={c.sku} value={c.sku}>{c.nome}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Preço (R$)</label>
          <input type="number" step="0.01" min="0" {...register("preco")} value={data.preco} onChange={(e) => onChange({ ...data, preco: Number(e.target.value) })} className={inputCls} placeholder="0,00" />
          {errors.preco && <p className="text-xs text-red-400">{errors.preco.message}</p>}
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência de Fresagem — Osso Hard (I-II)</h3>
        {fresagemHard.length === 0 && <p className="text-xs text-gray-500 italic">Nenhuma fresa adicionada.</p>}
        {fresagemHard.map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
            <select value={f.fresa_sku} onChange={(e) => updateFresagem("hard", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
              <option value="">Selecione a fresa...</option>
              {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
            </select>
            <button onClick={() => removeFresagem("hard", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button onClick={() => addFresagem("hard")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
          <span className="text-lg leading-none">+</span> Adicionar fresa Hard
        </button>
      </div>

      <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a655]">Sequência de Fresagem — Osso Soft (III-IV)</h3>
        {fresagemSoft.length === 0 && <p className="text-xs text-gray-500 italic">Nenhuma fresa adicionada.</p>}
        {fresagemSoft.map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-[var(--color-background)] rounded-lg p-3 border border-white/5">
            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#c9a655]/10 text-[#c9a655] text-xs font-black shrink-0">{i + 1}</span>
            <select value={f.fresa_sku} onChange={(e) => updateFresagem("soft", i, "fresa_sku", e.target.value)} className={selectCls + " flex-1"}>
              <option value="">Selecione a fresa...</option>
              {fresas?.map((fr) => <option key={fr.sku} value={fr.sku}>{fr.nome} (Ø{fr.diametro_mm})</option>)}
            </select>
            <button onClick={() => removeFresagem("soft", i)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <button onClick={() => addFresagem("soft")} className="flex items-center gap-1.5 text-xs font-bold text-[#c9a655] hover:text-[#e8d48b] transition-colors pt-1">
          <span className="text-lg leading-none">+</span> Adicionar fresa Soft
        </button>
      </div>
    </div>
  )
}
