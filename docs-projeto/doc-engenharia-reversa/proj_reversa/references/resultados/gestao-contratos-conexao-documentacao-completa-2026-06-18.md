# Documentação do Projeto: gestao-contratos-conexao

_Exportado em: 18/06/2026_

---

# Tabelas de Dados (Data Types)

## LOG

# LOG (Data Type)

## Summary

Este Data Type armazena registros de atividades, incluindo quem realizou a ação, o que foi realizado e quando.

## Campos

| Campo          | Tipo         | Obrigatório |
| -------------- | ------------ | ----------- |
| quemRealizou   | text         | Não         |
| oQueRealizou   | text         | Não         |
| quandoRealizou | text         | Não         |
| CLIENTE        | cliente      | Não         |
| logDeDetalhes  | log_detalhes | Não         |

## User

# User (Data Type)

## Summary

Representa as informações de um usuário no sistema, incluindo dados de contato, credenciais de acesso e status (ativo/inativo).

## Campos

| Campo               | Tipo                          | Obrigatório          |
| ------------------- | ----------------------------- | -------------------- |
| usuarioWhatsapp     | text                          | Não                  |
| usuarioAtivo        | boolean                       | Não (default: true)  |
| senhaPadraoUsuario  | text                          | Não                  |
| usuarioSuperAdmin   | boolean                       | Não (default: false) |
| usuarioNomeCompleto | text                          | Não                  |
| CLIENTES            | list of custom client         | Não                  |
| DEPARTAMENTO        | option set tipo_de_credencial | Não                  |

## User

# User

## Summary

Este Data Type representa informações de usuários no sistema. Está marcado como deletado e não será mais utilizado.

## Campos

| Campo             | Tipo                            | Obrigatório |
| ----------------- | ------------------------------- | ----------- |
| E. Ativo?         | boolean                         | Não         |
| 01. Nome Completo | text                            | Não         |
| A. Clientes       | list of custom `cliente`        | Não         |
| D. Tipo de Acesso | option set `tipo_de_acesso`     | Não         |
| C. Função         | option set `tipo_de_usu_rio`    | Não         |
| B. Departamento   | option set `tipo_de_credencial` | Não         |

## evento

# evento (Data Type)

## Summary

Define a estrutura de dados para armazenar informações de eventos, incluindo dados do participante, detalhes de valor e status de confirmação.

## Campos

| Campo                   | Tipo                          | Obrigatório |
| ----------------------- | ----------------------------- | ----------- |
| cpf                     | text                          | Não         |
| nome                    | text                          | Não         |
| email                   | text                          | Não         |
| valor                   | number                        | Não         |
| cro                     | text                          | Não         |
| tag                     | text                          | Não         |
| cidade                  | text                          | Não         |
| estado                  | text                          | Não         |
| previa_fat - deleted    | number                        | Não         |
| whatsapp                | text                          | Não         |
| confirmado              | boolean                       | Não         |
| convidado_por           | text                          | Não         |
| numero_sorteio          | text                          | Não         |
| previa_fat - deleted    | list.number                   | Não         |
| convidado_por - deleted | api.apiconnector2.bTMGk.bTMGl | Não         |

## Contratos_Pastas

# Contratos_Pastas

## Summary

Este Data Type define a estrutura para armazenar "Pastas de Contratos". Ele inclui campos para o nome da pasta e um template associado. O Data Type foi excluído.

## Campos

| Campo       | Tipo      | Obrigatório |
| ----------- | --------- | ----------- |
| 01. Nome    | text      | Não         |
| A. Template | list.text | Não         |

## Cadastros

# Cadastros (Data Type)

## Summary

Data type para armazenar informações de cadastros de clientes, incluindo detalhes pessoais, links de acesso, status e resultados de consultas.

## Campos

| Campo                        | Tipo          | Obrigatório |
| ---------------------------- | ------------- | ----------- |
| celular_temp                 | text          | Não         |
| nome_cliente                 | text          | Não         |
| C. Colaborador               | user          | Não         |
| AA. link_expira_em           | date          | Não         |
| H. Revisado?                 | boolean       | Não         |
| S. Token gerado              | text          | Não         |
| AB. token_expira_em          | date          | Não         |
| A. Código Cliente            | text          | Não         |
| B. Link de Acesso            | text          | Não         |
| L. Código Cliente            | text          | Não         |
| E. Nome Temporário           | text          | Não         |
| temp - email token           | text          | Não         |
| O. Data da consulta          | text          | Não         |
| N. Data de finalização       | date          | Não         |
| I. Comentário Reprovação     | text          | Não         |
| P. Consulta CNPJ realizada?  | boolean       | Não         |
| M. Data de criação do link   | date          | Não         |
| 04. Documentação             | documentos    | Não         |
| Q. Consulta CRO realizada?   | boolean       | Não         |
| R. Status verificação token  | boolean       | Não         |
| 03. Dados de Endereço        | enderecos     | Não         |
| 02. Dados Cadastrais - PJ    | clientes      | Não         |
| D. Status Cadastro           | option        | Não         |
| G. Tipo de Cadastro          | option        | Não         |
| 01. Dados Cadastrais - PF    | _pf__clientes | Não         |
| J. Tipo de Ação              | option        | Não         |
| F. Forma de Compartilhamento | option        | Não         |

## Cadastros_Clientes_PJ

# Cadastros_Clientes_PJ

## Summary

Este DataType armazena informações detalhadas sobre cadastros de clientes Pessoa Jurídica, incluindo dados de identificação, contato e informações específicas como CRO e CNPJ.

## Campos

| Campo                           | Tipo                    | Obrigatório |
| ------------------------------- | ----------------------- | ----------- |
| 07a. E-mail de Comunicação      | text                    | Não         |
| 02b. UF CRO                     | text                    | Não         |
| 06a. Celular 01                 | text                    | Não         |
| 06b. Celular 02                 | text                    | Não         |
| 07b. E-mail de NF               | text                    | Não         |
| 01. Razão Social                | text                    | Não         |
| 02. Número do CRO               | text                    | Não         |
| 03. Número de CPF - deleted     | text                    | Não         |
| 05. Telefone Fixo               | text                    | Não         |
| 01b. Nome Fantasia              | text                    | Não         |
| 04. Número de CNPJ              | text                    | Não         |
| 04c. Data consulta              | date                    | Não         |
| B. Cliente                      | custom.cliente          | Não         |
| 06. Endereço Completo - deleted | text                    | Não         |
| 04b. Inscrição Estatual         | text                    | Não         |
| 02c. Data emissão CRO \| TPD    | date                    | Não         |
| A. Tipo de Cadastro             | option.tipo_de_cadastro | Não         |

## contratos

```markdown
# contratos (Data Type)

## Summary

Este Data Type representa informações de contratos, incluindo campos de texto, arquivos PDF e campos personalizados relacionados a dados gerais e assinantes. O Data Type está marcado como excluído.

## Campos

| Campo                  | Tipo        | Obrigatório |
| ---------------------- | ----------- | ----------- |
| teste                  | text        | Não         |
| 03. PDF                | file        | Não         |
| 03. Data de Início     | date        | Não         |
| 02. Contrato em PDF    | file        | Não         |
| 04. Data de Término    | date        | Não         |
| 01. Número do Contrato | text        | Não         |
| 01. Título do Contrato | text        | Não         |
| descricao              | text        | Não         |
| A. Dados Gerais        | custom      | Não         |
| B. Assinantes          | list custom | Não         |
```

## Cadastros_Endereços

# Cadastros_Endereços

## Summary

Este Data Type armazena informações detalhadas de endereços associados a clientes. Contém campos para CEP, rua, bairro, cidade, estado, número e complemento, além de referências a clientes e tipos de endereço.

## Campos

| Campo                 | Tipo                    | Obrigatório |
| --------------------- | ----------------------- | ----------- |
| CEP                   | text                    | Não         |
| RUA                   | text                    | Não         |
| PAÍS - deleted        | text                    | Não         |
| BAIRRO                | text                    | Não         |
| CIDADE                | text                    | Não         |
| ESTADO                | text                    | Não         |
| NÚMERO                | text                    | Não         |
| COMPLEMENTO - deleted | text                    | Não         |
| COMPLEMENTO           | text                    | Não         |
| A. Cliente            | custom.cliente          | Não         |
| A. Cliente - deleted  | custom.clientes         | Não         |
| B. Tipo de Endereço   | option.tipo_de_endere_o | Não         |

## Contratos_Template

# Contratos_Template

## Summary

Este Data Type representa modelos de contrato, mas foi marcado como excluído e não deve mais ser utilizado.

## Campos

| Campo        | Tipo | Obrigatório |
| ------------ | ---- | ----------- |
| 01. Nome     | text | Não         |
| A. Pasta     | text | Não         |
| 02. Conteúdo | text | Não         |

## tutoriais

# tutoriais (Data Type)

## Summary

Define a estrutura de dados para armazenar informações de tutoriais, incluindo arquivo HTML, nome e URL de imagem.

## Campos

| Campo  | Tipo | Obrigatório |
| ------ | ---- | ----------- |
| html   | file | Não         |
| nome   | text | Não         |
| imagem | text | Não         |

## Buscas CRO

# Buscas CRO

## Summary

Este Data Type representa informações sobre buscas realizadas, incluindo quem consultou, quando, e o custo associado. Alguns campos foram marcados como deletados.

## Campos

| Campo                                      | Tipo   | Obrigatório |
| ------------------------------------------ | ------ | ----------- |
| A. Saldo - deleted                         | number | Não         |
| 02. Limite mensal - deleted                | text   | Não         |
| 01. Quem consultou                         | user   | Não         |
| 02. Limite mensal - deleted                | number | Não         |
| 03. Quanto custou                          | number | Não         |
| 02. Quando consultou                       | date   | Não         |
| 01. Quantidade buscas realizadas - deleted | number | Não         |

## Cadastros_Documentos

# Cadastros_Documentos

## Summary

Este Data Type armazena documentos e informações relacionadas a cadastros de clientes e responsáveis técnicos. Inclui campos para arquivos como CNH, CRO, Contrato Social e Declaração, além de referências ao cliente.

## Campos

| Campo                                                 | Tipo           | Obrigatório |
| ----------------------------------------------------- | -------------- | ----------- |
| 05. Declaração - PDF                                  | file           | Não         |
| 02c. CNH - PDF - deleted                              | file           | Não         |
| 01a. CRO - IMG - deleted                              | image          | Não         |
| 01a. CRO - FRENTE                                     | file           | Não         |
| 01b. CRO - VERSO                                      | file           | Não         |
| 02a. CNH - FRENTE                                     | file           | Não         |
| 02b. CNH - VERSO                                      | file           | Não         |
| 02a. CNH - Frente - IMG - deleted                     | image          | Não         |
| 02b. CNH - Verso - IMG - deleted                      | image          | Não         |
| 03a. Endereço - IMG - deleted                         | image          | Não         |
| 03. Endereço                                          | file           | Não         |
| A. Cliente                                            | custom.cliente | Não         |
| 05a. Declaração - IMG - deleted                       | image          | Não         |
| 04. Contrato Social - PDF                             | file           | Não         |
| 04a. Contrato Social - IMG - deleted                  | image          | Não         |
| 06c. CNH Responsável Técnico - PDF - deleted          | file           | Não         |
| 06b. CNH Responsável Técnico - VERSO                  | file           | Não         |
| 06a. CNH Responsável Técnico - FRENTE                 | file           | Não         |
| 06b. CNH Responsável Técnico - Verso - IMG - deleted  | image          | Não         |
| 06a. CNH Responsável Técnico - Frente - IMG - deleted | image          | Não         |

## evento_es

# evento_es (Data Type)

## Summary

Representa um evento com informações de participantes e seus status de confirmação. Este Data Type foi marcado como deletado.

## Campos

| Campo          | Tipo    | Obrigatório |
| -------------- | ------- | ----------- |
| cpf            | text    | Não         |
| nome           | text    | Não         |
| email          | text    | Não         |
| valor          | number  | Não         |
| cro            | text    | Não         |
| tag            | text    | Não         |
| cidade         | text    | Não         |
| estado         | text    | Não         |
| whatsapp       | text    | Não         |
| confirmado     | boolean | Não         |
| convidado_por  | text    | Não         |
| numero_sorteio | text    | Não         |

## evento_APCD

# evento_APCD

## Summary

Este Data Type armazena informações relacionadas a eventos, incluindo dados de CPF, nome, CRO (Conselho Regional de Odontologia), tag VIP, cidade, estado e WhatsApp.

## Campos

| Campo         | Tipo | Obrigatório |
| ------------- | ---- | ----------- |
| apcd_cpf      | text | Não         |
| apcd_nome     | text | Não         |
| apcd_cro      | text | Não         |
| apcd_tag      | text | Não         |
| apcd_cidade   | text | Não         |
| apcd_estado   | text | Não         |
| apcd_whatsapp | text | Não         |

## evento_LEAD

# evento_LEAD

## Summary

Este data type representa informações de leads associadas a eventos. Contém campos para dados cadastrais e informações específicas de VIPs.

## Campos

| Campo         | Tipo | Obrigatório |
| ------------- | ---- | ----------- |
| apcd_cpf      | text | Não         |
| apcd_nome     | text | Não         |
| apcd_cro      | text | Não         |
| apcd_tag      | text | Não         |
| apcd_cidade   | text | Não         |
| apcd_estado   | text | Não         |
| apcd_whatsapp | text | Não         |

## LOG Detalhes

# LOG Detalhes

## Summary

Este Data Type armazena detalhes de logs, como localização, tipo de navegador, dispositivo, sistema operacional e fingerprint do dispositivo.

## Campos

| Campo                       | Tipo       | Obrigatório |
| --------------------------- | ---------- | ----------- |
| 01. Local                   | text       | Não         |
| A. LOG                      | custom.log | Não         |
| 03. Tipo de navegador       | text       | Não         |
| 02. Tipo de dispositivo     | text       | Não         |
| 04. Sistema operacional     | text       | Não         |
| 05. Fingerprint Dispositivo | text       | Não         |

## Cadastros_Clientes_PF

# Cadastros_Clientes_PF

## Summary

Define a estrutura de dados para armazenar informações de cadastro de clientes pessoa física, incluindo dados pessoais, de contato e profissionais.

## Campos

| Campo                           | Tipo                    | Obrigatório |
| ------------------------------- | ----------------------- | ----------- |
| 06a. E-mail de Comunicação      | text                    | Não         |
| 02b. UF CRO                     | text                    | Não         |
| 05a. Celular 01                 | text                    | Não         |
| 05b. Celular 02                 | text                    | Não         |
| 06b. E-mail de NF               | text                    | Não         |
| 01. Nome completo               | text                    | Não         |
| 02. Número do CRO               | text                    | Não         |
| 03. Número de CPF               | text                    | Não         |
| 04. Telefone Fixo               | text                    | Não         |
| B. Cliente                      | custom.cliente          | Não         |
| 06. Endereço Completo - deleted | text                    | Não         |
| 01b. Data de Nascimento         | date                    | Não         |
| 02c. Data emissão CRO \| TPD    | date                    | Não         |
| A. Tipo de Cadastro             | option.tipo_de_cadastro | Não         |

## Consultas CNPJ

# Consultas CNPJ

## Summary

Este Data Type armazena informações relacionadas a consultas de CNPJ, incluindo o arquivo PDF da consulta, a data em que a consulta foi realizada e o cliente associado.

## Campos

| Campo             | Tipo   | Obrigatório |
| ----------------- | ------ | ----------- |
| 02. PDF Consulta  | file   | Não         |
| 01. Data consulta | date   | Não         |
| A. Cliente        | custom | Não         |

## Consultas CRO

# Consultas CRO

## Summary

Este Data Type representa informações de consultas, incluindo o arquivo PDF associado, a data da consulta e o cliente.

## Campos

| Campo             | Tipo           | Obrigatório |
| ----------------- | -------------- | ----------- |
| 02. PDF Consulta  | file           | Não         |
| 01. Data consulta | date           | Não         |
| A. Cliente        | custom.cliente | Não         |

## Download_Credenciais

# Download_Credenciais

## Summary

Data type para armazenar informações de download de credenciais, incluindo data (marcada como deletada) e texto.

## Campos

| Campo          | Tipo | Obrigatório |
| -------------- | ---- | ----------- |
| data - deleted | date | Não         |
| data           | text | Não         |
| usuario        | user | Não         |

## Contratos_Dados_Assinante

# Contratos_Dados_Assinante

## Summary

Este Data Type armazena informações de assinantes de contratos, incluindo dados pessoais e de identificação. Foi marcado como deletado.

## Campos

| Campo                     | Tipo                                    | Obrigatório |
| ------------------------- | --------------------------------------- | ----------- |
| A. Contrato               | text                                    | Não         |
| 04. CPF do assinante      | text                                    | Não         |
| 02. Nome do Assinante     | text                                    | Não         |
| 06. Email Comunicação     | text                                    | Não         |
| 05. CNPJ do assinante     | text                                    | Não         |
| 07. Whatsapp Comunicação  | text                                    | Não         |
| Razão Social do Assinante | text                                    | Não         |
| 01. Tipo de Assinante     | Contrato Tipo de Assinante (Option Set) | Não         |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary

Este Data Type define os tipos de envio de link. Foi marcado como deletado e não está mais ativo.

## Campos

| Campo                                                 | Tipo  | Obrigatório |
| ----------------------------------------------------- | ----- | ----------- |
| (Nenhum campo visível pois o Data Type está deletado) | (N/A) | (N/A)       |

## Contratos_Dados_Gerais

# Contratos_Dados_Gerais

## Summary

Este Data Type representa informações gerais de contratos, incluindo datas de início e término. Foi marcado como excluído.

## Campos

| Campo                          | Tipo             | Obrigatório |
| ------------------------------ | ---------------- | ----------- |
| A. Contrato                    | text             | Não         |
| 02. Data de Início             | date             | Não         |
| 03. Data de Término            | date             | Não         |
| 01. Nome do Contrato - deleted | text             | Não         |
| A. Contrato - deleted          | custom.contratos | Não         |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary

Este Data Type define as opções para o tipo de envio de um link. O registro está marcado como excluído.

## Campos

| Campo                                                               | Tipo | Obrigatório |
| ------------------------------------------------------------------- | ---- | ----------- |
| (Nenhum campo visível, pois o Data Type está marcado como excluído) | -    | -           |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary

Este Data Type foi configurado para representar os tipos de envio de links, mas foi marcado como deletado e não possui campos ou opções configuradas.

## Campos

Este Data Type não possui campos configurados.

---

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

---

# Páginas

## reset_pw

# reset_pw

## Summary

Página para redefinição de senha do usuário. Permite ao usuário inserir e confirmar uma nova senha para concluir o processo.

### UI

- **Group Reset Password** (Group) - Container principal da página.
  - **Card Reset Password** (Group) - Grupo que contém os campos de entrada e o botão de redefinição.
    - **Group Form Fields** (Group) - Agrupa os campos de input de senha.
      - **Group Confirm Password Input** (Group) - Contém o label e o campo de confirmação de senha.
        - **Text** (Text) - Label "Confirmar Nova Senha".
        - **Input Confirm Password** (Input) - Campo para o usuário digitar a nova senha pela segunda vez.
      - **Group Password Input** (Group) - Contém o label e o campo de nova senha.
        - **Text** (Text) - Label "Nova Senha".
        - **Input Password** (Input) - Campo para o usuário digitar a nova senha.
    - **Button B** (Button) - Botão para iniciar o processo de redefinição de senha.
  - **Text Header** (Text) - Título da página "Redefinir Senha".

### Workflows

- **Button B Clicked**: ButtonClicked → ResetPassword → ChangePage
  - **ResetPassword**: Define a nova senha e confirmação de senha usando os valores dos campos `Input Password` e `Input Confirm Password`.
  - **ChangePage**: Redireciona o usuário para a página `index`.

### Workflow bTHDJ

# Workflow Resetar Senha e Redirecionar

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta a senha do usuário e, em seguida, redireciona para a página de login.

## Actions

1.  **Reset Password** - Define a nova senha do usuário, comparando os campos "new_password" e "new_password_again".
2.  **Change Page** - Redireciona para a página `index`.

## 404

# 404

## Summary

Esta página exibe uma mensagem de erro 404 quando uma página solicitada não é encontrada. Inclui um título e o corpo da mensagem.

### UI

- **Group text content** (Group) - Contém os elementos de texto para a mensagem de erro.
  - **Text A** (Text) - Título "Oops! 404 error".
  - **Text B** (Text) - Mensagem principal explicando o erro 404 e sugerindo ações.

### Workflows

- **Page is loaded** →
  - Set page title to "Bubble | No-code apps"
  - Display group "Group text content"

## index

# index

## Summary

Esta página é a tela de login da plataforma. Ela contém o logo da aplicação, um título, um subtítulo e campos para entrada de email e senha, além de um botão para submissão.

### UI

- **Group A** (Group) - Contêiner principal da página.
  - **Group B** (Group) - Agrupa o cabeçalho e o corpo do formulário de login.
    - **Group C** (Group) - Agrupa o logo e o título/subtítulo.
      - **Image A** (Image) - Exibe o logo da aplicação.
      - **Group C** (Group) - Agrupa o título e subtítulo de login.
        - **Text A** (Text) - Título "Entrar na Plataforma".
        - **Text A** (Text) - Subtítulo "Acesse sua conta para gerenciar cadastros".
    - **Group D** (Group) - Contêiner principal do formulário de login.
      - **Text C** (Text) - Mensagem de erro "Usuário inativo", visível condicionalmente.
      - **Group D** (Group) - Agrupa o campo de email.
        - **Text B** (Text) - Rótulo "Email".
        - **Input A** (Input) - Campo de entrada para o email do usuário, com placeholder.
      - **Group D** (Group) - Agrupa o campo de senha.
        - **Text B** (Text) - Rótulo "Senha".
        - **Input B** (Input) - Campo de entrada para a senha do usuário, com placeholder.
      - **Button A** (Button) - Botão para submeter o formulário de login.

### Workflows

- **Button A Clicked**:
  - Log the user in com Email: Input Login Email's value and Password: Input Login Password's value
  - Change page para **index**

### LOGIN NA PLATAFORMA

# LOGIN NA PLATAFORMA

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico de login é clicado. Ele verifica as credenciais do usuário, desloga outras sessões, e redireciona para páginas diferentes com base no tipo de credencial do usuário ativo.

## Actions

1.  **LogOutOtherSessions** - Executa o logout de outras sessões se o usuário com o email fornecido e ativo for encontrado.
2.  **Login** - Realiza o login do usuário nas sessões se as credenciais (email e senha) forem válidas e a conta estiver ativa.
3.  **ChangePage** - Redireciona para a página `consultor` se o usuário logado não for super admin e possuir o tipo de credencial `credencial_padrao`.
4.  **ChangePage** - Redireciona para a página `credenciais` se o usuário logado não for super admin e possuir o tipo de credencial `credencial_admin`.
5.  **ChangePage** - Redireciona para a página `super_admin` se o usuário logado for super admin e possuir o tipo de credencial `credencial_padrao`.

### CREDENCIAL INATIVA

# CREDENCIAL INATIVA

**Trigger:** `ButtonClicked` (Elemento: Button)

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele verifica se um usuário específico, com um email correspondente e cuja propriedade `e__ativo__boolean` é falsa, é encontrado. Se o usuário for encontrado, uma ação específica é executada.

## Actions

1. **Show Element** - Exibe o elemento com ID `bTHGP`.

