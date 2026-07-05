import { rootRoute } from "./routes/__root";
import { authLayout } from "./routes/_auth";
import { loginRoute } from "./routes/index";
import { preCadastroRoute } from "./routes/pre-cadastro.$token";
import { dashboardRoute } from "./routes/cadastros.dashboard";
import { clientesRoute } from "./routes/cadastros.solicitacoes";
import { clienteDetailRoute } from "./routes/cadastros.solicitacoes.$id";
import { consultorRoute } from "./routes/cadastros.consultor";
import { consultorClientesRoute } from "./routes/cadastros.consultor.clientes";
import { cadastrosClientesRoute } from "./routes/cadastros.clientes";
import { relatoriosRoute } from "./routes/cadastros.relatorios";
import { credenciaisRoute } from "./routes/credenciais";
import { adminConfigRoute } from "./routes/global.acoes";
import { adminSuperEmpresasRoute } from "./routes/global.empresas";
import { adminSuperEmpresaDetailRoute } from "./routes/global.empresas.$id";
import { adminSuperPermissoesRoute } from "./routes/global.permissoes";
import { adminPermissoesRoute } from "./routes/empresa.permissoes";
import { adminSuperModulosRoute } from "./routes/global.modulos";
import { adminSuperModuloDetailRoute } from "./routes/global.modulos.$key";
import { adminTemaRoute } from "./routes/empresa.tema";
import { adminEmpresaRoute } from "./routes/empresa";
import { adminSuperBancoRoute } from "./routes/global.banco";
import { adminSuperIntegracoesRoute } from "./routes/global.integracoes";
import { adminSuperDemosRoute } from "./routes/global.demos";
import { adminLaboratorioRoute } from "./routes/global.laboratorio";
import { globalModelosIaRoute } from "./routes/global.modelos-ia";
import { adminSuperTestesRoute } from "./routes/global.testes";
import { adminSuperDiagnosticoRoute } from "./routes/global.diagnostico";
import { globalLimitsRoute } from "./routes/global.limits";
import { adminEmpresaConfigBancoRoute } from "./routes/empresa.banco";
import { adminEmpresaConfigBrandingRoute } from "./routes/empresa.branding";
import { adminEmpresaConfigAcoesRoute } from "./routes/empresa.acoes";
import { globalDesignRoute } from "./routes/global.design";
import { empresaDesignRoute } from "./routes/empresa.design";
import { npsDesignRoute } from "./routes/nps.design";

import { mapasRoute } from "./routes/mapas";
import { mapasDistribuidoresRoute } from "./routes/mapas.distribuidores";
import { mapasConsultoresRoute } from "./routes/mapas.consultores";
import { mapasAdminRoute } from "./routes/mapas.gestao";
import { mapasAdminInsightsRoute } from "./routes/mapas.insights";
import { mapasAdminDistribuidoresRoute } from "./routes/mapas.gestao.distribuidores";
import { mapasAdminConsultoresRoute } from "./routes/mapas.gestao.consultores";

import { npsRoute } from "./routes/nps";
import { npsDashboardRoute } from "./routes/nps.dashboard";
import { globalNpsDashboardRoute } from "./routes/global.nps";
import { npsPesquisasRoute } from "./routes/nps.pesquisas";
import { npsRelatoriosRoute } from "./routes/nps.relatorios";
import { npsPreviewRoute } from "./routes/nps.preview";
import { npsTemaRoute } from "./routes/nps.tema";
import { npsSurveyRoute } from "./routes/nps.survey";

import { funisRoute } from "./routes/funis";
import { funisDashboardRoute } from "./routes/funis.dashboard";
import { funilDetalleRoute } from "./routes/funis.funil.$funilId";
import { funisTemplatesRoute } from "./routes/funis.templates";
import { funilAutomationsRoute } from "./routes/funis.funil.$funilId.automations";

import { linktreePublicRoute } from "./routes/linktree.$id";
import { linktreeDashboardRoute } from "./routes/linktree.dashboard";
import { linktreeTemaRoute } from "./routes/linktree.tema";
import { linktreeDesignRoute } from "./routes/linktree.design";
import { empresaLinktreeDashboardRoute } from "./routes/linktree.empresa";
import { empresaLinktreeEditorRoute } from "./routes/linktree.empresa.editor";
import { empresaLinktreePublicRoute } from "./routes/e.$slug";

