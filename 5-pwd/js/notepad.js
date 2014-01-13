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
        textPad.value = localStorage.textPad || "";
        
        //Ändrar tab från standardfunktionalitet till dokumenttabbning
        textPad.onkeydown = function (e) {
            var cursorPostition;
            e = e || event;
            //Om tab
            if (e.keyCode === 9) {
                e.preventDefault();
                //Spara markörens position
                cursorPostition = textPad.selectionStart;
                //Infogar \t - från textfältets början till markörpositionen + \t + från markören till dokumentets slut
                textPad.value = textPad.value.substr(0, cursorPostition) + "\t" + textPad.value.substr(textPad.selectionEnd);
                //Sätt markörpositionen
                textPad.selectionEnd = cursorPostition + 1;
            }
        };
        
        //Sparar textfältets värde i localstorage efter varje knapptryck
        textPad.onkeyup = function () {
            localStorage.textPad = textPad.value;
        };
        
        textPadForm.appendChild(textPad);
        this.windowBody.appendChild(textPadForm);
        
        //Sänd ett event om att programinstansen är färdigladdad
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };

}(window.KLOS = window.KLOS || {}));