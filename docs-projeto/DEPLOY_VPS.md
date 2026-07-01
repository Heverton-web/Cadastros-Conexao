# Deploy em Produção — Cadastros Conexão

## Passo a passo detalhado — VPS (SSH)

### 1. Acessar a VPS via SSH

```bash
ssh usuario@ip-da-vps
```

### 2. Criar a pasta do projeto

```bash
mkdir -p /opt/cadastros-conexao
cd /opt/cadastros-conexao
```

### 3. Criar o arquivo `.env`

```bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://cluuqzhizeqvkgvfdisx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM
EOF
```

### 4. Criar o arquivo `docker-compose.yml`

```bash
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  app:
    image: hevertonperes/cadastros-conexao:v1
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    networks:
      - network_conexao
    environment:
      - NODE_ENV=production
      - TZ=America/Sao_Paulo
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.cadastros_conexao.rule=Host(`cadastros.vpsconexao.org`)"
      - "traefik.http.routers.cadastros_conexao.entrypoints=websecure"
      - "traefik.http.routers.cadastros_conexao.tls.certresolver=letsencryptresolver"
      - "traefik.http.routers.cadastros_conexao_http.rule=Host(`cadastros.vpsconexao.org`)"
      - "traefik.http.routers.cadastros_conexao_http.entrypoints=web"
      - "traefik.http.routers.cadastros_conexao_http.middlewares=cadastros_redirect"
      - "traefik.http.middlewares.cadastros_redirect.redirectscheme.scheme=https"
      - "traefik.http.services.cadastros_conexao.loadbalancer.server.port=80"

networks:
  network_conexao:
    external: true
    name: network_conexao
EOF
```

### 5. Verificar se a rede existe

```bash
docker network ls | grep network_conexao
```

Se não existir, criar:

```bash
docker network create --driver overlay --attachable network_conexao
```

### 6. Fazer pull da imagem

```bash
docker pull hevertonperes/cadastros-conexao:v1
```

### 7. Subir o stack no Swarm

```bash
docker stack deploy -c docker-compose.yml cadastros-conexao
```

### 8. Verificar se funcionou

```bash
# Listar serviços do stack
docker stack services cadastros-conexao

# Ver logs
docker service logs cadastros-conexao_app

# Verificar se o container está rodando
docker ps | grep cadastros
```

### 9. Testar na VPS

```bash
curl -I http://localhost
```

---

## Troubleshooting

| Problema                                         | Causa                          | Solução                                                               |
| ------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------- |
| `network network_conexao not found`              | Rede não existe                | `docker network create --driver overlay --attachable network_conexao` |
| `no suitable host (missing passable admin role)` | Swarm não está ativo           | `docker swarm init`                                                   |
| `.env: no such file or directory`                | `.env` não está na mesma pasta | Verifique se está em `/opt/cadastros-conexao/.env`                    |
| Traefik 404                                      | DNS não aponta para VPS        | Configure `cadastros.vpsconexao.org` → IP da VPS                      |
| Imagem não encontrada                            | Pull falhou                    | `docker pull hevertonperes/cadastros-conexao:v1`                      |

---

## Atualização da Imagem

Quando houver uma nova versão:

```bash
# Na máquina local: build e push
docker build -t hevertonperes/cadastros-conexao:v2 .
docker push hevertonperes/cadastros-conexao:v2

# Na VPS: atualizar a tag no docker-compose.yml e redeploy
# Editar image: hevertonperes/cadastros-conexao:v1 → v2
docker stack deploy -c docker-compose.yml cadastros-conexao
```

Viewed DEPLOY_VPS.md:79-100
Viewed DEPLOY_VPS.md:1-135
Viewed DEPLOY_VPS.md:1-135
Searched for "."
Viewed Dockerfile:1-17

Aqui está o passo a passo completo e exato para gerar a imagem e fazer o deploy utilizando o Docker Swarm e Traefik.

> [!IMPORTANT]
> Como o projeto é construído sobre o **Vite**, as variáveis de ambiente com prefixo `VITE_` precisam ser injetadas **em tempo de compilação** (build-time). Portanto, devemos passá-las como `--build-arg` no comando de build local.

---

### 1. No Computador (Terminal Local)

Execute estes comandos na pasta raiz do seu projeto local:

```bash
# 1. Faça login na sua conta do Docker Hub
docker login

# 2. Gere a build da imagem injetando as variáveis do Supabase
docker build \
  --build-arg VITE_SUPABASE_URL="https://cluuqzhizeqvkgvfdisx.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="SUA_ANON_KEY_AQUI" \
  -t seu_usuario_dockerhub/cadastros-conexao:v1 .

# 3. Envie a imagem gerada para o seu repositório no Docker Hub
docker push seu_usuario_dockerhub/cadastros-conexao:v1
```

---

### 2. Na VPS (Acesso via SSH)

Conecte-se e configure o ambiente no servidor:

```bash
# 1. Conecte-se à VPS
ssh usuario@ip-da-vps

# 2. Garanta que a rede overlay externa "minha_rede" existe
docker network create --driver overlay --attachable minha_rede

# 3. Crie e acesse o diretório do projeto
mkdir -p /opt/cadastros-conexao
cd /opt/cadastros-conexao
```

#### Criar o arquivo `docker-compose.yml`

Crie o arquivo usando o comando abaixo. Substitua `seu_usuario_dockerhub` e `subdominio.seudominio.com` pelos seus dados reais:

```bash
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  app:
    image: seu_usuario_dockerhub/cadastros-conexao:v1
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
      labels:
        - "traefik.enable=true"
        # Roteador HTTPS com Let's Encrypt
        - "traefik.http.routers.cadastros_conexao.rule=Host(`subdominio.seudominio.com`)"
        - "traefik.http.routers.cadastros_conexao.entrypoints=websecure"
        - "traefik.http.routers.cadastros_conexao.tls=true"
        - "traefik.http.routers.cadastros_conexao.tls.certresolver=letsencryptresolver"
        # Roteador HTTP para redirecionar para HTTPS automaticamente
        - "traefik.http.routers.cadastros_conexao_http.rule=Host(`subdominio.seudominio.com`)"
        - "traefik.http.routers.cadastros_conexao_http.entrypoints=web"
        - "traefik.http.routers.cadastros_conexao_http.middlewares=cadastros_redirect"
        - "traefik.http.middlewares.cadastros_redirect.redirectscheme.scheme=https"
        # Porta interna que o Nginx do container está escutando
        - "traefik.http.services.cadastros_conexao.loadbalancer.server.port=80"
    networks:
      - minha_rede

networks:
  minha_rede:
    external: true
    name: minha_rede
EOF
```

> [!NOTE]
> No Docker Swarm, as configurações do Traefik **devem** ser declaradas sob o bloco `deploy.labels` para que o Traefik consiga mapear o serviço corretamente através da API do Swarm.

#### Iniciar o deploy e verificar execução

```bash
# 4. Inicie o serviço no Docker Swarm
docker stack deploy -c docker-compose.yml cadastros-conexao

# 5. Verifique se o serviço subiu com sucesso
docker stack services cadastros-conexao

# 6. Monitore os logs da aplicação se necessário
docker service logs cadastros-conexao_app
```
