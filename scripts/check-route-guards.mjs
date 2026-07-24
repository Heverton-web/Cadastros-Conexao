#!/usr/bin/env node
/**
 * Checklist de CI: garante que toda rota em `src/routes/*.tsx` usa um dos
 * guards de permissão (`RequirePermission`, `RequireSuperAdmin`,
 * `RequireEmpresaAdmin`) — ou está explicitamente na allowlist abaixo com um
 * comentário explicando por que é pública/exceção.
 *
 * Uso: `npm run check:guards`
 * Saída: exit 0 se tudo ok; exit 1 + lista dos arquivos problemáticos se
 * algum arquivo sem guard não estiver na allowlist.
 *
 * Checagem é um grep simples no conteúdo do arquivo — não faz parsing de
 * AST, então um arquivo que só *importa* um dos guards sem realmente
 * envolver o componente com ele passaria como "ok" (falso negativo
 * aceitável para uma checagem de CI leve; revisão humana continua
 * necessária em PR review).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = join(process.cwd(), "src", "routes");

const GUARD_NAMES = [
  "RequirePermission",
  "RequireSuperAdmin",
  "RequireEmpresaAdmin",
];

// Arquivos que legitimamente não usam nenhum dos 3 guards. Cada entrada
// precisa de um motivo — não adicionar aqui só para silenciar o script.
const ALLOWLIST = {
  "index.tsx": "tela de login, pública por definição",
  "pre-cadastro.$token.tsx":
    "acessada por link público enviado ao lead, sem sessão autenticada",
  "catalogo.index.tsx": "landing pública do catálogo (vitrine, sem login)",
  "catalogo-loja.$slug.index.tsx":
    "loja pública do catálogo por empresa (cliente final, sem login interno)",
  "catalogo-loja.$slug.login.tsx":
    "tela de login do cliente final da loja — pública por definição",
  "catalogo-loja.$slug.favoritos.tsx":
    "favoritos da loja pública, autenticação é via sessão de cliente (não profile/permissoes do ERP)",
  "catalogo-loja.$slug.orcamento.$token.tsx":
    "acesso via token compartilhado com o cliente final, sem login",
  "catalogo-loja.$slug.pedidos.tsx":
    "pedidos da loja pública, autenticação é via sessão de cliente (não profile/permissoes do ERP)",
  "funis.tsx": "shell de layout/redirect do módulo funis, sem UI própria",
  "mapas.tsx": "shell de layout/redirect do módulo mapas, sem UI própria",
  "nps.tsx": "shell de layout/redirect do módulo nps, sem UI própria",
  "__root.tsx": "root layout do router, não é uma rota navegável",
  "_auth.tsx":
    "layout pai das rotas autenticadas — o guard fica nas rotas filhas, não aqui",
  "e.$slug.tsx": "redirecionador de link curto público (encurtador de URL)",
  "crm.aceitar-convite.$token.tsx":
    "aceite de convite via token público, antes de existir sessão",
};

function listRouteFiles() {
  return readdirSync(ROUTES_DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();
}

function hasGuard(content) {
  return GUARD_NAMES.some((name) => content.includes(name));
}

function main() {
  const files = listRouteFiles();
  const problemas = [];

  for (const file of files) {
    if (ALLOWLIST[file]) continue;
    const content = readFileSync(join(ROUTES_DIR, file), "utf8");
    if (!hasGuard(content)) {
      problemas.push(file);
    }
  }

  console.log(
    `check:guards — ${files.length} rotas verificadas, ${Object.keys(ALLOWLIST).length} na allowlist.`,
  );

  if (problemas.length > 0) {
    console.error(
      `\n${problemas.length} rota(s) sem RequirePermission/RequireSuperAdmin/RequireEmpresaAdmin e fora da allowlist:\n`,
    );
    for (const f of problemas) {
      console.error(`  - ${f}`);
    }
    console.error(
      "\nAdicione o guard adequado, ou se for público/exceção legítima, adicione a `ALLOWLIST` em scripts/check-route-guards.mjs com o motivo.",
    );
    process.exit(1);
  }

  console.log("Todas as rotas OK.");
}

main();
