---
name: docker
description: >-
  Passos operacionais extraidos do livro 'Docker' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Docker — Passos Operacionais

Conteudo extraido do livro 'Docker'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Nenhuma parte deste livro poderá ser reproduzida, nem transmitida, sem    autorização prévia por escrito da editora, sejam quais forem os meios:    fotográficos, eletrônicos, mecânicos, gravação ou quaisquer outros.
- Casa do Código    Livros para o programador    Rua Vergueiro, 3185 - 8º andar    04101-300 – Vila Mariana – São Paulo – SP – Brasil   Casa do Código                               Agradecimentos  Dedico esta obra à minha esposa Mychelle.
- Obrigado por compreender    a minha ausência quando necessário, e pelo apoio em todos os    momentos.
- Também aos meus pais, pelo apoio e por nunca deixarem    de me incentivar.
- Agradeço à Casa do Código por esta oportunidade de produzir mais    um trabalho.
- Especialmente ao Paulo Silveira e Adriano Almeida,    pelos ensinamentos e opiniões de muito valor sobre o conteúdo e    organização do livro.
- Agradecimentos especiais aos amigos Diego Plentz, Samuel Flores    e Ricardo Henrique, por me ajudarem durante as intermináveis    revisões.
- Por fim, agradeço a Deus por mais esta oportunidade.                                                       i   Casa do Código                               Prefácio  In March 2013, during PyCon US in Santa Clara, we did the first public demo    of Docker.
- We had no idea that we were about to start the container revolution.
- What is this so-called container revolution?

## 2. Principios e Tecnicas
- Is it really a revolution, or is    it being blown out of proportion?
- After all, containers have been around for    a very long time; why are we only now talking about a revolution?
- I would like to answer those questions with a short story.
- More than ten    years ago, I discovered a project called Xen.
- In fact, if you have used Amazon EC2, you have almost certainly used it.
- It lets you run multiple virtual machines on a single    physical machines.
- In 2004, Xen had a lot of limitations: it ran only on Linux,    and it required custom kernels.
- Xen could do something amazing: it was able to do “live migration,”    meaning that you could move a running virtual machine to another physical    computer without stopping (or even rebooting) that virtual machine.
- I thought that this was very impressive.
- More importantly, Xen virtual    machines could start in a few seconds, and their performance was very good.

## 3. Aplicacoes Praticas
- It was hard to tell the difference between a physical machine and a virtual    machine.
- Those virtual machines were almost as good as the real ones, but    they were much easier to install, to move around, to debug and they were    cheaper, because we could put many virtual machines on a single server.
- This convinced me that virtual machines could be the basis for better,    cheaper hosting, and I started my own company to sell VM-based servers.
- The technology was good, but many people were skeptical, and still    wanted real servers.
- Keep in mind that this was a few years before Amazon    Web Services launched EC2.       iii   Casa do Código          Ten years later, the sentiment has changed.
- Of course, there are still    applications that cannot run in “the cloud” for various reasons; but the majority of    new deployments now involve IAAS or PAAS at some point.
- What is the reason for that change?
- Is it this quasi-magical live migration    feature?
- Is it because virtual machines are cheaper than physical ones?
- The real reason is automation.

## 4. Topicos Avancados
- We can now write programs and scripts to    create servers, deploy our applications on them, and easily scale them up or    down.
- In our repositories, we have “infrastructure as code” files, describing    complex architectures composed of tens, hundreds, thousands of servers; and    when we change those files, machines are provisioned and destroyed    accordingly.
- This is the revolution that was made possible by virtualization.
- With containers, we will see a similar revolution.
- Many things that used to    be impossible or impractical are becoming not only possible, but easy.
- Continuous testing and integration; immutable infrastructure; blue/green and    canary deployments; golden images...
- All those techniques (and more) are    now available to the majority of developers, instead of being the luxury or    privilege of bigger and modern organizations like Amazon, Google, or    Netflix.
- Today, when I hear someone say “containers won’t work for us,” I hear    the same voice that said “virtual machines won’t work for us” ten years ago.
- I’m not asking that you embrace containers for every use    and purpose.
- But in this book, you will see many ways in which Docker and    containers can improve application development and deployment.

