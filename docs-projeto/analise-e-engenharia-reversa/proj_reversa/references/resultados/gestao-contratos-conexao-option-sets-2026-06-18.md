# Option Sets

## tes

```markdown
# tes

## Summary

Este Option Set é nomeado 'tes' e está marcado como excluído.

## Opções

Este Option Set não possui opções visíveis pois foi marcado como excluído.
```

## Tipo_Página

# Tipo_Página (Option Set)

## Summary

Define os tipos de páginas disponíveis na aplicação, com links associados para navegação.

## Opções

| Opção (Display)     | Link                                                         | Valor (DB)          | Sort Factor |
| ------------------- | ------------------------------------------------------------ | ------------------- | ----------- |
| LP Convencional     | https://gestao-contratos-conexao.bubbleapps.io/lp_evento     | lp_convencional     | 1           |
| LP VIP              | https://gestao-contratos-conexao.bubbleapps.io/lp_evento_vip | lp_vip              | 2           |
| Dashboard Inscritos | https://gestao-contratos-conexao.bubbleapps.io/evento_lista  | dashboard_inscritos | 3           |

## Ações de Log

# Ações de Log

## Summary

Este Option Set define as diferentes ações que podem ser registradas em logs, como a geração e visualização de links, envio e revisão de dados, aprovação ou reprovação de cadastros, entre outras.

## Opções

| Opção              | Valor |
| ------------------ | ----- |
| Gerou Link         | bTKDT |
| Visualizou Link    | bTKDU |
| Enviou Dados       | bTKDV |
| Em Análise         | bTKDZ |
| Revisou Dados      | bTKDa |
| Solicitou Correção | bTKDb |
| Corrigiu Dados     | bTKDf |
| Aprovou Cadastro   | bTKDg |
| Reprovou Cadastro  | bTKDh |

## Meses do ano

# Meses do ano

## Summary

Um Option Set que define os meses do ano, cada um com um valor numérico para ordenação.

## Opções

| Opção     | Valor     |
| --------- | --------- |
| Janeiro   | janeiro   |
| Fevereiro | fevereiro |
| Março     | mar_o     |
| Abril     | abril     |
| Maio      | maio      |
| Junho     | junho     |
| Julho     | julho     |
| Agosto    | agodto    |
| Setembro  | setembro  |
| Outubro   | outubro   |
| Novembro  | novembro  |
| Dezembro  | dezembro  |

## [CRED] Tipo de Acesso

# [CRED] Tipo de Acesso

## Summary

Option Set que define os diferentes tipos de acesso e permissões dentro do sistema.

## Opções

| Opção                  | Valor |
| ---------------------- | ----- |
| VENDAS - Consultor     | bTKNi |
| VENDAS - Gerente       | bTKNj |
| CADASTRO - Gerente     | bTKNn |
| CADASTRO - Auxiliar I  | bTKNo |
| CADASTRO - Auxiliar II | bTKNp |
| Visualizar             | bTKON |
| Visualizar e Editar    | bTKOR |
| Full                   | bTKOl |

## Contrato_Status do Contrato

# Contrato_Status do Contrato

## Summary

Este Option Set define os possíveis status para um contrato. Inclui opções como Criado, Pendente e Assinado, com valores associados para uso no banco de dados.

## Opções

| Opção    | Valor     |
| -------- | --------- |
| Criado   | criado    |
| Pendente | pendente0 |
| Assinado | assinado  |

## Cadastro_Status Cadastro

# Cadastro_Status Cadastro

## Summary

Option Set que define os possíveis status para o cadastro do usuário.

## Opções

| Opção                | Valor |
| -------------------- | ----- |
| Link Gerado          | bTHeg |
| Dados Enviados       | bTHeh |
| Cadastro Aprovado    | bTHel |
| Cadastro Reprovado   | bTHem |
| Cadastro em Análise  | bTHen |
| Cadastro em Correção | bTJDk |

## [CRED] Função

# [CRED] Função

## Summary

Option Set que define as diferentes funções dentro do sistema, incluindo permissões associadas. Algumas opções estão marcadas como deletadas.

## Opções

| Opção                         | Valor | Tipo de Acesso |
| ----------------------------- | ----- | -------------- |
| Consultor de Vendas           | bTHgl | bTKOl          |
| Cadastro                      | bTHgp |                |
| Gerente de Cadastro           | bTHgq | bTKOl          |
| Gerente de Vendas             | bTKNt | bTKOl          |
| Auxiliar de Cadastro N1       | bTKNv | bTKOR          |
| Auxiliar de Cadastro N2       | bTKNz | bTKON          |
| Diretoria                     | bTKOf | bTKOl          |
| Gerente de TI                 | bTKOj | bTKOl          |
| Auxiliar de TI                | bTKOk | bTKON          |
| Diretor Comercial (deletada)  | bTKOr |                |
| Diretor Engenharia (deletada) | bTKOv |                |
| Diretor Financeiro (deletada) | bTKOw |                |

