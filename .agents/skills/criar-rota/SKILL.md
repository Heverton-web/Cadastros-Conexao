# Skill: criar-rota

## Descrição
Cria rota protegida no ERP Conexão.

## Trigger
- "criar rota"
- "nova rota"
- "adicionar rota"

## Steps

### 1. Validar path
- Formato kebab-case: `^/[a-z0-9-]+(/[a-z0-9-]+)*$`
- Verificar se já existe

### 2. Criar arquivo de rota
- Usar template com AuthGuard
- Importar componente da página

### 3. Commit
```bash
git add src/routes/<modulo>/<rota>.tsx
git commit -m "feat(<modulo>): criar rota <rota>"
```
