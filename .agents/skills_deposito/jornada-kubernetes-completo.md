---
name: epub-jornada-kubernetes-da-teoria-pr-tica-com-gito
description: >-
  Passos operacionais extraidos do livro 'EPUB_Jornada_Kubernetes__Da_teoria_à_prática_com_GitOps_e_casos_reais' (PT) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# EPUB_Jornada_Kubernetes__Da_teoria_à_prática_com_GitOps_e_casos_reais — Passos Operacionais

Skill baseada no livro "EPUB_Jornada_Kubernetes__Da_teoria_à_prática_com_GitOps_e_casos_reais" (PT). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: DevOps, Docker, Kubernetes, infraestrutura, cloud, CI/CD.

---

## Praticas e Procedimentos


> Nossa missão é ajudar os nossos clientes a multiplicarem resultados, respeitando o contexto de cada empresa e valorizando o repertório das suas equipes.


> Consulte nosso site para entender como podemos multiplicar também os seus resultados:


> Antonio Muniz tem vivência em consultoria, mentoria executiva, aulas em graduação e MBA, edição de livros e palestras em empresas líderes de mercado. Como sócio-fundador da Advisor IT Services, lidera projetos de agilidade para negócios, DevOps e qualidade de software. Na editora Brasport, atua como presidente do conselho para garantir a excelência dos livros selecionados.


> Como fundador da Jornada Colaborativa, mobilizou milhares de autores e formou novas lideranças para lançar mais de 50 livros com doação que ultrapassa R$ 500 mil com royalties e eventos com empresas apoiadoras. Os royalties deste livro também serão doados pela Jornada Colaborativa.


> Trabalha na área de TI há mais de 14 anos, tendo passagem por grandes empresas como IBM, Dell, Sicredi, Edenred e XP, onde atuou em grandes projetos de infraestrutura, computação em nuvem e operações de TI.


> Apaixonado por tecnologia e compartilhamento de conhecimentos, já organizou e palestrou em eventos da TI, escreve sobre os temas em que atua e compartilha conhecimento em redes sociais, sendo reconhecido como _Cloud Computing Top Voice_ no LinkedIn no ano de 2024.


> Lidera iniciativas de modernização, automação e observabilidade, implementando práticas de alta disponibilidade, segurança e escalabilidade em ambientes corporativos. À frente da F2S Consultoria, participa de projetos de diferentes segmentos, oferecendo soluções técnicas de alto impacto.


> Apaixonado por tecnologia e pela comunidade, já atuou como palestrante, coordenador de eventos e coautor de livros técnicos, contribuindo para a disseminação de conhecimento em _cloud_ , SRE e práticas _cloud-native_.

1. [Capítulo 1](src/pages/page_001.html)
1. [Capítulo 2](src/pages/page_002.html)
1. [Capítulo 3](src/pages/page_003.html)
1. [Capítulo 4](src/pages/page_004.html)
1. [Capítulo 5](src/pages/page_005.html)
1. [Capítulo 6](src/pages/page_006.html)
1. [Capítulo 7](src/pages/page_007.html)
1. [Capítulo 8](src/pages/page_008.html)
1. [Capítulo 9](src/pages/page_009.html)
1. [Capítulo 10](src/pages/page_010.html)
1. [Capítulo 11](src/pages/page_011.html)
1. [Capítulo 12](src/pages/page_012.html)
1. [Capítulo 13](src/pages/page_013.html)
1. [Capítulo 14](src/pages/page_014.html)
1. [Capítulo 15](src/pages/page_015.html)

## Procedimentos

1. [Capítulo 1](src/pages/page_001.html)
1. [Capítulo 2](src/pages/page_002.html)
1. [Capítulo 3](src/pages/page_003.html)
1. [Capítulo 4](src/pages/page_004.html)
1. [Capítulo 5](src/pages/page_005.html)
1. [Capítulo 6](src/pages/page_006.html)
1. [Capítulo 7](src/pages/page_007.html)
1. [Capítulo 8](src/pages/page_008.html)
1. [Capítulo 9](src/pages/page_009.html)
1. [Capítulo 10](src/pages/page_010.html)
1. [Capítulo 11](src/pages/page_011.html)
1. [Capítulo 12](src/pages/page_012.html)
1. [Capítulo 13](src/pages/page_013.html)
1. [Capítulo 14](src/pages/page_014.html)
1. [Capítulo 15](src/pages/page_015.html)
1. [Capítulo 16](src/pages/page_016.html)
1. [Capítulo 17](src/pages/page_017.html)
1. [Capítulo 18](src/pages/page_018.html)
1. [Capítulo 19](src/pages/page_019.html)
1. [Capítulo 20](src/pages/page_020.html)


## Praticas Essenciais Kubernetes
1. Use Deployments para workloads stateless, StatefulSets para stateful.
2. Defina resource requests e limits em todos os containers.
3. Use liveness probes (`httpGet`, `tcpSocket`) para reinicializacao automatica.
4. Use readiness probes para garantir que apenas pods saudaveis recebam trafego.
5. Prefira ConfigMaps e Secrets para configuracao, nao variaveis hardcoded.
6. Use namespaces para isolar ambientes (dev, staging, prod).
7. Aplique NetworkPolicies para segmentacao de trafego.
8. Use RBAC para controle de acesso ao cluster.
9. Configure HPA (Horizontal Pod Autoscaler) para escalabilidade automatica.
10. Use `kubectl apply --server-side` para gerenciamento declarativo.
