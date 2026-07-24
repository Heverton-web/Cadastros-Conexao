---
name: nodejs-complete-resume
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (PT).
---

# Nodejs Complete Resume — Passos Operacionais

Conteudo extraido do livro 'Nodejs Complete Resume'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- A JavaScript Runtime  “JavaScript on the Server”   What Does That Mean?
- C++   Machine Code  Written in   Compiles to  uses  Compiles JavaScript  Adds JS Features   JavaScript on the Server  Client (Browser)  Server  Database  Authentication  Input Validation  Your Business Logic   Request   Response   “HTML Page”  https://my-page.com  Can‘t access   server-side Code   Side note: You’re not limited to the Server!
- How To Get The Most Out Of The Course  Watch the Videos  Code Along & Do the  Exercises  At your Speed!
- Use the Course Resources   Attached Code & Links  Ask in Q&A  Help others in Q&A   Great Learnings  Guaranteed!
- The REPL  R  E  P  L  ead  val  rint  oop  Read User Input  Evaluate User Input  Print Output (Result)  Wait for new Input   Running Node.js Code  Execute Files   Use the REPL  Used for real apps   Great playground!
- Predictable sequence of  steps   Execute code as you write it   JavaScript Basics  A Quick Refresher   Skip This Module!
- JavaScript Summary  Weakly Typed Language   Object-Oriented  Language   Versatile Language  Runs in browser & directly  on a PC/ server   No explicit type  assignment  Data types can be    switched dynamically  Data can be organized in  logical objects  Primitive and reference  types  Can perform a broad  variety of tasks   let & const  var  let   const  variable values   constant values   Arrow Functions  function myFnc() {  …   }  const myFnc = () => {  …   }  No more issues with the this keyword!
- How Does The Web Work (Refresher)?
- Creating a Node.js Server  Using Node Core Modules  Working with Requests & Responses  (Basics)  Asynchronous Code & The Event Loop   How the Web Works  User / Client  (Browser)  http://my-page.com  Domain Lookup  Server   (at 10.212.212.12)  <Your Code>   Node.js, PHP, ASP.NET, …  Request   Response (e.g.
- Buffer  Work with    chunks of data!


  - { id: 'lddao1', user: { id: 2, email: 'manu@test.com' }, product: { id: 1, price: 120.99 } }

  - Stateless, client-independent API for exchanging data with higher query flexibility

  - Add some static (.js or .css) files to your project that should be required

  - A Protocol for Transferring Data which is understood by Browser and Server

  - Handle requests to “/” and ”/users” such that each request only has one

  - const user = User.create({ name: 'Max', age: 28, password: 'dsdg312' })
