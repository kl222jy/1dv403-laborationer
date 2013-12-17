/*global window, event, document, console, alert, object, confirm, getComputedStyle*/
//(KLOS, undefined)? klagomål från jslint. 
//Trevlig lösning, slipper window onload, bra hantering inför användning av fler moduler och möjlighet att skjuta in hänvisningar till andra moduler som argument i kortare form.
//"use strict";
var KLOS = KLOS || {};

//KLOS = function () {
(function (KLOS) {
    "use strict";
    var menu, counter, MemoryGameID, WindowManager, TestBox, inheritPrototype, desktop, Memory, MessageBoard, MessageBoardID, MessageBoardCounter;
    
    desktop = document.querySelector("main");
    
    counter = 1;
    MemoryGameID = 0;
    
    menu = (function () {
        var menuItems = document.querySelectorAll("nav a");
        
        menuItems[0].onclick = function () {
            document.querySelector("main").innerHTML = "";
        };
        menuItems[1].onclick = function () {
            var messageBoardInstance = new MessageBoard("messageBoard" + MessageBoardID);
            KLOS.MessageBoardID += 1;
        };
        menuItems[2].onclick = function () {
            var memoryGameInstance = new Memory("Memory", MemoryGameID);
            MemoryGameID += 1;
        };
        menuItems[3].onclick = function () {
            var testBoxInstance = new TestBox("testruta");
        };
    }());
    
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    function WM(name) {
//        this.name = name;
//        this.testvalue = "blargh!";
//        console.log("från WM: " + this.name);
        var test, render, windowBody, that, offsetY, offsetX, move;

        this.windowBody = null;
        that = this;
        render = (function () {
            var klosWindow = document.createElement("article"),
                titleBar = document.createElement("header"),
                body = document.createElement("section");
            
            klosWindow.setAttribute("class", "window");
            titleBar.textContent = name;
            body.setAttribute("id", name);
            
            
            
            move = function (e) {
                e = e || event;
                klosWindow.setAttribute("style", "left: " + (offsetX + e.clientX) + "px; top: " + (offsetY + e.clientY) + "px; z-index: " + counter);
            };
    
            titleBar.onmousedown = function (e) {
                e = e || event;
                var css = getComputedStyle(klosWindow);
                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
                counter += 1;
    //            article.setAttribute("z-index", MessageSystem.counter);
                window.addEventListener("mousemove", move, false);
            };
            titleBar.onmouseup = function (e) {
                e = e || event;
                window.removeEventListener("mousemove", move, false);
            };
            
            
            
            
            
            klosWindow.appendChild(titleBar);
            klosWindow.appendChild(body);
            
            
            that.windowBody = body;
            desktop.appendChild(klosWindow);
        }());
    }
    

    
//    WM.prototype.testFunction = function (alertMessage) {
//        alert(alertMessage);
//    };
    
    inheritPrototype = function (subType, superType) {
        var prototype = object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };
        
    TestBox = function (name) {
        WM.call(this, name);
//        console.log(this.testvalue);
//        this.testFunction("fungerade!");
        var testTag = document.createElement("p");
        testTag.textContent = "Då provar vi om det här också kan tänkas fungera.";
        this.windowBody.appendChild(testTag);
    };
    



    
    
    Memory = function (name, boardId) {
        WM.call(this, name);
        var cellArray, Cell, cells, boardSizeY, boardSizeX, renderGameBoard, renderGame, checkPair, renderCell, firstCell, secondCell, updateGameBoard, tries, foundPairs, hideCells, nullCells;
        
        boardSizeX = 4;
        boardSizeY = 4;
        firstCell = null;
        secondCell = null;
        tries = 0;
        foundPairs = 0;
        
        
        cellArray = Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
        
        Cell = function (cellValue) {
            var index;
            this.isShown = false;
            this.value = cellValue;
            
            this.show = function (index) {
                document.querySelectorAll("#memory" + boardId + " img")[index].setAttribute("src", "pics/" + cellArray[index] + ".png");
            };
            
            this.hide = function (index) {
                document.querySelectorAll("#memory" + boardId + " img")[index].setAttribute("src", "pics/0.png");
            };
        };
        
        cells = [];
        
        cellArray.forEach(function (value) {
            cells.push(new Cell(value));
        });
        
        //Gömmer celler med fördröjning
        hideCells = function () {
            cells[firstCell].isShown = false;
            cells[secondCell].isShown = false;
            cells[firstCell].hide(firstCell);
            cells[secondCell].hide(secondCell);
    //        renderGameBoard();
            firstCell = null;
            secondCell = null;
        };
    
        //Rendera cell, innehåller också all spellogik(flytta?)
        renderCell = function (index) {
            var  aTag, imgTag;
            aTag = document.createElement("a");
            aTag.setAttribute("href", "#");
            
            //Spellogik
            aTag.onclick = function () {
                
    //            cells[index].show(index);
                
                //Kontrollera att onclick objektet inte redan visas
                if (cells[index].isShown === true) {
                    return false;
                }
                
                //Tvingar inväntning av hideCells
                if (secondCell !== null) {
                    return false;
                }
                
                //Visa cell
                cells[index].show(index);
                cells[index].isShown = true;
                
                
                if (firstCell === null) {
                    firstCell = index;
                } else {
                    secondCell = index;
                    
                    //Hittat ett par?
                    if (cells[firstCell].value === cells[index].value) {
                        foundPairs += 1;
                        firstCell = null;
                        secondCell = null;
                    } else {
                        tries += 1;
                        if (tries === 1) {
                            document.querySelector("#memory" + boardId + " section.resultsBoard").innerHTML = "Du har nu misslyckats " + tries + " gång.";
                        } else {
                            document.querySelector("#memory" + boardId + " section.resultsBoard").innerHTML = "Du har nu misslyckats " + tries + " gånger.";
                        }
                        //Gömmer celler efter 1s
                        setTimeout(hideCells, 1000);
                    }
                }
                
                //Vunnit?
                if (foundPairs === ((boardSizeX * boardSizeY) / 2)) {
                    document.querySelector("#memory" + boardId + " section.resultsBoard").innerHTML = "Grattis! du vann!, du misslyckades " + tries + " gånger.";
                }
            };
            
            imgTag = document.createElement("img");
            if (cells[index].isShown === true) {
                imgTag.setAttribute("src", "pics/" + cells[index].value + ".png");
            } else {
                imgTag.setAttribute("src", "pics/0.png");
            }
            aTag.appendChild(imgTag);
            
            return aTag;
        };
        
        //Rendera spelbräde
        renderGameBoard = function () {
            var tableTag, trTag, tdTag, rows, cols, cellIndex, aTag, gameBoard;
            
            tableTag = document.createElement("table");
            
            cellIndex = 0;
            
            for (rows = 0; rows < boardSizeY; rows += 1) {
                trTag = document.createElement("tr");
                for (cols = 0; cols < boardSizeX; cols += 1) {
                    tdTag = document.createElement("td");
    
                    tdTag.appendChild(renderCell(cellIndex));
                    trTag.appendChild(tdTag);
                    cellIndex += 1;
                }
                tableTag.appendChild(trTag);
            }
            gameBoard = document.querySelector("#memory" + boardId + " section.gameBoard");
            gameBoard.innerHTML = "";
            gameBoard.appendChild(tableTag);
        };
        
        renderGame = function () {
            var containerTag, gameBoardTag, resultsBoardTag;
            containerTag = document.createElement("article");
            containerTag.setAttribute("class", "memoryContainer");
            containerTag.setAttribute("id", "memory" + boardId);
            containerTag.textContent = "Memory";
            
            gameBoardTag = document.createElement("section");
            gameBoardTag.setAttribute("class", "gameBoard");
            
            resultsBoardTag = document.createElement("section");
            resultsBoardTag.setAttribute("class", "resultsBoard");
            resultsBoardTag.textContent = "Välkommen till memoryspelet!";
            
            containerTag.appendChild(gameBoardTag);
            containerTag.appendChild(resultsBoardTag);
            
            return containerTag;
            
        };
        
    //    document.querySelector("main").appendChild(renderGame());
        this.windowBody.appendChild(renderGame());
        renderGameBoard();
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    Memory.RandomGenerator = {
	
	/*
		Denna metod tar antalet rader och columner som inparameter.
		
		Metoden returnerar en array innehållandes utslumpade tal mellan 1 och (rows*cols)/2. Varje tal representeras två
		gånger och motsvarar således en spelbricka. 
		
		I en 4*4 matris kan Arrayen t.ex. se ut så här:
		[1,2,6,8,6,2,5,3,1,3,7,5,8,4,4,7]
		
		I en 2*4 matris kan Arrayen t.ex. se ut så här:				
		[3,4,4,1,2,1,2,3]
	*/
	
        getPictureArray: function (rows, cols) {
            var numberOfImages = rows * cols,
                maxImageNumber = numberOfImages / 2,
                imgPlace = [],
                i,
                currentImageNumber,
                imageOneOK,
                imageTwoOK,
                randomOne,
                randomTwo;
        
           //Utplacering av bilder i Array
            for (i = 0; i < numberOfImages; i += 1) {
                imgPlace[i] = 0;
            }
            for (currentImageNumber = 1; currentImageNumber <= maxImageNumber; currentImageNumber += 1) {
                imageOneOK = false;
                imageTwoOK = false;
                
                do {
                    if (imageOneOK === false) {
                        randomOne = Math.floor((Math.random() * (rows * cols - 0) + 0));
                        
                        if (imgPlace[randomOne] === 0) {
                            imgPlace[randomOne] = currentImageNumber;
                            imageOneOK = true;
                        }
                    }
                    
                    if (imageTwoOK === false) {
                        randomTwo = Math.floor((Math.random() * (rows * cols - 0) + 0));
                                    
                        if (imgPlace[randomTwo] === 0) {
                            imgPlace[randomTwo] = currentImageNumber;
                            imageTwoOK = true;
                        }
                    }
                } while (imageOneOK === false || imageTwoOK === false);
            }
            
            return imgPlace;
        }
    };
    
    
    
    
    
    
    MessageBoard = function (name) {
        WM.call(this, "MessageBoard");
        var elem, renderMsgBox, that, renderMessage, renderMessages;
        
        this.name = name;
        
        this.messages = [];
    
        that = this;
        this.sendMessage = function () {
            var input = document.querySelector("#" + name + " textarea").value,
                messages = that.messages;
            
            messages.push(new KLOS.MessageBoard.Message(input, new Date()));
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
                offsetY,
                move;
    
            msgCountElement = elem("p", "msgCounter");
            msgCountElement.appendChild(document.createTextNode("Antal meddelanden: 0"));
            
            header = elem("header", "msgBoxHeader");
            header.appendChild(document.createTextNode(name));
            
            article.setAttribute("style", "z-index: " + counter);
            
//            move = function (e) {
//                e = e || event;
//                article.setAttribute("style", "left: " + (offsetX + e.clientX) + "px; top: " + (offsetY + e.clientY) + "px; z-index: " + counter);
//            };
//    
//            article.onmousedown = function (e) {
//                e = e || event;
//                var css = getComputedStyle(article);
//                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
//                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
//                counter += 1;
//    //            article.setAttribute("z-index", MessageSystem.counter);
//                window.addEventListener("mousemove", move, false);
//            };
//            article.onmouseup = function (e) {
//                e = e || event;
//                window.removeEventListener("mousemove", move, false);
//            };
            
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
            
//            main = document.querySelector("main");
            that.windowBody.appendChild(boardFragment);
        };
    
        renderMessage = function (message, date, index) {
            var msgItem = elem("article", "msgItem"),
                msgContent = elem("section", "msgContent"),
                footer = elem("footer", "msgInfo"),
                msgFragment = document.createDocumentFragment(),
                msgTextNode = document.createTextNode(message),
                msgDateNode = document.createTextNode(date),
                msgADelete = elem("a", "imgDelete"),
                msgDelete = elem("img", "imgDelete"),
                msgATime = elem("a", "imgTime"),
                msgTime = elem("img", "imgTime"),
                content,
                msgBox;
            
            msgADelete.setAttribute("href", "#");
            msgDelete.setAttribute("src", "img/delete.png");
            msgDelete.alt = "Delete";
            msgADelete.onclick = function () {
                that.removeMessage(index);
            };
    
            msgATime.setAttribute("href", "#");
            msgTime.setAttribute("src", "img/time.png");
            msgTime.alt = "Time";
            msgATime.onclick = function () {
                alert(that.messages[index].dateText());
            };
            
            msgContent.innerHTML = message;
    
            msgFragment = msgFragment.appendChild(msgItem);
            msgFragment.appendChild(msgADelete).appendChild(msgDelete);
            msgFragment.appendChild(msgATime).appendChild(msgTime);
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
    
    MessageBoardCounter = 1;
    MessageBoardID = 1;
        
    MessageBoard.Message = function (text, date) {
        var f_date, f_text;

        Object.defineProperty(this, "text", {
            get: function () { return f_text; },
            set: function (text) {
                if (text) {
                    f_text = text;
                }
            }
        });
        Object.defineProperty(this, "date", {
            get: function () { return f_date; },
            set: function (date) { f_date = date; }
        });
        this.text = text;
        this.date = date;
    };
    
    MessageBoard.Message.prototype.toString = function () {
        return this.text + " " + this.date;
    };
    
    MessageBoard.Message.prototype.htmlText = function () {
        return this.text.replace(/\n/g, "<br />");
    };
    
    MessageBoard.Message.prototype.dateText = function () {
        return "Inlägget skapades " + this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString();       //this.date.toDateString() + " " + this.date.toTimeString();
    };
    
    inheritPrototype(TestBox, WM);
    inheritPrototype(Memory, WM);
    inheritPrototype(MessageBoard, WM);
    
}(KLOS = KLOS || {}));