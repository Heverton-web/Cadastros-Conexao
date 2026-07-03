import paramiko
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

VPS_IP = "167.86.69.79"
VPS_USER = "root"
VPS_PASSWORD = "conexao2026"
DOCKER_USERNAME = "hevertonperes"
DOCKER_PASSWORD = "@#Khen741963@#"

SUPABASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD)
print("SSH connected")

def run(cmd, timeout=300):
    print(f"$ {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out:
        print(out)
    if err:
        print(f"STDERR: {err}")
    if exit_status != 0:
        raise Exception(f"Command failed with exit {exit_status}")
    return out, err

# Get current version from running service
out, _ = run("docker service inspect cadastros-conexao_app --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'")
current = out.split(":v")[-1] if ":v" in out else "0"
try:
    current_num = int(current)
except:
    current_num = 0
new_ver = current_num + 1
print(f"Current version: v{current_num}, new version: v{new_ver}")

# Login docker
run(f"docker login -u {DOCKER_USERNAME} -p {DOCKER_PASSWORD}", timeout=30)

# Git pull
run("cd /root/Cadastros-Conexao && git pull origin main", timeout=60)

# Docker build
tag_latest = f"{DOCKER_USERNAME}/cadastros-conexao:latest"
tag_ver = f"{DOCKER_USERNAME}/cadastros-conexao:v{new_ver}"
cmd_build = (
    f"cd /root/Cadastros-Conexao && docker build --no-cache "
    f"-t {tag_latest} -t {tag_ver} "
    f"--build-arg VITE_SUPABASE_URL={SUPABASE_URL} "
    f"--build-arg VITE_SUPABASE_ANON_KEY={SUPABASE_ANON_KEY} ."
)
run(cmd_build, timeout=600)

# Docker push
run(f"docker push {tag_ver}", timeout=300)

# Service update
run(f"docker service update --force --image {tag_ver} cadastros-conexao_app", timeout=120)

print(f"\nDeploy concluido! v{new_ver} rodando.")
client.close()
