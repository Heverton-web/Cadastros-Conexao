# Tabelas de Dados (Data Types)

## LOG

# LOG (Data Type)

## Summary
Este Data Type armazena registros de atividades, incluindo quem realizou a ação, o que foi realizado e quando.

## Campos

| Campo                      | Tipo   | Obrigatório |
|----------------------------|--------|-------------|
| A. - deleted               | text   | Não         |
| A. Quem realizou           | text   | Não         |
| B. O que realizou          | text   | Não         |
| C. Quando realizou - deleted | date   | Não         |
| C. Quando Realizou         | text   | Não         |
| D. CLIENTE                 | cliente| Não         |
| A. LOG Detalhes            | log_detalhes | Não         |

## User

# User (Data Type)

## Summary
Representa as informações de um usuário no sistema, incluindo dados de contato, credenciais de acesso e status (ativo/inativo).

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 02. Whatsapp | text | Não |
| C. Ativo? | boolean | Não (default: true) |
| SENHA PADRÃO | text | Não |
| SUPERADMIN | boolean | Não (default: false) |
| 01. Nome Completo | text | Não |
| A. Clientes | list of custom client | Não |
| C. Função - deleted | option set tipo_de_usu_rio | Não |
| D. Tipo de Acesso - deleted | option set tipo_de_acesso | Não |
| B. Departamento | option set tipo_de_credencial | Não |

## User

# User

## Summary
Este Data Type representa informações de usuários no sistema. Está marcado como deletado e não será mais utilizado.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| E. Ativo? | boolean | Não |
| 01. Nome Completo | text | Não |
| A. Clientes | list of custom `cliente` | Não |
| D. Tipo de Acesso | option set `tipo_de_acesso` | Não |
| C. Função | option set `tipo_de_usu_rio` | Não |
| B. Departamento | option set `tipo_de_credencial` | Não |

## evento

# evento (Data Type)

## Summary
Define a estrutura de dados para armazenar informações de eventos, incluindo dados do participante, detalhes de valor e status de confirmação.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| cpf | text | Não |
| nome | text | Não |
| email | text | Não |
| valor | number | Não |
| cro | text | Não |
| tag | text | Não |
| cidade | text | Não |
| estado | text | Não |
| previa_fat - deleted | number | Não |
| whatsapp | text | Não |
| confirmado | boolean | Não |
| convidado_por | text | Não |
| numero_sorteio | text | Não |
| previa_fat - deleted | list.number | Não |
| convidado_por - deleted | api.apiconnector2.bTMGk.bTMGl | Não |

## Contratos_Pastas

# Contratos_Pastas

## Summary
Este Data Type define a estrutura para armazenar "Pastas de Contratos". Ele inclui campos para o nome da pasta e um template associado. O Data Type foi excluído.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| 01. Nome | text | Não |
| A. Template | list.text | Não |

## Cadastros

# Cadastros (Data Type)

## Summary
Data type para armazenar informações de cadastros de clientes, incluindo detalhes pessoais, links de acesso, status e resultados de consultas.

## Campos

| Campo                        | Tipo    | Obrigatório |
| ---------------------------- | ------- | ----------- |
| celular_temp                 | text    | Não         |
| nome_cliente                 | text    | Não         |
| C. Colaborador               | user    | Não         |
| AA. link_expira_em           | date    | Não         |
| H. Revisado?                 | boolean | Não         |
| S. Token gerado              | text    | Não         |
| AB. token_expira_em          | date    | Não         |
| A. Código Cliente            | text    | Não         |
| B. Link de Acesso            | text    | Não         |
| L. Código Cliente            | text    | Não         |
| E. Nome Temporário           | text    | Não         |
| temp - email token           | text    | Não         |
| O. Data da consulta          | text    | Não         |
| N. Data de finalização       | date    | Não         |
| I. Comentário Reprovação     | text    | Não         |
| P. Consulta CNPJ realizada?  | boolean | Não         |
| M. Data de criação do link   | date    | Não         |
| 04. Documentação             | documentos | Não         |
| Q. Consulta CRO realizada?   | boolean | Não         |
| R. Status verificação token  | boolean | Não         |
| 03. Dados de Endereço        | enderecos | Não         |
| 02. Dados Cadastrais - PJ    | clientes | Não         |
| D. Status Cadastro           | option | Não         |
| G. Tipo de Cadastro          | option | Não         |
| 01. Dados Cadastrais - PF    | _pf__clientes | Não         |
| J. Tipo de Ação              | option | Não         |
| F. Forma de Compartilhamento | option | Não         |

