import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import type { CatalogoCategoria, CatalogoIpsConexao, CatalogoIpsFamilia, CatalogoIpsLinha, CatalogoFresa, CatalogoChave, CatalogoProtocoloFresagem } from "~/features/catalogo/types"

const implanteSchema = z.object({
  // Hierarquia
  conexao_id: z.string().min(1, "Conexão é obrigatória"),
  familia_id: z.string().min(1, "Família é obrigatória"),
  linha_id: z.string().min(1, "Linha é obrigatória"),
  // Identificação
  sku: z.string().min(1, "SKU é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  sigla: z.string().optional(),
  descricao: z.string().optional(),
  // Protocolos
  osso_soft: z.string().optional(),
  osso_hard: z.string().optional(),
  // Especificações
  diametro_mm: z.coerce.number().positive("Ø deve ser positivo"),
  comprimento_mm: z.coerce.number().positive("Comp. deve ser positivo"),
  rosca_interna: z.string().optional(),
  regiao_apical: z.string().optional(),
  regiao_cervical: z.string().optional(),
  torque_insercao: z.coerce.number().optional(),
  macrogeometria: z.string().optional(),
  material: z.string().optional(),
  superficie: z.string().optional(),
  // Comercial
  preco: z.coerce.number().min(0, "Preço não pode ser negativo").optional(),
})

export type ImplanteFormData = z.infer<typeof implanteSchema>

interface Props {
  data: ImplanteFormData
  onChange: (data: ImplanteFormData) => void
  categorias: CatalogoCategoria[] | undefined
  conexoes: CatalogoIpsConexao[] | undefined
  familias: CatalogoIpsFamilia[] | undefined
  linhas: CatalogoIpsLinha[] | undefined
  fresas: CatalogoFresa[] | undefined
  chaves: CatalogoChave[] | undefined
  protocolos: CatalogoProtocoloFresagem[] | undefined
  onGerarSku: () => void
}

export function ImplanteForm({
  data, onChange, categorias, conexoes, familias, linhas,
  fresas, chaves, protocolos, onGerarSku,
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
          <label className={labelCls}>Conexão *</label>
          <select {...register("conexao_id")} value={data.conexao_id} onChange={(e) => onChange({ ...data, conexao_id: e.target.value, familia_id: "", linha_id: "" })} className={selectCls}>
            <option value="">Selecione...</option>
            {conexoes?.map((c) => <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>)}
          </select>
          {errors.conexao_id && <p className="text-xs text-red-400">{errors.conexao_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Família *</label>
          <select {...register("familia_id")} value={data.familia_id} onChange={(e) => onChange({ ...data, familia_id: e.target.value, linha_id: "" })} className={selectCls} disabled={!data.conexao_id}>
            <option value="">Selecione...</option>
            {familias?.filter((f) => f.conexao_id === data.conexao_id).map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
          {errors.familia_id && <p className="text-xs text-red-400">{errors.familia_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Linha *</label>
          <select {...register("linha_id")} value={data.linha_id} onChange={(e) => onChange({ ...data, linha_id: e.target.value })} className={selectCls} disabled={!data.familia_id}>
            <option value="">Selecione...</option>
            {linhas?.filter((l) => l.familia_id === data.familia_id).map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
          {errors.linha_id && <p className="text-xs text-red-400">{errors.linha_id.message}</p>}
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655]">Identificação</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>SKU *</label>
          <div className="flex gap-2">
            <input type="text" {...register("sku")} value={data.sku} onChange={(e) => onChange({ ...data, sku: e.target.value })} className={inputCls + " flex-1"} placeholder="Ex: 524385" />
            <button type="button" onClick={onGerarSku} className="px-3 py-2 rounded-lg text-xs font-bold bg-[#c9a655]/20 text-[#c9a655] border border-[#c9a655]/30 hover:bg-[#c9a655]/30 transition-colors shrink-0" title="Gerar SKU automaticamente">Gerar</button>
          </div>
          {errors.sku && <p className="text-xs text-red-400">{errors.sku.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Nome *</label>
          <input type="text" {...register("nome")} value={data.nome} onChange={(e) => onChange({ ...data, nome: e.target.value })} className={inputCls} placeholder="Nome do implante" />
          {errors.nome && <p className="text-xs text-red-400">{errors.nome.message}</p>}
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Sigla</label>
          <input type="text" {...register("sigla")} value={data.sigla} onChange={(e) => onChange({ ...data, sigla: e.target.value })} className={inputCls} placeholder="Ex: IMP" />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Descrição</label>
          <input type="text" {...register("descricao")} value={data.descricao} onChange={(e) => onChange({ ...data, descricao: e.target.value })} className={inputCls} placeholder="Descrição do implante" />
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Protocolos de Fresagem</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Protocolo Osso Soft (III-IV)</label>
          <select {...register("osso_soft")} value={data.osso_soft} onChange={(e) => onChange({ ...data, osso_soft: e.target.value })} className={selectCls}>
            <option value="">Nenhum</option>
            {protocolos?.filter((p) => ["D3","D4","D5"].includes(p.tipo_osso)).map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelCls}>Protocolo Osso Hard (I-II)</label>
          <select {...register("osso_hard")} value={data.osso_hard} onChange={(e) => onChange({ ...data, osso_hard: e.target.value })} className={selectCls}>
            <option value="">Nenhum</option>
            {protocolos?.filter((p) => ["D1","D2"].includes(p.tipo_osso)).map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
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
          <label className={labelCls}>Macrogeometria</label>
          <input type="text" {...register("macrogeometria")} value={data.macrogeometria} onChange={(e) => onChange({ ...data, macrogeometria: e.target.value })} className={inputCls} placeholder="Ex: Taper" />
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
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-[#c9a655] pt-2">Comercial</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>Preço (R$)</label>
          <input type="number" step="0.01" min="0" {...register("preco")} value={data.preco} onChange={(e) => onChange({ ...data, preco: Number(e.target.value) })} className={inputCls} placeholder="0,00" />
          {errors.preco && <p className="text-xs text-red-400">{errors.preco.message}</p>}
        </div>
      </div>
    </div>
  )
}
