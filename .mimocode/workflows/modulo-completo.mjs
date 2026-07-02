export const meta = {
  name: "modulo-completo",
  description: "Workflow completo para módulo: Documentação → Design → Responsividade. Executa as 3 skills em sequência usando subagentes.",
};

export default async function moduloCompleto(args, ctx) {
  const { modulo } = args;

  if (!modulo) {
    return {
      status: "failed",
      error: "Argumento 'modulo' é obrigatório. Uso: workflow modulo-completo { modulo: 'cadastros' }",
    };
  }

  ctx.log(`🚀 Iniciando workflow completo para módulo: ${modulo}`);
  ctx.log(`📋 Sequência: Documentação → Design → Responsividade`);

  const results = {
    modulo,
    phases: [],
    startTime: Date.now(),
  };

  // ═══════════════════════════════════════════════════════════════
  // FASE 1: DOCUMENTAÇÃO
  // ═══════════════════════════════════════════════════════════════
  ctx.phase("📄 Fase 1/3 — Documentação do Módulo");
  ctx.log("Executando skill documentar-modulo...");

  const docResult = await agent(
    `Você é um subagente especializado em documentação de módulos ERP.

Execute a skill "documentar-modulo" para o módulo: ${modulo}

INSTRUÇÕES:
1. Leia o arquivo .agents/skills/documentar-modulo/SKILL.md para entender o workflow completo
2. Execute TODOS os passos descritos na skill (Passo 1 ao Passo 9)
3. Gere o documento completo em docs-projeto/doc-modulos/mod-${modulo}/${modulo}.md
4. Retorne um resumo com:
   - Caminho do arquivo gerado
   - Estatísticas (nº de rotas, permissões, componentes, hooks, services)
   - Status: success ou failed

REGRAS:
- NUNCA inventar informações — tudo vem do código-fonte
- Se um arquivo não existe, não listing na árvore
- Usar ✅ para true e ❌ para false nas tabelas de defaults`,
    { description: `Documentação do módulo ${modulo}` }
  );

  results.phases.push({
    phase: "documentacao",
    status: docResult ? "success" : "failed",
    result: docResult,
  });

  if (!docResult) {
    ctx.log("⚠️ Documentação falhou, mas continuando com as próximas fases...");
  }

  // ═══════════════════════════════════════════════════════════════
  // FASE 2: DESIGN FRONTEND
  // ═══════════════════════════════════════════════════════════════
  ctx.phase("🎨 Fase 2/3 — Design Frontend");
  ctx.log("Executando skill design-frontend...");

  const designResult = await agent(
    `Você é um subagente especializado em design frontend para o ERP Conexão.

Execute a skill "design-frontend" para o módulo: ${modulo}

INSTRUÇÕES:
1. Leia o arquivo .agents/skills/design-frontend/SKILL.md para entender o workflow completo
2. Primeiro, liste as rotas do módulo em src/features/${modulo}/module.ts
3. Para CADA rota encontrada, execute o fluxo da skill (Passo 1 ao Passo 8)
4. Aplique as substituições de classes conforme o Mapa de Substituição de Classes
5. Retorne um resumo com:
   - Rotas processadas
   - Número de substituições realizadas
   - Status: success ou failed

REGRAS INEGOCIÁVEIS:
- NUNCA alterar lógica de negócio — apenas classes CSS/Tailwind
- NUNCA criar novos elementos JSX — apenas reaplicar classes nos existentes
- NUNCA remover elementos existentes
- NUNCA alterar nomes de funções ou variáveis
- TODA refatoração DEVE seguir mobile-first
- O ÚNICO ALTERADO É O className`,
    { description: `Design frontend do módulo ${modulo}` }
  );

  results.phases.push({
    phase: "design",
    status: designResult ? "success" : "failed",
    result: designResult,
  });

  if (!designResult) {
    ctx.log("⚠️ Design falhou, mas continuando com a próxima fase...");
  }

  // ═══════════════════════════════════════════════════════════════
  // FASE 3: RESPONSIVIDADE
  // ═══════════════════════════════════════════════════════════════
  ctx.phase("📱 Fase 3/3 — Análise e Correção de Responsividade");
  ctx.log("Executando skill responsividade...");

  const respResult = await agent(
    `Você é um subagente especializado em responsividade para o ERP Conexão.

Execute a skill "responsividade" para o módulo: ${modulo}

INSTRUÇÕES:
1. Leia o arquivo .agents/skills/responsividade/SKILL.md para entender o workflow completo
2. Execute a Fase A (Análise) completa — Passos 1 ao 5
3. Gere o documento de análise em docs-projeto/doc-responsividade/resp-${modulo}/cadastros.md
4. Execute a Fase B (Implementação) — Passos 7 ao 9
5. Aplique todas as correções identificadas
6. Valide TypeScript após cada edição
7. Retorne um resumo com:
   - Documento gerado
   - Número de correções aplicadas
   - Status da validação
   - Status: success ou failed

REGRAS ABSOLUTAS:
- NUNCA alterar lógica de negócio — apenas classes CSS/Tailwind
- NUNCA remover elementos JSX — apenas reaplicar classes
- NUNCA alterar nomes de funções ou variáveis
- Validar TypeScript após cada edição
- Confirmar que apenas classes foram alteradas`,
    { description: `Responsividade do módulo ${modulo}` }
  );

  results.phases.push({
    phase: "responsividade",
    status: respResult ? "success" : "failed",
    result: respResult,
  });

  // ═══════════════════════════════════════════════════════════════
  // RELATÓRIO FINAL
  // ═══════════════════════════════════════════════════════════════
  const totalTime = ((Date.now() - results.startTime) / 1000).toFixed(1);
  const successCount = results.phases.filter((p) => p.status === "success").length;

  ctx.phase("📊 Relatório Final");

  const report = `
# Workflow Modulo Completo — ${modulo}

## Resultado

| Fase | Status |
|------|--------|
| 📄 Documentação | ${results.phases[0]?.status === "success" ? "✅ Concluído" : "❌ Falhou"} |
| 🎨 Design Frontend | ${results.phases[1]?.status === "success" ? "✅ Concluído" : "❌ Falhou"} |
| 📱 Responsividade | ${results.phases[2]?.status === "success" ? "✅ Concluído" : "❌ Falhou"} |

**Total:** ${successCount}/3 fases concluídas
**Tempo total:** ${totalTime}s

## Arquivos Gerados

- Documentação: \`docs-projeto/doc-modulos/mod-${modulo}/${modulo}.md\`
- Análise de Responsividade: \`docs-projeto/doc-responsividade/resp-${modulo}/cadastros.md\`

## Detalhes

### Documentação
${docResult || "Falha na execução"}

### Design Frontend
${designResult || "Falha na execução"}

### Responsividade
${respResult || "Falha na execução"}
`;

  ctx.log(report);

  return {
    status: successCount === 3 ? "success" : successCount > 0 ? "partial" : "failed",
    modulo,
    phases: results.phases,
    totalTime: `${totalTime}s`,
    report,
  };
}
