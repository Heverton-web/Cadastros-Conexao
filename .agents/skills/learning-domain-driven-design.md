---
name: learning-domain-driven-design
description: >-
  Passos operacionais do livro 'Learning Domain-Driven Design' (Vladik Khononov) — bounded contexts, eventos e agregados.
---

# Learning Domain Driven Design — Passos Operacionais

Conteudo extraido do livro 'Learning Domain Driven Design'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- His ideas constantly move the whole DDD community forward, and   this book will inspire beginning DDD practitioners.”  —Nick Tune, Technology Consultant  “Reflecting on my readings of drafts of this book, the thing that comes to mind, with a   great deal of joy at the thought, is that it delivers on its title!
- It is an inviting and   informative practice guide, covering the scope of DDD from strategy to technical design.
- I’ve gained new insight and understanding in areas where I have experience and filled in   concepts and practices I’d had less exposure to.
- Vlad is a wonderful teacher!”  —Ruth Malan, Architecture Consultant   at Bredemeyer Consulting  “Vlad has a lot of hard-won experience as a DDD practitioner working on some deeply   complex projects and has been generous in sharing that knowledge.
- In this book, he tells   the story of DDD in a unique way providing a great perspective for learning.
- This book is   aimed at newcomers, yet as a longtime DDD practitioner who also writes and speaks   about DDD, I found that I learned so much from his perspective.”  —Julie Lerman, Software Coach, O’Reilly Author,   and Serial DDD Advocate   Vlad Khononov  Learning Domain-Driven Design   Aligning Software Architecture   and Business Strategy  Boston   Farnham   Sebastopol   Tokyo   Beijing   Boston   Farnham   Sebastopol   Tokyo   Beijing   Learning Domain-Driven Design   by Vlad Khononov  Copyright © 2022 Vladislav Khononov.
- Printed in the United States of America.
- Published by O’Reilly Media, Inc., 1005 Gravenstein Highway North, Sebastopol, CA 95472.
- O’Reilly books may be purchased for educational, business, or sales promotional use.
- Online editions are   also available for most titles (http://oreilly.com).


  - Preface. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . xv

  - Index. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 299

  - Foreword. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . xiii

  - Introduction. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . xxiii

  - References. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 297

  - Closing Words. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 267
## 2. Principios e Tecnicas
- For more information, contact our corporate/institutional   sales department: 800-998-9938 or corporate@oreilly.com.
- Acquisitions Editor: Melissa Duffield   Development Editor: Jill Leonard    Production Editor: Katherine Tozer    Copyeditor: Audrey Doyle   Proofreader: James Fraleigh  Indexer: Sue Klefstad   Interior Designer: David Futato   Cover Designer: Karen Montgomery   Illustrator: Kate Dullea  October 2021:   First Edition  Revision History for the First Edition   2021-10-08: First Release  See http://oreilly.com/catalog/errata.csp?isbn=9781098100131 for release details.
- The O’Reilly logo is a registered trademark of O’Reilly Media, Inc.
- Learning Domain-Driven Design, the    cover image, and related trade dress are trademarks of O’Reilly Media, Inc.
- The views expressed in this work are those of the author, and do not represent the publisher’s views.
- While the publisher and the author have used good faith efforts to ensure that the information and    instructions contained in this work are accurate, the publisher and the author disclaim all responsibility    for errors or omissions, including without limitation responsibility for damages resulting from the use of    or reliance on this work.
- Use of the information and instructions contained in this work is at your own    risk.
- Analyzing Business Domains. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3   What Is a Business Domain?   3   What Is a Subdomain?   4   Types of Subdomains   4   Comparing Subdomains   7   Identifying Subdomain Boundaries   11   Domain Analysis Examples   14   Gigmaster   14   BusVNext   15   Who Are the Domain Experts?   17   Conclusion   18   Exercises   18  2\.
- Discovering Domain Knowledge. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21   Business Problems   21   Knowledge Discovery   22   Communication   22   What Is a Ubiquitous Language?   24   Language of the Business   25  v   Scenarios 25   Consistency 26   Model of the Business Domain 27   What Is a Model? 27   Effective Modeling 28   Modeling the Business Domain 28   Continuous Effort 29   Tools 29   Challenges 30   Conclusion 31   Exercises 32  3\.
- Integrating Bounded Contexts. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 49   Cooperation 50   Partnership 50   Shared Kernel 50   Customer–Supplier 53   Conformist 53   Anticorruption Layer 54   Open-Host Service 55   Separate Ways 56   Communication Issues 56  vi    |    Table of Contents   Generic Subdomains 56   Model Differences 56   Context Map 57   Maintenance 58   Limitations 58   Conclusion 59   Exercises 59  Part II.


  - 14\. Microservices. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 217

  - 16\. Data Mesh. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 249

  - 10\. Design Heuristics. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 159

  - 12\. EventStorming. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 185
## 3. Aplicacoes Praticas
- Implementing Simple Business Logic. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 63   Transaction Script 63   Implementation 64   It’s Not That Easy! 64   When to Use Transaction Script 68   Active Record 69   Implementation 70   When to Use Active Record 71   Be Pragmatic 72   Conclusion 72   Exercises 72  6\.
- Tackling Complex Business Logic. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 75   History 75   Domain Model 76   Implementation 77   Building Blocks 77   Managing Complexity 94   Conclusion 95   Exercises 96  7\.
- Modeling the Dimension of Time. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99   Event Sourcing 99   Search 104   Analysis 105   Source of Truth 107   Event Store 107   Event-Sourced Domain Model 108   Advantages 110   Disadvantages 111   Frequently Asked Questions 112  Table of Contents    |    vii   Performance 112   Deleting Data 114   Why Can’t I Just…? 114   Conclusion 115   Exercises 116  8\.
- Communication Patterns. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 137   Model Translation 137   Stateless Model Translation 138   Stateful Model Translation 141   Integrating Aggregates 143   Outbox 145   Saga 147   Process Manager 150   Conclusion 154   Exercises 154  viii    |    Table of Contents   Part III.
- Applying Domain-Driven Design in Practice  10\.
- Design Heuristics. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 159   Heuristic 159   Bounded Contexts 160   Business Logic Implementation Patterns 161   Architectural Patterns 163   Testing Strategy 164   Testing Pyramid 165   Testing Diamond 165   Reversed Testing Pyramid 165   Tactical Design Decision Tree 166   Conclusion 167   Exercises 167  11\.
- Domain-Driven Design in the Real World. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 201   Strategic Analysis 202   Understand the Business Domain 202   Explore the Current Design 203   Modernization Strategy 204   Strategic Modernization 205   Tactical Modernization 207   Cultivate a Ubiquitous Language 207   Pragmatic Domain-Driven Design 210   Selling Domain-Driven Design 211   Undercover Domain-Driven Design 211   Conclusion 213   Exercises 214  Part IV.
- Relationships to Other Methodologies and Patterns  14\.
- Event-Driven Architecture. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 233   Event-Driven Architecture 233   Events 234   Events, Commands, and Messages 234   Structure 235   Types of Events 236   Designing Event-Driven Integration 241   Distributed Big Ball of Mud 241   Temporal Coupling 242   Functional Coupling 243   Implementation Coupling 243   Refactoring the Event-Driven Integration 243   Event-Driven Design Heuristics 245   Conclusion 246   Exercises 247  16\.
- Applying DDD: A Case Study. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 273  B.

## 4. Topicos Avancados
- It was originally coined by Eric Evans in 2003 with   the publication of what is fondly known in the DDD community as “The Blue Book.”   The book’s title is Domain-Driven Design: Tackling Complexity in the Heart of   Software.
- While tackling complexity and providing a path to clarity is the goal of domain-   driven design, there are so many great ideas that can be applied to even less compli‐   cated software projects.
- DDD reminds us that software developers are not the only   people involved in building software.
- The domain experts, for whom the software is   being built, bring critical understanding of the problems being solved.
- We create a   partnership throughout the stages of creation as we first apply “strategic design” to   understand the business problem, a.k.a. the domain, and break the problem down   into smaller, solvable, interconnected problems.
- The partnership with the domain   experts also drives us to communicate in the language of the domain, rather than   forcing those on the business side to learn the technical language of software.
- The second stage of a DDD-based project is “tactical design,” where we transform the   discoveries of strategic design into software architecture and implementation.
- Again,   DDD provides guidance and patterns for organizing these domains and avoiding fur‐   ther complexity.
- Tactical design continues the partnership with the domain experts   who will recognize their domain language even as they look at the code built by the   software teams.
- Over the years since the publication of “The Blue Book,” not only have many organi‐   zations benefited from the ideas, but a community of experienced DDD practitioners   has evolved.

