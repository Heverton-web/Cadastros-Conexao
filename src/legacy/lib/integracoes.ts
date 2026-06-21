import { supabase } from "./supabase";

export type IntegracaoConfig = {
  id: string;
  chave: string;
  nome: string;
  ativo: boolean;
  config: any;
  created_at?: string;
  updated_at?: string;
};

export type EnderecoCEP = {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export async function listarIntegracoes(): Promise<IntegracaoConfig[]> {
  const { data, error } = await supabase
    .from("integracoes_config")
    .select("*")
    .order("chave");
  if (error) throw error;
  return data as IntegracaoConfig[];
}

export async function salvarIntegracao(chave: string, ativo: boolean, config: any): Promise<void> {
  const { error } = await supabase
    .from("integracoes_config")
    .update({ 
      ativo, 
      config, 
      updated_at: new Date().toISOString() 
    })
    .eq("chave", chave);
  if (error) throw error;
}

// Busca CEP resiliente com fallback automático de BrasilAPI para ViaCEP
export async function buscarCepResiliente(cep: string): Promise<EnderecoCEP | null> {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return null;

  // Provedor 1: BrasilAPI
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`, { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.cep) {
        return {
          cep: data.cep,
          logradouro: data.street || "",
          bairro: data.neighborhood || "",
          localidade: data.city || "",
          uf: data.state || "",
        };
      }
    }
  } catch (e) {
    console.warn("BrasilAPI falhou, tentando ViaCEP como fallback...", e);
  }

  // Provedor 2: ViaCEP (Fallback)
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (res.ok) {
      const data = await res.json();
      if (data && !data.erro) {
        return {
          cep: data.cep.replace("-", ""),
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          localidade: data.localidade || "",
          uf: data.uf || "",
        };
      }
    }
  } catch (e) {
    console.error("Todos os serviços de CEP falharam.", e);
  }

  return null;
}

// Teste de conexão para a Evolution API
export async function testarConexaoEvolution(base_url: string, api_key: string, instancia: string): Promise<{ conectado: boolean; mensagem: string }> {
  if (!base_url || !api_key || !instancia) {
    return { conectado: false, mensagem: "Preencha URL base, Apikey e Instância para testar." };
  }

  try {
    const urlFormatada = base_url.replace(/\/$/, "");
    const res = await fetch(`${urlFormatada}/instance/connectionState/${instancia}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": api_key
      }
    });

    if (res.ok) {
      const data = await res.json();
      // O retorno padrão da Evolution API costuma conter o status da instância
      if (data && (data.instance?.state === "open" || data.instance?.status === "CONNECTED" || data.state === "open")) {
        return { conectado: true, mensagem: "WhatsApp Conectado com sucesso!" };
      } else {
        const state = data.instance?.state || data.state || "desconhecido";
        return { conectado: false, mensagem: `Instância existe, mas o status é: "${state}". Conecte o QR Code no Evolution.` };
      }
    } else {
      return { conectado: false, mensagem: `Erro na API Evolution (Status: ${res.status}). Verifique o token e as credenciais.` };
    }
  } catch (e: any) {
    return { conectado: false, mensagem: `Falha de rede ao conectar à Evolution API: ${e.message}` };
  }
}
