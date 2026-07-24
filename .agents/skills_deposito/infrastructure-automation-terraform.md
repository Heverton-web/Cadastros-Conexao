---
name: infrastructure-automation-with-terraform-automate
description: >-
  Passos operacionais extraidos do livro 'INFRASTRUCTURE AUTOMATION WITH TERRAFORM automate and - Patil, Ankita;Soni, Mitesh;; Mitesh Soni' (EN) — praticas e procedimentos para DevOps, infraestrutura e containers.
---

# INFRASTRUCTURE AUTOMATION WITH TERRAFORM automate and - Patil, Ankita;Soni, Mitesh;; Mitesh Soni — Passos Operacionais

Skill baseada no livro "INFRASTRUCTURE AUTOMATION WITH TERRAFORM automate and - Patil, Ankita;Soni, Mitesh;; Mitesh Soni" (EN). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: DevOps, Docker, Kubernetes, infraestrutura, cloud, CI/CD.

---

## Praticas e Procedimentos


> Mitesh, my guide and mentor always, thank you for giving me the opportunity to co-author this book with you.


> Ankita has worked on multiple projects and tools for automating the entire software development lifecycle. Her approach has always been to develop a solution using different DevOps tools that would make the Development to Deployment cycle shorter and deliver software to market as quickly as possible. She has knowledge of the development of Java web applications and also has a lot of experience in 


> **Mitesh Soni** is a DevOps engineer and in love with the DevOps culture and concept. Continuous improvement is his motto in life with existing imperfection. Mitesh has worked on multiple DevOps practices implementation initiatives. His primary focus is the improvement of the existing culture of an organization or a project using Continuous Integration and Continuous Delivery. He believes that att


> Mitesh always believes that DevOps is a cultural transformation facilitated by people, processes, and tools. DevOps transformation is a tools agnostic approach. He loves to impart training and share knowledge with the community, and his main objective is to get enough information related to the project in such a way that it helps create an end-to-end automation pipeline.


> His favorite tools/services for DevOps practices implementation are Azure DevOps and Jenkins in the commercial and open-source categories, respectively.


> Application delivery and the activities involved in it have changed a lot after cloud computing and DevOps practices gained the attention of different organizations. Everything as code is a new norm where your automation or CI/CD pipeline is also part of version control - pipeline as code. High availability, disaster recovery, and business continuity have become crucial considering the competitive


> In this chapter, we will install and configure Terraform in different operating systems as well as in Docker container. We will use Docker Desktop to create a container that has Terraform installed on it. We will also understand the details for AWS and Azure accounts and **Command line** (**CLIs**). It will help us in the upcoming chapters when using Terraform to create infrastructure in AWS and M


> * Installing and configuring Terraform on Windows using Chocolatey
  * Installing and configuring Terraform on Mac
  * Installing and configuring Terraform on Ubuntu
  * Installing and configuring Terraform on CentOS
  * Terraform IAC Development and IDE
  * Creating Microsoft Azure Account
  * Installing and Configuring Azure CLI
  * Creating AWS Account
  * Installing and Configuring AWS CLI

1. With PowerShell, execute the "`**Get-ExecutionPolicy**`" command first. Here’s the explanation of the output of the execution of this command:
1. Execute the following command to install Chocolatey. Visit the official website for more details on Chocolatey installation.
1. Type `**choco**` or `**choco -?**`. You are ready to install packages using Chocolatey. Chocolatey is installed in following screenshot:
1. Verify environment variables after installing Chocolatey as per the following screenshot. Visit **<https://chocolatey.org/install>** for advanced installation of Chocolatey.
1. Verify the Chocolatey version using the following command:
1. Visit **<https://chocolatey.org/packages/terraform>** and get more details on the Terraform package and the command to install Terraform using Chocolatey.
1. Execute the following command in PowerShell to install Terraform as per the following screenshot:
1. We will download the installable file for macOS from **<https://www.terraform.io/downloads.html>**.
1. Extract terraform installation file.
1. Open your `**.bash_profile**` file available in the root folder; create a profile if it is not available in your system. Create new `**bash_profile**` with the `**touch .bash-profile**` command.
1. Edit the file and add the folder to where you’ve chosen to extract the Terraform binary export `**PATH=$PATH:~/terraform**`.
1. `**export PATH="$PATH:~/terraform**`
1. Save the `**.bash_profile**` file.
1. Enter the source `**.bash_profile**` command to use the bash profile with the new terraform-folder as an executable binary path.
1. Verify the installation with the `**terraform -version**` command.

## Procedimentos

1. With PowerShell, execute the "`**Get-ExecutionPolicy**`" command first. Here’s the explanation of the output of the execution of this command:
1. Execute the following command to install Chocolatey. Visit the official website for more details on Chocolatey installation.
1. Type `**choco**` or `**choco -?**`. You are ready to install packages using Chocolatey. Chocolatey is installed in following screenshot:
1. Verify environment variables after installing Chocolatey as per the following screenshot. Visit **<https://chocolatey.org/install>** for advanced installation of Chocolatey.
1. Verify the Chocolatey version using the following command:
1. Visit **<https://chocolatey.org/packages/terraform>** and get more details on the Terraform package and the command to install Terraform using Chocolatey.
1. Execute the following command in PowerShell to install Terraform as per the following screenshot:
1. We will download the installable file for macOS from **<https://www.terraform.io/downloads.html>**.
1. Extract terraform installation file.
1. Open your `**.bash_profile**` file available in the root folder; create a profile if it is not available in your system. Create new `**bash_profile**` with the `**touch .bash-profile**` command.
1. Edit the file and add the folder to where you’ve chosen to extract the Terraform binary export `**PATH=$PATH:~/terraform**`.
1. `**export PATH="$PATH:~/terraform**`
1. Save the `**.bash_profile**` file.
1. Enter the source `**.bash_profile**` command to use the bash profile with the new terraform-folder as an executable binary path.
1. Verify the installation with the `**terraform -version**` command.
1. Install zip with the following command:
1. Unzip the Terraform download with the following command:
1. Let’s move it to `**/usr/local/bin**`. (This is where we can keep system programs and libraries that are not available with standard distribution, and usually, they are binary executables).
1. To install Docker Desktop for Mac, visit **<https://docs.docker.com/docker-for-mac/install/>**.
1. To install Docker Desktop for Windows, visit **<https://docs.docker.com/docker-for-windows/install/>****.**