## Cadastros_Clientes_PJ

# Cadastros_Clientes_PJ

## Summary
Este DataType armazena informações detalhadas sobre cadastros de clientes Pessoa Jurídica, incluindo dados de identificação, contato e informações específicas como CRO e CNPJ.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 07a. E-mail de Comunicação | text | Não |
| 02b. UF CRO | text | Não |
| 06a. Celular 01 | text | Não |
| 06b. Celular 02 | text | Não |
| 07b. E-mail de NF | text | Não |
| 01. Razão Social | text | Não |
| 02. Número do CRO | text | Não |
| 03. Número de CPF - deleted | text | Não |
| 05. Telefone Fixo | text | Não |
| 01b. Nome Fantasia | text | Não |
| 04. Número de CNPJ | text | Não |
| 04c. Data consulta  | date | Não |
| B. Cliente | custom.cliente | Não |
| 06. Endereço Completo - deleted | text | Não |
| 04b. Inscrição Estatual | text | Não |
| 02c. Data emissão CRO \| TPD | date | Não |
| A. Tipo de Cadastro | option.tipo_de_cadastro | Não |

## contratos

```markdown
# contratos (Data Type)

## Summary
Este Data Type representa informações de contratos, incluindo campos de texto, arquivos PDF e campos personalizados relacionados a dados gerais e assinantes. O Data Type está marcado como excluído.

## Campos

| Campo                | Tipo        | Obrigatório |
|----------------------|-------------|-------------|
| teste                | text        | Não         |
| 03. PDF              | file        | Não         |
| 03. Data de Início   | date        | Não         |
| 02. Contrato em PDF  | file        | Não         |
| 04. Data de Término  | date        | Não         |
| 01. Número do Contrato| text        | Não         |
| 01. Título do Contrato| text        | Não         |
| descricao            | text        | Não         |
| A. Dados Gerais      | custom      | Não         |
| B. Assinantes        | list custom | Não         |
```

## Cadastros_Endereços

# Cadastros_Endereços

## Summary
Este Data Type armazena informações detalhadas de endereços associados a clientes. Contém campos para CEP, rua, bairro, cidade, estado, número e complemento, além de referências a clientes e tipos de endereço.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| CEP | text | Não |
| RUA | text | Não |
| PAÍS - deleted | text | Não |
| BAIRRO | text | Não |
| CIDADE | text | Não |
| ESTADO | text | Não |
| NÚMERO | text | Não |
| COMPLEMENTO - deleted | text | Não |
| COMPLEMENTO | text | Não |
| A. Cliente | custom.cliente | Não |
| A. Cliente - deleted | custom.clientes | Não |
| B. Tipo de Endereço | option.tipo_de_endere_o | Não |

## Contratos_Template

# Contratos_Template

## Summary
Este Data Type representa modelos de contrato, mas foi marcado como excluído e não deve mais ser utilizado.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 01. Nome | text | Não |
| A. Pasta | text | Não |
| 02. Conteúdo | text | Não |

## tutoriais

# tutoriais (Data Type)

## Summary
Define a estrutura de dados para armazenar informações de tutoriais, incluindo arquivo HTML, nome e URL de imagem.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| html | file | Não |
| nome | text | Não |
| imagem | text | Não |

