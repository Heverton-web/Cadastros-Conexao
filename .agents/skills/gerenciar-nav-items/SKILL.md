---
name: gerenciar-nav-items
description: >
  Gerencia nav items (itens de navegação lateral) de módulos do ERP Conexão.
  Adiciona, renomeia, reordena ou remove nav items de forma estruturada,
  garantindo que rotas, permissões e module.ts fiquem consistentes.
  DISPARO: quando o usuário pedir para adicionar/alterar/remover nav items,
  rotas de navegação, ou reorganizar o menu lateral de um módulo.
---

# Gerenciar Nav Items

## Regra
Ativar quando o usuário pedir para alterar nav items, rotas de navegação,
ou reorganizar o menu lateral.

## Pré-requisitos
- Módulo deve existir em `src/features/<modulo>/`
-module.ts deve estar registrado

## Fluxo

### 1. Mapear nav items atuais
Ler `src/features/<modulo>/module.ts` para ver a definição atual:
```typescript
navItems: [
  { path: '/modulo/rota', label: 'Nome', icon: IconeLucide, roles: ['admin'] }
]
```

### 2. Receber a lista desejada do usuário
Formato esperado:
```
- /modulo/admin/dashboard → Dashboard Admin → admin
- /modulo/admin/config → Configurações → admin
- /modulo/gestor/relatorios → Relatórios → gestor
```

### 3. Validar consistência
Para cada nav item:
- Path deve ser kebab-case e único
- Label não pode duplicar outro nav item do mesmo módulo
- Roles devem existir no sistema de permissões
- Ícone deve ser um Lucide icon válido

### 4. Atualizar module.ts
```typescript
navItems: [
  { path: '/hub/admin/dashboard', label: 'Dash. Admin', icon: LayoutDashboard, roles: ['admin'] },
  { path: '/hub/admin/materiais', label: 'Materiais', icon: BookOpen, roles: ['admin'] },
  // ... etc
]
```

### 5. Verificar rotas
- Todas as rotas referenciadas devem existir em `src/routes/`
- Se não existirem, criá-las (usar skill `criar-rota`)

### 6. Verificar permissões
- Se novas roles foram adicionadas, verificar se existem no permissions-registry
- Se não existirem, criá-las (usar skill `adicionar-permissao`)

### 7. Commit
```bash
git add src/features/<modulo>/module.ts
git commit -m "feat(<modulo>): atualizar nav items"
```

## Observações
- Nav items com o mesmo label mas paths diferentes são permitidos (ex: "Dash. Admin" e "Dash. Gestor")
- Usar nomes específicos para nav items repetidos entre perfis
- Sempre manter a ordem lógica: Dashboard primeiro, depois CRUD, depois configurações
- Super Admin pode ver todos os nav items independentemente de roles
