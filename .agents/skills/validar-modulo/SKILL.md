# Skill: validar-modulo

## Descrição
Valida integridade de um módulo do ERP Conexão.

## Trigger
- "validar módulo"
- "verificar módulo"
- "checar módulo"

## Checks

### 1. Estrutura de diretórios
- Verificar pastas obrigatórias: components/, pages/, services/, hooks/
- Verificar arquivos obrigatórios: module.ts, permissions.ts, index.ts, types.ts

### 2. Registro
- Verificar se está em `src/registry/modules.ts`
- Verificar se permissões estão em `src/registry/permissions-registry.ts`

### 3. Rotas
- Verificar se rotas existem em `src/routes/`
- Verificar se não há rotas duplicadas

### 4. Tipos
- Verificar se types.ts exporta interfaces válidas
- Verificar se service.ts usa tipos corretos

### 5. Build
- Executar `npm run build` e verificar se passa

## Output
Relatório de validação com:
- ✅ Checks que passaram
- ❌ Checks que falharam
- ⚠️ Warnings