## Buscas CRO

# Buscas CRO

## Summary
Este Data Type representa informações sobre buscas realizadas, incluindo quem consultou, quando, e o custo associado. Alguns campos foram marcados como deletados.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| A. Saldo - deleted | number | Não |
| 02. Limite mensal - deleted | text | Não |
| 01. Quem consultou | user | Não |
| 02. Limite mensal - deleted | number | Não |
| 03. Quanto custou | number | Não |
| 02. Quando consultou | date | Não |
| 01. Quantidade buscas realizadas - deleted | number | Não |

## Cadastros_Documentos

# Cadastros_Documentos

## Summary
Este Data Type armazena documentos e informações relacionadas a cadastros de clientes e responsáveis técnicos. Inclui campos para arquivos como CNH, CRO, Contrato Social e Declaração, além de referências ao cliente.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 05. Declaração - PDF | file | Não |
| 02c. CNH - PDF - deleted | file | Não |
| 01a. CRO - IMG - deleted | image | Não |
| 01a. CRO - FRENTE | file | Não |
| 01b. CRO - VERSO | file | Não |
| 02a. CNH - FRENTE | file | Não |
| 02b. CNH - VERSO | file | Não |
| 02a. CNH - Frente - IMG - deleted | image | Não |
| 02b. CNH - Verso - IMG - deleted | image | Não |
| 03a. Endereço - IMG - deleted | image | Não |
| 03. Endereço | file | Não |
| A. Cliente | custom.cliente | Não |
| 05a. Declaração - IMG - deleted | image | Não |
| 04. Contrato Social - PDF | file | Não |
| 04a. Contrato Social - IMG - deleted | image | Não |
| 06c. CNH Responsável Técnico - PDF - deleted | file | Não |
| 06b. CNH Responsável Técnico - VERSO | file | Não |
| 06a. CNH Responsável Técnico - FRENTE | file | Não |
| 06b. CNH Responsável Técnico - Verso - IMG - deleted | image | Não |
| 06a. CNH Responsável Técnico - Frente - IMG - deleted | image | Não |

## evento_es

# evento_es (Data Type)

## Summary
Representa um evento com informações de participantes e seus status de confirmação. Este Data Type foi marcado como deletado.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| cpf | text | Não |
| nome | text | Não |
| email | text | Não |
| valor | number | Não |
| cro | text | Não |
| tag | text | Não |
| cidade | text | Não |
| estado | text | Não |
| whatsapp | text | Não |
| confirmado | boolean | Não |
| convidado_por | text | Não |
| numero_sorteio | text | Não |

## evento_APCD

# evento_APCD

## Summary
Este Data Type armazena informações relacionadas a eventos, incluindo dados de CPF, nome, CRO (Conselho Regional de Odontologia), tag VIP, cidade, estado e WhatsApp.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| apcd_cpf | text | Não |
| apcd_nome | text | Não |
| apcd_cro | text | Não |
| apcd_tag | text | Não |
| apcd_cidade | text | Não |
| apcd_estado | text | Não |
| apcd_whatsapp | text | Não |

## evento_LEAD

# evento_LEAD

## Summary
Este data type representa informações de leads associadas a eventos. Contém campos para dados cadastrais e informações específicas de VIPs.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| apcd_cpf | text | Não |
| apcd_nome | text | Não |
| apcd_cro | text | Não |
| apcd_tag | text | Não |
| apcd_cidade | text | Não |
| apcd_estado | text | Não |
| apcd_whatsapp | text | Não |

## LOG Detalhes

# LOG Detalhes

## Summary
Este Data Type armazena detalhes de logs, como localização, tipo de navegador, dispositivo, sistema operacional e fingerprint do dispositivo.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 01. Local | text | Não |
| A. LOG | custom.log | Não |
| 03. Tipo de navegador | text | Não |
| 02. Tipo de dispositivo | text | Não |
| 04. Sistema operacional | text | Não |
| 05. Fingerprint Dispositivo | text | Não |

