/*global window, event, document, getComputedStyle, alert, confirm, console, Message, setTimeout, DOMParser */

(function (KLOS) {
    "use strict";
    KLOS.MessageBoard = function (name) {
        KLOS.WM.call(this, "MessageBoard");
        var elem, renderMsgBox, that, renderMessage, renderMessages, getMessages, imageLoadTimer, activityImage, xhr, history, msgSection, highestId;
        
        this.windowIcon.setAttribute("src", "img/messageboard.png");
        
        this.name = name;
        
        this.messages = [];
    
        history = 10;
        
        getMessages = function (history) {
            imageLoadTimer = setTimeout(function () {
                activityImage = document.createElement("img");
                activityImage.setAttribute("src", "img/activity.gif");
                activityImage.setAttribute("class", "activityImage");
    
                that.windowStatusBar.appendChild(activityImage);
            }, 300);
            
            
            xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php?history=" + history, function (data) {
                var article, footer, section, author, time, getNode, messages, i, xpe, parser = new DOMParser(),
                    doc = parser.parseFromString(data, "application/xml");
                

                messages = doc.getElementsByTagName("message");
                
                getNode = function (node, search) {
                    if (node.getElementsByTagName(search)[0].childNodes[0]) {
                        return node.getElementsByTagName(search)[0].childNodes[0].nodeValue;
                    }
                };
                
                for (i = 0; i < messages.length; i += 1) {
                    
                    if (getNode(messages[i], "id") < highestId) {
                        console.log(messages[i]);
                        console.log(getNode(messages[i], "id"));
                        console.log(getNode(messages[i], "author"));
                        console.log(getNode(messages[i], "text"));
                        console.log(getNode(messages[i], "time"));
                        
                        article = document.createElement("article");
                        section = document.createElement("section");
                        footer = document.createElement("footer");
                        author = document.createElement("p");
                        time = document.createElement("p");
                        
                        section.textContent = getNode(messages[i], "text");
                        author.textContent = getNode(messages[i], "author");
                        time.textContent = getNode(messages[i], "time");
                        
                        footer.appendChild(author);
                        footer.appendChild(time);
                        article.appendChild(section);
                        article.appendChild(footer);
                        
                        msgSection.appendChild(article);
                        
                        highestId = getNode(messages[i], "id");
                    }
                    
//                    that.messages.push(new KLOS.MessageBoard.Message(getNode(messages[i], "text"), getNode(messages[i], "time")));
                }
                
//                renderMessages();
            }, false);
        };
        
        getMessages(50);
        
        that = this;
//        this.sendMessage = function () {
//            var input = document.querySelector("#" + name + " textarea").value,
//                messages = that.messages;
//            
//            messages.push(new KLOS.MessageBoard.Message(input, new Date()));
//            renderMessages();
//        };
//        
//        this.removeMessage = function (index) {
//            if (confirm("Är du helt säker på att du vill ta bort meddelandet?")) {
//                that.messages.splice(index, 1);
//                renderMessages();
//            }
//        };
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
                inputSection = elem("section", "inputBox"),
                form = elem("form"),
                textarea = elem("textarea"),
                content,
                main,
                inputButton,
                header,
                msgCountElement,
                offsetX,
                offsetY,
                move,
                instanceReady;
            
            msgSection = elem("section", "msgBox");
            msgCountElement = elem("p", "msgCounter");
            msgCountElement.appendChild(document.createTextNode("Antal meddelanden: 0"));
            
            header = elem("header", "msgBoxHeader");
            header.appendChild(document.createTextNode(name));
            
//            article.setAttribute("style", "z-index: " + KLOS.counter);
//            
//            move = function (e) {
//                e = e || event;
//                article.setAttribute("style", "left: " + (offsetX + e.clientX) + "px; top: " + (offsetY + e.clientY) + "px; z-index: " + KLOS.counter);
//            };
//    
//            article.onmousedown = function (e) {
//                e = e || event;
//                var css = getComputedStyle(article);
//                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
//                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
//                KLOS.counter += 1;
//    //            article.setAttribute("z-index", MessageSystem.counter);
//                window.addEventListener("mousemove", move, false);
//            };
//            article.onmouseup = function (e) {
//                e = e || event;
//                window.removeEventListener("mousemove", move, false);
//            };
//            
            inputButton = elem("input");
            inputButton.type = "button";
            inputButton.value = "skriv";
            inputButton.onclick = function (e) {
                e = e || event;
                that.sendMessage();
                document.querySelector("#" + that.name + " textarea").value = "";
                return false;
            };
            textarea.onkeypress = function (e) {
                e = e || event;
                if (e.keyCode === 13  && (!e.shiftKey)) {
                    that.sendMessage();
                    document.querySelector("#" + that.name + " textarea").value = "";
                    return false;
                } else {
                    e = window.event;
                }
            };
            
            boardFragment = boardFragment.appendChild(article);
            boardFragment.appendChild(header);
            boardFragment.appendChild(msgSection);
            boardFragment.appendChild(inputSection).appendChild(form).appendChild(textarea).parentElement.appendChild(inputButton);
            
    //        main = document.querySelector("main");
            that.windowBody.appendChild(boardFragment);
            instanceReady = new KLOS.CustomEvent("instanceReady");
            that.fullWindow.dispatchEvent(instanceReady);
        };
    
