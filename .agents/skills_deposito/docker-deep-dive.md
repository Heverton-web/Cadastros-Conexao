---
name: docker-deep-dive
description: Guia completo de Docker — instalação, imagens, contêineres, redes, volumes, Dockerfiles, Docker Compose e implantação em produção.
trigger:
  - docker
  - container
  - docker-compose
  - dockerfile
  - imagem docker
  - contêiner docker
  - docker network
  - docker volume
  - docker hub
  - docker engine
  - docker desktop
  - orquestração de contêineres
  - docker run
  - docker build
  - docker compose
  - deploy docker
---

# Docker Deep Dive

## 2. Primeiros passos com o Docker

### 2.1 Instalando o Docker Desktop no macOS

1. Baixe o instalador `.dmg` na página de download do Docker Desktop.
2. Abra o `.dmg` e arraste o ícone do Docker para a pasta Aplicativos.
3. Clique duas vezes no ícone do Docker na pasta Aplicativos para iniciá-lo.
4. Conceda permissões de acesso à rede e aos arquivos quando solicitado.
5. Selecione "Usar configurações recomendadas" para configuração ideal.
6. Crie uma conta no Docker Hub e faça login quando solicitado.
7. Verifique a instalação executando `docker --version` no terminal.

### 2.2 Instalando o Docker Desktop no Windows

1. Ative o WSL 2 executando `wsl --install` no PowerShell como administrador. Reinicie se solicitado.
2. Baixe o instalador do Docker Desktop para Windows.
3. Execute o `.exe` e siga as instruções na tela.
4. Certifique-se de que a opção "Usar backend WSL 2" esteja ativada.
5. Verifique a instalação com `docker --version` no PowerShell.

### 2.3 Instalando o Docker Engine no Linux (Ubuntu)

