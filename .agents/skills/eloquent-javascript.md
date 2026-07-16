---
name: eloquent-javascript-marijn-haverbeke
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Eloquent Javascript — Passos Operacionais

Conteudo extraido do livro 'Eloquent Javascript'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- We believe we are making it in our own image...
- But the computer is not really like us.
- It is a projection of a very slim part of ourselves: that portion devoted to logic, order, rule, and clarity. >  > Ellen Ullman, Close to the Machine: Technophilia and its Discontents  This is a book about instructing computers.
- Computers are about as common as screwdrivers today, but they are quite a bit more complex, and making them do what you want them to do isn’t always easy.
- If the task you have for your computer is a common, well-understood one, such as showing you your email or acting like a calculator, you can open the appropriate application and get to work.
- But for unique or open-ended tasks, there often is no appropriate application.
- That is where programming may come in. _Programming_ is the act of constructing a _program_ —a set of precise instructions telling a computer what to do.
- Because computers are dumb, pedantic beasts, programming is fundamentally tedious and frustrating.
- Fortunately, if you can get over that fact—and maybe even enjoy the rigor of thinking in terms that dumb machines can deal with—programming can be rewarding.
- It allows you to do things in seconds that would take _forever_ by hand.


  - We can represent a two-by-two table in JavaScript with a four-element array (`[76, 9, 4, 1]`). We could also use other representations, such as an array containing two two-element arrays (`[[76, 9], [4, 1]]`) or an object with property names like `"11"` and `"01"`, but the flat array is simple and makes the expressions that access the table pleasantly short. We’ll interpret the indices to the array as two-bit binary numbers, where the leftmost (most significant) digit refers to the squirrel variable and the rightmost (least significant) digit refers to the event variable. For example, the binary number `10` refers to the case where Jacques did turn into a squirrel, but the event (say, “pizza”) didn’t occur. This happened four times. And since binary `10` is 2 in decimal notation, we will store this number at index 2 of the array.

  - Can you see how the program works at this point? The first two lines give two memory locations their starting values: `total` will be used to build up the result of the computation, and `count` will keep track of the number that we are currently looking at. The lines using `compare` are probably the most confusing ones. The program wants to see whether `count` is equal to 11 to decide whether it can stop running. Because our hypothetical machine is rather primitive, it can only test whether a number is zero and make a decision based on that. It therefore uses the memory location labeled `compare` to compute the value of `count - 11` and makes a decision based on that value. The next two lines add the value of `count` to the result and increment `count` by 1 every time the program decides that `count` is not 11 yet.

  - The `position` style property influences layout in a powerful way. By default it has a value of `static`, meaning the element sits in its normal place in the document. When it is set to `relative`, the element still takes up space in the document, but now the `top` and `left` style properties can be used to move it relative to that normal place. When `position` is set to `absolute`, the element is removed from the normal document flow—that is, it no longer takes up space and may overlap with other elements. Also, its `top` and `left` properties can be used to absolutely position it relative to the top-left corner of the nearest enclosing element whose `position` property isn’t `static`, or relative to the document if no such enclosing element exists.

  - The indentation indicates the depth of the call stack. The first time `find` is called, the function starts by calling itself to explore the solution that starts with `(1 + 5)`. That call will further recurse to explore _every_ continued solution that yields a number less than or equal to the target number. Since it doesn’t find one that hits the target, it returns `null` back to the first call. There the `??` operator causes the call that explores `(1 * 3)` to happen. This search has more luck—its first recursive call, through yet _another_ recursive call, hits upon the target number. That innermost call returns a string, and each of the `??` operators in the intermediate calls passes that string along, ultimately returning the solution.

  - The `VillageState` class lives in the `state` module. It depends on the `./roads` module because it needs to be able to verify that a given road exists. It also needs `randomPick`. Since that is a three-line function, we could just put it into the `state` module as an internal helper function. But `randomRobot` needs it too. So we’d have to either duplicate it or put it into its own module. Since this function happens to exist on NPM in the `random-item` package, a reasonable solution is to just make both modules depend on that. We can add the `runRobot` function to this module as well, since it’s small and closely related to state management. The module exports both the `VillageState` class and the `runRobot` function.

  - To do this, the function performs one of three actions. If the current number is the target number, the current history is a way to reach that target, so it is returned. If the current number is greater than the target, there’s no sense in further exploring this branch because both adding and multiplying will only make the number bigger, so it returns `null`. Finally, if we’re still below the target number, the function tries both possible paths that start from the current number by calling itself twice, once for addition and once for multiplication. If the first call returns something that is not `null`, it is returned. Otherwise, the second call is returned, regardless of whether it produces a string or `null`.
