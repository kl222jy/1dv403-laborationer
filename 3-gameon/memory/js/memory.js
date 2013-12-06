"use strict";
/*global window, event, document, console */
var KLOS = KLOS || {};

KLOS.Memory = function () {
    var boardSizeY, boardSizeX, cells, board, cell;
    
    boardSizeX = 4;
    boardSizeY = 4;
    
    cells = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
    board = function () {
    
    };
    cell = function (cellIndex) {
        var aTag, imgTag;
        
        aTag = document.createElement("a");
        aTag.setAttribute("href", "#");
        
        imgTag = document.createElement("img");
        imgTag.setAttribute("href", cells[cellIndex] + ".png");
        
        aTag.appendChild(imgTag);
    };
};