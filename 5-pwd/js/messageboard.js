/*global window, event, document, getComputedStyle, alert, confirm, console, Message, setTimeout, DOMParser, XMLHttpRequest, clearTimeout, clearInterval, setInterval, localStorage */

(function (KLOS) {
    "use strict";
    KLOS.MessageBoard = function (name, menuButton) {
        KLOS.WM.call(this, "MessageBoard", menuButton);
        var elem, updateTime, renderMsgBox, that, renderMessage, renderMessages, getMessages, imageLoadTimer, activityImage, xhr, history, msgSection, highestId, textarea, sendMessage, updateBoard, addToolbarChoice, chooseUpdateInterval, chooseMessagesAmount, chooseAuthorName, username, saveSettings, loadSettings,
            toolBarSettingsMenu = document.createElement("ul"),
            toolBarSettings = document.createElement("li"),
            toolBarSettingsUpdateInterval = document.createElement("li"),
            toolBarSettingsMessages = document.createElement("li"),
            toolBarSettingsAuthor = document.createElement("li"),
            toolBarSettingsUpdate = document.createElement("li");
        
        this.windowIcon.setAttribute("src", "img/messageboard.png");
        
        this.name = name;
        
        this.messages = [];
    
        history = 50;
        updateTime = 10000;
        username = "Anonym";
        highestId = 0;
        
        //Hämtar meddelanden
        getMessages = function (noUpdate) {
            //Timout, efter 300ms läggs aktivitetsvisare in i statusfältet
            imageLoadTimer = setTimeout(function () {
                activityImage = document.createElement("img");
                activityImage.setAttribute("src", "img/activity.gif");
                activityImage.setAttribute("class", "activityImage");
    
                that.windowStatusBar.appendChild(activityImage);
            }, 300);
            
            //Hämtar meddelandelista
            xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php?history=" + history, function (data) {
                var timestring, tempId,  article, msgInfo, msgText, author, time, getNode, messages, i, xpe, parser = new DOMParser(),
                    doc = parser.parseFromString(data, "application/xml");

                //Tar bort timeout så att inte bilden läggs till i ett senare skede
                clearTimeout(imageLoadTimer);

                messages = doc.getElementsByTagName("message");
                
                //Funktion för att hämta ut nodvärde
                getNode = function (node, search) {
                    if (node.getElementsByTagName(search)[0].childNodes[0]) {
                        return node.getElementsByTagName(search)[0].childNodes[0].nodeValue;
                    } else {
                        return "";
                    }
                };
                
                for (i = 0; i < messages.length; i += 1) {
                    
                    tempId = getNode(messages[i], "id");

                    //Om nuvarande id är högre än hämtad posts id, skippa detta block
                    if (tempId > highestId) {
                        
                        article = document.createElement("article");
                        msgText = document.createElement("section");
                        msgInfo = document.createElement("section");
                        author = document.createElement("p");
                        time = document.createElement("p");
                        timestring = new Date(parseInt(getNode(messages[i], "time"), 10));
                        
                        article.setAttribute("class", "msgItem");
                        author.setAttribute("class", "msgAuthor");
                        time.setAttribute("class", "msgTime");
                        msgInfo.setAttribute("class", "msgInfo");
                        msgText.setAttribute("class", "msgText");
                        
                        msgText.textContent = getNode(messages[i], "text");
                        author.textContent = getNode(messages[i], "author");
                        time.textContent = timestring.toLocaleString();
                        
                        msgInfo.appendChild(author);
                        msgInfo.appendChild(time);
                        article.appendChild(msgInfo);
                        article.appendChild(msgText);
                        
                        msgSection.appendChild(article);
                        
                        highestId = getNode(messages[i], "id");
                    }
                }
                
                //Sätter scrollbar till dess lägsta position
                msgSection.scrollTop = msgSection.scrollHeight;
                
                //Om aktivitetsbilden finns, ta bort den
                if (that.windowStatusBar.contains(activityImage)) {
                    that.windowStatusBar.removeChild(activityImage);
                }
                //Om fönstret finns kvar och fler uppdateringar ska göras, sätt en ny timeout för nästa inläsning
                if (KLOS.desktop.contains(that.fullWindow) && noUpdate !== true) {
                    setTimeout(getMessages, updateTime);
                }
            }, false);
        };
        
        //Hämta meddelanden
        getMessages();
        
        that = this;
        
        //Skicka meddelanden
        sendMessage = function (message) {
            var xhr = new XMLHttpRequest();
            
            xhr.open("POST", "http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("username=" + username + "&text=" + message);
            getMessages(true);
        };

        //Förenkling av elementskapande
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
        
        //Renderar chattfönstret
        renderMsgBox = function (name) {
            var boardFragment = document.createDocumentFragment(),
                article = elem("article", "msgBoard", name),
                inputSection = elem("section", "inputBox"),
                form = elem("form"),
                content,
                main,
                inputButton,
                header,
                msgCountElement,
                offsetX,
                offsetY,
                move,
                instanceReady;
            
            textarea = elem("textarea");
            msgSection = elem("section", "msgBox");
            msgCountElement = elem("p", "msgCounter");
            msgCountElement.appendChild(document.createTextNode("Antal meddelanden: 0"));
            
            header = elem("header", "msgBoxHeader");
            header.appendChild(document.createTextNode(name));

            inputButton = elem("input");
            inputButton.type = "button";
            inputButton.value = "skriv";
            
            inputButton.onclick = function (e) {
                e = e || event;
                sendMessage(textarea.value);
                document.querySelector("#" + that.name + " textarea").value = "";
                return false;
            };
            
            //Enter + shift = ny rad, Enter = skicka
            textarea.onkeypress = function (e) {
                e = e || event;
                if (e.keyCode === 13  && (!e.shiftKey)) {
                    sendMessage(textarea.value);
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
            
            that.windowBody.appendChild(boardFragment);
            
            //Sänd ut ett meddelande om att programinstansen laddats färdigt
            instanceReady = new KLOS.CustomEvent("instanceReady");
            that.fullWindow.dispatchEvent(instanceReady);
        };

        renderMsgBox(name);
        
        //Hanterar val av uppdateringsintervall
        chooseUpdateInterval = function () {
            var pTag = document.createElement("p"),
                selectUpdate = document.createElement("select"),
                option10s = document.createElement("option"),
                option20s = document.createElement("option"),
                option30s = document.createElement("option"),
                option40s = document.createElement("option"),
                option50s = document.createElement("option"),
                option60s = document.createElement("option"),
                innerModal = document.createElement("section"),
                formUpdate = document.createElement("form"),
                chooseUpdateFreq = document.createElement("button");
                
            pTag.textContent = "Nedan kan du välja hur ofta meddelanden ska hämtas.";
            option10s.setAttribute("value", "10");
            option10s.textContent = "10 Sekunder";
            option20s.setAttribute("value", "20");
            option20s.textContent = "20 Sekunder";
            option30s.setAttribute("value", "30");
            option30s.textContent = "30 Sekunder";
            option40s.setAttribute("value", "40");
            option40s.textContent = "40 Sekunder";
            option50s.setAttribute("value", "50");
            option50s.textContent = "50 Sekunder";
            option60s.setAttribute("value", "60");
            option60s.textContent = "1 Minut";
            
            selectUpdate.appendChild(option10s);
            selectUpdate.appendChild(option20s);
            selectUpdate.appendChild(option30s);
            selectUpdate.appendChild(option40s);
            selectUpdate.appendChild(option50s);
            selectUpdate.appendChild(option60s);

            
            chooseUpdateFreq.textContent = "Välj";
            
            chooseUpdateFreq.onclick = function () {
                updateTime = selectUpdate.options[selectUpdate.selectedIndex].value * 1000;
                getMessages(true);
                KLOS.removeModal();
            };
            
            formUpdate.appendChild(selectUpdate);
            formUpdate.appendChild(chooseUpdateFreq);
            innerModal.appendChild(pTag);
            innerModal.appendChild(formUpdate);
            
            KLOS.showModal(innerModal);
        };
        
        //Hanterar val av meddelandehistorik
        chooseMessagesAmount = function () {
            var pTag = document.createElement("p"),
                selectMessages = document.createElement("select"),
                option10 = document.createElement("option"),
                option20 = document.createElement("option"),
                option30 = document.createElement("option"),
                option40 = document.createElement("option"),
                option50 = document.createElement("option"),
                innerModal = document.createElement("section"),
                formUpdate = document.createElement("form"),
                setMessagesAmount = document.createElement("button");
                
            pTag.textContent = "Nedan kan du välja hur ofta meddelanden ska hämtas.";
            option10.setAttribute("value", "10");
            option10.textContent = "10 Meddelanden";
            option20.setAttribute("value", "20");
            option20.textContent = "20 Meddelanden";
            option30.setAttribute("value", "30");
            option30.textContent = "30 Meddelanden";
            option40.setAttribute("value", "40");
            option40.textContent = "40 Meddelanden";
            option50.setAttribute("value", "50");
            option50.textContent = "50 Meddelanden";
            
            selectMessages.appendChild(option10);
            selectMessages.appendChild(option20);
            selectMessages.appendChild(option30);
            selectMessages.appendChild(option40);
            selectMessages.appendChild(option50);

            setMessagesAmount.textContent = "Välj";
            
            setMessagesAmount.onclick = function () {
                history = selectMessages.options[selectMessages.selectedIndex].value;
                getMessages(true);
                KLOS.removeModal();
            };
            
            formUpdate.appendChild(selectMessages);
            formUpdate.appendChild(setMessagesAmount);
            innerModal.appendChild(pTag);
            innerModal.appendChild(formUpdate);
            
            KLOS.showModal(innerModal);
        };
        
        //Val av användarnamn
        chooseAuthorName = function () {
            var pTag = document.createElement("p"),
                setNameTextbox = document.createElement("input"),
                innerModal = document.createElement("section"),
                setNameForm = document.createElement("form"),
                setNameButton = document.createElement("button");
            
            pTag.textContent = "Välj användarnamn";
            setNameTextbox.setAttribute("type", "text");
            setNameTextbox.setAttribute("value", username);
            setNameButton.textContent = "Välj";
            
            setNameButton.onclick = function () {
                username = setNameTextbox.value;
                //Här borde läggas till lite logik som kontrollerar inmatningen
                saveSettings();
                KLOS.removeModal();
            };
            
            setNameForm.appendChild(setNameTextbox);
            setNameForm.appendChild(setNameButton);
            innerModal.appendChild(pTag);
            innerModal.appendChild(setNameForm);
            
            KLOS.showModal(innerModal);
        };
        

        toolBarSettings.textContent = "Inställningar";
        toolBarSettingsUpdateInterval.textContent = "Uppdateringsintervall..";
        toolBarSettingsMessages.textContent = "Antal meddelanden..";
        toolBarSettingsAuthor.textContent = "Alias..";
        toolBarSettingsUpdate.textContent = "Uppdatera nu";
        
        toolBarSettingsUpdateInterval.onclick = function () {
            chooseUpdateInterval();
        };
        
        toolBarSettingsMessages.onclick = function () {
            chooseMessagesAmount();
        };
        
        toolBarSettingsAuthor.onclick = function () {
            chooseAuthorName();
        };

        toolBarSettingsUpdate.onclick = function () {
            getMessages(true);      //noUpdate = true för att undvika fler intervall
        };


        toolBarSettingsMenu.appendChild(toolBarSettingsUpdateInterval);
        toolBarSettingsMenu.appendChild(toolBarSettingsMessages);
        toolBarSettingsMenu.appendChild(toolBarSettingsAuthor);
        toolBarSettingsMenu.appendChild(toolBarSettingsUpdate);
        toolBarSettings.appendChild(toolBarSettingsMenu);
        
        this.windowToolBar.appendChild(toolBarSettings);
        
        //Ladda inställningar från localstorage
        loadSettings = function () {
            if (localStorage.username && localStorage.updateTime && localStorage.history) {
                username = localStorage.username;
                updateTime = localStorage.updateTime;
                history = localStorage.history;
            }
        };
        
        loadSettings();
        
        //Sparar inställningar i localstorage
        saveSettings = function () {
            localStorage.username = username;
            localStorage.updateTime = updateTime;
            localStorage.history = history;
        };
    };
}(window.KLOS = window.KLOS || {}));