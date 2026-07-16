---
name: restful-api-design
description: >-
  Passos operacionais do livro 'RESTful API Design Principles' (Alex Rodriguez) — design de APIs RESTful, HATEOAS e versionamento.
---

# include <stdio.h> — Passos Operacionais

Skill baseada no livro "include <stdio.h>" (EN). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: RESTful, API design, HATEOAS, versionamento.

---

## 1. Introduction

- [Introduction](ch01.xhtml#sc2_1)

## 2. Structure

- [Structure](ch01.xhtml#sc2_2)

## 3. Objectives

- [Objectives](ch01.xhtml#sc2_3)

## 4. CGI

- [CGI](ch01.xhtml#sc2_4)

## 5. Java RMI


### 5.1 The Applet Experiment

1. To format the data returned by the API.
1. To uniquely identify and locate resources on the network.
1. To define the client-server interaction.
1. To specify the version of the API.
1. Use verbs to describe actions performed on the resource.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Compress the video file before uploading to reduce the payload size.
- Split the file into smaller parts to chunk it. The server then receives the file in segments within memory limits.
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


## 6. Servlets and EJB

- To uniquely identify and locate resources on the network.
- The use of unique identifiers (URIs) to locate and interact with resources.
- Split credentials and validate.
- [Servlets and EJB](ch01.xhtml#sc2_7)

## 7. SOAP


### 7.1 SOAP request

1. Accept or reject the request with 401 or 403 HTTP response code on failure.
1. [SOAP](ch01.xhtml#sc2_8)
1. [SOAP request](ch01.xhtml#sc3_9)
1. [SOAP response](ch01.xhtml#sc3_10)
1. [REST API request](ch01.xhtml#sc3_12)
- POST creates new resources and modifies server state with each request
- Retrieve the order (self) via a GET request.
- Cancel the order (cancel) via a POST request, if allowed.
- Update the order (update) using a PUT request.
- Confirm the order (confirm) via a POST request.

> The software development philosophies at the time were influenced by engineering practices that favored running scripts and programs as individual processes. Do one thing well embraced the idea that programs were to be small, modular, and designed to handle a specific task. This thinking crossed over to the use of separate processes to handle web requests. The senior IT staff around Unix servers, 


> It felt natural to run CGI programs in isolation on Unix. Since client-server was the paradigmatic architecture at the time, CGI fit in very well by taking the server-side role, as a mechanism to generate content dynamically, in response to client requests. Unix and its variants, like Linux, were all about process-based multitasking, when an operating system runs multiple processes (programs) simu


### 7.2 SOAP response

1. The requirement that all API responses must include hypermedia links.
1. They automatically compress response data to improve performance.
1. Accept or reject the request with 401 or 403 HTTP response code on failure.
1. [SOAP](ch01.xhtml#sc2_8)
1. [SOAP request](ch01.xhtml#sc3_9)

> It felt natural to run CGI programs in isolation on Unix. Since client-server was the paradigmatic architecture at the time, CGI fit in very well by taking the server-side role, as a mechanism to generate content dynamically, in response to client requests. Unix and its variants, like Linux, were all about process-based multitasking, when an operating system runs multiple processes (programs) simu


> The emergence of CGI was a response to a growing demand for web servers to play a more critical role, at the intersection between HTTP traffic and external programs. As e-commerce gained a foothold in the 90s, web applications became a new kind of business software. In this model, web apps could handle some transactions, do security, and even simulate shopping carts. CGI's compatibility with exist


## 8. REST


### 8.1 REST API request

1. To format the data returned by the API.
1. To specify the version of the API.
1. The requirement that all API responses must include hypermedia links.
1. Accept or reject the request with 401 or 403 HTTP response code on failure.
1. [SOAP request](ch01.xhtml#sc3_9)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.
- POST creates new resources and modifies server state with each request
- Retrieve the order (self) via a GET request.

> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


> * Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy mode


### 8.2 REST API response

1. To format the data returned by the API.
1. To specify the version of the API.
1. The requirement that all API responses must include hypermedia links.
1. They automatically compress response data to improve performance.
1. Accept or reject the request with 401 or 403 HTTP response code on failure.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.
- A self-descriptive API reduces the client's dependency on external documentation and hardcoded URLs.

> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


> * Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy mode


## 9. Conclusion

- [Conclusion](ch01.xhtml#sc2_14)

## 10. Points to remember

- To format the data returned by the API.
- To uniquely identify and locate resources on the network.
- To define the client-server interaction.
- To specify the version of the API.
- Use verbs to describe actions performed on the resource.
- Use underscores to separate words in resource names.
- The ability to perform multiple operations on a resource using a single endpoint.
- The use of unique identifiers (URIs) to locate and interact with resources.

## 11. Multiple choice questions


### 11.1 Answers


## 12. Naming conventions for resources


### 12.1 Using nouns instead of verbs

1. Use plural nouns for resource collections.
1. The ability to perform multiple operations on a resource using a single endpoint.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- PATCH applies partial updates to a resource, focusing on modifying specific attributes
- Update the order (update) using a PUT request.

> The Common Gateway Interface repositioned the web server in the early 90s. As IT professionals turned their attention to the web for applications development, they started by extending the role played by the web server. Instead of serving up static HTML pages that linked to other pages, web servers were coaxed into performing much more complex tasks. This was accomplished, in part, by running an i


### 12.2 Pluralize resource names

1. To uniquely identify and locate resources on the network.
1. Use verbs to describe actions performed on the resource.
1. Use camelCase for resource names.
1. Use plural nouns for resource collections.
1. Use underscores to separate words in resource names.
- Naming conventions for resources
- Identifying resource versions
- Be consistent and predictable in resource naming conventions
- Send a full representation of the resource in the payload, as if it were PUT.
- POST creates new resources and modifies server state with each request

### 12.3 Use hyphens as separators

1. Use verbs to describe actions performed on the resource.
1. Use camelCase for resource names.
1. Use plural nouns for resource collections.
1. Use underscores to separate words in resource names.
1. The use of unique identifiers (URIs) to locate and interact with resources.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.
- Send a full representation of the resource in the payload, as if it were PUT.
- Use the method for bulk updates.

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 12.4 Resource namespaces

1. To uniquely identify and locate resources on the network.
1. Use verbs to describe actions performed on the resource.
1. Use camelCase for resource names.
1. Use plural nouns for resource collections.
1. Use underscores to separate words in resource names.
- Naming conventions for resources
- Identifying resource versions
- Be consistent and predictable in resource naming conventions
- Send a full representation of the resource in the payload, as if it were PUT.
- POST creates new resources and modifies server state with each request

## 13. Identifying resource versions


### 13.1 URI versioning

1. Media type versioning.
1. Query parameter versioning.
1. The use of unique identifiers (URIs) to locate and interact with resources.
- URIs can become deep syntactic structures

> Serfraz has deep expertise in building end-to-end solutions that seamlessly connect business processes with modern technology stacks. His approach blends robust architectural principles with practical engineering discipline, ensuring systems are both strategically aligned and technically sound. Passionate about RESTful APIs, integration patterns, and data-driven systems, he is known for championin


> Beyond consulting, Serfraz is an avid learner who stays engaged with emerging trends in distributed systems, API governance, cloud platforms, and data engineering. He frequently advises teams on best practices, helping them elevate their architectural maturity and deliver high-quality digital experiences. His commitment to excellence and his ability to translate complexity into actionable guidance


### 13.2 Header versioning

1. Media type versioning.
1. Query parameter versioning.
1. Check for the Authorization header.
- Conflict resolution in methods like PUT and PATCH can be handled with ETags and If-Match headers to prevent race conditions

### 13.3 Media type versioning

1. Media type versioning.
1. Query parameter versioning.
1. The requirement that all API responses must include hypermedia links.
- Designing hypermedia controls
- Hypermedia links are accompanied by semantic metadata, that is, relationship (rel), HTTP method, and media type hints, for navigation transparency.

> At its core, CGI defined a set of conventions for web servers to exchange data with an executable program. This was done through OS environment variables. For example, the client's IP address, the server's host name, the request method (GET or POST), and the content type, were passed to a program by assigning values to environment variables in a shell. The variables allowed the external program to


### 13.4 Query parameter versioning

1. Media type versioning.
1. Query parameter versioning.

> A typical CGI program defined an HTML template as a structure for a web page. The template included placeholders which were sections of the HTML where data was inserted. Some programs connected to a database that provided the data used to populate the template. A database connection was usually managed through a driver, and having connected to the database, the CGI program ran a query, like a simp


## 14. GET


### 14.1 Facsimile


### 14.2 Caching


### 14.3 Common misuses


> Through a historical analysis of architectures tried before Representational State Transfer (REST) took center stage, this chapter explores major shifts in enterprise software. From the early days of the Common Gateway Interface (CGI) in the 90s, to the adoption of REST since the 2000s, this chapter aims to provide a history and context for the development of different approaches tried over a 30 y


> The Common Gateway Interface repositioned the web server in the early 90s. As IT professionals turned their attention to the web for applications development, they started by extending the role played by the web server. Instead of serving up static HTML pages that linked to other pages, web servers were coaxed into performing much more complex tasks. This was accomplished, in part, by running an i


## 15. POST


### 15.1 Non-idempotent


### 15.2 Non-cacheable


### 15.3 Pitfalls


## 16. PUT


### 16.1 Replace

- PUT replaces an entire resource or its state with a new version

### 16.2 Upsert


### 16.3 Conflicts


### 16.4 Misuse


## 17. PATCH


### 17.1 Targeted modification


### 17.2 Efficiency


## 18. DELETE


## 19. Consumable


### 19.1 Initial state: Unusable

- Anti-patterns are found in poorly designed resources. Unusable, disjointed, or static resources fail clients. Examples include cryptic keys, fragmented data, and rigid designs that lack adaptability.

## 20. Composable


### 20.1 Initial state: Disjointed

- Anti-patterns are found in poorly designed resources. Unusable, disjointed, or static resources fail clients. Examples include cryptic keys, fragmented data, and rigid designs that lack adaptability.

## 21. Adaptable


### 21.1 Initial state: Static

- Anti-patterns are found in poorly designed resources. Unusable, disjointed, or static resources fail clients. Examples include cryptic keys, fragmented data, and rigid designs that lack adaptability.

> The Common Gateway Interface repositioned the web server in the early 90s. As IT professionals turned their attention to the web for applications development, they started by extending the role played by the web server. Instead of serving up static HTML pages that linked to other pages, web servers were coaxed into performing much more complex tasks. This was accomplished, in part, by running an i


## 22. HATEOAS fundamentals


### 22.1 Principles and rationale

1. To uniquely identify and locate resources on the network.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. Split credentials and validate.
1. [Servlets and EJB](ch01.xhtml#sc2_7)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Be consistent and predictable in resource naming conventions
- Version for flexibility and backward compatibility
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 22.2 Semantics and metadata

1. To uniquely identify and locate resources on the network.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. The practice of embedding metadata directly into resource representations.
1. Split credentials and validate.
1. [Servlets and EJB](ch01.xhtml#sc2_7)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Be consistent and predictable in resource naming conventions
- Version for flexibility and backward compatibility
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 22.3 Basic traits of hypermedia controls

1. To specify the version of the API.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. The practice of embedding metadata directly into resource representations.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Historical context of enterprise systems interface design
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.
- Send a full representation of the resource in the payload, as if it were PUT.

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


## 23. Designing hypermedia controls


### 23.1 Enhancing client navigation

1. To define the client-server interaction.
- Provide a file upload progress indicator API. On the client side, upload progress bars can give users feedback in the event of a failure caused by the network.
- Consumability in a resource makes it clear, structured, and simple for clients to use.
- Composability integrates resources easily with other system components, enabling clients to combine data into models and insights.
- Adaptability tailors resources to meet client needs, such as mobile versus web.
- Anti-patterns are found in poorly designed resources. Unusable, disjointed, or static resources fail clients. Examples include cryptic keys, fragmented data, and rigid designs that lack adaptability.

> It felt natural to run CGI programs in isolation on Unix. Since client-server was the paradigmatic architecture at the time, CGI fit in very well by taking the server-side role, as a mechanism to generate content dynamically, in response to client requests. Unix and its variants, like Linux, were all about process-based multitasking, when an operating system runs multiple processes (programs) simu


> At its core, CGI defined a set of conventions for web servers to exchange data with an executable program. This was done through OS environment variables. For example, the client's IP address, the server's host name, the request method (GET or POST), and the content type, were passed to a program by assigning values to environment variables in a shell. The variables allowed the external program to


### 23.2 Iterative link curation

1. The requirement that all API responses must include hypermedia links.
- Step-by-step refinements improve resource design as an iterative process. Small enhancements like nesting structures, adding metadata, or introducing links improve usability, scalability, and engagement.
- The buyTickets link would only be displayed if the event is within a specific time period (May 1st to May 14th) and the user is from the US.
- The viewReplay link is included if the event was in the past or the viewer is outside of the US, so that they may see a replay.
- The joinLiveStream link will only be clickable when the event is occurring on the same date and the user is not in the US, offering live streaming to users in specific areas.
- HATEOAS is all about navigational links within every resource representation to enable dynamic state transitions.

> The Common Gateway Interface repositioned the web server in the early 90s. As IT professionals turned their attention to the web for applications development, they started by extending the role played by the web server. Instead of serving up static HTML pages that linked to other pages, web servers were coaxed into performing much more complex tasks. This was accomplished, in part, by running an i


## 24. Best practices and implementation


### 24.1 Optimizing hypermedia

1. The requirement that all API responses must include hypermedia links.
- Designing hypermedia controls
- Hypermedia links are accompanied by semantic metadata, that is, relationship (rel), HTTP method, and media type hints, for navigation transparency.

### 24.2 Advanced considerations with conditional links

1. The use of unique identifiers (URIs) to locate and interact with resources.
1. Accept or reject the request with 401 or 403 HTTP response code on failure.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Split the file into smaller parts to chunk it. The server then receives the file in segments within memory limits.
- GET is used for retrieving data without altering the server's state
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 24.3 Fallbacks and semantic versioning

1. To uniquely identify and locate resources on the network.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. Split credentials and validate.
1. [Servlets and EJB](ch01.xhtml#sc2_7)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Be consistent and predictable in resource naming conventions
- Version for flexibility and backward compatibility
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 24.4 Integrating and evolving hypermedia

1. To uniquely identify and locate resources on the network.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. Split credentials and validate.
1. [Servlets and EJB](ch01.xhtml#sc2_7)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Be consistent and predictable in resource naming conventions
- Version for flexibility and backward compatibility
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


## 25. Authentication


### 25.1 Basic authentication

1. They enforce strict authentication requirements for accessing nested resources.

> Starting with the basic concepts in CGI, when the web server was extended to generate dynamic web pages, this chapter examines how CGI quickly fell short of meeting the demands of the explosive growth of the web in the early 90s. The discussion then moves to Java RMI in 1995, which gave entire objects a way to traverse the network, yet the need for broader interoperability pushed early Java enterp


> Figure 1.1 shows CGI's basic flow: a browser sends an HTTP request to a server, which launches a CGI script (like a standalone C program) to process it. The script's output, say, a dynamically generated HTML page, gets routed back to the client.


### 25.2 Bearer


## 26. Authorization


### 26.1 Role-based


### 26.2 Attribute-based


### 26.3 Encryption


### 26.4 Authorization

1. Check for the Authorization header.

## 27. Logging


### 27.1 Deciding what to log

1. To format the data returned by the API.
1. To uniquely identify and locate resources on the network.
1. To define the client-server interaction.
1. To specify the version of the API.
1. Use verbs to describe actions performed on the resource.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Historical context of enterprise systems interface design
- Compress the video file before uploading to reduce the payload size.
- Split the file into smaller parts to chunk it. The server then receives the file in segments within memory limits.

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


### 27.2 Structure your logs

1. [Structure](ch01.xhtml#sc2_2)
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- URIs can become deep syntactic structures
- Consumability in a resource makes it clear, structured, and simple for clients to use.
- Step-by-step refinements improve resource design as an iterative process. Small enhancements like nesting structures, adding metadata, or introducing links improve usability, scalability, and engagement.

> A typical CGI program defined an HTML template as a structure for a web page. The template included placeholders which were sections of the HTML where data was inserted. Some programs connected to a database that provided the data used to populate the template. A database connection was usually managed through a driver, and having connected to the database, the CGI program ran a query, like a simp


### 27.3 Logging pitfalls and best practices

1. To uniquely identify and locate resources on the network.
1. The use of unique identifiers (URIs) to locate and interact with resources.
1. Split credentials and validate.
1. [Servlets and EJB](ch01.xhtml#sc2_7)
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- Justin James is a results-driven integration and product leader with 23 years of experience in software development, product development, and systems integration, with a strong focus on service-oriented architecture (SOA), API-led connectivity, and platform leadership in e-Governance, telecom, financial, and healthcare domains. He currently serves as a product owner and integration lead architect for the Maryland Department of Health (MDH), where he is accountable for the enablement, design, and governance of the MuleSoft Hybrid Gov Cloud setup. Justin has published an article on enterprise as a service (EaaS) and hosted a talk on Building Your Personal AI Agent at POSTCON 25 in Los Angeles, California. He is proficient in designing and executing complex integration projects using platforms like MuleSoft ESB, Oracle SOA, and Webmethods, and has demonstrated capability in fostering an engineering culture by driving best practices, mentorship, and continuous improvement.
- Be consistent and predictable in resource naming conventions
- Version for flexibility and backward compatibility
- POST creates new resources and modifies server state with each request

> I was also incredibly fortunate to work with the dedicated team at BPB Publications. My thanks to everyone involved in editing, reviewing, tracking progress, and getting the book into the hands of readers.


> Alex brings a multidisciplinary approach, combining deep technical expertise with an understanding of quantitative methods as they apply to decision making in software engineering. He maintains a serious interest in good API design and views it as essential for building scalable and secure cloud-based systems. Alex led a platform modernization project at IBM, successfully migrating hundreds of leg


## 28. Performance


### 28.1 Data compression

1. To format the data returned by the API.
1. The practice of embedding metadata directly into resource representations.
1. They automatically compress response data to improve performance.
- Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy modernisation, and the adoption of cloud-native architectures, where he consistently brings clarity to intricate technical challenges.
- GET is used for retrieving data without altering the server's state
- Composability integrates resources easily with other system components, enabling clients to combine data into models and insights.
- Anti-patterns are found in poorly designed resources. Unusable, disjointed, or static resources fail clients. Examples include cryptic keys, fragmented data, and rigid designs that lack adaptability.
- Step-by-step refinements improve resource design as an iterative process. Small enhancements like nesting structures, adding metadata, or introducing links improve usability, scalability, and engagement.

> * Serfraz Safdar is an accomplished IT consultant with over two decades of experience specialising in data and solution architecture. Throughout his career, he has helped organisations design and implement scalable, resilient, and secure systems, with a strong emphasis on clean API design, data integrity, and long-term maintainability. His work spans complex enterprise transformations, legacy mode


> Serfraz has deep expertise in building end-to-end solutions that seamlessly connect business processes with modern technology stacks. His approach blends robust architectural principles with practical engineering discipline, ensuring systems are both strategically aligned and technically sound. Passionate about RESTful APIs, integration patterns, and data-driven systems, he is known for championin


### 28.2 Over-fetching


### 28.3 Pagination


## 29. Scale


### 29.1 Vertical


### 29.2 Horizontal


## 30. Architectures


### 30.1 Monolithic


### 30.2 Microservices


## 31. Afterword


### 31.1 References


## 32. Table of Contents

- To specify the version of the API.
- The use of unique identifiers (URIs) to locate and interact with resources.
- The practice of embedding metadata directly into resource representations.

## Referencias


Operation |  Size (Bytes)
---|---
PUT |  122
PATCH (add) |  28
PATCH (update) |  48
PATCH (remove) |  20


Symbol |  Frequency |  Assigned code |  Code length
---|---|---|---
l |  3 |  00 |  2 bits
o |  2 |  01 |  2 bits
5 |  2 |  10 |  2 bits
( |  1 |  1100 |  4 bits
) |  1 |  1101 |  4 bits
, |  1 |  1110 |  4 bits
H |  1 |  11110 |  5 bits
e |  1 |  11111 |  5 bits
W |  1 |  10000 |  5 bits
r |  1 |  10001 |  5 bits
d |  1 |  10010 |  5 bits
