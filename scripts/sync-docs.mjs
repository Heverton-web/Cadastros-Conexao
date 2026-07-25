#!/usr/bin/env node
/**
 * sync-docs.mjs — Sincroniza AGENTS.md, CLAUDE.md, GEMINI.md com o estado atual do projeto.
 *
 * Uso:
 *   node scripts/sync-docs.mjs          # gera os 3 arquivos
 *   node scripts/sync-docs.mjs --check  # verifica se estão sincronizados (exit 1 = desatualizado)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "fs"
import { join, basename } from "path"

const ROOT = process.cwd()
const CHECK_MODE = process.argv.includes("--check")

// ─── Coleta de dados do projeto ───────────────────────────────────────────────

function getSkills() {
  const skillsDir = join(ROOT, ".agents", "skills")
  if (!existsSync(skillsDir)) return []

  const skills = []
  for (const name of readdirSync(skillsDir)) {
    const skillFile = join(skillsDir, name, "SKILL.md")
    if (!existsSync(skillFile)) continue

    const content = readFileSync(skillFile, "utf-8")
    const frontmatter = parseFrontmatter(content)

    // Extrair triggers do frontmatter ou do corpo
    let triggers = []
    if (frontmatter.triggers) {
      triggers = Array.isArray(frontmatter.triggers) ? frontmatter.triggers : [frontmatter.triggers]
    }
    if (frontmatter.trigger) {
      triggers = Array.isArray(frontmatter.trigger) ? frontmatter.trigger : [frontmatter.trigger]
    }

    // Se não tem trigger no frontmatter, tentar extrair do corpo
    if (triggers.length === 0) {
      const triggerMatch = content.match(/## Trigger\s*\n([\s\S]*?)(?=\n##|\n---|\n#|$)/i)
      if (triggerMatch) {
        const lines = triggerMatch[1].split("\n").filter(l => l.trim().startsWith("-"))
        triggers = lines.map(l => l.replace(/^-\s*/, "").replace(/[""]/g, "").trim()).slice(0, 3)
      }
    }

    // Fallback: extrair triggers do campo description (algumas skills colocam triggers lá)
    if (triggers.length === 0 && frontmatter.description) {
      const desc = frontmatter.description
      // Procurar padrão "Trigger: X, Y, Z" no final da description
      const triggerInDesc = desc.match(/(?:Trigger|trigger|DISPARO|disparo):\s*(.+?)$/i)
      if (triggerInDesc) {
        triggers = triggerInDesc[1].split(",").map(t => t.trim().replace(/[""]/g, "")).filter(Boolean)
      }
    }

    skills.push({
      name: frontmatter.name || name,
      description: frontmatter.description || "",
      triggers: triggers.map(t => t.replace(/[""]/g, "").trim()),
    })
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const fm = {}
  const lines = match[1].split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/)

    if (kvMatch) {
      const key = kvMatch[1]
      let value = kvMatch[2].trim()

      if (value === ">" || value === "|" || value === ">-" || value === "|-") {
        // YAML folded/literal scalar — collect indented continuation lines
        const indicator = value
        const fold = indicator.startsWith(">")
        const lines_arr = []
        i++
        while (i < lines.length && (lines[i].startsWith("  ") || lines[i].startsWith("\t") || lines[i].trim() === "")) {
          if (lines[i].trim() !== "") {
            lines_arr.push(lines[i].trim())
          }
          i++
        }
        // Join: folded replaces newlines with spaces, literal preserves them
        fm[key] = fold ? lines_arr.join(" ").replace(/["']/g, "") : lines_arr.join("\n").replace(/["']/g, "")
        continue
      } else if (value === "") {
        // Could be array or block — peek next line
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith("-")) {
          // Array
          fm[key] = []
          i++
          while (i < lines.length && lines[i].trim().startsWith("-")) {
            fm[key].push(lines[i].trim().replace(/^-\s*/, "").replace(/^["']|["']$/g, ""))
            i++
          }
          continue
        } else {
          fm[key] = ""
          i++
          continue
        }
      } else if (value.startsWith("[")) {
        try { fm[key] = JSON.parse(value) } catch { fm[key] = [value] }
      } else {
        fm[key] = value.replace(/^["']|["']$/g, "")
      }
    }
    i++
  }

  return fm
}

function getModules() {
  const featuresDir = join(ROOT, "src", "features")
  if (!existsSync(featuresDir)) return []
  return readdirSync(featuresDir).filter(f => {
    const stat = statSync(join(featuresDir, f))
    return stat.isDirectory()
  }).sort()
}

function getRoutes() {
  const routesDir = join(ROOT, "src", "routes")
  if (!existsSync(routesDir)) return []
  return readdirSync(routesDir).filter(f => f.endsWith(".tsx") || f.endsWith(".ts"))
}

function getCommands() {
  const pkgPath = join(ROOT, "package.json")
  if (!existsSync(pkgPath)) return {}
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  return pkg.scripts || {}
}

function getExistingRTK() {
  const agentsPath = join(ROOT, "AGENTS.md")
  if (!existsSync(agentsPath)) return ""

  const content = readFileSync(agentsPath, "utf-8")
  const rtkMatch = content.match(/## RTK SCRATCHPAD\n([\s\S]*?)$/)
  return rtkMatch ? rtkMatch[1].trim() : ""
}

// ─── Categorização de skills ─────────────────────────────────────────────────

function categorizeSkills(skills) {
  const categories = {
    token: { label: "Economia de Tokens", skills: [] },
    modulo: { label: "Módulo (criar/estilizar/validar)", skills: [] },
    crud: { label: "CRUD e UI", skills: [] },
    deploy: { label: "Deploy e Operação", skills: [] },
    knowledge: { label: "Conhecimento e Referência", skills: [] },
  }

  const tokenNames = ["caveman", "headroom", "lean-ctx", "pre-flight-check", "rtk-memory"]
  const moduloNames = ["criar-modulo", "criar-rota", "criar-migration", "criar-componente-modulo", "criar-form-multitipo", "criar-design-modulo", "aplicar-design-modulo", "design-frontend", "gerenciar-nav-items", "validar-modulo", "documentar-modulo"]
  const crudNames = ["gerar-crud", "gerar-formulario", "gerar-modal", "gerar-pagina", "adicionar-permissao", "responsividade"]
  const deployNames = ["deploy-vps", "calcular-gastos-sessao", "implementar-plan", "master-skill"]

  for (const skill of skills) {
    const id = skill.name.toLowerCase().replace(/\s+/g, "-")
    if (tokenNames.includes(id)) categories.token.skills.push(skill)
    else if (moduloNames.includes(id)) categories.modulo.skills.push(skill)
    else if (crudNames.includes(id)) categories.crud.skills.push(skill)
    else if (deployNames.includes(id)) categories.deploy.skills.push(skill)
    else categories.knowledge.skills.push(skill)
  }

  return categories
}

// ─── Geração de conteúdo ──────────────────────────────────────────────────────

function generateContent(title, skills, modules, routes, commands, rtkSection) {
  const categories = categorizeSkills(skills)

  let skillsTable = ""
  for (const [, cat] of Object.entries(categories)) {
    if (cat.skills.length === 0) continue
    skillsTable += `\n### ${cat.label}\n`
    skillsTable += `| Skill | Trigger |\n|---|---|\n`
    for (const s of cat.skills) {
      const trigger = s.triggers.length > 0 ? s.triggers[0] : s.description.slice(0, 60)
      skillsTable += `| \`${s.name}\` | ${escapeMarkdown(trigger)} |\n`
    }
  }

  const commandsList = Object.entries(commands)
    .filter(([k]) => !k.startsWith("preinstall") && !k.startsWith("postinstall"))
    .map(([k, v]) => {
      const desc = describeCommand(k)
      return `${k}${desc ? "  # " + desc : ""}`
    })
    .join("\n")

  const content = `# ${title} — ERP Odonto

**Idioma:** PT-BR. **Sem greetings.** Direto ao ponto.

## Fable Family

- Tarefa multi-step não trivial → aplicar \`fable-method\`.
- Tarefa unattended / subagents em paralelo → \`fable-loop\`.
- Trabalho concluído → \`fable-judge\` antes de declarar pronto.

## Estrutura

\`\`\`
proj_erp/
├── src/
│   ├── features/       # Módulos de negócio (${modules.length} módulos)
│   ├── shared/         # Dados compartilhados (empresas, form-schema)
│   ├── core/           # Infra: auth, permissions, services, store, theme
│   ├── components/     # UI genérica (ui/, shared/, layout/, guards/)
│   ├── design-system/  # Tokens, presets, hooks, provider
│   ├── registry/       # Registro de módulos, nav items, permissões
│   ├── routes/         # ~${routes.length} rotas (TanStack Router file-based)
│   ├── lib/            # Utilitários genéricos (format, utils)
│   └── hooks/          # Hooks compartilhados
├── supabase/           # Migrations SQL
├── supabase-mcp-server/# MCP server (Supabase)
├── docs-projeto/       # Documentação (docs-design-system/, specs/, etc.)
└── .agents/skills/     # ${skills.length} skills de automação
\`\`\`

**Config unificada:** \`.claude/\` contém symlinks (\`.lnk\`) para \`.agents/\` — skills, hooks, commands, rules, specs, workflows. Editar em \`.agents/\`, symlink atualiza automaticamente.

## Comandos

\`\`\`bash
${commandsList.split("\n").map(l => l.trim()).filter(Boolean).join("\n")}
\`\`\`

## Arquitetura

- **Single-tenant:** \`empresa_id\` removido de ~71 tabelas (migration \`20260721000000\`). RLS aberta (\`USING true\`). Não injetar \`empresa_id\` em código novo. Exceção: \`agentes_usage_log\`.
- **Módulos:** self-contained em \`src/features/<modulo>/\`. Única conexão = banco.
- **Imports:** módulo só importa de \`shared/\`, \`lib/\`, \`components/ui/\`, \`core/\`. Nunca de outro módulo.
- **Eventos:** todo módulo DEVE ter \`events[]\` no \`module.ts\` (min 2) + \`dispararEventoModulo(moduloKey, eventoKey, payload)\` — 3 args, fire-and-forget com \`.catch(() => {})\`.
- **Permissões:** rota → \`RequirePermission\` ou \`RequireSuperAdmin\`. Botões → \`permissoes?.chave\`.
- **Detalhes:** ver \`ARCHITECTURE.md\`.

## Regras de UI

- **PROIBIDO** \`window.confirm()\`, \`window.alert()\`, \`window.prompt()\`
- **OBRIGATÓRIO** \`AlertDialog\` (exclusões) ou \`Dialog\` (conteúdo) de \`~/components/ui/\`
- Dialog scroll: \`DialogContent flex flex-col max-h-[85vh] overflow-hidden\` + body \`overflow-y-auto flex-1 min-h-0\`
- Design system: \`src/design-system/\` (tokens, presets, hooks). Docs em \`docs-projeto/docs-design-system/\`

## Skills
${skillsTable}

## Economia de Tokens

\`\`\`
1. lean-ctx    → grep antes de read, assinaturas antes de corpos
2. headroom    → comprimir logs > 7 linhas
3. caveman     → respostas telegráficas, só diffs cirúrgicos
4. rtk-memory  → registrar erro/padrão no RTK SCRATCHPAD
5. pre-flight  → types → testes → build ANTES de commit/deploy
\`\`\`

**O que NÃO fazer:** ler arquivo "só pra ver"; ler >3 arquivos grandes sem consolidar; read de diretório grande (usar glob/grep); declarar tarefa concluída sem pre-flight; re-analisar erro registrado no RTK SCRATCHPAD; gerar explicações longas sem pedido.

## Deploy

Só quando usuário disser "deploy" ou "/deploy". Usar skill \`deploy-vps\`. Build DEVE passar antes do push.

## Gastos

Exibir \`[💰 Ação: R$ X | Sessão: R$ Y]\` ao final de cada ação. Detalhes: \`calcular-gastos-sessao\`.

## RTK SCRATCHPAD

${rtkSection}
`

  return content
}

function describeCommand(cmd) {
  const descriptions = {
    dev: "dev server",
    build: "build produção (RODAR APÓS QUALQUER ALTERAÇÃO)",
    preview: "preview produção",
    format: "Prettier",
    lint: "ESLint",
    test: "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest com coverage",
    storybook: "Storybook dev",
    "build-storybook": "Storybook build",
    "test:safe": "testes com headroom filter",
    "deploy:safe": "deploy com headroom filter",
    "check:types": "type-check (tsc --noEmit)",
    "check:guards": "verificar guards de rota",
    "validate:all": "types + testes",
  }
  return descriptions[cmd] || ""
}

function escapeMarkdown(str) {
  return str.replace(/\|/g, "\\|").replace(/\n/g, " ")
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const skills = getSkills()
  const modules = getModules()
  const routes = getRoutes()
  const commands = getCommands()
  const rtkContent = getExistingRTK()

  // Monta seção RTK preservada
  let rtkSection = ""
  if (rtkContent) {
    rtkSection = rtkContent
  } else {
    rtkSection = `> Erros resolvidos e padrões descobertos. Gerenciado por \`rtk-memory\`. Não re-analisar o que já está aqui.

### Padrões consolidados
- **Single-tenant:** não injetar \`empresa_id\`. Migration \`20260721000000\` removeu de ~71 tabelas. Checar \`grep\` na migration antes de confiar que uma tabela foi coberta.
- **dispararEventoModulo:** 3 args \`(moduloKey, eventoKey, payload)\`. Nunca passar 4º arg. Sempre \`.catch(() => {})\`, nunca \`await\`.
- **State em handlers:** usar nome explícito do state (ex: \`tipoAtivo\`), nunca variável genérica sem prefixo.
- **Cross-feature imports:** proibidos. Mover lógica compartilhada para \`shared/\` ou \`lib/utils/\`.
- **Vite não type-checka por padrão:** rodar \`npm run check:types\` além do build ao mexer com tipagem dinâmica de Supabase.`
  }

  const files = [
    { path: join(ROOT, "AGENTS.md"), title: "AGENTS.md" },
    { path: join(ROOT, "CLAUDE.md"), title: "CLAUDE.md" },
    { path: join(ROOT, "GEMINI.md"), title: "GEMINI.md" },
    { path: join(ROOT, ".gemini", "GEMINI.md"), title: "GEMINI.md" },
  ]

  const generated = generateContent("AGENTS.md", skills, modules, routes, commands, rtkSection)

  if (CHECK_MODE) {
    let outOfSync = false
    for (const file of files) {
      if (!existsSync(file.path)) {
        console.log(`OUTDATED: ${file.path} does not exist`)
        outOfSync = true
        continue
      }
      const existing = readFileSync(file.path, "utf-8")
      // Normaliza o título para comparação
      const normalized = existing.replace(/^# (AGENTS|CLAUDE|GEMINI)\.md/m, "# AGENTS.md")
      const normalizedGenerated = generated
      if (normalized.trim() !== normalizedGenerated.trim()) {
        console.log(`OUTDATED: ${file.path}`)
        outOfSync = true
      } else {
        console.log(`OK: ${file.path}`)
      }
    }
    process.exit(outOfSync ? 1 : 0)
  }

  // Gera arquivos
  for (const file of files) {
    const content = generated.replace(/^# AGENTS\.md/m, `# ${file.title}`)
    writeFileSync(file.path, content, "utf-8")
    console.log(`✓ ${file.path}`)
  }

  console.log(`\nSynced: ${skills.length} skills, ${modules.length} modules, ${routes.length} routes`)
}

main()
