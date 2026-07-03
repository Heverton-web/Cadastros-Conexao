# Skill: gerar-crud

## Descrição
Gera operações CRUD completas para um módulo do ERP Conexão.

## Trigger
- "gerar crud"
- "criar crud"
- "operações crud"

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
- Tabela deve existir no Supabase

## Steps

### 1. Ler schema da tabela
- Usar MCP `supabase_describe_table` para obter colunas
- Mapear tipos PostgreSQL → TypeScript

### 2. Gerar tipos TypeScript
- Criar interface baseada nas colunas da tabela
- Incluir campos padrão: id, empresa_id, created_at, updated_at

### 3. Criar service.ts
- Operações: listar, buscarPorId, criar, atualizar, excluir
- Validação Zod para inputs
- Tratamento de erros

### 4. Criar hook useService()
- Wrapper sobre service com React Query
- Cache, invalidação, estados de loading/error

### 5. Commit
```bash
git add src/features/<modulo>/services/
git commit -m "feat(<modulo>): gerar CRUD"
```
