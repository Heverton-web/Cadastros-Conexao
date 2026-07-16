---
name: full-stack-web-development-with-typescript-5-mykyt
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Full Stack Web Development With Typescript 5 — Passos Operacionais

Conteudo extraido do livro 'Full Stack Web Development With Typescript 5'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Alongside JavaScript, an array of tools has surfaced, each contributing to the more efficient creation of full-stack applications.
- This book is dedicated to exploring these developments.
- We’ll focus on full-stack development, combining TypeScript with a variety of cutting-edge technologies needed to build complete applications through building a hands-on project.
- Our practical project involves constructing a chat application, similar in essence to the functionality of ChatGPT.
- It will involve the application of diverse frontend and backend technologies, along with database and API integrations.
- This book is more than just a guide to coding an application from start to finish.
- It also aims to teach you about effective development patterns, which are versatile enough to be applied across various technologies of your choice.
- While it’s assumed that you come with a basic understanding of JavaScript and fundamental web development concepts, every new topic and aspect introduced in the book will be thoroughly explained, ensuring a deep and comprehensive understanding of each subject.
- In this book, we’ll start by exploring TypeScript, now a key player in web development.
- Its main advantage is the use of types, which significantly improves the development process.


  - * **XSS attack** : An XSS attack occurs when an attacker injects malicious scripts into content that is served to other users. These scripts execute within the context of the victim’s browser under the trust level of the web application, allowing the attacker to steal cookies, session tokens, or other sensitive information reflected in the web browser. XSS can be performed by including malicious JavaScript in user-generated content that is not properly sanitized by the server or the client before being presented to other users. Defending against XSS involves encoding and escaping user input, implementing a **Content Security Policy** (**CSP**), and validating all input data. A CSP is typically handled on the frontend by escaping the user-generated content before putting it into the HTML, but it doesn’t hurt to additionally address it on the backend either.

  - The interfaces defined in this section are the interfaces we are going to use when we interact with the database. However, when we operate on the API level, it’s good practice to introduce an additional layer of types that we are going to receive and return from our endpoints. In a big application, database types and API types can overlap only partially because both layers handle the same data but with different details and structures suited to their specific roles in the application; for example, we can create multiple database objects from one endpoint. In our app, however, they mostly overlap as we have straightforward **Create, Read, Edit, Delete** (**CRUD**) endpoints. So, let’s create the API types, which we are going to use as a form of input and output data from our endpoints.

  - Another big drawback people often point out is that JavaScript is weakly and dynamically typed. To fix this, Microsoft rolled out TypeScript in 2012. Since then, there’s been a lot of changes in both JavaScript and TypeScript. For example, now in JavaScript, you can sidestep the issue in the first example by using the **===** comparison, which compares the values without type coercion. But the big win of TypeScript is still its static typing, which would not allow such comparison in the first place as a **number** cannot be equal to a **string** by a type definition, so the comparison doesn’t make sense in type logic. This is far from all of the benefits strict typing provides to us. We will explore more of its benefits further in this chapter and in the next one.

  - This book, _Full-Stack Web Development with TypeScript 5_ , takes you on a journey into the robust and versatile world of TypeScript and will enable you to develop modern web applications from the ground up. With a focus on practical, real-world applications, this guide equips you with the necessary tools and techniques to master full-stack development using cutting-edge technologies such as Bun for the backend, Svelte for the frontend, PostgreSQL for database management, and the OpenAI API for AI integration. Whether you’re looking to deepen your existing knowledge or venture into new aspects of web development, this book provides step-by-step instructions and a project-based learning approach that culminates in the creation of a full-featured chat application.

  - **Docker** is a platform that allows you to package your application and its dependencies into a container, which can be easily shipped and run in any environment and any operating system in a similar manner. Think of it like this: imagine your application is a delicate piece of furniture that needs to be transported from one place to another. Docker acts as the perfect shipping container for your furniture. It carefully wraps up your application and all its dependencies, making sure everything is securely packaged together. No matter where the shipping container ends up, whether it’s a different room, a different house, or even a different country, you can be confident that when you open the container, your furniture will be intact and ready to use.

  - **Mykyta Chernenko** has over seven years of experience in technology, mainly in full-stack development with a focus on Python and TypeScript. He has also worked with Go, Kotlin, and Dart on various projects. His technical contributions include working on the Azure integration for Nutanix’s cluster discovery project and a key engineering role at Factmata, overseeing engineering and infrastructure. Currently, he holds a position as a senior consultant at KodeWorks. In addition to his technical work, Mykyta has mentored over 20 professionals, sharing his knowledge and experience. He is also the author of _The Rational Software Engineer_ and runs a blog with the same name on Hackernoon, where he writes about his insights in the field.
