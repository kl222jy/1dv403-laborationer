/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout*/
(function (KLOS) {
    "use strict";
    
    KLOS.MineSweeper = function (menuButton) {
        KLOS.WM.call(this, "Mine Sweeper", menuButton);
        this.windowIcon.setAttribute("src", "img/minesweeper.png");

        var instanceReady,
            pTag = document.createElement("p");
        pTag.textContent = "Placeholder";
        
        this.windowBody.appendChild(pTag);
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };

}(window.KLOS = window.KLOS || {}));