/*global window, event, document, console, alert, object */
//(KLOS, undefined)? klagomål från jslint. 
//Trevlig lösning, slipper window onload, bra hantering inför användning av fler moduler och möjlighet att skjuta in hänvisningar till andra moduler som argument i kortare form.
(function (KLOS) {
    "use strict";
    var menu, counter, MemoryGameID, WindowManager, TestBox, inheritPrototype;
    
    counter = 1;
    MemoryGameID = 0;
    
    menu = (function () {
        var menuItems = document.querySelectorAll("nav a");
        
        menuItems[0].onclick = function () {
            document.querySelector("main").innerHTML = "";
        };
        menuItems[1].onclick = function () {
            var messageBoardInstance = new KLOS.MessageBoard("messageBoard" + KLOS.MessageBoardID);
            KLOS.MessageBoardID += 1;
        };
        menuItems[2].onclick = function () {
            var memoryGameInstance = new KLOS.Memory(KLOS.MemoryGameID);
            KLOS.MemoryGameID += 1;
        };
        menuItems[3].onclick = function () {
            var testBoxInstance = new TestBox("testruta");
        };
    }());
    
//    KLOS.EventUtil = {};
    
//    WindowManager = function () {
        
        //Samtliga "programinstanser" ska ärva från WM, som i sin tur har all fönsterfunktionalitet(flytta, ändra storlek, minimera, maximera)
        //Inkapslande html i WM, högre z-index på innehållet för att inte skriva över klick event på "programinstaser"
        //Läs vidare om parasitic combination inheritance (pro js s. 212-214)
        
        //Alternativ lösning är att bara skicka objektanropen till wm som i sin tur kör anropet och nästlar in detta i sin html, vilket förmodligen är lättare.
        

//    };

    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    function WM(name) {
        this.name = name;
        this.testvalue = "blargh!";
        console.log("från WM: " + this.name);
    }
    
    WM.prototype.testFunction = function (alertMessage) {
        alert(alertMessage);
    };
    
    inheritPrototype = function (subType, superType) {
        var prototype = object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };
        
    TestBox = function (name) {
        WM.call(this, name);
        console.log(this.testvalue);
        this.testFunction("fungerade!");
    };
    
    inheritPrototype(TestBox, WM);

    
//    KLOS.init = function () {
//        KLOS.menu();
//    };
//    
//    KLOS.init();
    
}(window.KLOS = window.KLOS || {}));






//
//"use strict";
//
//var KLOS = KLOS || {};
//
//
//
//window.onload = function () {
//    KLOS.menu();
//};
//
