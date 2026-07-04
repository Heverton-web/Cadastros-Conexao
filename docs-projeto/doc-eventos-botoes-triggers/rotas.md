# Análise de Eventos, Botões e Triggers — Módulo Rotas

> **ERP Conexão** — Documento gerado em: 04/07/2026

---

## 1. Visão Geral

O módulo **Rotas de Visitas** gerencia planejamento e execução de rotas de visitas a clientes, com integração a Google Maps. Possui **4 eventos registrados**.

---

## 2. Eventos do Módulo

### Status Change (2 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `rota.criada` | Rota Criada | Quando uma nova rota é planejada |
| `rota.finalizada` | Rota Finalizada | Quando a rota é concluída |

### Button Action (2 eventos)

| Evento | Label | Descrição |
|---|---|---|
| `rota.iniciada` | Rota Iniciada | Quando o consultor inicia a execução da rota |
| `visita.registrada` | Visita Registrada | Quando uma visita é finalizada |

**Total: 4 eventos disponíveis para workflow.**

---

## 3. Quem Pode Configurar

| Perfil | Acesso |
|---|---|
| Super Admin | Total |
| Admin de Empresa | `/empresa/acoes` |
| Consultor | Sem acesso |
| TI | Sem acesso direto |

---

## 4. Onde Configurar

- **Rota**: `/empresa/acoes` ou `/global/acoes`
- **Seletor de Módulo**: "Rotas de Visitas"

---

## 5. Observações

- Evento `rota.iniciada` é único — momento crítico onde consultor começa a executar rota física
- Integração com Google Maps para navegação
- Workflow: Criada → Iniciada → Visitas Registradas → Finalizada
- 3 ambientes: cadastro, consultor, tecnologia
