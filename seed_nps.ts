import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as crypto from 'crypto';

const envFile = fs.readFileSync('.env', 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const url = env['VITE_SUPABASE_URL'] || '';
const key = env['VITE_SUPABASE_ANON_KEY'] || '';

const supabase = createClient(url, key);

const vendors = [
  "João Silva",
  "Maria Oliveira",
  "Carlos Souza",
  "Ana Pereira",
  "Lucas Costa",
  "Fernanda Lima",
  "Rafael Santos",
  "Juliana Almeida",
  "Marcos Ribeiro",
  "Patrícia Gomes",
  "Gabriel Ferreira",
  "Mariana Castro"
];

const comments = [
  "Atendimento excelente, superaram minhas expectativas!",
  "Muito bom, mas a entrega atrasou um pouco.",
  "O sistema é fácil de usar e o suporte é incrível.",
  "Preços competitivos, comprarei novamente.",
  "Péssima experiência, o vendedor demorou muito para responder.",
  "Recomendo fortemente para parceiros.",
  "Estou satisfeito com a plataforma.",
  "O produto chegou com defeito e o pós-venda foi devagar.",
  "Sensacional! Melhor ERP que já utilizei.",
  "Tivemos dificuldades na implantação, mas agora flui bem."
];

async function seed() {
  console.log("Buscando empresa no banco...");
  const { data: empresas, error: errEmpresa } = await supabase.from('empresas').select('id').limit(1);
  if (errEmpresa || !empresas || empresas.length === 0) {
     console.error("Erro ao buscar empresa (ou nenhuma encontrada):", errEmpresa);
     process.exit(1);
  }
  const empresaId = empresas[0].id;
  console.log("Iniciando seed de NPS para a empresa:", empresaId);
  
  const records = [];

  for (let i = 0; i < 15; i++) {
    const rand = Math.random();
    let score = 10;
    if (rand < 0.2) score = Math.floor(Math.random() * 7);
    else if (rand < 0.4) score = Math.floor(Math.random() * 2) + 7;
    else score = Math.floor(Math.random() * 2) + 9;

    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    const client = `Cliente Fake ${i + 1} LTDA`;

    records.push({
      id: crypto.randomUUID(),
      empresa_id: empresaId,
      nps_score: score,
      nps_comment: comment,
      vendor_name: vendor,
      client_name: client,
      source: "Link Direto",
      csat: "Satisfeito",
      atendimento_comercial: score >= 8 ? "Ótimo" : "Regular",
      entendimento_consultor: "Sim",
      melhoria_atendimento: "Mais agilidade nas respostas",
      experiencia_compra: "Rápida",
      matrix_facilidade_pedido: Math.floor(Math.random() * 5) + 1,
      matrix_clareza_condicoes: Math.floor(Math.random() * 5) + 1,
      matrix_prazo_entrega: Math.floor(Math.random() * 5) + 1,
      matrix_disponibilidade_produtos: Math.floor(Math.random() * 5) + 1,
      matrix_comunicacao: Math.floor(Math.random() * 5) + 1,
      expansao_produtos: "Nenhum",
      oportunidade: "Preços menores",
      pergunta_final: "O layout",
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }

  const { error } = await supabase.from('nps_respostas').insert(records);

  if (error) {
    console.error("Erro ao inserir:", error);
  } else {
    console.log(`Sucesso! ${records.length} NPS inseridos na tabela nps_respostas.`);
  }
}

seed();
