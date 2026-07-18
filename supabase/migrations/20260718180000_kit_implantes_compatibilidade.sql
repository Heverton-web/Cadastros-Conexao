-- ============================================================
-- 20260718180000_kit_implantes_compatibilidade.sql
-- Pivot table: Kit ↔ Implantes (compatibilidade)
-- ============================================================

-- ============================================================
-- 1. Kit ↔ Implantes (N:M com flag todos_diametros)
-- ============================================================
CREATE TABLE IF NOT EXISTS catalogo_kit_implantes (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  kit_sku TEXT NOT NULL,
  implante_sku TEXT NOT NULL,
  todos_diametros BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (empresa_id, kit_sku, implante_sku)
);

-- ============================================================
-- 2. RLS Policies
-- ============================================================
ALTER TABLE catalogo_kit_implantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "empresa_select_kit_implantes" ON catalogo_kit_implantes
  FOR SELECT USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());

CREATE POLICY "empresa_insert_kit_implantes" ON catalogo_kit_implantes
  FOR INSERT WITH CHECK (empresa_id = get_current_empresa_id() OR is_super_admin_session());

CREATE POLICY "empresa_update_kit_implantes" ON catalogo_kit_implantes
  FOR UPDATE USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());

CREATE POLICY "empresa_delete_kit_implantes" ON catalogo_kit_implantes
  FOR DELETE USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());

-- ============================================================
-- 3. Índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_kit_implantes_empresa ON catalogo_kit_implantes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_kit_implantes_kit ON catalogo_kit_implantes(kit_sku);