1. Configure o repositório adicionando a chave GPG oficial:
   ```
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
2. Instale o Docker Engine: `sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io`
3. Inicie o serviço: `sudo systemctl start docker`
4. Verifique: `docker --version`
5. (Opcional) Adicione seu usuário ao grupo Docker para executar sem `sudo`: `sudo usermod -aG docker $USER` (faça logout e login novamente)

### 2.4 Extensão Docker para VS Code

1. Abra o Marketplace de Extensões no VS Code.
2. Pesquise por "Docker" e instale a extensão oficial da Microsoft.
3. Use o ícone do Docker na barra lateral para gerenciar contêineres, imagens e configurações Compose.
4. Recursos: iniciar/parar/gerenciar contêineres, visualizar logs, depurar, gerenciar imagens, suporte ao Compose.

### 2.5 Fluxo de trabalho do Docker

1. **Imagem Docker**: modelo somente leitura que contém o sistema operacional, dependências, configurações e código.
2. **Registro de Imagens**: repositório como Docker Hub onde as imagens são armazenadas e distribuídas.
3. **Contêiner Docker**: instância executável da imagem — leve, portátil, isolada.
4. **Rede e Armazenamento**: contêineres se comunicam por redes; dados persistentes através de volumes.
5. **Docker Compose**: gerencia aplicações com múltiplos contêineres em um único arquivo YAML.

### 2.6 Comandos do Docker — Categorias

#### Comandos de imagem Docker
- `docker image ls` — Lista imagens disponíveis no sistema.
- `docker pull` — Obtém uma imagem de um registro.
- `docker build` — Cria uma imagem a partir de um Dockerfile.
- `docker image prune` — Remove imagens não utilizadas.
- `docker rmi` — Exclui uma imagem específica.
- `docker tag` — Marca uma imagem com um novo nome/versão.
- `docker push` — Envia uma imagem para um registro.
- `docker login` / `docker logout` — Autentica/sai de um registro.

#### Comandos de contêiner Docker
- `docker create` — Cria um novo contêiner sem iniciá-lo.
- `docker run` — Cria e inicia um contêiner em um único comando.
- `docker start` / `docker stop` — Inicia/interrompe um contêiner existente.
- `docker ps` — Lista contêineres ativos (`-a` inclui parados).
- `docker rm` — Exclui um contêiner permanentemente.
- `docker kill` — Força a parada imediata.
- `docker restart` — Reinicia um contêiner.
- `docker pause` / `docker unpause` — Pausa/retoma processos.
- `docker inspect` — Exibe detalhes em JSON.
- `docker commit` — Salva alterações de um contêiner como nova imagem.
- `docker rename` — Altera o nome de um contêiner.
- `docker container prune` — Remove todos os contêineres parados.

#### Comandos de interação com contêineres
- `docker exec` — Executa um comando dentro de um contêiner em execução.
- `docker attach` — Conecta o terminal a um contêiner em execução.
- `docker logs` — Exibe logs de um contêiner.
- `docker top` — Lista processos ativos dentro de um contêiner.
- `docker cp` — Copia arquivos entre o host e o contêiner.
- `docker diff` — Mostra alterações no sistema de arquivos do contêiner.

#### Comandos de rede Docker
- `docker network create` — Cria uma rede personalizada.
- `docker network ls` — Lista todas as redes.
- `docker network connect` / `disconnect` — Conecta/desconecta contêiner a uma rede.
- `docker network inspect` — Exibe detalhes da rede.
- `docker port` — Lista mapeamentos de porta.
- `docker network prune` — Remove redes não utilizadas.

#### Comandos de volume Docker
- `docker volume create` — Cria um novo volume.
- `docker volume ls` — Lista volumes.
- `docker volume inspect` — Exibe metadados do volume.
- `docker volume rm` — Exclui um volume específico.
- `docker volume prune` — Remove volumes não utilizados.

## 3. Imagens e contêineres Docker

### 3.1 Diferença entre imagem e contêiner

- **Imagem Docker**: modelo estático e somente leitura (sistema operacional + dependências + configurações + código). Imutável — alterações geram nova versão.
- **Contêiner Docker**: instância executável da imagem. Modificável durante a execução, mas dados são perdidos sem armazenamento persistente.

### 3.2 Imagens e Registros (Docker Hub)

1. Imagens usam arquitetura em camadas (layers) — camadas compartilhadas são armazenadas apenas uma vez.
2. O Docker Hub é o registro público padrão. Outros: Amazon ECR, Google Artifact Registry.
3. Nomenclatura: `<registro>/<repositório>:<tag>` (ex: `nginx:latest`).

#### Operações básicas com imagens via CLI

1. **Listar imagens**: `docker image ls` ou `docker images`
2. **Baixar imagem**: `docker pull <repositório>:<tag>`
3. **Criar imagem**: `docker build -t <repositório>:<tag> <caminho_do_dockerfile>`
4. **Remover imagens não utilizadas**: `docker image prune -a`
5. **Remover imagem específica**: `docker rmi <id_ou_nome_da_imagem>`
6. **Marcar imagem**: `docker tag <origem>:<tag> <novo_repositório>:<nova_tag>`

### 3.3 Ciclo de vida do contêiner Docker

1. **Criado** (`docker create`) — contêiner existe mas não está em execução.
2. **Em execução** (`docker start` / `docker run`) — processos ativos, consome CPU e memória.
3. **Pausado** (`docker pause`) — processos congelados, mantido na memória.
4. **Parado** (`docker stop`) — processos encerrados, dados ainda acessíveis.
5. **Removido** (`docker rm`) — metadados e sistema de arquivos excluídos.

Contêineres são descartáveis por design — dados não persistem a menos que volumes sejam configurados.

### 3.4 Gerenciamento avançado do ciclo de vida

1. **Forçar parada**: `docker kill <container>` (SIGKILL, sem limpeza)
2. **Reiniciar**: `docker restart <container>` (combina stop + start)
3. **Pausar/retomar**: `docker pause` / `docker unpause`
4. **Inspecionar**: `docker inspect <container>` (JSON completo)
5. **Salvar alterações como nova imagem**: `docker commit -m "mensagem" -a "autor" <container> <nome>:<tag>`
6. **Renomear**: `docker rename <nome_antigo> <nome_novo>`
7. **Limpar contêineres parados**: `docker container prune -f`
8. **Poda seletiva**: `docker container prune --filter "until=24h"`

### 3.5 Interagindo com contêineres

1. **Executar comando**: `docker exec -it <container> /bin/bash` (abre shell interativo)
2. **Conectar ao processo principal**: `docker attach <container>`
3. **Visualizar logs**: `docker logs -f --tail 50 <container>`
4. **Monitorar processos**: `docker top <container>`
5. **Copiar arquivos**:
   - Host → Contêiner: `docker cp <arquivo_host> <container>:<caminho_destino>`
   - Contêiner → Host: `docker cp <container>:<caminho_origem> <arquivo_host>`
6. **Verificar alterações**: `docker diff <container>` (A=adicionado, C=alterado, D=excluído)

### 3.6 Estudo de caso: Servidor web NGINX

1. Baixe a imagem: `docker pull nginx:latest`
2. Execute o contêiner: `docker run -d --name nginx_container -p 8080:80 nginx:latest`
3. Acesse `http://localhost:8080` para ver a página padrão.
4. Interaja com o contêiner: `docker exec -it nginx_container /bin/bash`
5. Edite o arquivo HTML: navegue até `/usr/share/nginx/html` e edite `index.html` com `vi` ou `nano`.
6. Saia do contêiner (`exit`), atualize o navegador para ver as alterações.
7. Pare e remova: `docker stop nginx_container` e `docker rm nginx_container`.

