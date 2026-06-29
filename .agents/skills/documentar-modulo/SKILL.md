# Skill: documentar-modulo

## Descrição
Gera documentação automática de um módulo do ERP Conexão.

## Trigger
- "documentar módulo"
- "gerar documentação"
- "docs do módulo"

## Steps

### 1. Analisar módulo
- Ler module.ts para definição
- Ler permissions.ts para permissões
- Ler types.ts para tipos
- Ler services/ para operações CRUD

### 2. Gerar documentação
- Criar `docs-projeto/modulos/<modulo>.md` com:
  - Visão geral
  - Arquitetura
  - Permissões
  - Tipos de dados
  - Operações disponíveis
  - Rotas
  - Exemplos de uso

### 3. Commit
```bash
git add erp-conexao/docs-projeto/modulos/<modulo>.md
git commit -m "docs(<modulo>): gerar documentação"
```
