---
name: javascript-and-jquery-interactive-front-end-web-de
description: >-
  Passos operacionais extraidos — desenvolvimento web, full-stack, JavaScript, TypeScript, React, Node.js (EN).
---

# Javascript And Jquery Interactive Front — Passos Operacionais

Conteudo extraido do livro 'Javascript And Jquery Interactive Front'. Contem passos, tecnicas e principios baseados na obra original.

## 1. Conceitos Fundamentais
- Requests to the Publisher for  permission should be addressed to the Permissions Department, John Wiley & Sons, Inc .. 111 River Street.
- Hoboken, NJ 07030, (201) 748·  6011, fax (201) 748-6008, or online at http://www.wiley.com/go/permissions.
- Limit of Liability/Disclaimer of Warranty: The publisher and the author make no representations or warranties with respect to the accuracy  or completeness of the contents of this work and specifically disclaim all warranties, including without limitation warranties of fitness for  a particular purpose.
- No warranty may be created or extended by sales or promotional materiais.
- The advice and strategies contained  herein may not be suitable for every situation.
- This work is sold with the understanding that the publisher is not engaged in rendering legal,  accounting, or other professional services.
- If professional assistance is required, the services of a competent professional person should  be sought Neither the publisher nor the author shall be liable for damages arising herefrom.
- The fact that an organization or Web site is  referred to in this work as a citation and/or a potential source of further information does not mean that the author or the publisher endorses  the information the organization or website may provide or recommendations it may make.
- Further. readers should be aware that Internet  websites listed in this work may have changed or disappeared between when this work was written and when it is read.
- For general information on our other products and services please contact our Customer Care Department within the United States at (877)  762·2974. outside the United States at (317) 572·3993 or fax (317) 572-4002.


  - •••••"•••••••••••••••••••••o•••-•• .. "'''"-''''"''''"''''''''"'''''''"'''''''''' '''''' ·•••••••••"'''''""*'''''''''''''''''''''''''''''''''''''''''''''' .. ''''''''''''''''''''''''''''"' ' ''''' ' ' ' '''' '' ' ''''''''''''"'''''''''''''''''''''''''''_.,_,,_.,,,,, ,,.,,,,,,,.,,.,,,,,,,,,

  - ................................................................................................................. -........................................................................................................................................................................ .

  - ...........................................................................................................................................................................................................................................................................................

  - ................................................................................................................................... ..................................................................................................................... ·······························

  - ...................................................................... .................................................................................................................................................................

  - ............................................................................ ~?P..:.~.~-~-1?.~~i-~.?-~.~.!.!~~.~=--~~.:~a..~.1.:~'. .. ~~~.: .. ~.:.!.~.?~ .. ~~t.~.~~.~.?.~.~L ............................................. .
## 2. Principios e Tecnicas
- Wiley publishes in a variety of print and electronic formats and by print-on-demand.
- Some material included with standard print versions of  this book may not be included in e-books or in print-on-demand.
- If this book refers to media such as a CD or DVD that is not included in the  version you purchased, you may download this material at http://booksupport.wiley.com.
- For more information about Wiley products, visit  www.wiley.com.
- Library of Congress Control Number: 2013933932  Trademarks: Wiley and the Wiley logo are trademarks or registered trademarks of John Wiley & Sons, Inc. and/or its affiliates, in the United  States and other countries, and may not be used without written permission.
- JavaScript is a registered trademark of Oracle America, Inc.
- All  other trademarks are the property of their respective owners.
- John Wiley & Sons, Inc. is not associated with any product or vendor mentioned  in this book.
- CREDITS  For John Wiley & Sons, Inc.
- Executive Editor    Carol Long  Project Editor    Kevin Kent  Production Editor    Daniel Scribner  Editorial M anager    Mary Beth Wakefield  Associate Director of Marketing    David Mayhew  Marketing Manager    Lorna Mein  Business Manager    Amy Knies  Vice President and Executive    Group Publisher    Richard Swadley  Associate Publisher  Jim Minatel  Project Coordinator, Cover    Todd Klemme  For Wagon Ltd.


  - OoOOoOOOOOOOOOOOOOOoO OOo-+o oooo+o .. + .. ooo·• ·ooo o+ooooOoo00000000>00000+0000000000000000000000000000000-0000-0000 .. 00000HOOOO+O>Ooo·Ooo ooooooooooo 00000000000000 ............................

  - . . . ... ······-······ ........... ... ....................................... .. ... . ................................................................................... .

  - ............................. . ..................... . ......... . .........................................................................................

  - ....... ....... ........... .... .... ....... .... ... . .... ... .... .... ... . .... ....... .... .... .... ••ljij; .................................... .
