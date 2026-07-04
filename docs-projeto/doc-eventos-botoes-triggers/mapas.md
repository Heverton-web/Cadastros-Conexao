# Análise de Eventos, Botões e Triggers — Módulo Mapas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Mapas** gerencia mapas interativos de presença comercial, com distribuidores e consultores. Possui **8 eventos registrados** — o maior número entre módulos de CRUD simples.

**Eventos sem type definido** — diferentemente dos outros módulos, os eventos do Mapas não possuem o campo `type`, uma divergência que pode ser normalizada.

---

## 2. Eventos do Módulo

| Evento | Label | Descrição |
|---|---|---|
| `mapas.distribuidor.criado` | Distribuidor Criado | Dispara quando um novo distribuidor é adicionado |
| `mapas.distribuidor.atualizado` | Distribuidor Atualizado | Dispara quando um distribuidor é editado |
| `mapas.distribuidor.excluido` | Distribuidor Excluído | Dispara quando um distribuidor é removido |
| `mapas.consultor.criado` | Consultor Criado | Dispara quando um novo consultor é adicionado |
| `mapas.consultor.atualizado` | Consultor Atualizado | Dispara quando um consultor é editado |
| `mapas.consultor.excluido` | Consultor Excluído | Dispara quando um consultor é removido |
| `mapas.estado.clicado` | Estado Clicado | Dispara quando um estado é clicado no mapa |
| `mapas.pin.clicado` | Pin Clicado | Dispara quando um pin é clicado no mapa |

**Total: 8 eventos disponíveis para workflow.**

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| Cadastro | Sem acesso |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Mapas"

---

## 5. Observações

- **Único módulo com eventos de interação de usuário** (`estado.clicado`, `pin.clicado`) — eventos de UI
- Não possui **permission defaults** registrados (diferente da maioria dos módulos)
- Não possui `registerPermissionDefaults()` no setup
- Eventos sem campo `type` — divergência do padrão
- Tabelas gêmeas `mapas_distributors` e `mapas_consultants` com eventos espelhados
