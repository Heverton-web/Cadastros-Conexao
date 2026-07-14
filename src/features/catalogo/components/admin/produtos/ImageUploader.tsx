import { useState, useRef, useCallback } from "react"
import { Upload, Link2, HardDrive, X, GripVertical, ImagePlus, Loader2, Check } from "lucide-react"
import toast from "react-hot-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  uploadEAdicionarImagem,
  adicionarImagemUrl,
  listarImagens,
  removerImagem,
  reordenarImagens,
  validarArquivoImagem,
} from "~/features/catalogo/services/imagens.service"
import type { CatalogoImagemProduto, ProdutoTipoImagem } from "~/features/catalogo/types"

interface ImageUploaderProps {
  empresaId: string
  produtoTipo: ProdutoTipoImagem
  produtoSku: string
  imagensExistentes?: CatalogoImagemProduto[]
  onImagensChange: (imagens: CatalogoImagemProduto[]) => void
}

interface PendingPreview {
  file: File
  previewUrl: string
}

export function ImageUploader({
  empresaId,
  produtoTipo,
  produtoSku,
  imagensExistentes = [],
  onImagensChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [gdriveInput, setGdriveInput] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [pendingPreviews, setPendingPreviews] = useState<PendingPreview[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imagens = imagensExistentes

  async function recarregarImagens() {
    const lista = await listarImagens(empresaId, produtoTipo, produtoSku)
    onImagensChange(lista)
  }

  function criarPreviews(files: FileList) {
    const novosPreviews: PendingPreview[] = []
    for (const file of Array.from(files)) {
      const validacao = validarArquivoImagem(file)
      if (!validacao.valido) {
        toast.error(validacao.erro!, {
          style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
        })
        continue
      }
      const previewUrl = URL.createObjectURL(file)
      novosPreviews.push({ file, previewUrl })
    }
    setPendingPreviews(novosPreviews)
    return novosPreviews
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const previews = criarPreviews(files)
    if (previews.length === 0) return

    setUploading(true)
    let hasCompressed = false
    try {
      for (const preview of previews) {
        if (preview.file.size > 5 * 1024 * 1024) {
          setCompressing(true)
          hasCompressed = true
        }
        await uploadEAdicionarImagem(empresaId, produtoTipo, produtoSku, preview.file)
        setCompressing(false)
      }

      // Limpar previews e mostrar sucesso
      setPendingPreviews([])
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)

      await recarregarImagens()

      if (hasCompressed) {
        toast.success("Imagem comprimida e enviada com sucesso!", {
          style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
          duration: 3000,
        })
      } else {
        toast.success("Imagem enviada com sucesso!", {
          style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
          duration: 3000,
        })
      }
    } catch (err: any) {
      setPendingPreviews([])
      toast.error(err.message || "Erro ao fazer upload", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
    } finally {
      setUploading(false)
      setCompressing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [empresaId, produtoTipo, produtoSku])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  async function handleAdicionarUrl() {
    const url = urlInput.trim()
    if (!url) return

    try {
      new URL(url)
    } catch {
      toast.error("URL inválida", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
      return
    }

    setUploading(true)
    try {
      await adicionarImagemUrl(empresaId, produtoTipo, produtoSku, url, "url")
      setUrlInput("")
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
      await recarregarImagens()
      toast.success("Imagem adicionada via URL!", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
      })
    } catch (err: any) {
      toast.error(err.message || "Erro ao adicionar URL", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleAdicionarGDrive() {
    const url = gdriveInput.trim()
    if (!url) return

    if (!url.includes("drive.google.com")) {
      toast.error("URL não é do Google Drive", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
      return
    }

    setUploading(true)
    try {
      await adicionarImagemUrl(empresaId, produtoTipo, produtoSku, url, "gdrive")
      setGdriveInput("")
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
      await recarregarImagens()
      toast.success("Imagem adicionada do Google Drive!", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
      })
    } catch (err: any) {
      toast.error(err.message || "Erro ao adicionar do Google Drive", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleRemover(imagem: CatalogoImagemProduto) {
    try {
      await removerImagem(empresaId, imagem.id, imagem.fonte)
      await recarregarImagens()
      toast.success("Imagem removida!", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
      })
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover imagem", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
    }
  }

  async function handleMover(imagem: CatalogoImagemProduto, direcao: -1 | 1) {
    const idx = imagens.findIndex((i) => i.id === imagem.id)
    const novoIdx = idx + direcao
    if (novoIdx < 0 || novoIdx >= imagens.length) return

    const novosOrdens = imagens.map((img, i) => {
      if (i === idx) return { id: img.id, ordem: i + direcao }
      if (i === novoIdx) return { id: img.id, ordem: i - direcao }
      return { id: img.id, ordem: i }
    })

    try {
      await reordenarImagens(empresaId, produtoTipo, produtoSku, novosOrdens)
      await recarregarImagens()
    } catch {
      // Silenciar erro de reordenação
    }
  }

  const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"
  const semSku = !produtoSku || produtoSku.trim() === ""

  return (
    <div className="space-y-3">
      <label className={labelCls}>Imagens do Produto</label>

      {/* Aviso quando não tem SKU */}
      {semSku && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <p className="font-bold">Informe o SKU primeiro</p>
          <p className="text-xs text-amber-400/70 mt-1">O SKU é necessário para salvar as imagens. Preencha o campo SKU acima.</p>
        </div>
      )}

      {/* Preview de imagens pendentes (antes de enviar) */}
      {pendingPreviews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[#c9a655] font-bold">Preview - Imagens selecionadas:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {pendingPreviews.map((preview, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[#c9a655]/50 bg-[var(--color-surface)]"
              >
                <img
                  src={preview.previewUrl}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    {compressing ? (
                      <Loader2 className="w-6 h-6 text-[#c9a655] animate-spin" />
                    ) : (
                      <div className="text-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin mx-auto" />
                        <p className="text-[9px] text-white mt-1">Enviando...</p>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    URL.revokeObjectURL(preview.previewUrl)
                    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx))
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galeria de imagens salvas */}
      {imagens.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {imagens
            .sort((a, b) => a.ordem_exibicao - b.ordem_exibicao)
            .map((img, idx) => (
            <div
              key={img.id}
              className={`group relative aspect-square rounded-xl overflow-hidden border bg-[var(--color-surface)] transition-all ${
                uploadSuccess && idx === imagens.length - 1
                  ? "border-green-500 ring-2 ring-green-500/30"
                  : "border-white/10"
              }`}
            >
              <img
                src={img.url_imagem}
                alt={`Imagem ${idx + 1}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = "none"
                  const parent = el.parentElement
                  if (parent && !parent.querySelector(".img-error-placeholder")) {
                    const placeholder = document.createElement("div")
                    placeholder.className = "img-error-placeholder absolute inset-0 flex items-center justify-center bg-[var(--color-surface)]"
                    placeholder.innerHTML = '<span class="text-[10px] text-gray-500">Erro ao carregar</span>'
                    parent.appendChild(placeholder)
                  }
                }}
              />

              {/* Indicador de sucesso no último upload */}
              {uploadSuccess && idx === imagens.length - 1 && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Overlay de ações */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx > 0 && (
                  <button
                    onClick={() => handleMover(img, -1)}
                    className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                    title="Mover para esquerda"
                  >
                    <GripVertical className="w-3.5 h-3.5 rotate-90" />
                  </button>
                )}
                {idx < imagens.length - 1 && (
                  <button
                    onClick={() => handleMover(img, 1)}
                    className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                    title="Mover para direita"
                  >
                    <GripVertical className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                )}
                <button
                  onClick={() => handleRemover(img)}
                  className="w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500"
                  title="Remover imagem"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Badge da fonte */}
              <div className="absolute top-1 right-1">
                <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/60 text-white/80">
                  {img.fonte === "upload" ? "UP" : img.fonte === "gdrive" ? "GD" : "URL"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não tem imagens */}
      {imagens.length === 0 && pendingPreviews.length === 0 && !semSku && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-white/5 text-center">
          <ImagePlus className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Nenhuma imagem adicionada</p>
          <p className="text-xs text-gray-500 mt-1">Use as abas abaixo para adicionar imagens</p>
        </div>
      )}

      {/* Abas de adição */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full bg-[var(--color-surface)] border border-white/5">
          <TabsTrigger value="upload" className="flex items-center gap-1.5 text-xs">
            <Upload className="w-3.5 h-3.5" /> Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-1.5 text-xs">
            <Link2 className="w-3.5 h-3.5" /> URL (S3)
          </TabsTrigger>
          <TabsTrigger value="gdrive" className="flex items-center gap-1.5 text-xs">
            <HardDrive className="w-3.5 h-3.5" /> Google Drive
          </TabsTrigger>
        </TabsList>

        {/* Upload */}
        <TabsContent value="upload">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !semSku && !uploading && fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all
              ${semSku
                ? "opacity-50 cursor-not-allowed border-white/5 bg-[var(--color-surface)]/30"
                : dragOver
                  ? "cursor-pointer border-[#c9a655] bg-[#c9a655]/10 scale-[1.02]"
                  : "cursor-pointer border-white/10 hover:border-[#c9a655]/50 hover:bg-[var(--color-surface)]/50"
              }
              ${uploading ? "opacity-70 pointer-events-none" : ""}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 text-[#c9a655] animate-spin" />
            ) : (
              <ImagePlus className={`w-8 h-8 ${dragOver ? "text-[#c9a655]" : "text-gray-500"}`} />
            )}
            <div className="text-center">
              <p className="text-sm font-bold text-white">
                {compressing
                  ? "Comprimindo imagem..."
                  : uploading
                    ? "Enviando..."
                    : dragOver
                      ? "Solte para enviar"
                      : "Arraste ou clique para enviar"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                JPG, PNG, WebP ou GIF — imagens maiores que 5MB são comprimidas automaticamente
              </p>
            </div>
          </div>
        </TabsContent>

        {/* URL (S3) */}
        <TabsContent value="url">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://s3.amazonaws.com/sua-bucket/imagem.jpg"
              disabled={uploading || semSku}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a655]/50 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleAdicionarUrl()}
            />
            <button
              onClick={handleAdicionarUrl}
              disabled={uploading || semSku || !urlInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#c9a655] text-[#0f172a] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {uploading ? "..." : "Adicionar"}
            </button>
          </div>
        </TabsContent>

        {/* Google Drive */}
        <TabsContent value="gdrive">
          <div className="space-y-2">
            <input
              type="url"
              value={gdriveInput}
              onChange={(e) => setGdriveInput(e.target.value)}
              placeholder="https://drive.google.com/file/d/SEU_ID/view?usp=sharing"
              disabled={uploading || semSku}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a655]/50 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleAdicionarGDrive()}
            />
            <button
              onClick={handleAdicionarGDrive}
              disabled={uploading || semSku || !gdriveInput.trim()}
              className="w-full px-4 py-2.5 rounded-xl bg-[#c9a655] text-[#0f172a] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {uploading ? "Enviando..." : "Adicionar do Google Drive"}
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
