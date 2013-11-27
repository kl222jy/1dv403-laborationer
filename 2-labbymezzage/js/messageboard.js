"use strict";
/*global window, document, getComputedStyle, alert, confirm, console, Message */


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
        if (confirm("Är du helt säker på att du vill ta bort meddelandet?")) {
            that.messages.splice(index, 1);
            renderMessages();
        }
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
            msgCountElement,
            offsetX,
            offsetY;

        msgCountElement = elem("p", "msgCounter");
        msgCountElement.appendChild(document.createTextNode("Antal meddelanden: 0"));

        
        header = elem("header", "msgBoxHeader");
        header.appendChild(document.createTextNode(name));
        
//        article.setAttribute("draggable", "true");
//        article.ondragstart = function (e) {
//            var css = getComputedStyle(e.target);
//            e.dataTransfer.setData("text/plain", (parseInt(css.getPropertyValue("left"), 10) - e.clientX) + ", " + (parseInt(css.getPropertyValue("top"), 10) - e.clientY));
//        };
//        article.ondrop = function (e) {
//            var offset = e.dataTransfer.getData("text/plain").split(", ");
//            this.style.left = (e.clientX + parseInt(offset[0], 10)) + 'px';
//            this.style.top = (e.clientY + parseInt(offset[1], 10)) + 'px';
//            e.preventDefault();
//            return false;
//        };
//        article.dragover = function (e) {
//            e.preventDefault();
//        };
   
        inputButton = elem("input");
        inputButton.type = "button";
        inputButton.value = "skriv";
        inputButton.onclick = function (e) { that.sendMessage(); document.querySelector("#" + that.name + " textarea").value = ""; return false; };
        textarea.onkeypress = function (e2) {
            if (e2.keyCode === 13  && (!e2.shiftKey)) {
                that.sendMessage();
                document.querySelector("#" + that.name + " textarea").value = "";
                return false;
            } else {
                var e = window.event;
            }
        };
                
                
        
        
        boardFragment = boardFragment.appendChild(article);
        boardFragment.appendChild(header);
        boardFragment.appendChild(msgSection);
        boardFragment.appendChild(inputSection).appendChild(form).appendChild(textarea).parentElement.appendChild(inputButton);
        
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

        msgDelete.setAttribute("src", "img/delete.png");
        msgDelete.alt = "Delete";
        msgDelete.onclick = function () {
            that.removeMessage(index);
        };

        msgTime.setAttribute("src", "img/time.png");
        msgTime.alt = "Time";
        msgTime.onclick = function () {
            alert(that.messages[index].dateText());
        };
        
        msgContent.innerHTML = message;

        msgFragment = msgFragment.appendChild(msgItem);
        msgFragment.appendChild(msgDelete);
        msgFragment.appendChild(msgTime);
        msgFragment.appendChild(msgContent);         //.innerHTML(message);        //.innerHTML(message);         //.appendChild(msgTextNode); 
        msgFragment.appendChild(footer).appendChild(msgDateNode);

        
        return msgFragment;
    };
    
    renderMessages = function () {
        var i, message, msgItems, msgBox, msgCounter, msgCountElement, msgList = document.createDocumentFragment();

        for (i = 0; i < that.messages.length; i += 1) {
            message = renderMessage(that.messages[i].htmlText(), that.messages[i].date.toLocaleTimeString(), i);
            msgList.appendChild(message);
        }
        msgBox = document.querySelector("#" + that.name + " .msgBox");
        msgBox.innerHTML = "";
        msgBox.appendChild(msgList);
        
        msgBox.scrollTop = msgBox.scrollHeight;

        msgCountElement = elem("p", "msgCounter");
        msgCountElement.appendChild(document.createTextNode("Antal meddelanden: " + that.messages.length));
        
        if (document.querySelector("#" + that.name + " .msgCounter")) {
            document.querySelector("#" + that.name + " .inputBox").removeChild(document.querySelector("#" + that.name + " .msgCounter"));
            document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
        } else {
            document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
        }
    };

    
    renderMsgBox(name);
    
};

window.onload = function () {
//    new MessageBoard("messageBoard1");
//    new MessageBoard("messageBoard2");
    var i = 1,
        menuItems = document.querySelectorAll("nav img");
    
    menuItems[0].onclick = function () {
        document.querySelector("main").innerHTML = "";
    };
    menuItems[1].onclick = function () {
        new MessageBoard("messageBoard" + i);
        i += 1;
    };
    menuItems[2].onclick = function () {
        alert("Inte tillgänglig förrän efter nästa laboration");
    };
};


