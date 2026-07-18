import paramiko
import time
import sys

VPS_IP = "167.86.69.79"
VPS_USER = "root"
VPS_PASSWORD = "conexao2026"
DOCKER_USER = "hevertonperes"
DOCKER_PASS = "@#Khen741963@#"
SUPABASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM"

def run(ssh, cmd, timeout=60):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out.strip(): print(out.strip())
    if err.strip(): print(err.strip(), file=sys.stderr)
    return out, err, stdout.channel.recv_exit_status()

try:
    print("=== Conectando na VPS ===")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD, timeout=30)
    print("Conectado!")

    # Backup current image
    print("\n=== Backup da versao atual ===")
    out, _, _ = run(client, "docker service inspect erp-odonto_app --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || echo 'none'")
    current_image = out.strip().strip("'")
    print(f"Imagem atual: {current_image}")

    # Git pull
    print("\n=== Git pull ===")
    run(client, "cd /root/Cadastros-Conexao && git pull origin main")

    # Docker login
    print("\n=== Docker login ===")
    run(client, f"echo '{DOCKER_PASS}' | docker login -u {DOCKER_USER} --password-stdin 2>&1")

    # Get env vars from .env on VPS
    print("\n=== Lendo env vars ===")
    out, _, _ = run(client, "cd /root/Cadastros-Conexao && grep VITE_SUPABASE_URL .env 2>/dev/null | head -1")
    vite_url = out.strip().split("=", 1)[1].strip().strip("'\"") if "=" in out else SUPABASE_URL
    out, _, _ = run(client, "cd /root/Cadastros-Conexao && grep VITE_SUPABASE_ANON_KEY .env 2>/dev/null | head -1")
    vite_key = out.strip().split("=", 1)[1].strip().strip("'\"") if "=" in out else SUPABASE_KEY
    print(f"URL: {vite_url}")

    # Docker build
    print("\n=== Docker build ===")
    build_cmd = f"""cd /root/Cadastros-Conexao && docker build --no-cache \
      -t {DOCKER_USER}/erp-odonto:latest \
      -t {DOCKER_USER}/erp-odonto:deploy-$(date +%Y%m%d%H%M) \
      --build-arg VITE_SUPABASE_URL={vite_url} \
      --build-arg VITE_SUPABASE_ANON_KEY={vite_key} \
      . 2>&1"""
    out, err, rc = run(client, build_cmd, timeout=300)
    if rc != 0:
        print("BUILD FALHOU! Abortando deploy.")
        sys.exit(1)
    print("Build OK!")

    # Get tag
    out, _, _ = run(client, "docker images --format '{{.Tag}}' hevertonperes/erp-odonto | head -2")
    tags = [t for t in out.strip().split("\n") if t and t != "latest"]
    tag = tags[0] if tags else "latest"
    print(f"Tag: {tag}")

    # Docker push
    print("\n=== Docker push ===")
    run(client, f"docker push {DOCKER_USER}/erp-odonto:{tag}")
    run(client, f"docker push {DOCKER_USER}/erp-odonto:latest")

    # Service update
    print("\n=== Service update ===")
    run(client, f"docker service update --force --image {DOCKER_USER}/erp-odonto:{tag} erp-odonto_app")

    # Health check
    print("\n=== Health check ===")
    time.sleep(10)
    out, _, _ = run(client, "docker service ps erp-odonto_app --format '{{.CurrentState}}' | head -1")
    print(f"Estado: {out.strip()}")

    out, _, _ = run(client, "docker service logs erp-odonto_app --tail 5 2>&1 | grep -i 'error\\|fatal' || echo 'Sem erros nos logs'")
    print(f"Logs: {out.strip()}")

    # Verify
    print("\n=== Verificando app ===")
    out, _, rc = run(client, "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ 2>/dev/null || echo 'N/A'")
    print(f"HTTP status: {out.strip()}")

    print(f"\n=== Deploy concluido ===")
    print(f"Imagem anterior: {current_image}")
    print(f"Imagem nova: {DOCKER_USER}/erp-odonto:{tag}")

    client.close()

except Exception as e:
    print(f"ERRO: {e}")
    sys.exit(1)