## 2. Principios e Tecnicas
- It is a way to make your computer tool do things that it couldn’t do before.
- On top of that, it makes for a wonderful game of puzzle solving and abstract thinking.
- Most programming is done with programming languages.
- A _programming language_ is an artificially constructed language used to instruct computers.
- It is interesting that the most effective way we’ve found to communicate with a computer borrows so heavily from the way we communicate with each other.
- Like human languages, computer languages allow words and phrases to be combined in new ways, making it possible to express ever new concepts.
- At one point, language-based interfaces, such as the BASIC and DOS prompts of the 1980s and 1990s, were the main method of interacting with computers.
- For routine computer use, these have largely been replaced with visual interfaces, which are easier to learn but offer less freedom.
- But if you know where to look, the languages are still there.
- One of them, _JavaScript_ , is built into every modern web browser—and is thus available on almost every device.


  - Relatedly, stateful objects are sometimes useful or even necessary, but if something can be done with a function, use a function. Several of the INI file readers on NPM provide an interface style that requires you to first create an object, then load the file into your object, and finally use specialized methods to get at the results. This type of thing is common in the object-oriented tradition, and it’s terrible. Instead of making a single function call and moving on, you have to perform the ritual of moving your object through its various states. And because the data is now wrapped in a specialized object type, all code that interacts with it has to know about that type, creating unnecessary interdependencies.

  - There have been several versions of JavaScript. ECMAScript version 3 was the widely supported version during JavaScript’s ascent to dominance, roughly between 2000 and 2010. During this time, work was underway on an ambitious version 4, which planned a number of radical improvements and extensions to the language. Changing a living, widely used language in such a radical way turned out to be politically difficult, and work on the version 4 was abandoned in 2008. A much less ambitious version 5, which made only some uncontroversial improvements, came out in 2009. In 2015, version 6 came out, a major update that included some of the ideas planned for version 4. Since then we’ve had new, small updates every year.

  - A _pure_ function is a specific kind of value-producing function that not only has no side effects but also doesn’t rely on side effects from other code—for example, it doesn’t read global bindings whose value might change. A pure function has the pleasant property that, when called with the same arguments, it always produces the same value (and doesn’t do anything else). A call to such a function can be substituted by its return value without changing the meaning of the code. When you are not sure that a pure function is working correctly, you can test it by simply calling it and know that if it works in that context, it will work in any context. Nonpure functions tend to require more scaffolding to test.

  - There are those who will say _terrible_ things about JavaScript. Many of these things are true. When I was required to write something in JavaScript for the first time, I quickly came to despise it. It would accept almost anything I typed but interpret it in a way that was completely different from what I meant. This had a lot to do with the fact that I did not have a clue what I was doing, of course, but there is a real issue here: JavaScript is ridiculously liberal in what it allows. The idea behind this design was that it would make programming in JavaScript easier for beginners. In actuality, it mostly makes finding problems in your programs harder because the system will not point them out to you.
## 3. Aplicacoes Praticas
- This book will try to make you familiar enough with this language to do useful and amusing things with it.  ## On programming  Besides explaining JavaScript, I will introduce the basic principles of programming.
- Programming, it turns out, is hard.
- The fundamental rules are simple and clear, but programs built on top of these rules tend to become complex enough to introduce their own rules and complexity.
- You’re building your own maze, in a way, and you can easily get lost in it.
- There will be times when reading this book feels terribly frustrating.
- If you are new to programming, there will be a lot of new material to digest.
- Much of this material will then be _combined_ in ways that require you to make additional connections.
- It is up to you to make the necessary effort.
- When you are struggling to follow the book, do not jump to any conclusions about your own capabilities.
- You are fine—you just need to keep at it.

## 4. Topicos Avancados
- Take a break, reread some material, and make sure you read and understand the example programs and exercises.
- Learning is hard work, but everything you learn is yours and will make further learning easier.  > When action grows unprofitable, gather information; when information grows unprofitable, sleep. >  > Ursula K.
- Le Guin, The Left Hand of Darkness  A program is many things.
- It is a piece of text typed by a programmer, it is the directing force that makes the computer do what it does, it is data in the computer’s memory, and at the same time it controls the actions performed on this memory.
- Analogies that try to compare programs to familiar objects tend to fall short.
- A superficially fitting one is to compare a program to a machine—lots of separate parts tend to be involved, and to make the whole thing tick, we have to consider the ways in which these parts interconnect and contribute to the operation of the whole.
- A computer is a physical machine that acts as a host for these immaterial machines.
- Computers themselves can do only stupidly straightforward things.
- The reason they are so useful is that they do these things at an incredibly high speed.
- A program can ingeniously combine an enormous number of these simple actions to do very complicated things.