## 2. Principios e Tecnicas
- We’ll discuss TypeScript’s history, compare it with JavaScript, and explore its strengths, particularly in enhancing code quality and reducing errors.
- We’ll also delve into TypeScript’s core concepts, such as syntax, types, interfaces, classes, and generics, providing a thorough understanding of how it works.
- Then, we’ll shift our focus to backend development, choosing Bun as our main technology.
- As of 2023, Bun is one of the most promising backend runtimes and is notable for its seamless integration with TypeScript.
- We’ll cover the essentials of Bun, including setting up the environment, handling authentication, routing, middleware, data validation for requests, building REST APIs, using linters for code quality, debugging, logging, code structure, and effective testing strategies.
- Next, we’ll dive into using databases, specifically PostgreSQL, one of the most popular SQL-based databases with extensive features.
- We’ll discuss data storage and how to optimize it.
- A key focus will be on using TypeScript as an interface for managing the data we store.
- We’ll start with basic create, read, update, and delete operations, and then move on to using libraries and object-relational mappers to interact with PostgreSQL from TypeScript.
- This section will also cover integrating PostgreSQL into our backend infrastructure and optimizing its use.


  - * **MySQL/MariaDB** : PostgreSQL is frequently compared to MySQL or its fork, MariaDB, which are also popular open source RDBMSs. While MySQL is renowned for its speed and reliability in read-heavy scenarios, PostgreSQL shines with its advanced features such as complex queries and support for **multiple concurrent transactions** (through **multi-version concurrency control** , or **MVCC**). PostgreSQL’s extensibility and standards compliance, including full ACID compliance for transactions, make it a preferred choice for complex and mission-critical applications. MVCC and ACID are more advanced database concepts, but if you haven’t heard of them, I recommend reading up on them when you feel more comfortable with databases.

  - In the previous chapter, we focused on validation and testing, which significantly improved the reliability of our server. With this, we have almost finished the development of our REST API, and we can now focus on the more advanced aspects such as **security** , **request throttling** , **caching** , and **logging** techniques. First, we will address potential security issues that our backend doesn’t protect us from yet, and we will also add a layer of protection against **DoS attacks** with request throttling. Then, we will focus on how to cache the response we produce and configure and use logging in our application. With this in place, we will make sure that our application is secure, quick, and easy to debug.

  - * **Unauthorized domain request** : This security concern involves making requests to a REST API from a domain that is not authorized by the API server’s **Cross-Origin Resource Sharing** (**CORS**) policy. CORS is a mechanism that allows or restricts resources on a web server to be requested from another domain. Without proper CORS settings, an attacker could make unauthorized API calls from a malicious domain, potentially exposing sensitive information or exploiting vulnerabilities. To mitigate this risk, we need to configure CORS policies to explicitly allow only trusted domains to make requests and use other security measures, such as API keys and OAuth tokens, for authentication and authorization.

  - Integrating external APIs is a cornerstone of building dynamic and feature-rich applications. We need to call external services to enrich the functionality of our application. For the sake of this book, we will need to integrate the OpenAI API to generate **Generated Pre-trained Transformer** (**GPT**) responses. Integrating with external APIs is essential but comes with a few things to watch out for: the API call can take a significant time, it can fail, and we can get back something we do not expect as a message with a different structure. We will go through how to mitigate all of the difficulties, and we will start by showing how to communicate with an external API using the native **fetch** method.
## 3. Aplicacoes Praticas
- Following that, we’ll tackle API integration, which is crucial for our chat application.
- We’ll be using the OpenAI GPT API for chat completions.
- While integrating and configuring this API for our backend, we’ll cover broader topics, such as writing external service integrations effectively, ensuring the correctness of API responses, and incorporating API calls into our REST endpoints.
- Additionally, we’ll discuss various scenarios where the OpenAI API and its models can be beneficial in web development.
- The final section of this book focuses on frontend development using Svelte.
- Known for its simplicity, speed, and beginner-friendliness, Svelte is a standout choice for building web interfaces.
- We’ll explore reactivity patterns common in single-page application frameworks and apply them to build our chat functionality using Svelte.
- This includes setting up the environment with TypeScript, understanding Svelte’s core concepts and syntax, integrating the frontend with our REST API, and learning about components, routing, state management, and styling.
- Additionally, we’ll delve into testing and debugging Svelte code and discuss best practices for maintaining and extending the code base.
- By the end of this book, you’ll gain more than just knowledge of the specific technologies covered.

## 4. Topicos Avancados
- You’ll develop a versatile mental framework for full-stack development.
- This framework will equip you with valuable concepts and practices that are applicable across any technologies and languages you will choose in web project development.
- Let’s kick off our journey with TypeScript.
- In this chapter, we’ll dive into an introduction to TypeScript, covering its history, how it stands out from JavaScript, and its advantages.
- We’ll also get acquainted with TypeScript’s basic syntax, setting the stage for more advanced topics to follow.
- Here is the list of topics we are going to cover:    * Introduction to TypeScript and its evolution   * Key differences between TypeScript and JavaScript   * The advantages of using TypeScript in modern web development   * Basic syntax of TypeScript    # Technical requirements  In this chapter, there’s no need to install or run anything just yet.
- We’re going to focus on the basics of TypeScript, so you can ease into it without any setup work.
- All the code examples we discuss are available in this repository: [https://github.com/PacktPublishing/Full-Stack-Web-Development-with-TypeScript-5/tree/main/Chapter01](https://github.com/PacktPublishing/Full-Stack-Web-Development-with-TypeScript-5/tree/main/Chapter01).  # Introduction to TypeScript and its evolution  JavaScript’s journey to market was remarkably quick.
- Brendan Eich created its first version in just 10 days, aiming to make web pages interactive through a straightforward scripting language.
- Over time, JavaScript gradually, then rapidly, became a dominant force in web development, while applications grew increasingly complex.

