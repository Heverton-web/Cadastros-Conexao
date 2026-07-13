# Adequação Responsiva Completa (Mobile, Tablet, Desktop)

A aplicação foi originalmente desenvolvida com um foco total em Mobile (por isso ela utilizava navegação inferior e uma largura fixa central). Para transformá-la numa ferramenta profissional adequada para uso em escritório (Desktop) e tablets, sem perder a agilidade do celular, propomos uma refatoração em toda a arquitetura de layout usando os breakpoints do Tailwind (`md:` e `lg:`).

## User Review Required

> [!IMPORTANT]
> Aprovação da Mudança na Navegação Desktop:
> Em dispositivos Mobile, a navegação principal (Dashboard, Clientes, Relatórios, etc.) continuará na parte **inferior** da tela (BottomNav).
> No entanto, no **Desktop e Tablet Grande**, a barra inferior será **ocultada**. Os botões de navegação serão integrados ao **Cabeçalho Superior (Header)**, tornando a experiência idêntica a de um software SaaS (Sistema Web) tradicional. Você aprova essa abordagem para o menu?

## Proposed Changes

---

### Layout & Navegação Global

Vamos separar a experiência mobile (menu embaixo) da desktop (menu em cima).

#### [MODIFY] [AppLayout.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/components/layout/AppLayout.tsx)

- Otimização do container principal para usar `max-w-7xl px-4 lg:px-8`.
- No Cabeçalho (Header), injetaremos a renderização condicional dos links de navegação do sistema para quando a tela for `lg` (Desktop), posicionando-os no centro do header ao invés da tela inferior.

#### [MODIFY] [BottomNav.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/components/layout/BottomNav.tsx)

- Adicionar `lg:hidden` no container principal para que a barra de rodapé **desapareça** em telas grandes (a partir de 1024px).

---

### Dashboard & Visões Gerais

Refatoração dos grids estatísticos que, em telas largas, não precisam ficar limitados a uma única coluna infinita.

#### [MODIFY] [dashboard.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/dashboard.tsx)

- Transformar os cards de contadores (Total Clientes, Cadastros Pendentes, etc.) de uma estrutura vertical para um Grid que se adapta: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.
- Os gráficos passarão a ficar lado a lado no Desktop, ao invés de empilhados.

#### [MODIFY] [relatorios.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/relatorios.tsx)

- Mudar as seções de filtragem para ficarem alinhadas no topo com `flex-row` no Desktop, aproveitando o espaço da tela.

---

### Telas de Entidades (Listagem e Detalhes)

Mudar o comportamento de listas longas e visões focadas que ficam excessivamente esticadas em monitores grandes.

#### [MODIFY] [clientes.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/clientes.tsx)

- A barra de buscas e filtros se torna horizontal (`lg:flex-row`).
- A lista vertical de clientes vira um Grid elegante de cards de clientes no Desktop: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

#### [MODIFY] [clientes.$id.tsx](file:///c:/Users/trcnologia/Desktop/bubble_reverse_engineering/cadastros-conexao/src/routes/clientes.$id.tsx) (Perfil do Cliente)

- Em celulares, permanece em uma única coluna vertical com Tabs.
- No Desktop, dividiremos a tela em **duas colunas**: uma barra lateral esquerda com as Informações do Cliente e as abas, e o Painel Central largo exibindo o conteúdo selecionado da aba (Formulários, Timeline, etc.).

## Verification Plan

### Manual Verification

- O usuário e a IA irão validar o aplicativo, simulando a largura com as "Ferramentas do Desenvolvedor (F12)" nos modos: iPhone SE (Mobile), iPad Air (Tablet) e Full Width (Desktop).
- Confirmar se o `BottomNav` some em grandes telas e se os botões aparecem corretamente no `AppLayout`.
