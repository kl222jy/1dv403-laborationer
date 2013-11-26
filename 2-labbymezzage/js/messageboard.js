/*global window, document, console, Message */
"use strict";


var MessageBoard = function (name) {
    var elem, create, that, messages;
    
    this.name = name;
    
    messages = [];
//    var i, mess1 = new Message("Testmeddelande1", new Date()),
//        mess2 = new Message("Testmeddelande2", new Date()),
//        mess3 = new Message("Testmeddelande3", new Date()),
//        messages = [mess1, mess2, mess3];
//    console.log(mess1.toString());
//    mess1.text = "Testmeddelande\n då provar vi htmlfunktionen";
//    console.log(mess1.htmlText());
//    messages.push(new Message("tillagt med push", new Date()));
//                  
//    for (i = 0; i < messages.length; i += 1) {
//        console.log(messages[i].text);        //fungerar inte, men alert gör?
//    }
    this.sendMessage = function () {
        var input = document.querySelector("#" + name + " textarea").value;
        messages.push(new Message(input, new Date()));
        for (var i = 0; i < messages.length; i += 1) {
        console.log(messages[i].toString());
        }
    };
    that = this;
    elem = function (elemName, elemClass, elemId) {
        var elem = document.createElement(elemName);
        if (elemClass !== null) {
            elem.className = elemClass;
        }
        if (elemId !== null) {
            elem.setAttribute("id", elemId);
        }
        return elem;
    };
    create = function (name) {
        var boardFragment = document.createDocumentFragment(),
            article = elem("article", "msgBoard", name),
            msgSection = elem("section", "msgBox"),
            inputSection = elem("section", "inputBox"),
            form = elem("form"),
            textarea = elem("textarea"),
            content,
            main,
            inputButton;
        
        inputButton = elem("input");
        inputButton.type = "button";
        inputButton.value = "skriv";
        inputButton.onclick = function (e) { that.sendMessage(); return false; };
        
        content = boardFragment.appendChild(article).appendChild(msgSection);
        content = content.parentElement.appendChild(inputSection).appendChild(form).appendChild(textarea);
        content = content.parentElement.appendChild(inputButton);
        
        main = document.querySelector("main");
        main.appendChild(boardFragment);

        console.log(that);
    };

    
    

    
    create(name);
    
};




window.onload = function () {
    new MessageBoard("messageBoard1");
    new MessageBoard("messageBoard2");
    
};




//var fragment = document.createDocumentFragment();
//
//var contents = fragment.appendChild(document.createElement('blockquote'));
//contents = contents.appendChild(document.createElement('p'));
//contents.appendChild(document.createTextNode('Always two there are'));
//
//element.appendChild(fragment);