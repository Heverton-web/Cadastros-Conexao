---
name: adicionar-permissao
description: >
  Adiciona permissão ao sistema de permissões do ERP Odonto com validação
  de naming, verificação de duplicatas, atualização automática de defaults
  por ambiente e documentação.
  Trigger: "adicionar permissão", "criar permissão", "nova permissão"
---

# Adicionar Permissão — ERP Odonto

Adiciona permissão completa e validada ao sistema.

## Pré-requisitos

- Módulo deve existir em `src/features/<modulo>/`
- Nome da permissão em snake_case

## Workflow

### Step 1: Validar nome

```
Formato: ^[a-z][a-z0-9_]*$
Exemplo: cadastros_aprovar

Check: não existe em src/core/permissions/types.ts
Check: não existe em src/registry/permissions-registry.ts
Check: não existe no module.ts do módulo
```

### Step 2: Adicionar em types.ts

```typescript
// src/core/permissions/types.ts

export interface Permissoes {
  // ... permissões existentes

  // ═══ NOVA PERMISSÃO ═══
  {{PERMISSAO_KEY}}: boolean;
}
```

### Step 3: Registrar em permissions-registry.ts

```typescript
// src/registry/permissions-registry.ts

registerPermission({
  key: "{{PERMISSAO_KEY}}",
  label: "{{PERMISSAO_LABEL}}",
  description: "{{PERMISSAO_DESCRICAO}}",
  group: "{{MODULO_KEY}}",
});
```

### Step 4: Associar ao módulo

```typescript
// src/features/<modulo>/module.ts

export const {{MODULO_CAMEL}}Module: ModuleDefinition = {
  // ...
  permissions: [
    // ... permissões existentes
    "{{PERMISSAO_KEY}}",
  ],
};
```

### Step 5: Adicionar permissão padrão por ambiente

```typescript
// src/features/<modulo>/module.ts

registerPermissionDefaults("{{MODULO_KEY}}", {
  cadastro: {
    // ... outras permissões
    {{PERMISSAO_KEY}}: false,  // padrão: desabilitado
  },
  consultor: {
    // ... outras permissões
    {{PERMISSAO_KEY}}: false,
  },
  tecnologia: {
    // ... outras permissões
    {{PERMISSAO_KEY}}: true,  // tecnologia sempre tem acesso
  },
  suporte: {
    // ... outras permissões
    {{PERMISSAO_KEY}}: false,
  },
});
```

### Step 6: Atualizar permissões existentes (se necessário)

Se a permissão afeta outras permissões, atualizar:

```typescript
// Exemplo: permissão de "aprovar" requer "ver"
const permissoesDependentes = [
  "{{MODULO_KEY}}_aprovar",  // requer {{MODULO_KEY}}_ver
];
```

### Step 7: Documentar

Adicionar em `docs-projeto/docs-design-system/ds-{{MODULO_KEY}}.md`:

```markdown
## Permissões

| Chave | Descrição | Grupo |
|-------|-----------|-------|
| {{PERMISSAO_KEY}} | {{PERMISSAO_LABEL}} | {{MODULO_KEY}} |
```

### Step 8: Validar

```bash
npm run build   # deve passar sem erros
npm run lint    # deve passar
```

### Step 9: Commit

```bash
git add src/core/permissions/types.ts src/registry/permissions-registry.ts src/features/<modulo>/module.ts
git commit -m "feat(<modulo>): adicionar permissão {{PERMISSAO_KEY}}"
```

## Regras Obrigatórias

1. **snake_case** — sem acentos, sem caracteres especiais
2. **Grupo** — sempre vincular ao módulo
3. **Defaults** — sempre definir por ambiente
4. **Documentação** — sempre documentar
5. **Build** — sempre rodar build antes de commitar

## Padrões de Naming

| Ação | Prefixo | Exemplo |
|------|---------|---------|
| Ver/Listar | `<modulo>_ver` | `cadastros_ver` |
| Criar | `<modulo>_criar` | `cadastros_criar` |
| Editar | `<modulo>_editar` | `cadastros_editar` |
| Excluir | `<modulo>_excluir` | `cadastros_excluir` |
| Aprovar | `<modulo>_aprovar` | `cadastros_aprovar` |
| Reprovar | `<modulo>_reprovar` | `cadastros_reprovar` |
| Exportar | `<modulo>_exportar` | `cadastros_exportar` |
| Configurar | `<modulo>_configurar` | `cadastros_configurar` |

## Economia de Tokens

- **Lean-CTX:** Ler apenas arquivos necessários
- **Caveman:** Alterações cirúrgicas
- **Pre-flight:** Rodar build após cada alteração
