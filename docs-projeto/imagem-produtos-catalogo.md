# Plano: Imagens de Produtos no Módulo Catálogo

## Contexto

O módulo Catálogo já possui uma tabela `catalogo_imagens_implante` para imagens de implantes, mas não tem suporte a imagens para Abutments e Kits. O objetivo é unificar e expandir o sistema de imagens para todos os tipos de produto, suportando 3 formas de inserção: upload (Supabase Storage), URL externa (S3), e URL Google Drive.

## Resumo das Decisões

- **Tabela unificada** `catalogo_imagens_produto` substituindo `catalogo_imagens_implante`
- **Upload opcional** (não bloqueia cadastro sem imagem)
- **Múltiplas imagens** por produto com ordenação
- **Bucket novo** `catalogo-imagens` no Supabase Storage

---

## Passo 1: Migration — Tabela unificada + Bucket

**Arquivo**: `supabase/migrations/20260714000001_catalogo_imagens_produto.sql`

```sql
-- Tabela unificada de imagens
CREATE TABLE catalogo_imagens_produto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  produto_tipo TEXT NOT NULL CHECK (produto_tipo IN ('implante', 'abutment', 'kit')),
  produto_sku TEXT NOT NULL,
  url_imagem TEXT NOT NULL,
  fonte TEXT NOT NULL DEFAULT 'upload' CHECK (fonte IN ('upload', 'url', 'gdrive')),
  ordem_exibicao INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migrar dados existentes de catalogo_imagens_implante
INSERT INTO catalogo_imagens_produto (empresa_id, produto_tipo, produto_sku, url_imagem, ordem_exibicao, created_at)
SELECT empresa_id, 'implante', implante_sku::TEXT, url_imagem, ordem_exibicao, created_at
FROM catalogo_imagens_implante;

-- RLS
ALTER TABLE catalogo_imagens_produto ENABLE ROW LEVEL SECURITY;
CREATE POLICY catalogo_imagens_produto_empresa ON catalogo_imagens_produto
  FOR ALL USING (empresa_id = auth.uid()::uuid OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true
  ));

-- Bucket (será feito via Dashboard ou CLI)
-- CREATE STORAGE BUCKET catalogo-imagens;
```

**Nota**: A tabela antiga `catalogo_imagens_implante` pode ser mantida por segurança e droppada em migration separada depois da validação.

---

## Passo 2: Types — Atualizar interfaces

**Arquivo**: `src/features/catalogo/types/index.ts`

Adicionar/unificar:

```typescript
export type ProdutoTipoImagem = "implante" | "abutment" | "kit"
export type FonteImagem = "upload" | "url" | "gdrive"

export interface CatalogoImagemProduto {
  id: string
  empresa_id: string
  produto_tipo: ProdutoTipoImagem
  produto_sku: string
  url_imagem: string
  fonte: FonteImagem
  ordem_exibicao: number
  created_at: string
}
```

Manter `CatalogoImagemImplante` como alias para retrocompatibilidade:
```typescript
export type CatalogoImagemImplante = CatalogoImagemProduto
```

---

## Passo 3: Service — Upload + CRUD de imagens

**Arquivo**: `src/features/catalogo/services/imagens.service.ts` (novo)

Funções:

| Função | Descrição |
|--------|-----------|
| `uploadImagem(empresaId, tipo, sku, file)` | Upload para Supabase Storage (`catalogo-imagens/{empresaId}/{tipo}/{sku}/{uuid}.{ext}`), retorna URL pública |
| `adicionarImagemUrl(empresaId, tipo, sku, url, fonte)` | Insere URL direta (S3 ou Google Drive) |
| `listarImagens(empresaId, tipo, sku)` | Lista imagens de um produto |
| `removerImagem(empresaId, imagemId)` | Deleta imagem do banco e do storage (se fonte=upload) |
| `reordenarImagens(empresaId, tipo, sku, ordens)` | Atualiza `ordem_exibicao` |
| `extrairUrlGoogleDrive(url)` | Converte URL de compartilhamento Google Drive para URL direta de download |

**Padrão de upload** (segue padrão existente em `despesas.service.ts`):
```typescript
const path = `${empresaId}/${tipo}/${sku}/${crypto.randomUUID()}.${ext}`
await supabase.storage.from("catalogo-imagens").upload(path, file, { upsert: false })
const { data } = supabase.storage.from("catalogo-imagens").getPublicUrl(path)
return data.publicUrl
```

