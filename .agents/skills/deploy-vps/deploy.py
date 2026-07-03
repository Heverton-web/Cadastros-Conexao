import paramiko
import re
import sys

VPS_IP = "167.86.69.79"
VPS_USER = "root"
VPS_PASSWORD = "conexao2026"
DH_USER = "hevertonperes"
DH_PASS = "@#Khen741963@#"

SUPABASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co"
SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM"

def run_cmd(ssh, cmd):
    print(f"\n>>> Executing: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    # Real-time stdout stream
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line, end="")
        sys.stdout.flush()
        
    err = stderr.read().decode('utf-8')
    if err:
        print(f"Stderr: {err}", file=sys.stderr)
        
    exit_status = stdout.channel.recv_exit_status()
    print(f"Exit status: {exit_status}")
    return exit_status, err

def main():
    print("Connecting to VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD)
    print("Connected.")

    # Get current image tag
    stdin, stdout, stderr = ssh.exec_command("docker service inspect cadastros-conexao_app --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'")
    image_name = stdout.read().decode('utf-8').strip()
    print(f"Current image: {image_name}")

    # Parse version (e.g. hevertonperes/cadastros-conexao:v12@sha256:... or just hevertonperes/cadastros-conexao:v12)
    match = re.search(r':v(\d+)', image_name)
    if match:
        curr_ver = int(match.group(1))
        next_ver = curr_ver + 1
    else:
        print("Could not parse version from image name. Defaulting to v1")
        next_ver = 1

    print(f"Next version: v{next_ver}")

    # 1. Pull origin main
    status, _ = run_cmd(ssh, "cd /root/Cadastros-Conexao && git pull origin main")
    if status != 0:
        print("Git pull failed.")
        sys.exit(1)

    # 2. Build docker image
    build_cmd = f"cd /root/Cadastros-Conexao && docker build --no-cache -t hevertonperes/cadastros-conexao:latest -t hevertonperes/cadastros-conexao:v{next_ver} --build-arg VITE_SUPABASE_URL={SUPABASE_URL} --build-arg VITE_SUPABASE_ANON_KEY={SUPABASE_ANON} ."
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
    push_cmd = f"docker push hevertonperes/cadastros-conexao:v{next_ver}"
    status, _ = run_cmd(ssh, push_cmd)
    if status != 0:
        print("Docker push failed.")
        sys.exit(1)

    # 5. Service update
    update_cmd = f"docker service update --force --image hevertonperes/cadastros-conexao:v{next_ver} cadastros-conexao_app"
    status, _ = run_cmd(ssh, update_cmd)
    if status != 0:
        print("Docker service update failed.")
        sys.exit(1)

    print("\nDeploy completed successfully!")
    ssh.close()

if __name__ == "__main__":
    main()
