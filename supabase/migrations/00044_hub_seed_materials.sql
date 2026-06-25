-- ============================================================
-- Migration 00044: Seed de Materiais e Trilhas
-- ============================================================

DO $$
DECLARE
  v_empresa UUID;
  v_user UUID;
  v_mat_id UUID;
  v_trilha_id UUID;
BEGIN
  SELECT id INTO v_empresa FROM empresas LIMIT 1;
  SELECT id INTO v_user FROM auth.users LIMIT 1;

  IF v_empresa IS NULL OR v_user IS NULL THEN
    RAISE NOTICE 'Empresa ou Usuário não encontrado, pulando seed';
    RETURN;
  END IF;

  -- ═══════════════════════════════════════════
  -- CLIENTES (6 materiais)
  -- ═══════════════════════════════════════════

  INSERT INTO hub_materials (title, type, tags, category, points, allowed_roles, active, empresa_id, created_by) VALUES
    ('{"pt-br":"Guia de Cuidados com Implantes","en-us":"Implant Care Guide","es-es":"Guía de Cuidados con Implantes"}', 'pdf', '["implante","cuidados","saude"]', 'odontologia', 15, '{client}', true, v_empresa, v_user),
    ('{"pt-br":"Tutorial de Higiene Bucal","en-us":"Oral Hygiene Tutorial","es-es":"Tutorial de Higiene Bucal"}', 'video', '["higiene","tutorial","prevencao"]', 'odontologia', 20, '{client}', true, v_empresa, v_user),
    ('{"pt-br":"Como Escolher seu Protetor Bucal","en-us":"How to Choose Your Mouthguard","es-es":"Cómo Elegir tu Protector Bucal"}', 'pdf', '["protetor","escolha","dicas"]', 'odontologia', 10, '{client}', true, v_empresa, v_user),
    ('{"pt-br":"Apresentação da Clínica","en-us":"Clinic Presentation","es-es":"Presentación de la Clínica"}', 'video', '["apresentacao","clinica","institucional"]', 'institucional', 5, '{client}', true, v_empresa, v_user),
    ('{"pt-br":"Depoimentos de Pacientes","en-us":"Patient Testimonials","es-es":"Testimonios de Pacientes"}', 'video', '["depoimento","paciente","confianca"]', 'marketing', 10, '{client}', true, v_empresa, v_user),
    ('{"pt-br":"Perguntas Frequentes sobre Implantes","en-us":"FAQ about Implants","es-es":"Preguntas Frecuentes sobre Implantes"}', 'html', '["faq","implante","duvidas"]', 'odontologia', 10, '{client}', true, v_empresa, v_user);

  -- ═══════════════════════════════════════════
  -- CONSULTORES (7 materiais)
  -- ═══════════════════════════════════════════

  INSERT INTO hub_materials (title, type, tags, category, points, allowed_roles, active, empresa_id, created_by) VALUES
    ('{"pt-br":"Manual do Consultor Técnico","en-us":"Technical Consultant Manual","es-es":"Manual del Consultor Técnico"}', 'pdf', '["consultor","manual","tecnico"]', 'gestao', 50, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Técnicas de Vendas Consultivas","en-us":"Consultative Sales Techniques","es-es":"Técnicas de Ventas Consultivas"}', 'video', '["vendas","consultivo","tecnica"]', 'vendas', 30, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Apresentação Comercial Padrão","en-us":"Standard Sales Presentation","es-es":"Presentación Comercial Estándar"}', 'pdf', '["apresentacao","comercial","vendas"]', 'vendas', 25, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Catálogo de Produtos 2024","en-us":"2024 Product Catalog","es-es":"Catálogo de Productos 2024"}', 'pdf', '["catalogo","produtos","2024"]', 'odontologia', 20, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Gestão de Relacionamento com Cliente","en-us":"Customer Relationship Management","es-es":"Gestión de Relación con el Cliente"}', 'video', '["crm","relacionamento","gestao"]', 'gestao', 35, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Planilha de Metas e Comissões","en-us":"Goals and Commissions Spreadsheet","es-es":"Hoja de Metas y Comisiones"}', 'pdf', '["metas","comissoes","planilha"]', 'gestao', 15, '{consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Treinamento de Novos Consultores","en-us":"New Consultant Training","es-es":"Capacitación de Nuevos Consultores"}', 'video', '["treinamento","novo","onboarding"]', 'treinamento', 40, '{consultant}', true, v_empresa, v_user);

  -- ═══════════════════════════════════════════
  -- DISTRIBUIDORES (6 materiais)
  -- ═══════════════════════════════════════════

  INSERT INTO hub_materials (title, type, tags, category, points, allowed_roles, active, empresa_id, created_by) VALUES
    ('{"pt-br":"Manual do Distribuidor","en-us":"Distributor Manual","es-es":"Manual del Distribuidor"}', 'pdf', '["distribuidor","manual","operacoes"]', 'gestao', 40, '{distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Estratégias de Marketing para Parceiros","en-us":"Partner Marketing Strategies","es-es":"Estrategias de Marketing para Socios"}', 'video', '["marketing","parceiro","estrategia"]', 'marketing', 30, '{distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Kit de Materiais para Revenda","en-us":"Resale Material Kit","es-es":"Kit de Materiales para Reventa"}', 'pdf', '["kit","revenda","materiais"]', 'marketing', 20, '{distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Política de Preços e Condições Comerciais","en-us":"Pricing and Commercial Terms","es-es":"Política de Precios y Condiciones Comerciales"}', 'pdf', '["preco","comercial","politica"]', 'comercial', 15, '{distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Treinamento de Produto - Linha Premium","en-us":"Product Training - Premium Line","es-es":"Capacitación de Producto - Línea Premium"}', 'video', '["treinamento","premium","produto"]', 'treinamento', 35, '{distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Dashboard de Vendas do Parceiro","en-us":"Partner Sales Dashboard","es-es":"Panel de Ventas del Socio"}', 'html', '["dashboard","vendas","analytics"]', 'gestao', 25, '{distributor}', true, v_empresa, v_user);

  -- ═══════════════════════════════════════════
  -- GESTORES (6 materiais)
  -- ═══════════════════════════════════════════

  INSERT INTO hub_materials (title, type, tags, category, points, allowed_roles, active, empresa_id, created_by) VALUES
    ('{"pt-br":"Gestão de Clínica Completa","en-us":"Complete Clinic Management","es-es":"Gestión de Clínica Completa"}', 'video', '["gestao","clinica","completo"]', 'gestao', 60, '{manager}', true, v_empresa, v_user),
    ('{"pt-br":"KPIs e Métricas para Odontologia","en-us":"KPIs and Metrics for Dentistry","es-es":"KPIs y Métricas para Odontología"}', 'pdf', '["kpi","metrica","analytics"]', 'gestao', 45, '{manager}', true, v_empresa, v_user),
    ('{"pt-br":"Liderança e Gestão de Equipe","en-us":"Leadership and Team Management","es-es":"Liderazgo y Gestión de Equipo"}', 'video', '["lideranca","equipe","gestao"]', 'gestao', 50, '{manager}', true, v_empresa, v_user),
    ('{"pt-br":"Financeiro da Clínica - Controle Completo","en-us":"Clinic Financial - Full Control","es-es":"Financiero de la Clínica - Control Total"}', 'pdf', '["financeiro","controle","orcamento"]', 'gestao', 40, '{manager}', true, v_empresa, v_user),
    ('{"pt-br":"Marketing Digital para Clínicas","en-us":"Digital Marketing for Clinics","es-es":"Marketing Digital para Clínicas"}', 'video', '["marketing","digital","clinica"]', 'marketing', 35, '{manager}', true, v_empresa, v_user),
    ('{"pt-br":"Compliance e Regulamentação Odontológica","en-us":"Dental Compliance and Regulation","es-es":"Cumplimiento y Regulación Odontológica"}', 'pdf', '["compliance","regulamentacao","legal"]', 'juridico', 30, '{manager}', true, v_empresa, v_user);

  -- ═══════════════════════════════════════════
  -- TRILHAS (3 trilhas)
  -- ═══════════════════════════════════════════

  INSERT INTO hub_collections (title, description, points, allowed_roles, active, empresa_id, created_by)
  VALUES
    ('{"pt-br":"Trilha Bem-Vindo ao Hub","en-us":"Welcome to Hub Trail","es-es":"Bienvenido al Hub Trail"}',
     '{"pt-br":"Primeiros passos no Conexão Hub","en-us":"First steps in Conexão Hub","es-es":"Primeros pasos en Conexão Hub"}',
     100, '{client,distributor,consultant}', true, v_empresa, v_user),
    ('{"pt-br":"Trilha Vendas e Comercial","en-us":"Sales and Commercial Trail","es-es":"Ventas y Comercial Trail"}',
     '{"pt-br":"Aprenda técnicas de vendas e relacionamento","en-us":"Learn sales and relationship techniques","es-es":"Aprende técnicas de ventas y relación"}',
     200, '{consultant,distributor}', true, v_empresa, v_user),
    ('{"pt-br":"Trilha Gestão e Liderança","en-us":"Management and Leadership Trail","es-es":"Gestión y Liderazgo Trail"}',
     '{"pt-br":"Gestão completa de clínica e equipe","en-us":"Complete clinic and team management","es-es":"Gestión completa de clínica y equipo"}',
     300, '{manager}', true, v_empresa, v_user);

  RAISE NOTICE 'Seed concluído: 25 materiais + 3 trilhas';
END $$;
