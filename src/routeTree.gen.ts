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
  ]),
]);