## 2. Principios e Tecnicas
- Single Thread, Event Loop & Blocking Code  <Your Code>  Single    JavaScript  Thread  Incoming Requests  Event Loop  Handle Event Callbacks  Worker Pool  Do the Heavy Lifting  Different    Thread(s)!  “fs”  Start  Send to  Trigger Callback   The Event Loop  Timers  Poll   Check  Close Callbacks  process.exit   refs == 0  Execute setTimeout,    setInterval Callbacks  Pending Callbacks  Execute I/O-related    Callbacks that were deferred  Retrieve new I/O events,  execute their callbacks   Execute setImmediate()  callbacks  I/O?
- Input & Output  Disk & Network    Operations (~Blocking  Operations)  Or defer execution  Execute all ‘close’ event  callbacks  Jump to Timer Execution   Asynchronous Code  Synchronous Code   Asynchronous Code  Callbacks   Promises   async / await  <Code>  <Code>  <Code>  <Code>  <Long-Taking Code>  <Code>  JavaScript & Node.js is  non-blocking   Node’s Module System  module.exports = …  exports is an alias for module.exports  But exports = { ... } won’t work!
- Using Middleware  Working with Requests & Responses  (Elegantly!)  Routing  Returning HTML Pages (Files)   npm & Packages  Local Project  <Your Code>  Dependencies (3rd Party)  npm Repository  Core Node Packages   express  body-parser  …  Installed & Managed via npm   What and Why?
- You want to focus on your Business Logic, not  on the nitty-gritty Details!
- Use a Framework for the Heavy Lifting!
- Framework: Helper functions,    tools & rules that help you build  your application!
- What Does Express.js Help You With?
- HTML files   •   If a request is directly made for a file    (e.g. a .css file is requested), you can    enable static serving for such files    via express.static()   Dynamic Content & Templates  Rendering more than Static HTML   What’s In This Module?
- Writing Good Async Code   Callback Hell  fs.readFile('path', (err, fileContent) => {  fs.writeFile('path', 'new content', (err) => {  …   })    });  Deeply nested callbacks can be hard to read, understand & maintain!
- Different Kinds of Databases (SQL vs  NoSQL)  Using SQL in a Node.js App   SQL vs NoSQL  Goal: Store Data and Make it Easily Accessible  Use a Database!


  - middleware functions that log something to the console and return one

  - Create an Express.js app which serves two HTML files (of your choice/

  - “/users” => Outputs an <ul> with the user names (or some error text)

  - Deeply nested callbacks can be hard to read, understand & maintain!
## 3. Aplicacoes Praticas
- SQL Databases  Quicker Access    than with a File  NoSQL Databases  e.g.
- Users  id   email   name  1   max@test.com   Maximilian Schwarzmüller  2   manu@test.com   Manuel Lorenz  3   …   …  Products  id   title   price  1   Chair   120.99  2   Book   10.99  3   …   …  description  A comfy chair  Exciting book!  …  Orders  id   product_id  1   1  2   1  3   2  user_id  2  1  2   Core SQL Database Characteristics  Data Schema  id   name   age  All Data (in a Table)  has to fit!
- Data Relations  One-to-One  One-to-Many  Many-to-Many  Tables are  connected   SQL Queries  SELECT * FROM users WHERE age > 28  SQL Keywords / Syntax   Parameters / Data   NoSQL  Shop  Users   Orders  { name: 'Max', age: 29 }  { name: 'Manu' }  { … }  { … }  Database  Collections  Documents  Schemaless!
- No / Few   Connections   Horizontal vs Vertical Scaling  Horizontal Scaling   Vertical Scaling  Add More Servers (and merge Data  into one Database)   Improve Server Capacity / Hardware   SQL vs NoSQL  SQL   NoSQL  Data uses Schemas  Relations!
- Data is distributed across multiple  tables  Horizontal scaling is difficult /    impossible; Vertical scaling is possible  Limitations for lots of (thousands) read  & write queries per second  Schema-less  No (or very few) Relations  Data is typically merged / nested in a  few collections  Both horizontal and vertical scaling is  possible  Great performance for mass read &  write requests   Associations  Product   User  Order  Cart   Belongs to Many  Belongs to Many  Has One  Has Many  Has Many  Has Many   Sequelize  Focus on Node.js, not on SQL   What is Sequelize?
- An Object-Relational Mapping Library  User  •   name   •   age   •   email   •   password  users  id   name   age   password  1   'Max'   28   'dsdg312'   Mapped  INSERT INTO users VALUES (1, 'Max', 28, 'dsdg312')  const user = User.create({ name: 'Max', age: 28, password: 'dsdg312' })   Core Concepts  Models   e.g.
- Using the MongoDB Driver in Node.js Apps   What?
- Humongous  Because it can store lots and lots of data   How it works  Shop  Users   Orders  { name: 'Max', age: 29 }  { name: 'Manu' }  { … }  { … }  Database  Collections  Documents  Schemaless!
- JSON (BSON) Data Format  {  "name": "Max",   "age": 29,   "address":  {  "city": "Munich"   },   "hobbies": [  { "name": "Cooking" },   { "name": "Sports" }   ]   }   What‘s NoSQL?
- Customers  Customers  Books   NoSQL Characteristics  NO Data Schema  Fewer Data Relations  { name, id, age }  { id, age }  You CAN relate documents  but you don‘t have to (and    you shouldn‘t do it too much  or your queries become  slow)  No Structure  required!

## 4. Topicos Avancados
- SQL vs NoSQL  SQL   NoSQL  Data uses Schemas  Relations!
- Using Mongoose in Node.js Apps   What is Mongoose?
- A Object-Document Mapping Library  User  •   name   •   age   •   email   •   password  users  id   name   age   password  1   'Max'   28   'dsdg312'   Mapped  db.collection('users').insertOne({name: 'Max', age: 28, password:  'dsdg312' })  const user = User.create({ name: 'Max', age: 28, password: 'dsdg312' })   Core Concepts  Schemas & Models   e.g.
- User  Server (Node App)  Frontend (Views)   Cookie  Set via Response    Header  Request   Include Cookies  Cookies are stored  on the client-side!
- User  Server (Node App)  Frontend (Views)   Cookie  Request  Sessions are stored  on the server-side!
- Session  Database   Session Storage  Associated with user/    client via cookie   When to use What  Cookies   Session  Stored on client  (Ad) Tracking  Authentication Session  Management  Stored on server  Authentication Status Management  (across Requests)  General Cross-Request Data  Management   Module Summary  Cookies   Sessions  •   Great for storing data on the client    (browser)   •   Do NOT store sensitive data here!
- What exactly is “Authentication”?
- Storing & Using Credentials  Protecting Routes   What is “Authentication”?
- User  Server  Database  View all Products   Create & Manage  Products   Place Orders  Open to anyone!
- Only available to logged-in users  Authentication   How is Authentication Implemented?

