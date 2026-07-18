\# CONTEXTO E OBJETIVO

O objetivo é refatorar as tabelas do banco de dados e os respectivos modais de interface (UI) para coleta/cadastro desses dados, seguindo estritamente as definições técnicas abaixo.



\# STACK TECNÓLOGICA E DIRETRIZES

\- 



\# REGRAS GERAIS DE NEGÓCIO E ARQUITETURA

1\. \*\*Auditoria:\*\* Todas as tabelas devem conter automaticamente os campos `created\_at` e `updated\_at`.

2\. \*\*Contexto de Empresa (`empresa\_id`):\*\* O campo `empresa\_id` NUNCA deve ser exibido como um input para o usuário no modal. Ele deve ser preenchido/injetado automaticamente pelo backend usando o contexto do usuário logado (sessão/auth).

3\. \*\*Selects em Cascata:\*\* Sempre que houver dependência hierárquica (ex: Categoria -> Conexão -> Família -> Linha), o modal deve implementar Dropdowns (Selects) dependentes. Escolher o item pai filtra automaticamente os itens filhos correspondentes e desabilita os selects abaixo enquanto o pai não for selecionado.

4\. \*\*Relacionamentos em Lista (N:M):\*\* Para campos definidos como "lista de IDs" (ex: chaves, fresas, imagens), implemente usando \[ESCOLHA: Tabelas Pivô (Join Tables) relacionais OR colunas de Array do Supabase (`uuid\[]`)].

5\. \*\*Visibilidade:\*\* Caso um campo da tabela esteja vazio ou seja do tipo `null` o elemento/componente UI não será renderizado no frontend.



\---



\# DEFINIÇÕES DE ESTRUTURA



\## 1. Nav Item "ESTRUTURA" (Menu Lateral e Menu Grid)



\### 1.1 Aba "Categorias"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/categorias` -> aba "Categorias" -> botão "Nova Categoria" (Abre Modal de Cadastro de Categorias)

\- \*\*TABELA DB:\*\* `catalogo\_categorias`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `locked`: boolean (Default: false, switch no modal renderizado apenas para o SUPER ADMIN)

&#x20; - `ativo`: boolean (Default: true, switch no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\---



\# DEFINIÇÕES DE IMPLANTES



\## 1. Nav Item "IMPLANTES" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Conexões"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/implantes` -> aba "Estrutura" -> sub aba "Conexões" -> botão "Nova Conexão" (Abre Modal de Cadastro de Conexões)

\- \*\*TABELA DB:\*\* `catalogo\_ips\_conexoes`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Obrigatório, input text no modal)

&#x20; - `locked`: boolean (Default: true, não aparece no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `categoria\_id`: FK -> Categoria (Obrigatório, select no modal. Precisa ter pelo menos 1 Categoria)



\### 1.2 Sub aba "Famílias"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/implantes` -> aba "Estrutura" -> sub aba "Famílias" -> botão "Nova Família" (Abre Modal de Cadastro de Famílias)

\- \*\*TABELA DB:\*\* `catalogo\_ips\_familias`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `cor\_identificacao`: string hex color (Obrigatório, color picker/hex input no modal)

&#x20; - `locked`: boolean (Default: true, não aparece no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `conexao\_id`: FK -> `catalogo\_ips\_conexoes` (Obrigatório, select no modal. Precisa ter pelo menos 1 Conexão)



\### 1.3 Sub aba "Linhas"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/implantes` -> aba "Estrutura" -> sub aba "Linhas" -> botão "Nova Linha" (Abre Modal de Cadastro de Linhas)

\- \*\*TABELA DB:\*\* `catalogo\_ips\_linhas`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `familia\_id`: FK -> `catalogo\_ips\_familias` (Obrigatório, select no modal. Precisa ter pelo menos 1 Família)



\## 2. Nav Item "IMPLANTES" (Menu Lateral e Menu Grid) -> aba "Produtos"



