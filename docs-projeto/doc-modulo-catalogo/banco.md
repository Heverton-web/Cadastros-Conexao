# DB COMPLETO

Este é o **Projeto Arquitetural Definitivo** do seu banco de dados. Ele consolida todo o ecossistema da implantodontia (Cirúrgico, Protético, Digital e Kits) em um modelo relacional de nível Enterprise.

A estrutura foi dividida em **6 Módulos Lógicos** para facilitar a implementação no seu banco de dados (como PostgreSQL/Supabase).

---

### MÓDULO 1: HIERARQUIA CIRÚRGICA BÁSICA

A espinha dorsal que categoriza a linha primária de produtos.

#### 1. `categorias`

| Campo  | Tipo          | Restrições  | Descrição               |
| ------ | ------------- | ----------- | ----------------------- |
| `id`   | `SERIAL`      | Primary Key | Ex: 1 ("Implantes").    |
| `nome` | `VARCHAR(50)` | Not Null    | Nome da categoria raiz. |

#### 2. `conexoes`

| Campo          | Tipo          | Restrições                 | Descrição                             |
| -------------- | ------------- | -------------------------- | ------------------------------------- |
| `id`           | `SERIAL`      | Primary Key                | Identificador único.                  |
| `categoria_id` | `INTEGER`     | Foreign Key (`categorias`) | Vínculo hierárquico.                  |
| `nome`         | `VARCHAR(50)` | Not Null                   | Ex: "Cone Morse", "Hexágono Externo". |
| `sigla`        | `VARCHAR(10)` | Not Null                   | Ex: "CM", "HE", "HI".                 |

#### 3. `familias`

| Campo               | Tipo          | Restrições               | Descrição                       |
| ------------------- | ------------- | ------------------------ | ------------------------------- |
| `id`                | `SERIAL`      | Primary Key              | Identificador único.            |
| `conexao_id`        | `INTEGER`     | Foreign Key (`conexoes`) | Vínculo à conexão.              |
| `nome`              | `VARCHAR(50)` | Not Null                 | Ex: "NP", "GMF", "FIT", "Slim". |
| `cor_identificacao` | `VARCHAR(30)` | Not Null                 | Ex: "Azul", "Amarelo" (UI/UX).  |

#### 4. `linhas`

| Campo        | Tipo           | Restrições               | Descrição                              |
| ------------ | -------------- | ------------------------ | -------------------------------------- |
| `id`         | `SERIAL`       | Primary Key              | Identificador único.                   |
| `familia_id` | `INTEGER`      | Foreign Key (`familias`) | Vínculo à família anatômica.           |
| `nome`       | `VARCHAR(100)` | Not Null                 | Ex: "Flex Gold", "Easy Grip", "Flash". |
| `ativo`      | `BOOLEAN`      | Default True             | Regra comercial de catálogo.           |

---

### MÓDULO 2: IMPLANTES E BROCAS (O Coração Cirúrgico)

#### 5. `implantes`

| Campo             | Tipo           | Restrições             | Descrição                                |
| ----------------- | -------------- | ---------------------- | ---------------------------------------- |
| `sku`             | `VARCHAR(50)`  | Primary Key            | Ex: "524385". Produto transacional.      |
| `linha_id`        | `INTEGER`      | Foreign Key (`linhas`) | Vínculo com a linha/marca.               |
| `diametro_mm`     | `DECIMAL(4,2)` | Not Null               | Ex: 3.50, 4.30.                          |
| `comprimento_mm`  | `DECIMAL(4,2)` | Not Null               | Ex: 8.50, 11.50.                         |
| `rosca_interna`   | `VARCHAR(20)`  | Nullable               | Ex: "M 1.6", "M 2.0".                    |
| `regiao_apical`   | `VARCHAR(50)`  | Nullable               | Ex: "Cônico".                            |
| `regiao_cervical` | `VARCHAR(50)`  | Nullable               | Ex: "Cilíndrico".                        |
| `torque_insercao` | `INTEGER`      | Nullable               | Em N.cm (Ex: 60, 45).                    |
| `detalhes_extras` | `JSONB`        | Nullable               | Dados mutáveis (Superfície, Tratamento). |

