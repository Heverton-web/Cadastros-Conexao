import paramiko
import re
import sys
import time

VPS_IP = "167.86.69.79"
VPS_USER = "root"
VPS_PASSWORD = "conexao2026"
DH_USER = "hevertonperes"
DH_PASS = "@#Khen741963@#"

SUPABASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co"
SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM"

IMAGE_NAME = "hevertonperes/erp-odonto"
SERVICE_NAME = "erp-odonto_app"
DOMAIN = "erp.vpsconexao.org"
NETWORK = "network_conexao"

def run_cmd(ssh, cmd, timeout=300):
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
    if out: print(out)
    if err: print(f"ERR: {err}")
    status = stdout.channel.recv_exit_status()
    print(f"Status: {status}")
    return status, err

def main():
    print("Connecting to VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD)
    print("Connected.\n")

    # Get current image tag
    stdin, stdout, stderr = ssh.exec_command(f"docker service inspect {SERVICE_NAME} --format '{{{{.Spec.TaskTemplate.ContainerSpec.Image}}}}' 2>/dev/null")
    image_name = stdout.read().decode('utf-8').strip()
    print(f"Current image: {image_name}")

    match = re.search(r':v(\d+)', image_name)
    if match:
        curr_ver = int(match.group(1))
        next_ver = curr_ver + 1
    else:
        print("Could not parse version. Defaulting to v1")
        next_ver = 1

    print(f"Next version: v{next_ver}\n")

    # 1. Pull origin main
    status, _ = run_cmd(ssh, "cd /root/Cadastros-Conexao && git pull origin main")
    if status != 0:
        print("Git pull failed.")
        sys.exit(1)

    # 2. Build docker image
    build_cmd = (
        f"cd /root/Cadastros-Conexao && docker build --no-cache "
        f"-t {IMAGE_NAME}:latest -t {IMAGE_NAME}:v{next_ver} "
        f"--build-arg VITE_SUPABASE_URL={SUPABASE_URL} "
        f"--build-arg VITE_SUPABASE_ANON_KEY={SUPABASE_ANON} ."
    )
    status, _ = run_cmd(ssh, build_cmd)
    if status != 0:
        print("Docker build failed.")
        sys.exit(1)

    # 3. Docker login
    login_cmd = f"docker login -u {DH_USER} -p '{DH_PASS}'"
    status, _ = run_cmd(ssh, login_cmd)
    if status != 0:
        print("Docker login failed.")
        sys.exit(1)

    # 4. Push new version
    push_cmd = f"docker push {IMAGE_NAME}:v{next_ver}"
    status, _ = run_cmd(ssh, push_cmd)
    if status != 0:
        print("Docker push failed.")
        sys.exit(1)

    # 5. Remove old service
    run_cmd(ssh, f"docker service rm {SERVICE_NAME}")

    # 6. Create new service with Traefik labels
    labels = (
        f'--label "com.docker.stack.namespace=cadastros-conexao" '
        f'--label "traefik.enable=true" '
        f'--label "traefik.http.routers.cadastros_conexao.entrypoints=websecure" '
        f"--label 'traefik.http.routers.cadastros_conexao.rule=Host(\\`{DOMAIN}\\`)' "
        f'--label "traefik.http.routers.cadastros_conexao.tls.certresolver=letsencryptresolver" '
        f'--label "traefik.http.routers.cadastros_conexao_http.entrypoints=web" '
        f'--label "traefik.http.routers.cadastros_conexao_http.middlewares=cadastros_redirect" '
        f"--label 'traefik.http.routers.cadastros_conexao_http.rule=Host(\\`{DOMAIN}\\`)' "
        f'--label "traefik.http.services.cadastros_conexao.loadbalancer.server.port=80"'
    )

    create_cmd = (
        f"docker service create --name {SERVICE_NAME} "
        f"--network {NETWORK} {labels} "
        f"--env NODE_ENV=production --env TZ=America/Sao_Paulo "
        f"--restart-condition on-failure --restart-delay 5s "
        f"--replicas 1 {IMAGE_NAME}:v{next_ver}"
    )
    status, _ = run_cmd(ssh, create_cmd)
    if status != 0:
        print("Docker service create failed.")
        sys.exit(1)

    # 7. Health check
    print("\n=== HEALTH CHECK ===")
    time.sleep(12)
    run_cmd(ssh, f"docker service ps {SERVICE_NAME} --format '{{{{.CurrentState}}}}'")
    run_cmd(ssh, f"docker service logs {SERVICE_NAME} --tail 5 2>&1")

    print(f"\nDeploy completed! {DOMAIN} -> {IMAGE_NAME}:v{next_ver}")
    ssh.close()

if __name__ == "__main__":
    main()
