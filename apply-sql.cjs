const https = require('https')

const URL_BASE = 'https://cluuqzhizeqvkgvfdisx.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc4ODc2OSwiZXhwIjoyMDk3MzY0NzY5fQ.nFgZm_frOy8K6e6LUpQNqQ4zVMrNoCKcM8MqYfDv9Ag'

const SQL = `
-- 1. FK implante_chaves -> chaves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_implante_chaves_chave'
  ) THEN
    ALTER TABLE public.catalogo_implante_chaves
      ADD CONSTRAINT fk_implante_chaves_chave
      FOREIGN KEY (chave_id)
      REFERENCES public.catalogo_chaves(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Seed: Categorias
INSERT INTO catalogo_categorias (id, empresa_id, nome, locked, ativo) VALUES
  ('c0000001-0000-0000-0000-000000000001', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Implantes Dentários', true, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed: Conexões
INSERT INTO catalogo_ips_conexoes (id, empresa_id, categoria_id, nome, sigla, locked, ativo) VALUES
  ('e475a172-b6a7-47f1-b855-2ffd88128eae', '6687e2f0-1ff6-406d-b621-7927764f121a', 'c0000001-0000-0000-0000-000000000001', 'Internal Hex', 'IH', true, true),
  ('e475a172-b6a7-47f1-b855-2ffd88128eb1', '6687e2f0-1ff6-406d-b621-7927764f121a', 'c0000001-0000-0000-0000-000000000001', 'Cone Morse', 'CM', true, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed: Famílias
INSERT INTO catalogo_ips_familias (id, empresa_id, conexao_id, nome, cor_identificacao, ativo) VALUES
  ('88461f97-7583-4a12-b9d8-0c004ba7d2b7', '6687e2f0-1ff6-406d-b621-7927764f121a', 'e475a172-b6a7-47f1-b855-2ffd88128eae', 'Active', '#3B82F6', true),
  ('88461f97-7583-4a12-b9d8-0c004ba7d2b8', '6687e2f0-1ff6-406d-b621-7927764f121a', 'e475a172-b6a7-47f1-b855-2ffd88128eae', 'One', '#10B981', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed: Linhas
INSERT INTO catalogo_ips_linhas (id, empresa_id, familia_id, nome, ativo) VALUES
  ('d15f32d3-bbd2-4eee-ac0b-4b8d9de8022f', '6687e2f0-1ff6-406d-b621-7927764f121a', '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 'Regular', true),
  ('d15f32d3-bbd2-4eee-ac0b-4b8d9de80230', '6687e2f0-1ff6-406d-b621-7927764f121a', '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 'Short', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed: Chaves
INSERT INTO catalogo_chaves (sku, empresa_id, nome, sigla, tipo, ativo, preco) VALUES
  ('CHV-6687-001', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Chave de Aperto IH 1.25mm', 'CAI', 'Aperto', true, 89.90),
  ('CHV-6687-002', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Chave de Torque 35Ncm', 'CT35', 'Torque', true, 149.90),
  ('CHV-6687-003', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Chave Cirúrgica Sítio', 'CCS', 'Cirúrgica', true, 199.90)
ON CONFLICT (sku, empresa_id) DO NOTHING;

-- 7. Seed: Implantes
INSERT INTO catalogo_implantes (sku, empresa_id, linha_id, diametro_mm, comprimento_mm, rosca_interna, torque_insercao, preco, ativo, detalhes_extras) VALUES
  ('IMP-IH-6687-001', '6687e2f0-1ff6-406d-b621-7927764f121a', 'd15f32d3-bbd2-4eee-ac0b-4b8d9de8022f', 3.75, 11.5, 'M 1.6', 35, 289.90, true, '{"material":"Titânio Grau 4","superficie":"Porous","conexao_id":"e475a172-b6a7-47f1-b855-2ffd88128eae","familia_id":"88461f97-7583-4a12-b9d8-0c004ba7d2b7","categoria_id":"c0000001-0000-0000-0000-000000000001"}'),
  ('IMP-IH-6687-002', '6687e2f0-1ff6-406d-b621-7927764f121a', 'd15f32d3-bbd2-4eee-ac0b-4b8d9de8022f', 4.25, 11.5, 'M 1.6', 40, 319.90, true, '{"material":"Titânio Grau 4","superficie":"Porous","conexao_id":"e475a172-b6a7-47f1-b855-2ffd88128eae","familia_id":"88461f97-7583-4a12-b9d8-0c004ba7d2b7","categoria_id":"c0000001-0000-0000-0000-000000000001"}')
ON CONFLICT (sku, empresa_id) DO NOTHING;

-- 8. Seed: Kits
INSERT INTO catalogo_kits (sku, empresa_id, nome, descricao, preco, ativo) VALUES
  ('KIT-6687-001', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Kit Cirúrgico Básico', 'Kit completo para implantes IH', 1299.90, true),
  ('KIT-6687-002', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Kit Protético Digital', 'Kit para reabilitação protética', 899.90, true)
ON CONFLICT (sku, empresa_id) DO NOTHING;

-- 9. Seed: Abutments
INSERT INTO catalogo_abutments (sku, empresa_id, familia_id, nome, sigla, diametro_plataforma, angulacao_graus, altura_transmucoso, altura_corpo, torque_ncm, preco, ativo) VALUES
  ('ABU-6687-001', '6687e2f0-1ff6-406d-b621-7927764f121a', '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 'Abutment Cilíndrico 3.5', 'ACIL', '3.5', 0, 2.0, 8.0, 25, 189.90, true),
  ('ABU-6687-002', '6687e2f0-1ff6-406d-b621-7927764f121a', '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 'Abutment Angulado 15°', 'AANG', '3.5', 15, 2.0, 10.0, 25, 249.90, true)
ON CONFLICT (sku, empresa_id) DO NOTHING;

-- 10. Seed: Cicatrizadores
INSERT INTO catalogo_cicatrizadores (sku, empresa_id, nome, altura_transmucoso, diametro_plataforma, torque_ncm, familia_id, preco, ativo) VALUES
  ('CIC-6687-001', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Cicatrizador 3.5mm H2.0', 2.0, '3.5', 15, '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 89.90, true),
  ('CIC-6687-002', '6687e2f0-1ff6-406d-b621-7927764f121a', 'Cicatrizador 3.5mm H3.0', 3.0, '3.5', 15, '88461f97-7583-4a12-b9d8-0c004ba7d2b7', 92.90, true)
ON CONFLICT (sku, empresa_id) DO NOTHING;

-- 11. Pivot: Implante <-> Chaves
INSERT INTO catalogo_implante_chaves (empresa_id, implante_sku, chave_id)
SELECT '6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', id FROM catalogo_chaves WHERE sku = 'CHV-6687-001' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a'
ON CONFLICT DO NOTHING;

INSERT INTO catalogo_implante_chaves (empresa_id, implante_sku, chave_id)
SELECT '6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', id FROM catalogo_chaves WHERE sku = 'CHV-6687-002' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a'
ON CONFLICT DO NOTHING;

INSERT INTO catalogo_implante_chaves (empresa_id, implante_sku, chave_id)
SELECT '6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-002', id FROM catalogo_chaves WHERE sku = 'CHV-6687-003' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a'
ON CONFLICT DO NOTHING;

-- 12. Pivot: Implante <-> Kits
INSERT INTO catalogo_implante_kit (empresa_id, implante_sku, kit_sku) VALUES
  ('6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', 'KIT-6687-001'),
  ('6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', 'KIT-6687-002')
ON CONFLICT DO NOTHING;

-- 13. Pivot: Implante <-> Abutments
INSERT INTO catalogo_implante_abutment (empresa_id, implante_sku, abutment_sku) VALUES
  ('6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', 'ABU-6687-001'),
  ('6687e2f0-1ff6-406d-b621-7927764f121a', 'IMP-IH-6687-001', 'ABU-6687-002')
ON CONFLICT DO NOTHING;

-- 14. Vincular cicatrizadores ao implante
UPDATE catalogo_cicatrizadores
SET implante_id = (SELECT id FROM catalogo_implantes WHERE sku = 'IMP-IH-6687-001' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a')
WHERE sku IN ('CIC-6687-001', 'CIC-6687-002') AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a';

-- 15. Kit <-> Chaves (para listarKitsComChavesEmComum)
INSERT INTO catalogo_kit_chaves (empresa_id, kit_sku, chave_id)
SELECT '6687e2f0-1ff6-406d-b621-7927764f121a', 'KIT-6687-001', id FROM catalogo_chaves WHERE sku = 'CHV-6687-001' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a'
ON CONFLICT DO NOTHING;

INSERT INTO catalogo_kit_chaves (empresa_id, kit_sku, chave_id)
SELECT '6687e2f0-1ff6-406d-b621-7927764f121a', 'KIT-6687-001', id FROM catalogo_chaves WHERE sku = 'CHV-6687-002' AND empresa_id = '6687e2f0-1ff6-406d-b621-7927764f121a'
ON CONFLICT DO NOTHING;
`

async function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    const options = {
      hostname: 'cluuqzhizeqvkgvfdisx.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => resolve({ status: res.statusCode, body }))
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function main() {
  console.log('Executing SQL via Supabase...')
  const result = await execSQL(SQL)
  console.log('Status:', result.status)
  console.log('Body:', result.body)
}

main().catch(console.error)
