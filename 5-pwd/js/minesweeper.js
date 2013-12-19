/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout*/
(function (KLOS) {
    "use strict";
    
    KLOS.MineSweeper = function () {
        KLOS.WM.call(this, "Mine Sweeper");
        this.windowIcon.setAttribute("src", "img/minesweeper.png");

        var pTag = document.createElement("p");
        pTag.textContent = "Placeholder";
        
        this.windowBody.appendChild(pTag);
    };

}(window.KLOS = window.KLOS || {}));