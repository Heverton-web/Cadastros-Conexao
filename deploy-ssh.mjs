import { spawn } from "child_process";

const commands = [
  "cd /root/Cadastros-Conexao && git pull origin main",
  "cd /root/Cadastros-Conexao && docker build --no-cache -t hevertonperes/cadastros-conexao:latest -t hevertonperes/cadastros-conexao:v64 --build-arg VITE_SUPABASE_URL=https://cluuqzhizeqvkgvfdisx.supabase.co --build-arg VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM .",
  "docker push hevertonperes/cadastros-conexao:v64",
  "docker service update --force --image hevertonperes/cadastros-conexao:v64 cadastros-conexao_app",
];

const ssh = spawn("ssh", [
  "-o", "StrictHostKeyChecking=no",
  "-o", "UserKnownHostsFile=/dev/null",
  "root@167.86.69.79",
  commands.join(" && "),
], {
  stdio: ["pipe", "pipe", "pipe"],
});

let output = "";
ssh.stdout.on("data", (d) => {
  output += d.toString();
  process.stdout.write(d);
});
ssh.stderr.on("data", (d) => {
  process.stderr.write(d);
});

// Send password when prompted
setTimeout(() => {
  ssh.stdin.write("conexao2026\n");
}, 2000);

setTimeout(() => {
  ssh.stdin.write("conexao2026\n");
}, 5000);

ssh.on("close", (code) => {
  console.log(`\nProcess exited with code ${code}`);
  process.exit(code);
});

// Timeout after 5 minutes
setTimeout(() => {
  console.log("Timeout - killing process");
  ssh.kill();
  process.exit(1);
}, 300000);
