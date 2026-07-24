---
name: designing-data-intensive
description: >-
  Passos operacionais do livro 'Designing Data-Intensive Applications' (Martin Kleppmann) — replicacao, particionamento, transacoes, streams e batch.
---

# Designing Data Intensive — Passos Operacionais

Conteudo extraido do livro 'Designing Data Intensive'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Printed in the United States of America.
- Published by O’Reilly Media, Inc., 1005 Gravenstein Highway North, Sebastopol, CA 95472.
- O’Reilly books may be purchased for educational, business, or sales promotional use.
- Online editions are   also available for most titles (http://oreilly.com/safari).
- For more information, contact our corporate/insti‐   tutional sales department: 800-998-9938 or corporate@oreilly.com.
- Editors: Ann Spencer and Marie Beaugureau   Indexer: Ellen Troutman-Zaig   Production Editor: Kristen Brown   Interior Designer: David Futato   Copyeditor: Rachel Head   Cover Designer: Karen Montgomery   Proofreader: Amanda Kersey   Illustrator: Rebecca Demarest  March 2017:   First Edition  Revision History for the First Edition   2017-03-01: First Release  See http://oreilly.com/catalog/errata.csp?isbn=9781449373320 for release details.
- The O’Reilly logo is a registered trademark of O’Reilly Media, Inc.
- Designing Data-Intensive Applications,   the cover image, and related trade dress are trademarks of O’Reilly Media, Inc.
- While the publisher and the author have used good faith efforts to ensure that the information and   instructions contained in this work are accurate, the publisher and the author disclaim all responsibility   for errors or omissions, including without limitation responsibility for damages resulting from the use of   or reliance on this work.
- Use of the information and instructions contained in this work is at your own   risk.


  - Preface. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . xiii

  - Index. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 559

  - Glossary. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 553

  - 5\. Replication. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 151

  - 6\. Partitioning. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 199

  - 7\. Transactions. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 221
## 2. Principios e Tecnicas
- If any code samples or other technology this work contains or describes is subject to open source   licenses or the intellectual property rights of others, it is your responsibility to ensure that your use   thereof complies with such licenses and/or rights.
- Technology is a powerful force in our society.
- Data, software, and communication can   be used for bad: to entrench unfair power structures, to undermine human rights, and   to protect vested interests.
- But they can also be used for good: to make underrepresented   people’s voices heard, to create opportunities for everyone, and to avert disasters.
- This   book is dedicated to everyone working toward the good.
- Computing is pop culture. […] Pop culture holds a disdain for history.
- Pop culture is all   about identity and feeling like you’re participating.
- It has nothing to do with cooperation,   the past or the future—it’s living in the present.
- I think the same is true of most people who   write code for money.
- They have no idea where [their culture came from].   —Alan Kay, in interview with Dr Dobb’s Journal (2012)   Table of Contents  Preface. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . xiii  Part I.


  - 10\. Batch Processing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 389

  - 11\. Stream Processing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 439

  - 3\. Storage and Retrieval. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 69

  - 4\. Encoding and Evolution. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 111
## 3. Aplicacoes Praticas
- Foundations of Data Systems  1\.
- Reliable, Scalable, and Maintainable Applications. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3   Thinking About Data Systems 4   Reliability 6   Hardware Faults 7   Software Errors 8   Human Errors 9   How Important Is Reliability? 10   Scalability 10   Describing Load 11   Describing Performance 13   Approaches for Coping with Load 17   Maintainability 18   Operability: Making Life Easy for Operations 19   Simplicity: Managing Complexity 20   Evolvability: Making Change Easy 21   Summary 22  2\.
- Encoding and Evolution. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 111   Formats for Encoding Data 112   Language-Specific Formats 113   JSON, XML, and Binary Variants 114   Thrift and Protocol Buffers 117   Avro 122   The Merits of Schemas 127   Modes of Dataflow 128   Dataflow Through Databases 129   Dataflow Through Services: REST and RPC 131   Message-Passing Dataflow 136   Summary 139  viii    |    Table of Contents   Part II.
- Transactions. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 221   The Slippery Concept of a Transaction 222  Table of Contents    |    ix   The Meaning of ACID 223   Single-Object and Multi-Object Operations 228   Weak Isolation Levels 233   Read Committed 234   Snapshot Isolation and Repeatable Read 237   Preventing Lost Updates 242   Write Skew and Phantoms 246   Serializability 251   Actual Serial Execution 252   Two-Phase Locking (2PL) 257   Serializable Snapshot Isolation (SSI) 261   Summary 266  8\.
- Stream Processing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 439   Transmitting Event Streams 440   Messaging Systems 441   Partitioned Logs 446   Databases and Streams 451   Keeping Systems in Sync 452   Change Data Capture 454   Event Sourcing 457   State, Streams, and Immutability 459   Processing Streams 464   Uses of Stream Processing 465   Reasoning About Time 468   Stream Joins 472   Fault Tolerance 476   Summary 479  Table of Contents    |    xi   12\.
- In the last decade we have seen many interesting developments in databases, in dis‐   tributed systems, and in the ways we build applications on top of them.
- This means parallelism is only going to increase.  • Even if you work on a small team, you can now build systems that are distributed   across many machines and even multiple geographic regions, thanks to infra‐   structure as a service (IaaS) such as Amazon Web Services.  • Many services are now expected to be highly available; extended downtime due   to outages or maintenance is becoming increasingly unacceptable.
- Data-intensive applications are pushing the boundaries of what is possible by making   use of these technological developments.
- We call an application data-intensive if data   is its primary challenge—the quantity of data, the complexity of data, or the speed at  Preface    |    xiii   which it is changing—as opposed to compute-intensive, where CPU cycles are the   bottleneck.
- The tools and technologies that help data-intensive applications store and process   data have been rapidly adapting to these changes.

## 4. Topicos Avancados
- New types of database systems   (“NoSQL”) have been getting lots of attention, but message queues, caches, search   indexes, frameworks for batch and stream processing, and related technologies are   very important too.
- Many applications use some combination of these.
- The buzzwords that fill this space are a sign of enthusiasm for the new possibilities,   which is a great thing.
- However, as software engineers and architects, we also need to   have a technically accurate and precise understanding of the various technologies and   their trade-offs if we want to build good applications.
- For that understanding, we   have to dig deeper than buzzwords.
- Fortunately, behind the rapid changes in technology, there are enduring principles   that remain true, no matter which version of a particular tool you are using.
- If you   understand those principles, you’re in a position to see where each tool fits in, how to   make good use of it, and how to avoid its pitfalls.
- That’s where this book comes in.
- The goal of this book is to help you navigate the diverse and fast-changing landscape   of technologies for processing and storing data.
- This book is not a tutorial for one   particular tool, nor is it a textbook full of dry theory.