#### 6. `imagens_implante`

| Campo            | Tipo          | Restrições                | Descrição                     |
| ---------------- | ------------- | ------------------------- | ----------------------------- |
| `id`             | `SERIAL`      | Primary Key               | Identificador da imagem.      |
| `implante_sku`   | `VARCHAR(50)` | Foreign Key (`implantes`) | Vínculo com o SKU.            |
| `url_imagem`     | `TEXT`        | Not Null                  | Caminho da foto.              |
| `ordem_exibicao` | `INTEGER`     | Not Null                  | 1 para Capa, 2+ para Galeria. |

#### 7. `fresas`

| Campo          | Tipo           | Restrições   | Descrição                            |
| -------------- | -------------- | ------------ | ------------------------------------ |
| `sku`          | `VARCHAR(50)`  | Primary Key  | Produto transacional (Broca).        |
| `nome`         | `VARCHAR(100)` | Not Null     | Ex: "Fresa Lança 2.0", "Stop Drill". |
| `diametro_mm`  | `DECIMAL(4,2)` | Nullable     | Dimensional técnico.                 |
| `venda_avulsa` | `BOOLEAN`      | Default True | Pode ser reposta no e-commerce.      |

#### 8. `protocolos_fresagem` (Guia Cirúrgico)

| Campo          | Tipo          | Restrições                | Descrição                         |
| -------------- | ------------- | ------------------------- | --------------------------------- |
| `id`           | `SERIAL`      | Primary Key               | Identificador do passo.           |
| `implante_sku` | `VARCHAR(50)` | Foreign Key (`implantes`) | O Implante alvo.                  |
| `fresa_sku`    | `VARCHAR(50)` | Foreign Key (`fresas`)    | A broca a ser usada.              |
| `tipo_osso`    | `VARCHAR(30)` | Not Null                  | "Soft (III-IV)" ou "Hard (I-II)". |
| `ordem_uso`    | `INTEGER`     | Not Null                  | Passo (1, 2, 3...).               |

---

### MÓDULO 3: CLASSIFICAÇÃO PROTÉTICA E ABUTMENTS

#### 9. `tipos_reabilitacao`

| Campo  | Tipo          | Restrições  | Descrição                          |
| ------ | ------------- | ----------- | ---------------------------------- |
| `id`   | `SERIAL`      | Primary Key | Identificador.                     |
| `nome` | `VARCHAR(50)` | Not Null    | "Unitária", "Múltipla", "Híbrida". |

#### 10. `tipos_abutment`

| Campo   | Tipo           | Restrições  | Descrição                             |
| ------- | -------------- | ----------- | ------------------------------------- |
| `id`    | `SERIAL`       | Primary Key | Identificador.                        |
| `nome`  | `VARCHAR(100)` | Not Null    | "Micro Unit", "TiBase", "Esteticone". |
| `sigla` | `VARCHAR(10)`  | Nullable    | "MU", "UB", "EC".                     |

#### 11. `abutments`

| Campo                  | Tipo           | Restrições                | Descrição                             |
| ---------------------- | -------------- | ------------------------- | ------------------------------------- |
| `sku`                  | `VARCHAR(50)`  | Primary Key               | Produto transacional central.         |
| `familia_id`           | `INTEGER`      | Foreign Key (`familias`)  | Qual implante ele aceita (Ex: NP).    |
| `tipo_reabilitacao_id` | `INTEGER`      | FK (`tipos_reabilitacao`) | Vínculo de indicação.                 |
| `tipo_abutment_id`     | `INTEGER`      | FK (`tipos_abutment`)     | O modelo/família do pilar.            |
| `diametro_plataforma`  | `DECIMAL(4,2)` | Nullable                  | Plataforma de assentamento protético. |
| `angulacao_graus`      | `DECIMAL(4,2)` | Default 0                 | Ex: 0 (Reto), 17, 30.                 |
| `altura_transmucoso`   | `DECIMAL(4,2)` | Nullable                  | Cinta gengival (0.8, 1.5, etc).       |
| `altura_corpo`         | `DECIMAL(4,2)` | Nullable                  | Altura do pilar.                      |
| `torque_ncm`           | `INTEGER`      | Nullable                  | Torque em Ncm (Ex: 20, 30).           |

