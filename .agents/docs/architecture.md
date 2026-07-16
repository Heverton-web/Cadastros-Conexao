# Regras de Arquitetura — ERP Odonto

## Multi-tenant por empresa_id

- Toda tabela criada DEVE ter coluna `empresa_id` (UUID, FK para `empresas.id`)
- RLS policies devem filtrar por `empresa_id`
- Super Admin filtra por empresa; Admin vê apenas sua empresa

## Módulos independentes

- Cada módulo é self-contained em `src/features/<modulo>/`
- A única camada de conexão entre módulos é o BANCO DE DADOS
- Excluir um módulo não deve afetar outros
- Tabelas do módulo devem ser criadas no mesmo banco (multi-tenant)
- Arquivos críticos: `src/registry/modules.ts`, `src/features/cadastros/permissions.ts`

## 🚨 REGRA OBRIGATÓRIA: Eventos na Central de Ações

**TODO módulo novo (ou existente sem eventos) DEVE:**

1. **`events: [...]` no `module.ts`** — com `key`, `label`, `descricao`, `type` (`status_change` | `button_action`)
2. **Mínimo 2 eventos** por módulo (criação + ação principal)
3. **`dispararEventoModulo()` nos services** — fire-and-forget com `.catch(() => {})`
4. **Aba `eventos` registrada** no array `abas` do module.ts
5. **`empresa_id` no payload** — sempre passar o ID da empresa no payload e como 4º argumento
6. **Build passando** — `npm run build` deve passar antes de considerar concluído

**Eventos SEMPRE aparecem automaticamente na Central de Ações** — não precisa modificar `CentralAcoesTab.tsx`.

**Padrão de código:**
```ts
import { dispararEventoModulo } from "~/core/services/webhooks";

const MODULO_KEY = "meu-modulo";

dispararEventoModulo(MODULO_KEY, "entidade.criada", { entidade_id: id, empresa_id }, empresaId)
  .catch(() => {});  // fire-and-forget obrigatório
```
