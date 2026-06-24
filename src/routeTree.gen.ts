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
import { adminEmpresaConfigBancoRoute } from "./routes/empresa.banco";
import { adminEmpresaConfigBrandingRoute } from "./routes/empresa.branding";
import { adminEmpresaConfigAcoesRoute } from "./routes/empresa.acoes";

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

export const routeTree = rootRoute.addChildren([
  loginRoute,
  preCadastroRoute,
  npsSurveyRoute,
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
    adminEmpresaConfigBancoRoute,
    adminEmpresaConfigBrandingRoute,
    adminEmpresaConfigAcoesRoute,

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
  ]),
]);
