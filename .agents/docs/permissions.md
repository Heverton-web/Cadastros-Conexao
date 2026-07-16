# Enforcement de Permissões — ERP Odonto

## 🚨 Toda rota autenticada DEVE usar `RequirePermission` ou `RequireSuperAdmin`

**Componentes de guard** em `~/components/guards`:

- `RequirePermission` — verifica `modulosAcesso[key].acessar` + `permissoes[key]`
- `RequireSuperAdmin` — verifica `profile.is_super_admin`

**Padrão obrigatório em toda rota:**

```tsx
import { RequirePermission } from "~/components/guards";

export const minhaRota = createRoute({
  getParentRoute: () => authLayout,
  path: "/meu-modulo/minha-rota",
  component: () => (
    <RequirePermission modulo="meu-modulo" permissions={["minha_permissao"]}>
      <MinhaPagina />
    </RequirePermission>
  ),
});
```

## Checklist para novo módulo

- [ ] Criar `src/features/meu-modulo/permissions.ts` com todas as chaves
- [ ] Criar `src/features/meu-modulo/module.ts` com `permissions[]`, `setup()`, `events[]`
- [ ] Registrar permissões no `setup()` via `registerPermission()`
- [ ] Registrar nav items com `permissionCheck` real (nunca `() => true`)
- [ ] Registrar defaults por ambiente via `registerPermissionDefaults()`
- [ ] Em CADA rota: `<RequirePermission modulo="meu-modulo" permissions={["permissao_chave"]}>`
- [ ] Em CADA botão de ação: `permissoes?.minha_permissao === true` para habilitar/renderizar
- [ ] `npm run build` passar sem erros
- [ ] Testar: usuário SEM permissão não acessa a rota (redirecionado)
- [ ] Testar: usuário SEM permissão não vê botões de ação