**Exibindo 12 de 12 opções (algumas marcadas como deletadas)**

## Cadastro_Tipo de Cadastro

# Cadastro_Tipo de Cadastro

## Summary

Option set que define os tipos de cadastro disponíveis: Pessoa Física e Pessoa Jurídica.

## Opções

| Opção           | Valor |
| --------------- | ----- |
| Pessoa Física   | bTHEv |
| Pessoa Jurídica | bTHEz |

## Cadastro_Tipo de Consulta

# Cadastro_Tipo de Consulta

## Summary

Este Option Set define os tipos de consulta disponíveis para cadastro.

## Opções

| Opção | Valor |
| ----- | ----- |
| CNPJ  | bTLQL |
| CRO   | bTLQM |

## Cadastro_Tipo de endereço

# Cadastro_Tipo de endereço

## Summary

Define os tipos de endereço disponíveis na aplicação, como "Principal" e "Entrega".

## Opções

| Opção     | Valor |
| --------- | ----- |
| Principal | bTHFA |
| Entrega   | bTHFB |

## Cadastro_Departamento

# Cadastro_Departamento

## Summary

Option Set para categorizar departamentos, associando-os a tipos de usuários e credenciais. Contém opções como Vendas, Cadastro e Tecnologia.

## Opções

| Opção      | Valor |
| ---------- | ----- |
| Vendas     | bTKOL |
| Cadastro   | bTKOM |
| Tecnologia | bTKOp |
| Diretoria  | bTKOq |

(Exibindo 4 de 4 opções)

## Cadastro_Menu Navegação

# Cadastro_Menu Navegação

## Summary

Este Option Set define as opções para o menu de navegação de cadastro, incluindo itens como "Principal", "Consultas" e "Relatórios", organizados por um fator de ordenação.

## Opções

| Opção      | Valor |
| ---------- | ----- |
| Principal  | bTKiF |
| Consultas  | bTKiJ |
| Relatórios | bTKiK |

## Expira Link

# Expira Link

## Summary

Define as opções de tempo para expiração de links, incluindo dias e horas correspondentes.

## Opções

| Opção  | Valor                                                  |
| ------ | ------------------------------------------------------ |
| 1 dia  | Opção: tempo = 48, db_value = 1_dia, sort_factor = 1   |
| 3 dias | Opção: tempo = 96, db_value = 3_dias, sort_factor = 2  |
| 5 dias | Opção: tempo = 146, db_value = 5_dias, sort_factor = 3 |
| 7 dias | Opção: tempo = 168, db_value = 7_dias, sort_factor = 4 |

## Cadastro_Tipo de Envio de Link

# Cadastro_Tipo de Envio de Link

## Summary

Define as opções para o tipo de envio de um link, permitindo que o usuário escolha entre receber via WhatsApp, E-mail ou apenas copiar o link.

## Opções

| Opção                 | Valor |
| --------------------- | ----- |
| Receberá por WhatsApp | bTHbN |
| Receberá por E-mail   | bTHbO |

## Cadastro_Tipo de Ação do Cliente

# Cadastro_Tipo de Ação do Cliente

## Summary

Este option set define os tipos de ações relacionadas ao cadastro de clientes.

## Opções

| Opção              | Valor     |
| ------------------ | --------- |
| Atualizar Cadastro | atualizar |
| Solicitar Cadastro | cadastrar |

## Contrato_Status Ação do Assinante

# Contrato_Status Ação do Assinante

## Summary

Este Option Set define os possíveis status relacionados à ação do assinante em um contrato. Contém as opções "Visualizado" e "Assinado".

## Opções

| Opção       | Valor       |
| ----------- | ----------- |
| Visualizado | visualizado |
| Assinado    | assinado    |

## Contrato_Tipo de Assinante

# Contrato_Tipo de Assinante

## Summary

Este Option Set define os tipos de assinante para fins de contrato. Contém as opções "PF" (Pessoa Física) e "PJ" (Pessoa Jurídica).

## Opções

| Opção | Valor |
| ----- | ----- |
| PF    | pf    |
| PJ    | pj    |

## Contrato_Menu Lateral

# Contrato_Menu Lateral

## Summary

Option set para definir as opções do menu lateral relacionadas a contratos. Contém itens como Modelos de Contrato, Assinaturas Digitais, Gestão de Contratos e Gestão de Consumo.

## Opções

| Opção                | Valor               |
| -------------------- | ------------------- |
| Modelos de Contrato  | pastas              |
| Assinaturas Digitais | templates           |
| Gestão de Contratos  | gest_o_de_contratos |
| Gestão de Consumo    | gest_o_de_consumo   |

## Contrato_Navegação Modelos de Contratos

# Contrato_Navegação Modelos de Contratos

## Summary

Este Option Set define as opções de navegação para a seção de Modelos de Contratos, permitindo a seleção entre "Pastas" e "Templates".

## Opções

| Opção     | Valor     |
| --------- | --------- |
| Pastas    | pastas    |
| Templates | templates |