## Cadastros_Clientes_PF

# Cadastros_Clientes_PF

## Summary
Define a estrutura de dados para armazenar informações de cadastro de clientes pessoa física, incluindo dados pessoais, de contato e profissionais.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 06a. E-mail de Comunicação | text | Não |
| 02b. UF CRO | text | Não |
| 05a. Celular 01 | text | Não |
| 05b. Celular 02 | text | Não |
| 06b. E-mail de NF | text | Não |
| 01. Nome completo | text | Não |
| 02. Número do CRO | text | Não |
| 03. Número de CPF | text | Não |
| 04. Telefone Fixo | text | Não |
| B. Cliente | custom.cliente | Não |
| 06. Endereço Completo - deleted | text | Não |
| 01b. Data de Nascimento | date | Não |
| 02c. Data emissão CRO \| TPD | date | Não |
| A. Tipo de Cadastro | option.tipo_de_cadastro | Não |

## Consultas CNPJ

# Consultas CNPJ

## Summary
Este Data Type armazena informações relacionadas a consultas de CNPJ, incluindo o arquivo PDF da consulta, a data em que a consulta foi realizada e o cliente associado.

## Campos

| Campo                 | Tipo   | Obrigatório |
|-----------------------|--------|-------------|
| 02. PDF Consulta      | file   | Não         |
| 01. Data consulta     | date   | Não         |
| A. Cliente            | custom | Não         |

## Consultas CRO

# Consultas CRO

## Summary
Este Data Type representa informações de consultas, incluindo o arquivo PDF associado, a data da consulta e o cliente.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| 02. PDF Consulta | file | Não |
| 01. Data consulta | date | Não |
| A. Cliente | custom.cliente | Não |

## Download_Credenciais

# Download_Credenciais

## Summary
Data type para armazenar informações de download de credenciais, incluindo data (marcada como deletada) e texto.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| data - deleted | date | Não |
| data | text | Não |
| usuario | user | Não |

## Contratos_Dados_Assinante

# Contratos_Dados_Assinante

## Summary
Este Data Type armazena informações de assinantes de contratos, incluindo dados pessoais e de identificação. Foi marcado como deletado.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| A. Contrato | text | Não |
| 04. CPF do assinante | text | Não |
| 02. Nome do Assinante | text | Não |
| 06. Email Comunicação | text | Não |
| 05. CNPJ do assinante | text | Não |
| 07. Whatsapp Comunicação | text | Não |
| Razão Social do Assinante | text | Não |
| 01. Tipo de Assinante | Contrato Tipo de Assinante (Option Set) | Não |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary
Este Data Type define os tipos de envio de link. Foi marcado como deletado e não está mais ativo.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| (Nenhum campo visível pois o Data Type está deletado) | (N/A) | (N/A) |

## Contratos_Dados_Gerais

# Contratos_Dados_Gerais

## Summary
Este Data Type representa informações gerais de contratos, incluindo datas de início e término. Foi marcado como excluído.

## Campos

| Campo | Tipo | Obrigatório |
|---|---|---|
| A. Contrato | text | Não |
| 02. Data de Início | date | Não |
| 03. Data de Término | date | Não |
| 01. Nome do Contrato - deleted | text | Não |
| A. Contrato - deleted | custom.contratos | Não |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary
Este Data Type define as opções para o tipo de envio de um link. O registro está marcado como excluído.

## Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| (Nenhum campo visível, pois o Data Type está marcado como excluído) | - | - |

## Tipo de Envio de Link

# Tipo de Envio de Link

## Summary
Este Data Type foi configurado para representar os tipos de envio de links, mas foi marcado como deletado e não possui campos ou opções configuradas.

## Campos
Este Data Type não possui campos configurados.