## 3. Aplicacoes Praticas
- You will also learn about    jQuery because it makes writing JavaScript a lot easier.
- To get the most out of this book, you will need to know how to build web pages using HTML    and CSS.
- Beyond that. no prior experience with programming is necessary.
- Learning to    program with JavaScript involves:  1  Understanding some basic    programming concepts and    the terms that JavaScript    programmers use to    describe them.  2  Learning the language itself,    and, like all languages, you    need to know its vocabulary    and how to structure your    sentences.  3  Becoming familiar with how    it is applied by looking at    examples of how JavaScript    is commonly used in    websites today.
- The only equipment you need to use this book are a computer with a modern web browser    installed, and your favorite code editor, (e.g., Notepad, TextEdit.
- Sublime Text. or Coda).  0 INTRODUCTION   .....,. __ .. _..,._ .........    ... ,, ____ ... ...__... __ .,..    ==---'"'""· --·  Introduction pages come at the beginning of each    chapter.
- They introduce the key topics you will learn  about.
- ACCESSING ELEMENTS  \-----...    _ ......... --...... ,    -·-··-··--... __ ..,_,,,_,._    ~~~E-:;:.:~ ~·§.?=    .. ~  .. -----··    -·- -... -   \--·--   \------   _____ ..    \----   \---   \-----  :  \-----.. -   \-------   ~~;,:?~  -·-·-.-.. -... -   \---·---........... __    \-- .. ·-·-·----   -·---·-   .... _ .. _    ........ __ _    \--.. -··-·-·--  E"":::.:::=:,,;...-==--   .... _    .. _,_    .......  ~  -__ .,. ____ _    ____    .... _,._    \-----   __ ,.._,_ .. __ _    \---·----  Background pages appear on white.
- They explain    the context of the topics covered that are discussed    in each chapter.
- EXAMPLE  ~6.iSO"·  .. ------   \--... ... .;-••• ··-  .... ___ ..... ·--·    ___ .. ..._ .. _    .... _  .. ·---   ..........    . -!-= ....... :..:;-_-:,:-;--·    .... -----·--·-...    ·--·-... -   .. __ _    ,, ____ ..... _  Example pages bring together the topics you have  learned in that chapter and demonstrate how they    can be applied.

## 4. Topicos Avancados
- CREATING OBJECTS USING    LITERAL NOTATION  \--   -   \------  -   -  CREATING MORE    OBJECT LITERALS    ..
- Reference pages introduce key pieces of JavaScript.
- HTML code is shown in blue, CSS code in pink, and    JavaScript in green.
- Diagram and infographics pages are shown on a    dark background.
- They provide a simple, visual    reference to topics discussed.
- Summary pages come at the end of each chapter.
- They remind you of the key topics that were covered  in each chapter.
- INTRODUCTION 0   1    ACCESS CONTENT  You can use JavaScript to select any    element, attribute, or text from an    HTML page.
- For example:  •    Select the text inside all of the <hl>    elements on a page  •    Select any elements that have a    c 1 ass attribute with a value of note  •    Find out what was entered into a    text input whose id attribute has a    value of ema i 1    2    MODIFY CONTENT  You can use JavaScript to add  elements, attributes, and text to the    page, or remove them.
- For example:  •    Add a paragraph of text after the    first <hl> element  •    Change the value of c 1 ass    attributes to trigger new CSS rules    for those elements  •    Change the size or position of an    <i mg> element   3    PROGRAM RULES  You can specify a set of steps for    the browser to follow (like a recipe),    which allows it to access or change the    content of a page.

