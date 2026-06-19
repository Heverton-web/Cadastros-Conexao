import { supabase } from "./supabase";

export type Credencial = {
  id: string;
  created_by: string | null;
  nome_completo: string;
  email_corporativo: string;
  whatsapp_corporativo: string | null;
  departamento: string | null;
  ativo: boolean;
  created_at: string;
};

export type CredencialInput = {
  nome_completo: string;
  email_corporativo: string;
  whatsapp_corporativo?: string;
  departamento?: string;
};

export async function listarCredenciais() {
  const { data, error } = await supabase
    .from("credenciais")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Credencial[];
}

export async function criarCredencial(input: CredencialInput) {
  const { data, error } = await supabase
    .from("credenciais")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Credencial;
}

export async function toggleCredencial(id: string, ativo: boolean) {
  const { data, error } = await supabase
    .from("credenciais")
    .update({ ativo })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Credencial;
}
