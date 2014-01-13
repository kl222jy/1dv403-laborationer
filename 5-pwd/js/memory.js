/*global window, event, document, console, WM, setTimeout, localStorage */
(function (KLOS) {
    "use strict";

    /* --------------------------------------------------------------------------------------------------
    
    Finns enbart kvar för att kunna ha en körbar version av projektet, mitt webbhotell stödjer inte node.
    Se memorywithnode.js för kommentarer
    
    --------------------------------------------------------------------------------------------------- */
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    KLOS.Memory = function (boardId, menuButton) {
        KLOS.WM.call(this, "Memory", menuButton);
        var cellArray, Cell, cells, boardSizeY, boardSizeX, renderGameBoard, renderGame, checkPair, renderCell, firstCell, secondCell, updateGameBoard, tries, foundPairs, hideCells, nullCells, instanceReady, startTime, stopTime, resultTime, restart, that, init,
            img = document.createElement("img"),
            toolBarEditMenu = document.createElement("ul"),
            toolBarEdit = document.createElement("li"),
            toolBarEditMenuRestart = document.createElement("li"),
            toolBarEditMenuSetBoard = document.createElement("li");
        
        this.windowIcon.setAttribute("src", "img/memory.png");
        
        that = this;
        boardSizeX = 4;
        boardSizeY = 4;
        init = function () {

            firstCell = null;
            secondCell = null;
            tries = 0;
            foundPairs = 0;
            cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
            cells = [];
        
            cellArray.forEach(function (value) {
                cells.push(new Cell(value));
            });
            that.windowBody.innerHTML = "";
            that.windowBody.appendChild(renderGame());
            renderGameBoard();
        };
        
        toolBarEdit.textContent = "Inställningar";
        toolBarEditMenuRestart.textContent = "Starta om";
        toolBarEditMenuSetBoard.textContent = "Välj bräde..";

        toolBarEdit.onclick = function () {
            toolBarEditMenu.classList.toggle("show");
            return false;
        };
        
        restart = function () {
            console.log("this: " + this);
            console.log("that: " + that.windowBody.innerHTML);
            that.windowBody.innerHTML = "";
            firstCell = null;
            secondCell = null;
            tries = 0;
            foundPairs = 0;
            cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
            that.windowBody.appendChild(renderGame());
            renderGame();
            renderGameBoard();
        };
        
        toolBarEditMenuRestart.onclick = function () {
            init();
        };
        
        toolBarEditMenuSetBoard.onclick = function () {
            var innermodal = document.createElement("section"),
                radio2x4 = document.createElement("input"),
                radio3x4 = document.createElement("input"),
                radio4x4 = document.createElement("input"),
                confirm = document.createElement("button"),
                form = document.createElement("form"),
                text2x4 = document.createElement("p"),
                text3x4 = document.createElement("p"),
                text4x4 = document.createElement("p");
            
            radio2x4.setAttribute("type", "radio");
            radio2x4.setAttribute("name", "boardsize");
            radio2x4.setAttribute("value", "2");
            text2x4.textContent = "2 x 4";

            radio3x4.setAttribute("type", "radio");
            radio3x4.setAttribute("name", "boardsize");
            radio3x4.setAttribute("value", "3");
            text3x4.textContent = "3 x 4";

            radio4x4.setAttribute("type", "radio");
            radio4x4.setAttribute("name", "boardsize");
            radio4x4.setAttribute("value", "4");
            text4x4.textContent = "4 x 4";
 
            
            confirm.textContent = "Välj bräde";
            
            confirm.onclick = function () {
                boardSizeY = form.elements.boardsize.value;
                init();
                KLOS.removeModal();
                return false;
            };
            
            form.appendChild(radio2x4);
            form.appendChild(text2x4);

            form.appendChild(radio3x4);
            form.appendChild(text3x4);

            form.appendChild(radio4x4);
            form.appendChild(text4x4);

            form.appendChild(confirm);
            innermodal.appendChild(form);
            
            KLOS.showModal(innermodal);
            
        };
        
        toolBarEditMenu.appendChild(toolBarEditMenuRestart);
        toolBarEditMenu.appendChild(toolBarEditMenuSetBoard);
        
        toolBarEdit.appendChild(toolBarEditMenu);

        this.windowToolBar.appendChild(toolBarEdit);
        
        
//        KLOS.init = function () {
//        boardSizeX = 4;
//        boardSizeY = 4;
//        firstCell = null;
//        secondCell = null;
//        tries = 0;
//        foundPairs = 0;
//        };
        
//        cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
        
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
        
//        cells = [];
//        
//        cellArray.forEach(function (value) {
//            cells.push(new Cell(value));
//        });
        
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
            var  aTag, imgTag, results,
                recordTime = localStorage.memoryBestTime || 9999,
                recordTries = localStorage.memoryBestTries || 9999;
            aTag = document.createElement("a");
            aTag.setAttribute("href", "#");
            
            //Spellogik
            aTag.onclick = function () {
                
                if (tries === 0 && foundPairs === 0 && firstCell === null) {
                    startTime = Date.now();
                }
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
                    results = document.querySelector("#memory" + boardId + " section.resultsBoard");
                    stopTime = Date.now();
                    resultTime = (stopTime - startTime) / 1000;
                    results.innerHTML = "";
                    if (resultTime < recordTime) {
                        localStorage.memoryBestTime = resultTime;
                        results.innerHTML += "Rekordtid! ";
                    }
                    if (tries < recordTries) {
                        localStorage.memoryBestTries = tries;
                        results.innerHTML += "Rekord! minsta antal försök. ";
                    }
                    
                    results.innerHTML += "Misslyckade: " + tries + ", tid: " + resultTime;
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
            var containerTag, gameBoardTag, resultsBoardTag, highscoreResults, highscoreTries, highscoreTime,
                bestTime = localStorage.memoryBestTime || 9999,
                bestTries = localStorage.memoryBestTries || 9999;
            
            containerTag = document.createElement("article");
            containerTag.setAttribute("class", "memoryContainer");
            containerTag.setAttribute("id", "memory" + boardId);
    //        containerTag.textContent = "Memory";
            
            gameBoardTag = document.createElement("section");
            gameBoardTag.setAttribute("class", "gameBoard");
            
            resultsBoardTag = document.createElement("section");
            resultsBoardTag.setAttribute("class", "resultsBoard");
            resultsBoardTag.textContent = "Välkommen till memoryspelet!";
            
            highscoreResults = document.createElement("section");
            highscoreResults.setAttribute("class", "highscoreResults");
            highscoreTries = document.createElement("p");
            highscoreTime = document.createElement("p");

            highscoreResults.textContent = "Highscore";
            highscoreTries.textContent = "Misslyckade försök: " + bestTries;
            highscoreTime.textContent = "Tid: " + bestTime;
            
            highscoreResults.appendChild(highscoreTime);
            highscoreResults.appendChild(highscoreTries);
            
            
            
            containerTag.appendChild(gameBoardTag);
            containerTag.appendChild(resultsBoardTag);
            containerTag.appendChild(highscoreResults);
            
            return containerTag;
            
        };
        
    //    document.querySelector("main").appendChild(renderGame());
//        this.windowBody.appendChild(renderGame());
//        renderGameBoard();
        init();
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };
}(window.KLOS = window.KLOS || {}));

//KLOS.inheritPrototype(KLOS.Memory, KLOS.WM);