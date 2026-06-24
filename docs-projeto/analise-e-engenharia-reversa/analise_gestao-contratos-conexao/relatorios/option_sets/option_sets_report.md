# Option Sets

**Projeto:** gestao-contratos-conexao
**Total de Option Sets:** 20
**Ativos:** 15 | **Deletados:** 5

---

## tes
**Deleted:** sim
**Dynamic:** não
*Sem valores*

---

## tipo_p_gina
**Deleted:** não
**Dynamic:** sim (coluna: `link`)

| display | db_value | sort_factor | link |
|---|---|---|---|
| LP Convencional | lp_convencional | 1 | https://gestao-contratos-conexao.bubbleapps.io/lp_evento |
| LP VIP | lp_vip | 2 | https://gestao-contratos-conexao.bubbleapps.io/lp_evento_vip |
| Dashboard Inscritos | dashboard_inscritos | 3 | https://gestao-contratos-conexao.bubbleapps.io/evento_lista |

---

## a__es_de_log
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Gerou Link | bTKDT | 1 |
| Visualizou Link | bTKDU | 2 |
| Enviou Dados | bTKDV | 3 |
| Em Análise | bTKDZ | 4 |
| Revisou Dados | bTKDa | 5 |
| Solicitou Correção | bTKDb | 6 |
| Corrigiu Dados | bTKDf | 7 |
| Aprovou Cadastro | bTKDg | 8 |
| Reprovou Cadastro | bTKDh | 9 |

---

## meses_do_ano
**Deleted:** sim
**Dynamic:** sim (coluna: `m_s`)

| display | db_value | sort_factor | m_s |
|---|---|---|---|
| Janeiro | janeiro | 1 | 1 |
| Fevereiro | fevereiro | 2 | 2 |
| Março | mar_o | 3 | 3 |
| Abril | abril | 4 | 4 |
| Maio | maio | 5 | 5 |
| Junho | junho | 6 | 6 |
| Julho | julho | 7 | 7 |
| Agosto | agodto | 8 | 8 |
| Setembro | setembro | 9 | 9 |
| Outubro | outubro | 10 | 10 |
| Novembro | novembro | 11 | 11 |
| Dezembro | dezembro | 12 | 12 |

---

## tipo_de_acesso
**Deleted:** sim
**Dynamic:** não

| display | db_value | sort_factor | deleted |
|---|---|---|---|
| VENDAS - Consultor | bTKNi | 1 | True |
| VENDAS - Gerente | bTKNj | 2 | True |
| CADASTRO - Gerente | bTKNn | 3 | True |
| CADASTRO - Auxiliar I | bTKNo | 4 | True |
| CADASTRO - Auxiliar II | bTKNp | 5 | True |
| Full | bTKOl | 6 | |
| Visualizar | bTKON | 7 | |
| Visualizar e Editar | bTKOR | 8 | |

---

## contrato_status
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor | deleted |
|---|---|---|---|
| Criado | criado | 1 | |
| Enviado | enviado | 2 | True |
| Pendente | pendente | 3 | True |
| Enviado | enviado0 | 4 | True |
| Visualizado | visualizado | 5 | True |
| Pendente | pendente0 | 6 | |
| Assinado | assinado | 7 | |

---

## status_cadastro
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Link Gerado | bTHeg | 1 |
| Dados Enviados | bTHeh | 2 |
| Cadastro em Análise | bTHen | 3 |
| Cadastro em Correção | bTJDk | 4 |
| Cadastro Aprovado | bTHel | 5 |
| Cadastro Reprovado | bTHem | 6 |

---

## tipo_de_usu_rio
**Deleted:** sim
**Dynamic:** sim (colunas: `tipo_de_acesso`, `tipo_de_acesso0`)