\### 2.1 Sub aba "Implantes" 

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/implantes` -> aba "Produtos" -> sub aba "Implantes" -> botão "Novo Implante" (Abre Modal de Cadastro de Implantes)

\- \*\*TABELA DB:\*\* `catalogo\_implantes`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Hierarquia de Estrutura (Selects em Cascata na UI):\*\*

&#x20;   - `categoria\_id`: FK -> `catalogo\_categorias`

&#x20;   - `conexao\_id`: FK -> `catalogo\_ips\_conexoes`

&#x20;   - `familia\_id`: FK -> `catalogo\_ips\_familias`

&#x20;   - `linha\_id`: FK -> `catalogo\_ips\_linhas`

&#x20;   \*(Regra de UI: O preenchimento deve garantir a cadeia `Categoria → Conexão → Família → Linha` completa através de selects dependentes)\*

&#x20; - \*\*Vinculações Múltiplas (Multi-Selects na UI):\*\*

&#x20;   - `chaves\_id`: Lista de FKs -> `catalogo\_chaves`

&#x20;   - `protocolos\_id`: Lista de FKs -> `catalogo\_protocolos\_fresagens`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `diametro\_plataforma\_mm`: number (input number, ex: decimal)

&#x20;   - `comprimento\_mm`: number (input number, ex: decimal)

&#x20;   - `rosca\_interna`: number (input number, ex: decimal)

&#x20;   - `macrogeometria`: string (input text)

&#x20;   - `torque\_ncm`: number (input number)

&#x20;   - `material`: string (input text)

&#x20;   - `superficie`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `categoria\_id`: FK -> `catalogo\_categorias` (Default: Categoria de Implantes)

&#x20; - `conexao\_id`: FK -> `catalogo\_ips\_conexoes` (Obrigatório, select no modal. Precisa ter pelo menos 1 Conexão)

&#x20; - `familia\_id`: FK -> `catalogo\_ips\_familias` (Obrigatório, select no modal. Precisa ter pelo menos 1 Família)

&#x20; - `linha\_id`: FK -> `catalogo\_ips\_linhas` (Obrigatório, select no modal. Precisa ter pelo menos 1 Linha)

&#x20; - `osso\_soft`: `protocolo\_id` FK -> `catalogo\_protocolos\_fresagens` (Obrigatório, select no modal. Precisa ter pelo menos 1 Protocolo de Fresagem)

&#x20; - `osso\_hard`: `protocolo\_id` FK -> `catalogo\_protocolos\_fresagens` (Obrigatório, select no modal. Precisa ter pelo menos 1 Protocolo de Fresagem)



\---



\# DEFINIÇÕES DE COMPONENTES



\## 1. Nav Item "COMPONENTES" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Tipos de Reabilitação"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Reabilitação" -> botão "Novo Tipo de Reabilitação" (Abre Modal de Cadastro de Tipos de Reabilitação)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_reabilitacao`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - \*\*Vinculações Múltiplas (Multi-Selects na UI):\*\*

&#x20;   - `familia\_id`: FK -> `catalogo\_ips\_familias`

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `familia\_id`: FK -> `catalogo\_ips\_familias` (Obrigatório, select no modal. Precisa ter pelo menos 1 Família)



\### 1.2 Sub aba "Tipos de Abutments"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Abutments" -> botão "Novo Tipo de Abutment" (Abre Modal de Cadastro de Tipos de Abutments)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_abutments`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_reabilitacao\_id`: FK -> `catalogo\_cps\_tipos\_reabilitacao`

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_reabilitacao\_id`: FK -> `catalogo\_cps\_tipos\_reabilitacao` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Reabilitação)



\### 1.3 Sub aba "Tipos de Componentes"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Componentes" -> botão "Novo Tipo de Componente" (Abre Modal de Cadastro de Tipos de Componentes)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_componentes`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\\\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `categoria\_id`: FK -> `catalogo\_categorias` (Default: Categoria de Componentes)



