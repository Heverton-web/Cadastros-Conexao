import type { DiagnosticPlan } from "~/core/diagnostic";
import * as materialsService from "./services/materials";
import * as collectionsService from "./services/collections";
import * as progressService from "./services/progress";
import * as gamificationService from "./services/gamification";
import * as invitesService from "./services/invites";
import * as chatbotService from "./services/chatbot";
import * as integrationsService from "./services/integrations";
import { supabase } from "~/core/supabase";

export const hubDiagnosticPlan: DiagnosticPlan = {
  key: "hub",
  nome: "Hub de Treinamento",
  dadosTeste: () => ({
    material: { empresa_id: "", titulo: "[DIAG] Material de Teste", descricao: "Conteúdo diagnóstico", tipo: "video" as const, url: "https://example.com/diag", active: true },
    colecao: { empresa_id: "", nome: "[DIAG] Coleção Teste", descricao: "Coleção criada pelo diagnóstico" },
    nivel: { nome: "Iniciante", pontos_min: 0, cor: "#22c55e" },
    badge: { nome: "[DIAG] Badge Teste", icone: "star", descricao: "Badge diagnóstico", pontos: 100 },
  }),

  crud: {
    create: async (ctx) => {
      ctx.log("info", "criando material...");
      const dados = ctx.dadosTeste() as any;
      const material = await materialsService.createHubMaterial({ ...dados.material, empresa_id: ctx.empresaId });
      ctx.log("success", `material: id=${material.id}, "${material.titulo}"`);
      ctx.salvarId("materialId", material.id);

      ctx.log("info", "criando coleção...");
      const colecao = await collectionsService.createHubCollection({ ...dados.colecao, empresa_id: ctx.empresaId });
      ctx.log("success", `coleção: id=${colecao.id}, "${colecao.nome}"`);
      ctx.salvarId("colecaoId", colecao.id);
    },
    read: async (ctx) => {
      const id = ctx.recuperarId("materialId");
      if (!id) throw new Error("Execute 'Criar' primeiro");
      ctx.log("info", `buscando material id=${id}...`);
      const material = await materialsService.fetchHubMaterialById(id);
      ctx.log("success", `material: "${material.titulo}", tipo=${material.tipo}`);
    },
    update: async (ctx) => {
      const id = ctx.recuperarId("materialId");
      if (!id) throw new Error("Execute 'Criar' primeiro");
      ctx.log("info", `atualizando material id=${id}...`);
      await materialsService.updateHubMaterial(id, { titulo: "[DIAG] Material Atualizado" });
      ctx.log("success", "material atualizado");
    },
    delete: async (ctx) => {
      for (const k of ["materialId", "colecaoId"]) {
        const id = ctx.recuperarId(k);
        if (!id) continue;
        ctx.log("info", `excluindo ${k}=${id}...`);
        if (k === "materialId") await materialsService.deleteHubMaterial(id).catch(() => {});
        if (k === "colecaoId") await collectionsService.deleteHubCollection(id).catch(() => {});
        ctx.log("success", `${k} excluído`);
      }
    },
  },

  acoes: [
    {
      key: "ciclo_material",
      label: "Ciclo Material/Progresso",
      descricao: "Cria material → conclui → verifica progresso → limpa",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando material...");
        const dados = ctx.dadosTeste() as any;
        const material = await materialsService.createHubMaterial({ ...dados.material, empresa_id: ctx.empresaId });
        ctx.log("success", `material: id=${material.id}`);
        ctx.salvarId("materialId", material.id);

        ctx.log("info", "2) Marcando como concluído...");
        await progressService.completeHubMaterial(ctx.usuarioId, material.id, ctx.empresaId);
        ctx.log("success", "material concluído");

        ctx.log("info", "3) Verificando progresso...");
        const progresso = await progressService.fetchHubUserProgress(ctx.usuarioId, ctx.empresaId);
        const meu = progresso.find(p => p.material_id === material.id);
        ctx.log("success", `progresso: status=${meu?.status}, completed_at=${meu?.completed_at ?? "N/A"}`);
      },
      cleanup: async (ctx) => {
        const id = ctx.recuperarId("materialId");
        if (id) { await materialsService.deleteHubMaterial(id).catch(() => {}); }
      },
    },
    {
      key: "gamificacao",
      label: "Gamificação (Níveis e Badges)",
      descricao: "Cria nível → lista → cria badge → lista badges da empresa → limpa",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando nível de gamificação...");
        const dados = ctx.dadosTeste() as any;
        const nivel = await gamificationService.upsertHubLevel(ctx.empresaId, dados.nivel);
        ctx.log("success", `nível: "${nivel.nome}", pontos_min=${nivel.pontos_min}`);
        ctx.salvarId("nivelNivel", nivel.nome);

        ctx.log("info", "2) Listando níveis...");
        const niveis = await gamificationService.fetchHubLevels(ctx.empresaId);
        ctx.log("success", `${niveis.length} nível(is) configurado(s)`);

        ctx.log("info", "3) Criando badge...");
        const badge = await gamificationService.createHubBadge(ctx.empresaId, dados.badge);
        ctx.log("success", `badge: id=${badge.id}, "${badge.nome}"`);
        ctx.salvarId("badgeId", badge.id);

        ctx.log("info", "4) Listando badges da empresa...");
        const badges = await gamificationService.fetchHubBadges(ctx.empresaId);
        ctx.log("success", `${badges.length} badge(s) disponíveis`);
      },
      cleanup: async (ctx) => {
        const bid = ctx.recuperarId("badgeId");
        if (bid) { await gamificationService.deleteHubBadge(bid).catch(() => {}); }
      },
    },
    {
      key: "convites",
      label: "Convites",
      descricao: "Cria convite → valida → limpa",
      steps: async (ctx) => {
        ctx.log("info", "1) Criando convite...");
        const invite = await invitesService.createHubInvite(ctx.empresaId, { type: "email", value: "diag@teste.com", max_uses: 1, expires_at: new Date(Date.now() + 86400000).toISOString() });
        ctx.log("success", `convite: id=${invite.id}, token=${invite.token?.slice(0, 12)}…`);
        ctx.salvarId("inviteId", invite.id);

        ctx.log("info", "2) Listando convites...");
        const invites = await invitesService.fetchHubInvites(ctx.empresaId);
        ctx.log("success", `${invites.length} convite(s) existentes`);
      },
      cleanup: async (ctx) => {
        const iid = ctx.recuperarId("inviteId");
        if (iid) { await invitesService.deleteHubInvite(iid).catch(() => {}); }
      },
    },
    {
      key: "chatbot_integracoes",
      label: "Chatbot e Integrações",
      descricao: "Verifica config chatbot e status integrações → limpa",
      steps: async (ctx) => {
        ctx.log("info", "1) Buscando config do chatbot...");
        const config = await chatbotService.fetchHubChatbotConfig(ctx.empresaId);
        ctx.log("success", config ? "chatbot configurado" : "chatbot sem configuração (padrão)");

        ctx.log("info", "2) Buscando integrações ativas...");
        const integracoes = await integrationsService.fetchHubIntegrations(ctx.empresaId);
        ctx.log("success", `${integracoes.length} integração(ões) configurada(s)`);

        ctx.log("info", "3) Verificando assets de material...");
        const { data: assets } = await supabase.from("hub_material_assets").select("id, material_id, locale").limit(5);
        ctx.log("success", `${assets?.length ?? 0} assets no hub`);
      },
      cleanup: async () => {},
    },
  ],
};
