export type ViaCEPRetorno = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export async function buscarCEP(cep: string): Promise<ViaCEPRetorno | null> {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const data: ViaCEPRetorno = await res.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