### 3.7 Estudo de caso: Transferência de arquivos com docker cp

1. Crie uma pasta de projeto: `mkdir docker-cp-test && cd docker-cp-test`
2. Crie um arquivo HTML no host: `echo "Teste Docker Cp" > new_index.html`
3. Copie para o contêiner: `docker cp new_index.html nginx-container:/usr/share/nginx/html/index.html`
4. Atualize o navegador em `http://localhost:8080` para ver o novo conteúdo.
5. Copie de volta para o host: `docker cp nginx-container:/usr/share/nginx/html/index.html ./retrieved_index.html`
6. Limpe: pare e remova contêiner e imagem.

## 4. Redes e armazenamento Docker

### 4.1 Redes Docker

#### Tipos de rede
- **Bridge**: padrão, comunicação isolada entre contêineres na mesma máquina.
- **Host**: contêiner compartilha a pilha de rede do host (mais rápido, menos isolado).
- **Overlay**: comunicação entre contêineres em múltiplos hosts (Docker Swarm/Kubernetes).

#### Quando configurar rede personalizada
- Múltiplos contêineres precisam se comunicar entre si.
- Contêiner único → rede bridge padrão é suficiente.

#### Gerenciamento de redes via CLI

1. **Criar rede**: `docker network create <nome_da_rede>`
2. **Listar redes**: `docker network ls`
3. **Inspecionar rede**: `docker network inspect <nome_da_rede>`
4. **Conectar contêiner**: `docker network connect <rede> <container>`
5. **Desconectar contêiner**: `docker network disconnect <rede> <container>`
6. **Remover redes não utilizadas**: `docker network prune`

#### Gerenciamento de portas

1. **Expor porta ao executar**: `docker run -p <porta_host>:<porta_container> <imagem>`
2. **Listar portas expostas**: `docker port <container>`

#### Estudo de caso: Servidor web + banco de dados

1. Crie rede personalizada: `docker network create my_network`
2. Execute o MySQL conectado à rede:
   ```
   docker run -d --name mysql_db --network my_network \
     -e MYSQL_ROOT_PASSWORD=rootpass \
     -e MYSQL_DATABASE=testdb \
     -e MYSQL_USER=testuser \
     -e MYSQL_PASSWORD=testpass \
     -p 3306:3306 mysql:latest
   ```
3. Crie o aplicativo Flask (`app.py`) que se conecta ao MySQL usando o nome do contêiner como host.
4. Execute o Flask na mesma rede:
   ```
   docker run -d --name web_app --network my_network \
     -v $(pwd)/app.py:/app/app.py -w /app \
     -p 5000:5000 \
     python:3.9-slim \
     sh -c "pip install flask mysql-connector-python && python app.py"
   ```
5. Acesse `http://localhost:5000`, insira dados e veja os resultados.
6. Limpe: pare e remova contêineres, remova a rede e as imagens.

### 4.2 Armazenamento persistente com volumes Docker

#### Por que persistência de dados?
- Contêineres são efêmeros — dados são perdidos ao parar/remover o contêiner.
- Volumes, bind mounts e tmpfs mounts garantem que dados sobrevivam aos ciclos de vida.

#### Tipos de armazenamento