import { globalHubRoute } from "./routes/global.hub";

import { crmDashboardRoute } from "./routes/_auth.crm.dashboard";
import { crmCarteiraRoute } from "./routes/_auth.crm.carteira";
import { crmClienteDetailRoute } from "./routes/_auth.crm.cliente.$id";
import { crmEquipeRoute } from "./routes/_auth.crm.equipe";
import { crmBiRoute } from "./routes/_auth.crm.bi";
import { crmTransferenciaRoute } from "./routes/_auth.crm.transferencia";
import { crmTransferenciaIndexRoute } from "./routes/_auth.crm.transferencia.index";
import { crmTransferenciaConsultoresRoute } from "./routes/_auth.crm.transferencia.consultores";
import { crmDiretoriaIndexRoute } from "./routes/_auth.crm.diretoria.index";
import { crmDiretoriaGestorRoute } from "./routes/_auth.crm.diretoria.gestor.$id";
import { crmAceitarConviteRoute } from "./routes/crm.aceitar-convite.$token";
import { rotasDesignRoute } from "./routes/rotas.design";
import { empresaNpsDesignRoute } from "./routes/empresa.nps-design";
import { empresaLinktreeDesignRoute } from "./routes/empresa.linktree-design";
import { empresaHubDesignRoute } from "./routes/empresa.hub-design";
import { empresaMapasDesignRoute } from "./routes/empresa.mapas-design";
import { empresaFunisDesignRoute } from "./routes/empresa.funis-design";
import { empresaCrmDesignRoute } from "./routes/empresa.crm-design";
import { empresaCadastrosDesignRoute } from "./routes/empresa.cadastros-design";
import { empresaCadastrosFormularioRoute } from "./routes/empresa.cadastros.formulario";
import { empresaDespesasDesignRoute } from "./routes/empresa.despesas-design";
import { empresaRotasDesignRoute } from "./routes/empresa.rotas-design";
import { empresaNpsTemaRoute } from "./routes/empresa.nps-tema";
import { empresaLinktreeTemaRoute } from "./routes/empresa.linktree-tema";
import { empresaHubChatbotRoute } from "./routes/empresa.hub-chatbot";
import { crmPipelineRoute } from "./routes/_auth.crm.pipeline";
import { crmTarefasRoute } from "./routes/_auth.crm.tarefas";
import { crmMetricasRoute } from "./routes/_auth.crm.metricas";
import { empresaHubTemaRoute } from "./routes/empresa.hub.tema";
import { hubClienteDashboardRoute } from "./routes/hub.cliente.dashboard.$empresaId";
import { hubAdminDashboardRoute } from "./routes/hub.admin.dashboard";
import { hubAdminMateriaisRoute } from "./routes/hub.admin.materiais";
import { hubAdminTrilhasRoute } from "./routes/hub.admin.trilhas";
import { hubAdminAnalyticsRoute } from "./routes/hub.admin.analytics";
import { hubAdminBadgesRoute } from "./routes/hub.admin.badges";
import { hubAdminChatbotRoute } from "./routes/hub.admin.chatbot";
import { hubGestorDashboardRoute } from "./routes/hub.gestor.dashboard";
import { hubGestorAnalyticsRoute } from "./routes/hub.gestor.analytics";
import { hubGestorRankingRoute } from "./routes/hub.gestor.ranking";
import { hubGestorConquistasRoute } from "./routes/hub.gestor.conquistas";
import { hubConsultorDashboardRoute } from "./routes/hub.consultor.dashboard";
import { hubConsultorRankingRoute } from "./routes/hub.consultor.ranking";
import { hubConsultorConquistasRoute } from "./routes/hub.consultor.conquistas";
import { hubDistribuidorDashboardRoute } from "./routes/hub.distribuidor.dashboard";
import { hubDistribuidorConquistasRoute } from "./routes/hub.distribuidor.conquistas";
import { hubDesignRoute } from "./routes/hub.design";
import { crmDesignRoute } from "./routes/crm.design";
import { mapasDesignRoute } from "./routes/mapas.design";
import { funisDesignRoute } from "./routes/funis.design";
import { cadastrosDesignRoute } from "./routes/cadastros.design";
import { previsualizacaoRoute } from "./routes/cadastros.previsualizacao";

import { despesasRoute } from "./routes/despesas";
import { despesasAprovacaoRoute } from "./routes/despesas.aprovacao";
import { despesasMeusRelatoriosRoute } from "./routes/despesas.meus-relatorios";
import { despesasRelatoriosRoute } from "./routes/despesas.relatorios";
import { despesasDesignRoute } from "./routes/despesas.design";
import { empresaDespesasConfigRoute } from "./routes/empresa.despesas-config";

import { rotasRoute } from "./routes/rotas";
import { rotaDetailRoute } from "./routes/rotas.$id";
import { rotasConfigRoute } from "./routes/rotas.config";
import { empresaRotasConfigRoute } from "./routes/empresa.rotas-config";

import { marketingDashboardRoute } from "./routes/marketing.dashboard";
import { marketingLandingPagesRoute } from "./routes/marketing.landing-pages";
import { marketingMetaBmRoute } from "./routes/marketing.meta-bm";
import { marketingMetaBmCampanhasRoute } from "./routes/marketing.meta-bm.campanhas";
import { marketingMetaBmPostsRoute } from "./routes/marketing.meta-bm.posts";
import { marketingUtmsRoute } from "./routes/marketing.utms";
import { marketingCriativosRoute } from "./routes/marketing.criativos";
import { marketingEmailRoute } from "./routes/marketing.email";
import { marketingEmailCampanhaRoute } from "./routes/marketing.email.campanha";
import { marketingEmailAnalyticsRoute } from "./routes/marketing.email.analytics";
import { marketingSeoRoute } from "./routes/marketing.seo";
import { marketingCalendarioRoute } from "./routes/marketing.calendario";
import { marketingLeadsRoute } from "./routes/marketing.leads";
import { marketingLeadsDetailRoute } from "./routes/marketing.leads.$id";
import { marketingPixelsRoute } from "./routes/marketing.pixels";
import { marketingWhatsappRoute } from "./routes/marketing.whatsapp";
import { marketingLinktreeRoute } from "./routes/marketing.linktree";
import { marketingLinktreeDesignRoute } from "./routes/marketing.linktree.design";
import { marketingLinktreeEditorRoute } from "./routes/marketing.linktree.editor";
import { marketingLinktreeTemaRoute } from "./routes/marketing.linktree.tema";

import { ferramentasLinksRoute } from "./routes/ferramentas.links";
import { ferramentasLinksHistoricoRoute } from "./routes/ferramentas.links.historico";
import { ferramentasLinksTemplatesRoute } from "./routes/ferramentas.links.templates";
import { ferramentasLinksWhatsappRoute } from "./routes/ferramentas.links.whatsapp";
import { ferramentasLinksUtmRoute } from "./routes/ferramentas.links.utm";
import { ferramentasLinksGoogleReviewRoute } from "./routes/ferramentas.links.google-review";
import { ferramentasLinksMapsRoute } from "./routes/ferramentas.links.maps";
import { ferramentasLinksWazeRoute } from "./routes/ferramentas.links.waze";
import { ferramentasLinksQrcodeRoute } from "./routes/ferramentas.links.qrcode";
import { linkRedirectRoute } from "./routes/r.$linkId";