\### 1.4 Sub aba "Tipos de Parafusos"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Parafusos" -> botão "Novo Tipo de Parafuso" (Abre Modal de Cadastro de Tipos de Parafusos)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_parafusos`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\### 1.5 Sub aba "Tipos de Cicatrizadores"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Cicatrizadores" -> botão "Novo Tipo de Cicatrizador" (Abre Modal de Cadastro de Tipos de Cicatrizadores)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_cicatrizadores`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)





\## 2. Nav Item "COMPONENTES" (Menu Lateral e Menu Grid) -> aba "Produtos"



\### 2.1 Sub aba "Abutments" 

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Abutments" -> botão "Novo Abutment" (Abre Modal de Cadastro de Abutments)

\- \*\*TABELA DB:\*\* `catalogo\_abutments`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_abutment\_id`: FK -> `catalogo\_cps\_tipos\_abutments`

&#x20;   - `parafuso\_id`: FK -> `catalogo\_parafusos`

&#x20;  - `chave\_id`: FK -> `catalogo\_chaves`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `diametro\_plataforma\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_transmucoso\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_corpo\_mm`: number (input number, ex: decimal)

&#x20;   - `angulacao\_graus`: number (input number)

&#x20;   - `torque\_ncm`: number (input number)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_abutment`: FK -> `catalogo\_cps\_tipos\_abutments` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Abutment)

&#x20; - `parafuso\_id`: FK -> `catalogo\_parafusos` (Obrigatório, select no modal. Precisa ter pelo menos 1 Parafuso)



\### 2.2 Sub aba "Componentes"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Componentes" -> botão "Novo Componente" (Abre Modal de Cadastro de Componentes)

\- \*\*TABELA DB:\*\* `catalogo\_componentes`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_componente\_id`: FK -> `catalogo\_cps\_tipos\_componentes`

&#x20;   - `tipo\_abutment\_id`: FK -> `catalogo\_cps\_tipos\_abutments`

&#x20;   - `parafuso\_id`: FK -> `catalogo\_parafusos`

&#x20;  - `chave\_id`: FK -> `catalogo\_chaves`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `diametro\_plataforma\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_transmucoso\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_corpo\_mm`: number (input number, ex: decimal)

&#x20;   - `angulacao\_graus`: number (input number)

&#x20;   - `tipo`: string (input text no modal)

&#x20;   - `tipo\_travamento`: string (input text no modal)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_abutment\_id`: FK -> `catalogo\_cps\_tipos\_abutments` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Abutment)

&#x20; - `tipo\_componente\_id`: FK -> `catalogo\_cps\_tipos\_componentes` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Componente)

&#x20; - `parafuso\_id`: FK -> `catalogo\_parafusos` (Obrigatório, select no modal. Precisa ter pelo menos 1 Parafuso)



\### 2.3 Sub aba "Parafusos"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Parafusos" -> botão "Novo Parafuso" (Abre Modal de Cadastro de Parafusos)

\- \*\*TABELA DB:\*\* `catalogo\_parafusos`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_parafuso\_id`: FK -> `catalogo\_cps\_tipos\_parafusos`

&#x20;  - `chave\_id`: FK -> `catalogo\_chaves`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `torque\_ncm`: number (input number)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_parafuso\_id`: FK -> `catalogo\_cps\_tipos\_parafusos` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Parafuso)



\### 2.4 Sub aba "Cicatrizadores"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Cicatrizadores" -> botão "Novo Cicatrizador" (Abre Modal de Cadastro de Cicatrizadores)

\- \*\*TABELA DB:\*\* `catalogo\_cicatrizadores`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `implante\_id`: FK -> `catalogo\_implantes`

&#x20;  - `chave\_id`: FK -> `catalogo\_chaves`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `diametro\_plataforma\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_transmucoso\_mm`: number (input number, ex: decimal)

&#x20;   - `altura\_corpo\_mm`: number (input number, ex: decimal)

