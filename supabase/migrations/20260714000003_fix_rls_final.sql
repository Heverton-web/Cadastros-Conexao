-- Policy RLS final para catalogo_imagens_produto
-- Super admin: sem restrições
-- Admin normal: só sua empresa

DROP POLICY IF EXISTS catalogo_imagens_produto_empresa ON catalogo_imagens_produto;

CREATE POLICY catalogo_imagens_produto_empresa ON catalogo_imagens_produto
  FOR ALL
  USING (
    -- Super admin pode tudo
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
    OR
    -- Admin normal só vê sua empresa
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    -- Super admin pode inserir em qualquer empresa
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
    OR
    -- Admin normal só insere na sua empresa
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
  );