export const routeTree = rootRoute.addChildren([
  loginRoute,
  preCadastroRoute,
  npsSurveyRoute,
  linktreePublicRoute,
  empresaLinktreePublicRoute,
  hubClienteDashboardRoute,
  crmAceitarConviteRoute,
  linkRedirectRoute,
  authLayout.addChildren([
    dashboardRoute,
    clientesRoute,
    clienteDetailRoute,
    cadastrosClientesRoute,
    consultorRoute,
    consultorClientesRoute,
    relatoriosRoute,
    credenciaisRoute,
    adminConfigRoute,
    adminSuperEmpresasRoute,
    adminSuperEmpresaDetailRoute,
    adminSuperPermissoesRoute,
    adminPermissoesRoute,
    adminSuperModulosRoute,
    adminSuperModuloDetailRoute,
    adminTemaRoute,
    adminEmpresaRoute,
    adminSuperBancoRoute,
    adminSuperIntegracoesRoute,
    adminSuperDemosRoute,
    adminSuperTestesRoute,
    adminSuperDiagnosticoRoute,
    adminLaboratorioRoute,
    globalModelosIaRoute,
    globalLimitsRoute,
    adminEmpresaConfigBancoRoute,
    adminEmpresaConfigBrandingRoute,
    adminEmpresaConfigAcoesRoute,
    globalDesignRoute,
    empresaDesignRoute,
    npsDesignRoute,
    hubDesignRoute,
    crmDesignRoute,
    mapasDesignRoute,
    linktreeDesignRoute,
    funisDesignRoute,
    cadastrosDesignRoute,
    previsualizacaoRoute,
    despesasDesignRoute,

    rotasRoute,
    rotaDetailRoute,
    rotasConfigRoute,

    empresaRotasConfigRoute,

    despesasRoute,
    despesasAprovacaoRoute,
    despesasMeusRelatoriosRoute,
    despesasRelatoriosRoute,
    empresaDespesasConfigRoute,

    mapasRoute,
    mapasDistribuidoresRoute,
    mapasConsultoresRoute,
    mapasAdminRoute,
    mapasAdminInsightsRoute,
    mapasAdminDistribuidoresRoute,
    mapasAdminConsultoresRoute,

    npsRoute,
    npsDashboardRoute,
    globalNpsDashboardRoute,
    npsPesquisasRoute,
    npsRelatoriosRoute,
    npsPreviewRoute,
    npsTemaRoute,

    funisRoute,
    funisDashboardRoute,
    funilDetalleRoute,
    funisTemplatesRoute,
    funilAutomationsRoute,

    linktreeDashboardRoute,
    linktreeTemaRoute,
    empresaLinktreeDashboardRoute,
    empresaLinktreeEditorRoute,

    globalHubRoute,
    empresaHubTemaRoute,
    hubAdminDashboardRoute,
    hubAdminMateriaisRoute,
    hubAdminTrilhasRoute,
    hubAdminAnalyticsRoute,
    hubAdminBadgesRoute,
    hubAdminChatbotRoute,
    hubGestorDashboardRoute,
    hubGestorAnalyticsRoute,
    hubGestorRankingRoute,
    hubGestorConquistasRoute,
    hubConsultorDashboardRoute,
    hubConsultorRankingRoute,
    hubConsultorConquistasRoute,
    hubDistribuidorDashboardRoute,
    hubDistribuidorConquistasRoute,

    crmDashboardRoute,
    crmCarteiraRoute,
    crmPipelineRoute,
    crmTarefasRoute,
    crmMetricasRoute,
    crmClienteDetailRoute,
    crmEquipeRoute,
    crmBiRoute,
    crmTransferenciaRoute.addChildren([
      crmTransferenciaIndexRoute,
      crmTransferenciaConsultoresRoute,
    ]),
    crmDiretoriaIndexRoute,
    crmDiretoriaGestorRoute,

    rotasDesignRoute,
    empresaNpsDesignRoute,
    empresaLinktreeDesignRoute,
    empresaHubDesignRoute,
    empresaMapasDesignRoute,
    empresaFunisDesignRoute,
    empresaCrmDesignRoute,
    empresaCadastrosDesignRoute,
    empresaCadastrosFormularioRoute,
    empresaDespesasDesignRoute,
    empresaRotasDesignRoute,
    empresaNpsTemaRoute,
    empresaLinktreeTemaRoute,
    empresaHubChatbotRoute,

    marketingDashboardRoute,
    marketingLandingPagesRoute,
    marketingMetaBmRoute,
    marketingMetaBmCampanhasRoute,
    marketingMetaBmPostsRoute,
    marketingUtmsRoute,
    marketingCriativosRoute,
    marketingEmailRoute,
    marketingEmailCampanhaRoute,
    marketingEmailAnalyticsRoute,
    marketingSeoRoute,
    marketingCalendarioRoute,
    marketingLeadsRoute,
    marketingLeadsDetailRoute,
    marketingPixelsRoute,
    marketingWhatsappRoute,
    marketingLinktreeRoute,
    marketingLinktreeDesignRoute,
    marketingLinktreeEditorRoute,
    marketingLinktreeTemaRoute,

    ferramentasLinksRoute,
    ferramentasLinksHistoricoRoute,
    ferramentasLinksTemplatesRoute,
    ferramentasLinksWhatsappRoute,
    ferramentasLinksUtmRoute,
    ferramentasLinksGoogleReviewRoute,
    ferramentasLinksMapsRoute,
    ferramentasLinksWazeRoute,
    ferramentasLinksQrcodeRoute,
  ]),
]);