### Workflow bTIyh

# Workflow Salvar Credenciais

**Trigger:** `index ButtonClicked` (Elemento: `Button Salvar Credenciais`)

## Summary

Este workflow é acionado quando o botão "Salvar Credenciais" é clicado na página "index". Sua função principal é ocultar um elemento específico.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTHGP`.

### Workflow bTIzP

# Ocultar Elemento ao Clicar

**Trigger:** `ButtonClicked`

## Summary

Oculta um elemento da interface do usuário quando um botão é clicado.

## Actions

1.  **Ocultar Elemento** - Oculta o elemento com o ID `bTHGa`.

### CREDENCIAL NÃO ENCONTRADA

# CREDENCIAL NÃO ENCONTRADA

**Trigger:** `ButtonClicked`

## Summary

Workflow executado ao clicar em um botão específico na página 'index'. Sua função é exibir um elemento específico na tela, provavelmente um indicador visual ou mensagem de erro para o usuário.

## Actions

1. **ShowElement** - Exibe o elemento com `element_id` `bTHGa`.

---

### Workflow bTMFu

# Esconder Campo de Senha

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem a função de esconder um elemento específico na página.

## Actions

1. **Esconder elemento** - Esconde o elemento com ID "bTMFb" (não foi possível resolver o nome legível com o mapa fornecido).

### ERROS AO LOGAR

# ERROS AO LOGAR

**Trigger:** `OnPageError`

## Summary

Este workflow é acionado quando ocorre um erro em qualquer workflow na página "index". Ele revela um grupo específico para exibir detalhes do erro.

## Actions

1.  **ShowElement** - Revela o elemento com ID `bTMFb`.
2.  **DisplayGroupData** - Exibe os dados da mensagem do erro atual no elemento com ID `bTMFb`.

---

### Workflow bTMZt

# Enviar Email Redefinir Senha + Mostrar Elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow envia um email de redefinição de senha para o usuário. Em seguida, exibe um elemento específico na tela.

## Actions

1.  **SendPasswordResetEmail** - Envia um email com o link de redefinição de senha. O email contém uma mensagem padrão de solicitação e um assunto "Redefinição de Senha".
2.  **ShowElement** - Exibe um elemento na página.

### Workflow bTMaX

**Trigger:** `ButtonClicked`

## Summary

Oculta um elemento da interface do usuário quando um botão específico é clicado.

## Actions

1. **Hide Element** - Oculta o elemento com ID `bTMaE`.

## consultor

# consultor

## Summary

Esta página exibe um painel de controle com estatísticas rápidas, focado em exibir dados de usuários em "Análise" e também dados gerais.

### UI

- **Group** (Page Layout) - Contêiner principal da página.
  - **Group** (Layout) - Grupo de layout para os elementos.
    - **Group** (Layout) - Grupo para títulos e estatísticas.
      - **Text** (Text) - Título "Estatísticas Rápidas".
      - **Group** (Layout) - Grupo que contém os dados numéricos e seus rótulos.
        - **Group** (Layout) - Contêiner para o grupo de status "Em Análise".
          - **Group** (Layout) - Placeholder para elementos adicionais.
            - **Group** (Layout) - Placeholder para elementos adicionais.
              - **Text** (Text) - Rótulo "Em Análise".
              - **Text** (Text) - Campo dinâmico para exibir a contagem de usuários em análise.

### Workflows

Não há workflows definidos para esta página conforme os dados fornecidos.

### Workflow bTHeC

# Workflow Ocultar elemento ao clicar

**Trigger:** `ButtonClicked`

## Summary

Este workflow oculta um elemento específico na página quando um botão é clicado.

## Actions

1.  **Hide Element (bTHKW)**: Oculta o elemento com ID `bTHKW`.

### Workflow bTHeU

# Workflow Esconder Elemento na Tela Consultor

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo esconder um elemento específico na página "consultor".

## Actions

1.  **HideElement** - Esconde o elemento com ID "bTHMB" (não resolvido no mapa).

### Workflow bTHfz

# Ocultar Elemento no Consultor

**Trigger:** `ButtonClicked`

## Summary

Este workflow oculta um elemento específico quando um botão é clicado.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTHKn`.

### Workflow bTInK

# Workflow bTInK

**Trigger:** `LoggedOut`

## Summary

Redireciona usuários não logados para a página de login caso tentem acessar a página "consultor".

## Actions

1.  **Change Page**: Redireciona para a página `reset_pw`.

### GERADOS

# GERADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado, com o objetivo de definir o estado customizado de um elemento para um valor pré-determinado.

## Actions

1.  **Definir estado customizado** - Define o estado customizado `custom.status_` do elemento `bTHHP` para a opção `option.status_cadastro:bTHeg` (referente à opção com valor interno `bTHeg` do option set `status_cadastro`).

---

### ENVIADOS

# ENVIADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow configura o estado customizado `status_` de um elemento para a opção `Cadastrado` do option set `status_cadastro`.

## Actions

1.  **Set custom state `custom.status_` of `bTHHP` to `option.status_cadastro.Cadastrado`**: Define o estado customizado `status_` do elemento `bTHHP` para o valor da opção `Cadastrado` do option set `status_cadastro`.

### ANÁLISE

# ANÁLISE

**Trigger:** `ButtonClicked`

## Summary

Este workflow responde ao clique de um botão, definindo um estado personalizado em um elemento.

## Actions

1. **Set custom state `status_` of element `[consultor]`**: Define o estado personalizado `status_` para a opção correspondente a `status_cadastro.active` (ID: `bTHen`).

### APROVADOS

# APROVADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo definir um custom state em um elemento, possivelmente para filtrar ou exibir dados com base no status de cadastro.

## Actions

1. **Set custom state `custom.status_` on element **** (ID: `bTHHP`)** - Define o custom state `status_` do elemento (`bTHHP`) com o valor da opção `status_cadastro.option_` (ID: `bTHel`).

### REPROVADOS

# REPROVADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo definir o estado personalizado de um elemento para "Reprovado".

## Actions

1. **Definir estado personalizado** - Define o estado personalizado `status_` do elemento `custom.status_` para a opção "Reprovado" do option set `status_cadastro`.

### CORREÇÃO

# CORREÇÃO

**Trigger:** `ButtonClicked`

## Summary

Workflow acionado ao clicar em um botão, com o objetivo de definir um estado personalizado para um elemento.

## Actions

1.  **Set Custom State** - Define o estado personalizado `status_` do elemento `bTHHP` para a opção `option.status_cadastro` com o valor `bTJDk`.

### Workflow bTJMf

# Limpar Dados do Consultor

**Trigger:** `ButtonClicked`

## Summary

Workflow para excluir todos os registros de dados relacionados a clientes, documentos, endereços e logs.

## Actions

1. **DeleteListOfThings** - Exclui todos os registros do tipo `custom._pf__clientes`.
2. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.clientes`.
3. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.cliente`.
4. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.documentos`.
5. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.endere_os`.
6. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.log`.
7. **DeleteListOfThings** - Exclui todos os registros do tipo `custom.log_detalhes`.
8. **REDACTED** - Exibe uma mensagem "Banco de dados limpo com sucesso!".

### Workflow bTMDL

# Workflow bTMDL

**Trigger:** `PageLoaded`

## Summary

Este workflow executa quando a página "consultor" é carregada. Ele remove registros de clientes que expiraram e oculta temporariamente um elemento da UI.

## Actions

1. **Mostrar Elemento (ID: bTMDT)** - Torna um elemento da UI visível.
2. **Apagar Lista de Coisas** - Remove registros do tipo "custom.cliente" que atendem às seguintes condições:
   - `status_cadastro` é igual a `option.status_cadastro.REDACTED` (valor original não revelado).
   - `link_expira_em_date` é menor que a data e hora atuais.
   - `REDACTED` é igual a `false` (valor original não revelado).
3. **Pausar Workflow (Cliente)** - Interrompe a execução do workflow por um breve período.
4. **Ocultar Elemento (ID: bTMDT)** - Torna um elemento da UI invisível.

---

### BTN SHARE LINK

# BTN SHARE LINK

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar no botão "BTN SHARE LINK". Ele cria um novo registro do tipo `custom.cliente` com informações relevantes, incluindo um código de cliente gerado aleatoriamente e um link de acesso expiração.

## Actions

1.  **Show Element** - Exibe o elemento com ID `bTMDT`.
2.  **Create a new thing** - Cria um novo registro do tipo `custom.cliente` com os seguintes campos:
    - `a__c_digo_cliente_text`: String aleatória de 7 dígitos numéricos.
    - `c__colaborador_user`: Usuário atual.
    - `REDACTED`: Opção `status_cadastro` com valor `bTHeg`.
    - `e__nome_tempor_rio_text`: Valor do elemento com ID `bTHMn`.
    - `REDACTED`: Valor do elemento com ID `bTHMt`.
    - `REDACTED`: Valor do elemento com ID `bTHKJ`.
    - `m__data_de_cria__o_do_link_date`: Data e hora atuais.
    - `temp___email_envio_text`: Valor do elemento com ID `bTHMg`.
    - `s__token_gerado_text`: String vazia.
    - `REDACTED`: Valor booleano `false`.
    - `link_expira_em_date`: Data e hora atuais + 48 horas.
    - `celular_temp_text`: Concatenação do valor do elemento com ID `bTPbp`, string vazia, valor do elemento com ID `bTHMZ` e string vazia.
3.  **Change Something About** - Modifica o registro recém-criado do tipo `custom.cliente`:
    - `b__link_de_acesso_text`: Constrói uma URL `https://gestao-contratos-conexao.bubbleapps.io/pre_cadastro?colab=` concatenada com o `_id` do usuário atual, `&cli=`, o `a__c_digo_cliente_text` do novo `custom.cliente`.

### Workflow bTPWy

# Navegar para credenciais

**Trigger:** `ElementClicked` (Element: "Botão Próximo" on page "consultor")

## Summary

Navega para a página de credenciais quando o botão "Botão Próximo" é clicado.

## Actions

1. **Change page** - Redireciona para a página **credenciais**.

### Workflow bTPdE

# Ocultar Elemento Consultor

**Trigger:** `ButtonClicked`

## Summary

Este workflow oculta um elemento na página.

## Actions

1. **Ocultar Elemento** - Oculta o elemento com ID `bTPcT`.

### Workflow bTPeG

# Ir para página Credenciais

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado, com o objetivo de redirecionar o usuário para a página de credenciais.

## Actions

1. **Show Element** - Exibe um elemento específico (ID: `bTPcT`).
2. **Navigate to Page** - Redireciona para a página **credenciais** (ID: `bTHXT`).

### Workflow bTPeM

# Workflow bTPeM

**Trigger:** `ButtonClicked`

## Summary

Este workflow desloga o usuário e o redireciona para a página inicial.

## Actions

1.  **LogOut** - Realiza o logout do usuário.
2.  **ChangePage** - Redireciona para a página **index**.

### Workflow bTPeR

# Workflow bTPeR

**Trigger:** `ButtonClicked` (Elemento: `bTMYS`)

## Summary

Este workflow é acionado quando um botão específico é clicado, com o objetivo de exportar uma lista de solicitações em formato CSV.

## Actions

1.  **Download File with Text** (ID: `bTMZH`) - Cria e disponibiliza um arquivo CSV para download.
    - **File Name:** `solicitacoes.csv`
    - **Text to Download:** Constrói o conteúdo do CSV a partir dos dados do elemento `bTHJU`. O conteúdo é formatado como texto separado por vírgulas, incluindo os campos: `CODIGO`, `NOME`, `STATUS`, `MENSAGEM`. A mensagem de aprovação/reprovação é incluída se houver um comentário.

### Workflow bTPeX

# Redirecionar para Credenciais

**Trigger:** `ButtonClicked`

## Summary

Este workflow redireciona o usuário para a página de credenciais quando um botão específico é clicado.

## Actions

1.  **Change Page** - Redireciona para a página **credenciais**.

### Workflow fe20e4eb-d350-4ef4-9c87-a41db7152b5c

# Workflow fe20e4eb-d350-4ef4-9c87-a41db7152b5c

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele reseta um grupo e o exibe em seguida.

## Actions

1. **Reset Group** - Reseta o grupo com o ID `bTHMB`.
2. **Show Element** - Exibe o grupo com o ID `bTHMB`.

### Workflow fec23d0f-bd70-46c2-8817-0f0fae079708

# Workflow fec23d0f-bd70-46c2-8817-0f0fae079708

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado pelo clique de um botão e tem como objetivo ocultar um elemento específico na página.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTHND` na página `consultor`.

## credenciais

# credenciais

## Summary

Esta página exibe uma lista de usuários com base em filtros de "ativo", "REDACTED" e "super_admin". Possui um layout responsivo com múltiplos layouts de colunas e exibe mensagens de "Não há dados a serem exibidos!" quando a lista está vazia.

### UI

- **Group C** (Group) - Container principal da página.
  - **Group B** (Group) - Container para conteúdo.
    - **Group I** (Group) - Container para estados de carregamento e vazio.
      - **[G] EMPTY** (Group) - Grupo exibido quando não há dados.
        - **Image A** (Image) - Exibe uma imagem quando a lista está vazia.
        - **Text B** (Text) - Exibe a mensagem "Não há dados a serem exibidos!".
      - **Group B** (Group) - Container para exibição de usuários.
        - **REPEATING GROUP (user)** (Repeating Group) - Exibe a lista de usuários.

### Workflows

Não há workflows associados diretamente a esta página no snippet fornecido.

### Workflow bTIwp

# Enviar Credenciais por Email ao Criar Usuário

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Sua função é criar um novo usuário no sistema com base nos dados de entrada, enviar um email de confirmação com as credenciais e limpar os campos do formulário.

## Actions

1.  **Sign Up** - Cria um novo usuário com os seguintes dados:
    - Nome completo: Valor do elemento `01__nome_completo_text`
    - Nome de usuário (REDACTED): Valor do elemento `REDACTED`
    - Status ativo: `true`
    - Super admin: `false`
    - Senha: Valor do elemento `senha_padr_o_text`
    - Email: Valor do elemento `Email input`
    - Password: Valor do elemento `Password input`
2.  **Send Email** - Envia um email com o seguinte conteúdo:
    - Para: Valor do elemento `Email input`
    - Assunto: `Credenciais de Acesso - Plataforma de Cadastro Conexão`
    - Corpo: `Olá, [Nome do usuário]!\n\nSegue sua credencial de acesso para a Plataforma de Cadastros Conexão\n\nE-MAIL: [Email do usuário]\nSENHA: [Senha do usuário]\n\nFicamos à disposição\nEquipe de TI Conexão`
    - Nome do remetente: `CREDENCIAIS`
3.  **Hide Element** - Oculta o elemento `Element Name` (ID: bTHVN).

### Workflow bTJBN

# Workflow bTJBN: Redireciona se E-mail Inativo

**Trigger:** `Page Loaded`

## Summary

Este workflow é executado quando a página "credenciais" é carregada. Ele verifica se o e-mail do usuário atual está inativo. Se estiver, redireciona o usuário para a página "reset_pw".

## Actions

1.  **Change Page** - Redireciona para a página **reset_pw**.
    - Condição: O `Current User` não possui seu campo `e-mail_ativo` (boolean) como `true`.

### Workflow bTJBs

# Workflow bTJBs

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele realiza o logout do usuário e o redireciona para a página inicial.

## Actions

1. **LogOut** - Realiza o logout da sessão do usuário.
2. **ChangePage** - Redireciona o usuário para a página inicial (`index`).

### Workflow bTKPn

# Desativar Campo e(ativo)Boolean

**Trigger:** `ButtonClicked`

## Summary

Este workflow desativa o campo "e_ativo_boolean" em um elemento.

## Actions

1. **Change Thing** - Altera o valor do campo `e__ativo__boolean` para `false` no elemento pai.

### Workflow bTKPx

# Workflow **Salvar status ativo nas credenciais**

**Trigger:** `ButtonClicked` (Elemento ID: bTHUR)

## Summary

Este workflow atualiza o status de um registro de credenciais para "ativo" quando um botão específico é clicado.

## Actions

1.  **Modificar 'Credenciais'** - Define o campo `e__ativo__boolean` como `true` para o registro de credenciais associado ao elemento pai.

### Workflow bTKSC

# Workflow bTKSC

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele reseta um grupo específico e, em seguida, o exibe.

## Actions

1.  **Reset Group** - Reseta o estado do grupo com ID `bTHVN`.
2.  **Show Element** - Exibe o grupo com ID `bTHVN`.

### Workflow bTKSI

# Resetar Grupo Credenciais

**Trigger:** `ButtonClicked`

## Summary

Reseta um grupo de elementos na página de credenciais.

## Actions

1.  **Reset Group** - Reseta o elemento com ID `bTHUk` (resolvido para um grupo na página `credenciais`).

### Workflow bTKTV

# Workflow Credenciais: Resetar Grupo

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta um grupo específico na página de credenciais.

## Actions

1.  **ResetGroup** - Reseta o grupo com ID `bTHUk`.

### Workflow bTLxj

# Redirecionar para Reset de Senha

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado, redirecionando o usuário para a página de redefinição de senha.

## Actions

1.  **ChangePage** - Redireciona o usuário para a página `reset_pw`.

### Workflow bTMWn

# Download Credenciais CSV

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, com o objetivo de gerar e baixar um arquivo CSV contendo credenciais.

## Actions

1.  **Download a file** - Gera um arquivo CSV com o nome "credenciais.csv" e o conteúdo formatado a partir dos dados de um elemento de página (`bTMWz`), separando os campos por quebras de linha. Os campos incluem NOME, EMAIL, WHATSAPP, SETOR, STATUS (formatado como "Ativo" ou "Inativo") e SENHA.
2.  **Create a new thing** - Cria um novo registro do tipo `custom.downloadcredenciais` com os campos `data_text` (data e hora atual formatada) e `usuario_user` (usuário atual).

## cadastro

# cadastro

## Summary

Página para cadastro de informações, com funcionalidades para upload e visualização de documentos.

### UI

- **Group X** (Group) - Container principal para a lógica de documentos.
  - **Group Y** (Group) - Exibe ícones de visualização e download após o envio do documento.
    - **Button A** (Button) - Botão para visualizar o CRO FRENTE.
    - **Button D** (Button) - Botão para baixar o CRO FRENTE.
  - **Group HZZ** (Group) - Exibe mensagem caso o documento não seja enviado.
    - **Text Element** (Text) - Mensagem indicando que o documento não foi enviado.

### Workflows

Não há workflows definidos diretamente nesta página que não estejam associados a elementos específicos (como botões ou grupos). A lógica principal reside nas propriedades e estados dos elementos.

### Workflow bTIGb

# Workflow bTIGb

**Trigger:** `ButtonClicked`

## Summary

Atualiza o estado customizado `nav_pf_` com o valor 2 e rola a página para o elemento `bTIxd` ao clicar em um botão.

## Actions

1.  **SetCustomState** - Define o estado customizado `nav_pf_` do elemento `bTIxd` com o valor `2`.
2.  **ScrollToElement** - Rola a página até o elemento `bTIxd`.

### Workflow bTIHF

# Preencher Dados do Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado na página de cadastro. Ele oculta um elemento específico e, dependendo do tipo de cadastro, atualiza os dados de um "Thing" com informações preenchidas em diversos campos de entrada.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTJIP`.
2.  **Change Thing** - Atualiza um "Thing" se o tipo de cadastro for "bTHEv". As seguintes modificações são feitas:
    - `01__nome_completo_text` é preenchido com o valor do elemento `bTIyN`.
    - `02__n_mero_do_cro_text` é preenchido com o valor do elemento `bTIyn`.
    - Um campo de chave "REDACTED" é preenchido com o valor do elemento `bTIyf`.
    - `03__n_mero_de_cpf_text` é preenchido com o valor do elemento `bTIyt`.
    - `04__telefone_fixo_text` é preenchido com o valor do elemento `bTIxk`.
    - `05__whatsapp_text` é preenchido com o valor do elemento `bTIxr`.
    - `05b__celular_02_text` é preenchido com o valor do elemento `bTIyB`.
    - `06__e_mail_text` é preenchido com o valor do elemento `bTIyH`.
    - `07__email_de_nf_text` é preenchido com o valor do elemento `bTIyT`.
3.  **Change Thing** - Atualiza um "Thing" se o tipo de cadastro for "bTHEz".

_(Nota: A documentação do último action (action 2) está incompleta no JSON fornecido, impossibilitando a descrição completa de suas ações.)_

### Workflow bTIHN

# Workflow bTIHN

**Trigger:** `ButtonClicked`

## Summary

Este workflow configura um estado customizado em um elemento e, em seguida, rola a página para esse mesmo elemento.

## Actions

1.  **SetCustomState** - Define o estado customizado `nav_pf_` do elemento `bTIxd` para o valor `3`.
2.  **ScrollToElement** - Rola a página para o elemento `bTIxd`.

### Workflow bTIHY

# Workflow bTIHY

**Trigger:** `ButtonClicked` (Elemento: não especificado no mapa de referências, refere-se ao elemento que disparou o workflow)

## Summary

Este workflow atualiza um estado customizado e rola para um elemento específico na página 'cadastro'.

## Actions

1.  **Definir Estado Customizado** - Define o estado customizado `custom.nav_pf_` do elemento `bTIxd` para o valor `1`.
2.  **Rolar para Elemento** - Rola a página para o elemento `bTIxd`.

### BTN REVISAR

# BTN REVISAR

**Trigger:** `ButtonClicked`

## Summary

Atualiza o status de um cadastro e exibe um grupo de elementos relacionado.

## Actions

1. **Change Thing** - Altera o campo associado a 'status_cadastro' para a opção 'value' (sem nome disponível).
2. **Display Group Data** - Exibe os dados do grupo de elementos com ID `bTJIP`.
3. **Show Element** - Mostra o elemento com ID `bTJIP`.
4. **Set Custom State** - Define o estado customizado 'nav_pf_' do elemento com ID `bTIxd` para o valor 1.

### Workflow bTIPQ

# Ocultar elemento ao clicar botão

**Trigger:** `ButtonClicked`

## Summary

Este workflow oculta um elemento específico ao clicar em um botão.

## Actions

1. **Hide Element** - Oculta o elemento com ID `bTJWP`.

### Workflow bTIPc

# Workflow Exibir Grupo e Elemento

**Trigger:** `ButtonClicked`

## Summary

Exibe um grupo de dados e um elemento específico na página de cadastro.

## Actions

1.  **Exibir grupo de dados** - Exibe dados do grupo pai do elemento `bTJWP`.
2.  **Mostrar elemento** - Exibe o elemento `bTJWP`.

### Workflow bTIQB

# Exibir Formulário de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão, exibindo um grupo de elementos e tornando-o visível.

## Actions

1.  **DisplayGroupData** - Exibe os dados do grupo pai (referenciado por `bTJWP`).
2.  **ShowElement** - Torna visível o elemento com ID `bTJWP`.

### Workflow bTIQM

# Exibir/Mostrar Grupo de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado pelo clique de um botão e tem como objetivo exibir um grupo específico e seu conteúdo na página de cadastro.

## Actions

1.  **DisplayGroupData** - Exibe dados do grupo pai (`ElementParent`) com ID `bTJWP`.
2.  **ShowElement** - Torna visível o elemento com ID `bTJWP`.

### Workflow bTIQX

# Mostrar grupo de cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão específico (não especificado no mapa de referências). Sua finalidade é exibir informações de um grupo de elementos e mostrar um elemento específico, ambos vinculados ao elemento que disparou o clique.

