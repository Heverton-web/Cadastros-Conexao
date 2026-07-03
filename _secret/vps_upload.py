import paramiko
import time
import os

HOST = "167.86.69.79"
USER = "root"
PASS = "conexao2026"
TAR_PATH = os.path.expandvars(r"%TEMP%\app_source.tar.gz")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, look_for_keys=False, timeout=30)

# Upload via SFTP
print("Uploading source code (6.5 MB)...")
sftp = client.open_sftp()
sftp.put(TAR_PATH, "/opt/cadastros-conexao/app_source.tar.gz")
sftp.close()
print("Upload OK")

# Extract on VPS
stdin, stdout, stderr = client.exec_command(
    "cd /opt/cadastros-conexao && "
    "rm -f Dockerfile nginx.conf && "  # remove our temp files
    "tar -xzf app_source.tar.gz && "
    "rm -f app_source.tar.gz && "
    "ls -la && echo EXTRACT_DONE"
)
out = stdout.read().decode()
err = stderr.read().decode()
print(out)
if err:
    print("STDERR:", err)

# Write the corrected Dockerfile and nginx.conf OVER the extracted ones
dockerfile = (
    'FROM node:20-alpine AS builder\n'
    'WORKDIR /app\n'
    'ARG VITE_SUPABASE_URL\n'
    'ARG VITE_SUPABASE_ANON_KEY\n'
    'ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL\n'
    'ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY\n'
    'COPY package*.json ./\n'
    'RUN npm install\n'
    'COPY . .\n'
    'RUN npm run build\n'
    '\n'
    'FROM nginx:alpine\n'
    'COPY --from=builder /app/dist /usr/share/nginx/html\n'
    'COPY nginx.conf /etc/nginx/conf.d/default.conf\n'
    'EXPOSE 80\n'
    'CMD ["nginx", "-g", "daemon off;"]\n'
)

nginx_conf = (
    'server {\n'
    '    listen 80;\n'
    '    root /usr/share/nginx/html;\n'
    '    index index.html;\n'
    '    location / {\n'
    '        try_files $uri $uri/ /index.html;\n'
    '    }\n'
    '    location /icons/ {\n'
    '        expires 1y;\n'
    '        add_header Cache-Control "public, immutable";\n'
    '    }\n'
    '    location /logos/ {\n'
    '        expires 1y;\n'
    '        add_header Cache-Control "public, immutable";\n'
    '    }\n'
    '}\n'
)

# Write corrected files
stdin, stdout, stderr = client.exec_command("cat > /opt/cadastros-conexao/Dockerfile")
stdin.write(dockerfile)
stdin.flush()
stdin.channel.shutdown_write()
print("Dockerfile exit:", stdout.channel.recv_exit_status())

stdin, stdout, stderr = client.exec_command("cat > /opt/cadastros-conexao/nginx.conf")
stdin.write(nginx_conf)
stdin.flush()
stdin.channel.shutdown_write()
print("nginx.conf exit:", stdout.channel.recv_exit_status())

# Verify files
stdin, stdout, stderr = client.exec_command("cat /opt/cadastros-conexao/Dockerfile && echo --- && cat /opt/cadastros-conexao/nginx.conf")
print(stdout.read().decode())

# Now BUILD
print("\n=== BUILDING IMAGE v3 ===")
transport = client.get_transport()
channel = transport.open_session()
channel.setblocking(0)

cmd = (
    '. /opt/cadastros-conexao/.env '
    '&& docker build '
    '--build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" '
    '--build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" '
    '-t hevertonperes/cadastros-conexao:v6 '
    '/opt/cadastros-conexao 2>&1'
)
channel.exec_command(cmd)

out = ""
start = time.time()
timeout = 1800
while not channel.exit_status_ready():
    try:
        if channel.recv_ready():
            data = channel.recv(4096).decode("utf-8", errors="replace")
            out += data
            print(data, end="", flush=True)
        if channel.recv_stderr_ready():
            data = channel.recv_stderr(4096).decode("utf-8", errors="replace")
            out += data
            print(data, end="", flush=True)
    except:
        pass
    if time.time() - start > timeout:
        print("\nTIMEOUT")
        channel.close()
        break
    time.sleep(0.2)

try:
    ec = channel.recv_exit_status() if channel.exit_status_ready() else -1
    print(f"\nExit code: {ec}")
except:
    ec = -1
    print("\nCould not get exit code")

if ec == 0:
    print("\n=== BUILD OK! Cleaning old images ===")
    stdin, stdout, stderr = client.exec_command(
        "docker rmi hevertonperes/cadastros-conexao:v1 "
        "hevertonperes/cadastros-conexao:v2 2>/dev/null; echo clean_done"
    )
    print(stdout.read().decode())

    print("\n=== Removing old stack ===")
    stdin, stdout, stderr = client.exec_command(
        "docker stack rm cadastros-conexao 2>/dev/null; echo rm_done"
    )
    print(stdout.read().decode())
    time.sleep(10)

    print("\n=== Deploying new stack ===")
    stdin, stdout, stderr = client.exec_command(
        "docker stack deploy -c /opt/cadastros-conexao/docker-compose.yml cadastros-conexao"
    )
    print(stdout.read().decode())

    time.sleep(10)
    print("\n=== Checking service logs ===")
    stdin, stdout, stderr = client.exec_command(
        "docker service logs cadastros-conexao_app --tail 30"
    )
    print(stdout.read().decode())
else:
    print("\nBUILD FAILED")

client.close()
