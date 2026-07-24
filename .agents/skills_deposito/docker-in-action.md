---
name: docker-in-action-second-edition-jeff-nickoloff-ste
description: >-
  Passos operacionais extraidos do livro 'Docker in Action, Second Edition - Jeff Nickoloff, Stephen Kuenzli' (EN) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# Docker In Action — Passos Operacionais

Conteudo extraido do livro 'Docker In Action'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- The publisher offers discounts on this book when ordered in quantity.
- For more information, please contact                       Special Sales Department            Manning Publications Co.            20 Baldwin Road            PO Box 761            Shelter Island, NY 11964            Email:  _orders@manning.com_  ©2019 by Manning Publications Co.
- No part of this publication may be reproduced, stored in a retrieval system, or transmitted, in any form or by means electronic, mechanical, photocopying, or otherwise, without prior written permission of the publisher.
- Many of the designations used by manufacturers and sellers to distinguish their products are claimed as trademarks.
- Where those designations appear in the book, and Manning Publications was aware of a trademark claim, the designations have been printed in initial caps or all caps.
- Recognizing the importance of preserving what has been written, it is Manning’s policy to have the books we publish printed on acid-free paper, and we exert our best efforts to that end.
- Welcome to Docker](kindle_split_012.xhtml#ch01)   >  >  > [1\.
- Process isolation and environment-independent computing](kindle_split_013.xhtml#part01)   >  > >> [Chapter 2.
- Running software in containers](kindle_split_014.xhtml#ch02)   >  >>  >> [Chapter 3.
- Software installation simplified](kindle_split_015.xhtml#ch03)   >  >>  >> [Chapter 4.


  - When you join a Docker Engine to a Swarm cluster, you specify whether that machine should be a manager or a worker. Managers listen for instructions to create, change, or remove definitions for entities such as Docker services, configuration, and secrets. Managers instruct worker nodes to create containers and volumes that implement Docker service instances. Managers continuously converge the cluster to the state you have declared it should be in. The control plane connecting the cluster’s Docker Engines depicts the communication of the desired cluster state and events related to realizing that state. Clients of a Docker service may send requests to any node of the cluster on the port published for that service. Swarm’s network mesh will route the request from whichever node received the request to a healthy service container that can handle it. Swarm deploys and manages lightweight, dedicated load-balancer and network routing components to receive and transport network traffic for each published port. Section 13.3.1 explains the Swarm network mesh in detail. Let’s deploy a cluster to work through the examples in this chapter.

  - When a user namespace is enabled for a container, the container’s UIDs are mapped to a range of unprivileged UIDs on the host. Operators activate user namespace remapping by defining `subuid` and `subgid` maps for the host in Linux and configuring the Docker daemon’s `userns-remap` option. The mappings determine how user IDs on the host correspond to user IDs in a container namespace. For example, UID remapping could be configured to map container UIDs to the host starting with host UID 5000 and a range of 1000 UIDs. The result is that UID 0 in containers would be mapped to host UID 5000, container UID 1 to host UID 5001, and so on for 1000 UIDs. Since UID 5000 is an unprivileged user from Linux’ perspective and doesn’t have permissions to modify the host system files, the risk of running with `uid=0` in the container is greatly reduced. Even if a containerized process gets ahold of a file or other resource from the host, the containerized process will be running as a remapped UID without privileges to do anything with that resource unless an operator specifically gave it permissions to do so.

  - The first question is often difficult to answer. It’s not common to see minimum requirements published with open source software these days. Even if it were, though, you’d have to understand how the memory requirements of the software scale based on the size of the data you’re asking it to handle. For better or worse, people tend to overestimate and adjust based on trial and error. One option is to run the software in a container with real workloads and use the `docker stats` command to see how much memory the container uses in practice. For the `mariadb` container we just started, `docker stats ch6_mariadb` shows that the container is using about 100 megabytes of memory, fitting well inside its 256-megabyte limit. In the case of memory-sensitive tools like databases, skilled professionals such as database administrators can make better-educated estimates and recommendations. Even then, the question is often answered by another: how much memory do you have? And that leads to the second question.

  - The best way to be confident in your runtime configuration is to pull images from trusted sources or build your own. As with any standard Linux distribution, it’s possible to do malicious things such as turning a default nonroot user into the root user by using an `suid`-enabled program or opening up access to the root account without authentication. The threat of the `suid` example can be mitigated by using the custom container security options described in section 6.6, specifically the `--security-opt no-new-privileges` option. However, that’s late in the delivery process to address that problem. Like a full Linux host, images should be analyzed and secured using the principle of least privilege. Fortunately, Docker images can be purpose-built to support the application that needs to be run with everything else left out. [Chapters 7](kindle_split_020.xhtml#ch07), [8](kindle_split_021.xhtml#ch08), and [10](kindle_split_023.xhtml#ch10) cover how to create minimal application images.

  - Without Docker or virtual machines, portability is commonly achieved at an individual program level by basing the software on a common tool. For example, Java lets programmers write a single program that will mostly work on several operating systems because the programs rely on a program called a _Java Virtual Machine_ (_JVM_). Although this is an adequate approach while writing software, other people, at other companies, wrote most of the software we use. For example, if we want to use a popular web server that was not written in Java or another similarly portable language, we doubt that the authors would take time to rewrite it for us. In addition to this shortcoming, language interpreters and software libraries are the very things that create dependency problems. Docker improves the portability of every program regardless of the language it was written in, the operating system it was designed for, or the state of the environment where it’s running.

  - The next biggest change is that Docker runs everywhere today. Docker for Desktop is well integrated for use on Apple and Microsoft operating systems. It hides the underlying virtual machine from users. For the most part, this is a success; on macOS, the experience is nearly seamless. On Windows, things seem to go well at least for a few moments. Windows users will deal with an intimidating number of configuration variations from corporate firewalls, aggressive antivirus configuration, shell preferences, and several layers of indirection. That variation makes delivering written content for Windows impossible. Any attempt to do so would age out before the material went to production. For that reason, we’ve again limited the included syntax and system-specific material to Linux and macOS. A reader just might find that all the examples actually run in their environment, but we can’t promise that they will or reasonably help guide troubleshooting efforts.
## 2. Principios e Tecnicas
- Working with storage and volumes](kindle_split_016.xhtml#ch04)   >  >>  >> [Chapter 5.
- Single-host networking](kindle_split_017.xhtml#ch05)   >  >>  >> [Chapter 6.
- Limiting risk with resource controls](kindle_split_018.xhtml#ch06)   >  >  > [2\.
- Packaging software for distribution](kindle_split_019.xhtml#part02)   >  > >> [Chapter 7.
- Packaging software in images](kindle_split_020.xhtml#ch07)   >  >>  >> [Chapter 8.
- Building images automatically with Dockerfiles](kindle_split_021.xhtml#ch08)   >  >>  >> [Chapter 9.
- Public and private software distribution](kindle_split_022.xhtml#ch09)   >  >>  >> [Chapter 10.
- Image pipelines](kindle_split_023.xhtml#ch10)   >  >  > [3\.
- Higher-level abstractions and orchestration](kindle_split_024.xhtml#part03)   >  > >> [Chapter 11.
- Services with Docker and Compose](kindle_split_025.xhtml#ch11)   >  >>  >> [Chapter 12.


  - Swarm clusters can be deployed in many topologies. Each cluster has at least one manager to safeguard cluster state and orchestrate services across workers. Swarm managers require a majority of the managers to be available in order to coordinate and record a change to the cluster. Most production Swarm deployments should have three or five nodes in the manager role. Increasing the number of managers will improve availability of the Swarm control plane, but will also increase the time it takes for managers to acknowledge a change to the cluster. See the Swarm Admin Guide for a detailed explanation of the trade-offs (<https://docs.docker.com/engine/swarm/admin_guide/>). Swarm clusters can scale reliably to hundreds of worker nodes. The community has demonstrated tests of a single Swarm with thousands of worker nodes (see the Swarm3K project at <https://dzone.com/articles/docker-swarm-lessons-from-swarm3k>).

  - Today Docker container networks do not provide any access control or firewall mechanisms between containers. Docker networking was designed to follow the namespace model that is in use in so many other places in Docker. The namespace model solves resource access-control problems by transforming them into addressability problems. The thinking is that software that’s in two containers in the same container network should be able to communicate. In practice, this is far from the truth, and nothing short of application-level authentication and authorization can protect containers from each other on the same network. Remember, different applications carry different vulnerabilities and might be running in containers on different hosts with different security postures. A compromised application does not need to escalate privileges before it opens network connections. The firewall will not protect you.

  - When you run `docker stack deploy`, Docker reads the application’s environment-specific configuration file and stores it as a config resource inside the Swarm cluster. Then when the `api` service starts, Swarm creates a copy of those files on a temporary, read-only filesystem. Even if you set the file mode as writable (for example, `rw-rw-rw-`), it will be ignored. Docker mounts these files at the target location specified in the config. The config file’s target location can be pretty much anywhere, even inside a directory that contains regular files from the application image. For example, the `greetings` service’s common config files (`COPY`’d into app image) and environment-specific config file (a Docker config resource) are both available in the /config directory. The application container can read these files when it starts up, and those files are available for the life of the container.

  - One popular tool for verifying the construction of a Docker image is the Container Structure Test tool (CST) from Google (<https://github.com/GoogleContainerTools/container-structure-test>). With this tool, authors can verify that an image (or image tarball) contains files with desired file permissions and ownership, commands execute with expected output, and the image contains particular metadata such as a label or command. Many of these inspections could be done by a traditional system configuration inspection tool such as Chef Inspec or Serverspec. However, CST’s approach is more appropriate for containers, as the tool operates on arbitrary images without requiring any tooling or libraries to be included inside the image. Let’s verify that the application artifact has the proper permissions and that the proper version of Java is installed by executing CST with the following configuration:
## 3. Aplicacoes Praticas
- First-class configuration abstractions](kindle_split_026.xhtml#ch12)   >  >>  >> [Chapter 13.
- Welcome to Docker](kindle_split_012.xhtml#ch01)   >  > >> [1.1.
- What is Docker?](kindle_split_012.xhtml#ch01lev1sec1)   >  >> >>> [1.1.1. “Hello, World”](kindle_split_012.xhtml#ch01lev2sec1)   >  >>>  >>> [1.1.2.
- Containers](kindle_split_012.xhtml#ch01lev2sec2)   >  >>>  >>> [1.1.3.
- Containers are not virtualization](kindle_split_012.xhtml#ch01lev2sec3)   >  >>>  >>> [1.1.4.
- Running software in containers for isolation](kindle_split_012.xhtml#ch01lev2sec4)   >  >>>  >>> [1.1.5.
- Shipping containers](kindle_split_012.xhtml#ch01lev2sec5)   >  >>  >> [1.2.
- What problems does Docker solve?](kindle_split_012.xhtml#ch01lev1sec2)   >  >> >>> [1.2.1.
- Getting organized](kindle_split_012.xhtml#ch01lev2sec6)   >  >>>  >>> [1.2.2.
- Improving portability](kindle_split_012.xhtml#ch01lev2sec7)   >  >>>  >>> [1.2.3.

## 4. Topicos Avancados
- Protecting your computer](kindle_split_012.xhtml#ch01lev2sec8)   >  >>  >> [1.3.
- Why is Docker important?](kindle_split_012.xhtml#ch01lev1sec3)   >  >>  >> [1.4.
- Where and when to use Docker](kindle_split_012.xhtml#ch01lev1sec4)   >  >>  >> [1.5.
- Docker in the larger ecosystem](kindle_split_012.xhtml#ch01lev1sec5)   >  >>  >> [1.6.
- Getting help with the Docker command line](kindle_split_012.xhtml#ch01lev1sec6)   >  >>  >> [Summary](kindle_split_012.xhtml#ch01lev1sec7)   >  >  > [1\.
- Process isolation and environment-independent computing](kindle_split_013.xhtml#part01)   >  > >> [Chapter 2.
- Running software in containers](kindle_split_014.xhtml#ch02)   >  >> >>> [2.1.
- Controlling containers: Building a website monitor](kindle_split_014.xhtml#ch02lev1sec1)   >  >>> >>>> [2.1.1.
- Creating and starting a new container](kindle_split_014.xhtml#ch02lev2sec1)   >  >>>>  >>>> [2.1.2.
- Running interactive containers](kindle_split_014.xhtml#ch02lev2sec2)   >  >>>>  >>>> [2.1.3.