&#x20;   - `torque\_ncm`: number (input number)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `implante\_id`: FK -> `catalogo\_implantes` (Obrigatório, select no modal. Precisa ter pelo menos 1 Implante)





\---



\# DEFINIÇÕES DE INSTUMENTAIS



\## 1. Nav Item "INSTRUMENTAIS" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Tipos de Chaves"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/instrumentais` -> aba "Estrutura" -> sub aba "Tipos de Chaves" -> botão "Novo Tipo de Chave" (Abre Modal de Cadastro de Tipos de Chaves)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_chaves`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\### 1.2 Sub aba "Tipos de Fresas"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/instrumentais` -> aba "Estrutura" -> sub aba "Tipos de Fresas" -> botão "Novo Tipo de Fresa" (Abre Modal de Cadastro de Tipos de Fresas)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_fresas`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\### 1.3 Sub aba "Tipos Complementares"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/instrumentais` -> aba "Estrutura" -> sub aba "Tipos Complementares" -> botão "Novo Tipo Complementar" (Abre Modal de Cadastro de Tipos Complementares)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_complementares`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\### 1.4 Sub aba "Tipos Opcionais"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/instrumentais` -> aba "Estrutura" -> sub aba "Tipos Opcionais" -> botão "Novo Tipo Opcional" (Abre Modal de Cadastro de Tipos Opcionais)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_opcionais`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\## 2. Nav Item "INSTRUMENTAIS" (Menu Lateral e Menu Grid) -> aba "Produtos"



\### 2.1 Sub aba "Chaves"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Chaves" -> botão "Novo Chave" (Abre Modal de Cadastro de Chaves)

\- \*\*TABELA DB:\*\* `catalogo\_chaves`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_chave\_id`: FK -> `catalogo\_tipos\_chaves`

###### &#x20;  **- `KIT`: FK -> `catalogo\_abutments`**

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `tipo`: string (input text)

&#x20;   - `comprimento`: string (input text)

&#x20;   - `diametro\_mm`: number (input number, ex: decimal)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_chave\_id`: FK -> `catalogo\_tipos\_chaves` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Chave)



\### 2.2 Sub aba "Fresas"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Fresas" -> botão "Nova Fresa" (Abre Modal de Cadastro de Fresas)

\- \*\*TABELA DB:\*\* `catalogo\_fresas`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_fresa\_id`: FK -> `catalogo\_tipos\_fresas`

###### &#x20;  **- `KIT`: FK -> `catalogo\_abutments`**

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `tipo`: string (input text)

&#x20;   - `comprimento`: string (input text)

&#x20;   - `diametro\_mm`: number (input number, ex: decimal)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_fresas\_id`: FK -> `catalogo\_tipos\_fresas` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Fresa)



\### 2.3 Sub aba "Complementares"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Complementares" -> botão "Novo Instrumento Complementar" (Abre Modal de Cadastro de Instrumentos Complementares)

\- \*\*TABELA DB:\*\* `catalogo\_complementares`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_complementar\_id`: FK -> `catalogo\_tipos\_complementares`

###### &#x20;  **- `KIT`: FK -> `catalogo\_abutments`**

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `tipo`: string (input text)

&#x20;   - `comprimento`: string (input text)

&#x20;   - `diametro\_mm`: number (input number, ex: decimal)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_complementar\_id`: FK -> `catalogo\_tipos\_complementares` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo Complementar)



\### 2.4 Sub aba "Opcionais"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Produtos" -> sub aba "Opcionais" -> botão "Novo Instrumento Opcional" (Abre Modal de Cadastro de Instrumentos Opcionais)

\- \*\*TABELA DB:\*\* `catalogo\_opcionais`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `tipo\_opcionais\_id`: FK -> `catalogo\_tipos\_opcionais`

###### &#x20;  **- `KIT`: FK -> `catalogo\\\_abutments`**

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Especificações Técnicas:\*\*

&#x20;   - `tipo`: string (input text)