## Actions

1.  **DisplayGroupData** - Exibe os dados do grupo pai do elemento clicado.
2.  **ShowElement** - Torna visível um elemento específico, vinculado ao elemento clicado.

### Workflow bTIQf

# Exibir Grupo e Elemento de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele tem como objetivo exibir um grupo de dados e um elemento específico na página de cadastro.

## Actions

1.  **DisplayGroupData**: Exibe os dados do elemento pai na página `cadastro`.
2.  **ShowElement**: Torna visível o elemento `bTJWP` na página `cadastro`.

### Workflow bTIQq

# Exibir Área de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão, revelando uma área específica da página e exibindo dados relacionados a ela.

## Actions

1.  **Exibir dados do grupo (Display Group Data)** - Exibe os dados do elemento pai (identificado por `bTJWP`).
2.  **Mostrar elemento (Show Element)** - Torna visível o elemento `bTJWP`.

### Workflow bTIRB

# {Nome Descritivo Aqui}

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele exibe um grupo de elementos associado a este botão e o torna visível.

## Actions

1. **Exibir dados do grupo** - Exibe os dados do grupo pai.
2. **Mostrar elemento** - Torna o grupo visível ou oculto.

### Workflow bTIRJ

# Workflow bTIRJ

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão na página "cadastro". Ele exibe dados em um grupo de elementos e, em seguida, torna esse grupo visível.

## Actions

1.  **DisplayGroupData** - Exibe dados no grupo de elementos com ID `bTJWP`.
2.  **ShowElement** - Mostra o grupo de elementos com ID `bTJWP`.

### Workflow bTIRU

# Workflow Exibir e Ativar Grupo de Input

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo exibir um grupo específico e ativar seus elementos de input.

## Actions

1.  **DisplayGroupData** - Exibe os dados do grupo pai do elemento "bTJWP".
2.  **ShowElement** - Exibe o elemento "bTJWP".

### Workflow bTIRz

# Workflow Esconder Elemento Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo esconder um elemento específico na página.

## Actions

1.  **Esconder Elemento** - Esconde o elemento com ID `bTJYM` na página `cadastro`.

### BAIXAR - CRO V

# BAIXAR - CRO V

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo gerar um arquivo com informações específicas.

## Actions

1.  **Salva um elemento em um arquivo:** Cria e disponibiliza um arquivo para download.
    - **Nome do arquivo:** "CRO\_V\_" + (se `tipo_de_cadastro` é "bTHEv", então retorna o valor de `get_group_data` de `bTJIP` formatado com `01__nome_completo_text`, caso contrário, retorna o valor de `get_group_data` de `bTJIP` formatado com `01__nome_completo_text`) + "\_" + "file\_name" + "_" + (retorna o `ElementParent` do elemento pai) + ""
    - **Destino do elemento:** `ElementParent` do elemento pai.
2.  **Mostrar elemento:** Exibe o elemento com ID `bTJYM`.

### BAIXAR - CNH F PROP

# BAIXAR - CNH F PROP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado com o objetivo de baixar o arquivo da CNH do proprietário. Ele constrói um nome de arquivo dinâmico e exibe um elemento específico.

## Actions

1. **REDACTED** - Constrói uma string para o nome do arquivo, combinando "CNH_F_Proprietário_", o valor formatado de uma propriedade booleana baseada na opção de 'tipo_de_cadastro' igual a 'bTHEv', o primeiro nome completo do usuário (obtido do grupo de elementos 'bTJIP') e o nome do elemento pai.
2. **ShowElement** - Exibe o elemento com ID 'bTJYM'.

---

### BAIXAR - CNH V PROP

# BAIXAR - CNH V PROP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado e é responsável por iniciar o processo de download de um arquivo, definindo seu nome com base em dados dinâmicos.

## Actions

1.  **Redireciona para Página** - `//(REDACTED)` - **REDACTED** - O nome do arquivo para download é construído dinamicamente com base no tipo de cadastro, no nome completo do usuário e no nome do elemento pai, concatenando strings fixas e valores dinâmicos. O padrão é "CNH_V_Proprietário_ [TipoCadastro] _ [NomeCompleto] _ [NomeElementoPai]".
2.  **Exibe Elemento** - Exibe o elemento com o ID `bTJYM`.

---

### BAIXAR - CNH F TECN

# BAIXAR - CNH F TECN

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão. Ele constrói um nome de arquivo combinando texto estático, a opção "Técnico" do option set "tipo_de_cadastro", e o nome do usuário (obtido de um elemento), com o objetivo aparente de agrupar ou nomear um arquivo para download.

## Actions

1.  **Create a unique ID** - Cria um ID para o arquivo.
2.  **Show Element** - Exibe o elemento com ID `bTJYM`.

---

### BAIXAR - CNH V TECN

# BAIXAR - CNH V TECN

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado, com o objetivo de iniciar o download de um arquivo. Ele constrói dinamicamente o nome do arquivo, combinando um prefixo estático com dados do usuário e, em seguida, exibe uma janela de upload.

## Actions

1. **Download File** - Constrói o nome do arquivo combinando "CNH_V_Técnico_", o valor de uma opção específica do set de opções "tipo_de_cadastro" (valor: `bTHEv`), e o nome do arquivo proveniente do grupo de elementos "bTJIP". Em seguida, exibe a janela de upload (`bTJYM`).
2. **Show Element** - Exibe a janela de upload com o ID `bTJYM`.

### BAIXAR - CONTRATO SOCIAL

# BAIXAR - CONTRATO SOCIAL

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo gerar um nome de arquivo para download, seguido por uma ação para exibir um elemento.

## Actions

1.  **REDACTED** - Constrói uma string combinando múltiplos valores: "Contrato_Social_", o valor da opção "Pessoa Jurídica" do option set "tipo_de_cadastro", um underscore, o nome do arquivo retornado por `file_name`, e uma string vazia. Essa string resultante possivelmente forma o nome do arquivo a ser baixado.
2.  **Show Element** - Exibe um elemento com o ID "bTJYM".

### BAIXAR - DECLARAÇÃO

# BAIXAR - DECLARAÇÃO

**Trigger:** `Button CLIQUE`

## Summary

Este workflow é acionado quando um botão é clicado, iniciando o processo de download de um arquivo ("Declaração").

## Actions

1.  **Download file** - Constrói o nome do arquivo combinando o texto "Declaração_Serviço_", o valor de uma opção do option set "tipo_de_cadastro" e dados de um elemento específico (possivelmente um grupo com ID "bTJIP"). Em seguida, baixa o arquivo gerado.
2.  **Show Element** - Exibe um elemento com o ID "bTJYM".

### BAIXAR - COMP END

# BAIXAR - COMP END

**Trigger:** `ButtonClicked`

## Summary

Este workflow aciona a exibição de um elemento pop-up para download de comprovante, utilizando uma construção de nome de arquivo dinâmico.

## Actions

1.  **REDACTED** - Constrói dinamicamente o nome do arquivo para o comprovante de endereço, combinando o prefixo "Comprovante_Endereço_", o valor do option set "tipo_de_cadastro" (opção `bTHEv`), e um nome de elemento (`bTJIP`) formatado condicionalmente.
2.  **Show Element** - Exibe o elemento pop-up com o ID `bTJYM`.

### BTN APROVAR

# BTN APROVAR

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar no botão "BTN APROVAR". Ele oculta um elemento e atualiza o registro de um "Thing" no banco de dados, modificando campos como "nome_cliente_text", "status_cadastro" e "l__c_digo_cliente_text", além de definir a data de finalização.

## Actions

1.  **Hide Element**: Oculta o elemento com ID `bTJXi`.
2.  **Change Thing**: Atualiza o registro do "Thing" com as seguintes modificações:
    - `nome_cliente_text` é definido com base na comparação entre o valor do option set `option.tipo_de_cadastro` (opção `bTHEv`) e o valor gerado por `format_boolean` (que utiliza o próprio `option.tipo_de_cadastro` e uma mensagem `01__nome_completo_text`).
    - `REDACTED` é atualizado com o valor do option set `option.status_cadastro` (opção `bTHel`).
    - `l__c_digo_cliente_text` é definido com o valor obtido do elemento com ID `bTJXn`.
    - `n__data_de_finaliza__o_date` é definido como a data e hora atuais (`Current Date/Time`).
    - Um segundo campo `l__c_digo_cliente_text` é atualizado com o valor obtido do elemento com ID `bTJXn`.
3.  **API Call**: Executa uma chamada de API com o nome `Atualizar_Cadastro_Completo`.
    - **Body Params**:
      - `nome_cliente`: Definido com base na comparação entre o valor do option set `option.tipo_de_cadastro` (opção `bTHEv`) e o valor gerado por `format_boolean` (que utiliza o próprio `option.tipo_de_cadastro` e uma mensagem `01__nome_completo_text`).

---

### BTN VISUALIZAR

# BTN VISUALIZAR

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão, com o objetivo de exibir um grupo de elementos, mostrar um elemento específico e definir um estado customizado.

## Actions

1.  **Exibir dados do grupo** - Exibe os dados do grupo pai.
2.  **Mostrar elemento** - Mostra um elemento.
3.  **Definir estado customizado** - Define o estado customizado `custom.nav_pf_` para o valor 1.

### Workflow bTIWM

# Workflow bTIWM

**Trigger:** `ButtonClicked` (Ocorrendo em um elemento com ID: `bTJFL` na página `cadastro`)

## Summary

Este workflow é acionado quando um botão é clicado. Sua principal função é ocultar um elemento específico na página.

## Actions

1.  **Esconder Elemento** - Oculta o elemento com ID `bTJIP`.

### ENVIADOS

# ENVIADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo definir um estado customizado em um elemento.

## Actions

1.  **Set custom state** - Define o estado customizado "custom.status_" do elemento com ID `bTIxd` para o valor da opção `status_cadastro.sending` (valor: `bTHeh`).

### ANÁLISE

# ANÁLISE

**Trigger:** `ButtonClicked`

## Summary

Workflow para alterar o estado customizado de um elemento ao clicar em um botão.

## Actions

1.  **Definir estado customizado `custom.status_` do elemento `bTIxd`** - Define o valor do estado customizado como a opção `bTHen` do Option Set `status_cadastro`.

---

### APROVADOS

# Workflow APROVADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo definir o estado customizado `custom.status_` para a opção `status_cadastro` do option set `option.status_cadastro`.

## Actions

1. **Definir estado customizado** - Define o estado customizado `custom.status_` do elemento `bTIxd` para `option.status_cadastro` (valor `Aprovado`).

---

### REPROVADOS

# REPROVADOS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, definindo o estado personalizado `custom.status_` de um elemento para a opção `REPROVADO` do Option Set `status_cadastro`.

## Actions

1.  **SetCustomState** - Define o estado personalizado `custom.status_` do elemento `bTIxd` para a opção `REPROVADO` do Option Set `status_cadastro`.

---

### Workflow bTJAr

# Workflow bTJAr

**Trigger:** `ButtonClicked` (Elemento: não especificado no JSON, mas disparado por um botão na página `cadastro`)

## Summary

Este workflow realiza o logout do usuário e o redireciona para a página inicial (index).

## Actions

1.  **LogOut** - Desconecta o usuário da sessão atual.
2.  **ChangePage** - Redireciona para a página `index`.

### Workflow bTJBC

# Workflow Redirecionar deslogado para login

**Trigger:** `LoggedOut`

## Summary

Redireciona usuários deslogados da página de cadastro para a página de login.

## Actions

1.  **Change page** - Redireciona para a página **reset_pw**.

### Workflow bTJCX

# Workflow Salvar Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e oculta um elemento específico na página.

## Actions

1.  **Hide Element**: Oculta o elemento com ID `bTJXE`.

### REPROVAÇÃO PF 01

# REPROVAÇÃO PF 01

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo resetar um grupo, exibir dados, definir um estado customizado e mostrar um elemento específico, provavelmente relacionado à reprovação de uma ação no formulário de cadastro.

## Actions

1.  **Reset Group** - Reseta o grupo com ID `bTJXE`.
2.  **Display Group Data** - Exibe dados do grupo pai no grupo com ID `bTJXE`.
3.  **Set Custom State** - Define o estado customizado `custom.corrigir___reprovar_` para o valor `2` no elemento com ID `bTIxd`.
4.  **Show Element** - Exibe o elemento com ID `bTJXE`.

### CORREÇÃO PF 01

# CORREÇÃO PF 01

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo redefinir um grupo, exibir seus dados, definir um estado customizado e, finalmente, mostrar o grupo.

## Actions

1. **Redefinir grupo (bTJXE)** - Restaura o estado padrão do grupo.
2. **Exibir dados do grupo (bTJXE)** - Carrega e exibe os dados no grupo especificado.
3. **Definir estado customizado `custom.corrigir___reprovar_` para `1` em `bTIxd`** - Define o valor do estado customizado do elemento `bTIxd`.
4. **Mostrar elemento (bTJXE)** - Torna o grupo especificado visível.

### CORREÇÃO

# CORREÇÃO

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo definir um estado customizado em um elemento.

## Actions

1.  **Set state of an element** - Define o estado customizado `status_` do elemento com ID `bTIxd` para a opção `option.status_cadastro` → `option.status_cadastro` com o valor `bTJDk`.

### REPROVAÇÃO PF 02

# REPROVAÇÃO PF 02

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo reprovar um cadastro, atualizar seu status, registrar a data de finalização e notificar o cliente e o consultor sobre a reprovação.

## Actions

1.  **Hide Element** - Esconde o elemento com `element_id` `bTJXE`.
2.  **Display Group Data** - Exibe dados do grupo com `element_id` `bTJXV`.
3.  **Show Element** - Mostra o elemento com `element_id` `bTJXV`.
4.  **Change Thing** - Modifica o registro atual:
    - Define o campo `REDACTED` para a opção `bTHem` do `option.status_cadastro`.
    - Define o campo `i__coment_rio_reprova__o_text` com o valor do elemento com `element_id` `bTJXJ`.
    - Define o campo `n__data_de_finaliza__o_date` para a data e hora atuais.
5.  **Make an API Call** - Executa a chamada de API `apiconnector2-bTPfN.bTPil` com os seguintes parâmetros:
    - `nome_cliente`: Formata o nome do cliente com base na comparação do tipo de cadastro.
    - `nome_consultor`: Obtém o nome completo do consultor do passo anterior.
    - `quem_solicitou`: Define como o usuário atual.
    - `data_solicitacao`: Formata a data e hora atuais para "dddd - dd/mm/yyyy às HHhMMm".
    - `motivo_reprovacao`: Obtém o valor do elemento com `element_id` `bTJXJ`.

### CORREÇÃO PF 02

# CORREÇÃO PF 02

**Trigger:** `ButtonClicked`

## Summary

Workflow que atualiza o status de um registro para reprovado, oculta um grupo de elementos, exibe outro grupo, e envia emails com informações de correção para o cliente e o consultor.

## Actions

1.  **HideElement** - Oculta o elemento **ID: bTJXE**.
2.  **DisplayGroupData** - Exibe os dados do elemento pai.
3.  **ShowElement** - Exibe o elemento **ID: bTJXV**.
4.  **ChangeThing** - Atualiza o registro:
    - Define o campo `status_cadastro` para a opção `REPROVADO` do Option Set `status_cadastro`.
    - Define o campo `motivo_correcao` com o valor do elemento **ID: bTJXJ** (comentário de reprovação).
5.  **EMAILS - email_correcao_magali** - Chama a API Connector chamada `email_correcao_magali` com os seguintes parâmetros:
    - `nome_cliente`: Nome completo do cliente.
    - `link_correcao`: Valor do elemento `b__link_de_acesso_text`.
    - `nome_consultor`: Nome completo do colaborador (usuário atual).
    - `quem_solicitou`: Nome completo do usuário atual.
    - `motivo_correcao`: Valor do elemento **ID: bTJXJ** (comentário de reprovação).
    - `data_solicitacao`: Data e hora atual formatada como "Dia da Semana - DD/MM/AAAA às HHhMMm".

### Workflow bTJGw

# Esconder Botão de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow esconde um elemento do tipo botão quando ele é clicado.

## Actions

1. **Hide Element** - Esconde o elemento com ID `bTJXV`.

### Workflow bTJJN

# Mostrar Grupo de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow exibe um grupo de elementos no formulário de cadastro e mostra um elemento específico.

## Actions

1.  **Exibir dados do grupo** - Mostra elementos dentro de um grupo de dados na página.
2.  **Mostrar elemento** - Torna um elemento específico visível.

### Workflow bTKWD

# Cadastro - Resetar Grupo

**Trigger:** `ButtonClicked`

## Summary

Reseta um grupo específico dentro da página de cadastro.

## Actions

1. **Reset Group** - Reseta o grupo com ID `bTJPF`.

---

### Workflow bTKaN

# Workflow Botão Cadastrar Solicitar Cadastro

