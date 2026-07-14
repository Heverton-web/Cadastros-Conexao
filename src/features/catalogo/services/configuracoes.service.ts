import { supabase } from "~/lib/supabase"

export interface CatalogoConfiguracoes {
  empresa_id: string
  nome_loja: string
  cnpj: string
  email_contato: string
  telefone: string
  endereco: string
  manutencao: boolean
  msg_manutencao: string
  exibir_precos: boolean
  exibir_estoque: boolean
  checkout_habilitado: boolean
  cupons_habilitado: boolean
}

export const DEFAULT_CONFIGURACOES: CatalogoConfiguracoes = {
  empresa_id: "",
  nome_loja: "ERP Odonto",
  cnpj: "",
  email_contato: "",
  telefone: "",
  endereco: "",
  manutencao: false,
  msg_manutencao: "Estamos em manutenção. Volte em breve!",
  exibir_precos: true,
  exibir_estoque: false,
  checkout_habilitado: true,
  cupons_habilitado: true,
}

export async function getConfiguracoes(empresaId: string): Promise<CatalogoConfiguracoes> {
  const { data, error } = await supabase
    .from("catalogo_configuracoes")
    .select("*")
    .eq("empresa_id", empresaId)
    .single()

  if (error || !data) {
    // Se não existir, retorna defaults
    return { ...DEFAULT_CONFIGURACOES, empresa_id: empresaId }
  }

  return data as CatalogoConfiguracoes
}

export async function saveConfiguracoes(config: CatalogoConfiguracoes): Promise<void> {
  const { error } = await supabase
    .from("catalogo_configuracoes")
    .upsert({
      empresa_id: config.empresa_id,
      nome_loja: config.nome_loja,
      cnpj: config.cnpj,
      email_contato: config.email_contato,
      telefone: config.telefone,
      endereco: config.endereco,
      manutencao: config.manutencao,
      msg_manutencao: config.msg_manutencao,
      exibir_precos: config.exibir_precos,
      exibir_estoque: config.exibir_estoque,
      checkout_habilitado: config.checkout_habilitado,
      cupons_habilitado: config.cupons_habilitado,
      updated_at: new Date().toISOString(),
    }, { onConflict: "empresa_id" })

  if (error) throw error
}
