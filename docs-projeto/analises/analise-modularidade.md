Agora tenho uma visão completa da arquitetura. Aqui está a análise:
---

Análise de Modularidade do ERP Conexão

1. Os módulos são independentes? NÃO totalmente.
   Existem dependências reais de código entre módulos que impedem exclusão isolada:
   Dependência Tipo Impacto
   core/permissions/constants.ts → cadastros/permissions Import TS core quebra se cadastros for removido
   core/services/webhooks.ts → api-connectors Import TS core quebra se api-connectors for removido
   nps → empresas (buscarEmpresa, config, theme) Import TS nps quebra sem empresas
   documentos → cadastros (FK cadastro_id) DB FK documentos perde dados sem cadastros
2. A única camada de conexão é o banco? Não.
   Existem 3 camadas de acoplamento:
   A) Imports diretos feature→feature (code coupling)

- nps importa tipos e funções de empresas
- core importa de cadastros/permissions e api-connectors
  B) Banco de dados (data coupling)
- Toda tabela de módulo referencia empresas(id) via empresa_id FK CASCADE
- documentos.cadastro_id → cadastros.id
- cadastros.created_by → profiles.id
- Tabelas de domínio (pacientes, leads, contratos) são legado e não usam empresa_id
  C) Barrel re-exports em lib/ (conveniência)
- lib/clientes.ts → re-exporta de features/clientes
- lib/empresas.ts → re-exporta de features/empresas
- Estes são apenas atalhos de import, não acoplamento funcional

3. Mapa de dependências
   empresas ← ← ← (hub, nps, crm, funis, linktree, mapas, cadastros, documentos, credenciais, admin)
   ↑ DB FK empresa_id em TODAS as tabelas
   cadastros ← ← (core/permissions, documentos, revisoes)
   api-connectors ← (core/services/webhooks)
   crm ← (rotas apenas - imports de componentes internos)
   hub ← (rotas apenas - imports de componentes internos)
4. O módulo empresas é o "Shared Kernel"
   Ele é a peça central — não pode ser removido sem quebrar todos os outros módulos. Tudo depende dele para:

- Isolamento de dados (empresa_id)
- Configuração de tema/branding
- Gerenciamento de módulos ativos (tabela modulos_empresa)

5. Módulos verdadeiramente isolados (só dependem de empresas e core)

- funis — auto-contido, só usa empresa_id + auth.users
- hub — auto-contido, só usa empresa_id + auth.users
- mapas — auto-contido
- nps — quase, mas precisa de empresas para theme/config
- linktree — auto-contido
  Resumo
  Pergunta Resposta
  Módulos independentes? Parcialmente — funis, hub, mapas, linktree são os mais isolados
  Única camada é o DB? Não — existem imports TS diretos entre features e violations no core
  O que impede exclusão? core importa cadastros e api-connectors; nps importa empresas
  Para tornar os módulos truly independentes, seria necessário:

1. Mover as permissões de cadastros para core/permissions (ou tornar genérico)
2. Mover executeApiConnector para core/services (ou injetar via callback)
3. Usar DI/event bus em vez de imports diretos de empresas no nps
