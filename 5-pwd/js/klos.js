/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout*/

//(KLOS, undefined)? klagomål från jslint. 
//Trevlig lösning, slipper window onload, bra hantering inför användning av fler moduler och möjlighet att skjuta in hänvisningar till andra moduler som argument i kortare form.
(function (KLOS) {
    "use strict";
    var menu, counter, MemoryGameID, WindowManager, AboutBox, inheritPrototype, Memory, MessageBoard, MessageBoardID, MessageBoardCounter, css, cssNav, windowPositionTimout, CustomEvent, blackout, modal, disableSelection;

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
    KLOS.menuItems = document.querySelectorAll("nav a");
    
    menu = (function (menuItems) {

        
        menuItems[0].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var allwin = document.querySelectorAll("article.window"),
                max = allwin.length,
                i = 0;
            
            for (i = 0; i < max; i += 1) {
                allwin[i].classList.add("minimized");
            }
            
//            document.querySelector("main").innerHTML = "";
//            return false;
        };
        menuItems[1].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var messageBoardInstance = new KLOS.MessageBoard("messageBoard" + MessageBoardID, e.target);
            MessageBoardID += 1;
        };
        menuItems[2].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var memoryGameInstance = new KLOS.Memory("Memory" + MemoryGameID, e.target);
            MemoryGameID += 1;
        };
        menuItems[3].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var mineSweeperInstance = new KLOS.MineSweeper(e.target);
        };
        menuItems[4].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var imageViewerInstance = new KLOS.ImageViewer(e.target);
        };
        menuItems[5].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var rssReaderInstace = new KLOS.RssReader(e.target);
        };
        menuItems[6].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var aboutBoxInstance = new AboutBox("Om", e.target);
        };
        
    }(KLOS.menuItems));
    
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    KLOS.WM = function (name, menuButton) {
        var test, render, windowBody, windowToolBar, windowStatusBar, that, offsetY, offsetX, move, currentWidth, currentHeight, startOffsetX, startOffsetY, resize;

        this.windowIcon = null;
        this.windowTitleBar = null;
        this.windowToolBar = null;
        this.windowBody = null;
        this.windowStatusBar = null;
        this.fullWindow = null;
        this.menuButtonLi = menuButton.parentElement.parentElement;
        
        that = this;
        render = (function () {
            var width, height, updateWindow, windowWidth, windowHeight, windowLeft, windowTop, startmenu, minWidth, minHeight,
                klosWindow = document.createElement("article"),
                titleBar = document.createElement("header"),
                body = document.createElement("section"),
                closeImg = document.createElement("img"),
                closeA = document.createElement("a"),
                maxImg = document.createElement("img"),
                maxA = document.createElement("a"),
                minImg = document.createElement("img"),
                minA = document.createElement("a"),

                toolBar = document.createElement("section"),
                toolBarMenus = document.createElement("ul"),
                toolBarMenu = document.createElement("ul"),
                toolBarMenuFile = document.createElement("li"),
                toolBarMenuFileClose = document.createElement("li"),
                statusBar = document.createElement("section"),
                title = document.createElement("h1"),
                icon = document.createElement("img"),
                resizer = document.createElement("img"),
                newUl = document.createElement("ul"),
                ul = that.menuButtonLi.querySelector("ul"),
                li = document.createElement("li");
     
            klosWindow.setAttribute("class", "window");
            body.setAttribute("class", name.replace(" ", ""));

            //Start - startmeny-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            startmenu = (function () {
                li.onmouseover = function () {
                    klosWindow.classList.add("shadow");
                };
                
                li.onmouseout = function () {
                    klosWindow.classList.remove("shadow");
                };
                
                li.onclick = function () {
                    klosWindow.classList.remove("minimized");
                };
                
                li.textContent = name;
                newUl.setAttribute("class", "startMenuProgramInstances");
                
                if (that.menuButtonLi.contains(ul)) {
                    ul.appendChild(li);
                } else {
                    newUl.appendChild(li);
                    that.menuButtonLi.appendChild(newUl);
                }
            }());
            
            //Slut - startmeny-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            //Start - Titlebar------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            closeImg.setAttribute("src", "img/close.png");
            closeImg.setAttribute("draggable", "false");
            closeA.setAttribute("href", "#");
            closeA.setAttribute("class", "windowClose");
            
            maxImg.setAttribute("src", "img/maximize.png");
            maxImg.setAttribute("draggable", "false");
            maxA.setAttribute("href", "#");
            maxA.setAttribute("class", "windowMaximize");
            
            minImg.setAttribute("src", "img/minimize.png");
            minImg.setAttribute("draggable", "false");
            minA.setAttribute("href", "#");
            minA.setAttribute("class", "windowMinimize");
            

            icon.setAttribute("width", "20px");
            icon.setAttribute("height", "20px");
            icon.setAttribute("class", "windowIcon");

            title.textContent = name;

            maxA.appendChild(maxImg);
            minA.appendChild(minImg);
            closeA.appendChild(closeImg);

            titleBar.appendChild(closeA);
            titleBar.appendChild(maxA);
            titleBar.appendChild(minA);
            
            titleBar.appendChild(icon);
            titleBar.appendChild(title);
            
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
                that.menuButtonLi.querySelector("ul").removeChild(li);
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
            resizer.setAttribute("src", "img/resizer2.png");
            resizer.setAttribute("class", "windowResizer");
            resizer.setAttribute("draggable", "false");
            
            if (name !== "Memory" && name !== "ImageView") {
                statusBar.appendChild(resizer);
            }
            
            //Start Window funktioner-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            
            
            //Kommer bli problem med nedanstående, kontrollera om det går att skriva direkt till computed css eller liknande. 
            //Annars kommer den återgå till standardposition när storlek ändras och standardstorlek när den flyttas.
            //Alternativt ha variabler för alla värden och få med båda funktioners variabler i vardera style
            //Start-ResizeWindow
            resize = function (e) {
                e = e || event;
                
                disableSelection(e.target);
                
                width = e.clientX - startOffsetX;
                height = e.clientY - startOffsetY;
                
                if (height <= minHeight) {
                    windowHeight = minHeight;
                } else {
                    windowHeight = height;
                }
                if (width <= minWidth) {
                    windowWidth = minWidth;
                } else {
                    windowWidth = width;
                }

                updateWindow();
            };
            
            resizer.onmousedown = function (e) {
                var css = getComputedStyle(klosWindow);
                e = e || event;
                e.preventDefault();
                startOffsetX = parseInt(css.getPropertyValue("left"), 10) - 5;
                startOffsetY = parseInt(css.getPropertyValue("top"), 10) - 5;
                KLOS.counter += 1;
                window.addEventListener("mousemove", resize, false);
            };
            
            document.onmouseup = function (e) {
                e = e || event;
                e.preventDefault();
                window.removeEventListener("mousemove", resize, false);
            };
            
            //End-ResizeWindow
            
            
            //Start-MoveWindow
            move = function (e) {
                e = e || event;
                e.preventDefault();
                var css, width, height, left, top;
                css = getComputedStyle(klosWindow);
                width = parseInt(css.width, 10);
                height = parseInt(css.height, 10);
                
                left = offsetX + e.clientX;
                top = offsetY + e.clientY;
                
                //max-höger
                if (left + width >= KLOS.desktopWidth) {
                    left = KLOS.desktopWidth - width;
                }
                //max-vänster
                if (left <= 0) {
                    left = 0;
                }
                //max-nedåt
                if (top + height >= KLOS.desktopHeight) {
                    top = KLOS.desktopHeight - height;
                }
                //max-uppåt
                if (top <= 0) {
                    top = 0;
                }
                
                windowLeft = left;
                windowTop = top;
                
                updateWindow();
                
//                klosWindow.setAttribute("style", "left: " + left + "px; top: " + top + "px; z-index: " + KLOS.counter);
            };
    
            titleBar.onmousedown = function (e) {
                e = e || event;
                e.preventDefault();
                var css = getComputedStyle(klosWindow);
                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
                KLOS.counter += 1;
                window.addEventListener("mousemove", move, false);
            };
            
            titleBar.onmouseup = function (e) {             //Problem om fönstret inte hängt med och mouseup sker på window, men lägger jag eventet på window så släpps inte fönstret efter att förflyttning av ett annat fönster gjorts innan samma fönster flyttas igen, då släpps inte fönstret.. eventet avfyras inte då? Lösningen kan vara att köra preventdefault på mousedown på window, men då får jag väl istället problem med att onclick aldrig fungerar.
                e = e || event;
                e.preventDefault();
                window.removeEventListener("mousemove", move, false);
//                window.removeEventListener("mousemove", resize, false);
            };
            
            
            //End-MoveWindow
            
            //Start-CloseWindow
            
            closeA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                KLOS.desktop.removeChild(klosWindow);
                that.menuButtonLi.querySelector("ul").removeChild(li);
            };
            
            maxA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                windowLeft = 0;
                windowTop = 0;
                windowHeight = KLOS.desktopHeight;
                windowWidth = KLOS.desktopWidth;
                
                updateWindow();
            };
            
            minA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                klosWindow.classList.add("minimized");
            };
            
            //End-CloseWindow
            
            updateWindow = function () {
                klosWindow.setAttribute("style", "width: " + windowWidth + "px; height: " + windowHeight + "px; z-index: " + KLOS.counter + "; left: " + windowLeft + "px; top: " + windowTop + "px;");
            };
            
            //END WINDOW FUNKTIONER-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            
            klosWindow.appendChild(titleBar);
            klosWindow.appendChild(toolBar);
            klosWindow.appendChild(body);
            klosWindow.appendChild(statusBar);
       
            klosWindow.classList.toggle("hide");
            
            that.fullWindow = klosWindow;
            that.windowIcon = icon;
            that.windowTitleBar = titleBar;
            that.windowStatusBar = statusBar;
            that.windowToolBar = toolBarMenus;
            that.windowBody = body;
            KLOS.desktop.appendChild(klosWindow);
            
            //Start-placering
            
            if (name === "MessageBoard") {
                windowHeight = 400;
                windowWidth = 400;
                updateWindow();
            }
            if (name === "ImageViewer") {
                windowHeight = 300;
                windowWidth = 350;
                updateWindow();
            }
            if (name === "RSS Reader") {
                windowHeight = 400;
                windowWidth = 450;
                updateWindow();
            }
            if (name === "Om") {
                windowHeight = 200;
                windowWidth = 300;
                updateWindow();
            }
            
            
            
            klosWindow.addEventListener("instanceReady", function () {
                css = getComputedStyle(klosWindow);
                width = parseInt(css.width, 10);
                height = parseInt(css.height, 10);
                
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
                
                windowLeft = KLOS.left;
                windowTop = KLOS.top;
                
                minWidth = width;
                minHeight = height;
                
                updateWindow();
                
//                klosWindow.setAttribute("style", "top: " + KLOS.top + "px; left: " + KLOS.left + "px;");
                klosWindow.classList.toggle("hide");
            }, false);

            //End-placering

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
        
    AboutBox = function (name, menuButton) {
        KLOS.WM.call(this, name, menuButton);
        
        this.windowIcon.setAttribute("src", "img/about.png");
        
        var instanceReady,
            aboutTag = document.createElement("p"),
            aTag = document.createElement("a"),
            aTag2 = document.createElement("a"),
            brTag = document.createElement("br");
        
        aTag.setAttribute("href", "https://www.iconfinder.com/iconsets/windows8_icons_iconpharm");
        aTag.textContent = "win8 icons by iconpharm";
        
        aTag2.setAttribute("href", "https://www.iconfinder.com/search/?q=iconset%3APrimo_Icons");
        aTag2.textContent = "Primo Icons";
        
        aboutTag.textContent = "Applikationen skapad av Kristoffer lind. Ikoner från iconfinder har använts, länkar till dessa nedan.";
        this.windowBody.appendChild(aboutTag);
        this.windowBody.appendChild(aTag);
        this.windowBody.appendChild(brTag);
        this.windowBody.appendChild(aTag2);
        
        
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);

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
    
    
    //start polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    CustomEvent.prototype = window.CustomEvent.prototype;

    KLOS.CustomEvent = CustomEvent;
    //end polyfill
    
    inheritPrototype(KLOS.MineSweeper, KLOS.WM);
    inheritPrototype(KLOS.RssReader, KLOS.WM);
    inheritPrototype(KLOS.ImageViewer, KLOS.WM);
    inheritPrototype(KLOS.ImageView, KLOS.WM);
    inheritPrototype(AboutBox, KLOS.WM);
    inheritPrototype(KLOS.Memory, KLOS.WM);
    inheritPrototype(KLOS.MessageBoard, KLOS.WM);
    
    //från mozilla-dev
    
