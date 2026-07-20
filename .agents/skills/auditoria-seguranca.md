---
name: auditoria-seguranca
description: Faz uma auditoria de segurança de um código, aplicação ou site e gera um relatório dos riscos encontrados, classificados por gravidade, com a correção recomendada para cada um. Só diagnostica: nunca altera nada, e o usuário decide o que corrigir. Use sempre que o usuário pedir para revisar a segurança, procurar vulnerabilidades, checar se um projeto está seguro para ir para produção, ou mencionar segurança, brechas, falhas, dados expostos, senha ou chave no código, OWASP, ou "isso aqui tá seguro?", mesmo que não diga a palavra "auditoria".
allowed-tools: Read, Grep, Glob
---

# Auditoria de Segurança

Inspeciona um projeto e entrega um relatório dos riscos de segurança, do mais grave ao menos grave, com a correção recomendada de cada um. Quem decide o que corrigir é o usuário.

## Princípio: diagnosticar, nunca alterar

Esta skill **só inspeciona e relata**. Não edita código, não aplica correção e não roda nada que altere o sistema. Isso não é só uma regra de comportamento: a skill roda com ferramentas apenas de leitura (`Read`, `Grep`, `Glob`), então ela é tecnicamente incapaz de mudar qualquer coisa. O motivo é importante: o usuário precisa manter o controle e decidir o que priorizar, e uma "correção automática" poderia quebrar a aplicação ou mudar um comportamento que ele não aprovou.

Ela também é **estritamente defensiva**: identifica a fraqueza e como corrigi-la, mas nunca escreve código de exploração, nunca tenta explorar de fato, e só audita o que é do próprio usuário ou que ele tem autorização para revisar.

## Fluxo

1. **Entenda o alvo.** É um repositório/código, uma aplicação ou um site? Qual a stack (linguagem, framework, banco)? Detecte isso primeiro (leia `package.json`, arquivos de config, a estrutura de pastas). O que não se aplicar ao caso, registre como "não avaliado" em vez de inventar achado.
2. **Leia `references/CHECKLIST.md`**, que tem a lista completa de verificações (alinhada ao OWASP Top 10:2025) e o que procurar em cada uma. Use ela como guia da auditoria.
3. **Audite** olhando código, configuração, dependências e cabeçalhos, item por item da checklist.
4. **Para cada achado**, levante: onde está, qual o problema, por que importa, a correção recomendada (descrita, não aplicada) e o esforço.
5. **Apresente o relatório** na conversa, no template abaixo, do mais grave ao menos grave.
6. **Pare.** Mostre o resumo e o plano priorizado e pergunte o que o usuário quer atacar primeiro. Não corrija nada por conta própria.

## O que auditar (resumo)

A `references/CHECKLIST.md` detalha cada ponto. Em resumo, cobre: segredos e credenciais no código; injeção (SQL, NoSQL, comando, XSS, path traversal); controle de acesso e autorização (IDOR, rotas sem permissão, SSRF); autenticação e sessão; falhas de criptografia (senha sem hash forte, HTTPS, segredo fraco); configuração insegura (cabeçalhos, CORS, modo debug, erros verbosos); dependências vulneráveis e cadeia de suprimentos; integridade de dados e deserialização; logs com dado sensível; tratamento de exceções; CSRF; upload de arquivo; e limite de abuso (rate limiting).

## Como classificar a gravidade

Classifique por probabilidade de exploração vezes impacto, não pelo nome que "assusta" mais:

- 🔴 **Crítico** — fácil de explorar e impacto alto (segredo exposto, injeção, IDOR em dado sensível). Ataca primeiro.
- 🟠 **Alto** — risco real, mas exige alguma condição ou esforço do atacante.
- 🟡 **Médio** — risco em cenário específico, ou defesa em profundidade que está faltando.
- ⚪ **Baixo** — endurecimento e boa prática, sem risco imediato.

Na dúvida sobre um achado, marque como "verificar" em vez de afirmar que é uma falha.

## Formato do relatório

Use sempre este template, apresentado na conversa:

```
# Relatório de Segurança · [nome do projeto]
stack: [detectada] · escopo: [o que foi auditado]

## Resumo
- Nota geral: [A a F] · [uma frase sobre o estado de segurança]
- Encontrados: [X críticos] · [Y altos] · [Z médios] · [W baixos]

## Achados (do mais grave para o menos grave)

### 🔴 [Gravidade] Título curto do problema
- Onde: [arquivo:linha / rota / configuração]
- O problema: [o que está errado, em uma frase]
- Por que importa: [o que um atacante consegue fazer com isso]
- Como corrigir: [o caminho para resolver, descrito, não aplicado]
- Esforço: [baixo / médio / alto]

(repita para cada achado)

## Plano sugerido (você escolhe)
- Atacar agora: [os críticos]
- Em seguida: [os altos]
- Quando der: [médios e baixos]

## Não avaliado
[o que ficou fora de escopo ou não se aplica a este projeto]

_Auditoria · Hora de Codar_
```

Ao terminar, diga ao usuário: "Me fala qual item você quer atacar primeiro e a gente corrige um de cada vez. Não vou mexer em nada sem você escolher."

## Exemplo de achado

### 🔴 [Crítico] Chave de API exposta no código
- Onde: `src/config.js:12` (`const STRIPE_KEY = "sk_live_..."`)
- O problema: uma chave secreta de produção está escrita direto no código-fonte.
- Por que importa: qualquer pessoa com acesso ao repositório, ou ao bundle do front no navegador, usa a chave para fazer cobranças em seu nome. É exatamente o que bots que varrem o GitHub procuram.
- Como corrigir: mover a chave para variável de ambiente, remover do histórico do Git e rotacionar a chave no painel do Stripe (a antiga já deve ser tratada como comprometida).
- Esforço: baixo.

## Limites (o que esta skill nunca faz)

- Não corrige, não refatora e não roda comando que altere o sistema.
- Não escreve código de exploração nem tenta explorar de verdade. É defensiva: aponta o risco e o conserto.
- Só audita o que é do usuário ou que ele tem autorização para revisar.
- Termina sempre no relatório, devolvendo a decisão para o usuário.
