# Deploy em Produção — Cadastros Conexão

## Pré-requisitos na VPS

- Docker Swarm ativo
- Rede `network_conexao` criada:
  ```bash
  docker network create --driver overlay --attachable network_conexao
  ```
- Traefik rodando nos entrypoints `web` (80) e `websecure` (443)
- DNS: `cadastros.vpsconexao.org` apontando para o IP da VPS

---

## Opção 1 — Portainer (recomendado)

1. Acesse o Portainer → **Stacks** → **Add stack**
2. Nome do stack: `cadastros-conexao`
3. Cole o conteúdo do `docker-compose.yml` no editor
4. Em **Environment variables**, adicione:

   | Variável | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://cluuqzhizeqvkgvfdisx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM` |

5. **Deploy the stack**

---

## Opção 2 — CLI na VPS (acesso SSH)

```bash
# 1. Criar .env com as variáveis
echo 'VITE_SUPABASE_URL=https://cluuqzhizeqvkgvfdisx.supabase.co' > .env
echo 'VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM' >> .env

# 2. Fazer pull da imagem
docker pull hevertonperes/cadastros-conexao:v1

# 3. Subir o stack no Swarm
docker stack deploy -c docker-compose.yml cadastros-conexao

# 4. Verificar se subiu
docker stack services cadastros-conexao
docker service logs cadastros-conexao_app
```

---

## Verificação

Após o deploy, acesse: [https://cadastros.vpsconexao.org](https://cadastros.vpsconexao.org)

Para monitorar:

```bash
# Logs do serviço
docker service logs -f cadastros-conexao_app

# Status dos serviços no stack
docker stack ps cadastros-conexao
```

---

## Atualização da Imagem

Quando houver uma nova versão:

```bash
# Na máquina local
docker build -t hevertonperes/cadastros-conexao:v2 .
docker push hevertonperes/cadastros-conexao:v2

# Na VPS, atualizar docker-compose.yml com a nova tag e redeploy:
docker stack deploy -c docker-compose.yml cadastros-conexao
```