//    KLOS.evaluateXPath = function (aNode, aExpr) {
//        var xpe = new XPathEvaluator(),
//            nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ? aNode.documentElement : aNode.ownerDocument.documentElement),
//            result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null),
//            found = [],
//            res;
//        
//        while (res = result.iterateNext())
//        found.push(res);
//        return found;
//    }
    
    
    KLOS.XhrCon = function (url, callback, xmlResponse) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status) < 300 || xhr.status === 304) {
                    if (xmlResponse === true) {
                        callback(xhr.responseXML);
                    } else {
                        callback(xhr.responseText);
                    }
//                    return JSON.parse(xhr.responseText);
                } else {
                    console.log("Fel vid inläsning, xhr.status: " + xhr.status);
                }
            }
        };
        
        xhr.open("get", url, true);
        xhr.send(null);
    };
   
    KLOS.showModal = function (innerModal) {
        modal = document.createElement("section");
        blackout = document.createElement("section");
        
        blackout.setAttribute("class", "blackout");
        modal.setAttribute("class", "modal");
        
        blackout.onclick = function (e) {
            e = e || event;
            e.preventDefault();
            e.stopPropagation();
            KLOS.removeModal();
        };
        
        modal.onclick = function (e) {
            e = e || event;
//            e.preventDefault();
            e.stopPropagation();
        };
        
        
        
        modal.appendChild(innerModal);
        document.body.appendChild(blackout);
        document.body.appendChild(modal);
    };
    
    KLOS.removeModal = function () {
        document.body.removeChild(blackout);
        document.body.removeChild(modal);
    };
    
    disableSelection = function (element) {
        element.onselectstart = function () {return false; };
        element.unselectable = "on";
        element.style.MozUserSelect = "none";
        element.style.cursor = "default";
    };
    
    disableSelection(document.body);
    
}(window.KLOS = window.KLOS || {}));
