import { useState } from "react"
import { User, ChevronDown, X } from "lucide-react"
import { useAuth } from "~/lib/auth"
import { supabase } from "~/lib/supabase"
import { ClientePickerModal } from "~/features/crm/components/ClientePickerModal"
import { useClienteAtivo } from "../context/cliente-ativo"

/**
 * Barra visível só pro consultor (colaborador com permissão catalogo_colab_*):
 * escolhe qual cliente da carteira ele está atendendo. Enquanto selecionado,
 * o preço do catálogo aplica o desconto do grupo desse cliente automaticamente.
 */
export function ClienteAtivoBar() {
  const { profile } = useAuth()
  const { isConsultor, clienteAtivo, setClienteAtivo } = useClienteAtivo()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!isConsultor || !profile) return null

  async function handleSelect(clienteId: string) {
    setPickerOpen(false)
    const { data } = await supabase
      .from("clientes")
      .select("id, nome_doutor, nome_clinica")
      .eq("id", clienteId)
      .single()
    if (data) {
      setClienteAtivo({ id: data.id, nomeDoutor: data.nome_doutor, nomeClinica: data.nome_clinica })
    }
  }

  return (
    <>
      <div className="w-full bg-[#c9a655]/10 border-b border-[#c9a655]/20 px-4 py-2 flex items-center justify-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a655]">Atendendo:</span>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#c9a655] transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          {clienteAtivo ? clienteAtivo.nomeDoutor : "Selecionar cliente da carteira"}
          <ChevronDown className="w-3 h-3" />
        </button>
        {clienteAtivo && (
          <button
            onClick={() => setClienteAtivo(null)}
            title="Limpar seleção"
            className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <ClientePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        consultorId={profile.id}
        onSelect={handleSelect}
      />
    </>
  )
}
