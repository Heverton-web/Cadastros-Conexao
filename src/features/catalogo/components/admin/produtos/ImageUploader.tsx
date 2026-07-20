import { useState, useEffect, useRef } from "react"
import { supabase } from "~/core/supabase"
import { Trash2, Image as ImageIcon } from "lucide-react"
import toast from "react-hot-toast"
import { compressImage } from "~/features/catalogo/lib/compressImage"
import { extrairUrlGoogleDrive } from "~/features/catalogo/services/imagens.service"
import type { ProdutoTipoImagem, FonteImagem, CatalogoImagemProduto } from "~/features/catalogo/types"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

interface Props {
  produtoTipo: ProdutoTipoImagem
  produtoSku: string
  imagensExistentes?: CatalogoImagemProduto[]
  onImagensChange?: (imgs: CatalogoImagemProduto[]) => void
}

const labelCls = "text-xs font-bold uppercase tracking-widest text-gray-400"
const inputCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"
const selectCls = "w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white"

export function ImageUploader({ produtoTipo, produtoSku, imagensExistentes, onImagensChange }: Props) {
  const [imagemId, setImagemId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [fonte, setFonte] = useState<FonteImagem>("upload")
  const [tipoAnexo, setTipoAnexo] = useState("arquivo")
  const [urlInput, setUrlInput] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!produtoSku) return
    const load = async () => {
      const { data } = await supabase
        .from("catalogo_imagens_produto")
        .select("id, url_imagem, fonte")
        .eq("produto_tipo", produtoTipo)
        .eq("produto_sku", produtoSku)
        .limit(1)
        .single()
      if (data) {
        setImagemId(data.id)
        setImageUrl(data.url_imagem)
        setFonte(data.fonte as FonteImagem)
      }
    }
    load()
  }, [produtoSku, produtoTipo])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    try {
      // Comprime imagens > 5MB sem perda de qualidade
      const arquivoFinal = await compressImage(file)

      const ext = arquivoFinal.name.split(".").pop() || "png"
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
      const filePath = `public/${produtoTipo}/${produtoSku}/${safeName}`
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/catalogo-imagens/${filePath}`

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}`, "Content-Type": arquivoFinal.type || "image/png" },
        body: arquivoFinal,
      })
      if (!res.ok) { const err = await res.json(); toast.error("Erro upload: " + (err.message || res.statusText)); setUploading(false); return }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/catalogo-imagens/${filePath}`

      if (imagemId) {
        await supabase.from("catalogo_imagens_produto").update({ url_imagem: publicUrl, fonte: "upload" }).eq("id", imagemId)
      } else {
        const { data, error } = await supabase.from("catalogo_imagens_produto").insert({
          produto_tipo: produtoTipo, produto_sku: produtoSku,
          url_imagem: publicUrl, fonte: "upload", ordem_exibicao: 0,
        }).select("id").single()
        if (error) { toast.error(error.message); setUploading(false); return }
        if (data) setImagemId(data.id)
      }

      setImageUrl(publicUrl)
      setFonte("upload")
      toast.success("Imagem salva!")
    } catch (err: any) {
      toast.error(err?.message || "Erro ao processar imagem")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function addUrl() {
    if (!urlInput.trim()) return
    const f: FonteImagem = tipoAnexo === "url_s3" ? "url" : "gdrive"

    // Converte URL do Google Drive para URL direta de download
    let urlFinal = urlInput.trim()
    if (f === "gdrive") {
      try {
        urlFinal = extrairUrlGoogleDrive(urlInput.trim())
      } catch (err: any) {
        toast.error(err.message)
        return
      }
    }

    if (imagemId) {
      const { error } = await supabase.from("catalogo_imagens_produto").update({ url_imagem: urlFinal, fonte: f }).eq("id", imagemId)
      if (error) { toast.error(error.message); return }
    } else {
      const { data, error } = await supabase.from("catalogo_imagens_produto").insert({
        produto_tipo: produtoTipo, produto_sku: produtoSku,
        url_imagem: urlFinal, fonte: f, ordem_exibicao: 0,
      }).select("id").single()
      if (error) { toast.error(error.message); return }
      if (data) setImagemId(data.id)
    }

    setImageUrl(urlFinal)
    setFonte(f)
    setUrlInput("")
    toast.success("Imagem salva!")
  }

  async function removeImagem() {
    if (imagemId) await supabase.from("catalogo_imagens_produto").delete().eq("id", imagemId)
    setImagemId(null)
    setImageUrl("")
    toast.success("Imagem removida!")
  }

  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-white/5 p-4 space-y-4">
      {imageUrl ? (
        <div className="relative group w-32 h-32 rounded-lg overflow-hidden border border-white/10">
          <img src={imageUrl} alt="Imagem do produto" className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={removeImagem} className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-600">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-center text-white py-0.5">
            {fonte === "upload" ? "Upload" : fonte === "url" ? "S3" : "GDrive"}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <ImageIcon className="h-4 w-4" />
          <span>Nenhuma imagem</span>
        </div>
      )}

      <div className="space-y-2">
        <label className={labelCls}>Tipo de Anexo</label>
        <select value={tipoAnexo} onChange={e => { setTipoAnexo(e.target.value); setUrlInput("") }} className={selectCls}>
          <option value="arquivo">Escolher arquivo</option>
          <option value="url_s3">URL S3</option>
          <option value="url_gdrive">URL Google Drive</option>
        </select>
      </div>

      {tipoAnexo === "arquivo" && (
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}
            className="w-full bg-[var(--color-surface)] border border-white/10 rounded-lg p-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#c9a655]/20 file:text-[#c9a655] hover:file:bg-[#c9a655]/30 disabled:opacity-50" />
          {uploading && <p className="text-xs text-[#c9a655] mt-1">Compressando e enviando...</p>}
        </div>
      )}

      {(tipoAnexo === "url_s3" || tipoAnexo === "url_gdrive") && (
        <div className="space-y-2">
          <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)} className={inputCls}
            placeholder={tipoAnexo === "url_s3" ? "https://s3.amazonaws.com/..." : "https://drive.google.com/file/d/.../view"} />
          <button onClick={addUrl} className="w-full px-4 py-2 rounded-lg bg-[#c9a655]/20 text-[#c9a655] font-bold text-sm hover:bg-[#c9a655]/30 transition-colors">
            Salvar Imagem
          </button>
        </div>
      )}
    </div>
  )
}
