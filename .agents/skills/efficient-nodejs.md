---
name: efficient-node-js-samer-buna
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Efficient Node.js - Samer Buna — Passos Operacionais

Skill baseada no livro "Efficient Node.js - Samer Buna" (EN). Contem passos praticos e sequencias operacionais.

Use quando o usuario pedir orientacao pratica sobre: desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js.

---

## 1. ## The JavaScript Language


## 2. ## Executing Node Code


## 3. ## Using Built-In Modules


## 4. ## Using Packages


## 5. ## ES Modules


## 6. ## Asynchronous Operations


## 7. ## Options and Arguments


## 8. ## Environment Variables


## 9. ## REPL Mode


## 10. ## Resolving Modules


## 11. ## Loading Modules


## 12. ## Scoping Modules

## Conceitos Fundamentais

- The views expressed in this work are those of the author and do not represent the publisher’s views. While the publisher and the author have used good faith efforts to ensure that the information and instructions contained in this work are accurate, the publisher and the author disclaim all responsibility for errors or omissions, including without limitation responsibility for damages resulting from the use of or reliance on this work. Use of the information and instructions contained in this work is at your own risk. If any code samples or other technology this work contains or describes is subject to open source licenses or the intellectual property rights of others, it is your responsibility to ensure that your use thereof complies with such licenses and/or rights.
- The term _npm_ is mainly used to refer to the CLI (`npm` command) that ships with Node and provides tools to manage Node packages. There is also the [npm website](https://npmjs.com), which hosts the public registry of many open source npm packages. The npm registry is like a big warehouse full of JavaScript packages, offering many options for common features and functionalities that you might need to add to your projects. For example, if you need your project to handle web requests, handle web sockets, or connect to a database, you don’t need to build these features from scratch or deal with low-level code. You can download and use ready-made and often battle-tested generic solutions from a package registry and then build your custom needs on top of them.
- However, there’s often a thin line between these different types of tests. For example, to better unit-test the `getProductById` function, we should have the test add a product first, then try to find it. You might think of that as a kind of integration testing. The labels are not really that important. What’s important is having a strategy that suits the application and organizing testing code according to that strategy. In an application with isolated modules that don’t depend on each other at all, there’s little place for integration tests. The focus in that application should be on unit tests. For other types of applications, the team might opt to not write unit tests at all and rely completely on integration tests and e2e tests.
- Note how in this example I used the test `context` argument. This is passed to each test function and can be used to interact with the test runner. It has many of the `node:test` module features attached to it for convenience. The `context.mock` object is one of them. You can use it directly without importing `mock` from `node:test`. Some of the context methods have advantages over their noncontext matching methods. For example, by using `context.mock`, the test runner will automatically restore all mocked functionality once the test finishes. This is not true for using the `mock` object directly; in fact, with a direct `mock` object use, we’ll need to manually reset things after we’re done with them using a `mock.reset()` call.
- Let’s decipher this one a bit. The `readFileSync` function is part of the built-in `node:fs` module. It takes a file path as an argument and synchronously returns a binary representation of that file’s data. That’s why I chained a `.toString` call to it, to get the file’s actual content (in UTF-8). Furthermore, instead of hardcoding the file path in the command, I put the path as the first argument to the `node` command itself and used `process.argv[1]` to read the value of that argument (see the explanation of that in the next sidebar). This enables us to use the word-counting one-liner with any file. We can alias it (without the path argument) and then use the alias with a path argument, as shown in Figure 2-1:


  - The views expressed in this work are those of the author and do not represent the publisher’s views. While the publisher and the author have used good faith efforts to ensure that the information and instructions contained in this work are accurate, the publisher and the author disclaim all responsibility for errors or omissions, including without limitation responsibility for damages resulting from the use of or reliance on this work. Use of the information and instructions contained in this work is at your own risk. If any code samples or other technology this work contains or describes is subject to open source licenses or the intellectual property rights of others, it is your responsibility to ensure that your use thereof complies with such licenses and/or rights.

  - The term _npm_ is mainly used to refer to the CLI (`npm` command) that ships with Node and provides tools to manage Node packages. There is also the [npm website](https://npmjs.com), which hosts the public registry of many open source npm packages. The npm registry is like a big warehouse full of JavaScript packages, offering many options for common features and functionalities that you might need to add to your projects. For example, if you need your project to handle web requests, handle web sockets, or connect to a database, you don’t need to build these features from scratch or deal with low-level code. You can download and use ready-made and often battle-tested generic solutions from a package registry and then build your custom needs on top of them.

  - However, there’s often a thin line between these different types of tests. For example, to better unit-test the `getProductById` function, we should have the test add a product first, then try to find it. You might think of that as a kind of integration testing. The labels are not really that important. What’s important is having a strategy that suits the application and organizing testing code according to that strategy. In an application with isolated modules that don’t depend on each other at all, there’s little place for integration tests. The focus in that application should be on unit tests. For other types of applications, the team might opt to not write unit tests at all and rely completely on integration tests and e2e tests.
## Princípios e Técnicas

- This approach is understandable because Node.js is a low-level runtime environment. It does not offer comprehensive solutions but rather a collection of small essential modules that makes creating solutions easier and faster. For example, a full-fledged web server will have options like serving static files (like images, CSS files, etc.). With the Node.js built-in `http` module, you can build a web server that serves binary data, and with the Node.js built-in `fs` module, you can read the content of a file from the filesystem. You can combine both of these features to serve static assets by using your own JavaScript code. There’s no built-in Node.js way to serve static assets under a web server.
- Run scripts help developers automate running tasks. First, if you need to run something repeatedly for the project—for example, run all integration tests—you’ll have a simple and intuitive way of doing it, rather than trying to figure out the exact command every time. More importantly, an npm run script will make running this task consistent among all developers. All developers should be using the exact same command to run all integration tests. Even more importantly, if the way to run all integration tests needs to change, instead of manually announcing this change in a chat channel, you can communicate it with a change to _package.json_ , which is forever kept in the project’s Git history.
- However, we don’t need promises or callbacks to implement error forwarding. We can do it simply by making functions return either data (success) or error (failure), or even both (partial success). This can be done either by unifying the return into an object with both an `error` property and `data` property, or by using a simpler approach of returning either a `data` object or an `error` object. The latter is a bit tricky as every function would need to return two different types. I would recommend the latter approach only if the Node project is using TypeScript, which adds static typing to JavaScript. We’ll explore the basics of TypeScript for Node in [Chapter 10](ch10.html#chapter_10).
- Popular Node.js libraries that are not part of Node.js itself (such as Express.js, Next.js, and many others with _.js_ in their names) aim to provide nearly complete solutions within specific domains. For example, Express.js specializes in creating and running a web server (and serving static assets, and many other neat features). Practically, most developers will not be using Node.js on its own, so it makes sense for educational materials to focus on the libraries offering comprehensive solutions, so learners can skip to the good parts. The common thinking here is that only developers whose job is to write these libraries need to understand the underlying base layer of Node.js.
- This book is here to help you get your job done. In general, if example code is offered with this book, you may use it in your programs and documentation. You do not need to contact us for permission unless you’re reproducing a significant portion of the code. For example, writing a program that uses several chunks of code from this book does not require permission. Selling or distributing examples from O’Reilly books does require permission. Answering a question by citing this book and quoting example code does not require permission. Incorporating a significant amount of example code from this book into your product’s documentation does require permission.


  - Run scripts help developers automate running tasks. First, if you need to run something repeatedly for the project—for example, run all integration tests—you’ll have a simple and intuitive way of doing it, rather than trying to figure out the exact command every time. More importantly, an npm run script will make running this task consistent among all developers. All developers should be using the exact same command to run all integration tests. Even more importantly, if the way to run all integration tests needs to change, instead of manually announcing this change in a chat channel, you can communicate it with a change to _package.json_ , which is forever kept in the project’s Git history.

  - However, we don’t need promises or callbacks to implement error forwarding. We can do it simply by making functions return either data (success) or error (failure), or even both (partial success). This can be done either by unifying the return into an object with both an `error` property and `data` property, or by using a simpler approach of returning either a `data` object or an `error` object. The latter is a bit tricky as every function would need to return two different types. I would recommend the latter approach only if the Node project is using TypeScript, which adds static typing to JavaScript. We’ll explore the basics of TypeScript for Node in [Chapter 10](ch10.html#chapter_10).

  - Popular Node.js libraries that are not part of Node.js itself (such as Express.js, Next.js, and many others with _.js_ in their names) aim to provide nearly complete solutions within specific domains. For example, Express.js specializes in creating and running a web server (and serving static assets, and many other neat features). Practically, most developers will not be using Node.js on its own, so it makes sense for educational materials to focus on the libraries offering comprehensive solutions, so learners can skip to the good parts. The common thinking here is that only developers whose job is to write these libraries need to understand the underlying base layer of Node.js.

  - This book is here to help you get your job done. In general, if example code is offered with this book, you may use it in your programs and documentation. You do not need to contact us for permission unless you’re reproducing a significant portion of the code. For example, writing a program that uses several chunks of code from this book does not require permission. Selling or distributing examples from O’Reilly books does require permission. Answering a question by citing this book and quoting example code does not require permission. Incorporating a significant amount of example code from this book into your product’s documentation does require permission.
## Aplicações Práticas

- Regular testing of code keeps it healthy and makes maintaining it easier. It also increases the confidence of its maintainers to make changes. Making changes to untested code is a recipe for disaster. A new feature in module X might break other features in module Y. You can’t keep the dependencies in your head. You can’t test all the code manually every time there is a change. There is no way around it. You have to write code to test your code, and yes, your testing code might have problems too. Tests might introduce false negatives and false positives. That’s why it’s extremely important to get the tests right. That is what this chapter is all about.
- We can also scale an application by decomposing it based on functionalities and services. This means having multiple applications with different code bases and sometimes with their own dedicated databases and UIs. This strategy is commonly associated with the term _microservice_ , where _micro_ indicates that those services should be as small as possible (in reality, the size of the service is not what’s important but rather the enforcement of loose coupling and high cohesion between services). The implementation of this strategy is often not easy and could result in long-term unexpected problems, but when done right the advantages are great.
- Any JavaScript code you write in Node has to be placed in the call stack for V8 to execute it. The call stack is single-threaded, which means when there are functions in the call stack, everything else (including handler functions for asynchronous operations) will have to wait until the call stack is available again. That’s why it’s important to never write code that will keep the call stack busy (like a long-running `for` loop). As long as the call stack is busy, all your asynchronous operation handlers will be waiting. Any code that needs to run for a long time should be executed outside of the main thread and its one call stack.
- Data flow in streams is another concept you should understand. As long as the two people washing the dishes are handling their tasks at a relatively similar rate, the flow of dishes from dirty to scrubbed to rinsed works fine. But let’s say the scrubber needs to work on one particularly dirty dish and scrub it really well; the rinser in that case might need to pause a bit before they get the next dish. Similarly, if the rinser is behind, a pile of scrubbed dishes might start to accumulate, and the scrubber might need to pause. These are some of the challenging aspects of using streams. We’ll talk more about that shortly.
- The npm tool has long been the default for managing packages and their dependencies in Node projects, but today there are a few alternatives, like Yarn, pnpm, and JSR. These alternatives to npm have their unique features and advantages. They often offer improvements on performance, disk space usage, and version management. This healthy competition has pushed npm to improve as well. In this book we’re only covering npm, but you might end up using a different package manager. The basic concepts of package management are all similar, but the command interfaces and what happens behind the scenes are a bit different.

## Principios e Tecnicas

  - Note how in this example I used the test `context` argument. This is passed to each test function and can be used to interact with the test runner. It has many of the `node:test` module features attached to it for convenience. The `context.mock` object is one of them. You can use it directly without importing `mock` from `node:test`. Some of the context methods have advantages over their noncontext matching methods. For example, by using `context.mock`, the test runner will automatically restore all mocked functionality once the test finishes. This is not true for using the `mock` object directly; in fact, with a direct `mock` object use, we’ll need to manually reset things after we’re done with them using a `mock.reset()` call.

  - Let’s decipher this one a bit. The `readFileSync` function is part of the built-in `node:fs` module. It takes a file path as an argument and synchronously returns a binary representation of that file’s data. That’s why I chained a `.toString` call to it, to get the file’s actual content (in UTF-8). Furthermore, instead of hardcoding the file path in the command, I put the path as the first argument to the `node` command itself and used `process.argv[1]` to read the value of that argument (see the explanation of that in the next sidebar). This enables us to use the word-counting one-liner with any file. We can alias it (without the path argument) and then use the alias with a path argument, as shown in Figure 2-1:

  - This approach is understandable because Node.js is a low-level runtime environment. It does not offer comprehensive solutions but rather a collection of small essential modules that makes creating solutions easier and faster. For example, a full-fledged web server will have options like serving static files (like images, CSS files, etc.). With the Node.js built-in `http` module, you can build a web server that serves binary data, and with the Node.js built-in `fs` module, you can read the content of a file from the filesystem. You can combine both of these features to serve static assets by using your own JavaScript code. There’s no built-in Node.js way to serve static assets under a web server.

