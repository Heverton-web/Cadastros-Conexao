# Thinking: Extração do Design System ERP Odonto

> Data: 2026-07-13
> Objeto: Documentação do workflow de extração do design system

---

## 1. Objetivo

Extrair e documentar o design system completo do ERP Odonto, tanto global quanto por módulo, para servir como referência para desenvolvedores e designers.

---

## 2. Workflow de Thinking Utilizado

### Fase 1: Exploração Inicial

**Ação:** Mapear a estrutura geral do projeto

**Estratégia:**
1. Listar diretórios principais (`src/`, `components/`, `features/`)
2. Identificar localização de estilos (`globals.css`, `tailwind.config`)
3. Mapear componentes UI (`src/components/ui/`)
4. Listar módulos/features disponíveis

**Ferramentas utilizadas:**
- `glob` - Busca de padrões de arquivos
- `read` - Leitura de arquivos específicos

**Insights:**
- O projeto usa Tailwind CSS v4 com variáveis CSS customizadas
- Componentes baseados em shadcn/ui + Radix UI
- Design system centralizado em `src/design-system/`
- Cada módulo pode ter estilos próprios

---

### Fase 2: Extração de Tokens Globais

**Ação:** Extrair tokens de cores, tipografia, espaçamentos

**Arquivos analisados:**
- `src/styles/globals.css` - Variáveis CSS principais
- `src/design-system/tokens/types.ts` - Interface DesignTokens
- `src/design-system/tokens/resolver.ts` - Resolução de tokens
- `src/design-system/tokens/presets/*.ts` - Presets de tema

**Dados extraídos:**
- ~50 tokens de cores (base, tipografia, bordas, accent, feedback, componentes, efeitos)
- 4 presets de tema (dark-gold, dark-blue, light-clean, dark-emerald)
- Tipografia (fontes, tamanhos, pesos, alturas de linha)
- Espaçamentos (xs a 4xl)
- Border radius (sm a full)
- Sombras (sm a xl + especiais)
- Animações (durações, easings, keyframes)

**Padrão de documentação:**
```markdown
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0f172a` | Fundo principal |
```

---

### Fase 3: Extração de Componentes

**Ação:** Documentar cada componente UI do design system

**Componentes analisados:**
- Button (variantes, tamanhos, props especiais)
- Input (estilos, estados)
- Dialog (estutura, header, footer, scroll)
- AlertDialog (confirmações)
- Card (estrutura completa)
- Badge (variantes de status)
- Select (trigger, content, items)
- Tabs (list, trigger, content)
- Table (header, body, rows, cells)
- PageHeader (breadcrumbs, título, ações)
- Form (React Hook Form + Zod)
- LoadingState
- EmptyState

**Padrão de documentação:**
```markdown
### Componente

**Variantes:**
| Variante | Classe | Uso |
|----------|--------|-----|
| `default` | `bg-primary` | Botão principal |

**Estilo base:**
```
classes do componente
```
```

---

### Fase 4: Extração por Módulo

**Ação:** Analisar cada módulo e extrair design system específico

**Módulos analisados:**
1. cadastros
2. crm
3. empresas
4. despesas
5. funis
6. nps
7. catalogo
8. marketing (12 sub-módulos)
9. rotas
10. gerador-links
11. linktree
12. mapas
13. hub

**Dados extraídos por módulo:**
- Visão geral (chave, ícone, descrição)
- Permissões (chaves, descrição, grupos)
- Rotas disponíveis
- Eventos (status_change, button_action)
- Abas de configuração
- Nav items (id, label, ícone, rota, ordem)
- Design system específico (CSS próprio, padrões de UI)

**Ferramentas utilizadas:**
- `read` - Leitura de `module.ts` de cada módulo
- `read` - Leitura de arquivos CSS próprios (hub, catalogo)
- `glob` - Busca de arquivos de design por módulo

---

### Fase 5: Organização e Salvamento

**Ação:** Criar estrutura de pastas e salvar documentos

**Estrutura criada:**
```
docs-projeto/
└── docs-design-system/
    ├── README.md (índice)
    ├── ds-erp.md (global)
    ├── ds-cadastros.md
    ├── ds-crm.md
    ├── ds-empresas.md
    ├── ds-despesas.md
    ├── ds-funis.md
    ├── ds-nps.md
    ├── ds-catalogo.md
    ├── ds-marketing.md
    ├── ds-rotas.md
    ├── ds-gerador-links.md
    ├── ds-linktree.md
    ├── ds-mapas.md
    └── ds-hub.md
```

**Padrão de nomenclatura:** `ds-<nome_modulo>.md`

---

## 3. Técnicas de Economia de Tokens Utilizadas

### 3.1 Lean-CTX (Leitura Eficiente)

- **Ler assinaturas primeiro:** Interfaces TypeScript antes de corpos inteiros
- **Glob pattern matching:** Buscar padrões específicos em vez de listagens completas
- **Leitura seletiva:** Apenas arquivos necessários para cada fase

### 3.2 Agrupamento de Operações

- **Multi-file reads:** Ler vários arquivos em paralelo quando independente
- **Batch writes:** Criar múltiplos arquivos em sequência rápida

### 3.3 Progress Disclosure

- **Metadados primeiro:** module.ts para visão geral
- **Detalhes sob demanda:** CSS próprio apenas quando existe
- **Referências cruzadas:** Links entre documentos

### 3.4 Padrões de Documentação Reutilizáveis

- **Tabelas padronizadas:** Tokens, permissões, rotas, eventos
- **Estrutura consistente:** Mesma ordem de seções em todos os módulos
- **Exemplos de código:** Padrões de UI comuns

---

## 4. Decisões de Design da Documentação

### 4.1 Formato

- **Markdown (.md):** Fácil leitura e versionamento
- **Tabelas:** Para dados estruturados
- **Código:** Para exemplos e padrões

### 4.2 Granularidade

- **1 arquivo por módulo:** Balance entre completude e organização
- **1 arquivo global:** Design system unificado

### 4.3 Conteúdo por Módulo

- **Sempre presente:** Visão geral, permissões, rotas, eventos, nav items
- **Opcional:** Design system específico (CSS próprio, padrões de UI)

---

## 5. Resultados Alcançados

### 5.1 Cobertura

- ✅ Design system global completo
- ✅ 13 módulos documentados
- ✅ 12 sub-módulos de marketing cobertos
- ✅ Índice com navegação

### 5.2 Métricas

- ~15 arquivos criados
- ~3000 linhas de documentação
- ~50 tokens documentados
- ~13 componentes documentados

### 5.3 Utilidade

- Referência para desenvolvedores novos
- Padrões consistentes para novos componentes
- Base para geração automática de código

---

## 6. Lições Aprendidas

### 6.1 O que funcionou

- Exploração sistemática por fases
- Padrões de documentação reutilizáveis
- Leitura seletiva de arquivos

### 6.2 O que poderia melhorar

- Script automático de geração
- Validação de consistência
- Integração com Storybook

### 6.3 Próximos passos

- Criar skill para aplicar design system a módulos
- Automatizar extração com scripts
- Integrar com pipeline de CI/CD

---

## 7. Referências

- `src/styles/globals.css` - Tokens CSS
- `src/design-system/` - Design system centralizado
- `src/components/ui/` - Componentes UI
- `src/features/*/module.ts` - Definições de módulos
