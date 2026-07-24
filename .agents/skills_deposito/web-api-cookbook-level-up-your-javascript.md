---
name: web-api-cookbook-level-up-your-javascript-applicat
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Web Api Cookbook Level Up Your Javascript — Passos Operacionais

Conteudo extraido do livro 'Web Api Cookbook Level Up Your Javascript'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Asynchronous APIs  # Introduction  A lot of the APIs covered in this book are _asynchronous_.
- When you call one of these functions or methods, you might not get the result back right away.
- Different APIs have different mechanisms to get the result back to you when it’s ready.  ## Callback Functions  The most basic asynchronous pattern is a _callback function_.
- This is a function that you pass to an asynchronous API.
- When the work is complete, it calls your callback with the result.
- Callbacks can be used on their own or as part of other asynchronous patterns.  ## Events  Many browser APIs are _event_ based.
- An event is something that happens asynchronously.
- Some examples of events are:    * A button was clicked.    * The mouse was moved.    * A network request was completed.    * An error occurred.
- An event has a name, such as `click` or `mouseover`, and an object with data about the event that occurred.
- This might include information such as what element was clicked or an HTTP status code.


  - The views expressed in this work are those of the author and do not represent the publisher’s views. While the publisher and the author have used good faith efforts to ensure that the information and instructions contained in this work are accurate, the publisher and the author disclaim all responsibility for errors or omissions, including without limitation responsibility for damages resulting from the use of or reliance on this work. Use of the information and instructions contained in this work is at your own risk. If any code samples or other technology this work contains or describes is subject to open source licenses or the intellectual property rights of others, it is your responsibility to ensure that your use thereof complies with such licenses and/or rights.

  - Once the user has validation errors, you want to clear them as soon as the fields become valid. This is why `addValidation` listens for the `input` event—this is triggered as soon as the user types something in the input field. From there, you can immediately recheck the input’s validity. If it is now valid (`checkValidity` returns `true`), you can clear the error message. An input is only revalidated if the `data-should-validate` attribute is set to `true`. This attribute is added when validation fails during form submission, or when an element loses focus. This prevents validation errors from appearing before the user is done typing. Once the field loses focus, it starts revalidating on every change.

  - This book is here to help you get your job done. In general, if example code is offered with this book, you may use it in your programs and documentation. You do not need to contact us for permission unless you’re reproducing a significant portion of the code. For example, writing a program that uses several chunks of code from this book does not require permission. Selling or distributing examples from O’Reilly books does require permission. Answering a question by citing this book and quoting example code does not require permission. Incorporating a significant amount of example code from this book into your product’s documentation does require permission.

  - Some dialogs contain multiple buttons, and you want to run different code depending on which option they chose. For example, a confirmation modal might have Confirm and Cancel buttons. You’ll need to handle this yourself as well, adding click event listeners to the buttons. In each event listener, you can close the dialog by calling `close` on it. The `close` method is a built-in method on the dialog that takes an optional argument that lets you specify a “return value.” This can be checked later from the dialog’s `returnValue` property. This lets you pass data from the dialog back to the page that opened it.

  - [Chapter 2](ch02.html#ch_webStorage) covered data persistence with local or session storage. This works well for string values and serializable objects, but querying is not ideal and objects require JSON serialization. _IndexedDB_ is a newer, more powerful data persistence mechanism present in all modern browsers. An IndexedDB database contains _object stores_ (sort of like tables in a relational database). Each object store can have indexes on certain properties for more efficient querying. It also supports more advanced concepts like versioning and transactions.

  - An IndexedDB database has one or more object stores. All operations to add, remove, or query data are done on an object store. An object store is a collection of JavaScript objects that are persisted in the database. You can define _indexes_ on an object store. An index stores extra information to the database that lets you query objects by the indexed property. For example, suppose you are creating a database to store product information. Each product has a key, likely a product ID or SKU code. This lets you quickly search the database for a given product.
## 2. Principios e Tecnicas
- When you listen for an event, you provide a callback function that receives the event object as an argument.
- Objects that emit events implement the `EventTarget` interface, which provides the `addEventListener` and `removeEventListener` methods.
- To listen for an event on an element or other object, you can call `addEventListener` on it, passing the name of the event and a handler function.
- The callback is called every time the event is triggered until it is removed.
- A listener can be removed manually by calling `removeEventListener`, or in many cases listeners are automatically removed by the browser when objects are destroyed or removed from the DOM.  ## Promises  Many newer APIs use `Promise`s.
- A `Promise` is an object, returned from a function, that is a placeholder for the eventual result of the asynchronous action.
- Instead of listening for an event, you call `then` on a `Promise` object.
- You pass a callback function to `then` that is eventually called with the result as its argument.
- To handle errors, you pass another callback function to the `Promise`’s `catch` method.
- A `Promise` is _fulfilled_ when the operation completes successfully, and it is _rejected_ when there’s an error.


  - The dialog’s `showModal` method shows a _modal_ dialog. A modal dialog blocks the rest of the page until it is closed. This means if you open a modal dialog, clicking on other elements on the page will have no effect. With a modal dialog, the focus is “trapped” inside the dialog. Using the Tab key will cycle focus through the focusable elements in the dialog only. If this isn’t what you want, you can also call the `show` method. This will show a _modeless_ dialog, which still allows you to interact with the rest of the page while the dialog is open.

  - Objects that emit events implement the `EventTarget` interface, which provides the `addEventListener` and `removeEventListener` methods. To listen for an event on an element or other object, you can call `addEventListener` on it, passing the name of the event and a handler function. The callback is called every time the event is triggered until it is removed. A listener can be removed manually by calling `removeEventListener`, or in many cases listeners are automatically removed by the browser when objects are destroyed or removed from the DOM.

  - The Geolocation API can only get the device’s coordinates (latitude and longitude). It can’t determine the state, city, or specific address you are at. For this, you need a _geocoding_ API, which is not built into the browser. There are many external geocoding APIs available from vendors such as Microsoft and Google. Geocoding is the process of taking an address and converting it to latitude and longitude. Some of these services can also do _reverse geocoding_ , which takes latitude and longitude coordinates and converts them into an address.

  - Why do you need to handle this case? Well, if you close the dialog, it is not destroyed. It still exists in the DOM, just hidden, and still has the same `returnValue` set. Suppose you opened the dialog previously, and you clicked Confirm. The return value is now set to `confirm`. If you open the confirmation dialog again and cancel by pressing Escape, the return value will still be `confirm` when the `close` event is handled. To avoid this potential bug, you can use the `cancel` event handler to explicitly set the `returnValue` to `cancel`.
## 3. Aplicacoes Praticas
- The fulfilled value is passed as an argument to the `then` callback, or the rejected value is passed as an argument to the `catch` callback.
- There are a few key differences between events and `Promise`s:    * Event handlers are fired multiple times, whereas a `then` callback is executed only once.
- You can think of a `Promise` as a one-time operation.    * If you call `then` on a `Promise`, you’ll always get the result (if there is one).
- This is different from events where, if an event occurs before you add a listener, the event is lost.    * `Promise`s have a built-in error-handling mechanism.
- With events, you typically need to listen for an error event to handle error conditions.     # Working with Promises  ## Problem  You want to call an API that uses `Promise`s and retrieve the result.  ## Solution  Call `then` on the `Promise` object to handle the result in a callback function.
- To handle potential errors, add a call to `catch`.
- Imagine you have a function `getUsers` that makes a network request to load a list of users.
- This function returns a `Promise` that eventually resolves to the user list (see Example 1-1).  ##### Example 1-1.
- Using a `Promise`-based API               getUsers()        .then(          // This function is called when the user list has been loaded.          userList => {            console.log('User List:');            userList.forEach(user => {              console.log(user.name);            });          }        ).catch(error => {          console.error('Failed to load the user list:', error);        });  ## Discussion  The `Promise` returned from `getUsers` is an object with a `then` method.
- When the user list is loaded, the callback passed to `then` is executed with the user list as its argument.

## 4. Topicos Avancados
- This `Promise` also has a `catch` method for handling errors.
- If an error occurs while loading the user list, the callback passed to `catch` is called with the error object.
- Only one of these callbacks is called, depending on the outcome.  # Always Handle Errors  It’s important to always handle the error case of a `Promise`.
- If you don’t, and a `Promise` is rejected, the browser throws an exception for the unhandled rejection and could crash your app.
- To prevent an unhandled rejection from taking down your app, add a listener to the `window` object for the `unhandledrejection` event.
- If any `Promise` is rejected and you don’t handle it with a `catch`, this event fires.
- Here you can take action such as logging the error.  # Loading an Image with a Fallback  ## Problem  You want to load an image to display on the page.
- If there’s an error loading the image, you want to use a known good image URL as a fallback.  ## Solution  Create an `Image` element programmatically, and listen for its `load` and `error` events.
- If the `error` event triggers, replace it with the fallback image.
- Once either the requested image or the placeholder image loads, add it to the DOM when desired.

