# Multi-endereços: Empresa, Entrega, Cobrança

3 tipos de endereço no cadastro, formulário dinâmico e admin config.

## 1. Banco

### Migration `00033_multi_enderecos.sql`

- Criar enum `tipo_endereco: 'empresa', 'entrega', 'cobranca'`
- `cadastros_enderecos` atual:
  - Remover default `tipo_endereco = 'clinica'`
  - Converter coluna `tipo_endereco` p/ enum
  - Remover UNIQUE constraint em `cadastro_id` (vira 1:N)
  - Adicionar UNIQUE `(cadastro_id, tipo_endereco)`
- Backfill: endereço existente vira `tipo = 'empresa'`
- View `clientes` atualizada p/ joins por tipo

## 2. Form Schema

- Adicionar `etapa = 'endereco'` seções p/ cada tipo:
  - `endereco_empresa` (default visível, 10 campos: cep, rua, numero, bairro, complemento, cidade, estado)
  - `endereco_entrega` (idem)
  - `endereco_cobranca` (idem)
- Seed migration: clonar campos de endereço existentes p/ entrega e cobrança
- Admin pode ocultar/obrigar por tipo via FormBuilderTab (já suporta)

## 3. Pré-cadastro (lead form)

### Etapa "endereco" dividida em sub-blocos

- **Endereço da Empresa:** sempre visível, campos do schema `endereco_empresa`
- **Endereço de Entrega:** checkbox "Usar mesmo endereço da empresa" (default: checked)
  - Desmarcar → revela campos do schema `endereco_entrega`
- **Endereço de Cobrança:** checkbox "Usar mesmo" (default: checked)
  - Desmarcar → revela campos do schema `endereco_cobranca`
- Estado `FormData` vira:
  ```ts
  enderecos: {
    empresa: { cep, rua, numero, ... },
    entrega: { ... } | null,  // null = usa empresa
    cobranca: { ... } | null, // null = usa empresa
  }
  ```
- Submit: `update_cadastro_from_precadastro` salva 1-3 linhas em `cadastros_enderecos`

## 4. Admin (visualização)

- Tela de detalhe do cadastro mostra 3 blocos de endereço (empresa, entrega, cobrança)
- Se entrega/cobrança for null, exibir "Usa endereço da empresa"

## 5. Impacto

| Área                                   | Mudança                                            |
| -------------------------------------- | -------------------------------------------------- |
| DB                                     | 1 migration, 1 novo enum                           |
| form-schema                            | 2 novas seções de etapa                            |
| pre-cadastro                           | refator etapa endereco p/ 3 sub-blocos c/ checkbox |
| RPC `update_cadastro_from_precadastro` | aceitar array de endereços                         |
| admin cliente detail                   | mostrar 3 blocos                                   |
| view clientes                          | joins c/ tipo                                      |
