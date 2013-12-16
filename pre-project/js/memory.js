//"use strict";
/*global window, event, document, console, WM */
var KLOS = KLOS || {};

KLOS.Memory = function (boardId) {
    "use strict";
    KLOS.WM.call(this, boardId);
    var cellArray, Cell, cells, boardSizeY, boardSizeX, renderGameBoard, renderGame, checkPair, renderCell, firstCell, secondCell, updateGameBoard, tries, foundPairs, hideCells, nullCells;
    
    boardSizeX = 4;
    boardSizeY = 4;
    firstCell = null;
    secondCell = null;
    tries = 0;
    foundPairs = 0;
    
    
    cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
    
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


//KLOS.inheritPrototype(KLOS.Memory, KLOS.WM);