---

### MÓDULO 4: ACESSÓRIOS, FERRAMENTAL E INFRAESTRUTURA

#### 12. `categorias_acessorio` e 13. `categorias_instrumental`

_(Duas tabelas simples contendo `id` SERIAL e `nome` VARCHAR para categorizar peças)._

- **Acessórios:** "Cicatrizador", "Transfer", "Scan Body", "Análogo", "Parafuso".
- **Instrumental:** "Catracas", "Caixas", "Anilhas", "Medição".

#### 14. `acessorios` (Peças Consumíveis e de Molde)

| Campo             | Tipo           | Restrições                  | Descrição                                 |
| ----------------- | -------------- | --------------------------- | ----------------------------------------- |
| `sku`             | `VARCHAR(50)`  | Primary Key                 | Produto (Ex: Cicatrizador 124215).        |
| `categoria_id`    | `INTEGER`      | FK (`categorias_acessorio`) | Vínculo hierárquico.                      |
| `nome`            | `VARCHAR(100)` | Not Null                    | Nome comercial.                           |
| `diametro_mm`     | `DECIMAL(4,2)` | Nullable                    | Perfil de emergência.                     |
| `altura_mm`       | `DECIMAL(4,2)` | Nullable                    | Altura (Ex: transmucoso do cicatrizador). |
| `caracteristicas` | `JSONB`        | Nullable                    | Ex: `{"moldeira": "Fechada"}`.            |

#### 15. `chaves_ferramentais` (Ferramentas Ativas)

| Campo             | Tipo           | Restrições  | Descrição                                |
| ----------------- | -------------- | ----------- | ---------------------------------------- |
| `sku`             | `VARCHAR(50)`  | Primary Key | Produto (Ex: Chave Hex, Sonda Gengival). |
| `nome`            | `VARCHAR(100)` | Not Null    | Nome comercial.                          |
| `tipo_ferramenta` | `VARCHAR(30)`  | Not Null    | "Aperto", "Medição", "Cirúrgica".        |

#### 16. `acessorio_ferramental` (Cross-sell Inteligente)

| Campo            | Tipo                              | Restrições                 | Descrição                              |
| ---------------- | --------------------------------- | -------------------------- | -------------------------------------- |
| `acessorio_sku`  | `VARCHAR(50)`                     | FK (`acessorios`)          | A peça (Ex: Parafuso ou Cicatrizador). |
| `ferramenta_sku` | `VARCHAR(50)`                     | FK (`chaves_ferramentais`) | A ferramenta exigida (Chave ou Sonda). |
| `obrigatorio`    | `BOOLEAN`                         | Default False              | É vital para uso da peça?              |
| **PK Composta**  | `(acessorio_sku, ferramenta_sku)` | Primary Key                | Restrição.                             |

#### 17. `instrumentais_gerais` (Infraestrutura)

| Campo          | Tipo           | Restrições                     | Descrição                                  |
| -------------- | -------------- | ------------------------------ | ------------------------------------------ |
| `sku`          | `VARCHAR(50)`  | Primary Key                    | Produto (Ex: Caixa Organizadora, Catraca). |
| `categoria_id` | `INTEGER`      | FK (`categorias_instrumental`) | Vínculo hierárquico.                       |
| `nome`         | `VARCHAR(100)` | Not Null                       | Nome comercial.                            |

---

### MÓDULO 5: MOTOR DE WORKFLOWS PROTÉTICOS

O sistema nervoso que amarra as peças na sequência temporal correta.

#### 18. `workflows` e 19. `etapas_workflow`

_(Duas tabelas simples)_

- **Workflows:** `id`, `nome` (Ex: "Analógico Gesso", "Scan Digital inLego").
- **Etapas:** `id`, `ordem` (INT), `nome` (Ex: 1-"Cicatrização", 2-"Transferência", 3-"Análogos").