//        renderMessage = function (message, date, index) {
//            var msgItem = elem("article", "msgItem"),
//                msgContent = elem("section", "msgContent"),
//                footer = elem("footer", "msgInfo"),
//                msgFragment = document.createDocumentFragment(),
//                msgTextNode = document.createTextNode(message),
//                msgDateNode = document.createTextNode(date),
//                msgADelete = elem("a", "imgDelete"),
//                msgDelete = elem("img", "imgDelete"),
//                msgATime = elem("a", "imgTime"),
//                msgTime = elem("img", "imgTime"),
//                content,
//                msgBox;
//            
//            msgADelete.setAttribute("href", "#");
//            msgDelete.setAttribute("src", "img/delete.png");
//            msgDelete.alt = "Delete";
//            msgADelete.onclick = function () {
//                that.removeMessage(index);
//            };
//    
//            msgATime.setAttribute("href", "#");
//            msgTime.setAttribute("src", "img/time.png");
//            msgTime.alt = "Time";
//            msgATime.onclick = function () {
//                alert(that.messages[index].dateText());
//            };
//            
//            msgContent.innerHTML = message;
//    
//            msgFragment = msgFragment.appendChild(msgItem);
//            msgFragment.appendChild(msgADelete).appendChild(msgDelete);
//            msgFragment.appendChild(msgATime).appendChild(msgTime);
//            msgFragment.appendChild(msgContent);         //.innerHTML(message);        //.innerHTML(message);         //.appendChild(msgTextNode); 
//            msgFragment.appendChild(footer).appendChild(msgDateNode);
//    
//            
//            return msgFragment;
//        };
//        
//        renderMessages = function () {
//            var i, message, msgItems, msgBox, msgCounter, msgCountElement, msgList = document.createDocumentFragment();
//    
//            for (i = 0; i < that.messages.length; i += 1) {
//                message = renderMessage(that.messages[i].htmlText(), that.messages[i].date.toLocaleTimeString(), i);
//                msgList.appendChild(message);
//            }
//            msgBox = document.querySelector("#" + that.name + " .msgBox");
//            msgBox.innerHTML = "";
//            msgBox.appendChild(msgList);
//            
//            msgBox.scrollTop = msgBox.scrollHeight;
//    
//            msgCountElement = elem("p", "msgCounter");
//            msgCountElement.appendChild(document.createTextNode("Antal meddelanden: " + that.messages.length));
//            
//            if (document.querySelector("#" + that.name + " .msgCounter")) {
//                document.querySelector("#" + that.name + " .inputBox").removeChild(document.querySelector("#" + that.name + " .msgCounter"));
//                document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
//            } else {
//                document.querySelector("#" + that.name + " .inputBox").appendChild(msgCountElement);
//            }
//        };
//    
//        
        renderMsgBox(name);
        
    };
}(window.KLOS = window.KLOS || {}));