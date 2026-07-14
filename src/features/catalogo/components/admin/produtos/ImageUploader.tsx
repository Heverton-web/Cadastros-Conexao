import { useState, useRef, useCallback } from "react"
import { Upload, Link2, HardDrive, X, GripVertical, ImagePlus } from "lucide-react"
import toast from "react-hot-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  uploadEAdicionarImagem,
  adicionarImagemUrl,
  listarImagens,
  removerImagem,
  reordenarImagens,
  validarArquivoImagem,
  extrairUrlGoogleDrive,
} from "~/features/catalogo/services/imagens.service"
import type { CatalogoImagemProduto, ProdutoTipoImagem } from "~/features/catalogo/types"

interface ImageUploaderProps {
  empresaId: string
  produtoTipo: ProdutoTipoImagem
  produtoSku: string
  imagensExistentes?: CatalogoImagemProduto[]
  onImagensChange: (imagens: CatalogoImagemProduto[]) => void
}

export function ImageUploader({
  empresaId,
  produtoTipo,
  produtoSku,
  imagensExistentes = [],
  onImagensChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [gdriveInput, setGdriveInput] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imagens = imagensExistentes

  async function recarregarImagens() {
    const lista = await listarImagens(empresaId, produtoTipo, produtoSku)
    onImagensChange(lista)
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const validacao = validarArquivoImagem(file)
        if (!validacao.valido) {
          toast.error(validacao.erro!, {
            style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
          })
          continue
        }
        await uploadEAdicionarImagem(empresaId, produtoTipo, produtoSku, file)
      }
      await recarregarImagens()
      toast.success("Imagem(ns) adicionada(s)!", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(34,197,94,0.3)" },
      })
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer upload", {
        style: { background: "var(--color-surface)", color: "#fff", border: "1px solid rgba(239,68,68,0.3)" },
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [empresaId, produtoTipo, produtoSku])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
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

  return (
    <div className="space-y-3">
      <label className={labelCls}>Imagens do Produto</label>

      {/* Galeria de imagens */}
      {imagens.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {imagens
            .sort((a, b) => a.ordem_exibicao - b.ordem_exibicao)
            .map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[var(--color-surface)]"
            >
              <img
                src={img.url_imagem}
                alt={`Imagem ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ""
                }}
              />

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
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
              ${dragOver
                ? "border-[#c9a655] bg-[#c9a655]/5"
                : "border-white/10 hover:border-white/20 bg-[var(--color-surface)]/50"
              }
              ${uploading ? "opacity-50 pointer-events-none" : ""}
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
            <ImagePlus className={`w-8 h-8 ${dragOver ? "text-[#c9a655]" : "text-gray-500"}`} />
            <div className="text-center">
              <p className="text-sm font-bold text-white">
                {uploading ? "Enviando..." : "Arraste ou clique para enviar"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                JPG, PNG, WebP ou GIF — máximo 5MB
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
              disabled={uploading}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a655]/50 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleAdicionarUrl()}
            />
            <button
              onClick={handleAdicionarUrl}
              disabled={uploading || !urlInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#c9a655] text-[#0f172a] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
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
              disabled={uploading}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a655]/50 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleAdicionarGDrive()}
            />
            <button
              onClick={handleAdicionarGDrive}
              disabled={uploading || !gdriveInput.trim()}
              className="w-full px-4 py-2.5 rounded-xl bg-[#c9a655] text-[#0f172a] text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {uploading ? "Enviando..." : "Adicionar do Google Drive"}
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