1. **Volumes Docker** (recomendado para produção)
   - Gerenciados pelo Docker, armazenados fora do sistema de arquivos do contêiner.
   - Portáteis, fáceis de fazer backup, compartilháveis entre contêineres.
2. **Bind Mounts**
   - Montam diretório específico do host no contêiner.
   - Ideal para desenvolvimento (alterações refletidas em tempo real).
   - Menos portáteis, sujeitos a problemas de permissão.
3. **Tmpfs Mounts**
   - Armazenam dados na memória RAM.
   - Rápidos, não persistentes — perfeitos para cache/dados temporários.

#### Gerenciamento de volumes via CLI

1. **Criar volume**: `docker volume create <nome_do_volume>`
2. **Listar volumes**: `docker volume ls`
3. **Inspecionar volume**: `docker volume inspect <nome_do_volume>`
4. **Montar volume em contêiner**: `docker run -v <nome_do_volume>:<caminho_container> <imagem>`
5. **Remover volume**: `docker volume rm <nome_do_volume>`
6. **Limpar volumes não utilizados**: `docker volume prune`

#### Bind mount (exemplo)
```
docker run -v /caminho/no/host:/app/data minha_imagem
```

#### Tmpfs mount (exemplo)
```
docker run --tmpfs /tmp:rw,size=200m minha_imagem
```

#### Estudo de caso: Volume Docker para persistência

1. **Cenário 1 (sem volume)**: Execute MySQL sem volume, insira dados, remova e recrie o contêiner — dados perdidos.
2. **Cenário 2 (com volume)**:
   - Crie volume: `docker volume create mysql_data`
   - Execute MySQL com volume: `docker run -d -v mysql_data:/var/lib/mysql ... mysql:latest`
   - Insira dados, remova e recrie o contêiner com o mesmo volume — dados preservados.
3. Ao remover o volume (`docker volume rm mysql_data`), os dados são perdidos permanentemente.

## 5. Construindo e gerenciando imagens Docker

### 5.1 Imagens oficiais vs. personalizadas

- **Oficiais**: pré-construídas, mantidas pelo Docker e comunidade (nginx, mysql, node). Prontas para uso.
- **Personalizadas**: criadas para necessidades específicas — dependências adicionais, configurações, otimizações.

### 5.2 Dockerfile

Um Dockerfile é um arquivo de texto com instruções para construir uma imagem Docker.

#### Instruções principais

| Instrução | Descrição | Exemplo |
|-----------|-----------|---------|
| `FROM` | Define a imagem base | `FROM python:3.9-slim` |
| `WORKDIR` | Define o diretório de trabalho | `WORKDIR /app` |
| `COPY` | Copia arquivos do host para a imagem | `COPY . .` |
| `ADD` | Semelhante a COPY, suporta URLs e extração | `ADD app.tar.gz /app` |
| `RUN` | Executa comandos durante o build | `RUN pip install -r requirements.txt` |
| `CMD` | Comando padrão ao iniciar o contêiner | `CMD ["python", "app.py"]` |
| `ENTRYPOINT` | Comando sempre executado | `ENTRYPOINT ["python3"]` |
| `ENV` | Define variáveis de ambiente | `ENV NODE_ENV=production` |
| `EXPOSE` | Declara portas de rede | `EXPOSE 5000` |
| `VOLUME` | Cria ponto de montagem | `VOLUME /data` |
| `ARG` | Variável de tempo de build | `ARG APP_VERSION=1.0` |
| `LABEL` | Metadados da imagem | `LABEL maintainer="user@example.com"` |
| `USER` | Especifica usuário para execução | `USER appuser` |
| `STOPSIGNAL` | Sinal para parar o contêiner | `STOPSIGNAL SIGTERM` |
| `ONBUILD` | Gatilho para builds filhos | `ONBUILD RUN apt-get update` |

#### Regras de sintaxe do Dockerfile
1. Instruções em letras maiúsculas.
2. A ordem importa — comece com `FROM`, termine com `CMD` ou `ENTRYPOINT`.
3. Cada instrução cria uma camada — agrupe comandos relacionados para reduzir o tamanho.
4. Use comentários com `#` para documentação.
5. Caminhos diferenciam maiúsculas de minúsculas.
6. Use `.dockerignore` para excluir arquivos desnecessários do contexto de build.

### 5.3 Contexto de construção e .dockerignore