&#x20;   - `comprimento`: string (input text)

&#x20;   - `diametro\_mm`: number (input number, ex: decimal)

&#x20;   - `material`: string (input text)

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_opcional\_id`: FK -> `catalogo\_tipos\_Opcionais` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo Opcional)



\---



\# DEFINIÇÕES DE KITS



\## 1. Nav Item "KITS" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Tipos de Kits"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/instrumentais` -> aba "Estrutura" -> sub aba "Tipos de Kits" -> botão "Novo Tipo de Kit" (Abre Modal de Cadastro de Tipos de Kits)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_kits`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\## 2. Nav Item "KITS" (Menu Lateral e Menu Grid) -> aba "Produtos"



\### 2.1 Sub aba "Kits"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/implantes` -> aba "Produtos" -> sub aba "Kits" -> botão "Novo Kit" (Abre Modal de Cadastro de Kits)

\- \*\*TABELA DB:\*\* `catalogo\_kits`

\- \*\*DADOS / CAMPOS DO MODAL:\*\*

&#x20; - \*\*Hierarquia de Estrutura (Selects em Cascata na UI):\*\*

&#x20;   - `tipo\_kit\_id`: FK -> `catalogo\_tipos\_kits`

&#x20; - \*\*Identificação:\*\*

&#x20;   - `sku`: string (PK manual, input text obrigatório)

&#x20;   - `nome`: string (Obrigatório, input text no modal)

&#x20;   - `sigla`: string (Opicional, input text no modal)

&#x20;   - `descricao`: string (textarea)

&#x20;   \*\*Imagens do Produto:\*\* (Botões para seleção do tipo)

&#x20;      - `arquivo`: file (input upload no modal, salva no bucket específico)

&#x20;      - `url\_s3`: string (input text no modal)

&#x20;      - `url\_google\_drive`: string (input text no modal)

&#x20; - \*\*Composição do Kit (Multi-Selects na UI):\*\*

&#x20;   - `chaves\_id`: Lista de FK -> `catalogo\_chaves` 

&#x20;   - `fresas\_id`: Lista de FK -> `catalogo\_fresas` 

&#x20;   - `complementares\_id`: Lista de FK -> `catalogo\_complementares` 

&#x20;   - `opcionais\_id`: Lista de FK -> `catalogo\_opcionais` 

&#x20;   \*OBS\*: Seções específicas "Modal de Cadastro de Kits". Seção "Chaves" será composta por: 1 Select (`catalogo\_chaves` - `chaves\_id) para o usuário escolher a chave e 1 botão para adiciona-las a lista de chaves que comporá o kit. Seção "Fresas" será composta por: 1 Select (`catalogo\_fresas` - `fresas\_id) para o usuário escolher a fresa e 1 botão para adiciona-las a lista de fresas que comporá o kit. Seção "Instrumentais Complementares" será composta por: 1 Select (`catalogo\_complementares` - `complementar\_id) para o usuário escolher os instrumentais complementares e 1 botão para adiciona-los a lista de instrumentais complementares que comporá o kit. Seção "Instrumentais Opcionais" será composta por: 1 Select (`catalogo\_opcionais` - `opcionais\_id) para o usuário escolher os instrumentais opcionais e 1 botão para adiciona-los a lista de instrumentais opcionais que comporá o kit.

&#x20; - \*\*Comercial e Status:\*\*

&#x20;   - `preco`: number (decimal/currency input)

&#x20;   - `ativo`: boolean (Default: true, switch/checkbox)

\- \*\*RELACIONAMENTOS DO SISTEMA:\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `tipo\_kit\_id`: FK -> `catalogo\_tipos\_kits` (Obrigatório, select no modal. Precisa ter pelo menos 1 Tipo de Kit)



\---



\# DEFINIÇÕES DE WORKFLOWS



