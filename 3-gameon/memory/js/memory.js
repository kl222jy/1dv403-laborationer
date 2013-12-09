"use strict";
/*global window, event, document, console */
var KLOS = KLOS || {};

KLOS.Memory = function () {
    var boardSizeY, boardSizeX, cells, board, cell;
    
    boardSizeX = 4;
    boardSizeY = 4;
    
    cells = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
    cell = function (cellIndex) {
        var aTag, imgTag;
        
        aTag = document.createElement("a");
        aTag.setAttribute("href", "#");
        
        imgTag = document.createElement("img");
        imgTag.setAttribute("src", "pics/0.png");
        
        imgTag.onclick = function (e) {
            e = e || event;
            e.preventDefault();

            imgTag.setAttribute("src", "pics/" + cells[cellIndex] + ".png");
            
            setTimeout(function () {
                imgTag.setAttribute("src", "pics/0.png");
            }, 1000);
            
            
        };
        
        aTag.appendChild(imgTag);
        
        return aTag;
    };
    board = function () {
        var containerTag, boardTag, resultsTag, cellIndex;
        
        containerTag = document.createElement("article");
        containerTag.setAttribute("class", "memory-container");
        
        boardTag = document.createElement("section");
        boardTag.setAttribute("class", "memory-board");
        
        for (cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
            boardTag.appendChild(cell(cellIndex));
        }
        
        resultsTag = document.createElement("section");
        resultsTag.setAttribute("class", "memory-results");
        
        containerTag.appendChild(boardTag);
        containerTag.appendChild(resultsTag);
        
        return containerTag;
        
    };
    
    console.log(board());
    document.querySelector("main").appendChild(board());
};