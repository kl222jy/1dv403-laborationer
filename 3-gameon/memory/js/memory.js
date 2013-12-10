"use strict";
/*global window, event, document, console */
var KLOS = KLOS || {};

KLOS.Memory = function (boardId) {
    var cellArray, Cell, cells, boardSizeY, boardSizeX, renderGameBoard, renderGame, checkPair, renderCell, firstCell, secondCell, updateGameBoard, tries, foundPairs, hideCells, nullCells;
    
    boardSizeX = 4;
    boardSizeY = 4;
    firstCell = null;
    tries = 0;
    foundPairs = 0;
    
    
    cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
    
    Cell = function (cellIndex) {
        this.isShown = false;
        this.value = cellIndex;
    };
    
    cells = [];
    
    cellArray.forEach(function (value) {
        cells.push(new Cell(value));
    });
    
    hideCells = function () {
        cells[firstCell].isShown = false;
        cells[secondCell].isShown = false;
        renderGameBoard();
        firstCell = null;
        secondCell = null;
    };
    
    nullCells = function () {
        firstCell = null;
        secondCell = null;
    };
    
    renderCell = function (index) {
        var  aTag, imgTag;
        aTag = document.createElement("a");
        aTag.setAttribute("href", "#");
        
        aTag.onclick = function () {
            if (cells[index].isShown === true) {
                return false;
            }
            
            cells[index].isShown = true;
            if (firstCell === null) {
                firstCell = index;
            } else {
                secondCell = index;
                if (cells[firstCell].value === cells[index].value) {
                    foundPairs += 1;
                    firstCell = null;
                    secondCell = null;
//                    setTimeout(nullCells, 1000);
                } else {
                    tries += 1;
                    setTimeout(hideCells, 1000);
                }
            }
            
            renderGameBoard();
            
            if (foundPairs === ((boardSizeX * boardSizeY) / 2)) {
                document.querySelector("#memory" + boardId + " section.resultsBoard").innerHTML = "Grattis! du vann!, det tog dig " + tries + " försök.";
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
        
        containerTag.appendChild(gameBoardTag);
        containerTag.appendChild(resultsBoardTag);
        
        return containerTag;
        
    };
    
    document.querySelector("main").appendChild(renderGame());
    renderGameBoard();
};