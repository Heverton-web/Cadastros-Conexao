# Análise de Deploy e DevOps — ERP Conexão

> **Documento gerado em:** 04/07/2026 | **Stack:** Docker + Nginx + VPS + Traefik

---

## 1. Visão Geral

O deploy do ERP Conexão é feito em **VPS** via **Docker + Docker Hub + Portainer**, com **Traefik** como reverse proxy e **Let's Encrypt** para SSL.

---

## 2. Stack de Deploy

| Componente | Tecnologia |
|---|---|
| Container | Docker + Docker Hub |
| Imagem | `hevertonperes/cadastros-conexao` |
| Servidor | VPS 167.86.69.79 |
| Orquestração | Portainer / Swarm |
| Reverse Proxy | Traefik |
| SSL | Let's Encrypt (automatizado) |
| Domínio | `cadastros.vpsconexao.org` |

---

## 3. Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Multi-stage build:**
- Stage 1: Node 20 Alpine — build do Vite
- Stage 2: Nginx Alpine — serve arquivos estáticos

---

## 4. docker-compose.yml

```yaml
services:
  app:
    image: hevertonperes/cadastros-conexao:v8
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    networks:
      - network_conexao
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cadastros_conexao.rule=Host(`cadastros.vpsconexao.org`)"
      - "traefik.http.routers.cadastros_conexao.entrypoints=websecure"
      - "traefik.http.routers.cadastros_conexao.tls.certresolver=letsencryptresolver"
```

---

## 5. Nginx Config

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;  # SPA routing
    }
    location /icons/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

```

---

## 6. CI/CD

### GitHub Actions — CI (`ci.yml`)

```yaml
on: [push, pull_request] → main, develop
jobs:
  test:
    steps:
      - npm ci
      - npm run lint
      - npm run build
      - npm test
```

### GitHub Actions — Deploy (`deploy.yml`)

```yaml
on: push → main (após CI passar)
jobs:
  deploy:
    steps:
      - npm ci
      - npm run build
      - SSH into VPS
      - git pull
      - docker build
      - docker push
      - docker service update
```

---

## 7. Versionamento

- **TAG Docker**: `v8` — incremental manual
- **Git**: Branch main + develop
- **Commits**: Conventional Commits (commitlint)
- **SW**: Service Worker em `public/sw.js` para PWA

---

## 8. Variáveis de Ambiente

| Variável | Onde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | Build arg + app_config | URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Build arg + app_config | Chave anônima |

### Fallback via app_config

O Super Admin pode gerenciar as variáveis de ambiente diretamente pela UI em `/global/acoes` (Supabase tab), que persiste em `app_config`.

---

## 9. Infraestrutura de Rede

- **Rede Docker externa**: `network_conexao`
- **Porta interna**: 80 (Nginx)
- **Porta externa**: Gerenciada pelo Traefik
- **HTTPS**: Automático via Let's Encrypt

---

## 10. .dockerignore

```
node_modules
dist
.git
*.md
.DS_Store
credentials.env
vps.env
scripts
prints_telas
_temp/
secret/
.tanstack/
.mimocode/
test-results/
json-exports/
```

---

## 11. Procedimento de Deploy Manual

1. `npm run build` (verifica se passa)
2. `docker build -t hevertonperes/cadastros-conexao:v8 .`
3. `docker push hevertonperes/cadastros-conexao:v8`
4. SSH VPS: `docker service update cadastros-conexao`

---

## 12. Secrets / Credenciais

| Arquivo | Conteúdo | .gitignore |
|---|---|---|
| `vps.env` | Credenciais VPS (host, user, SSH key) | ✅ (não no repo) |
| `credentials.env` | Credenciais mock locais | ✅ |

---

## 13. Migrações

As migrações do banco (~50+) são aplicadas via `scripts/run-migrations.mjs`, que executa arquivos `.sql` em ordem.

---

## 14. Observações Técnicas

1. **Build-time vs Runtime**: `VITE_SUPABASE_URL` é build arg (fixo no container)
2. **Cache de assets**: `/icons/` e `/logos/` com `expires 1y` + `immutable`
3. **SPA Routing**: `try_files $uri $uri/ /index.html` para rotas React
4. **SW (PWA)**: `public/sw.js` para cache offline parcial
5. **Docker TAG**: Versão manual (v8) — sugestão: usar git SHA automaticamente