**Trigger:** `ButtonClicked` (Elemento: [Botão Cadastrar](https://manual.bubble.io/core-manual/design-mode/elements/buttons))

## Summary

Este workflow é acionado quando o botão "Cadastrar" é clicado. Ele define dois estados personalizados: "tipo_de_ação_" para "solicitar_cadastro" e "_filtro_status_" para "cadastro_em_análise".

## Actions

1. **Set custom state** `tipo_de_a__o_` to `option.tipo_de_a__o_do_cliente` = `solicitar_cadastro`
2. **Set custom state** `_filtro__status_` to `option.status_cadastro` = `cadastro_em_análise`

### Workflow bTKaf

# Workflow bTKaf

**Trigger:** ButtonClicked

## Summary

Este workflow atualiza os estados customizados de um elemento quando um botão é clicado. Executa a primeira ação de definir o estado customizado `custom.tipo_de_a__o_` com um valor de Option Set específico e a segunda ação de definir o estado customizado `custom._filtro__status_` com outro valor de Option Set.

## Actions

1.  **SetCustomState** - Define o estado customizado `custom.tipo_de_a__o_` do elemento `bTIxd` (assumindo que este é um elemento de UI que possui este estado customizado) para a opção `solicitar_cadastro` do Option Set `tipo_de_a__o_do_cliente`.
2.  **SetCustomState** - Define o estado customizado `custom._filtro__status_` do mesmo elemento (`bTIxd`) para a opção `cadastro_em_corre__o` do Option Set `status_cadastro`.

### Workflow bTKaq

# Workflow bTKaq

**Trigger:** `ButtonClicked`

## Summary

Este workflow é disparado ao clicar em um botão e tem o objetivo de definir estados customizados no elemento "state.tipo_de_a__o_" e "state._filtro__status_".

## Actions

1.  **Set Custom State** - Define o estado customizado "state.tipo_de_a__o_" do elemento "state.tipo_de_a__o_" com o valor "solicitar_cadastro" (Option Set: tipo_de_a__o_do_cliente).
2.  **Set Custom State** - Define o estado customizado "state._filtro__status_" do elemento "state.tipo_de_a__o_" com o valor "cadastro_reprovado" (Option Set: status_cadastro).

### Workflow bTKbB

# Workflow bTKbB

**Trigger:** `ButtonClicked`

## Summary

Configura estados customizados para um input de lista, provavelmente para filtrar ou categorizar ações do cliente.

## Actions

1.  **SetCustomState** - Define o estado customizado `tipo_de_a__o_` para `solicitar_cadastro` e `_filtro__status_` para `cadastro_aprovado`.

### Workflow bTKbV

# Workflow bTKbV - Limpar Filtros e Status do Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta os estados customizados "filtro__status_" e "tipo_de_a__o_" ao serem acionados pelo clique de um botão na página de cadastro.

## Actions

1.  **SetCustomState** - Define o estado customizado `custom._filtro__status_` para vazio.
2.  **SetCustomState** - Define o estado customizado `custom.tipo_de_a__o_` para vazio.

### Workflow bTKbn

# Limpar Filtro Status Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow limpa o estado customizado `_filtro__status_` e também o estado customizado `tipo_de_a__o_`.

## Actions

1.  **SetCustomState**: Define o estado customizado `_filtro__status_` para vazio.
2.  **SetCustomState**: Define o estado customizado `tipo_de_a__o_` para vazio.

### Workflow bTKbt

# Workflow bTKbt

**Trigger:** `Button Clicked` (Elemento: `Botão Confirmar Presença`)

## Summary

Este workflow atualiza o estado customizado de um elemento e define um valor de custom state, possivelmente relacionado à lógica de atualização de cadastro.

## Actions

1.  **Set Custom State** - Define o estado customizado `tipo_de_ação_` do elemento `Botão Confirmar Presença` com o valor `atualizar_cadastro` do Option Set `tipo_de_ação_do_cliente`.
2.  **Set Custom State** - Define o estado customizado `_filtro_status_` do elemento `Botão Confirmar Presença` com o valor `cadastro_em_análise` do Option Set `status_cadastro`.

### Workflow bTKcE

# Salvar Estado Cadastro Correção

**Trigger:** `ButtonClicked` (Elemento: Elemento 'Botão Salvar' - Id: bTJQJ)

## Summary

Este workflow é acionado quando o botão "Salvar" é clicado na página de cadastro. Ele define estados personalizados relacionados ao tipo de ação e ao status do cadastro.

## Actions

1.  **Definir Estado Personalizado** (`custom.tipo_de_a__o_`): Define o estado `tipo_de_a__o_` com o valor "atualizar_cadastro" do option set `tipo_de_a__o_do_cliente`.
2.  **Definir Estado Personalizado** (`custom._filtro__status_`): Define o estado `_filtro__status_` com o valor "cadastro_em_corre__o" do option set `status_cadastro`.

### Workflow bTKcP

# Workflow Atualizar Cadastro Cliente

**Trigger:** `ButtonClicked` (do elemento com ID bTIxd)

## Summary

Este workflow é acionado quando um botão é clicado. Ele define o estado personalizado `tipo_de_a__o_` com o valor `atualizar_cadastro` e o estado personalizado `_filtro__status_` com o valor `cadastro_reprovado`.

## Actions

1.  **Definir Estado Personalizado**: Define o estado personalizado `tipo_de_a__o_` para `atualizar_cadastro` (Option Set `tipo_de_a__o_do_cliente`).
2.  **Definir Estado Personalizado**: Define o estado personalizado `_filtro__status_` para `cadastro_reprovado` (Option Set `status_cadastro`).

### Workflow bTKcX

# Workflow bTKcX (Cadastro)

**Trigger:** `Button Clicked` (Botão Clicado)

## Summary

Este workflow atualiza o estado personalizado de um elemento ao clicar em um botão.

## Actions

1.  **Set Custom State** - Define o estado personalizado `tipo_de_a__o_` do elemento `custom.tipo_de_a__o_` (referente à opção `atualizar_cadastro` do Option Set `tipo_de_a__o_do_cliente`). Ao mesmo tempo, define o estado personalizado `_filtro__status_` do elemento `custom._filtro__status_` com a opção `cadastro_aprovado` do Option Set `status_cadastro`.

### Workflow bTKeh

```markdown
# Workflow Salvar Dados Cadastro

**Trigger:** `ButtonClicked` (ao clicar no botão com ID "bTJTO" na página "cadastro")

## Summary

Este workflow salva os dados inseridos no formulário de cadastro e exibe o grupo de dados correspondente.

## Actions

1. **DisplayGroupData** - Exibe os dados do grupo pai (origem dos dados do formulário).
2. **ShowElement** - Exibe o elemento com ID "bTJTO" (provavelmente um botão de confirmação ou próximo passo).
```

### Workflow bTKiE

# Esconder Elemento Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e sua principal função é esconder um elemento específico na página de cadastro.

## Actions

1.  **Hide Element** - Esconde o elemento com `element_id`: `bTJTO`.

### Workflow bTKiQ

# Mudar Estado Menu Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow gerencia a interação do menu de cadastro, alterando o estado customizado de um elemento, a sua visibilidade e a página exibida.

## Actions

1. **ShowElement** - Exibe o elemento com ID `bTJYF`.
2. **SetCustomState** - Define o estado customizado `custom.menu_setor_cadastro_` do elemento com ID `bTIxd` para a opção `menu_setor_cadastro` do option set `menu_setor_cadastro`.
3. **ScrollToElement** - Rola até o elemento com ID `bTIxd`.
4. **HideElement** - Oculta o elemento com ID `bTJYF`.
5. **ChangePage** - Redireciona para a página **cadastro**.

### Workflow bTKii

# Inicializar Opções de Cadastro

**Trigger:** `PageLoaded`

## Summary

Este workflow, acionado ao carregar a página "cadastro", inicializa estados customizados relacionados a menus e status de cadastro.

## Actions

1.  **Set custom state `custom.menu_setor_cadastro_`** - Define o estado customizado `custom.menu_setor_cadastro_` do elemento `custom.menu_setor_cadastro_` com a opção `menu_setor_cadastro : 132`. Define o estado customizado `custom.status_` com a opção `status_cadastro : 123`.

### Workflow bTKit

# Workflow bTKit

**Trigger:** `ButtonClicked` (do elemento com ID `bTJYF`)

## Summary

Este workflow gerencia a interação do usuário com um menu de navegação na página de cadastro, controlando a visibilidade de elementos, definindo um estado customizado e rolando a página para o elemento selecionado.

## Actions

1.  **Show Element** (`bTJYF`) - Torna o elemento com ID `bTJYF` visível.
2.  **Set State** (`custom.menu_setor_cadastro_`) para `option.menu_setor_cadastro` (valor `bTKiK`) - Define o estado customizado `menu_setor_cadastro_` do elemento com ID `bTIxd` como a opção `bTKiK` do option set `menu_setor_cadastro`.
3.  **Scroll to Element** (`bTIxd`) - Rola a página até o elemento com ID `bTIxd`.
4.  **Hide Element** (`bTJYF`) - Torna o elemento com ID `bTJYF` invisível.
5.  **Change Page** para a página **cadastro** (`bTJhY`) - Redireciona o usuário para a página `cadastro`.

### SOLICITAÇÕES

# SOLICITAÇÕES

**Trigger:** `PageLoaded`

## Summary

Workflow acionado ao carregar a página de cadastro, com o objetivo de inicializar um estado customizado referente a solicitações.

## Actions

1.  **Definir Estado Customizado** (`SetCustomState`): Define o estado customizado `custom.solicita__es_` do elemento com ID `bTIxd` para o resultado de uma busca por `custom.cliente`, ignorando restrições vazias.

---

### Workflow bTKkC

# Exibir Menu Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão, responsável por exibir e gerenciar a visibilidade de elementos relacionados a um menu de cadastro, além de rolar a página para um elemento específico.

## Actions

1.  **Show Element** - Exibe o elemento com ID `bTJYF`.
2.  **Set Custom State** - Define o estado customizado `custom.menu_setor_cadastro_` do elemento com ID `bTIxd` para a opção `menu_setor_cadastro` do option set `menu_setor_cadastro`.
3.  **Scroll to Element** - Rola a página para o elemento com ID `bTIxd`.
4.  **Hide Element** - Oculta o elemento com ID `bTJYF`.
5.  **Change Page** - Redireciona o usuário para a página **cadastro**.

### Workflow bTKoc

# Atualizar Navegação Cadastro

**Trigger:** `ButtonClicked`

## Summary

Atualiza um estado customizado e rola para um elemento específico na página de cadastro.

## Actions

1.  **Set Custom State** - Define o estado customizado `custom.nav_pf_` do elemento com ID `bTIxd` para o valor `2`.
2.  **Scroll to Element** - Rola até o elemento com ID `bTIxd`.

### Workflow bTKon

# Workflow bTKon

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, executando a ação de esconder um elemento e rolar a tela para outro elemento específico na página de cadastro.

## Actions

1.  **HideElement** - Esconde o elemento com ID `bTJIP`.
2.  **ScrollToElement** - Rola a tela até o elemento com ID `bTIxd`.

### [BTN] Ir para 02

# [BTN] Ir para 02

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado, com o objetivo de mudar o estado customizado de um elemento e rolar a página para ele.

## Actions

1.  **SetCustomState** - Define o estado customizado `custom.nav_pf_` do elemento `bTIxd` para o valor `2`.
2.  **ScrollToElement** - Rola a página para o elemento `bTIxd`.

### Workflow bTKpR

# Esconder e Rolar Elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow esconde um elemento e rola a tela para outro elemento quando um botão específico é clicado.

## Actions

1.  **HideElement** - Esconde o elemento com ID `bTJIP`.
2.  **ScrollToElement** - Rola a tela para o elemento com ID `bTIxd`.

### Workflow bTKqI

# Salvar cadastro e fechar modal

**Trigger:** `Button - Salvar` (Elemento "Button Salvar" na página "cadastro")

## Summary

Este workflow é acionado ao clicar no botão "Salvar" e tem como objetivo ocultar um elemento específico, provavelmente um modal ou pop-up, após a ação de salvar ser concluída por outro processo (não detalhado aqui).

## Actions

1.  **Ocultar elemento** - Oculta o elemento com o ID `bTJXi` (provavelmente um modal de confirmação ou feedback).

### Workflow bTKuR

# Cadastro - Atualizar Cliente E Chamar API

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão na página de cadastro. Ele atualiza um registro de cliente no banco de dados, busca dados de uma API e exibe essas informações, com uma pausa antes de ocultar um elemento.

## Actions

1.  **ShowElement** - Mostra um elemento com ID `bTJYF`.
2.  **ChangeThing** - Altera o campo `p__consulta_realizada__boolean` para `true` no item de dados `custom.cliente` que corresponde ao `CLIENTE` passado como parâmetro na URL.
3.  **apiconnector2-bTIwu.bTIwz** - Chama a API `apiconnector2-bTIwu.bTIwz` com o parâmetro `url_params_CNPJ` obtendo o valor do elemento com ID `bTJMZ`.
4.  **DisplayGroupData** - Exibe os dados provenientes do passo anterior (chamada de API) no elemento com ID `bTJMX`.
5.  **PauseWFClient** - Pausa a execução do workflow por 3000 milissegundos.
6.  **HideElement** - Oculta o elemento com ID `bTJYF`.

### Workflow bTLGp

# Mostrar Popup e Gerar Link

**Trigger:** `ButtonClicke`

## Summary

Exibe um popup e gera um link de consulta CNPJ.

## Actions

1.  **ShowElement** - Exibe o elemento com ID `bTJYF`.
2.  **REDACTED** - Executa a ação de geração de link com o valor `consultaCNPJ`.

### Workflow bTLIt

# Navegar para Consulta CNPJ / Cliente

**Trigger:** `ButtonClicked`

## Summary

Este workflow redireciona para a página de consulta com base na seleção do usuário, definindo o tipo de consulta e passando os parâmetros necessários.

## Actions

1. **HideElement** - Esconde o elemento com ID `bTJIP`.
2. **SetCustomState** - Define o estado customizado `custom.menu_setor_cadastro_` para `option.menu_setor_cadastro_consultas` e o estado customizado `custom.tipo_de_consulta_` para `option.tipo_de_consulta_cnpj`.
3. **ChangePage** - Redireciona para a página `cadastro` (ID `bTJhY`), adicionando os parâmetros `CNPJ` e `CLIENTE` na URL. O valor do parâmetro `CNPJ` é obtido após remoção de "-", "/" e "." do conteúdo do elemento pai, e o valor do parâmetro `CLIENTE` é obtido do elemento pai.

### Workflow bTLJW

# Criar e Atualizar Consulta CNPJ

**Trigger:** (Não especificado, mas provavelmente **Page Loaded** ou um evento customizado associado à página `cadastro`)

## Summary

Este workflow cria um novo registro na base de dados `consultas_cnpj` e atualiza o registro do cliente associado. Ele também exibe dados em um grupo (`Group Dados Consulta`) e gerencia a visibilidade de elementos (mostra e esconde).

## Actions

1.  **Create a new thing** (`custom.consultas_cnpj`)
    - Define `data_consulta_date` com a data e hora atuais.
    - Define `pdf_consulta_file` com o resultado de `get_AAb` (provavelmente um arquivo PDF) do elemento `bTJMd`.
    - Busca um cliente (`custom.cliente`) onde o campo `c_digo_cliente_text` é igual ao parâmetro `CLIENTE` da URL e o utiliza para o campo `a__cliente_custom_cliente`.
2.  **Modify thing** (`custom.consultas_cnpj` - referência através do passo anterior)
    - Atualiza o registro do cliente associado (referenciado pelo passo 1).
    - Define o campo `o__data_da_consulta_text` com a data e hora atuais formatadas como "dddd - dd/mm/yyyy HH:MM:ss".
3.  **Display list in group** (`Group Dados Consulta` - ID `bTJIP`)
    - Exibe os resultados de uma busca por `custom.cliente` onde o campo `c_digo_cliente_text` é igual ao parâmetro `CLIENTE` da URL.
4.  **Show Element** (`bTJIP`)
    - Torna visível o elemento com ID `bTJIP` (Grupo Dados Consulta).
5.  **Hide Element** (`bTJYF`)
    - Torna invisível o elemento com ID `bTJYF`.

### Workflow bTLKe

# Exibir Grupo PDF e Botão

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele exibe um grupo específico de dados (relacionado a um PDF de consulta) e torna um elemento visível.

## Actions

1.  **DisplayGroupData** - Exibe os dados do grupo "02__pdf_consulta_file" do elemento com ID "bTJWP".
2.  **ShowElement** - Torna visível o elemento com ID "bTJWP".

### AÇÃO: Buscar CRO

# AÇÃO: Buscar CRO

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo buscar informações de um CRO através de uma API, exibir essas informações e registrar a busca no banco de dados.

## Actions

1. De **API Connector Action**: Executa a chamada `A_P_I_C_2_header` para buscar dados do CRO, utilizando os valores dos parâmetros `_p_sigla` e `get_data` de elementos específicos (`bTJOp` e `bTJOh`).
2. De **Display Group Data**: Exibe os dados retornados pela ação anterior, referenciando o resultado da ação API (`bTJhj`) e utilizando um elemento específico (`bTJMq`).
3. De **Create a new Thing**: Cria um novo registro no tipo de dado `buscas_cro`, registrando o usuário que consultou (`CurrentUser`), a data e hora da consulta (`Current Date/Time`) e o valor retornado pela API (`_api_c2_header.price`).

### Workflow bTLQS

# Workflow bTLQS

**Trigger:** `ButtonClicked`

## Summary

Atualiza o estado customizado 'tipo_de_consulta_' na página 'cadastro' para 'cnpj' quando um botão é clicado.

## Actions

1.  **Set custom state** - Define o estado customizado `custom.tipo_de_consulta_` do elemento `bTIxd` na página `cadastro` com o valor `cnpj` do option set `tipo_de_consulta`.

### Workflow bTLQd

# Limpar Consulta Cadastro

**Trigger:** `Button Clicked` (Elemento: `Button_294-1`)

## Summary

Este workflow reseta o custom state "tipo_de_consulta_" do elemento `Button_294-1` para a opção "cro" do option set "tipo_de_consulta".

## Actions

1. **Set state of an element** - Define o custom state "tipo_de_consulta_" do elemento `Button_294-1` para a opção "cro" do option set "tipo_de_consulta".

### Workflow bTLRm

# Botão CNPJ Cadastro

**Trigger:** `ButtonClicked`

## Summary

Workflow acionado pelo clique de um botão, com a finalidade de consultar um CNPJ e realizar ações subsequentes baseadas na resposta.

## Actions

1.  **REDACTED** - Executa uma ação de origem desconhecida, possivelmente uma consulta externa ou validação, utilizando o valor do input "consultaCNPJ" e concatenando com dados de um elemento de tipo "get_data" (identificado como "bTJMZ"). Define parâmetros de tempo limite de resposta (800ms, 1080ms) e um prefixo para a ação ("Consulta_CNPJ_").

### Workflow bTLSQ

# Criar e Atualizar Consulta CNPJ

**Trigger:** `PageLoaded` (implícito no fluxo de criação/atualização de dados)

## Summary

Este workflow cria um novo registro na tabela `consultas_cnpj1` e atualiza um registro existente na tabela `custom.cliente` com base em parâmetros de URL e dados do sistema.

## Actions

1.  **Create a new thing:** Cria um novo registro do tipo `consultas_cnpj1`
    - **Initial Values:**
      - `01__data_consulta_date`: Data e hora atuais.
      - `02__pdf_consulta_file`: O conteúdo do elemento com ID `bTJMd`.
      - `a__cliente_custom_cliente`: Busca no banco de dados o primeiro registro em `custom.cliente` onde o campo `a__c_digo_cliente_text` seja igual ao parâmetro de URL `CLIENTE`.
2.  **Change thing:** Modifica o registro do cliente buscado na etapa anterior.
    - **Changes:**
      - `REDACTED`: Referência ao registro recém-criado na etapa 1 (`New Thing`).
      - `o__data_da_consulta_text`: Data e hora atuais formatadas como "dddd - dd/mm/yyyy HH:MM:ss".
    - **Thing to change:** Referência ao registro do cliente encontrado na etapa 1 (`a__cliente_custom_cliente`).

### Workflow bTLYD

# Navegar para Consulta CRO

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e navega para uma página específica, possivelmente para consulta de dados.

## Actions

1.  **Navegar para página** - Redireciona para a página `consultaCRO`.

### Workflow bTLwQ

# Redirecionar ao clicar

**Trigger:** `ButtonClicked`

## Summary

Redireciona o usuário para outra página ao clicar em um botão.

## Actions

1.  **ChangePage** - Redireciona o usuário para a página **cadastro**.

### Workflow bTMEJ

# Exibir/Ocultar Elemento Cadastro

**Trigger:** `PageLoaded`

## Summary

Este workflow é acionado quando a página 'cadastro' é carregada. Ele alterna a visibilidade de um elemento específico após uma pausa.

## Actions

1.  **ShowElement** - Exibe o elemento com ID `bTJYF`.
2.  **PauseWFClient** - Pausa a execução do workflow por 2000 milissegundos (2 segundos).
3.  **HideElement** - Oculta o elemento com ID `bTJYF`.

### Workflow bTMXp

# Processar CSV de Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow processa um arquivo CSV importado, formatando e comparando dados para categorizar os registros de cadastro.

## Actions

1. **Private workflow actions:** Executa um conjunto de ações privadas que não são exibidas diretamente no editor de workflow. (Ações internas do Bubble para processamento de dados).
2. **Import CSV drag and drop:** Importa dados de um arquivo CSV.
   - **File to upload:** O arquivo CSV selecionado pelo usuário.
   - **Destination:** Arquivo CSV (o arquivo carregado).
   - **Content:** Define o conteúdo do CSV com cabeçalhos: CODIGO,NOME,EMAIL,CELULAR,DOCUMENTO,COLABORADOR,TIPO_CADASTRO,TIPO_SOLICITACAO,REVISADO,STATUS,CRIADO_EM,FINALIZADO_EM.
   - **Entries:**
     - Linha 0: Define os cabeçalhos do CSV.
     - Linha 1: Define a lógica de processamento para cada linha. Para o campo `TIPO_CADASTRO`, verifica se o valor corresponde ao `tipo_de_cadastro` definido pelo usuário (usando o Option Set `tipo_de_cadastro` com valor `bTHEv`). Se for igual, formata o campo `[CODIGO]` como texto; caso contrário, formata o campo `[NOME]` como texto.
     - Linha 2: Delimitador de campo (vírgula).
     - Linha 3: Processa o campo `TIPO_SOLICITACAO` de forma similar ao `TIPO_CADASTRO`, utilizando o Option Set `tipo_de_cadastro` com valor `bTHEv`.
     - Linha 4: Delimitador de campo (vírgula).
     - Linha 5: Processa o campo `REVISADO` de forma similar, utilizando o Option Set `tipo_de_cadastro` com valor `bTHEv`.
     - Linha 6: Delimitador de campo (vírgula).
     - Linha 7: Processa o campo `STATUS` de forma similar, utilizando o Option Set `tipo_de_cadastro` com valor `bTHEv`.

### BAIXAR - CRO F

# BAIXAR - CRO F

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado para iniciar o download de um arquivo CRO_F. Ele constrói o nome do arquivo dinamicamente e exibe um elemento.

## Actions

1. **REDACTED** - Constrói o nome do arquivo combinando strings estáticas, valores de option sets e dados de um elemento. O resultado é usado como parte do nome do arquivo a ser baixado.
2. **Show Element** - Exibe o elemento com ID `bTJYM`.

---

### AÇÃO: Deletar Cadastro

# AÇÃO: Deletar Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow deleta os registros de um cliente e seus dados associados, como documentos e endereços, a partir de um formulário na página de cadastro.

## Actions

1.  **Show Element** - Exibe o elemento com ID `bTJYF` (nome legível indisponível).
2.  **Hide Element** - Esconde o elemento com ID `bTMfI` (nome legível indisponível).
3.  **Delete Thing** - Deleta registros do tipo `custom._pf__clientes` onde a chave `a__cliente_custom_cliente` é igual ao valor obtido do elemento `bTMfI`.
4.  **Delete Thing** - Deleta registros do tipo `custom.clientes` onde a chave `b__cliente_custom_cliente` é igual ao valor obtido do elemento `bTMfI`.
5.  **Delete Thing** - Deleta registros do tipo `custom.documentos` onde a chave `a__cliente_custom_cliente` é igual ao valor obtido do elemento `bTMfI`.
6.  **Delete Thing** - Deleta registros do tipo `custom.endere_os` onde a chave `a__cliente_custom_cliente` é igual ao valor obtido do elemento `bTMfI`.
7.  **Delete Thing** - Deleta o elemento obtido do elemento `bTMfI`.
8.  **Hide Element** - Esconde o elemento com ID `bTJYF` (nome legível indisponível).

### Workflow bTMgu

# Salvar Dados Cadastro

**Trigger:** `Button ButtonSalvarCad`

## Summary

Este workflow é ativado quando o botão "ButtonSalvarCad" é clicado. Sua função principal é ocultar um elemento específico ("Popup Confirmar").

## Actions

1. **Hide Element** - Oculta o elemento com ID "bTMfI" (Popup Confirmar).

### Workflow bTMhF

```markdown
# Workflow Salvar Dados Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão na página de cadastro e é responsável por exibir dados de um grupo (element ID: bTMfI) e mostrar esse mesmo grupo.

## Actions

1.  **DisplayGroupData** - Exibe dados do grupo (element ID: bTMfI).
2.  **ShowElement** - Torna visível o elemento (element ID: bTMfI).
```

### AÇÃO: Alterar Status

# AÇÃO: Alterar Status

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo alterar o status de um registro no banco de dados e atualizar um campo booleano.

## Actions

1.  **Modificar Coisa** - Altera o registro pai do elemento clicado.
    - Define `status_cadastro` para a opção com valor `bTHen`.
    - Define `h__revisado__boolean` para `false`.

---

## pre_cadastro

# pre_cadastro

## Summary

Página para pré-cadastro de usuários, permitindo o upload de documentos como CNH, CPF ou RG.

### UI

- **Group X** (Group) - Container principal da página.
  - **Group X** (Group) - Grupo de organização interna.
    - **Group MZ** (Group) - Agrupador para upload de documentos.
      - **Upload CNH | CPF | RG - FRENTE** (File uploader) - Permite o upload do anverso de documentos de identificação.

### Workflows

Nenhum workflow encontrado com um trigger explícito para esta página. A navegação e interações são gerenciadas por outros componentes ou eventos.

---

### Workflow bTHPB

# Definir Nav PF

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e define o estado customizado "nav_pf_" com base na opção selecionada do Option Set "tipo_de_cadastro".

## Actions

1.  **Definir estado customizado `custom.nav_pf_`** - Define o valor do estado customizado "nav_pf_" para a opção "tipo_de_cadastro_bTHEv" (presumivelmente "Pessoa Física") do Option Set "tipo_de_cadastro".
2.  **Definir estado customizado `custom.tipo_de_cadastro_`** - Define o valor do estado customizado "tipo_de_cadastro_" para a opção "tipo_de_cadastro_bTHEv" do Option Set "tipo_de_cadastro".

### Workflow bTHTD

# Definir Tipo de Pré-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow define o tipo de cadastro selecionado pelo usuário na página de pré-cadastro.

## Actions

1.  **Definir estado personalizado `custom.tipo_de_cadastro_` para `option.tipo_de_cadastro` com valor `bTHEz`** - Define o estado personalizado `tipo_de_cadastro_` do elemento com ID `bTJzd` para o valor específico "bTHEz" relacionado ao option set "tipo de cadastro".
2.  **Definir estado personalizado `custom.nav_pf_` para o valor `1`** - Define o estado personalizado `nav_pf_` para o valor numérico 1.

### Workflow bTHip

# Definir Estado Navegação Pre-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow atualiza um estado customizado em um elemento, provavelmente para controlar a navegação ou a exibição de conteúdo na página.

## Actions

1.  **Set Custom State** - Define o estado customizado `nav___doc_` para o valor `3` no elemento com ID `bTJzd`.

### Workflow bTHiv

# Definir Estado Navegação NavDoc

**Trigger:** `ButtonClicked`

## Summary

Este workflow atualiza um estado customizado em um elemento.

## Actions

1.  **Set custom state** - Define o estado customizado `custom.nav___doc_` para o valor `2`.

### Workflow bTHjB

# Workflow Salvar Estado Navegação

**Trigger:** `Button Unnamed` (do elemento `Button Salvar` na página `pre_cadastro`)

## Summary

Este workflow define o estado de navegação customizado "nav___doc_" para um valor específico (1) quando um botão é clicado.

## Actions

1. **Definir Estado Customizado** - Define o estado customizado `nav___doc_` do elemento `Button Salvar` para o valor `1`.

### Workflow bTHka

# Workflow bTHka

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão, definindo um estado customizado em um elemento e subsequentemente rolando a página para esse mesmo elemento.

## Actions

1.  **Definir estado customizado** - Define o estado `custom.nav_pf_` do elemento `bTJzd` para o valor `2`.
2.  **ScrollToElement** - Rola a página para o elemento `bTJzd`.

### PESSOA FÍSICA

# PESSOA FÍSICA

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e exibe um elemento específico. Ele também tem uma condição complexa que verifica o status de cadastro e a existência de um cliente com base no CPF.

## Actions

1. **ShowElement**: Exibe o elemento com ID `bTKKc`.
2. **Create a new thing**: Cria um novo item no tipo de dado `custom._pf__clientes` com os seguintes valores iniciais:
   - `01__nome_completo_text`: `Input Nome Completo (bTKFR)'s value`
   - `02__n_mero_do_cro_text`: `Input CRO (bTKFr)'s value`
   - `03__n_mero_de_cpf_text`: `Input CPF (bTKFx)'s value`
   - `04__telefone_fixo_text`: `Input Telefone Fixo (bTKEj)'s value`
   - `05__whatsapp_text`: `Input WhatsApp (bTKEt)'s value`
   - `REDACTED` (tipo de cadastro): `tipo_de_cadastro's value` (valor: "bTHEv")
   - `a__cliente_custom_cliente`: O primeiro elemento encontrado a partir de uma busca por `custom._pf__clientes` onde:
     - `03__n_mero_de_cpf_text` é igual a `Input CPF (bTKFx)'s value`.
     - Adicionalmente, se `Grupos` (elemento ID `bTKKb`) `status_cadastro` não é igual a "bTJDk", E `Grupos` (elemento ID `bTKKb`) `tipo_de_cadastro` é igual a "bTHEv", E a busca por `custom._pf__clientes` onde `03__n_mero_de_cpf_text` é igual a `Input CPF (bTKFx)'s value` e `first_element` não está vazio.

### Workflow bTHlo

# Workflow bTHlo

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele define um estado customizado em um elemento e, em seguida, rola a página para esse mesmo elemento.

## Actions

1.  **SetCustomState**: Define o estado customizado `custom.nav_pf_` para o valor `3` no elemento `bTJzd`.
2.  **ScrollToElement**: Rola a página para o elemento `bTJzd`.

### Workflow bTHlt

# Scroll para Navegação PF

**Trigger:** `ButtonClicked`

## Summary

Este workflow rola a página para um elemento específico e atualiza um estado customizado.

## Actions

1.  **SetCustomState** - Define o estado customizado `nav_pf_` do elemento `Button (ID: bTJzd)` para o valor `1`.
2.  **ScrollToElement** - Rola a página para o elemento `Button (ID: bTJzd)`.

### AÇÃO: Buscar endereço

# AÇÃO: Buscar endereço

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado para buscar um endereço, utilizando um elemento de Input para obter o CEP.

## Actions

1. **REDACTED** - Realiza uma ação não especificada, utilizando um elemento de Input (`bTKIk`) para extrair dados.

---

### Workflow bTHnh

# Ir para Seção de Navegação

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, configurando um estado personalizado para navegação e rolando para o elemento correspondente na página.

## Actions

1.  **SetCustomState** - Define o estado personalizado `custom.nav_pf_` para o valor `2` no elemento `Elemento Botão Barra de Navegação`.
2.  **ScrollToElement** - Rola a página até o elemento `Elemento Botão Barra de Navegação`.

### AÇÃO: Fechar pu Visualizar Documentos

# AÇÃO: Fechar pu Visualizar Documentos

**Trigger:** `ButtonClicked`

## Summary

Fecha um elemento da interface do usuário.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTKKt`.

---

### Workflow bTIZv

# Workflow bTIZv

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, exibindo dados de um grupo e tornando esse grupo visível.

## Actions

1.  **Display group data** - Exibe os dados do grupo (`bTKCL`) para o elemento (`bTKKt`).
2.  **Show element** - Torna o elemento (`bTKKt`) visível.

### Workflow bTIaU

# Exibir Seção de Confirmação

**Trigger:** `ButtonClicked` (Elemento: `bTKKt`)

## Summary

Este workflow é acionado quando um botão é clicado. Ele exibe uma seção específica e obtém dados relacionados a ela.

## Actions

1.  **DisplayGroupData**: Obtém os dados do elemento com ID `bTKCX` (fonte `get_data` → `url`) e os exibe no elemento com ID `bTKKt`.
2.  **ShowElement**: Exibe o elemento com ID `bTKKt`.

### Workflow bTIat

# Exibir Grupo e Elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele exibe dados de um elemento específico e, em seguida, torna um outro elemento visível.

## Actions

1.  **DisplayGroupData**: Exibe dados do elemento `bTKBc` (obtenção de dados da URL do grupo `bTKBc`).
2.  **ShowElement**: Torna o elemento `bTKKt` visível.

### Workflow bTIbK

# Mostrar/Ocultar Grupo de Mensagens

**Trigger:** `ButtonClicked`

## Summary

Este workflow controla a exibição de um grupo (`Grupo de mensagens`) e sua ação associada, ativado pelo clique em um botão.

## Actions

1.  **Mostrar dados do grupo:** Define o conteúdo do grupo (`Grupo de mensagens`) com base no valor retornado de `Grupo de mensagens` (get_data → url).
2.  **Mostrar elemento:** Torna o elemento `Grupo de mensagens` visível.

### Workflow bTIbu

# Workflow Exibir e Mostrar Grupo

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele exibe os dados de um elemento específico e, em seguida, mostra esse elemento.

## Actions

1.  **DisplayGroupData** - Exibe os dados do elemento `bTKBK` obtidos através da "url" do grupo `bTKBK`.
2.  **ShowElement** - Mostra o elemento `bTKKt`.

### Workflow bTIcT

# Exibir Detalhes de URL no Grupo

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, com o objetivo de exibir dados de URL em um grupo específico e tornar esse grupo visível.

## Actions

1.  **DisplayGroupData** - Exibe os dados contidos no elemento `get_data` (que extrai a URL) no grupo com ID `bTKAn`.
2.  **ShowElement** - Torna visível o grupo com ID `bTKAn`.

### Workflow bTIck

# Exibir grupo e mostrar elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow exibe informações de um elemento e, em seguida, mostra esse mesmo elemento.

## Actions

1.  **Exibir grupo de dados** - Exibe dados do botão (ID: `bTKAD`) no grupo `bTKKt`.
2.  **Mostrar elemento** - Torna visível o elemento com ID `bTKKt`.

### Workflow bTIdB

# Exibir e Mostrar Elemento

**Trigger:** `ButtonClicked`

## Summary

Exibe dados de um elemento e, em seguida, mostra um elemento específico na página.

## Actions

1.  **Exibir dados do grupo elementar** - Obtém a URL (`get_data` -> `url`) a partir do elemento com ID `bTKAP` (equivalente ao elemento `Input Email` na página `pre_cadastro`) e a exibe no grupo com ID `bTKKt` (equivalente a `Group Form` na página `pre_cadastro`).
2.  **Mostrar elemento** - Torna visível o grupo com ID `bTKKt` (equivalente a `Group Form` na página `pre_cadastro`).

### Workflow bTIdm

```json
{
  "nome_sugerido": "Exibir/Ocultar Elemento ao Clicar"
}
```

# Exibir/Ocultar Elemento ao Clicar

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado para exibir ou ocultar um grupo de elementos.

## Actions

1.  **Exibir/Ocultar Grupo** - Exibe ou oculta o grupo "bTKKt" com base na sua visibilidade atual.
2.  **Mostrar Elemento** - Exibe o grupo "bTKKt".

### Workflow bTIeD

# Workflow Preencher Tipo de Cadastro (Pré-Cadastro)

**Trigger:** `PageLoaded` na página `pre_cadastro`

## Summary

Este workflow é acionado quando a página de pré-cadastro é carregada. Ele define um estado customizado para o tipo de cadastro e navega para o grupo de dados correspondente.

## Actions

1. **Set Custom State** `custom.tipo_de_cadastro_` com o valor `1` e `custom.nav_pf_` com o valor `1` - Define os estados customizados iniciais para o fluxo de pré-cadastro.
2. **Condição:** Se o `GetElement` (`bTKKb`) não estiver vazio - Verifica se um elemento específico está preenchido antes de prosseguir.
   - **Consequência:** Se a condição for verdadeira, o workflow continua. Caso contrário, ele pode parar ou seguir outro caminho não especificado aqui.

### Workflow bTIhv

# Workflow Resetar Grupo no Pré-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e sua principal função é resetar um grupo específico dentro da página.

## Actions

1.  **Reset Group** - Reseta o grupo com o ID `bTKCH`.

### Workflow bTIiT

# Limpar grupo pre_cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo resetar um grupo específico na página.

## Actions

1.  **ResetGroup** - Limpa o conteúdo do grupo com ID `bTKCT`.

### Workflow bTIir

# Resetar Grupo do Formulário de Pré-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo resetar um grupo específico dentro do formulário de pré-cadastro.

## Actions

1.  **ResetGroup** - Reseta o grupo de elementos **bTKBb**.

### Workflow bTIjP

# Workflow bTIjP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo resetar um grupo específico na página.

## Actions

1.  **ResetGroup** - Reseta o grupo com o ID `bTKBn`.

### Workflow bTIjn

# Resetar grupo após clique

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta um grupo específico após um botão ser clicado.

## Actions

1.  **ResetGroup** - Reseta o conteúdo do grupo com o ID `bTKBJ`.

### Workflow bTIkL

# Resetar Grupo de Pré-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado. Sua principal função é resetar um grupo de elementos.

## Actions

1. **Reset Group** - Reseta o grupo de elementos com ID `bTKAC` (nome legível: **não encontrado no mapa de referência**).

### Workflow bTIkj

# Limpar campos do formulário

**Trigger:** `ButtonClicked`

## Summary

Limpa os campos de um grupo específico após um evento.

## Actions

1.  **ResetGroup** - Limpa o conteúdo do grupo com ID `bTKAO`.

### Workflow bTIlH

# Salvar pré-cadastro

**Trigger:** `Button Clicked`

## Summary

Este workflow é acionado ao clicar em um botão, resultando na limpeza (reset) de um grupo específico na página.

## Actions

1.  **Reset Group** - Reseta o grupo com ID `bTJzl`.

### Workflow bTIlf

# Limpar Grupo Pre-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo resetar um grupo específico.

## Actions

1. **ResetGroup** - Reseta o elemento de grupo com ID `bTKAm`.

### Workflow bTJHn

# Salvar dados pré-cadastro

**Trigger:** `ButtonClicked` (Elemento: `Button Save` - ID: `bTKKb`)

## Summary

Este workflow é acionado ao clicar no botão "Button Save". Ele verifica o status do cadastro usando um Option Set e, se a condição for atendida, exibe um elemento modal e atualiza diversos campos de texto com dados de outros elementos.

## Actions

1.  **Show Element** - Exibe o elemento modal (ID: `bTKKc`).
2.  **Modify thing in the database** - Atualiza os seguintes campos com base nos valores dos respectivos elementos:
    - `01__nome_completo_text` recebe o valor do elemento `Input Nome Completo` (ID: `bTKFR`).
    - `02__n_mero_do_cro_text` recebe o valor do elemento `Input Número CRO` (ID: `bTKFr`).
    - `03__n_mero_de_cpf_text` recebe o valor do elemento `Input CPF` (ID: `bTKFx`).
    - `04__telefone_fixo_text` recebe o valor do elemento `Input Telefone Fixo` (ID: `bTKEj`).
    - `05__whatsapp_text` recebe o valor do elemento `Input WhatsApp` (ID: `bTKEt`).
    - `06__e_mail_text` recebe o valor do elemento `Input E-mail` (ID: `bTKFL`).
    - Um campo não especificado (REDACTED) recebe o valor do elemento `DateInput Data de Nascimento` (ID: `bTKFj`).
    - `07__email_de_nf_text` recebe o valor do elemento `Input E-mail NF` (ID: `bTKFX`).
    - `05b__celular_02_text` recebe o valor do elemento `Input Celular 02` (ID: `bTKFA`).
    - `02_b_uf_cro_text` recebe o valor do elemento `Dropdown UF CRO` (ID: `bTKWh`).
    - `01b__data_de_nascimento_date` recebe o valor do elemento `Dateinput Data de Nascimento (2)` (ID: `bTLpa`).

### Workflow bTJQP

[NOME_SUGESTIDO: Exibir e Habilitar Campo URL]

# Exibir e Habilitar Campo URL

**Trigger:** `ButtonClicked` (Elemento: {elemento_nao_mapeado})

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele exibe dados em um elemento de grupo e, em seguida, torna um elemento visível.

## Actions

1.  **DisplayGroupData** - Exibe os dados obtidos do elemento "get_data" (ID: bTKDP) no grupo "bTKKt", usando a propriedade "url" como fonte.
2.  **ShowElement** - Torna o elemento "bTKKt" visível.

### Workflow bTJQZ

# Resetar Grupo Pre-Cadastro

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta um grupo específico na página de pré-cadastro.

## Actions

1.  **Reset data of group:** Reseta os dados do grupo com ID `bTKDO`.

### Workflow bTJUX

# Workflow bTJUX - Botão Nav PF Clicado

**Trigger:** `ButtonClicked`

## Summary

Ação executada ao clicar em um botão específico na página `pre_cadastro`, que atualiza um custom state e rola a página para o elemento alvo.

## Actions

1.  **Set Custom State** - Define o custom state `nav_pf_` do elemento `bTJzd` para o valor `2`.
2.  **Scroll To Element** - Rola a página até o elemento `bTJzd`.

### AÇÃO: Fechar pu Cadastro Existente

# AÇÃO: Fechar pu Cadastro Existente

**Trigger:** `ButtonClicked`

## Summary

Este workflow fecha um elemento popup (`pu Cadastro Existente`) quando um botão é clicado.

## Actions

1.  **Hide Element**: Esconde o elemento `pu Cadastro Existente`.

### PESSOA FÍSICA

# PESSOA FÍSICA

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e executa ações condicionais relacionadas a dados de cadastro e cliente.

## Actions

1. **Show Element**: Exibe o elemento com o ID `bTKLM`.

---

### PESSOA JURÍDICA

# PESSOA JURÍDICA

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado para iniciar o processo de cadastro de pessoa jurídica. Ele verifica condições relacionadas ao tipo de cadastro e à existência de dados de cliente, dependendo se estes foram passados via URL.

## Actions

1.  **Show Element** - Exibe um elemento com ID `bTKKc`.
2.  **Set State** - Define o estado de um elemento com ID `bTKKb`.
    - **Initial values:**
      - `02__n_mero_do_cro_text`: Concatena um texto vazio, " - ", e o valor do elemento com ID `bTKHj`.
      - `04__n_mero_de_cnpj_text`: Obtém o valor do elemento com ID `bTKHL`.
      - `04__telefone_fixo_text`: Obtém o valor do elemento com ID `bTKGN`.
      - `05__whatsapp_text`: Obtém o valor do elemento com ID `bTKGU`.
      - **tipo_de_cadastro**: Define o valor para a opção `bTHEz` do option set `tipo_de_cadastro`.
      - `b__cliente_custom_cliente`: Busca o primeiro elemento do tipo `custom.clientes` que atende às seguintes condições:
        - O parâmetro `cli` da URL é igual ao campo `a__c_digo_cliente_text` do cliente.
        - O option set `status_cadastro` é igual à opção `bTJDk`.
        - O option set `tipo_de_cadastro` é igual à opção `bTHEz`.
        - Se nenhum cliente for encontrado, o CPF/CNPJ é limpo.

### PESSOA JURÍDICA

# PESSOA JURÍDICA

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado e executa uma ação para exibir um elemento.

## Actions

1. **Show element `Group Pj`**: Exibe o elemento (grupo) chamado `Group Pj`.

### AÇÃO: Envia token no email

# AÇÃO: Envia token no email

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo ocultar elementos, gerar e salvar um token, enviar um e-mail com o token para o usuário e exibir elementos relacionados ao processo.

## Actions

1.  **HideElement** - Oculta o elemento com ID `bTPIJ`.
2.  **HideElement** - Oculta o elemento com ID `bTPNt`.
3.  **ShowElement** - Exibe o elemento com ID `bTPOW`.
4.  **ChangeThing** - Modifica um registro do tipo `custom.cliente` encontrado através de constraints. Atualiza os seguintes campos:
    - Define um campo `REDACTED` como `false`.
    - Define `s__token_gerado_text` com um código aleatório de 6 caracteres (letras e números).
    - Define `t__token_expired_date` como a data e hora atuais mais 5 minutos.
    - Define `temp___email_envio_text` com o valor do elemento com ID `bTPIp`.
5.  **apiconnector2-bTPfN.bTPfO** - Chama a API Connector `bTPfN` na call `bTPfO`, enviando os seguintes parâmetros:
    - `email`: Valor de `temp___email_envio_text` do passo anterior.
    - `token`: Valor de `s__token_gerado_text` do passo anterior.
    - `celular`: Valor de `celular_temp_text` do passo anterior.
6.  **SendEmail** - Envia um e-mail com as seguintes características:
    - **Para:** Valor de `temp___email_envio_text` do passo 4.
    - **Assunto:** "Token recebido".
    - **Remetente:** "TOKEN DE VERIFICAÇÃO".
    - **Corpo:** "Copie o Token abaixo e cole no local indicado. <valor do token gerado>\n\nToken válido por 5 minutos".

### AÇÃO: Fecha popup verificacao email

# AÇÃO: Fecha popup verificacao email

**Trigger:** `ButtonClicked`

## Summary

Este workflow fecha um popup de verificação de e-mail.

## Actions

1. **Hide Element** - Esconde o elemento com ID `bTPNt` (o popup de verificação de e-mail).

### AÇÃO: Abre popup verificacao email

# AÇÃO: Abre popup verificacao email

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, abrindo um popup específico para verificação de e-mail.

## Actions

1. **Show Element**: Exibe o elemento com ID `bTPNt`.

### AÇÃO: Token Expirado

# AÇÃO: Token Expirado

**Trigger:** `ButtonClicked`

## Summary

Workflow acionado ao detectar que um token expirou. Exibe um elemento específico.

## Actions

1. **Show Element** - Exibe o elemento com ID `bTPUV`.

---

### AÇÃO: Clicar no botão Reenviar

# AÇÃO: Clicar no botão Reenviar

**Trigger:** `ButtonClicked`

## Summary

Workflow executado ao clicar no botão "Reenviar", com o objetivo de ocultar um elemento específico.

## Actions

1. **Ocultar Elemento** - Oculta o elemento com `element_id` "bTPTU".

---

### AÇÃO: Reenviar Token

# AÇÃO: Reenviar Token

**Trigger:** `ButtonClicked`

## Summary

Workflow acionado ao clique de um botão para reenviar um token. Ele oculta um elemento, mostra outro, atualiza um registro no banco de dados com um novo token e data de expiração, e envia um e-mail com o token gerado.

## Actions

1.  **HideElement** - Oculta o elemento com ID `bTPUV`.
2.  **ShowElement** - Mostra o elemento com ID `bTPVY`.
3.  **ChangeThing** - Atualiza o registro do tipo `custom.cliente` encontrado pela URL (`cli`).
    - Define `s__token_gerado_text` com uma string aleatória de 6 caracteres contendo letras e números.
    - Define `t__token_expired_date` para 30 minutos a partir da data/hora atual.
4.  **apiconnector2-bTPfN.bTPfO** - Executa uma chamada de API.
    - Envia `temp___email_envio_text` como parâmetro `email`.
    - Envia o novo token gerado (`s__token_gerado_text`) como parâmetro `token`.
    - Envia `celular_temp_text` como parâmetro `celular`.
5.  **SendEmail** - Envia um e-mail.
    - **To:** `temp___email_envio_text`.
    - **Subject:** "Token recebido".
    - **Sender Name:** "TOKEN DE VERIFICAÇÃO".
    - **Body:** Monta uma mensagem contendo o token gerado e informa que é válido por 30 minutos.

### AÇÃO: Token Inválido

# AÇÃO: Token Inválido

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele verifica se um token fornecido é inválido e, se for, exibe um elemento de mensagem indicando o erro.

## Actions

1. **ShowElement** - Exibe o elemento `bTPTU`.

---

### Workflow bTPXK

# Workflow bTPXK

**Trigger:** `PageLoaded`

## Summary

Verifica a URL em busca do parâmetro 'cli'. Se encontrado, busca o cliente associado e exibe a tela de preenchimento de credenciais.

## Actions

1.  **Show Element** - Exibe o elemento com ID `bTPWB`.

### Workflow bTPXv

# Ocultar elemento ao clicar

**Trigger:** `ButtonClicked`

## Summary

Este workflow oculta um elemento específico da UI quando um botão é clicado.

## Actions

1.  **Hide Element** - Oculta o elemento com ID `bTPVY`.

### AÇÃO: Token Válido

# AÇÃO: Token Válido

**Trigger:** `bTPSx` (Evento simulado, possivelmente `ButtonClicked` ou similar de um elemento específico na página `pre_cadastro`)

## Summary

Este workflow verifica a validade de um token de cliente obtido via URL e atualiza um registro no banco de dados.

## Actions

1. **Hide Element** (`bTPNU`) - Esconde um elemento específico.
2. **Set Custom State** (`bTPYL`) - Define o custom state `custom.tipo_de_cadastro_` para vazio e `custom.nav_pf_` para vazio.
3. **Change Thing** (`bTPYN`) - Atualiza o registro do cliente que possui o código de cliente igual ao parâmetro `cli` na URL e cujo campo `s__token_gerado_text` corresponde ao valor obtido do elemento `bTPNZ`, definindo o campo `REDACTED` como `true`.

   - **Condição de Busca:**
     - `a__c_digo_cliente_text` é igual ao parâmetro `cli` da URL.
     - `s__token_gerado_text` é igual ao valor do elemento `bTPNZ`.
   - **Campo a ser Atualizado:** `REDACTED` para `true`.

## super_admin

# super_admin

## Summary

Página principal de administração para super administradores, oferecendo acesso completo à plataforma. Contém um cabeçalho com logo e título, e seções para gerenciamento de credenciais e vendedores.

### UI

- **Group A** (Group) - Container principal da página
  - **Group B** (Group) - Container interno com scroll vertical
    - **Group C** (Group) - Cabeçalho da página
      - **Image A** (Image) - Logo da aplicação
      - **Group C** (Group) - Título e subtítulo da página
        - **Text login-title** (Text) - Título principal "Super Admin".
        - **Text login-subtitle** (Text) - Subtítulo "Acesso full à plataforma".
    - **Group H** (Group) - Área de navegação principal
      - **Button A** (Button) - Botão "Credenciais" para acesso à gestão de credenciais.
      - **Button Vendedor** (Button) - Botão "Vendedor" para acesso à gestão de vendedores.

### Workflow bTLtV

# Workflow Redirecionar para Página Inicial

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo redirecionar o usuário para a página inicial do aplicativo.

## Actions

1.  **Change Page** - Redireciona para a página **index**.

### Workflow bTLtt

# Redirecionar para Super Admin

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado e redireciona o usuário para a página 'super_admin'.

## Actions

1.  **Change Page** - Redireciona para a página **super_admin**.

### Workflow bTLuG

# Workflow bTLuG

**Trigger:** `ButtonClicked` (referente ao elemento `bTIxd`)

## Summary

Este workflow é acionado quando um botão é clicado e redireciona o usuário para a página de credenciais.

## Actions

1.  **Change Page** - Redireciona para a página `credenciais`.

### Workflow bTLuT

# Workflow bTLuT

**Trigger:** `ButtonClicked`

## Summary

Abre uma URL externa com parâmetros específicos para o fluxo de cadastro.

## Actions

1.  **Open URL** - Abre a URL `https://gestao-contratos-conexao.bubbleapps.io/pre_cadastro?colab=""&cli=""&action=cadastrar`.

### Workflow bTMBn

# Redirecionar para página de Credenciais

**Trigger:** `Button Clicked`

## Summary

Este workflow redireciona o usuário para a página de credenciais após um clique.

## Actions

1. **Change page**: Redireciona para a página **credenciais** em uma nova aba.

### Workflow bTMCo

# Workflow bTMCo

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e sua principal função é resetar um grupo específico na página 'super_admin'.

## Actions

1. **ResetGroup** - Reseta o grupo com ID `bTMCR` na página `super_admin`.

## teste

# teste

## Summary

Página com o title "Gráficos", contendo um input para email, um botão para enviar email e um popup com um RepeatingGroup que exibe informações de clientes.

### UI

- **Button A** (Button) - Botão para enviar email.
- **Input email** (Input) - Campo para inserção de email.
- **Group A** (Group) - Contêiner para outros elementos.
  - **Text A** (Text) - Exibe informações formatadas.
- **Popup A** (Popup) - Elemento popup.
  - **RepeatingGroup A** (RepeatingGroup) - Exibe uma lista de clientes.

### Workflows

Não há workflows definidos nesta página.

### Workflow bTMUK

# Workflow bTMUK

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, enviando dados para uma API externa e, em seguida, solicitando dados de um elemento na página.

## Actions

1.  **API Connector `bTMUW`** - Envia dados (obtidos de uma expressão de mensagem e do elemento `bTMTz`) para a chamada de API `bTMUV`.
2.  **Comunicação com Elemento** - Solicita dados do elemento `bTMTz` através de uma expressão de mensagem.

### Workflow bTMWB

# Workflow Exportar Dados CSV

**Trigger:** `ButtonClicked`

## Summary

Exporta dados para um arquivo CSV, nomeando-o e disponibilizando um link para download.

## Actions

1. **Download file** - Gera um arquivo CSV com os campos 'nome', 'codigo', 'status', 'link' e 'data' (formatada como dd/mm/yyyy). O nome do arquivo será "teste.csv".

## lp_evento

# lp_evento

## Summary

Página de landing page projetada para eventos. Apresenta um título principal e um botão de ação "QUERO PARTICIPAR". O layout se adapta a diferentes tamanhos de tela.

### UI

- **Group A** (Group) - Container principal para elementos da página com responsividade.
  - **Group B** (Group) - Agrupa o botão de ação.
    - **Button F** (Button) - Botão com o texto "QUERO PARTICIPAR" e ícone de estrela. Possui estados visuais para diferentes tamanhos de tela e interações.
  - **Group C** (Group) - Container para elementos de texto com responsividade.
    - **Text N** (Text) - Título principal da página com o texto "A MELHOR PLATAFORMA DA LATAM". Possui estados visuais para diferentes tamanhos de tela.
    - **Text P** (Text) - Subtítulo com o texto "Tudo que você precisa para gerenciar seu evento em um só lugar.". Possui estados visuais para diferentes tamanhos de tela.

---

### Workflow bTNPh

# Workflow bTNPh

**Trigger:** `ButtonClicked`

## Summary

Redireciona o usuário para a página "lp_evento" quando um botão é clicado.

## Actions

1.  **Change Page** - Redireciona para a página **lp_evento**

### Workflow bTNcD

# Exibir Modal e Redirecionar

**Trigger:** `ButtonClicked` (do elemento com ID `bTNbs`)

## Summary

Este workflow dispara ao clicar em um botão, primeiro exibindo um elemento (modal), pausando a execução e, em seguida, redirecionando o usuário para outra página.

## Actions

1.  **Mostrar Elemento** (`ShowElement`) - Exibe o elemento com ID `bTOEp`.
2.  **Pausar Workflow (Cliente)** (`PauseWFClient`) - Interrompe a execução do workflow por 1500 milissegundos.
3.  **Mudar de Página** (`ChangePage`) - Redireciona o usuário para a página `lp_evento` (anteriormente `bTMrO`).

### Workflow bTObn

# Workflow bTObn

**Trigger:** `ButtonClicked`

## Summary

Abrir ou fechar um elemento de menu mobile na página `lp_evento`.

## Actions

1. **Toggle Element** - Alterna a visibilidade do elemento com ID "bTObo" (corresponde ao elemento "Menu Mobile" na página "lp_evento").

### Workflow bTOck

# Workflow lp_evento - Alternar Visibilidade do Elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow tem como objetivo alternar a visibilidade de um elemento específico na página `lp_evento` quando um botão é clicado.

## Actions

1. **Toggle Element** (`bTOcl`) - Alterna a visibilidade do elemento `bTOcL`.

### Workflow bTOcv

# Workflow bTOcv

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão. Sua função principal é alternar a visibilidade de um elemento.

## Actions

1. **ToggleElement** - Alterna a visibilidade do elemento com ID `bTOcZ`.

## lp_cadastro

# lp_cadastro

## Summary

Página de cadastro que exibe informações sobre um evento e um formulário para inscrição. Inclui um popup para informações adicionais e um rodapé.

### UI

- **Popup A** (Popup) - Exibe estilos para ocultar a barra de rolagem e centraliza o conteúdo.
  - **HTML A** (HTML) - Aplica estilos CSS para ocultar a barra de rolagem.
- **FOOTER** (Group) - Rodapé da página.
- **Group A** (Group) - Contêiner principal da página.
  - **Group B** (Group) - Grupo que agrupa o título do evento, a descrição e o preço.
    - **Group D** (Group) - Grupo para o título e a descrição do evento.
      - **Text B** (Text) - Título do evento: "Imersão: Inovação no Fluxo Digital & Implantodontia".
      - **Text C** (Text) - Descrição do evento: "A Conexão Sistemas de Prótese convida você para uma experiência prática e ao vivo demonstrando o fluxo digital completo e validado para o seu sucesso na reabilitação sobre implantes."
    - **Group Q** (Group) - Grupo que exibe o preço do evento.
      - **Group Q** (Group) - Grupo que agrupa os componentes do preço.
        - **Text I** (Text) - Símbolo da moeda: "R$".
        - **Text I** (Text) - Valor inteiro do preço: "500".
        - **Text I** (Text) - Valor decimal do preço: ",00".

---

### Workflow bTNkV

# Workflow bTNkV

**Trigger:** `InputChanged`

## Summary

Este workflow é acionado quando um input sofre uma alteração, rolando a página para exibir o input que sofreu a alteração.

## Actions

1.  **ScrollToElement** - Rola a página para exibir o elemento `Input do Cadastro` (ID: bTNfb).

### Workflow bTNmq

# Criar Evento VIP com dados do formulário

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado. Ele primeiramente torna um elemento visível e, em seguida, cria uma nova entrada do tipo "evento_vip" com dados extraídos de vários elementos de entrada.

## Actions

1.  **ShowElement** - Torna o elemento "bTOFO" visível.
2.  **NewThing** - Cria uma nova entrada do tipo `custom.evento_vip` com os seguintes campos:
    - `vip_cidade_text` = Valor do elemento "bTNNP".
    - `cpf_text` = Valor do elemento "bTNMZ".
    - `vip_cro_text` = Valor do elemento "bTNMh".
    - `vip_estado_text` = Valor do elemento "bTNNV".
    - `nome_text` = Valor do elemento "bTNLw".
    - `vip_tag_text` = "APCD" se o valor do elemento "bTNfb" for "Sócio APCD / Aluno FAOA", caso contrário "LEAD".
    - `vip_whatsapp_text` = Valor do elemento "bTNND".
    - `valor_number` = 50 (adicionado).
    - `email_text` = Valor do elemento "bTONx".
    - `confirmado_boolean` = false.
    - `numero_sorteio_text` = Gera uma string aleatória de 5 números.

(Nota: A ação de API call foi truncada nos dados fornecidos.)

### Workflow bTNnC

# Criar Evento VIP

**Trigger:** `ButtonClicked` (Elemento: `bTNfb`)

## Summary

Este workflow é acionado quando o botão "Não sou Sócio" é clicado. Ele exibe um elemento, cria um novo "Evento VIP" com dados extraídos de vários campos de entrada e envia esses dados para uma API.

## Actions

1.  **Show Element** (`bTOFZ`) - Exibe o elemento com ID `bTOFO`.
2.  **Create a new Thing** (`bTOBS`) - Cria um novo registro do tipo `Evento VIP` com os seguintes valores:
    - `vip_cidade_text`: Valor do elemento `bTNNP`.
    - `cpf_text`: Valor do elemento `bTNMZ`.
    - `vip_cro_text`: Valor do elemento `bTNMh`.
    - `vip_estado_text`: Valor do elemento `bTNNV`.
    - `nome_text`: Valor do elemento `bTNLw`.
    - `vip_tag_text`: "APCD" se o elemento `bTNfb` for "Sócio APCD / Aluno FAOA", caso contrário "LEAD".
    - `vip_whatsapp_text`: Valor do elemento `bTNND`.
    - `valor_number`: 500 (adicionado).
    - `email_text`: Valor do elemento `bTONx`.
3.  **API Call** (`bTNYZ`) - Realiza uma chamada para a API com os seguintes parâmetros:
    - `body_params_uf_cliente`: `vip_estado_text` do passo anterior (`bTOBS`).
    - `body_params_cpf_cliente`: `cpf_text` do passo anterior (`bTOBS`).

## lp_evento_vip

# lp_evento_vip

## Summary

A página `lp_evento_vip` é uma landing page focada em um evento VIP. Sua estrutura visual é organizada em grupos, adaptando-se a diferentes tamanhos de tela, com um botão principal de chamada para ação.

### UI

- **Group A** (Group) - Container principal da página, com centralização vertical e colapso quando oculto.
  - **Group B** (Group) - Container interno, com centralização vertical e colapso quando oculto.
    - **Button F** (Button) - Botão de chamada para ação com o texto "QUERO PARTICIPAR" e um ícone de estrela. Possui estados visuais para diferentes larguras de tela e interações de hover/clique.
    - **Group C** (Group) - Container interno, com centralização vertical e colapso quando oculto.

### Workflows

Não há workflows definidos para esta página com base nos dados fornecidos.

### Workflow bTNPh

# Abrir Link de Inscrição VIP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo redirecionar o usuário para uma página externa.

## Actions

1.  **Open an external website** - Abre o URL `https://www.google.com/` em uma nova aba.

### Workflow bTNcD

# Rolar para elemento na página VIP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e rola a página para um elemento específico.

## Actions

1.  **ScrollToElement** - Rola a página para o elemento especificado com um offset de -104 pixels.

### AÇÃO: Cadastrar cliente VIP

# AÇÃO: Cadastrar cliente VIP

**Trigger:** `ButtonClicked` (elemento `bTNvR`)

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo cadastrar um novo cliente VIP no sistema. Ele cria um novo registro do tipo `evento_vip`, preenchendo os campos com os dados dos inputs e gerando um número de sorteio aleatório. Antes de criar, verifica se já existe um cliente VIP com o mesmo CPF.

## Actions

1.  **ShowElement**: Exibe o elemento com ID `bTOFg`.
2.  **NewThing**: Cria um novo registro do tipo `evento_vip`.
    - **vip\_cidade\_text**: Captura o valor do input `bTOSu`.
    - **cpf\_text**: Captura o valor do input `bTNuo`.
    - **vip\_cro\_text**: Captura o valor do input `bTNuu`.
    - **vip\_estado\_text**: Captura o valor do input `bTNvN`.
    - **nome\_text**: Captura o valor do input `bTNuh`.
    - **vip\_tag\_text**: Define como "CONEXÃO".
    - **vip\_whatsapp\_text**: Captura o valor do input `bTNvA`.
    - **convidado\_por\_text**: Captura o valor do input `bTOGn`.
    - **email\_text**: Captura o valor do input `bTOOP`.
    - **confirmado\_boolean**: Define como `false`.
    - **numero\_sorteio\_text**: Gera uma string aleatória de 5 caracteres numéricos.
    - **valor\_number**: Define como `0`.
3.  **Search**: Realiza uma busca por registros do tipo `evento_vip`.
    - **Condição**: O campo `cpf_text` do registro buscado é igual ao valor do input `bTNuo`.
4.  **Conditional**: Se a condição (busca anterior) for verdadeira (encontrou um registro com o mesmo CPF):
    - **ShowElement**: Exibe o elemento com ID `bTNu9`.
5.  **Conditional**: Se a condição (busca anterior) for falsa (não encontrou registro com o mesmo CPF):
    - **ChangePage**: Redireciona para a página `lp_obrigado` (ID `bTOPK`).

### Workflow bTNxR

# Workflow bTNxR

**Trigger:** `ButtonClicked`

## Summary

Este workflow é ativado quando um botão é clicado e tem como objetivo esconder um elemento específico na página.

## Actions

1.  **Hide Element** - Esconde o elemento com o ID `bTNwt`.

### Workflow bTOfS

# Workflow bTOfS

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo alternar a visibilidade de um elemento específico.

## Actions

1. **ToggleElement** - Alterna a visibilidade do elemento com ID `bTOei`.

### Workflow bTOfZ

# Workflow lp_evento_vip - Toggle Element

**Trigger:** `ButtonClicked`

## Summary

Este workflow ativa/desativa um elemento na página `lp_evento_vip`.

## Actions

1. **Toggle Element** - Alterna a visibilidade do elemento com ID `bTOeu`.

---

### Workflow bTOfj

```markdown
# Workflow lp_evento_vip - Abrir/Fechar Elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado pelo clique de um botão e sua função é alternar a visibilidade de um elemento específico.

## Actions

1. **Toggle Element** - Alterna a visibilidade do elemento '**Button - VIP**'.
```

## lp_evento_lista_giselma

# lp_evento_lista_giselma

## Summary

Página para exibir a lista de inscritos em um evento, com contagem total e uma prévia da faturação.

### UI

- **Group A** (Group) - Container principal da página.
  - **Group E** (Group) - Container para os textos de resumo.
    - **Group E** (Group) - Container para os textos de resumo.
      - **Group** (Group) - Container para elementos internos.
        - **Group** (Group) - Container para elementos internos.
          - **Group** (Group) - Container para o número total de inscritos e prévia de faturamento.
            - **Text D** (Text) - Exibe o "Total de Inscritos" e seu valor.
            - **Text E** (Text) - Exibe a "Prévia Fat." e seu valor formatado (oculto por padrão).

### Workflows

- **Page Loaded**: Trigger →

---

### AÇÃO: Confirmar presença

# AÇÃO: Confirmar presença

**Trigger:** `ButtonClicked`

## Summary

Este workflow atualiza o status de confirmação de um evento e envia os dados do participante para uma API externa.

## Actions

1.  **Make changes to evento_es...** - Altera o campo `confirmado_boolean` para `true` no registro do evento.
2.  **apiconnector2-bTMUV.bTOOZ** - Envia os dados do participante (status, UF, CPF, CRO, nome, email, tipo de cadastro, WhatsApp, cidade e número de sorteio) para a API.

---

### Workflow bTOYF

# Atualizar Elemento Página

**Trigger:** `Page is Loaded` (Implícito pelo contexto de `pageId` e `pageName`)

## Summary

Este workflow é acionado quando a página "lp_evento_lista_giselma" é carregada, com a intenção de atualizar um elemento específico.

## Actions

1. **Atualizar Elemento** - Modifica as propriedades do elemento "ElementParent".

### Workflow bTOYR

# Gerar número de sorteio

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo gerar e salvar um número de sorteio aleatório em um campo específico.

## Actions

1.  **Change Thing** - Altera o campo `numero_sorteio_text` no elemento pai. O valor atribuído é uma string aleatória de 5 caracteres, contendo apenas números.

### Workflow bTPBy

# Workflow bTPBy

**Trigger:** `ButtonClicked`

## Summary

Este workflow atualiza o custom state 'tipo_' de um elemento para "CONEXÃO" quando um botão é clicado.

## Actions

1.  **Set custom state** - Define o custom state `tipo_` do elemento `bTNxh` para o valor `CONEXÃO`.

### Workflow bTPCD

# Definir Lead no Estado Personalizado

**Trigger:** `ButtonClicked`

## Summary

Define o estado personalizado "tipo_" do elemento com ID "bTNxh" como "LEAD".

## Actions

1. **Definir Estado Personalizado** - Define o estado personalizado `custom.tipo_` do elemento com ID `bTNxh` para o valor `LEAD`.

### Workflow bTPCF

# Workflow bTPCF

**Trigger:** `ButtonClicked` (`bTNxh`)

## Summary

Este workflow é acionado quando um botão é clicado. Sua principal ação é definir um estado personalizado (`custom.tipo_`) em um elemento não especificado, atribuindo um valor pré-definido.

## Actions

1.  **Set custom state** (`bTOCZ`) - Define o estado `custom.tipo_` (`bTNxh`) para o valor `APCD`.

### AÇÃO: Baixar lista de inscritos

# AÇÃO: Baixar lista de inscritos

**Trigger:** `ButtonClicked`

## Summary

Este workflow inicia o download de uma lista de inscritos em formato CSV, contendo informações detalhadas de cada participante e seu status de confirmação.

## Actions

1.  **Download the list of attendees** - Gera e disponibiliza um arquivo CSV com os dados dos inscritos.
    - Headers do CSV: `NOME,CPF,CRO,EMAIL,WHATSPP,CIDADE,ESTADO,TIPO,CONVIDADO_POR,NUMERO_SORTEIO,COFIRMADO`
    - Conteúdo das colunas:
      - `NOME`: Valor do campo `nome_text`.
      - `CPF`: Valor do campo `cpf_text`.
      - `CRO`: Valor do campo `vip_cro_text`.
      - `EMAIL`: Valor do campo `email_text`.
      - `WHATSPP`: Valor do campo `vip_whatsapp_text`.
      - `CIDADE`: Valor do campo `vip_cidade_text`.
      - `ESTADO`: Valor do campo `vip_estado_text`.
      - `TIPO`: Valor do campo `vip_tag_text`.
      - `CONVIDADO_POR`: Valor do campo `convidado_por_text`.
      - `NUMERO_SORTEIO`: Formata o campo `numero_sorteio_text` caso não seja vazio.
      - `COFIRMADO`: Formata o campo `confirmado_boolean` como "Confirmado" se verdadeiro, ou "Aguardando" se falso.

### AÇÃO: Resetar dropdown tag

# AÇÃO: Resetar dropdown tag

**Trigger:** `ButtonClicked`

## Summary

Este workflow reseta o estado customizado de um elemento específico.

## Actions

1. **SetCustomState** - Define o estado customizado `custom.tipo_` do elemento com ID `bTNxh` como vazio.

---

## encurtar_link_evento

# encurtar_link_evento

## Summary

Página para encurtar links de eventos. Permite buscar inscritos e gerar um link encurtado.

### UI

- **Group A** (Group) - Grupo principal da página.
  - **Group E** (Group) - Container para o dropdown e botão.
    - **Group G** (Group) - Container para o dropdown e botão.
      - **Dropdown A** (Dropdown) - Seleciona o tipo de página ou busca inscritos.
      - **Button A** (Button) - Botão para encurtar o link. Estilo: Icone de link.
    - **Group B** (Group) - Exibe a URL encurtada.
      - **Text A** (Text) - Exibe a URL encurtada gerada.

- **Popup A** (Popup) - Popup padrão.
  - **disabletext A** (REDACTED) - Elemento não especificado.

### Workflows

- **Button A Clicked**: Button Clicked → Chamada de API `apiconnector2-bTOIr.bTOIy` → Exibir dados do grupo `URL ENCURTADA`.

---

### Workflow bTOKw

# Encurtar Link do Evento

**Trigger:** `Button Clicked` (Elemento relacionado: `bTOJu`)

## Summary

Este workflow é acionado quando um botão específico é clicado. Ele chama uma API para encurtar um link e, em seguida, exibe os dados retornados pela API.

## Actions

1.  **Chamada API (API Connector):** Executa a chamada `bTOIy` do conector `apiconector2-bTOIr`.
    - **Parâmetros de Body (`body_params_alias`):** Concatena "/" com o resultado de `GetElement` (elemento `bTOJu`) e o valor `last_element`.
    - **Parâmetros de Body (`body_params_url_para_encurtar`):** Obtém o valor `link` do resultado de `GetElement` (elemento `bTOJu`).
2.  **Exibir Dados do Grupo:** Exibe os dados do grupo.
    - **Fonte de Dados (`data_source`):** Obtém o URL (`_api_c2_data.url`) do passo anterior (chamada API `bTOLC`).
    - **Elemento (`element_id`):** `bTOLH`.

## linktree

# linktree

## Summary

Página que exibe um logo e botões estilizados com ícones para redes sociais e contato. Contém elementos de branding e interatividade para links.

### UI

- **Group A** (Group) - Container principal da página.
  - **particles-js** (Group) - Grupo sem propósito aparente no momento.
    - **Group B** (Group) - Container para o cabeçalho.
      - **Image A** (Image) - Exibe o logo da empresa "Conexão".
- **Group C** (Group) - Container para os links e botões principais.
  - **Group E** (Group) - Container para o botão "Fale com o SAC" e ícone do WhatsApp.
    - **Button A** (Button) - Botão com texto "Fale com o SAC" e ícone de estrela.
    - **Icon A** (Icon) - Ícone do WhatsApp.
  - **Group F** (Group) - Container para o botão "@conexaoimplants" e ícone do Instagram.

### Workflows

- **Page Linked** (Custom Event) → Ação 1 (Change Page) → Ação 2 (Open another external website) → Ação 3 (Open another external website)

---

### Workflow bTHGB

# Abrir WhatsApp

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e abre um link direto para o WhatsApp com uma mensagem pré-definida.

## Actions

1.  **Open URL** - Abre a URL `https://wa.me/5511969034531?text=Ol%C3%A1%2C%20pode%20me%20auxiliar%3F` no navegador.

### Workflow bTHGJ

# Abrir Instagram Conexão Implants

**Trigger:** `ButtonClicked`

## Summary

Este workflow abre o perfil do Instagram da "Conexão Implants" em uma nova aba.

## Actions

1.  **Abrir URL** - Abre a URL `https://www.instagram.com/conexaoimplants_` em uma nova aba.

### Workflow bTHGU

# Abrir URL LinkedIn

**Trigger:** `ButtonClicked`

## Summary

Ao clicar em um botão, abre a URL da página da empresa no LinkedIn.

## Actions

1.  **Open URL** - Abre o link `https://www.linkedin.com/company/conexaoimplants/` em uma nova aba.

### Workflow bTHGf

```markdown
# Workflow Abrir link YouTube

**Trigger:** `ButtonClicked`

## Summary

Este workflow abre um link externo no navegador.

## Actions

1. **Abrir URL** - Abre a URL "https://www.youtube.com/@conexaoimplants" em uma nova aba.
```

### Workflow bTHGn

# Abrir URL Conexão Evento

**Trigger:** `ButtonClicked`

## Summary

Redireciona o usuário para um link externo ao clicar em um botão.

## Actions

1.  **Open URL**: Redireciona para a URL `https://www.conexao.com.br`.

### Workflow bTHHJ

# Abrir Waze com Endereço

**Trigger:** `ButtonClicked`

## Summary

Este workflow abre o aplicativo Waze com um endereço pré-preenchido e codificado para URL.

## Actions

1.  **Open URL** - Abre a URL `https://waze.com/ul?q=Av.%20Osaka%2C%20950%20-%20Centro%20Industrial%2C%20Arujá%20-%20SP%2C%2007432-575` no navegador. A URL é construída combinando um texto fixo e o endereço, que é codificado para ser compatível com URLs.

### Workflow bTONk

# Abrir URL Tinyurl

**Trigger:** `ButtonClicked`

## Summary

Abre um URL externo em uma nova aba.

## Actions

1.  **Open an external website** - Abre o URL `https://tinyurl.com/internacional-02` em uma nova aba.

### Workflow bTOhK

# Abrir WhatsApp Pedido

**Trigger:** `Button - Botão Enviar Pedido Clicked`

## Summary

Este workflow é acionado quando o botão "Botão Enviar Pedido" é clicado na página "linktree", abrindo uma conversa no WhatsApp com um link predefinido.

## Actions

1.  **Open URL** - Abre a URL especificada: `https://wa.me/5511972939804?text=Ol%C3%A1,%20gostaria%20de%20fazer%20um%20pedido`

### Workflow length

# Workflow Linktree Finalizar Compra

**Trigger:** `Button LIKETREE FINALIZAR COMPRA Clicked`

## Summary

Este workflow é acionado ao clicar no botão "LIKETREE FINALIZAR COMPRA" na página "linktree". Ele redireciona o usuário para a página "reset_pw".

## Actions

1.  **Change Page** - Redireciona para a página **reset_pw**.

## lp_obrigado

# lp_obrigado

## Summary

Página de agradecimento exibida após a inscrição em um evento. Informa ao usuário que a confirmação e os detalhes da inscrição serão enviados por e-mail.

### UI

- **Group A** (Group) - Container principal com centralização vertical.
  - **Group B** (Group) - Cabeçalho do popup.
    - **Group B** (Group) - Container do ícone de sucesso.
      - **Icon A** (Icon) - Exibe um ícone de círculo de verificação (check-circle).
    - **Text A** (Text) - Título do popup: "Inscrição Realizada!".
    - **Text B** (Text) - Mensagem de confirmação e próximos passos, informando sobre o e-mail com número de inscrição e sorteio. Inclui uma saudação da "Equipe Conexão".

### Workflows

- **PageLoaded**: Workflow executado quando a página é carregada.
  - Set title of page to "gestao-contratos-conexao"
  - Change the page title of lp_obrigado to "gestao-contratos-conexao"

## lp_evento_lista

# lp_evento_lista

## Summary

Página principal para listagem de eventos, permitindo visualização, filtragem e acesso a detalhes.

### UI

- **Group A** (Group) - Container principal da página.
  - **Group E** (Group) - Container para filtros e ações de lista.
    - **Group** (Group) - Container para elementos de filtragem e busca.
      - **Group** (Group) - Container para ícones e dropdown de tipo.
        - **Group** (Group) - Container para ícone de recarregar.
          - **Icon A** (Icon) - Ícone para recarregar a lista de eventos.
        - **Dropdown A** (Dropdown) - Dropdown para filtrar eventos por tipo (VIP).
      - **Group** (Group) - Container para ícone e texto de download de inscritos.
        - **Icon B** (Icon) - Ícone de download.
        - **CreateFile A** (REDACTED) - Elemento para gerar arquivo de inscritos.
        - **Text F** (Text) - Rótulo "APCD".
        - **Text G** (Text) - Rótulo "LEAD".
        - **Text H** (Text) - Rótulo "INSCRIÇÃO".
        - **Text J** (Text) - Rótulo "PAGAMENTO".
        - **Text K** (Text) - Rótulo "STATUS".
        - **Text L** (Text) - Rótulo "AÇÕES".
        - **Text M** (Text) - Rótulo "Tipo".
        - **Dropdown B** (Dropdown) - Dropdown para filtrar por tipo de evento.
      - **Input A** (Input) - Campo de busca por nome do evento.
      - **Button A** (Button) - Botão para iniciar a busca.

### Workflows

Não há workflows definidos diretamente nesta página.

### AÇÃO: Resetar dropdown tag

# AÇÃO: Resetar dropdown tag

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo resetar o estado personalizado de um elemento.

## Actions

1.  **SetCustomState** - Define o estado personalizado `custom.tipo_` do elemento `bTOTM` para vazio.

---

### AÇÃO: Baixar lista de inscritos

# AÇÃO: Baixar lista de inscritos

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão específico é clicado e sua função principal é gerar e baixar um arquivo CSV contendo a lista de inscritos do evento, formatando os dados conforme necessário.

## Actions

1.  **Create a CSV file** - Cria um arquivo CSV para download com os dados de todos os inscritos.
    - **File name:** `Lista de inscritos - {current date}`
    - **Content:**
      - Header row: `NOME,CPF,CRO,EMAIL,WHATSPP,CIDADE,ESTADO,TIPO,CONVIDADO_POR,NUMERO_SORTEIO,COFIRMADO`
      - Data rows: Para cada inscritos (presume-se que a fonte de dados seja uma lista de inscritos):
        - `nome_text` (Nome do inscrito)
        - `,`
        - `cpf_text` (CPF do inscrito)
        - `,`
        - `vip_cro_text` (CRO do inscrito, se aplicável)
        - `,`
        - `email_text` (Email do inscrito)
        - `,`
        - `vip_whatsapp_text` (WhatsApp do inscrito)
        - `,`
        - `vip_cidade_text` (Cidade do inscrito)
        - `,`
        - `vip_estado_text` (Estado do inscrito)
        - `,`
        - `vip_tag_text` (Tipo/Tag do inscrito)
        - `,`
        - `convidado_por_text` (Convidado por quem)
        - `,`
        - `numero_sorteio_text` (Número do sorteio, se houver)
        - `,`
        - `confirmado_boolean` (Status de confirmação do inscrito, exibindo "Confirmado" ou "Aguardando")

### Workflow bTOCN

# Definir Tipo de Conexão

**Trigger:** `Button Clicked`

## Summary

Define o estado customizado 'custom.tipo_' como "CONEXÃO" ao clicar um botão.

## Actions

1.  **Definir Estado Customizado** - Define o estado customizado 'custom.tipo_' do elemento 'bTOTM' (não especificado no mapa de referências) para o valor "CONEXÃO".

### Workflow bTOCV

# Workflow bTOCV

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado quando um botão é clicado, com o objetivo de definir um estado customizado em um elemento.

## Actions

1.  **Definir Estado Customizado** - Define o estado customizado `custom.tipo_` do elemento `custom.tipo_` com o valor `APCD`.

### Workflow bTOCg

# Workflow lp_evento_lista - Define tipo de Lead

**Trigger:** `ButtonClicked`

## Summary

Este workflow define o estado customizado 'tipo_de_lead' do elemento 'Custom state of lp_evento_lista" como "LEAD" quando um botão é clicado.

## Actions

1. **Define state of element** - Define o custom state `custom.tipo_` do elemento 'Custom state of lp_evento_lista' (ID: **bTOTM**) para o valor "LEAD".

### Workflow bTOSi

# Workflow Gerar Número Sorteio

**Trigger:** `ButtonClicked` (elemento "Button Gerar Sorteio" na página "lp_evento_lista")

## Summary

Este workflow é acionado quando o botão "Button Gerar Sorteio" é clicado. Ele gera uma string aleatória de 5 dígitos numéricos e a salva no campo `numero_sorteio_text` do elemento pai.

## Actions

1.  **Create a new thing** - As informações exatas sobre quais dados estão sendo criados ou modificados não estão explícitas na estrutura fornecida. Este passo parece modificar um "Thing" relacionado ao elemento pai.
    - **Numero_sorteio_text:** Gera uma string aleatória de 5 dígitos numéricos.

## lp_evento_es

# lp_evento_es

## Summary

Página de Landing Page focada em um evento de imersão sobre inovação em fluxo digital e implantologia, promovido pela Conexão Sistemas de Prótese. Apresenta detalhes do evento, palestrantes e um botão para confirmar a assistência.

### UI

- **Group A** (Group) - Contêiner principal da página.
  - **Group D** (Group) - Agrupa o título, descrição e botão de confirmação.
    - **Text B** (Text) - Título do evento: "Inmersión: Innovación en Flujo Digital e Implantología".
    - **Text C** (Text) - Descrição do evento, destacando a experiência prática, os palestrantes (Luís Mayer e José Márcio) e o tema de reabilitação de implantes.
    - **Button A** (Button) - Botão com o texto "CONFIRMAR ASISTENCIA" e um ícone de estrela.

### Workflows

- **Button A Clicked**:
  1. **Change Page** → Redireciona para a página `lp_cadastro`.

### AÇÃO: Cadastrar cliente VIP

# AÇÃO: Cadastrar cliente VIP

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo cadastrar um cliente VIP. Ele verifica se um evento com um CPF específico já existe, exibe um elemento, oculta outro, e em seguida cria um novo registro do tipo "evento" com os dados preenchidos.

## Actions

1.  **Show Element**: Exibe o elemento **ElementPopup** (ID: bTOnK).
2.  **Hide Element**: Oculta o elemento **ElementPopup_ShowHide** (ID: bTOtQ).
3.  **Create a new thing**: Cria um novo `evento` com os seguintes campos:
    - `vip_cidade_text` = Valor do input **Input_Cidade** (ID: bTOuR).
    - `cpf_text` = Valor do input **Input_CPF** (ID: bTOto).
    - `vip_cro_text` = Valor do input **Input_CRO** (ID: bTOtv).
    - `vip_estado_text` = Valor do input **Input_Estado** (ID: bTOuL).
    - `nome_text` = Valor do input **Input_Nome** (ID: bTOtd).
    - `vip_tag_text` = "INTERNACIONAL".
    - `vip_whatsapp_text` = Valor do input **Input_WhatsApp** (ID: bTOuB).
    - `convidado_por_text` = Valor do input **Input_ConvidadoPor** (ID: bTOue).
    - `email_text` = Valor do input **Input_Email** (ID: bTOuk).
    - `confirmado_boolean` = `false`.
    - `numero_sorteio_text` = String aleatória de 5 caracteres numéricos.
    - `valor_number` = `0`.

### Workflow bTOxG

# Workflow Salva Dados Evento

**Trigger:** `ButtonClicked`

## Summary

Este workflow é disparado ao clicar em um botão e sua única ação é ocultar um elemento específico.

## Actions

1. **Ocultar Elemento** - Oculta o elemento com ID técnico 'bTOmt'.

### Workflow bTOxj

# Workflow lp_evento_es - Ocultar elemento

**Trigger:** `Button` (Elemento: `Elemento bTOtQ`)

## Summary

Este workflow oculta um elemento específico quando um botão é clicado.

## Actions

1.  **HideElement** - Oculta o elemento com ID `bTOtQ`.

### Workflow bTOyD

# Workflow para exibir elemento

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão para exibir um elemento específico na página.

## Actions

1. **Exibir elemento (`ShowElement`)** - Torna visível o elemento com ID `bTOtQ` na página `lp_evento_es`.

## lp_evento_pt

# lp_evento_pt

## Summary

Página de landing page para um evento sobre inovação em implantodontia. Apresenta o título do evento, descrição, e um botão para confirmar presença.

### UI

- **Group A** (Group) - Contêiner principal da página.
  - **Group D** (Group) - Agrupamento de elementos de texto e botão.
    - **Text B** (Text) - Título do evento "Imersão: Inovação no Fluxo Digital e Implantodontia".
    - **Text C** (Text) - Descrição do evento, convidando para uma experiência prática com o fluxo de trabalho digital.
    - **Button A** (Button) - Botão com o texto "CONFIRMAR PRESENÇA".

### Workflows

Não há workflows definidos para esta página.

---

### AÇÃO: Cadastrar cliente VIP

# AÇÃO: Cadastrar cliente VIP

**Trigger:** `ButtonClicked` (Elemento: `bTPGl` - `lp_evento_pt`)

## Summary

Este workflow é acionado quando um botão é clicado e tem como objetivo cadastrar um novo evento para um cliente VIP. Ele exibe um pop-up, cria um novo registro de evento com os dados fornecidos, atualiza um evento existente e envia uma solicitação para um endpoint de API.

## Actions

1.  **Exibir elemento**: `bTPEO` - Exibe o pop-up de cadastro de cliente VIP.
2.  **Ocultar elemento**: `bTPEU` - Oculta o pop-up de cadastro de cliente VIP.
3.  **Criar novo Adicionar um `custom.evento`**:
    - `vip_cidade_text` = `bTPFP` (valor do input `bTPFP`)
    - `cpf_text` = `bTPEm` (valor do input `bTPEm`)
    - `vip_cro_text` = `bTPEt` (valor do input `bTPEt`)
    - `vip_estado_text` = `bTPFJ` (valor do input `bTPFJ`)
    - `nome_text` = `bTPEb` (valor do input `bTPEb`)
    - `vip_tag_text` = `"INTERNACIONAL"`
    - `vip_whatsapp_text` = `bTPEz` (valor do input `bTPEz`)
    - `email_text` = `bTPFi` (valor do input `bTPFi`)
    - `confirmado_boolean` = `true`
    - `numero_sorteio_text` = String aleatória de 5 dígitos
    - `valor_number` = `0`
4.  **Chamar API público** (Endpoint: `uf_cliente`) - Envia dados para um endpoint de API:
    - `body_params_status` = `"confirmado"`
    - `body_params_uf_cliente` = `vip_estado_text` (valor da etapa anterior: `bTPGM`)

### Workflow bTOxG

# Esconder Elemento de Form

**Trigger:** `ButtonClicked`

## Summary

Este workflow esconde um elemento específico quando um botão é clicado.

## Actions

1.  **Hide Element** - Esconde o elemento com ID `bTPFo`.

### Workflow bTOxj

# Workflow lp_evento_pt - Ocultar Elemento Modal

**Trigger:** `ButtonClicked` (Elemento: `Button Close Modal Ticket pt` - ID: `bTPFn`)

## Summary

Este workflow oculta um elemento modal ao ser acionado.

## Actions

1. **Hide Element** - Oculta o elemento com `ID: bTPEU`.

### Workflow bTOyD

# Workflow Salvar Link Evento

**Trigger:** `ButtonClicked`

## Summary

Este workflow é acionado ao clicar em um botão e tem como objetivo exibir um elemento específico na página.

## Actions

1. **Show Element**: Exibe o elemento com ID `bTPEU`.

---

# Elementos Reutilizáveis

_Nenhum elemento reutilizável encontrado._
---

# Backend Workflows

_Nenhum backend workflow encontrado._
---

# Chamadas de API (API Connectors)

## BUSCA CNPJ - CNPJ.WS

# BUSCA CNPJ - CNPJ.WS

## Summary

Este conector de API integra com o serviço CNPJ.WS para realizar consultas detalhadas de informações cadastrais de empresas pelo CNPJ. Ele permite recuperar dados como razão social, capital social, natureza jurídica, informações do estabelecimento e status fiscal.

## Calls

| Call           | Método | Path                |
| -------------- | ------ | ------------------- |
| Consultar CNPJ | GET    | /api/v1/cnpj/{cnpj} |

---

### Consultar CNPJ

# Consultar CNPJ

## Summary

Chamada de API para consultar informações de um CNPJ, retornando dados cadastrais, de estabelecimento e situação fiscal.

## Detalhes

| Propriedade  | Valor                            |
| ------------ | -------------------------------- |
| Método       | GET                              |
| Path         | api-connectors/bTIwu/calls/bTIwz |
| Autenticação | Não especificada                 |

## Parâmetros

| Nome | Tipo | Obrigatório |
| ---- | ---- | ----------- |
| CNPJ | text | Sim         |

## Response

A resposta contém informações detalhadas do CNPJ, incluindo:

- `cnpj_raiz`: CNPJ raiz.
- `razao_social`: Razão social da empresa.
- `capital_social`: Valor do capital social.
- `responsavel_federativo`: Nome do responsável federativo.
- `atualizado_em`: Data de atualização dos dados.
- `porte`: Informações sobre o porte da empresa (ID e descrição).
- `natureza_juridica`: Informações sobre a natureza jurídica (ID e descrição).
- `qualificacao_do_responsavel`: Informações sobre a qualificação do responsável (ID e descrição).
- `simples`: Detalhes sobre o regime Simples Nacional (status, datas, MEI).
- `estabelecimento`: Dados do estabelecimento principal (CNPJ, nome fantasia, endereço, contatos, situação cadastral, etc.).
- `estabelecimento.atividades_secundarias`: Lista de atividades secundárias do estabelecimento.

## Buscar DDI

# Buscar DDI

## Summary

Este conector de API busca informações detalhadas sobre países, incluindo códigos DDI, capitais, moedas, populações e nomes em diferentes idiomas.

## Calls

| Call       | Método | Path |
| ---------- | ------ | ---- |
| Buscar DDI | GET    | /all |

### cURL Call

# cURL Call

## Summary

Esta API Call é responsável por buscar informações gerais sobre países, incluindo dados demográficos, geográficos e governamentais.

## Detalhes

| Propriedade  | Valor                            |
| ------------ | -------------------------------- |
| Método       | GET                              |
| Path         | api-connectors/bTPab/calls/bTPac |
| Autenticação | None                             |

## Parâmetros

Esta API Call não possui parâmetros configurados.

## Response

O retorno desta API Call é uma lista de objetos, onde cada objeto representa um país e contém informações detalhadas sobre ele. Exemplos de campos retornados incluem:

- `objects.region`: A região do país.
- `objects.subregion`: A sub-região do país.
- `objects.area`: A área territorial do país.
- `objects.borders`: Uma lista de códigos dos países vizinhos.
- `objects.calling_codes`: Uma lista dos códigos telefônicos de discagem.
- `objects.cars`: Informações sobre as placas de carro.
- `objects.classification`: Classificação do país.
- `objects.continents`: Uma lista dos continentes aos quais o país pertence.
- `objects.coordinates`: As coordenadas geográficas (latitude e longitude).
- `objects.currencies`: Uma lista de moedas utilizadas no país.
- `objects.date`: Informações sobre datas relevantes.
- `objects.demonyms`: O gentílico do país.
- `objects.economy`: Dados econômicos do país.
- `objects.government_type`: O tipo de governo.
- `objects.landlocked`: Indica se o país é sem saída para o mar.
- `objects.languages`: Uma lista de idiomas falados no país.
- `objects.leaders`: Informações sobre os líderes do país.
- `objects.links`: Links relacionados ao país.
- `objects.memberships`: Membresias em organizações internacionais.
- `objects.number_format`: Formato de números utilizado.
- `objects.parent`: Informações sobre o país "pai" (em caso de territórios dependentes).
- `objects.population`: A população do país.
- `objects.postal_code`: Formato do código postal.
- `objects.timezones`: Uma lista de fusos horários.
- `objects.tlds`: Uma lista de Top-Level Domains.
- `objects.uuid`: Identificador único do país.
- `objects.names`: Contém o nome do país em diferentes formatos (comum, nativo, oficial, traduzido).
- `meta`: Metadados da resposta, incluindo `total`, `count`, `limit`, `offset`, `more`, `request_id` e `duration`.

## Consulta CNPJ

# Consulta CNPJ (API Connector)

## Summary

Este conector permite consultar informações de CNPJ através da API da CNPJ.

## Calls

| Call        | Método | Path           |
| ----------- | ------ | -------------- |
| Buscar CNPJ | GET    | /office/[CPNJ] |

---

### Buscar CNPJ

# Buscar CNPJ

## Summary

Esta API Call busca informações detalhadas de um CNPJ utilizando um serviço externo. Retorna dados como razão social, endereço, atividades e informações sobre sócios.

## Detalhes

| Propriedade  | Valor                                                               |
| ------------ | ------------------------------------------------------------------- |
| Método       | GET                                                                 |
| Path         | `https://api.cnpja.com/office/[CPNJ]`                               |
| Autenticação | Não especificada (mas header `bTIwp` está configurado como privado) |

## Parâmetros

| Nome | Tipo | Obrigatório |
| ---- | ---- | ----------- |
| CPNJ | text | Sim         |

## Response

A resposta é uma estrutura complexa de dados contendo um vasto conjunto de informações sobre a empresa, incluindo dados básicos, endereço, atividades econômicas, sócios, telefones e emails. As propriedades retornadas são:

- `updated`: Data da última atualização dos dados.
- `taxId`: CNPJ da empresa.
- `company`: Objeto contendo informações detalhadas da empresa:
  - `id`: ID interno da empresa.
  - `name`: Razão social da empresa.
  - `equity`: Capital social da empresa.
  - `nature`: Objeto com ID e descrição da natureza jurídica.
  - `size`: Objeto com ID, sigla e descrição do porte da empresa.
  - `members`: Lista de sócios da empresa.
- `alias`: Nome fantasia da empresa.
- `founded`: Data de fundação da empresa.
- `head`: Indica se é a sede da empresa (booleano).
- `statusDate`: Data da última alteração de status.
- `status`: Objeto com ID e descrição do status da empresa.
- `address`: Objeto com detalhes do endereço.
  - `municipality`: Código do município.
  - `street`: Logradouro.
  - `number`: Número.
  - `details`: Complemento do endereço.
  - `district`: Bairro.
  - `city`: Cidade.
  - `state`: Estado.
  - `zip`: CEP.
  - `country`: Objeto com ID e nome do país.
- `phones`: Lista de telefones da empresa.
- `emails`: Lista de emails da empresa.
- `mainActivity`: Objeto com ID e descrição da atividade principal.
- `sideActivities`: Lista de atividades secundárias da empresa.

## BUSCA CRO

# BUSCA CRO

## Summary

Este conector de API permite consultar dados de CRO (Cadastro de Representantes Oficiais) utilizando uma chave de API e parâmetros de busca como tipo, UF e nome/número. Ele retorna informações detalhadas sobre os representantes encontrados.

## Calls

| Call          | Método | Path                                                                                                          |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| Consultar CRO | GET    | https://www.consultacrm.com.br/api/index.php?tipo=[TIPO]&uf=[UF]&q=[NOME_NÚMERO]&chave=[API_KEY]&destino=json |

### Consultar CRO

# Consultar CRO

## Summary

Esta API Call busca informações de CRO (Cadastro de Pessoas Físicas) utilizando parâmetros como tipo, UF, nome/número e chave de API. Retorna dados estruturados em formato JSON.

## Detalhes

| Propriedade  | Valor                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Método       | GET                                                                                                           |
| Path         | https://www.consultacrm.com.br/api/index.php?tipo=[TIPO]&uf=[UF]&q=[NOME_NÚMERO]&chave=[API_KEY]&destino=json |
| Autenticação | Não especificada (parâmetros na URL)                                                                          |

## Parâmetros

| Nome        | Tipo | Obrigatório |
| ----------- | ---- | ----------- |
| TIPO        | text | Sim         |
| UF          | text | Sim         |
| NOME_NÚMERO | text | Sim         |
| API_KEY     | text | Sim         |

## Response

| Propriedade   | Tipo   |
| ------------- | ------ |
| url           | text   |
| total         | number |
| status        | text   |
| mensagem      | text   |
| api_limite    | text   |
| api_consultas | number |
| item          | list   |

### Estrutura do `item` (subtipo `Consultar CRO item`)

| Propriedade | Tipo |
| ----------- | ---- |
| id          | text |
| uid         | text |
| tipo        | text |
| nome        | text |
| numero      | text |
| profissao   | text |
| uf          | text |
| situacao    | text |
| link        | text |

## CONSULTAS CRO 02

# CONSULTAS CRO 02 (API Connector)

## Summary

Este conector de API integra-se à API InfoSimples para realizar consultas de cadastro de CRO (Conselho Regional de Odontologia). Ele permite buscar informações detalhadas sobre um CRO específico em uma determinada UF.

## Calls

| Call          | Método | Path                                                             |
| ------------- | ------ | ---------------------------------------------------------------- |
| Buscar CRO 02 | POST   | `https://api.infosimples.com/api/v2/consultas/cro/[UF]/cadastro` |

### Buscar CRO 02

# Buscar CRO 02

## Summary

Esta API Call realiza uma busca de informações de registro de um Conselho Regional de Odontologia (CRO) utilizando o número de inscrição e o estado (UF). Retorna detalhes do profissional e suas responsabilidades.

## Detalhes

| Propriedade  | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| Método       | POST                                                             |
| Path         | `https://api.infosimples.com/api/v2/consultas/cro/[UF]/cadastro` |
| Autenticação | Não especificada                                                 |

## Parâmetros

| Nome       | Tipo | Obrigatório                               |
| ---------- | ---- | ----------------------------------------- |
| UF         | text | Sim (path parameter)                      |
| NUMERO_CRO | text | Sim (body parameter)                      |
| TOKEN      | text | Sim (body parameter)                      |
| timeout    | text | Não (body parameter, valor padrão: "300") |

## Response

| Campo        | Tipo   | Descrição                                    |
| ------------ | ------ | -------------------------------------------- |
| code         | number | Código de status da resposta da API.         |
| code_message | text   | Mensagem correspondente ao código de status. |
| header       | object | Informações do cabeçalho da resposta da API. |
| data_count   | number | Número de registros retornados.              |
| data         | list   | Lista de registros de CRO encontrados.       |

**Detalhes do objeto `data`:**

| Campo                      | Tipo | Descrição                                   |
| -------------------------- | ---- | ------------------------------------------- |
| categoria                  | text | Categoria do profissional.                  |
| email                      | text | Email do profissional.                      |
| endereco_cidade            | text | Cidade do endereço do profissional.         |
| endereco_uf                | text | UF do endereço do profissional.             |
| especialidades             | text | Especialidades do profissional.             |
| inscricao                  | text | Número de inscrição do CRO.                 |
| inscricao_data             | text | Data de inscrição do CRO.                   |
| inscricao_tipo             | text | Tipo de inscrição.                          |
| nome                       | text | Nome completo do profissional.              |
| normalizado_inscricao_data | text | Data de inscrição normalizada.              |
| normalizado_situacao_data  | text | Data de situação normalizada.               |
| responsabilidades          | list | Lista de responsabilidades do profissional. |
| site                       | text | Site do profissional.                       |
| situacao                   | text | Situação do registro do CRO.                |
| situacao_data              | text | Data da situação do CRO.                    |
| situacao_detalhe           | text | Detalhe da situação do CRO.                 |
| telefone                   | text | Telefone do profissional.                   |
| site_receipt               | text | Site de recebimento.                        |

**Detalhes do objeto `responsabilidades`:**

| Campo                 | Tipo | Descrição                                     |
| --------------------- | ---- | --------------------------------------------- |
| tipo                  | text | Tipo da responsabilidade.                     |
| responsavel_tecnico   | text | Nome do responsável técnico.                  |
| categoria_responsavel | text | Categoria do responsável.                     |
| empresa               | text | Nome da empresa associada à responsabilidade. |
| empresa_categoria     | text | Categoria da empresa.                         |

## Encurtador Link

# Encurtador Link

## Summary

Este conector API integra um serviço para encurtar URLs. Permite a criação de links curtos através de uma chamada POST.

## Calls

| Call     | Método | Path                                     |
| -------- | ------ | ---------------------------------------- |
| Encurtar | POST   | https://api.encurtador.dev/encurtamentos |

### Encurtar

# Encurtar (API Call)

## Summary

Realiza uma chamada POST para a API externa "encurtador.dev" para encurtar uma URL.

## Detalhes

| Propriedade  | Valor                                    |
| ------------ | ---------------------------------------- |
| Método       | POST                                     |
| Path         | https://api.encurtador.dev/encurtamentos |
| Autenticação | Nenhuma (inferido pelo payload)          |

## Parâmetros

| Nome | Tipo | Obrigatório |
| ---- | ---- | ----------- |
| URL  | text | Sim         |

## Response

Retorna um objeto JSON contendo a URL encurtada no campo `urlEncurtada`.

## Evolution API

# Evolution API

## Summary

Este conector de API integra a Evolution API, permitindo o envio de mensagens de texto e mídias. Possui chamadas para enviar texto e para enviar imagens via URL.

## Calls

| Call                 | Método | Path                                                           |
| -------------------- | ------ | -------------------------------------------------------------- |
| Enviar Texto         | POST   | https://evoapi.signa-docs.com/message/sendText/Teste_7f1f7c74  |
| Enviar URL de Imagem | POST   | https://evoapi.signa-docs.com/message/sendMedia/Teste_7f1f7c74 |

### Enviar Texto

# Enviar Texto

## Summary

Esta chamada de API é usada para enviar mensagens de texto através da API EvoAPI. Ela permite especificar o número do destinatário, o texto da mensagem e um atraso opcional.

## Detalhes

| Propriedade  | Valor                                                         |
| ------------ | ------------------------------------------------------------- |
| Método       | POST                                                          |
| Path         | https://evoapi.signa-docs.com/message/sendText/Teste_7f1f7c74 |
| Autenticação | Não especificada                                              |

## Parâmetros

| Nome | Tipo | Obrigatório |
| ---- | ---- | ----------- |
| body | text | Sim         |

## Response

A resposta desta chamada de API pode conter os seguintes campos (com base nos dados fornecidos):

- `key.remoteJid` (text)
- `key.fromMe` (boolean)
- `key.id` (text)
- `pushName` (text)
- `status` (text)
- `message.conversation` (text)
- `messageType` (text)
- `messageTimestamp` (number)
- `instanceId` (text)
- `source` (text)

### Enviar URL de Imagem

# Enviar URL de Imagem

## Summary

Esta API call envia uma mídia (imagem) com legenda via URL para a API Evolution-API.

## Detalhes

| Propriedade  | Valor                                                          |
| ------------ | -------------------------------------------------------------- |
| Método       | POST                                                           |
| Path         | https://evoapi.signa-docs.com/message/sendMedia/Teste_7f1f7c74 |
| Autenticação | Nenhuma especificada                                           |

## Parâmetros

| Nome | Tipo | Obrigatório |
| ---- | ---- | ----------- |
| body | text | Sim         |

## Response

Retorna um objeto JSON contendo `id`, `jid` e informações sobre a chamada.

```json
{
  "id": "string value",
  "jid": "string value",
  "isVideo": false,
  "callDuration": 3
}
```

## Webhook N8N

# Webhook N8N

## Summary

Este conector de API integra-se com o Webhook N8N para enviar dados em massa, incluindo conteúdo e uma lista de leads.

## Calls

| Call           | Método | Path                                                                    |
| -------------- | ------ | ----------------------------------------------------------------------- |
| Envio em massa | POST   | https://primary-production-c096c.up.railway.app/webhook-test/webhook001 |

### Envio em massa

# Envio em massa (API Call)

## Summary

Realiza uma chamada POST para enviar conteúdo e uma lista de leads para um endpoint específico em um serviço externo.

## Detalhes

| Propriedade  | Valor                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Método       | POST                                                                    |
| Path         | https://primary-production-c096c.up.railway.app/webhook-test/webhook001 |
| Autenticação | Nenhuma especificada                                                    |

## Parâmetros

| Nome     | Tipo | Obrigatório |
| -------- | ---- | ----------- |
| conteudo | text | Sim         |
| leads    | text | Sim         |

## Response

Retorna o tipo `api.apiconnector2.bTMSd.bTMSe`. O campo `message` com tipo `text` é esperado.

## Webhook - Envio email Conexão

# Webhook - Envio email Conexão

## Summary

Este conector de API integra chamadas para um webhook externo, permitindo o envio de e-mails com templates pré-definidos e o registro de eventos.

## Calls

| Call                      | Método | Path                                                           |
| ------------------------- | ------ | -------------------------------------------------------------- |
| Enviar email com template | POST   | https://flows-webhook.signa-docs.com/webhook/conexao_cadastros |
| Email evento              | POST   | https://flows-webhook.signa-docs.com/webhook/evento            |

### Enviar email com template

# Enviar email com template

## Summary

Esta API Call envia um email utilizando um template pré-definido, utilizando informações do cliente, consultor e um link específico.

## Detalhes

| Propriedade  | Valor                      |
| ------------ | -------------------------- |
| Método       | POST                       |
| Path         | /webhook/conexao_cadastros |
| Autenticação | Nenhuma                    |

## Parâmetros

| Nome            | Tipo | Obrigatório |
| --------------- | ---- | ----------- |
| `nomeCliente`   | text | Não         |
| `email`         | text | Não         |
| `link`          | text | Não         |
| `nomeConsultor` | text | Não         |
| `idConsultor`   | text | Não         |
| `codigoCliente` | text | Não         |
| `acaoCliente`   | text | Não         |

## Response

O retorno esperado é um objeto com uma propriedade `message` do tipo texto.

### Email evento

# Email evento

## Summary

Configura uma chamada de API para enviar dados de evento para um webhook. Utiliza o método POST e envia informações detalhadas sobre o cliente, número do sorteio, status e dados de conexão evolucionária.

## Detalhes

| Propriedade  | Valor                                               |
| ------------ | --------------------------------------------------- |
| Método       | POST                                                |
| Path         | https://flows-webhook.signa-docs.com/webhook/evento |
| Autenticação | Não especificada                                    |

## Parâmetros

| Nome           | Tipo   | Obrigatório |
| -------------- | ------ | ----------- |
| nome_cliente   | text   | Não         |
| cpf_cliente    | text   | Não         |
| cro_cliente    | text   | Não         |
| whats_cliente  | text   | Não         |
| email_cliente  | text   | Não         |
| cidade_cliente | text   | Não         |
| uf_cliente     | text   | Não         |
| tipo_cadastro  | text   | Não         |
| numero_sorteio | number | Não         |
| status         | text   | Não         |
| zapCliente     | text   | Não         |

## Response

Não especificada.

## TINYURL

# TINYURL

## Summary

Este conector API integra funcionalidades da TinyURL para criar e gerenciar URLs encurtadas. Permite encurtar links e modificar aliases de URLs existentes.

## Calls

| Call        | Método | Path    |
| ----------- | ------ | ------- |
| Encurtar    | POST   | /create |
| Mudar alias | PATCH  | /update |

### Encurtar

# Encurtar (API Call)

## Summary

Esta API Call da TinyURL é utilizada para encurtar uma URL fornecida, permitindo a customização de um alias e oferecendo informações analíticas sobre o link gerado.

## Detalhes

| Propriedade  | Valor                          |
| ------------ | ------------------------------ |
| Método       | POST                           |
| Path         | https://api.tinyurl.com/create |
| Autenticação | Não especificada               |

## Parâmetros

| Nome              | Tipo | Obrigatório |
| ----------------- | ---- | ----------- |
| url_para_encurtar | text | Sim         |
| alias             | text | Não         |

## Body

```json
{
  "url": "<url_para_encurtar>",
  "domain": "tinyurl.com",
  "alias": "<alias>",
  "tags": null,
  "expires_at": null,
  "description": "string"
}
```

## Response

O retorno da API contém os seguintes campos:

- `domain`: O domínio utilizado para encurtar o link.
- `alias`: O alias customizado para o link encurtado.
- `deleted`: Indica se o link foi deletado.
- `archived`: Indica se o link foi arquivado.
- `analytics.enabled`: Indica se a análise de dados está habilitada.
- `analytics.public`: Indica se a análise de dados é pública.
- `created_at`: Data de criação do link.
- `expires_at`: Data de expiração do link (se definida).
- `tiny_url`: A URL encurtada gerada.
- `url`: A URL original fornecida para encurtamento.
- `code`: Código de status da requisição.

### Mudar alias

# Mudar alias

## Summary

Esta API Call atualiza o alias de uma URL encurtada através da API do TinyURL.

## Detalhes

| Propriedade  | Valor                          |
| ------------ | ------------------------------ |
| Método       | PATCH                          |
| Path         | https://api.tinyurl.com/update |
| Autenticação | Não especificada               |

## Parâmetros

| Nome         | Tipo | Obrigatório |
| ------------ | ---- | ----------- |
| alias_antigo | text | Sim         |
| alias_novo   | text | Sim         |

## Response

O retorno esperado inclui detalhes sobre a URL atualizada, como o código de status, o novo tiny_url, e informações de analytics.

## EMAILS

# EMAILS

## Summary

Este conector de API gerencia chamadas para Webhooks relacionados ao envio de emails. Inclui funcionalidades para envio de tokens, emails para consultores e para a equipe Magali, além de lidar com solicitações de correção.

## Calls

| Call                     | Método | Path                                                           |
| ------------------------ | ------ | -------------------------------------------------------------- |
| email_token              | POST   | https://flow-webhook.vpsconexao.org/webhook/token              |
| email_envio_magali       | POST   | https://flow-webhook.vpsconexao.org/webhook/email_magali       |
| email_envio_consultor    | POST   | https://flow-webhook.vpsconexao.org/webhook/email_consultor    |
| email_correcao_magali    | POST   | https://flow-webhook.vpsconexao.org/webhook/correcao_magali    |
| email_correcao_consultor | POST   | https://flow-webhook.vpsconexao.org/webhook/correcao_consultor |

### email_token

# email_token

## Summary

Chamada de API para enviar token, email e celular para um webhook.

## Detalhes

| Propriedade  | Valor                                             |
| ------------ | ------------------------------------------------- |
| Método       | POST                                              |
| Path         | https://flow-webhook.vpsconexao.org/webhook/token |
| Autenticação | Nenhuma                                           |

## Parâmetros

| Nome    | Tipo | Obrigatório |
| ------- | ---- | ----------- |
| email   | text | Sim         |
| token   | text | Sim         |
| celular | text | Sim         |

## Response

Retorna uma mensagem do webhook.

| Propriedade | Tipo |
| ----------- | ---- |
| message     | text |

### email_envio_magali

# email_envio_magali

## Summary

Esta API Call envia dados de contato de um consultor e cliente para um webhook específico, provavelmente para processamento de e-mail ou notificação.

## Detalhes

| Propriedade  | Valor                                                    |
| ------------ | -------------------------------------------------------- |
| Método       | POST                                                     |
| Path         | https://flow-webhook.vpsconexao.org/webhook/email_magali |
| Autenticação | Nenhuma especificada                                     |

## Parâmetros

| Nome            | Tipo | Obrigatório |
| --------------- | ---- | ----------- |
| nome_consultor  | text | Sim         |
| nome_cliente    | text | Sim         |
| email_envio     | text | Sim         |
| whatsapp_magali | text | Sim         |

## Response

A resposta esperada contém um campo `message` do tipo `text`.

### email_envio_consultor

# email_envio_consultor

## Summary

Realiza uma chamada POST para a API externa para enviar informações de contato de um consultor e cliente.

## Detalhes

| Propriedade  | Valor                                                       |
| ------------ | ----------------------------------------------------------- |
| Método       | POST                                                        |
| Path         | https://flow-webhook.vpsconexao.org/webhook/email_consultor |
| Autenticação | Nenhuma especificada                                        |

## Parâmetros

| Nome               | Tipo | Obrigatório |
| ------------------ | ---- | ----------- |
| nome_consultor     | text | Sim         |
| email_consultor    | text | Sim         |
| nome_cliente       | text | Sim         |
| whatsapp_consultor | text | Sim         |

## Response

Retorna um objeto com o campo `message` do tipo `text`. Exemplo: `"string value"`.

### email_correcao_magali

# email_correcao_magali

## Summary

Realiza uma chamada de API POST para notificar sobre correções no sistema, enviando detalhes do consultor, cliente e a natureza da correção.

## Detalhes

| Propriedade  | Valor                                                       |
| ------------ | ----------------------------------------------------------- |
| Método       | POST                                                        |
| Path         | https://flow-webhook.vpsconexao.org/webhook/correcao_magali |
| Autenticação | Nenhuma                                                     |

## Parâmetros

| Nome             | Tipo          | Obrigatório |
| ---------------- | ------------- | ----------- |
| nome_consultor   | text (string) | Não         |
| nome_cliente     | text (string) | Não         |
| email_magali     | text (string) | Não         |
| whatsapp_magali  | text (string) | Não         |
| motivo_correcao  | text (string) | Não         |
| quem_solicitou   | text (string) | Não         |
| data_solicitacao | text (string) | Não         |
| link_correcao    | text (string) | Não         |

## Response

Retorna um campo `message` do tipo `text`.

### email_correcao_consultor

# email_correcao_consultor

## Summary

Esta API Call envia informações de correção de um consultor para um webhook. É utilizada para notificar sobre correções necessárias em dados de consultores ou clientes.

## Detalhes

| Propriedade  | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| Método       | POST                                                             |
| Path         | `https://flow-webhook.vpsconexao.org/webhook/correcao_consultor` |
| Autenticação | Não especificada                                                 |

## Parâmetros

| Nome                | Tipo | Obrigatório |
| ------------------- | ---- | ----------- |
| nome_consultor      | text | Não         |
| email_consultor     | text | Não         |
| whatasapp_consultor | text | Não         |
| nome_cliente        | text | Não         |
| motivo_correcao     | text | Não         |
| solicitado_por      | text | Não         |
| data_solicitacao    | text | Não         |
| link_correcao       | text | Não         |

## Response

| Campo   | Tipo |
| ------- | ---- |
| message | text |

### email_correcao_cliente

# email_correcao_cliente

## Summary

Esta API Call envia dados para um webhook externo para processar correções relacionadas a clientes.

## Detalhes

| Propriedade  | Valor                                                          |
| ------------ | -------------------------------------------------------------- |
| Método       | POST                                                           |
| Path         | `https://flow-webhook.vpsconexao.org/webhook/correcao_cliente` |
| Autenticação | Não especificada                                               |

## Parâmetros

| Nome               | Tipo | Obrigatório |
| ------------------ | ---- | ----------- |
| nome_consultor     | text | Não         |
| email_consultor    | text | Não         |
| whatsapp_consultor | text | Não         |
| nome_cliente       | text | Não         |
| email_cliente      | text | Não         |
| whatsapp_cleinte   | text | Não         |
| motivo_correcao    | text | Não         |
| quem_solicitou     | text | Não         |
| data_solicitacao   | text | Não         |
| link_correcao      | text | Não         |

## Response

| Propriedade | Tipo |
| ----------- | ---- |
| message     | text |

### email_reprovacao_magali

# email_reprovacao_magali

## Summary

Esta chamada de API envia dados de reprovação de um consultor para um webhook, notificando a Magali.

## Detalhes

| Propriedade  | Valor                                                         |
| ------------ | ------------------------------------------------------------- |
| Método       | POST                                                          |
| Path         | https://flow-webhook.vpsconexao.org/webhook/reprovacao_magali |
| Autenticação | Nenhuma especificada                                          |

## Parâmetros

| Nome              | Tipo | Obrigatório |
| ----------------- | ---- | ----------- |
| nome_consultor    | text | Sim         |
| nome_cliente      | text | Sim         |
| email_magali      | text | Sim         |
| whatsapp_magali   | text | Sim         |
| motivo_reprovacao | text | Sim         |
| quem_solicitou    | text | Sim         |
| data_solicitacao  | text | Sim         |

## Response

| Propriedade | Tipo |
| ----------- | ---- |
| message     | text |

### email_reprovacao_consultor

# email_reprovacao_consultor

## Summary

Esta API Call é utilizada para enviar um email informativo sobre a reprovação de um cadastro de consultor, comunicando os detalhes e o motivo da reprovação.

## Detalhes

| Propriedade  | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| Método       | POST                                                             |
| Path         | https://flow-webhook.vpsconexao.org/webhook/reprovacao_consultor |
| Autenticação | Nenhuma especificada                                             |

## Parâmetros

| Nome               | Tipo | Obrigatório |
| ------------------ | ---- | ----------- |
| nome_consultor     | text | Sim         |
| email_consultor    | text | Sim         |
| whatsapp_consultor | text | Sim         |
| nome_cliente       | text | Sim         |
| motivo_correcao    | text | Sim         |
| solicitado_por     | text | Sim         |
| data_solicitacao   | text | Sim         |
| link_correcao      | text | Sim         |

## Response

Retorna um objeto contendo uma chave "message" do tipo text. Exemplo: `{"message": "string value"}`.

### email_reprovacao_cliente

# email_reprovacao_cliente

## Summary

Esta API Call envia um e-mail de reprovação para o cliente, notificando sobre correções necessárias.

## Detalhes

| Propriedade  | Valor                                                          |
| ------------ | -------------------------------------------------------------- |
| Método       | POST                                                           |
| Path         | https://flow-webhook.vpsconexao.org/webhook/reprovacao_cliente |
| Autenticação | None                                                           |

## Parâmetros

| Nome               | Tipo | Obrigatório |
| ------------------ | ---- | ----------- |
| nome_consultor     | text | Não         |
| email_consultor    | text | Não         |
| whatsapp_consultor | text | Não         |
| nome_cliente       | text | Não         |
| email_cliente      | text | Não         |
| whatsapp_cleinte   | text | Não         |
| motivo_correcao    | text | Não         |
| quem_solicitou     | text | Não         |
| data_solicitacao   | text | Não         |
| link_correcao      | text | Não         |

## Response

| Campo   | Tipo |
| ------- | ---- |
| message | text |

### email_aprovacao_magali

# email_aprovacao_magali

## Summary

Esta API Call envia um email de aprovação para Magali com os detalhes de um cliente e consultor.

## Detalhes

| Propriedade  | Valor                    |
| ------------ | ------------------------ |
| Método       | POST                     |
| Path         | /webhook/aprovado_magali |
| Autenticação | Nenhuma                  |

## Parâmetros

| Nome            | Tipo | Obrigatório |
| --------------- | ---- | ----------- |
| nome_consultor  | text | Não         |
| codigo_cliente  | text | Não         |
| nome_cliente    | text | Não         |
| email_magali    | text | Não         |
| whatsapp_magali | text | Não         |
| quem_aprovou    | text | Não         |
| data_aprovacao  | text | Não         |

## Response

| Propriedade | Tipo |
| ----------- | ---- |
| message     | text |

### email_aprovacao_cliente

# email_aprovacao_cliente

## Summary

Esta API Call envia um e-mail para notificar a aprovação de um cliente, incluindo detalhes como nome do consultor, cliente, e informações de contato.

## Detalhes

| Propriedade  | Valor                                                        |
| ------------ | ------------------------------------------------------------ |
| Método       | POST                                                         |
| Path         | https://flow-webhook.vpsconexao.org/webhook/aprovado_cliente |
| Autenticação | Nenhuma especificada                                         |

## Parâmetros

| Nome             | Tipo | Obrigatório |
| ---------------- | ---- | ----------- |
| nome_consultor   | text | Sim         |
| nome_cliente     | text | Sim         |
| email_cliente    | text | Sim         |
| whatsapp_cleinte | text | Sim         |
| codigo_cliente   | text | Sim         |
| quem_aprovou     | text | Sim         |
| data_aprovacao   | text | Sim         |

## Response

| Propriedade | Tipo |
| ----------- | ---- |
| message     | text |

### email_aprovacao_consultor

# email_aprovacao_consultor

## Summary

Executa uma chamada POST para a API `https://flow-webhook.vpsconexao.org/webhook/aprovacao_consultor` para enviar dados de aprovação de um cliente e consultor.

## Detalhes

| Propriedade  | Valor                                                           |
| ------------ | --------------------------------------------------------------- |
| Método       | POST                                                            |
| Path         | https://flow-webhook.vpsconexao.org/webhook/aprovacao_consultor |
| Autenticação | Nenhuma especificada                                            |

## Parâmetros

| Nome                | Tipo | Obrigatório |
| ------------------- | ---- | ----------- |
| nome_consultor      | text | Não         |
| nome_cliente        | text | Não         |
| codigo_cliente      | text | Não         |
| quem_aprovou        | text | Não         |
| data_aprovacao      | text | Não         |
| whatasapp_consultor | text | Não         |
| email_consultor     | text | Não         |

## Response

- `message` (text): Mensagem de retorno da API.

---
