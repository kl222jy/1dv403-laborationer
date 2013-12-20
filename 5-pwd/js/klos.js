/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout*/

//(KLOS, undefined)? klagomål från jslint. 
//Trevlig lösning, slipper window onload, bra hantering inför användning av fler moduler och möjlighet att skjuta in hänvisningar till andra moduler som argument i kortare form.
(function (KLOS) {
    "use strict";
    var menu, counter, MemoryGameID, WindowManager, AboutBox, inheritPrototype, Memory, MessageBoard, MessageBoardID, MessageBoardCounter, css, cssNav, windowPositionTimout;

    KLOS.desktop = document.querySelector("main");
    css = getComputedStyle(KLOS.desktop);
    cssNav = getComputedStyle(document.querySelector("nav"));
    KLOS.desktopWidth = parseInt(css.width, 10);
    KLOS.desktopHeight = parseInt(css.height, 10) - parseInt(cssNav.height, 10);
    
    KLOS.counter = 1;
    KLOS.top = 15;
    KLOS.left = 15;
    KLOS.right = 15;
    MemoryGameID = 0;
    MessageBoardCounter = 1;
    MessageBoardID = 1;
    
    menu = (function () {
        var menuItems = document.querySelectorAll("nav a");
        
        menuItems[0].onclick = function () {
            document.querySelector("main").innerHTML = "";
            return false;
        };
        menuItems[1].onclick = function () {
            var messageBoardInstance = new KLOS.MessageBoard("messageBoard" + MessageBoardID);
            MessageBoardID += 1;
            return false;
        };
        menuItems[2].onclick = function () {
            var memoryGameInstance = new KLOS.Memory("Memory" + MemoryGameID);
            MemoryGameID += 1;
            return false;
        };
        menuItems[3].onclick = function () {
            var mineSweeperInstance = new KLOS.MineSweeper();
            return false;
        };
        menuItems[4].onclick = function () {
            var imageViewerInstance = new KLOS.ImageViewer();
            return false;
        };
        menuItems[5].onclick = function () {
            var rssReaderInstace = new KLOS.RssReader();
            return false;
        };
        menuItems[6].onclick = function () {
            var aboutBoxInstance = new AboutBox("Om");
            return false;
        };
        
    }());
    
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    KLOS.WM = function (name) {
        var test, render, windowBody, windowToolBar, windowStatusBar, that, offsetY, offsetX, move, currentWidth, currentHeight, startOffsetX, startOffsetY, resize;

        this.windowIcon = null;
        this.windowTitleBar = null;
        this.windowToolBar = null;
        this.windowBody = null;
        this.windowStatusBar = null;
        
        
        
        that = this;
        render = (function () {
            var width, height,
                klosWindow = document.createElement("article"),
                titleBar = document.createElement("header"),
                body = document.createElement("section"),
                closeImg = document.createElement("img"),
                closeA = document.createElement("a"),
                toolBar = document.createElement("section"),
                toolBarMenus = document.createElement("ul"),
                toolBarMenu = document.createElement("ul"),
                toolBarMenuFile = document.createElement("li"),
                toolBarMenuFileClose = document.createElement("li"),
                statusBar = document.createElement("section"),
                title = document.createElement("h1"),
                icon = document.createElement("img");
     
            klosWindow.setAttribute("class", "window");
            body.setAttribute("class", name.replace(" ", ""));

            
            //Start - Titlebar------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            closeImg.setAttribute("src", "img/close.png");
            closeImg.setAttribute("draggable", "false");
            closeA.setAttribute("href", "#");
            closeA.setAttribute("class", "windowClose");
            

            icon.setAttribute("width", "20px");
            icon.setAttribute("height", "20px");
            icon.setAttribute("class", "windowIcon");

            title.textContent = name;

            closeA.appendChild(closeImg);
            titleBar.appendChild(closeA);
            
            titleBar.appendChild(icon);
            titleBar.appendChild(title);
            titleBar.appendChild(closeA);

            //Start - Toolbar-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            toolBar.setAttribute("class", "toolBar");
            toolBarMenus.setAttribute("class", "toolBarMenus");
            toolBarMenuFile.textContent = "Arkiv";
            toolBarMenuFileClose.textContent = "Stäng";
            
            toolBarMenuFileClose.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                KLOS.desktop.removeChild(klosWindow);
            };
            
            toolBarMenuFile.onclick = function () {
                toolBarMenu.classList.toggle("show");
                return false;
            };
            
            
            toolBarMenu.appendChild(toolBarMenuFileClose);
            toolBarMenuFile.appendChild(toolBarMenu);
            toolBarMenus.appendChild(toolBarMenuFile);
            toolBar.appendChild(toolBarMenus);
            
            
            
            //Start - Statusbar-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            statusBar.setAttribute("class", "statusBar");
            
            
            
            
            //Start Window funktioner-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            //Kommer bli problem med nedanstående, kontrollera om det går att skriva direkt till computed css eller liknande. 
            //Annars kommer den återgå till standardposition när storlek ändras och standardstorlek när den flyttas.
            //Alternativt ha variabler för alla värden och få med båda funktioners variabler i vardera style
            //Start-ResizeWindow
//            resize = function (e) {
//                var width, height;
//                e = e || event;
//                
//                width = e.clientX - startOffsetX;
//                height = e.clientY - startOffsetY;
//                
//                klosWindow.setAttribute("style", "width: " + width + "px; height: " + height + "px; z-index: " + counter);
//            };
//            
//            body.onmousedown = function (e) {
//                var css = getComputedStyle(klosWindow);
//                e = e || event;
//                startOffsetX = parseInt(css.getPropertyValue("width"), 10) - e.clientX;
//                startOffsetY = parseInt(css.getPropertyValue("height"), 10) - e.clientY;
//                counter += 1;
//                window.addEventListener("windowResize", resize, false);
//            };
//            
//            window.onmouseup = function (e) {
//                e = e || event;
//                window.removeEventListener("windowResize", resize, false);
//            };
//            
            //End-ResizeWindow
            
            
            //Start-MoveWindow
            move = function (e) {
                e = e || event;
                klosWindow.setAttribute("style", "left: " + (offsetX + e.clientX) + "px; top: " + (offsetY + e.clientY) + "px; z-index: " + KLOS.counter);
            };
    
            titleBar.onmousedown = function (e) {
                e = e || event;
                e.preventDefault();
                var css = getComputedStyle(klosWindow);
                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
                counter += 1;
                window.addEventListener("mousemove", move, false);
            };
            window.onmouseup = function (e) {
                e = e || event;
                window.removeEventListener("mousemove", move, false);
            };
            //End-MoveWindow
            
            //Start-CloseWindow
            
            closeA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                KLOS.desktop.removeChild(klosWindow);
            };
            
            //End-CloseWindow
            
            //END WINDOW FUNKTIONER-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            
            klosWindow.appendChild(titleBar);
            klosWindow.appendChild(toolBar);
            klosWindow.appendChild(body);
            klosWindow.appendChild(statusBar);
       
            klosWindow.classList.toggle("hide");
            
            that.windowIcon = icon;
            that.windowTitleBar = titleBar;
            that.windowStatusBar = statusBar;
            that.windowToolBar = toolBarMenus;
            that.windowBody = body;
            KLOS.desktop.appendChild(klosWindow);
            
            //Start-placering
            windowPositionTimout = setTimeout(function () {
            
                css = getComputedStyle(klosWindow);
                width = parseInt(css.width, 10);
                height = parseInt(css.height, 10);
                
//                if (((KLOS.top * 15) + KLOS.left + width) <= KLOS.desktopWidth && (KLOS.top * 15) + height <= KLOS.desktopHeight) {
//                    klosWindow.setAttribute("style", "top: " + 15 * KLOS.top + "px; left: " + ((15 * KLOS.top) + KLOS.left) + "px;");
//                    KLOS.top += 1;
//                } else {
//                    KLOS.top = 1;
//                    KLOS.left += 50;
//                    klosWindow.setAttribute("style", "top: " + 15 * KLOS.top + "px; left: " + (15 * KLOS.top) + KLOS.left + "px;");
//                }

                if (KLOS.left + width <= KLOS.desktopWidth || KLOS.top + height <= KLOS.desktopHeight) {
                    if (KLOS.top + height <= KLOS.desktopHeight) {
                        KLOS.top += 15;
                    } else {
                        KLOS.top = 15;
                    }
                    if (KLOS.left + width <= KLOS.desktopWidth) {
                        KLOS.left += 15;
                    } else {
                        KLOS.left = 15;
                    }
                } else {
                    KLOS.top = 15;
                    KLOS.left = 15;
                }
                klosWindow.setAttribute("style", "top: " + KLOS.top + "px; left: " + KLOS.left + "px;");
//                klosWindow.classList.add("show");
                klosWindow.classList.toggle("hide");
                
                //End-placering
                

            }, 5);
        }());
    };
    