| display | db_value | sort_factor | deleted | tipo_de_acesso | tipo_de_acesso0 |
|---|---|---|---|---|---|
| Diretoria | bTKOf | 1 | | bTKOl | bTKOl |
| Cadastro | bTHgp | 2 | True | | |
| Gerente de TI | bTKOj | 3 | | bTKOl | bTKOl |
| Auxiliar de TI | bTKOk | 4 | | bTKON | bTKON |
| Gerente de Cadastro | bTHgq | 5 | | bTKOl | bTKOl |
| Auxiliar de Cadastro N1 | bTKNv | 6 | | bTKOR | bTKOR |
| Auxiliar de Cadastro N2 | bTKNz | 7 | | bTKON | bTKON |
| Gerente de Vendas | bTKNt | 8 | | bTKOl | bTKOl |
| Consultor de Vendas | bTHgl | 9 | | bTKOl | bTKOl |
| Diretor Comercial | bTKOr | 10 | True | | |
| Diretor Engenharia | bTKOv | 11 | True | | |
| Diretor Financeiro | bTKOw | 12 | True | | |

---

## tipo_de_cadastro
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Pessoa Física | bTHEv | 1 |
| Pessoa Jurídica | bTHEz | 2 |

---

## tipo_de_consulta
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| CNPJ | bTLQL | 1 |
| CRO | bTLQM | 2 |

---

## tipo_de_endere_o
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Principal | bTHFA | 1 |
| Entrega | bTHFB | 2 |

---

## tipo_de_credencial
**Deleted:** não
**Dynamic:** sim (colunas: `tipo_de_usu_rio`, `tipos_de_credencial`)

| display | db_value | sort_factor | deleted | tipo_de_usu_rio | tipos_de_credencial |
|---|---|---|---|---|---|
| Diretoria | bTKOq | 1 | True | bTKOf | bTKOl |
| Cadastro | bTKOM | 2 | | bTHgq, bTKNv, bTKNz | bTKON, bTKOR, bTKOl |
| Vendas | bTKOL | 3 | | bTHgl, bTKNt | bTKOl, bTKON |
| Tecnologia | bTKOp | 4 | | bTKOj, bTKOk | bTKON, bTKOR |

---

## menu_setor_cadastro
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Principal | bTKiF | 1 |
| Consultas | bTKiJ | 2 |
| Relatórios | bTKiK | 3 |

---

## tempo_expira__o_link
**Deleted:** não
**Dynamic:** sim (coluna: `tempo`)

| display | db_value | sort_factor | deleted | tempo (h) |
|---|---|---|---|---|
| 1 dia | 1_dia | 1 | | 48 |
| 3 dias | 3_dias | 2 | | 96 |
| 5 dias | 5_dias | 3 | | 146 |
| 7 dias | 7_dias | 4 | True | 168 |

---

## tipo_de_envio_de_link
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor | deleted |
|---|---|---|---|
| Receberá por WhatsApp | bTHbN | 1 | |
| Receberá por E-mail | bTHbO | 2 | |
| Apenas Copiar Link | bTHbP | 3 | True |

---

## tipo_de_a__o_do_cliente
**Deleted:** não
**Dynamic:** sim (coluna: `url`)

| display | db_value | sort_factor | url |
|---|---|---|---|
| Atualizar Cadastro | bTJMS | 1 | atualizar |
| Solicitar Cadastro | bTJMT | 2 | cadastrar |

---

## contrato_a__o_do_assinante
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Visualizado | visualizado | 1 |
| Assinado | assinado | 2 |

---

## contrato_tipo_de_assinante
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| PF | pf | 1 |
| PJ | pj | 2 |

---

## navega__o___mod__contratos
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Modelos de Contrato | pastas | 1 |
| Assinaturas Digitais | templates | 2 |
| Gestão de Contratos | gest_o_de_contratos | 3 |
| Gestão de Consumo | gest_o_de_consumo | 4 |

---

## contrato_navega__o_modelos_de_contratos
**Deleted:** não
**Dynamic:** não

| display | db_value | sort_factor |
|---|---|---|
| Pastas | pastas | 1 |
| Templates | templates | 2 |
