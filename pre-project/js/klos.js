/*global window, event, document, console, alert, object */
//(KLOS, undefined)? klagomål från jslint. 
//Trevlig lösning, slipper window onload, bra hantering inför användning av fler moduler och möjlighet att skjuta in hänvisningar till andra moduler som argument i kortare form.
(function (KLOS) {
    "use strict";
    var menu, counter, MemoryGameID, WindowManager, TestBox, inheritPrototype, desktop;
    
    desktop = document.querySelector("main");
    
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
    
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    function WM(name) {
//        this.name = name;
//        this.testvalue = "blargh!";
//        console.log("från WM: " + this.name);
        var test, render, windowBody, that;

        this.windowBody = null;
        that = this;
        render = (function () {
            var window = document.createElement("article"),
                titleBar = document.createElement("header"),
                body = document.createElement("section");
            
            window.setAttribute("class", "window");
            titleBar.textContent = name;
            body.setAttribute("id", name);
            
            window.appendChild(titleBar);
            window.appendChild(body);
            
            
            that.windowBody = body;
            desktop.appendChild(window);
        }());
    }
    
//    WM.prototype.testFunction = function (alertMessage) {
//        alert(alertMessage);
//    };
    
    inheritPrototype = function (subType, superType) {
        var prototype = object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };
        
    TestBox = function (name) {
        WM.call(this, name);
//        console.log(this.testvalue);
//        this.testFunction("fungerade!");
        var testTag = document.createElement("p");
        testTag.textContent = "Då provar vi om det här också kan tänkas fungera.";
        this.windowBody.appendChild(testTag);
    };
    
    inheritPrototype(TestBox, WM);
    inheritPrototype(KLOS.Memory, WM);
    inheritPrototype(KLOS.MessageBoard, WM);
    
}(window.KLOS = window.KLOS || {}));
