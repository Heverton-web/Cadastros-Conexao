# Conclusões da Engenharia Reversa

**Projeto:** gestao-contratos-conexao
**Data:** 2026-06-18
**JSON:** `proj_reversa/references/appBubble.json`

---

## Sumário Executivo

O aplicativo **gestao-contratos-conexao** é um sistema web construído em Bubble.io que serve como plataforma de **gestão de cadastros de cirurgiões-dentistas (CDs)**, combinando:

1. **Sistema de cadastro** com fluxo de aprovação/reprovação/correção em etapas
2. **Landing pages** para eventos promocionais (APCD, VIP, Espanha, Portugal)
3. **Portal do consultor** para geração e acompanhamento de links de cadastro
4. **Painel super admin** para gestão de usuários e credenciais
5. **Linktree** e encurtador de URLs para campanhas

---

## Domínios Analisados

| Domínio | Status | Detalhes |
|---------|--------|----------|
| Páginas | ✅ 19 | 7 administrativas + 9 landing pages + 3 utilitárias |
| Data Types | ✅ 26 | 12 ativos + 14 deletados |
| Option Sets | ✅ 20 | 15 ativos + 5 deletados |
| Workflows Backend | ✅ 0 | Todos os workflows são page-level |
| API Connectors | ✅ 0 | APIs usadas via plugins/workflows internos |
| Elementos Reutilizáveis | ✅ 0 | Popups reutilizados mas sem definição formal |

---

## Principais Achados

### 1. Arquitetura de Cadastro em 2 Etapas
O sistema implementa um fluxo de cadastro dividido em:
- **Pré-cadastro** (página pública via link compartilhado): coleta dados + validação por token
- **Cadastro** (painel administrativo): revisão, aprovação, correção ou reprovação

### 2. Roteamento por Tipo de Credencial
O login roteia o usuário para diferentes páginas conforme `tipo_de_credencial`:
- Vendas → Dashboard do Consultor
- Cadastro → Gestão de Cadastros
- Tecnologia → Gestão de Credenciais
- Super Admin → Painel Admin

### 3. Cliente como Entidade Central
O Data Type `cliente` é o hub que conecta:
- Dados PF (`_pf__clientes`)
- Dados PJ (`clientes`)
- Endereços (`endere_os`)
- Documentos (`documentos`)
- Logs de auditoria (`log`)

### 4. Legado de Contratos
Há um subsistema de **contratos** (`contratos`, `contratos_dados_gerais`, `contratos_assinantes`) marcado como deletado, indicando uma funcionalidade descontinuada.

### 5. Landing Pages Multi-idioma
O sistema possui landing pages em português (lp_evento_pt), espanhol (lp_evento_es) e português brasileiro (lp_evento, lp_evento_vip), sugerindo alcance internacional.

### 6. APIs Utilizadas (embutidas em workflows)
- API de envio de dados/email (plugin Bubble)
- API de validação CPF
- API de busca CRO
- API de encurtamento de URL
- API de consulta CEP

---

## Limitações da Análise

- O JSON exportado não contém `api_connectors`, `backend_workflows` ou `reusable_elements` como blocos separados
- `user_types` foi usado como fonte de data types (equivalente Bubble)
- Alguns campos podem ser option sets armazenados como data types
- Duplicate keys no JSON foram tratadas (parse com strict=False)

---

## Próximos Passos Sugeridos

1. **Documentar fluxos de API** — Extrair chamadas de API dos workflows de página
2. **Reconstruir frontend** — Usar relatório de páginas para recriar UI em TanStack Start
3. **Reconstruir backend** — Mapear data types para schema Prisma/Zod
4. **Implementar autenticação** — Recriar sistema de login com Supabase
5. **Migrar option sets** — Converter para enums TypeScript
