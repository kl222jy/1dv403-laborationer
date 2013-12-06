"use strict";
/*global window, event, document, console, alert */

var KLOS = KLOS || {};

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
        KLOS.Memory();
    };
    menuItems[3].onclick = function () {
        alert("Inte tillgänglig förrän efter nästa laboration");
    };
};

KLOS.EventUtil = {};

KLOS.WindowManager = {};

window.onload = function () {
    KLOS.menu();
};

