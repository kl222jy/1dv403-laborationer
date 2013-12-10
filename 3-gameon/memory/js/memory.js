"use strict";
/*global window, event, document, console */
var KLOS = KLOS || {};

KLOS.Memory = function (boardId) {
    var cellArray, Cell, cells, boardSizeY, boardSizeX, renderGameBoard, renderGame, checkPair, renderCell, firstCell, updateGameBoard, tries, foundPairs;
    
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
    
    renderCell = function (index) {
        var  aTag, imgTag;
        aTag = document.createElement("a");
        aTag.setAttribute("href", "#");
        
        aTag.onclick = function () {
            cells[index].isShown = true;
            if (firstCell === null) {
                firstCell = index;
            } else {
                if (cells[firstCell].value === cells[index].value) {
                    foundPairs += 1;
                    console.log("samma");
                } else {
                    console.log("inte samma");
                }
                firstCell = null;
            }
            renderGameBoard();
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
    
//    updateGameBoard = function () {
//        var tableTag, trTag, tdTag, rows, cols, cellIndex, aTag, gameBoard;
//        
//        tableTag = document.createElement("table");
//        
//        cellIndex = 0;
//        
//        for (rows = 0; rows < boardSizeY; rows += 1) {
//            trTag = document.createElement("tr");
//            for (cols = 0; cols < boardSizeX; cols += 1) {
//                tdTag = document.createElement("td");
//
//                tdTag.appendChild(renderCell(cellIndex));
//                trTag.appendChild(tdTag);
//                cellIndex += 1;
//            }
//            tableTag.appendChild(trTag);
//        }
//        
//        gameBoard = document.querySelector("#memory" + boardId + " section.gameBoard");
//        gameBoard.appendChild(tableTag);
//    };
//    
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
        
        gameBoardTag = document.createElement("section");
        gameBoardTag.setAttribute("class", "gameBoard");
        
//        gameBoardTag.appendChild(renderGameBoard());
        
        resultsBoardTag = document.createElement("section");
        resultsBoardTag.setAttribute("class", "resultsBoard");
        
        containerTag.appendChild(gameBoardTag);
        containerTag.appendChild(resultsBoardTag);
        
        return containerTag;
        
    };
    
    document.querySelector("main").appendChild(renderGame());
    renderGameBoard();
};