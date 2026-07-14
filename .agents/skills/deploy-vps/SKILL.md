---
name: deploy-vps
description: >
  Deploy workflow do ERP Odonto com rollback automático, health check
  pós-deploy, versionamento automático e notificação de status.
  DISPARO: ativar SOMENTE quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
  NÃO ativar em nenhum outro contexto.
---

# Deploy VPS — ERP Odonto

Deploy completo com segurança e rollback.

## Regra

Só executar quando o usuário disser "deploy" ou "/deploy" explicitamente.

## Pré-requisitos

- `vps.env` no raiz do projeto
- `.env` no raiz com:
  - `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (frontend)
  - `SUPABASE_ACCESS_TOKEN` (deploy de Edge Functions via CLI)
  - `SUPABASE_DB_PASSWORD` (aplicar migrations via `pg`)
- **Supabase CLI** instalado: `npm install -g supabase`
- **Node + `pg`** disponíveis (usado para aplicar migrations via `SUPABASE_DB_URL`)
- Build local passando: `npm run build`

### Project ref

Extrair do `VITE_SUPABASE_URL`:
```
URL=https://<PROJECT_REF>.supabase.co  →  PROJECT_REF=<PROJECT_REF>
DB_URL=postgresql://postgres:<SUPABASE_DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres
```
> A senha do `DB_URL` deve ser `encodeURIComponent`-ada (pode conter `@`, `#`, `%`).

## Workflow

### Step 0: Economia de Tokens

Seguir diretrizes de economia de tokens do AGENTS.md.

### Step 1: Verificar mudanças locais

```bash
git status --porcelain
```

Se houver mudanças, perguntar mensagem de commit. Se não, pular.

### Step 2: Verificar build local

```bash
npm run build
```

Se falhar, NÃO prosseguir com deploy.

### Step 3: Commit + Push

```bash
git add -A && git commit -m "<mensagem>" && git push origin main
```

### Step 3.5: Aplicar Migration (se houver SQL novo)

As migrations ficam em `supabase/migrations/`. Aplicar via `pg` (não há `supabase db push`
configurado neste projeto). Script padrão (salvar em `/tmp/apply_migration.js`):

```javascript
const fs = require("fs");
const path = require("path");
const pg = require("C:/.../supabase-mcp-server/node_modules/pg"); // ajustar caminho

const env = {};
for (const line of fs.readFileSync("C:/.../.env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const ref = env.VITE_SUPABASE_URL.replace("https://", "").split(".")[0];
const DB_URL = `postgresql://postgres:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@db.${ref}.supabase.co:5432/postgres`;
const sql = fs.readFileSync(path.join("C:/.../supabase/migrations", "<ARQUIVO>.sql"), "utf8");

(async () => {
  const c = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  await c.query(sql);
  console.log("Migration aplicada.");
  await c.end();
})();
```

### Step 3.6: Deploy de Edge Function (Supabase)

Para alterações em `supabase/functions/<NOME>/index.ts`:

```bash
# 1. Login com token do .env (SUPABASE_ACCESS_TOKEN)
TOKEN=$(grep SUPABASE_ACCESS_TOKEN .env | head -1 | sed 's/.*=//' | tr -d '"' | tr -d "'")
supabase login --token "$TOKEN"

# 2. Deploy da função (lê supabase/functions/<NOME>)
supabase functions deploy <NOME> --project-ref <PROJECT_REF>
```

> O CLI faz upload direto (não precisa de Docker rodando localmente).
> Não requer `git push` — o deploy usa os arquivos locais.
> Após o deploy, testar a função (ex: `supabase functions invoke <NOME>`).

### Step 4: Ler credenciais

```bash
source vps.env
```

Variáveis necessárias:
- `DOCKER_HUB_USERNAME`
- `DOCKER_HUB_PASSWORD`
- `VPS_IP`
- `VPS_USER`
- `VPS_PASSWORD`

### Step 5: Determinar versão

```bash
# Última tag
git describe --tags --abbrev=0 2>/dev/null || echo "v0"