- O contexto de construção inclui todos os arquivos no diretório especificado no comando `docker build`.
- Arquivos desnecessários aumentam o tempo de build e podem expor dados sensíveis.
- O arquivo `.dockerignore` exclui padrões do contexto.

**Estrutura de exemplo**:
```
projeto/
├── app/
│   ├── app.py
│   └── requirements.txt
├── logs/
├── secrets/
│   └── api_key.txt
├── .env
├── .dockerignore
└── Dockerfile
```

**Exemplo de .dockerignore**:
```
logs/
secrets/
.env
*.swp
.DS_Store
```

### 5.4 Criando e executando imagens

1. **Construir**: `docker build -t <nome>:<tag> <contexto>` (ex: `docker build -t flask-app .`)
2. **Executar**: `docker run -p 5000:5000 flask-app`

### 5.5 Estudo de caso: Site estático com NGINX

1. Crie a estrutura: `mkdir static-site && cd static-site && touch Dockerfile index.html`
2. **index.html**: página HTML simples.
3. **Dockerfile**:
   ```dockerfile
   FROM nginx:alpine
   COPY index.html /usr/share/nginx/html
   ```
4. Construa: `docker build -t static-site .`
5. Execute: `docker run -d -p 8080:80 static-site`
6. Acesse `http://localhost:8080`.

### 5.6 Estudo de caso: Aplicação Flask

1. Estrutura: `app.py` + `requirements.txt` + `Dockerfile`
2. **Dockerfile**:
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["python", "app.py"]
   ```
3. Construa: `docker build -t flask-app .`
4. Execute: `docker run -d -p 5001:5000 flask-app`
5. Acesse `http://localhost:5001`.

### 5.7 Estudo de caso: Aplicação Node.js

1. Estrutura: `server.js` + `package.json` + `Dockerfile`
2. **Dockerfile**:
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY . .
   RUN npm install
   CMD ["node", "server.js"]
   ```
3. Construa: `docker build -t node-app .`
4. Execute: `docker run -d -p 3000:3000 node-app`
5. Acesse `http://localhost:3000`.

### 5.8 Compartilhando imagens no Docker Hub

1. **Marcar imagem**: `docker tag my-app:latest meu-usuario/my-app:v1.0`
2. **Fazer login**: `docker login -u meu-usuario` (use token de acesso pessoal como senha)
3. **Enviar imagem**: `docker push meu-usuario/my-app:v1.0`
4. **Compartilhar**: outros podem baixar com `docker pull meu-usuario/my-app:v1.0`
5. **Sair**: `docker logout`

#### Gerando token de acesso pessoal no Docker Hub
1. Acesse Docker Hub → Configurações da conta → Segurança.
2. Clique em "Novo Token de Acesso", dê uma descrição, selecione permissões (leitura, gravação, exclusão).
3. Copie o token gerado (não será exibido novamente).

## 6. Docker Compose e implantação

### 6.1 O que é Docker Compose?

Ferramenta para definir e gerenciar aplicações com múltiplos contêineres em um único arquivo YAML (`docker-compose.yml`). Gerencia serviços, redes, volumes, dependências e variáveis de ambiente.

### 6.2 Estrutura do arquivo docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example

networks:
  default:
    driver: bridge

volumes:
  db_data:
```

- **services**: define cada contêiner (build, imagem, portas, dependências, ambiente, volumes).
- **networks**: configura comunicação entre serviços (bridge por padrão).
- **volumes**: declara volumes nomeados para persistência de dados.

### 6.3 Configurações do arquivo Compose

1. **Definição de serviços**: `services`, `image`, `build`, `container_name`, `hostname`, `restart`, `command`, `entrypoint`, `working_dir`
2. **Redes e comunicação**: `ports`, `expose`, `networks`, `extra_hosts`
3. **Variáveis de ambiente e segredos**: `env_file`, `environment`, `secrets`, `configs`
4. **Armazenamento**: `volumes`, `tmpfs`
5. **Dependências e orquestração**: `depends_on`, `deploy`, `scale`
6. **Segurança**: `cap_add`, `cap_drop`, `privileged`, `security_opt`, `ulimits`
7. **Monitoramento**: `healthcheck`, `logging`

### 6.4 Comandos do Docker Compose

#### Construção e operação
1. `docker-compose build [--no-cache] [--pull]` — Constrói/recria serviços.
2. `docker-compose up [-d] [--build]` — Inicia contêineres, criando-os se necessário.
3. `docker-compose ps [-a]` — Exibe status dos contêineres.
4. `docker-compose start [serviço]` — Inicia contêineres interrompidos.
5. `docker-compose stop [serviço]` — Interrompe contêineres sem removê-los.
6. `docker-compose restart [serviço]` — Reinicia contêineres.
7. `docker-compose run [--rm] <serviço> <comando>` — Executa comando único em novo contêiner.
8. `docker-compose rm [-f] [-s]` — Remove contêineres parados.

#### Monitoramento e depuração
9. `docker-compose logs [-f] [--tail=N]` — Exibe logs dos contêineres.
10. `docker-compose exec <serviço> <comando>` — Executa comando em contêiner em execução.
11. `docker-compose top <serviço>` — Lista processos ativos no contêiner.

#### Dimensionamento e configuração
12. `docker-compose up --scale <serviço>=<N>` — Escala serviço para N instâncias.
13. `docker-compose config [--services] [--volumes]` — Valida e exibe configuração.

#### Limpeza e gestão ambiental
14. `docker-compose down [--volumes] [--rmi all]` — Para serviços, remove contêineres, redes e volumes.
15. `docker-compose pull` — Atualiza imagens dos serviços.
16. `docker-compose kill [serviço]` — Interrompe imediatamente contêineres.
17. `docker-compose pause / unpause <serviço>` — Pausa/retoma serviços.

### 6.5 Estudo de caso: Django + PostgreSQL + Nginx

#### Passo 1: Estrutura do projeto
```
ch6-docker-compose-demo/
├── django/
│   ├── Dockerfile
│   └── requirements.txt
├── nginx/
│   └── nginx.conf
├── postgres/
│   └── data/
└── docker-compose.yml
```

#### Passo 2: Dockerfile do Django
```dockerfile
FROM python:3.9-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

#### Passo 3: Docker Compose
```yaml
services:
  web:
    build: ./django
    container_name: django_app
    expose:
      - "8000"
    depends_on:
      - db
    environment:
      - DEBUG=True
      - DB_NAME=postgres
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_HOST=db
      - DB_PORT=5432
    volumes:
      - ./django:/app
      - ./staticfiles:/app/staticfiles
  db:
    image: postgres:13
    container_name: postgres_db
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    ports:
      - "80:80"
    depends_on:
      - web
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./staticfiles:/app/staticfiles
volumes:
  postgres-data:
```

#### Passo 4: Configuração do Nginx (proxy reverso)
```nginx
server {
    listen 80;
    server_name localhost;
    location /static/ {
        alias /app/staticfiles/;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location / {
        proxy_pass http://web:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Passo 5: Comandos do Django
1. Criar projeto: `docker-compose run --rm web django-admin startproject config /app`
2. Criar app: `docker-compose run --rm web python manage.py startapp library`
3. Configurar `settings.py` com PostgreSQL, variáveis de ambiente, arquivos estáticos.
4. Executar migrações: `docker-compose run --rm web python manage.py makemigrations && docker-compose run --rm web python manage.py migrate`
5. Acessar: `http://localhost`

#### Passo 6: Implantação em produção
- Use `.env` para variáveis sensíveis (SECRET_KEY, DEBUG, ALLOWED_HOSTS).
- Configure `nginx.conf` para servir arquivos estáticos e fazer proxy reverso.
- Utilize `restart: always` para resiliência.
- Remova volumes de bind mount em produção; use volumes nomeados.
- Configure `healthcheck` nos serviços críticos.

### 6.6 Sintaxe YAML para Docker Compose

1. **Pares chave-valor**: `chave: valor`
2. **Indentação**: 2 espaços por nível, sem tabulações.
3. **Listas**: itens com `- ` (hífen + espaço).
4. **Escalares**: strings (com ou sem aspas), números, booleanos (`true`/`false`).
5. **Comentários**: `#`
6. **Strings multilinha**: Bloco literal `|` (preserva quebras), bloco dobrado `>` (condensa em parágrafo).
7. **Âncoras e aliases**: `&nome` define, `*nome` referencia, `<<:` mescla.
8. **Valores nulos**: `null` ou omitir o valor.
