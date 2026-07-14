import { useState, useEffect } from "react"
import { Package, Layers, ShoppingBag, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import toast from "react-hot-toast"

import { useQueryClient } from "@tanstack/react-query"
import { useCatalogoEmpresaId } from "~/features/catalogo/hooks/useCatalogoEmpresa"
import {
  useCriarImplante, useAtualizarImplante,
  useCriarAbutment, useAtualizarAbutment,
  useCriarKit, useAtualizarKit,
  useCategorias, useConexoes, useFamilias, useLinhas,
  useFresas, useCategoriasKit, useChavesFerramental,
  useAcessorios, useInstrumentais, useTiposReabilitacao, useTiposAbutment,
  useImplanteDetalhe, useAbutmentDetalhe, useKitDetalhe,
} from "~/features/catalogo/hooks/useCatalogo"
import { salvarSequenciaProtetica } from "~/features/catalogo/services/sequencia-protetica.service"
import { salvarProtocoloFresagem } from "~/features/catalogo/services/implantes.service"
import { adicionarBOMItem } from "~/features/catalogo/services/kits.service"
import { ImplanteForm } from "./forms/ImplanteForm"
import { AbutmentForm } from "./forms/AbutmentForm"
import { KitForm } from "./forms/KitForm"
import type { CatalogoImplante } from "~/features/catalogo/types"

type ProdutoTipo = "implante" | "abutment" | "kit"
interface SeqEtapa { etapa_nome: string; acessorio_sku: string }
interface BomItem { tipo: "fresa" | "chave" | "acessorio" | "instrumental" | "implante"; sku: string; quantidade: number }

export function ProdutoFormModal({
  open, onOpenChange, editingItem, implantes,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: { sku: string; tipo: string } | null
  implantes?: CatalogoImplante[]
}) {
  const empresaId = useCatalogoEmpresaId()
  const qc = useQueryClient()
  const criarImplante = useCriarImplante()
  const atualizarImplante = useAtualizarImplante()
  const criarAbutment = useCriarAbutment()
  const atualizarAbutment = useAtualizarAbutment()
  const criarKit = useCriarKit()
  const atualizarKit = useAtualizarKit()

  const { data: categorias } = useCategorias()
  const { data: conexoes } = useConexoes()
  const { data: familias } = useFamilias()
  const { data: linhas } = useLinhas()
  const { data: fresas } = useFresas()
  const { data: catsKit } = useCategoriasKit()
  const { data: chaves } = useChavesFerramental()
  const { data: acessorios } = useAcessorios()
  const { data: instrumentais } = useInstrumentais()
  const { data: tiposReab } = useTiposReabilitacao()
  const { data: tiposAbutment } = useTiposAbutment()

  const { data: implDetalhe } = useImplanteDetalhe(editingItem?.tipo === "implante" ? editingItem.sku : "")
  const { data: abDetalhe } = useAbutmentDetalhe(editingItem?.tipo === "abutment" ? editingItem.sku : "")
  const { data: kitDetalhe } = useKitDetalhe(editingItem?.tipo === "kit" ? editingItem.sku : "")

  const [tipo, setTipo] = useState<ProdutoTipo>(
    editingItem?.tipo === "implante" ? "implante" :
    editingItem?.tipo === "abutment" ? "abutment" : "kit"
  )
  const [saving, setSaving] = useState(false)

  const [implante, setImplante] = useState({
    categoria_id: "", conexao_id: "", familia_id: "", linha_id: "",
    sku: "", diametro_mm: 0, comprimento_mm: 0, torque_insercao: 0,
    rosca_interna: "", regiao_apical: "", regiao_cervical: "",
    material: "", superficie: "", tratamento: "", chave_sku: "", preco: 0,
  })

  const [abutment, setAbutment] = useState({
    familia_id: "", tipo_reabilitacao_id: "", tipo_abutment_id: "",
    sku: "", diametro_plataforma: "", angulacao_graus: 0,
    altura_transmucoso: 0, altura_corpo: 0, torque_ncm: 0, preco: 0,
  })

  const [kit, setKit] = useState({
    categoria_id: "", sku: "", nome: "", descricao: "",
    familia_ids: [] as string[], preco: 0,
  })

  const [fresagemHard, setFresagemHard] = useState<{ fresa_sku: string; ordem: number }[]>([])
  const [fresagemSoft, setFresagemSoft] = useState<{ fresa_sku: string; ordem: number }[]>([])
  const [seqAnalógica, setSeqAnalógica] = useState<SeqEtapa[]>([])
  const [seqDigital, setSeqDigital] = useState<SeqEtapa[]>([])
  const [kitBom, setKitBom] = useState<BomItem[]>([])

  function resetForms() {
    setImplante({ categoria_id: "", conexao_id: "", familia_id: "", linha_id: "", sku: "", diametro_mm: 0, comprimento_mm: 0, torque_insercao: 0, rosca_interna: "", regiao_apical: "", regiao_cervical: "", material: "", superficie: "", tratamento: "", chave_sku: "", preco: 0 })
    setAbutment({ familia_id: "", tipo_reabilitacao_id: "", tipo_abutment_id: "", sku: "", diametro_plataforma: "", angulacao_graus: 0, altura_transmucoso: 0, altura_corpo: 0, torque_ncm: 0, preco: 0 })
    setKit({ categoria_id: "", sku: "", nome: "", descricao: "", familia_ids: [], preco: 0 })
    setFresagemHard([])
    setFresagemSoft([])
    setSeqAnalógica([])
    setSeqDigital([])
    setKitBom([])
  }

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setTipo(editingItem.tipo as ProdutoTipo)
      } else {
        setTipo("implante")
        resetForms()
      }
    }
  }, [open, editingItem])

  useEffect(() => {
    if (!open || !editingItem) return
    if (editingItem.tipo === "implante" && implDetalhe) {
      const d = implDetalhe
      const extras = (d.detalhes_extras ?? {}) as Record<string, string>
      setImplante({
        categoria_id: extras.categoria_id ?? "",
        conexao_id: extras.conexao_id ?? "",
        familia_id: extras.familia_id ?? "",
        linha_id: d.linha_id ?? "",
        sku: d.sku ?? "",
        diametro_mm: d.diametro_mm ?? 0,
        comprimento_mm: d.comprimento_mm ?? 0,
        torque_insercao: d.torque_insercao ?? 0,
        rosca_interna: d.rosca_interna ?? "",
        regiao_apical: d.regiao_apical ?? "",
        regiao_cervical: d.regiao_cervical ?? "",
        material: extras.material ?? "",
        superficie: extras.superficie ?? "",
        tratamento: extras.tratamento ?? "",
        chave_sku: extras.chave_sku ?? "",
        preco: d.preco ?? 0,
      })
    }
    if (editingItem.tipo === "abutment" && abDetalhe) {
      const d = abDetalhe
      setAbutment({
        familia_id: d.familia_id ?? "",
        tipo_reabilitacao_id: d.tipo_reabilitacao_id ?? "",
        tipo_abutment_id: d.tipo_abutment_id ?? "",
        sku: d.sku ?? "",
        diametro_plataforma: d.diametro_plataforma ?? "",
        angulacao_graus: d.angulacao_graus ?? 0,
        altura_transmucoso: d.altura_transmucoso ?? 0,
        altura_corpo: d.altura_corpo ?? 0,
        torque_ncm: d.torque_ncm ?? 0,
        preco: d.preco ?? 0,
      })
    }
    if (editingItem.tipo === "kit" && kitDetalhe) {
      const d = kitDetalhe
      setKit({
        categoria_id: d.categoria_id ?? "",
        sku: d.sku ?? "",
        nome: d.nome ?? "",
        descricao: d.descricao ?? "",
        familia_ids: d.familias?.map((f) => f.familia_id) ?? [],
        preco: d.preco ?? 0,
      })
    }
  }, [open, editingItem, implDetalhe, abDetalhe, kitDetalhe])

  function gerarSkuSugerido() {
    if (tipo !== "implante") return
    const conn = conexoes?.find((c) => c.id === implante.conexao_id)
    const fam = familias?.find((f) => f.id === implante.familia_id)
    if (conn?.sigla && fam?.nome && implante.diametro_mm && implante.comprimento_mm) {
      const sug = `IMP-${conn.sigla}-${fam.nome}-${String(implante.diametro_mm).replace(".", "")}${String(implante.comprimento_mm).replace(".", "")}`
      setImplante((prev) => ({ ...prev, sku: sug }))
    }
  }

  function validateRequired() {
    if (tipo === "implante") {
      if (!implante.sku) return "SKU é obrigatório"
      if (!implante.linha_id) return "Linha é obrigatória"
      if (!implante.diametro_mm || implante.diametro_mm <= 0) return "Diâmetro deve ser positivo"
      if (!implante.comprimento_mm || implante.comprimento_mm <= 0) return "Comprimento deve ser positivo"
    } else if (tipo === "abutment") {
      if (!abutment.sku) return "SKU é obrigatório"
      if (!abutment.familia_id) return "Família é obrigatória"
      if (!abutment.tipo_reabilitacao_id) return "Tipo de reabilitação é obrigatório"
      if (!abutment.tipo_abutment_id) return "Tipo de abutment é obrigatório"
    } else if (tipo === "kit") {
      if (!kit.sku) return "SKU é obrigatório"
      if (!kit.nome) return "Nome é obrigatório"
      if (!kit.categoria_id) return "Categoria é obrigatória"
    }
    return null
  }

  function makeImplantePayload() {
    return {
      sku: implante.sku,
      linha_id: implante.linha_id,
      diametro_mm: implante.diametro_mm,
      comprimento_mm: implante.comprimento_mm,
      torque_insercao: implante.torque_insercao || undefined,
      rosca_interna: implante.rosca_interna || undefined,
      regiao_apical: implante.regiao_apical || undefined,
      regiao_cervical: implante.regiao_cervical || undefined,
      preco: implante.preco || undefined,
      detalhes_extras: {
        material: implante.material || undefined,
        superficie: implante.superficie || undefined,
        tratamento: implante.tratamento || undefined,
        chave_sku: implante.chave_sku || undefined,
        categoria_id: implante.categoria_id || undefined,
        conexao_id: implante.conexao_id || undefined,
        familia_id: implante.familia_id || undefined,
      },
    }
  }

  function makeAbutmentPayload() {
    return {
      sku: abutment.sku,
      familia_id: abutment.familia_id,
      tipo_reabilitacao_id: abutment.tipo_reabilitacao_id,
      tipo_abutment_id: abutment.tipo_abutment_id,
      diametro_plataforma: abutment.diametro_plataforma || undefined,
      angulacao_graus: abutment.angulacao_graus || undefined,
      altura_transmucoso: abutment.altura_transmucoso || undefined,
      altura_corpo: abutment.altura_corpo || undefined,
      torque_ncm: abutment.torque_ncm || undefined,
      preco: abutment.preco || undefined,
    }
  }

  function makeKitPayload() {
    return {
      sku: kit.sku,
      categoria_id: kit.categoria_id,
      nome: kit.nome,
      descricao: kit.descricao || undefined,
      familia_ids: kit.familia_ids,
      preco: kit.preco || undefined,
    }
  }

  async function handleSave() {
    const erro = validateRequired()
    if (erro) {
      toast.error(erro, {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
        duration: 4000,
      })
      return
    }
    setSaving(true)
    try {
      if (tipo === "implante") {
        const payload = makeImplantePayload()
        if (editingItem) {
          await atualizarImplante.mutateAsync({ sku: editingItem.sku, input: payload })
        } else {
          await criarImplante.mutateAsync(payload)
        }
        const protocolos = [
          ...fresagemHard.map((f) => ({ fresa_sku: f.fresa_sku, tipo_osso: "Hard (I-II)" as const, ordem_uso: f.ordem })),
          ...fresagemSoft.map((f) => ({ fresa_sku: f.fresa_sku, tipo_osso: "Soft (III-IV)" as const, ordem_uso: f.ordem })),
        ]
        if (protocolos.length > 0) {
          await salvarProtocoloFresagem(empresaId, implante.sku, protocolos)
        }
      } else if (tipo === "abutment") {
        const payload = makeAbutmentPayload()
        if (editingItem) {
          await atualizarAbutment.mutateAsync({ sku: editingItem.sku, input: payload })
        } else {
          await criarAbutment.mutateAsync(payload)
        }
        const allEtapas = [
          ...seqAnalógica.map((e, i) => ({ tipo_workflow: "analógico" as const, etapa_ordem: i + 1, etapa_nome: e.etapa_nome, acessorio_sku: e.acessorio_sku })),
          ...seqDigital.map((e, i) => ({ tipo_workflow: "digital" as const, etapa_ordem: i + 1, etapa_nome: e.etapa_nome, acessorio_sku: e.acessorio_sku })),
        ]
        await salvarSequenciaProtetica(empresaId, abutment.sku, allEtapas)
      } else {
        const payload = makeKitPayload()
        if (editingItem) {
          await atualizarKit.mutateAsync({ sku: editingItem.sku, input: payload })
        } else {
          await criarKit.mutateAsync(payload)
        }
        for (const item of kitBom) {
          await adicionarBOMItem(empresaId, kit.sku, { tipo: item.tipo, sku: item.sku, quantidade: item.quantidade })
        }
      }

      qc.invalidateQueries({ queryKey: ["catalogo"] })
      onOpenChange(false)
      resetForms()
    } catch (err: any) {
      console.error("Erro ao salvar produto:", err)
      const msg = err?.message || err?.error?.message || err?.details || "Erro ao salvar produto"
      const code = err?.code || err?.error?.code
      toast.error(code ? `[${code}] ${msg}` : msg, {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
        duration: 6000,
      })
    } finally {
      setSaving(false)
    }
  }

  function addFresagem(tipoOsso: "hard" | "soft") {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    const arr = tipoOsso === "hard" ? fresagemHard : fresagemSoft
    setter([...arr, { fresa_sku: "", ordem: arr.length + 1 }])
  }
  function removeFresagem(tipoOsso: "hard" | "soft", idx: number) {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    setter((tipoOsso === "hard" ? fresagemHard : fresagemSoft).filter((_, i) => i !== idx))
  }
  function updateFresagem(tipoOsso: "hard" | "soft", idx: number, field: string, value: string | number) {
    const setter = tipoOsso === "hard" ? setFresagemHard : setFresagemSoft
    const arr = [...(tipoOsso === "hard" ? fresagemHard : fresagemSoft)]
    arr[idx] = { ...arr[idx], [field]: value }
    setter(arr)
  }
  function addSeqEtapa(tipo: "analógico" | "digital") {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    setter([...(tipo === "analógico" ? seqAnalógica : seqDigital), { etapa_nome: "", acessorio_sku: "" }])
  }
  function removeSeqEtapa(tipo: "analógico" | "digital", idx: number) {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    setter((tipo === "analógico" ? seqAnalógica : seqDigital).filter((_, i) => i !== idx))
  }
  function updateSeqEtapa(tipo: "analógico" | "digital", idx: number, field: string, value: string) {
    const setter = tipo === "analógico" ? setSeqAnalógica : setSeqDigital
    const arr = [...(tipo === "analógico" ? seqAnalógica : seqDigital)]
    arr[idx] = { ...arr[idx], [field]: value }
    setter(arr)
  }
  function addBomItem() { setKitBom([...kitBom, { tipo: "fresa", sku: "", quantidade: 1 }]) }
  function removeBomItem(idx: number) { setKitBom(kitBom.filter((_, i) => i !== idx)) }
  function updateBomItem(idx: number, field: string, value: string | number) {
    const arr = [...kitBom]
    arr[idx] = { ...arr[idx], [field]: value }
    setKitBom(arr)
  }

  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f172a] border-[var(--color-border-subtle)] text-white max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{editingItem ? `Editar ${editingItem.tipo}` : "Novo Produto"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingItem ? `Editando ${editingItem.sku}` : "Preencha as informações para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-2">
            <label className={labelCls}>Tipo de Produto</label>
            <div className="flex gap-2">
              {(["implante", "abutment", "kit"] as ProdutoTipo[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  disabled={!!editingItem}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    tipo === t
                      ? "bg-[#c9a655] text-[#0f172a]"
                      : "bg-[var(--color-surface)] text-gray-400 border border-white/5 hover:border-white/10"
                  }`}
                >
                  {t === "implante" && <Package className="h-4 w-4" />}
                  {t === "abutment" && <Layers className="h-4 w-4" />}
                  {t === "kit" && <ShoppingBag className="h-4 w-4" />}
                  {t === "implante" ? "Implante" : t === "abutment" ? "Componente" : "Kit"}
                </button>
              ))}
            </div>
          </div>

          {tipo === "implante" && (
            <ImplanteForm
              data={implante}
              onChange={(d) => setImplante(d)}
              categorias={categorias}
              conexoes={conexoes}
              familias={familias}
              linhas={linhas}
              fresas={fresas}
              chaves={chaves}
              fresagemHard={fresagemHard}
              fresagemSoft={fresagemSoft}
              addFresagem={addFresagem}
              removeFresagem={removeFresagem}
              updateFresagem={updateFresagem}
              onGerarSku={gerarSkuSugerido}
            />
          )}

          {tipo === "abutment" && (
            <AbutmentForm
              data={abutment}
              onChange={(d) => setAbutment(d)}
              familias={familias}
              tiposReab={tiposReab}
              tiposAbutment={tiposAbutment}
              acessorios={acessorios}
              seqAnalógica={seqAnalógica}
              seqDigital={seqDigital}
              addSeqEtapa={addSeqEtapa}
              removeSeqEtapa={removeSeqEtapa}
              updateSeqEtapa={updateSeqEtapa}
            />
          )}

          {tipo === "kit" && (
            <KitForm
              data={kit}
              onChange={(d) => setKit(d)}
              catsKit={catsKit}
              familias={familias}
              fresas={fresas}
              chaves={chaves}
              acessorios={acessorios}
              instrumentais={instrumentais}
              implantes={implantes}
              kitBom={kitBom}
              addBomItem={addBomItem}
              removeBomItem={removeBomItem}
              updateBomItem={updateBomItem}
            />
          )}
        </div>

        <DialogFooter className="shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 rounded-xl text-[#0f172a] font-black hover:scale-105 transition-transform disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c9a655, #e8d48b)" }}
          >
            {saving ? "Salvando..." : editingItem ? "Salvar" : "Criar Produto"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