#### 20. `guia_reabilitacao` (A Matriz Mestre)

| Campo                 | Tipo           | Restrições             | Descrição                                                              |
| --------------------- | -------------- | ---------------------- | ---------------------------------------------------------------------- |
| `id`                  | `SERIAL`       | Primary Key            | ID da regra.                                                           |
| `familia_id`          | `INTEGER`      | FK (`familias`)        | Qual implante base (Ex: NP).                                           |
| `tipo_abutment_id`    | `INTEGER`      | FK (`tipos_abutment`)  | Opcional. Se `NULL`, a peça vai direto no implante (Ex: Cicatrizador). |
| `diametro_plataforma` | `DECIMAL(4,2)` | Nullable               | Opcional, para variações (Small/Large).                                |
| `workflow_id`         | `INTEGER`      | FK (`workflows`)       | A qual fluxo pertence.                                                 |
| `etapa_id`            | `INTEGER`      | FK (`etapas_workflow`) | Em qual passo a peça é usada.                                          |
| `acessorio_sku`       | `VARCHAR(50)`  | FK (`acessorios`)      | A peça que será exibida e sugerida na tela.                            |

---

### MÓDULO 6: KITS E COMPOSIÇÕES (O BOM - Bill of Materials)

A estruturação que agrupa todos os itens em maletas comercializáveis.

#### 21. `categorias_kit`

_(Tabela simples)_ `id`, `nome` (Ex: "Cirúrgico", "Protético", "Guiada").

#### 22. `kits`

| Campo          | Tipo           | Restrições            | Descrição                                     |
| -------------- | -------------- | --------------------- | --------------------------------------------- |
| `sku`          | `VARCHAR(50)`  | Primary Key           | O Produto Pai (Ex: Kit Master Flex Completo). |
| `categoria_id` | `INTEGER`      | FK (`categorias_kit`) | Vínculo hierárquico.                          |
| `nome`         | `VARCHAR(100)` | Not Null              | Nome da Maleta.                               |

#### 23. `kit_familias` (Compatibilidade do Kit)

| Campo           | Tipo                    | Restrições      | Descrição                                |
| --------------- | ----------------------- | --------------- | ---------------------------------------- |
| `kit_sku`       | `VARCHAR(50)`           | FK (`kits`)     | O Kit.                                   |
| `familia_id`    | `INTEGER`               | FK (`familias`) | A Família que ele atende (NP, GMF, etc). |
| **PK Composta** | `(kit_sku, familia_id)` | Primary Key     | Restrição de duplicidade.                |

#### 24. `kit_composicao` (A Lista de Materiais do Kit)

| Campo              | Tipo          | Restrições                  | Descrição                                   |
| ------------------ | ------------- | --------------------------- | ------------------------------------------- |
| `id`               | `SERIAL`      | Primary Key                 | ID da linha do material.                    |
| `kit_sku`          | `VARCHAR(50)` | FK (`kits`)                 | O Kit Pai.                                  |
| `quantidade`       | `INTEGER`     | Not Null                    | Quantas unidades da peça vão na maleta.     |
| `fresa_sku`        | `VARCHAR(50)` | FK (`fresas`) Nullable      | Aponta para a Broca (se for broca).         |
| `chave_sku`        | `VARCHAR(50)` | FK (`chaves...`) Nullable   | Aponta para a Chave/Sonda.                  |
| `acessorio_sku`    | `VARCHAR(50)` | FK (`acessorios`) Nullable  | Aponta para Transfer/Cicatrizador/Parafuso. |
| `instrumental_sku` | `VARCHAR(50)` | FK (`inst_gerais`) Nullable | Aponta para Caixa/Catraca.                  |
| `implante_sku`     | `VARCHAR(50)` | FK (`implantes`) Nullable   | Aponta para Implante (Kit Promocional).     |

**A Constraint de Arco Exclusivo (Garantia de Integridade):\***(Rodar este SQL no banco)\*
