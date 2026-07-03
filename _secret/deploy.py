import paramiko
import time
import os

# Configurações
VPS_IP = "167.86.69.79"
VPS_USER = "root"
VPS_PASSWORD = "conexao2026"
DOCKER_HUB_USERNAME = "hevertonperes"
DOCKER_HUB_PASSWORD = "@#Khen741963@#"
VITE_SUPABASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co"
VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM"

# Conectar à VPS
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD, look_for_keys=False, timeout=30)
print("Conectado à VPS")

# Pull das últimas mudanças
print("\n=== PULLING CHANGES ===")
stdin, stdout, stderr = client.exec_command("cd /root/Cadastros-Conexao && git pull origin main")
print(stdout.read().decode())
if stderr.read().decode():
    print("Erro no pull:", stderr.read().decode())

# Verificar versão atual
print("\n=== CHECKING CURRENT VERSION ===")
stdin, stdout, stderr = client.exec_command("cd /root/Cadastros-Conexao && docker images hevertonperes/cadastros-conexao --format '{{.Tag}}' | head -1")
current_version = stdout.read().decode().strip()
print(f"Versão atual: {current_version}")

# Determinar nova versão
if current_version and current_version.startswith('v'):
    try:
        version_num = int(current_version.replace('v', ''))
        new_version = f"v{version_num + 1}"
    except:
        new_version = "v11"
else:
    new_version = "v11"

print(f"Nova versão: {new_version}")

# Docker build
print(f"\n=== DOCKER BUILD {new_version} ===")
build_cmd = f"""cd /root/Cadastros-Conexao && docker build --no-cache \
  -t {DOCKER_HUB_USERNAME}/cadastros-conexao:latest \
  -t {DOCKER_HUB_USERNAME}/cadastros-conexao:{new_version} \
  --build-arg VITE_SUPABASE_URL="{VITE_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="{VITE_SUPABASE_ANON_KEY}" \
  . 2>&1"""

transport = client.get_transport()
channel = transport.open_session()
channel.setblocking(0)
channel.exec_command(build_cmd)

out = ""
start = time.time()
timeout = 1800  # 30 minutos para build
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
        print("\nTIMEOUT NO BUILD")
        channel.close()
        client.close()
        exit(1)
    time.sleep(0.2)

try:
    build_exit = channel.recv_exit_status() if channel.exit_status_ready() else -1
    print(f"\nBuild exit code: {build_exit}")
except:
    build_exit = -1
    print("\nNão foi possível obter exit code do build")

if build_exit != 0:
    print("\nBUILD FALHOU - Abortando deploy")
    client.close()
    exit(1)

# Docker push
print(f"\n=== DOCKER PUSH {new_version} ===")
stdin, stdout, stderr = client.exec_command(f"docker login -u {DOCKER_HUB_USERNAME} -p {DOCKER_HUB_PASSWORD}")
print(stdout.read().decode())
print(stderr.read().decode())

stdin, stdout, stderr = client.exec_command(f"docker push {DOCKER_HUB_USERNAME}/cadastros-conexao:{new_version}")
print(stdout.read().decode())
push_err = stderr.read().decode()
if push_err:
    print("Erro no push:", push_err)

stdin, stdout, stderr = client.exec_command(f"docker push {DOCKER_HUB_USERNAME}/cadastros-conexao:latest")
print(stdout.read().decode())
push_err = stderr.read().decode()
if push_err:
    print("Erro no push latest:", push_err)

# Service update
print(f"\n=== SERVICE UPDATE {new_version} ===")
stdin, stdout, stderr = client.exec_command(f"docker service update --force --image {DOCKER_HUB_USERNAME}/cadastros-conexao:{new_version} cadastros-conexao_app")
print(stdout.read().decode())
update_err = stderr.read().decode()
if update_err:
    print("Erro no update:", update_err)

# Verificar status
time.sleep(10)
print("\n=== CHECKING SERVICE STATUS ===")
stdin, stdout, stderr = client.exec_command("docker service ps cadastros-conexao_app --format '{{.CurrentState}}' | head -1")
print(stdout.read().decode())

print("\n=== DEPLOY CONCLUÍDO ===")
print(f"Versão deployada: {new_version}")

client.close()
