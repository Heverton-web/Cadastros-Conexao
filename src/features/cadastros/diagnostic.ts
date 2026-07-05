import type { DiagnosticPlan } from "~/core/diagnostic";
import { supabase } from "~/core/supabase";

export const cadastrosDiagnosticPlan: DiagnosticPlan = {
  key: "cadastros",
  nome: "Cadastros",
  dadosTeste: () => ({ nome: "[DIAG] Cliente Teste", tipo: "PF", telefone: "11999999999" }),

  crud: {
    create: async (ctx) => {
      ctx.log("info", "criando cliente via supabase...");
      const dados = ctx.dadosTeste() as any;
      const { data, error } = await supabase.from("clientes").insert({ empresa_id: ctx.empresaId, nome_doutor: dados.nome, tipo_pessoa: dados.tipo, telefone: dados.telefone, status: "link_gerado" }).select().single();
      if (error) throw error;
      ctx.log("success", `cliente criado: id=${data.id}, nome="${data.nome_doutor}", status=${data.status}`);
      ctx.salvarId("clienteId", data.id);
    },
    read: async (ctx) => {
      const id = ctx.recuperarId("clienteId");
      if (!id) throw new Error("Execute 'Criar' primeiro");
      ctx.log("info", `buscando cliente id=${id}...`);
      const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
      if (error) throw error;
      ctx.log("success", `cliente: "${data.nome_doutor}", tipo=${data.tipo_pessoa}, status=${data.status}`);
    },
    update: async (ctx) => {
      const id = ctx.recuperarId("clienteId");
      if (!id) throw new Error("Execute 'Criar' primeiro");
      ctx.log("info", `atualizando cliente id=${id}...`);
      const { data, error } = await supabase.from("clientes").update({ nome_doutor: "[DIAG] Cliente Atualizado" }).eq("id", id).select().single();
      if (error) throw error;
      ctx.log("success", `cliente atualizado: "${data.nome_doutor}"`);
    },
    delete: async (ctx) => {
      const id = ctx.recuperarId("clienteId");
      if (!id) throw new Error("Execute 'Criar' primeiro");
      ctx.log("info", `excluindo cliente id=${id}...`);
      const { error } = await supabase.from("clientes").delete().eq("id", id);
      if (error) throw error;
      ctx.log("success", `cliente ${id} excluído`);
    },
  },

  acoes: [
    {
      key: "pipeline_completo",
      label: "Pipeline Completo",
      descricao: "Simula pipeline: link_gerado → dados_enviados → em_analise → aprovado",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando cliente com status=link_gerado...");
        const { data: c, error: e1 } = await supabase.from("clientes").insert({ empresa_id: ctx.empresaId, nome_doutor: "[DIAG] Pipeline Teste", tipo_pessoa: "PF", telefone: "11988887777", status: "link_gerado" }).select().single();
        if (e1) throw e1;
        ctx.log("success", `cliente: id=${c.id}, status=${c.status}`);
        ctx.salvarId("clienteId", c.id);

        ctx.log("info", "2) Avançando para dados_enviados...");
        await supabase.from("clientes").update({ status: "dados_enviados" }).eq("id", c.id);
        const { data: c2 } = await supabase.from("clientes").select("status").eq("id", c.id).single();
        ctx.log("success", `status agora: ${c2?.status}`);

        ctx.log("info", "3) Avançando para em_analise...");
        await supabase.from("clientes").update({ status: "em_analise" }).eq("id", c.id);
        const { data: c3 } = await supabase.from("clientes").select("status").eq("id", c.id).single();
        ctx.log("success", `status agora: ${c3?.status}`);

        ctx.log("info", "4) Aprovando cadastro...");
        await supabase.from("clientes").update({ status: "aprovado" }).eq("id", c.id);
        const { data: c4 } = await supabase.from("clientes").select("status").eq("id", c.id).single();
        ctx.log("success", `status final: ${c4?.status}`);
      },
      cleanup: async (ctx) => {
        const id = ctx.recuperarId("clienteId");
        if (id) { await supabase.from("clientes").delete().eq("id", id); }
      },
    },
    {
      key: "reprovacao_correcao",
      label: "Reprovação e Correção",
      descricao: "Simula pipeline com correção e reprovação",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando cliente em análise...");
        const { data: c, error: e1 } = await supabase.from("clientes").insert({ empresa_id: ctx.empresaId, nome_doutor: "[DIAG] Reprovação Teste", tipo_pessoa: "PJ", telefone: "11977776666", status: "em_analise" }).select().single();
        if (e1) throw e1;
        ctx.log("success", `cliente: id=${c.id}, status=${c.status}`);
        ctx.salvarId("clienteId", c.id);

        ctx.log("info", "2) Solicitando correção (em_correcao)...");
        await supabase.from("clientes").update({ status: "em_correcao" }).eq("id", c.id);
        ctx.log("success", "status alterado para em_correcao");

        ctx.log("info", "3) Reprovando cadastro...");
        await supabase.from("clientes").update({ status: "reprovado" }).eq("id", c.id);
        const { data: c3 } = await supabase.from("clientes").select("status").eq("id", c.id).single();
        ctx.log("success", `status final: ${c3?.status}`);
      },
      cleanup: async (ctx) => {
        const id = ctx.recuperarId("clienteId");
        if (id) { await supabase.from("clientes").delete().eq("id", id); }
      },
    },
    {
      key: "ciclo_cadastro",
      label: "Ciclo Básico Cadastro",
      descricao: "Cria cliente → lê → atualiza → lista → exclui",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando cliente...");
        const dados = ctx.dadosTeste() as any;
        const { data: c, error: e1 } = await supabase.from("clientes").insert({ empresa_id: ctx.empresaId, nome_doutor: dados.nome, tipo_pessoa: dados.tipo, telefone: dados.telefone, status: "link_gerado" }).select().single();
        if (e1) throw e1;
        ctx.log("success", `cliente: id=${c.id}`);
        ctx.salvarId("clienteId", c.id);

        ctx.log("info", "2) Buscando cliente...");
        const { data: c2 } = await supabase.from("clientes").select("*").eq("id", c.id).single();
        ctx.log("success", `encontrado: "${c2?.nome_doutor}", status=${c2?.status}`);

        ctx.log("info", "3) Listando clientes da empresa...");
        const { data: lista } = await supabase.from("clientes").select("id, status").eq("empresa_id", ctx.empresaId).limit(5);
        ctx.log("success", `clientes na empresa: ${lista?.length ?? 0}`);
        for (const cl of lista ?? []) ctx.log("info", `  ${cl.id?.slice(0, 8)}… status=${cl.status}`);

        ctx.log("info", "4) Excluindo cliente...");
        await supabase.from("clientes").delete().eq("id", c.id);
        ctx.log("success", "cliente excluído no próprio ciclo");
      },
      cleanup: async () => {},
    },
  ],
};
