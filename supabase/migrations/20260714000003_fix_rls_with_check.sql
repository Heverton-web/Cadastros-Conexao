-- Corrigir RLS policy: adicionar WITH CHECK para INSERT/UPDATE
-- A policy anterior só tinha USING, que não valida INSERTs

DROP POLICY IF EXISTS catalogo_imagens_produto_empresa ON catalogo_imagens_produto;

CREATE POLICY catalogo_imagens_produto_empresa ON catalogo_imagens_produto
  FOR ALL
  USING (
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_super_admin = true
    )
  )
  WITH CHECK (
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );
