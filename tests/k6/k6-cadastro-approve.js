import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate } from "k6/metrics";

const BASE_URL = "https://cluuqzhizeqvkgvfdisx.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM";

const errorRate = new Rate("approve_errors");

const CADASTRO_EMAIL = "cadastro@conexao.com.br";
const CADASTRO_PASS = "Conexao@2026";

export const options = {
  stages: [
    { duration: "10s", target: 15 },
    { duration: "20s", target: 30 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    approve_errors: ["rate<0.05"],
    http_req_duration: ["p(95)<3000"],
  },
};

function login() {
  const res = http.post(
    `${BASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email: CADASTRO_EMAIL, password: CADASTRO_PASS }),
    { headers: { "Content-Type": "application/json", apikey: ANON_KEY } },
  );
  return res.status === 200 ? res.json("access_token") : null;
}

export default function () {
  const token = login();
  if (!token) return;
  const h = {
    apikey: ANON_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  group("Buscar cadastro em analise", () => {
    const res = http.get(
      `${BASE_URL}/rest/v1/cadastros?status=eq.em_analise&select=id,created_by,lead_nome,colaborador,codigo_cliente&limit=5`,
      { headers: h },
    );
    check(res, { "busca pendentes ok": (r) => r.status === 200 });
  });

  group("Listar atividades do cadastro", () => {
    const res = http.get(
      `${BASE_URL}/rest/v1/atividades?select=id,tipo,descricao,created_at&order=created_at.desc&limit=20`,
      { headers: h },
    );
    check(res, { "atividades ok": (r) => r.status === 200 });
  });

  group("Listar templates notificacao ativos", () => {
    const res = http.get(
      `${BASE_URL}/rest/v1/notificacoes_templates?select=*&ativo=eq.true`,
      { headers: h },
    );
    check(res, { "templates ok": (r) => r.status === 200 });
  });

  sleep(1);
}
