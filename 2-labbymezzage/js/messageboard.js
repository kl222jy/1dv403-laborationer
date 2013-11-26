"use strict";
/*global window, document, alert, console, Message */


var MessageBoard = function (name) {
    var elem, renderMsgBox, that, renderMessage, renderMessages;
    
    this.name = name;
    
    this.messages = [];

    that = this;
    this.sendMessage = function () {
        var input = document.querySelector("#" + name + " textarea").value,
            messages = that.messages;
        
        messages.push(new Message(input, new Date()));
        renderMessages();
    };
    
    this.removeMessage = function (index) {
        that.messages.splice(index, 1);
        renderMessages();
    };
    elem = function (elemName, elemClass, elemId) {
        var elem = document.createElement(elemName);
        if (elemClass) {
            elem.className = elemClass;
        }
        if (elemId) {
            elem.setAttribute("id", elemId);
        }
        return elem;
    };
    
    renderMsgBox = function (name) {
        var boardFragment = document.createDocumentFragment(),
            article = elem("article", "msgBoard", name),
            msgSection = elem("section", "msgBox"),
            inputSection = elem("section", "inputBox"),
            form = elem("form"),
            textarea = elem("textarea"),
            content,
            main,
            inputButton,
            header,
            msgCountElement;

        msgCountElement = elem("p", "msgCounter");
        msgCountElement.appendChild(document.createTextNode("Antal meddelanden: 0"));

        
        header = elem("header", "msgBoxHeader");
        header.appendChild(document.createTextNode(name));
        
        article.setAttribute("draggable", "true");
        
        inputButton = elem("input");
        inputButton.type = "button";
        inputButton.value = "skriv";
        inputButton.onclick = function (e) { that.sendMessage(); document.querySelector("#" + that.name + " textarea").value = ""; return false; };
        
        
        boardFragment = boardFragment.appendChild(article);
        boardFragment.appendChild(header);
        boardFragment.appendChild(msgSection);
//        boardFragment = boardFragment.appendChild(inputSection);
//        boardFragment.appendChild(form).appendChild(textarea).parentElement.appendChild(inputButton);
//        boardFragment.appendChild(msgCountElement);
        boardFragment.appendChild(inputSection).appendChild(form).appendChild(textarea).parentElement.appendChild(inputButton);
//        boardFragment.appendChild(msgCountElement);
        
        main = document.querySelector("main");
        main.appendChild(boardFragment);
    };

    renderMessage = function (message, date, index) {
        var msgItem = elem("article", "msgItem"),
            msgContent = elem("section", "msgContent"),
            footer = elem("footer", "msgInfo"),
            msgFragment = document.createDocumentFragment(),
            msgTextNode = document.createTextNode(message),
            msgDateNode = document.createTextNode(date),
            msgDelete = elem("img", "imgDelete"),
            msgTime = elem("img", "imgTime"),
            content,
            msgBox;
        
//        msgDelete.href = "../img/delete.png";
        msgDelete.setAttribute("src", "img/delete.png");
        msgDelete.alt = "Delete";
        msgDelete.onclick = function () {
            that.removeMessage(index);
        };
        
//        msgTime.href = "../img/time.png";
        msgTime.setAttribute("src", "img/time.png");
        msgTime.alt = "Time";
        msgTime.onclick = function () {
            alert(that.messages[index].dateText());
        };
        
        
        msgFragment = msgFragment.appendChild(msgItem);
        msgFragment.appendChild(msgContent).appendChild(msgTextNode);
        msgFragment.appendChild(footer).appendChild(msgDateNode);
        msgFragment.appendChild(msgDelete);
        msgFragment.appendChild(msgTime);

        return msgFragment;
    };
    
    renderMessages = function () {
        var i, message, msgItems, msgBox, msgCounter, msgCountElement, msgList = document.createDocumentFragment();

        for (i = 0; i < that.messages.length; i += 1) {
            message = renderMessage(that.messages[i].htmlText(), that.messages[i].date.toTimeString(), i);
            msgList.appendChild(message);
        }
        msgBox = document.querySelector("#" + that.name + " .msgBox");
        msgBox.innerHTML = "";
        msgBox.appendChild(msgList);
        
        msgBox.scrollTop = msgBox.scrollHeight;
        
//        msgBox.replaceChild(that.messages.length, msgBox.querySelector("#" + that.name + " .msgCounter").TEXT_NODE);

        msgCountElement = elem("p", "msgCounter");
        msgCountElement.appendChild(document.createTextNode("Antal meddelanden: " + that.messages.length));
        
        if (document.querySelector("#" + that.name + " .msgCounter")) {
//            document.querySelector("#" + that.name + " .msgCounter").text = "blubb";
//            msgBox.querySelector("msgCounter")
//            document.removeChild(document.querySelector(".msgCounter").childNodes);
//            document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
//            msgBox.querySelector(".msgCounter").replace("/d", that.messages.length);
            document.querySelector("#" + that.name + " .inputBox").removeChild(document.querySelector("#" + that.name + " .msgCounter"));
            document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
        } else {
            document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
        }
    };

    
    renderMsgBox(name);
    
};

window.onload = function () {
    new MessageBoard("messageBoard1");
    new MessageBoard("messageBoard2");
};
