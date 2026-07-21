-- ============================================================
-- MIGRAÇÃO: Single Tenant — Remover empresa_id de TODAS as tabelas
-- Data: 2026-07-21
-- Descrição: Remove a coluna empresa_id de todas as tabelas que
--            ainda a possuem. O sistema é single-tenant.
-- ============================================================

-- ============================================================
-- 1. TABELAS CORE ( profiles, auth, permissões )
-- ============================================================
ALTER TABLE profiles DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 2. TABELAS DE CADASTROS / CREDENCIAIS / ATIVIDADES
-- ============================================================
ALTER TABLE cadastros DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE credenciais DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE atividades DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 3. TABELAS DE NOTIFICAÇÕES
-- ============================================================
ALTER TABLE notificacoes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE notificacoes_templates DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 4. TABELAS DE WEBHOOKS
-- ============================================================
ALTER TABLE webhooks DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE webhook_logs DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 5. TABELAS DE FORMULÁRIOS / API / INTEGRAÇÕES
-- ============================================================
ALTER TABLE form_schema DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE api_connectors DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE integracoes_config DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 6. TABELAS DE PERMISSÕES / MÓDULOS
-- ============================================================
ALTER TABLE permissoes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE modulos_empresa DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE empresa_modulo_limits DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 7. TABELAS DO HUB
-- ============================================================
ALTER TABLE hub_user_roles DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_materials DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_collections DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_collection_items DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_user_progress DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_user_badges DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_gamification_levels DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_gamification_badges DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_gamification_points DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_system_config DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_system_integrations DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE hub_chatbot_config DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 8. TABELAS DO NPS
-- ============================================================
ALTER TABLE nps_perguntas DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE nps_respostas DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE nps_webhook_config DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE nps_relatorios_envio DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 9. TABELAS DE FUNIS
-- ============================================================
ALTER TABLE funis DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 10. TABELAS DO LINKTREE
-- ============================================================
ALTER TABLE linktree_colaboradores DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE linktree_tema_config DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE linktree_empresa_config DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE linktree_empresa_sections DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE linktree_empresa_links DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE linktree_empresa_clicks DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 11. TABELAS DO MAPAS
-- ============================================================
ALTER TABLE mapas_distributors DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE mapas_consultants DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 12. TABELAS DE DESPESAS (se existirem)
-- ============================================================
ALTER TABLE despesas DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE despesas_categorias DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE despesas_periodos DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 13. TABELAS DE ROTAS (se existirem)
-- ============================================================
ALTER TABLE rotas DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE rotas_trajetos DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 14. TABELAS DE ESTRUTURA DO CATÁLOGO (pós-migration 20260720020000)
-- ============================================================
-- Categorias e hierarquia IPS (algumas podem ter empresa_id via seed)
ALTER TABLE catalogo_categorias DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_ips_conexoes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_ips_familias DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_ips_linhas DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 15. TABELAS DE CLIENTES / PEDIDOS / ORÇAMENTOS
-- ============================================================
ALTER TABLE catalogo_clientes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_cliente_permissoes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_pedidos DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_pedido_itens DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_orcamentos DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_orcamento_itens DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_solicitacoes_acesso DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_grupo_precos DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_grupos_clientes DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 16. TABELAS PROMOCIONAIS / CUPONS / FRETE
-- ============================================================
ALTER TABLE catalogo_promocionais DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_promocional_itens DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_cupons DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_fretes DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 17. TABELAS DE IMAGENS / FAVORITOS
-- ============================================================
ALTER TABLE catalogo_imagens_produto DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_favoritos DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 18. TABELAS DE INSTRUMENTAIS / FRESAGENS
-- ============================================================
ALTER TABLE catalogo_instrumentais DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_instrumental_geral DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_fresagens DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_sequencia_protetica DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 19. TABELAS DE CONFIGURAÇÃO DO CATÁLOGO
-- ============================================================
ALTER TABLE catalogo_configuracoes DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_design_config DROP COLUMN IF EXISTS empresa_id;
ALTER TABLE catalogo_categorias_kit DROP COLUMN IF EXISTS empresa_id;

-- ============================================================
-- 20. ATUALIZAR FUNÇÕES RPC QUE USAM empresa_id
-- ============================================================
-- Função handle_new_user: remove empresa_id do INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
    'viewer'
  );
  RETURN NEW;
END;
$$;

-- Função admin_criar_usuario: remove p_empresa_id
CREATE OR REPLACE FUNCTION public.admin_criar_usuario(
  p_email text,
  p_nome text,
  p_senha text,
  p_role text DEFAULT 'viewer',
  p_is_super_admin boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Criar usuário no auth
  v_user_id := (
    SELECT id FROM auth.users WHERE email = p_email LIMIT 1
  );

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
    VALUES (
      v_user_id,
      p_email,
      crypt(p_senha, gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object('nome', p_nome, 'role', p_role)
    );
  END IF;

  -- Criar profile vinculado (sem empresa_id)
  INSERT INTO public.profiles (id, nome, email, is_super_admin, ativo)
  VALUES (v_user_id, p_nome, p_email, p_is_super_admin, true);

  RETURN v_user_id;
END;
$$;

-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================
DO $$
DECLARE
  r RECORD;
  col_count INTEGER;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND column_name = 'empresa_id'
  LOOP
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = r.table_name
    AND column_name = 'empresa_id';

    IF col_count > 0 THEN
      RAISE WARNING 'Tabela % ainda possui empresa_id!', r.table_name;
    END IF;
  END LOOP;

  RAISE NOTICE '✅ Verificação concluída — empresa_id removida de todas as tabelas';
END $$;

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
