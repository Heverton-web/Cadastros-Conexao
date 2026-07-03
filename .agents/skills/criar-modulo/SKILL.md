# Skill: criar-modulo

## Descrição
Cria estrutura completa de um novo módulo no ERP Conexão.

## Trigger
- "criar módulo"
- "novo módulo"
- "adicionar módulo"

## Pré-requisitos
- Nome do módulo em kebab-case (ex: `relatorios-avancados`)
- Nome display em PascalCase (ex: `Relatórios Avançados`)

## Steps

### 1. Validar nome do módulo
- Verificar formato kebab-case: `^[a-z0-9-]+$`
- Verificar se já existe em `src/features/`
- Verificar se já está registrado em `src/registry/modules.ts`

### 2. Criar estrutura de diretórios
```
src/features/<modulo>/
├── module.ts
├── permissions.ts
├── index.ts
├── types.ts
├── components/
├── pages/
├── services/
├── hooks/
├── lib/
└── constants/
```

### 3. Gerar arquivos base
- Copiar templates de `.agents/skills/criar-modulo/templates/`
- Substituir placeholders: `{{MODULO_KEY}}`, `{{MODULO_NOME}}`, `{{MODULO_DESCRICAO}}`, `{{MODULO_ICON}}`

### 4. Registrar módulo
- Adicionar definição em `src/registry/modules.ts`
- Chamar `registerModule()` no `main.tsx`

### 5. Adicionar permissões
- Criar permissões em `src/core/permissions/types.ts`
- Registrar em `src/registry/permissions-registry.ts`
- Adicionar em `getPermissoesPadrao()` por ambiente

### 6. Criar rotas
- Criar arquivo em `src/routes/<modulo>/index.tsx`
- Usar template de rota protegida

### 6.5. Criar configuração de Design System (automático)
- Executar skill `criar-design-modulo` para adicionar rota `/<modulo>/design`
- Adicionar `hasDesignConfig: true, designRoute: "/<modulo>/design"` ao module.ts

### 7. Commit
```bash
git add src/features/<modulo>/
git commit -m "feat(<modulo>): criar módulo <modulo>"
```

## Validação
- `npm run build` deve passar
- `npm run lint` deve passar
- Módulo deve aparecer no registry
- Rota `/<modulo>/design` deve ser acessível
