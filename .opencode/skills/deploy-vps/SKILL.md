---
name: deploy-vps
description: >
  Deploy workflow do ERP Conexão. Faz commit, build Docker, push para Docker Hub
  (hevertonperes/cadastros-conexao) e atualiza o serviço na VPS (167.86.69.79).
  DISPARO: ativar SOMENTE quando o usuário disser "deploy", "/deploy" ou "fazer deploy".
  NÃO ativar em nenhum outro contexto. Credenciais lidas de vps.env no raiz do projeto.
---

# Deploy VPS

## Regra
Só executar quando o usuário disser "deploy" ou "/deploy" explicitamente.

## Pré-requisitos
- `vps.env` no raiz do projeto com:
  ```
  DOCKER_HUB_USERNAME=hevertonperes
  DOCKER_HUB_PASSWORD=...
  VPS_IP=167.86.69.79
  VPS_USER=root
  VPS_PASSWORD=conexao2026
  ```
- `.env` no raiz com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

## Fluxo

## 0. Economia de Tokens
Sempre seguir as diretrizes de economia de tokens `C:\Users\trcnologia\Desktop\bubble_reverse_engineering\AGENTS.md`

### 1. Verificar mudanças locais
```bash
git status --porcelain
```
Se houver mudanças, perguntar a mensagem de commit. Se não, pular etapa.

### 2. Commit + Push (se houver mudanças)
```bash
git add -A && git commit -m "<mensagem>" && git push origin main
```

### 3. Ler vps.env
Usar Bash `source vps.env` ou ler linha a linha com grep/read.

### 4. SSH na VPS + pull
```python
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD)
```
Rodar na VPS (sequencial):
```bash
cd /root/Cadastros-Conexao && git pull origin main
```

### 5. Docker build na VPS
```bash
cd /root/Cadastros-Conexao && docker build --no-cache \
  -t hevertonperes/cadastros-conexao:latest \
  -t hevertonperes/cadastros-conexao:v<NUMERO> \
  --build-arg VITE_SUPABASE_URL=<URL> \
  --build-arg VITE_SUPABASE_ANON_KEY=<KEY> .
```

### 6. Docker push
```bash
docker push hevertonperes/cadastros-conexao:v<NUMERO>
```

### 7. Service update
```bash
docker service update --force --image hevertonperes/cadastros-conexao:v<NUMERO> cadastros-conexao_app
```

### 8. Fechar SSH
`client.close()`

## Observações
- Incrementar versão: v10 → v11 → v12...
- Timeout total ~5min (docker build é o mais lento)
- Se docker build falhar, interromper (não fazer push/update)
- Se push falhar, verificar docker login
