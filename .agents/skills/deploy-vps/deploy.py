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
EMPRESA_ID = "6687e2f0-1ff6-406d-b621-7927764f121a"
EMPRESA_SLUG = "conexao-implantes"

IMAGE_NAME = "hevertonperes/erp-odonto"
SERVICE_NAME = "erp-odonto_app"
DOMAIN = "erp.vpsconexao.org"
NETWORK = "network_conexao"

def run_cmd(ssh, cmd, timeout=300):
    print(f"\n>>> {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if out:
        print(out, flush=True)
    if err:
        print(f"ERR: {err}", flush=True)
    status = stdout.channel.recv_exit_status()
    print(f"Status: {status}", flush=True)
    return status, err

def main():
    print("Connecting to VPS...", flush=True)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD)
    print("Connected.\n", flush=True)

    # Get current image tag
    stdin, stdout, stderr = ssh.exec_command(
        f"docker service inspect {SERVICE_NAME} --format '{{{{.Spec.TaskTemplate.ContainerSpec.Image}}}}' 2>/dev/null"
    )
    image_name = stdout.read().decode("utf-8").strip()
    print(f"Current image: {image_name}", flush=True)

    match = re.search(r":v(\d+)", image_name)
    if match:
        curr_ver = int(match.group(1))
        next_ver = curr_ver + 1
    else:
        print("Could not parse version. Defaulting to v1", flush=True)
        next_ver = 1

    print(f"Next version: v{next_ver}\n", flush=True)

    # 1. Backup current image
    run_cmd(ssh, f'echo "{image_name}" > /tmp/rollback-info.txt')

    # 2. Pull origin main
    status, _ = run_cmd(ssh, "cd /root/Cadastros-Conexao && git pull origin main")
    if status != 0:
        print("Git pull failed.", flush=True)
        sys.exit(1)

    # 3. Build docker image
    build_cmd = (
        f"cd /root/Cadastros-Conexao && docker build --no-cache "
        f"-t {IMAGE_NAME}:latest -t {IMAGE_NAME}:v{next_ver} "
        f"--build-arg VITE_SUPABASE_URL={SUPABASE_URL} "
        f"--build-arg VITE_SUPABASE_ANON_KEY={SUPABASE_ANON} "
        f"--build-arg VITE_EMPRESA_ID={EMPRESA_ID} "
        f"--build-arg VITE_EMPRESA_SLUG={EMPRESA_SLUG} ."
    )
    status, _ = run_cmd(ssh, build_cmd, timeout=600)
    if status != 0:
        print("Docker build failed.", flush=True)
        sys.exit(1)

    # 4. Docker login
    login_cmd = f"docker login -u {DH_USER} -p '{DH_PASS}'"
    status, _ = run_cmd(ssh, login_cmd)
    if status != 0:
        print("Docker login failed.", flush=True)
        sys.exit(1)

    # 5. Push new version
    push_cmd = f"docker push {IMAGE_NAME}:v{next_ver}"
    status, _ = run_cmd(ssh, push_cmd)
    if status != 0:
        print("Docker push failed.", flush=True)
        sys.exit(1)

    # 6. Remove old service
    run_cmd(ssh, f"docker service rm {SERVICE_NAME}")

    # 7. Create new service via Python script on VPS (avoids shell backtick issues)
    BACKTICK = chr(96)
    deploy_script = f'''import subprocess

BACKTICK = chr(96)
labels = [
    "traefik.enable=true",
    "traefik.http.routers.cadastros_conexao.entrypoints=websecure",
    f"traefik.http.routers.cadastros_conexao.rule=Host({BACKTICK}{DOMAIN}{BACKTICK})",
    "traefik.http.routers.cadastros_conexao.tls.certresolver=letsencryptresolver",
    "traefik.http.routers.cadastros_conexao_http.entrypoints=web",
    "traefik.http.routers.cadastros_conexao_http.middlewares=cadastros_redirect",
    f"traefik.http.routers.cadastros_conexao_http.rule=Host({BACKTICK}{DOMAIN}{BACKTICK})",
    "traefik.http.services.cadastros_conexao.loadbalancer.server.port=80",
]

cmd = [
    "docker", "service", "create",
    "--name", "{SERVICE_NAME}",
    "--network", "{NETWORK}",
]
for l in labels:
    cmd.extend(["--container-label", l])
cmd.extend([
    "--env", "NODE_ENV=production",
    "--env", "TZ=America/Sao_Paulo",
    "--restart-condition", "on-failure",
    "--restart-delay", "5s",
    "--replicas", "1",
    "{IMAGE_NAME}:v{next_ver}",
])

print("Running:", " ".join(cmd))
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
print("Exit:", result.returncode)
exit(result.returncode)
'''

    # Write deploy script to VPS via SFTP
    sftp = ssh.open_sftp()
    with sftp.open("/tmp/deploy_service.py", "w") as f:
        f.write(deploy_script)
    sftp.close()

    status, _ = run_cmd(ssh, "python3 /tmp/deploy_service.py", timeout=120)
    if status != 0:
        print("Docker service create failed.", flush=True)
        sys.exit(1)

    # 8. Health check
    print("\n=== HEALTH CHECK ===", flush=True)
    time.sleep(15)
    run_cmd(ssh, f"docker service ps {SERVICE_NAME} --format '{{{{.CurrentState}}}}'")
    run_cmd(ssh, f"docker service logs {SERVICE_NAME} --tail 5 2>&1")

    # 9. Verify labels
    run_cmd(ssh, f'docker service inspect {SERVICE_NAME} --format "{{{{json .Spec.TaskTemplate.ContainerSpec.Labels}}}}"')

    print(f"\nDeploy completed! https://{DOMAIN} -> {IMAGE_NAME}:v{next_ver}", flush=True)
    ssh.close()

if __name__ == "__main__":
    main()
