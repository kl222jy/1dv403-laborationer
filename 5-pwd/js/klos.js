/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout*/

//Innehåller all övergripande logik, menyhantering, fönsterhantering, xhr, popup och customevent
//Lösningen med en anonym självexekverande funktion som namespace gör att allt som inte läggs på KLOS blir privat och oåtkomligt utifrån. (Efter att ha tittat på testning är jag inte helt säker på att det var en bra idé. Applicera lösningen på mindre moduler istället så blir det nog bra.
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
    
    //Hanterar menyn, e.target skickas med för att senare kunna räkna ut var instansen ska dockas
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
            var aboutBoxInstance = new KLOS.Notepad(e.target);
        };
        menuItems[7].onclick = function (e) {
            e = e || event;
            e.preventDefault();
            var aboutBoxInstance = new AboutBox("Om", e.target);
        };
        
    }(KLOS.menuItems));
        
    //Fönsterhantering
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
        
        //Självexekverande funktion som ritar upp fönster (all logik för fönsterhantering är invävd här, borde flyttas till prototypen)
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

            //Hanterar dockningen
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
            
            //Fönster som inte går att ändra storlek på bör rimligen inte gå att maximera heller. Borde hanteras med ett argument till KLOS.WM istället
            if (name !== "Memory" && name !== "ImageView") {
                titleBar.appendChild(maxA);
            }
            titleBar.appendChild(minA);
            
            titleBar.appendChild(icon);
            titleBar.appendChild(title);
            
            //Start - Toolbar-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            toolBar.setAttribute("class", "toolBar");
            toolBarMenus.setAttribute("class", "toolBarMenus");
            toolBarMenuFile.textContent = "Arkiv";
            toolBarMenuFileClose.textContent = "Stäng";
            
            //Stängning av fönster via verktygsfältet
            toolBarMenuFileClose.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                KLOS.desktop.removeChild(klosWindow);
                that.menuButtonLi.querySelector("ul").removeChild(li);
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
            
            //Det ska inte gå att ändra storlek på alla fönster. Borde vara argument istället för hårdkodat.
            if (name !== "Memory" && name !== "ImageView") {
                statusBar.appendChild(resizer);
            }
            
            //Start Window funktioner-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            
            //Logik för ändring av storlek
            resize = function (e) {
                e = e || event;

                width = e.clientX - startOffsetX;
                height = e.clientY - startOffsetY;
                
                //Om nuvarande höjd är mindre än minsta tillåtna höjd, sätt höjd till minsta tillåtna höjd, sätt annars fönstrets höjd till beräknad höjd
                if (height <= minHeight) {
                    windowHeight = minHeight;
                } else {
                    windowHeight = height;
                }
                //Som ovan, fast för bredd
                if (width <= minWidth) {
                    windowWidth = minWidth;
                } else {
                    windowWidth = width;
                }
                
                //Om beräknad bredd är mer än skrivbordets bredd, sätt fönsterbredd till skrivbordsbredd
                if (width >= KLOS.desktopWidth - startOffsetX - 5) {
                    windowWidth = KLOS.desktopWidth - startOffsetX - 5;
                }
                //Som ovan, fast för höjd
                if (height >= KLOS.desktopHeight - startOffsetY - 8) {
                    windowHeight = KLOS.desktopHeight - startOffsetY - 8;
                }
                
                //Uppdatera fönster, sätter alla css värden från variabler. Behövs eftersom det inte går att sätta enskilda värden.
                updateWindow();
            };
            
            //Aktiverar mousemove för resize
            resizer.onmousedown = function (e) {
                var css = getComputedStyle(klosWindow);
                e = e || event;
                e.preventDefault();
                startOffsetX = parseInt(css.getPropertyValue("left"), 10) - 5;
                startOffsetY = parseInt(css.getPropertyValue("top"), 10) - 5;
                KLOS.counter += 1;
                window.addEventListener("mousemove", resize, false);
            };
            
            //Avaktiverar mousemove för resize
            window.addEventListener("mouseup", function () {
                window.removeEventListener("mousemove", resize, false);
            }, false);
            
            //Logik för förflyttning av fönster
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
                titleBar.style.cursor = "move";
            };
    
            //Aktiverar data från mousemove till move
            titleBar.onmousedown = function (e) {
                e = e || event;
                e.preventDefault();
                var css = getComputedStyle(klosWindow);
                offsetX = parseInt(css.getPropertyValue("left"), 10) - e.clientX;
                offsetY = parseInt(css.getPropertyValue("top"), 10) - e.clientY;
                KLOS.counter += 1;
                updateWindow();
                window.addEventListener("mousemove", move, false);
                titleBar.style.cursor = "move";
            };
            
            titleBar.onmouseover = function (e) {
                titleBar.style.cursor = "pointer";
            };
            
            //Avaktiverar data från mousemove till move
            window.addEventListener("mouseup", function () {
                window.removeEventListener("mousemove", move, false);
                titleBar.style.cursor = "pointer";
            }, false);

            //Uppdatering av z-index för fönster vid klick
            klosWindow.onmousedown = function () {
                KLOS.counter += 1;
                updateWindow();
            };

            //Stängning av fönster via stäng-knapp
            closeA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                KLOS.desktop.removeChild(klosWindow);
                that.menuButtonLi.querySelector("ul").removeChild(li);
            };
            
            //Maximera/Återställ fönster
            maxA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                
                if (windowHeight !== KLOS.desktopHeight && windowWidth !== KLOS.desktopWidth) {
                    windowLeft = 0;
                    windowTop = 0;
                    windowHeight = KLOS.desktopHeight;
                    windowWidth = KLOS.desktopWidth;
                } else {
                    windowLeft = 50;
                    windowTop = 50;
                    windowHeight = minHeight;
                    windowWidth = minWidth;
                }
                    
                updateWindow();
            };
            
            //Minimera fönster
            minA.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                klosWindow.classList.add("minimized");
            };

            //Uppdaterar css för ett fönster
            updateWindow = function () {
                klosWindow.setAttribute("style", "width: " + windowWidth + "px; height: " + windowHeight + "px; z-index: " + KLOS.counter + "; left: " + windowLeft + "px; top: " + windowTop + "px;");
            };

            klosWindow.appendChild(titleBar);
            klosWindow.appendChild(toolBar);
            klosWindow.appendChild(body);
            klosWindow.appendChild(statusBar);
       
            //Döljer fönstret tills innehållet har laddats
            klosWindow.classList.toggle("hide");
            
            that.fullWindow = klosWindow;
            that.windowIcon = icon;
            that.windowTitleBar = titleBar;
            that.windowStatusBar = statusBar;
            that.windowToolBar = toolBarMenus;
            that.windowBody = body;
            KLOS.desktop.appendChild(klosWindow);
            
            //Start-placering
            
            //Block som sätter ursprungsstorlekar för de olika fönsterna, lät tidigare dess innehåll avgöra storlek, men fick inte det att fungera särskilt bra
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
            if (name === "Notepad") {
                windowHeight = 300;
                windowWidth = 400;
                updateWindow();
            }
            if (name === "Mine Sweeper") {
                windowHeight = 150;
                windowWidth = 250;
                updateWindow();
            }
            
            //Lyssnar efter instanceReady, som skickas av de olika programinstanserna när de körts färdigt. Innehållet och därmed fönstret har då fått sin korrekta storlek och denna kan beräknas för att logik för fönsterplacering ska kunna köras
            klosWindow.addEventListener("instanceReady", function () {
                css = getComputedStyle(klosWindow);
                width = parseInt(css.width, 10);
                height = parseInt(css.height, 10);
                
                //Ökar horisontal och vertikal positionering med 15 tills gränsvärde för höjd eller bredd har nåtts
                if (KLOS.left + width <= KLOS.desktopWidth || KLOS.top + height <= KLOS.desktopHeight) {
                    //Ökar vertikal positionering med 15 tills gränsvärdet nåtts och startar då om från 15
                    if (KLOS.top + height <= KLOS.desktopHeight) {
                        KLOS.top += 15;
                    } else {
                        KLOS.top = 15;
                    }
                    //Som ovan, fast för horisontal ledd
                    if (KLOS.left + width <= KLOS.desktopWidth) {
                        KLOS.left += 15;
                    } else {
                        KLOS.left = 15;
                    }
                //Borde aldrig behövas
                } else {
                    KLOS.top = 15;
                    KLOS.left = 15;
                }
                
                windowLeft = KLOS.left;
                windowTop = KLOS.top;
                
                minWidth = width;
                minHeight = height;
                
                updateWindow();
                
                //Visar fönstret
                klosWindow.classList.toggle("hide");
            }, false);
            //End-placering
        }());
    };

    //Ur pro js for web developers. Returnerar ett nytt objekt med indata-objekt som prototyp. Används av inheritPrototype för att skapa prototyparv
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    //Skapar prototyparv - subType ärver från superType
    inheritPrototype = function (subType, superType) {
        var prototype = object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    };
    
    //Programinstans, about fönster. Lades till för att testköra arv, används nu för att uppfylla krav om länkar till använda resurser.
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
    
    //Möjliggör customevent i webbläsare som inte stödjer det
    //start polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = window.CustomEvent.prototype;
    //end polyfill

    //Gör customevent publikt
    KLOS.CustomEvent = CustomEvent;
    
    //Block som hanterar samtliga prototyparv
    inheritPrototype(KLOS.MineSweeper, KLOS.WM);
    inheritPrototype(KLOS.RssReader, KLOS.WM);
    inheritPrototype(KLOS.ImageViewer, KLOS.WM);
    inheritPrototype(KLOS.ImageView, KLOS.WM);
    inheritPrototype(AboutBox, KLOS.WM);
    inheritPrototype(KLOS.Memory, KLOS.WM);
    inheritPrototype(KLOS.MessageBoard, KLOS.WM);
    
    //Hanterar ajax requests, baserad på johan leitets kod i demo
    //Lagt till ett argument för att kunna få ut xmlsvar
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
                } else {
                    console.log("Fel vid inläsning, xhr.status: " + xhr.status);
                }
            }
        };
        
        xhr.open("get", url, true);
        xhr.send(null);
    };
   
    //Visar popup med innermodal som skickad html.
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
            e.stopPropagation();
        };
        
        modal.appendChild(innerModal);
        document.body.appendChild(blackout);
        document.body.appendChild(modal);
    };
    
    //Tar bort popup
    KLOS.removeModal = function () {
        document.body.removeChild(blackout);
        document.body.removeChild(modal);
    };
    
    //Förhindrar markering
    disableSelection = function (element) {
        element.onselectstart = function () {return false; };
        element.unselectable = "on";
        element.style.MozUserSelect = "none";
    };
    
    //Förhindra all markering
    disableSelection(document.body);
    
}(window.KLOS = window.KLOS || {}));
