import paramiko
import time
import sys

VPS_IP = '167.86.69.79'
VPS_USER = 'root'
VPS_PASSWORD = 'conexao2026'
DOCKER_IMAGE = 'hevertonperes/erp-odonto'
PROJECT_DIR = '/root/Cadastros-Conexao'
BUILD_ARGS = {
    'VITE_SUPABASE_URL': 'https://cluuqzhizeqvkgvfdisx.supabase.co',
    'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM',
    'VITE_EMPRESA_ID': '6687e2f0-1ff6-406d-b621-7927764f121a',
    'VITE_EMPRESA_SLUG': 'conexao-implantes',
}

def run_cmd(client, cmd, timeout=60):
    print(f"  > {cmd[:120]}...")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    rc = stdout.channel.recv_exit_status()
    if out:
        for line in out.split('\n')[-5:]:
            print(f"    {line}")
    if err:
        for line in err.split('\n')[-3:]:
            print(f"    [err] {line}")
    return rc, out, err

def run_long_cmd(client, cmd, poll_interval=30, max_wait=600):
    """Run a long command via nohup + log file, poll for completion."""
    log_file = f"/tmp/deploy-log-{int(time.time())}.txt"
    wrapped = f"nohup bash -c '{cmd}' > {log_file} 2>&1 & echo $!"
    print(f"  > {cmd[:100]}...")
    stdin, stdout, stderr = client.exec_command(wrapped, timeout=10)
    pid = stdout.read().decode().strip()
    print(f"  PID: {pid}")
    
    elapsed = 0
    while elapsed < max_wait:
        time.sleep(poll_interval)
        elapsed += poll_interval
        rc, _, _ = run_cmd(client, f"kill -0 {pid} 2>/dev/null && echo RUNNING || echo DONE", timeout=5)
        # Check the output of the echo
        stdin2, stdout2, _ = client.exec_command(f"kill -0 {pid} 2>/dev/null && echo RUNNING || echo DONE", timeout=5)
        status = stdout2.read().decode().strip()
        print(f"  [{elapsed}s] {status}")
        if 'DONE' in status:
            break
    
    # Get result
    stdin3, stdout3, stderr3 = client.exec_command(f"cat {log_file}", timeout=10)
    output = stdout3.read().decode().strip()
    rc_last, _, _ = client.exec_command(f"cat {log_file}.exit 2>/dev/null || echo unknown", timeout=5)
    
    # Check exit code from log
    stdin4, stdout4, _ = client.exec_command(f"tail -1 {log_file} 2>/dev/null", timeout=5)
    
    for line in output.split('\n')[-10:]:
        print(f"    {line}")
    
    return output

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("Conectando na VPS...")
    client.connect(VPS_IP, username=VPS_USER, password=VPS_PASSWORD, timeout=30)
    print("Conectado!\n")

    # Backup
    print("=== Backup imagem atual ===")
    rc, img, _ = run_cmd(client, "docker service inspect erp-odonto_app --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null")
    if rc == 0 and img:
        run_cmd(client, f"echo '{img}' > /tmp/rollback-image.txt")
        print(f"  Rollback: {img}\n")

    # Git pull
    print("=== Git pull ===")
    rc, _, err = run_cmd(client, f"cd {PROJECT_DIR} && git pull origin main", timeout=30)
    if rc != 0:
        print("ERRO no git pull!")
        client.close()
        sys.exit(1)
    print()

    # Version
    print("=== Versão ===")
    rc, last_tag, _ = run_cmd(client, f"cd {PROJECT_DIR} && git describe --tags --abbrev=0 2>/dev/null || echo 'v0'")
    num = int(last_tag.replace('v', '')) + 1 if last_tag.startswith('v') else 32
    version = f"v{num}"
    print(f"  Versão: {version}\n")

    # Docker build (long command)
    print("=== Docker build ===")
    build_args_str = ' '.join(f'--build-arg {k}={v}' for k, v in BUILD_ARGS.items())
    build_cmd = f"cd {PROJECT_DIR} && docker build --no-cache -t {DOCKER_IMAGE}:{version} -t {DOCKER_IMAGE}:latest {build_args_str} . 2>&1 | tail -20; echo EXIT:$?"
    
    log_file = f"/tmp/deploy-build-{int(time.time())}.txt"
    client.exec_command(f"nohup bash -c '{build_cmd}' > {log_file} 2>&1 &", timeout=5)
    
    print("  Aguardando build (pode levar varios minutos)...")
    elapsed = 0
    while elapsed < 900:
        time.sleep(30)
        elapsed += 30
        stdin, stdout, _ = client.exec_command(f"pgrep -f 'docker build' >/dev/null 2>&1 && echo BUILDING || echo DONE", timeout=5)
        status = stdout.read().decode().strip()
        print(f"  [{elapsed}s] {status}")
        if 'DONE' in status:
            break
    
    # Check build result
    stdin, stdout, _ = client.exec_command(f"cat {log_file}", timeout=10)
    build_output = stdout.read().decode().strip()
    for line in build_output.split('\n')[-10:]:
        print(f"    {line}")
    
    if 'error' in build_output.lower() and 'EXIT:0' not in build_output:
        # Check if build actually failed
        stdin, stdout, _ = client.exec_command(f"grep -c 'Successfully tagged' {log_file}", timeout=5)
        tagged = stdout.read().decode().strip()
        if tagged == '0':
            print("\nERRO no docker build!")
            client.close()
            sys.exit(1)
    print()

    # Docker push
    print("=== Docker login ===")
    run_cmd(client, "docker login -u hevertonperes -p '@#Khen741963@#'", timeout=30)
    
    print(f"=== Docker push {version} ===")
    push_log = f"/tmp/deploy-push-{int(time.time())}.txt"
    client.exec_command(f"nohup bash -c 'docker push {DOCKER_IMAGE}:{version} 2>&1 && docker push {DOCKER_IMAGE}:latest 2>&1' > {push_log} 2>&1 &", timeout=5)
    
    print("  Aguardando push...")
    elapsed = 0
    while elapsed < 300:
        time.sleep(15)
        elapsed += 15
        stdin, stdout, _ = client.exec_command(f"pgrep -f 'docker push' >/dev/null 2>&1 && echo PUSHING || echo DONE", timeout=5)
        status = stdout.read().decode().strip()
        print(f"  [{elapsed}s] {status}")
        if 'DONE' in status:
            break
    
    stdin, stdout, _ = client.exec_command(f"tail -5 {push_log}", timeout=5)
    push_out = stdout.read().decode().strip()
    print(f"  {push_out}")
    print()

    # Service update
    print("=== Service update ===")
    rc, _, err = run_cmd(client, f"docker service update --force --image {DOCKER_IMAGE}:{version} erp-odonto_app", timeout=60)
    print()

    # Health check
    print("=== Health check ===")
    print("  Aguardando 20s...")
    time.sleep(20)
    rc, state, _ = run_cmd(client, "docker service ps erp-odonto_app --format '{{.CurrentState}}' | head -1")
    print(f"  Estado: {state}")
    
    rc, logs, _ = run_cmd(client, "docker service logs erp-odonto_app --tail 15 2>&1")
    errors = [l for l in logs.split('\n') if 'error' in l.lower() or 'fatal' in l.lower()]
    if errors:
        print("  Erros detectados:")
        for e in errors[-5:]:
            print(f"    {e}")
    else:
        print("  Nenhum erro nos logs")
    print()

    # Tag local
    print("=== Tag local ===")
    try:
        import subprocess
        subprocess.run(['git', 'tag', '-a', version, '-m', f'Deploy {version}'], check=False)
        subprocess.run(['git', 'push', 'origin', version], check=False)
        print(f"  Tag {version} criada e enviada")
    except:
        print("  Tag local pulada")
    
    client.close()
    print(f"\nDeploy {version} finalizado!")

if __name__ == '__main__':
    main()