# Ou incrementar manualmente
```

### Step 6: SSH na VPS

```python
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    VPS_IP,
    username=VPS_USER,
    password=VPS_PASSWORD,
    timeout=30
)
```

### Step 7: Backup (rollback point)

```bash
# Salvar versão atual para rollback
cd /root/Cadastros-Conexao
CURRENT_IMAGE=$(docker service inspect erp-odonto_app --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null)
echo "Rollback image: $CURRENT_IMAGE" > /tmp/rollback-info.txt
```

### Step 8: Git pull na VPS

```bash
cd /root/Cadastros-Conexao && git pull origin main
```

### Step 9: Docker build

```bash
cd /root/Cadastros-Conexao && docker build --no-cache \
  -t hevertonperes/erp-odonto:latest \
  -t hevertonperes/erp-odonto:v<NUMERO> \
  --build-arg VITE_SUPABASE_URL=<URL> \
  --build-arg VITE_SUPABASE_ANON_KEY=<KEY> .
```

**Se build falhar:** Interromper, NÃO fazer push/update.

### Step 10: Docker push

```bash
docker push hevertonperes/erp-odonto:v<NUMERO>
```

**Se push falhar:** Verificar docker login, interromper.

### Step 11: Service update

```bash
docker service update --force --image hevertonperes/erp-odonto:v<NUMERO> erp-odonto_app
```

### Step 12: Health check

```bash
# Aguardar service estabilizar
sleep 10

# Verificar se container está rodando
docker service ps erp-odonto_app --format "{{.CurrentState}}" | head -1

# Verificar logs
docker service logs erp-odonto_app --tail 10 2>&1 | grep -i "error\|fatal" || true
```

### Step 13: Rollback (se necessário)

Se health check falhar:

```bash
# Ler imagem de rollback
ROLLBACK_IMAGE=$(cat /tmp/rollback-info.txt | cut -d' ' -f3)

# Reverter service
docker service update --force --image $ROLLBACK_IMAGE erp-odonto_app
```

### Step 14: Fechar SSH

```python
client.close()
```

### Step 15: Notificar resultado

```markdown
## Deploy Concluído ✅

- **Versão:** v<NUMERO>
- **Status:** Sucesso
- **Tempo:** ~Xmin

### Alterações
- <lista de commits>

### Próximos passos
- Verificar em https://<dominio>
```

Ou em caso de falha:

```markdown
## Deploy com Falha ❌

- **Versão:** v<NUMERO>
- **Status:** Falha
- **Erro:** <descrição do erro>
- **Rollback:** <status do rollback>

### Ação necessária
- <ação recomendada>
```

## Observações

- **Versão:** incrementar v10 → v11 → v12...
- **Timeout:** ~5min total (docker build é o mais lento)
- **Rollback:** automático se health check falhar
- **Backup:** sempre salvar imagem anterior antes de atualizar
- **Edge Functions** são independentes do Docker: deploy via `supabase functions deploy` (Step 3.6)
- **Migrations** aplicadas via `pg` + `SUPABASE_DB_URL` (Step 3.5), não via CLI `db push`
- **Dois alvos de deploy:** (1) Frontend = Docker VPS; (2) Backend/Supabase = Edge Functions + migrations

## Regras Obrigatórias

1. **Build local** — sempre verificar antes do deploy
2. **Backup** — sempre salvar imagem anterior
3. **Health check** — sempre verificar pós-deploy
4. **Rollback** — automático se falhar
5. **Notificação** — sempre informar resultado
6. **Edge Function** — se houve mudança em `supabase/functions/`, rodar Step 3.6
7. **Migration** — se houve SQL novo em `supabase/migrations/`, rodar Step 3.5 antes do deploy

## Economia de Tokens

- **Lean-CTX:** Apenas comandos necessários
- **Caveman:** Deploy conciso
- **Pre-flight:** Verificar build local