**Conversão Google Drive**:
```typescript
// URL: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
// Resultado: https://lh3.googleusercontent.com/d/{FILE_ID}
function extrairUrlGoogleDrive(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error("URL do Google Drive inválida")
  return `https://lh3.googleusercontent.com/d/${match[1]}`
}
```

---

## Passo 4: Componente — ImageUploader (reutilizável)

**Arquivo**: `src/features/catalogo/components/admin/produtos/ImageUploader.tsx` (novo)

Componente com 3 abas/modos:
1. **Upload** — Input file com drag-and-drop, preview, validação 5MB, conversão automática para WebP opcional
2. **URL (S3)** — Input de texto para colar URL externa
3. **Google Drive** — Input de texto para colar link de compartilhamento

Props:
```typescript
interface ImageUploaderProps {
  empresaId: string
  produtoTipo: ProdutoTipoImagem
  produtoSku: string
  imagensExistentes: CatalogoImagemProduto[]
  onImagensChange: (imagens: CatalogoImagemProduto[]) => void
}
```

Features:
- Preview das imagens já adicionadas
- Drag-and-drop para reordenar
- Botão de remover com confirmação
- Validação: max 5MB por arquivo, tipos aceitos (jpg, png, webp)
- Toast de erro/sucesso

---

## Passo 5: Integrar no ProdutoFormModal

**Arquivo**: `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx`

Alterações:
- Adicionar estado `imagens` no modal
- Carregar imagens existentes ao editar (via `listarImagens`)
- Inserir componente `ImageUploader` após os campos do formulário
- Ao salvar: chamar `uploadImagem` ou `adicionarImagemUrl` para cada imagem nova
- Passar imagens para os payloads

---

## Passo 6: Atualizar Services existentes (queries)

**Arquivos**:
- `src/features/catalogo/services/implantes.service.ts` — manter join com `catalogo_imagens_produto` (renomear tabela)
- `src/features/catalogo/services/componentes.service.ts` — adicionar join com `catalogo_imagens_produto`
- `src/features/catalogo/services/kits.service.ts` — adicionar join com `catalogo_imagens_produto`

Exemplo (abutments):
```typescript
.select("*, familia:catalogo_familias(*), ..., imagens:catalogo_imagens_produto(*)")
```

---

## Passo 7: Atualizar types para incluir imagens

**Arquivo**: `src/features/catalogo/types/index.ts`

Adicionar campo `imagens` em:
- `CatalogoAbutment` → `imagens?: CatalogoImagemProduto[]`
- `CatalogoKit` → `imagens?: CatalogoImagemProduto[]`

---

## Passo 8: Atualizar ProductCard e ProductThumb

**Arquivos**:
- `src/features/catalogo/components/ProductCard.tsx` — passar `imageUrl` do primeiro item de `imagens`
- `src/features/catalogo/components/ProductSheet.tsx` — exibir imagens do produto
- `src/features/catalogo/components/ProductThumb.tsx` — já suporta `imageUrl`, apenas conectar

---

## Arquivos a criar/modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/20260714000001_catalogo_imagens_produto.sql` | Criar |
| `src/features/catalogo/services/imagens.service.ts` | Criar |
| `src/features/catalogo/components/admin/produtos/ImageUploader.tsx` | Criar |
| `src/features/catalogo/types/index.ts` | Modificar |
| `src/features/catalogo/components/admin/produtos/ProdutoFormModal.tsx` | Modificar |
| `src/features/catalogo/services/implantes.service.ts` | Modificar |
| `src/features/catalogo/services/componentes.service.ts` | Modificar |
| `src/features/catalogo/services/kits.service.ts` | Modificar |
| `src/features/catalogo/components/ProductCard.tsx` | Modificar |
| `src/features/catalogo/components/ProductSheet.tsx` | Modificar |

---

## Verificação

1. `npm run build` — sem erros
2. Abrir modal de criar produto → aba de imagens visível
3. Fazer upload de imagem (≤5MB) → preview aparece
4. Colar URL S3 → preview aparece
5. Colar link Google Drive → URL convertida e preview aparece
6. Salvar → imagens persistidas no banco
7. Editar produto → imagens carregam corretamente
8. ProductCard na listagem exibe thumbnails
9. ProductSheet exibe imagens do produto
