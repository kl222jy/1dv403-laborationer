"use strict";
/*global window, event, document, console, alert */

var KLOS = KLOS || {};

KLOS.MemoryGameID = 0;

KLOS.menu = function () {
    var menuItems = document.querySelectorAll("nav a");
    
    menuItems[0].onclick = function () {
        document.querySelector("main").innerHTML = "";
    };
    menuItems[1].onclick = function () {
        new KLOS.MessageBoard("messageBoard" + KLOS.MessageBoardID);
        KLOS.MessageBoardID += 1;
    };
    menuItems[2].onclick = function () {
        new KLOS.Memory(KLOS.MemoryGameID);
        KLOS.MemoryGameID += 1;
    };
    menuItems[3].onclick = function () {
        alert("Inte tillgänglig förrän efter nästa laboration");
    };
};

KLOS.EventUtil = {};

KLOS.WindowManager = {
    //instanserna som startas från menyn bör startas här och fungera som container
    //då kan all fönsterhantering hamna här
    //det som skapas måste då pekas om lite hur det hamnar i dokumentet
    //alternativt kan fönsterhanteringsfunktionalitet läggas här och köras inifrån de andra
};

window.onload = function () {
    KLOS.menu();
};

