# Skill: adicionar-permissao

## Descrição
Adiciona permissão ao sistema de permissões do ERP Conexão.

## Trigger
- "adicionar permissão"
- "criar permissão"
- "nova permissão"

## Steps

### 1. Validar nome
- Formato snake_case: `^[a-z][a-z0-9_]*$`
- Verificar se já existe

### 2. Adicionar em types.ts
- Adicionar campo boolean na interface `Permissoes`

### 3. Registrar em permissions-registry.ts
- Chamar `registerPermission()` com key, label, description, group

### 4. Associar ao módulo
- Adicionar na array `permissões` do ModuleDefinition

### 5. Adicionar permissão padrão
- Incluir em `getPermissoesPadrao()` por ambiente

### 6. Commit
```bash
git add src/core/permissions/types.ts src/registry/permissions-registry.ts
git commit -m "feat: adicionar permissão <nome>"
```
