# Role Based UX - Especificação Técnica

## 1. Regras de Exclusividade (Hard Block)

- **Cenário:** O sistema bloqueia usuários CADASTRO e TECNOLOGIA (TI) caso utilizem telas menores que 1024px.
- **Solução:** Componente `DeviceGate` englobando o `AppLayout`. O componente verificará o `profile.ambiente` e o `window.innerWidth`. Se detectar largura inadequada, exibirá modal de bloqueio full-screen orientado ao uso em Desktop.

## 2. Mobile-First (CONSULTOR)

- A BottomNav permanece a principal interface de navegação.
- Botões de ações primárias em formato grande (touch targets).
- Telas de edição fluídas (stack vertical), sem uso de tabelas laterais.

## 3. Desktop-First (SUPER ADMIN)

- Acesso sem restrição de bloqueio.
- Componentes complexos (Tabelas de permissões, Webhooks, Editor JSON) em full-width no Desktop.
- No Mobile (telas reduzidas), implementa-se Fallback usando `overflow-x-auto` nas tabelas em vez de estourar layout.

## Histórico da Sprint

- Branch `feature/role-based-ux` criada para isolar e proteger as mudanças.
- Refatoração cuidadosa utilizando `TailwindCSS` em harmonia com as diretrizes do `AppLayout`.