//    WM.prototype.testFunction = function (alertMessage) {
//        alert(alertMessage);
//    };
    
    inheritPrototype = function (subType, superType) {
        var prototype = object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };
        
    AboutBox = function (name) {
        KLOS.WM.call(this, name);
        
        this.windowIcon.setAttribute("src", "img/about.png");
        
        var aboutTag = document.createElement("p");
        aboutTag.textContent = "Applikationen skapad av Kristoffer lind.";
        this.windowBody.appendChild(aboutTag);
    };
    
//    KLOS.SimpleWindow = function (name) {
//        call KLOS.WM(this, name);
//    };
//    
//    AboutBox = function () {
//        call KLOS.SimpleWindow(this, "AboutBox");
//    };
//    
//    
//    inheritPrototype(KLOS.SimpleWindow, KLOS.WM);
//    inheritPrototype(AboutBox, KLOS.SimpleWindow);
    
    inheritPrototype(KLOS.MineSweeper, KLOS.WM);
    inheritPrototype(KLOS.RssReader, KLOS.WM);
    inheritPrototype(KLOS.ImageViewer, KLOS.WM);
    inheritPrototype(KLOS.ImageView, KLOS.WM);
    inheritPrototype(AboutBox, KLOS.WM);
    inheritPrototype(KLOS.Memory, KLOS.WM);
    inheritPrototype(KLOS.MessageBoard, KLOS.WM);
    
    KLOS.XhrCon = function (url, callback) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status) < 300 || xhr.status === 304) {
                    callback(xhr.responseText);
//                    return JSON.parse(xhr.responseText);
                } else {
                    console.log("Fel vid inläsning, xhr.status: " + xhr.status);
                }
            }
        };
        
        xhr.open("get", url, true);
        xhr.send(null);
    };
    
    
}(window.KLOS = window.KLOS || {}));
