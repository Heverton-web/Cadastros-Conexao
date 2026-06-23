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
import { adminConfigRoute } from "./routes/admin.config";
import { adminSuperEmpresasRoute } from "./routes/admin.super.empresas";
import { adminSuperEmpresaDetailRoute } from "./routes/admin.super.empresas.$id";
import { adminSuperPermissoesRoute } from "./routes/admin.super.permissoes";
import { adminSuperModulosRoute } from "./routes/admin.super.modulos";
import { adminSuperModuloDetailRoute } from "./routes/admin.super.modulos.$key";
import { adminTemaRoute } from "./routes/admin.tema";
import { adminEmpresaRoute } from "./routes/admin.empresa";
import { adminSuperBancoRoute } from "./routes/admin.super.banco";
import { adminSuperIntegracoesRoute } from "./routes/admin.super.integracoes";
import { adminSuperDemosRoute } from "./routes/admin.super.demos";
import { adminLaboratorioRoute } from "./routes/admin.laboratorio";
import { adminEmpresaConfigBancoRoute } from "./routes/admin.empresa.config.banco";
import { adminEmpresaConfigBrandingRoute } from "./routes/admin.empresa.config.branding";
import { adminWebhooksRoute } from "./routes/admin.webhooks";
import { mapasRoute } from "./routes/mapas";
import { mapasDistribuidoresRoute } from "./routes/mapas.distribuidores";
import { mapasConsultoresRoute } from "./routes/mapas.consultores";
import { mapasAdminRoute } from "./routes/mapas.admin";
import { mapasAdminInsightsRoute } from "./routes/mapas.admin.insights";
import { mapasAdminDistribuidoresRoute } from "./routes/mapas.admin.distribuidores";
import { mapasAdminConsultoresRoute } from "./routes/mapas.admin.consultores";

export const routeTree = rootRoute.addChildren([
  loginRoute,
  preCadastroRoute,
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
    adminWebhooksRoute,
    mapasRoute,
    mapasDistribuidoresRoute,
    mapasConsultoresRoute,
    mapasAdminRoute,
    mapasAdminInsightsRoute,
    mapasAdminDistribuidoresRoute,
    mapasAdminConsultoresRoute,
  ]),
]);
