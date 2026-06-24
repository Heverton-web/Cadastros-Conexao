# PLANO: Squad de Skills para Engenharia Reversa do Bubble

## 1. ESTRUTURA DO SQUAD
- **Tech Lead Skill** (Orquestrador): 
  - Analisa JSON de entrada, define escopos de análise, distribui tarefas
  - Estabelece templates MD e diretrizes de formatação
  - Realiza revisão técnica e aprovação final
  - Gera documentos consolidados (INDICE.md, PADROES.md, conclusões)

- **Skills Especialistas** (1 por domínio de análise):
  - `Skill Tabelas`: Analisa estruturas de dados, relacionamentos, tipos de campos
  - `Skill Páginas`: Mapeia fluxos de navegação, elementos visuais, grupos repetitivos
  - `Skill Option Sets`: Documenta conjuntos de opções, valores permitidos, uso em componentes
  - `Skill Elementos Reutilizáveis`: Identifica componentes customizados, variáveis, estilos globais
  - `Skill Workflows Backend`: Mapeia workflows server-side, APIs externas, agendamentos
  - `Skill Conectores API`: Documenta endpoints, autenticação, transformações de dados

## 2. FLUXO DE TRABALHO (CICLO ITERATIVO)
```
[Usuário] → Compartilha projeto_bubble.json
          ↓
[Tech Lead] → 1. Parse JSON e identifica domínios de análise
              2. Cria tarefas específicas para cada skill especialista
              3. Envia escopo definido + template MD padrão
              ↓
[Skill Especialista] → 1. Extrai dados relevantes do JSON conforme escopo
                      2. Aplica lógica de análise específica do domínio
                      3. Gera rascunho MD seguindo template
                      4. Submete ao Tech Lead para revisão
                      ↓
[Tech Lead] → 1. Verifica conformidade com diretrizes
              2. Aprova ou solicita revisão (com feedback específico)
              3. Se aprovado: arquiva versão final; se não: retorna para correção
              ↓
[Ciclo se repete] → Até todas as especialistas entregarem versões aprovadas
          ↓
[Tech Lead] → 1. Compila todas seções aprovadas em documento mestre
              2. Gera INDICE.md (sumário navegável)
              3. Cria PADROES.md (padrões de design/desenvolvimento identificados)
              4. Produz conclusões_engenharia_reversa.md
              5. Entrega pacote final ao usuário
```

## 3. PADRÕES E QUALIDADE
- **Templates MD pré-definidos** pelo Tech Lead contendo:
  - Cabeçalho com metadados (domínio, data, versão)
  - Seções obrigatórias (visão geral, detalhes técnicos, limitações observadas)
  - Formato de tabelas/diagramas ASCII quando aplicável
  - Referências cruzadas para outras seções do documento

- **Critérios de aprovação** do Tech Lead:
  - Completude: Todos os items do escopo abordados
  - Clareza: Linguagem técnica objetiva em PT-BR
  - Consistência: Uso uniforme de terminologia e formatação
  - Validação: Dados podem ser rastreados até o JSON original

- **Mecanismo de feedback**:
  - Tech Lead retorna comentários específicos no MD (usando `<!-- REVISAO: ... -->`)
  - Especialista responde apenas aos pontos solicitados
  - Máximo de 2 iterações por domínio antes de escalonamento

## 4. ENTREGAS FINAIS
- `plano_engenharia_reversa_COMPLETA.md` (documento mestre)
- Documentos por domínio (`*_tabelas.md`, `*_paginas.md`, etc.)
- `INDICE.md` com links navegáveis para todas seções
- `PADROES.md` contendo:
  - Padrões de nomes de campos/tabelas
  - Convenções de organização de páginas
  - Patterns recorrentes de workflows
  - Limitações técnicas identificadas do Bubble

## 5. PRÉ-REQUISITOS PARA EXECUÇÃO
- JSON de entrada deve seguir estrutura padrão do Bubble export
- Skills especialistas precisam de acesso a:
  - Funções de parsing JSON otimizadas
  - Bibliotecas de validação de esquemas
  - Templates MD versionados no repositório
- Tech Lead requer capacidade de:
  - Análise comparativa entre domínios
  - Detecção de inconsistências cross-domain
  - Síntese de padrões em nível de sistema

**PRÓXIMO PASSO:** Se aprovado, este plano seria executado invocando as skills específicas em sequência, começando pelo Tech Lead para processar o arquivo JSON inicial do usuário.