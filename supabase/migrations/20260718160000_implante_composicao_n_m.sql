-- ============================================================
-- Migration: Tabelas N:M para composição de implantes
-- Data: 2026-07-18
-- ============================================================

-- 1. Implante <-> Kit (N:M)
CREATE TABLE IF NOT EXISTS catalogo_implante_kit (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_sku TEXT NOT NULL,
  kit_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (empresa_id, implante_sku, kit_sku)
);

ALTER TABLE catalogo_implante_kit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "empresa_select_own" ON catalogo_implante_kit
  FOR SELECT USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());
CREATE POLICY "empresa_insert_own" ON catalogo_implante_kit
  FOR INSERT WITH CHECK (empresa_id = get_current_empresa_id() OR is_super_admin_session());
CREATE POLICY "empresa_delete_own" ON catalogo_implante_kit
  FOR DELETE USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());

-- 2. Implante <-> Abutment (N:M)
CREATE TABLE IF NOT EXISTS catalogo_implante_abutment (
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  implante_sku TEXT NOT NULL,
  abutment_sku TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (empresa_id, implante_sku, abutment_sku)
);

ALTER TABLE catalogo_implante_abutment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "empresa_select_own" ON catalogo_implante_abutment
  FOR SELECT USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());
CREATE POLICY "empresa_insert_own" ON catalogo_implante_abutment
  FOR INSERT WITH CHECK (empresa_id = get_current_empresa_id() OR is_super_admin_session());
CREATE POLICY "empresa_delete_own" ON catalogo_implante_abutment
  FOR DELETE USING (empresa_id = get_current_empresa_id() OR is_super_admin_session());

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
