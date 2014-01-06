/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout, localStorage*/
(function (KLOS) {
    "use strict";
    
    KLOS.Notepad = function (menuButton) {
        KLOS.WM.call(this, "Notepad", menuButton);
        this.windowIcon.setAttribute("src", "img/notepad.png");

        var instanceReady,
            textPadForm = document.createElement("form"),
            textPad = document.createElement("textarea");
        textPad.setAttribute("class", "textPad");
        textPad.value = localStorage.textPad;
        
        textPad.onkeydown = function (e) {
            var cursorPostition;
            e = e || event;
            if (e.keyCode === 9) {
                e.preventDefault();
                cursorPostition = textPad.selectionStart;
                textPad.value = textPad.value.substr(0, cursorPostition) + "\t" + textPad.value.substr(textPad.selectionEnd);
                textPad.selectionEnd = cursorPostition + 1;
            }
            localStorage.textPad = textPad.value;
        };
        
        textPadForm.appendChild(textPad);
        this.windowBody.appendChild(textPadForm);
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };

}(window.KLOS = window.KLOS || {}));