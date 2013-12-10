"use strict";
/*global window, event, document, console */
var KLOS = KLOS || {};

KLOS.Memory = function () {
    var boardSizeY, boardSizeX, cellArray, board, Cell, cells, generateCells, cellIndex, tries, firstCell, checkPair, generateBoard, init, that;
    
    boardSizeX = 4;
    boardSizeY = 4;
    firstCell = null;
    
    cellArray = KLOS.Memory.RandomGenerator.getPictureArray(boardSizeY, boardSizeX);
    cells = [];
    that = this;
//    Cell = {
////        var isShown, id, render;
//        isShown: false,
//        id: cellIndex,
//        that: this,
//        render: function () {
//            var liTag, aTag, imgTag;
//            
//            liTag.createElement("li");
//            aTag.createElement("a");
//            aTag.setAttribute("href", "#");
//            imgTag.createElement("img");
//            
//            
//            if (this.isShown) {
//                imgTag.setAttribute("src", "img/" + this.id + ".png");
//            } else {
//                imgTag.setAttribute("src", "img/0.png");
//            }
//            
//            liTag.appendChild(aTag).appendChild(imgTag);
//            
//            return liTag;
//        }
//    };    
    
    Cell = function (cellIndex) {
//        var isShown, id, render;
//        var id, that, render;
        var that;
        this.isShown = false;
        this.id = cellIndex;
        that = this;
//        this.render = function () {
//            var liTag, aTag, imgTag;
//            
//            liTag = document.createElement("li");
//            aTag = document.createElement("a");
//            aTag.setAttribute("href", "#");
//            aTag.addEventListener("onclick", checkPair(that), false);
//            imgTag = document.createElement("img");
//            
//            
//            if (that.isShown) {
//                imgTag.setAttribute("src", "pics/" + that.id + ".png");
//            } else {
//                imgTag.setAttribute("src", "pics/0.png");
//            }
//            
//            liTag.appendChild(aTag).appendChild(imgTag);
//            
//            return liTag;
        };
//        return render();
    };
    
//    generateCells = function () {
//        for (cellIndex = 0; cellIndex < cellArray.length; cellIndex += 1) {
//            cells.push(cell(cellArray[cellIndex]));
//        }
//    };
    
    
    checkPair = function (cell) {
        console.log("kördes");
        cell.isShown = true;
        if (firstCell === null) {
            firstCell = cell;
        } else {
            if (firstCell.id === cell.id) {
                console.log("lika");
            } else {
                console.log("olika");
                firstCell.isShown = false;
                cell.isShown = false;
            }
        }
            
    };
    generateBoard = function () {
        var containerTag, boardTag, resultsTag, cellIndex, ulTag, newCell;
        
        for (cellIndex = 0; cellIndex < cellArray.length; cellIndex += 1) {
//            newCell = new Cell();
//            newCell.id = cellIndex;
//            console.log(newCell);
            cells.push(new Cell(cellIndex));
        }
        
        containerTag = document.createElement("article");
        containerTag.setAttribute("class", "memory-container");
        
        boardTag = document.createElement("section");
        boardTag.setAttribute("class", "memory-board");
        
        ulTag = document.createElement("ul");
        
        for (cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
            ulTag.appendChild(cells[cellIndex].render());
        }
        
        resultsTag = document.createElement("section");
        resultsTag.setAttribute("class", "memory-results");
        
        boardTag.appendChild(ulTag);
        containerTag.appendChild(boardTag);
        containerTag.appendChild(resultsTag);
        
        return containerTag;
    };
//    generateCells();
    console.log(cells);
    document.querySelector("main").appendChild(generateBoard());
    console.log(cells);
};












































    
//    checkPair = function (cell) {
//        
//        
//            if (firstCell !== null) {
//                imgTag.setAttribute("src", "pics/" + cells[cellIndex] + ".png");
//
//                firstCell = null;
//                setTimeout(function () {
//                    imgTag.setAttribute("src", "pics/0.png");
//                }, 1000);
//                
//
//            } else {
//                firstCell = cells[cellIndex];
//                imgTag.setAttribute("src", "pics/" + cells[cellIndex] + ".png");
//            }
//    };
//    
//    cell = function (cellIndex) {
//        var aTag, imgTag, liTag;
//        
//        liTag = document.createElement("li");
//        
//        aTag = document.createElement("a");
//        aTag.setAttribute("href", "#");
//        
//        imgTag = document.createElement("img");
//        imgTag.setAttribute("src", "pics/0.png");
//        
//        aTag.onclick = function (e) {
//            e = e || event;
//            e.preventDefault();
//            
//
//            if (firstCell !== null) {
//                imgTag.setAttribute("src", "pics/" + cells[cellIndex] + ".png");
//
//                setTimeout(function () {
//                    imgTag.setAttribute("src", "pics/0.png");
//                    firstCell.setAttribute("src", "pics/0.png");
//                }, 1000);
//                
//
//            } else {
//                imgTag.setAttribute("src", "pics/" + cells[cellIndex] + ".png");
//                firstCell = imgTag;
//            }
//            
//            
//        };
//        
//        aTag.appendChild(imgTag);
//        liTag.appendChild(aTag);
//        
//        return liTag;
//    };
//    board = function () {
//        var containerTag, boardTag, resultsTag, cellIndex, ulTag;
//        
//        containerTag = document.createElement("article");
//        containerTag.setAttribute("class", "memory-container");
//        
//        boardTag = document.createElement("section");
//        boardTag.setAttribute("class", "memory-board");
//        
//        ulTag = document.createElement("ul");
//        
//        for (cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
//            ulTag.appendChild(cell(cellIndex));
//        }
//        
//        resultsTag = document.createElement("section");
//        resultsTag.setAttribute("class", "memory-results");
//        
//        boardTag.appendChild(ulTag);
//        containerTag.appendChild(boardTag);
//        containerTag.appendChild(resultsTag);
//        
//        return containerTag;
//        
//    };
//    
//    console.log(board());
//    document.querySelector("main").appendChild(board());