/*global window, console, Message */
"use strict";
window.onload = function () {
    var MessageBoard = function (name) {
        this.name = name;
        var i, mess1 = new Message("Testmeddelande1", new Date()),
            mess2 = new Message("Testmeddelande2", new Date()),
            mess3 = new Message("Testmeddelande3", new Date()),
            messages = [mess1, mess2, mess3];
        console.log(mess1.toString());
        mess1.text = "Testmeddelande\n då provar vi htmlfunktionen";
        console.log(mess1.htmlText());
        messages.push(new Message("tillagt med push", new Date()));
                      
        for (i = 0; i < messages.length; i += 1) {
            console.log(messages[i].text);        //fungerar inte, men alert gör?
        }
    };

    new MessageBoard("board1");
//    new MessageBoard("board2");
};