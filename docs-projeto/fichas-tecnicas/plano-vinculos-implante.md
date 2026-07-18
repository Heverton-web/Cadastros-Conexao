# Plano: Vínculos de Implante com Kits, Cicatrizadores e Abutments

## Contexto

O modal de cadastro/edição de implantes (`catalogo.admin.implantes.tsx`) já gerencia vínculos com **Chaves** via pivot table `catalogo_implante_chaves`. Precisamos estender para:
- **Kits** (N:M)
- **Cicatrizadores** (1:N existente, mas sem UI)
- **Abutments** (N:M)

## Estado Atual do Schema

| Tabela | Coluna FK existente | Tipo |
|---|---|---|
| `catalogo_cicatrizadores_v2` | `implante_id UUID` | 1:N (cicatrizador → 1 implante) |
| `catalogo_implante_chaves` | pivot N:M | ✅ Já funciona |
| `catalogo_kits_v2` | ❌ Nenhuma FK para implante | Precisa criar |
| `catalogo_abutments` | ❌ Nenhuma FK para implante | Precisa criar |

## O que Precisa ser Criado

### 1. Migration SQL — Pivot Tables

```sql
-- Implante ↔ Kits (N:M)
CREATE TABLE IF NOT EXISTS catalogo_implante_kits (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_sku TEXT NOT NULL,
  kit_sku TEXT NOT NULL,
  PRIMARY KEY (empresa_id, implante_sku, kit_sku)
);

-- Implante ↔ Abutments (N:M)
CREATE TABLE IF NOT EXISTS catalogo_implante_abutments (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_sku TEXT NOT NULL,
  abutment_sku TEXT NOT NULL,
  PRIMARY KEY (empresa_id, implante_sku, abutment_sku)
);
```

**Cicatrizadores**: A tabela `catalogo_cicatrizadores_v2` já tem `implante_id UUID`. Não precisa de pivot — é 1:N. Basta habilitar a UI para vincular/desvincular.

### 2. RLS Policies

Adicionar policies padrão empresa_id para as 2 novas pivot tables:
```sql
-- SELECT
CREATE POLICY "empresa_select_implante_kits" ON catalogo_implante_kits
  FOR SELECT USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());
-- INSERT/UPDATE/DELETE (mesmo padrão)
```

### 3. TypeScript Types

Adicionar em `src/features/catalogo/types/index.ts`:

```typescript
export interface CatalogoImplanteKit {
  empresa_id: string
  implante_sku: string
  kit_sku: string
}

export interface CatalogoImplanteAbutment {
  empresa_id: string
  implante_sku: string
  abutment_sku: string
}
```

### 4. UI — Modal de Implante

Adicionar 3 novas seções no modal (após "Chaves Compatíveis"):

#### Seção A: Kits Compatíveis
- Multi-select toggle (mesmo padrão das Chaves)
- Botão `allKits` query carregando kits ativos da empresa
- Salva em `catalogo_implante_kits`

#### Seção B: Cicatrizadores Vinculados
- Multi-select toggle
- Lista cicatrizadores ativos da empresa
- Salva via `UPDATE catalogo_cicatrizadores_v2 SET implante_sku = ?` (1:N)
- Para desvincular: `SET implante_sku = NULL`

#### Seção C: Abutments Compatíveis
- Multi-select toggle (mesmo padrão)
- Lista abutments ativos da empresa
- Salva em `catalogo_implante_abutments`

### 5. Save Logic (handleSaveImpl)

Estender `handleSaveImpl()` para salvar os 3 novos vínculos:

```typescript
// Após salvar o implante...

// Kits N:M
await supabase.from("catalogo_implante_kits")
  .delete().eq("empresa_id", empresaId).eq("implante_sku", implData.sku)
if (implKits.length > 0) {
  await supabase.from("catalogo_implante_kits")
    .insert(implKits.map(kit_sku => ({ empresa_id: empresaId, implante_sku: implData.sku, kit_sku })))
}

// Cicatrizadores 1:N (desvincular todos, depois vincular selecionados)
await supabase.from("catalogo_cicatrizadores_v2")
  .update({ implante_id: null })
  .eq("implante_id", implData.sku).eq("empresa_id", empresaId)
if (implCicatrizadores.length > 0) {
  await supabase.from("catalogo_cicatrizadores_v2")
    .update({ implante_id: implData.sku })
    .in("sku", implCicatrizadores).eq("empresa_id", empresaId)
}

// Abutments N:M
await supabase.from("catalogo_implante_abutments")
  .delete().eq("empresa_id", empresaId).eq("implante_sku", implData.sku)
if (implAbutments.length > 0) {
  await supabase.from("catalogo_implante_abutments")
    .insert(implAbutments.map(abutment_sku => ({ empresa_id: empresaId, implante_sku: implData.sku, abutment_sku })))
}
```

### 6. Load Logic (openEditImpl)

Ao editar, carregar vínculos existentes:

```typescript
// Em openEditImpl:
const { data: kitsVinculados } = await supabase
  .from("catalogo_implante_kits")
  .select("kit_sku")
  .eq("empresa_id", empresaId).eq("implante_sku", impl.sku)
setImplKits(kitsVinculados?.map(k => k.kit_sku) ?? [])

const { data: abutmentsVinculados } = await supabase
  .from("catalogo_implante_abutments")
  .select("abutment_sku")
  .eq("empresa_id", empresaId).eq("implante_sku", impl.sku)
setImplAbutments(abutmentsVinculados?.map(a => a.abutment_sku) ?? [])

// Cicatrizadores: já estão na query principal (impl.cicatrizadores?)
// ou buscar por implante_id
```

## Resumo de Entregáveis

| # | Entregável | Arquivo |
|---|---|---|
| 1 | Migration SQL | `supabase/migrations/XXX_implante_vinculos.sql` |
| 2 | Types TS | `src/features/catalogo/types/index.ts` |
| 3 | UI Seções no modal | `src/routes/catalogo.admin.implantes.tsx` |
| 4 | Save/Load logic | `src/routes/catalogo.admin.implantes.tsx` |
| 5 | Build validation | `npm run build` |

## UI Mockup (Seções no Modal)

```
┌─────────────────────────────────────────────┐
│  [Hierarquia] [Identificação] [Protocolos]  │
│  [Chaves]                                  │
│                                             │
│  KITS COMPATÍVEIS                          │
│  ┌─────────────────────────────────────┐    │
│  │ [●] Kit Cirúrgico Alpha  [Adicionar]│    │
│  │ [ ] Kit Fresagem Pro     [Adicionar]│    │
│  │ [●] Kit Básico           [Adicionar]│    │
│  └─────────────────────────────────────┘    │
│                                             │
│  CICATRIZADORES VINCULADOS                 │
│  ┌─────────────────────────────────────┐    │
│  │ [●] Cic. Estético 3.5   [Vincular]  │    │
│  │ [ ] Cic. Convencional   [Vincular]  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ABUTMENTS COMPATÍVEIS                     │
│  ┌─────────────────────────────────────┐    │
│  │ [●] Abut. Estraight 3.5 [Adicionar] │    │
│  │ [ ] Abut. Angulado 15°  [Adicionar] │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Especificações] [Imagens] [Comercial]    │
└─────────────────────────────────────────────┘
```

## Nota sobre o Mockup do Usuário

A imagem mostrada ("COMPOSIÇÃO DO KIT" com Chaves, Fresas, Instrumentais) é o padrão para o formulário de **Kits**. Para implantes, usamos o mesmo padrão visual (toggle + botão) mas com as categorias específicas: Kits, Cicatrizadores, Abutments.
