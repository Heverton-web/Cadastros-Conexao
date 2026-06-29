import { rootRoute } from "./routes/__root";
import { authLayout } from "./routes/_auth";
import { loginRoute } from "./routes/index";
import { preCadastroRoute } from "./routes/pre-cadastro.$token";
import { dashboardRoute } from "./routes/dashboard";
import { clientesRoute } from "./routes/clientes";
import { clienteDetailRoute } from "./routes/clientes.$id";
import { consultorRoute } from "./routes/consultor";
import { consultorClientesRoute } from "./routes/consultor.clientes";
import { relatoriosRoute } from "./routes/relatorios";
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
import { crmDevConvitesRoute } from "./routes/_auth.crm.dev.convites";
import { crmDevDemoRoute } from "./routes/_auth.crm.dev.demo";
import { crmDevUsuariosRoute } from "./routes/_auth.crm.dev.usuarios";
import { crmAceitarConviteRoute } from "./routes/crm.aceitar-convite.$token";
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

import { despesasRoute } from "./routes/despesas";
import { despesasNovoRoute } from "./routes/despesas.novo";
import { despesasEnvioRoute } from "./routes/despesas.envio";
import { despesasAprovacaoRoute } from "./routes/despesas.aprovacao";
import { despesasConfigRoute } from "./routes/despesas.config";
import { despesasRelatoriosRoute } from "./routes/despesas.relatorios";
import { despesasDesignRoute } from "./routes/despesas.design";

export const routeTree = rootRoute.addChildren([
  loginRoute,
  preCadastroRoute,
  npsSurveyRoute,
  linktreePublicRoute,
  empresaLinktreePublicRoute,
  hubClienteDashboardRoute,
  crmAceitarConviteRoute,
  authLayout.addChildren([
    dashboardRoute,
    clientesRoute,
    clienteDetailRoute,
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
    adminLaboratorioRoute,
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

    despesasRoute,
    despesasNovoRoute,
    despesasEnvioRoute,
    despesasAprovacaoRoute,
    despesasConfigRoute,
    despesasRelatoriosRoute,
    despesasDesignRoute,

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
    crmDevConvitesRoute,
    crmDevDemoRoute,
    crmDevUsuariosRoute,
  ]),
]);