\## 1. Nav Item "WORKFLOWS" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Tipos de Workflows"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estrutura" -> sub aba "Tipos de Workflows" -> botão "Novo Tipo de Workflow" (Abre Modal de Cadastro de Tipos de Workflows)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_workflows`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\## 2. Nav Item "WORKFLOWS" (Menu Lateral e Menu Grid) -> aba "Etapas"



\### 1.2 Sub aba "Etapas do Workflow"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/componentes` -> aba "Estapas" -> sub aba "Etapas do Workflow" -> botão "Nova Etapa do Workflow" (Abre Modal de Cadastro de Etapas do Workflows)

\- \*\*TABELA DB:\*\* `catalogo\_cps\_tipos\_workflows`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)





\---



\# DEFINIÇÕES DE FRESAGENS



\## 1. Nav Item "FRESAGENS" (Menu Lateral e Menu Grid) -> aba "Estrutura"



\### 1.1 Sub aba "Tipos de Fresagens"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/fresagens` -> aba "Estrutura" -> sub aba "Tipos de Fresagens" -> botão "Novo Tipo de Fresagem" (Abre Modal de Cadastro de Tipos de Fresagens)

\- \*\*TABELA DB:\*\* `catalogo\_tipos\_fresagens`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)



\## 2. Nav Item "FRESAGENS" (Menu Lateral e Menu Grid) -> aba "Protocolos"



\### 1.2 Sub aba "Protocolos de Fresagens"

\- \*\*ROTA / GATILHO UI:\*\* `/catalogo/admin/fresagens` -> aba "Protocolos" -> sub aba "Protocolos de Fresagens" -> botão "Novo Protocolo de Fresagem" (Abre Modal de Cadastro de Protocolos de Fresagens)

\- \*\*TABELA DB:\*\* `catalogo\_protocolos\_fresagens`

\- \*\*DADOS (Campos do Modal/Tabela):\*\*

&#x20; - \*\*Vinculações (Select na UI):\*\*

&#x20;   - `diametros`: lista com valores únicos dos diâmetros dos IMPLANTES cadastrados.

&#x20; - \*\*Vinculações Múltiplas (Componente específico renderizado no modal):\*\*

&#x20;   - `fresas\_id`: Lista de FKs -> `catalogo\_fresas` (`fresas\_id`)

&#x20;   \*OBS\*: O componente será renderizado no modal "Cadastro de Protocolos de Fresagens" e será composta por: 1 Select (`catalogo\_fresas` - `fresas\_id) para o usuário escolher a fresa , 1 input do tipo number para o usuário definir a ordem da fresa dentro do protocolo e 1 botão para adicionar a fresa ao protocolo em sua posição devida. a ordem da lista de fresas poderá ser modificada pelo usuário clicando nos botões de alteração de ordem.

&#x20; - `id`: uuid (Auto-gerado, PK)

&#x20; - `nome`: string (Obrigatório, input text no modal)

&#x20; - `tipo\_osso`: string (Obrigatório, input text no modal)

&#x20; - `sigla`: string (Opicional, input text no modal)

&#x20; - `ativo`: boolean (Default: true, switch/checkbox no modal)

\- \*\*RELACIONAMENTOS (FKs):\*\*

&#x20; - `empresa\_id`: FK -> Empresas (Obrigatório, injetado pelo sistema)

&#x20; - `diametros` (Obrigatório, select no modal. Precisa ter pelo menos 1 Diâmetro)

&#x20; - `fresas\_id`: Lista de FKs -> `catalogo\_fresas` (`fresas\_id`)



\---



\# ORDEM DE EXECUÇÃO ESPERADA

1\. Crie ou atualize os arquivos de Schema do Banco de Dados (e gere as migrations se aplicável).

2\. Crie os schemas de validação (ex: Zod) garantindo todas as regras de obrigatoriedade.

3\. Crie os componentes visuais dos 4 modais (`Nova Conexão`, `Nova Família`, `Nova Linha`, `Novo Implante`) integrados com o estado global ou rotas especificadas.













