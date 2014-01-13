/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout, clearTimeout*/
(function (KLOS) {
    "use strict";
    var makeThumb;
    
    //Hanterar visning av bildlista
    KLOS.ImageViewer = function (menuButton) {
        KLOS.WM.call(this, "ImageViewer", menuButton);
        var xhr, images, imageListTag, max, i, imageLoadTimer, activityImage, that, instanceReady;
        
        this.windowIcon.setAttribute("src", "img/imageviewer.png");
        
        imageListTag = document.createElement("ul");
        imageListTag.setAttribute("class", "ImageViewerList");

        that = this;
        
        //Efter 300ms, häng på aktivitetsvisning i statusbar
        imageLoadTimer = setTimeout(function () {
            activityImage = document.createElement("img");
            activityImage.setAttribute("src", "img/activity.gif");
            activityImage.setAttribute("class", "activityImage");

            that.windowStatusBar.appendChild(activityImage);
        }, 300);
        
        //Hämtning av bildlista
        xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", function (data) {
            images = JSON.parse(data);
            
            //Ta bort timern så att inte aktivitetsbild läggs på efter att innehållet laddats
            clearTimeout(imageLoadTimer);
            
            //Max = lägsta möjliga värde
            max = -Infinity;
            
            //Sätter max till högsta hittade värde
            for (i = 0; i < images.length; i += 1) {
                if (images[i].thumbWidth > max) {
                    max = images[i].thumbWidth;
                }
            }
            
            //För varje bild i bildlistan, skapa thumbnail
            images.forEach(function (element) {
                var a = document.createElement("a"),
                    img = document.createElement("img"),
                    li = document.createElement("li");
                li.setAttribute("style", "width: " + max + "px");
                a.setAttribute("href", "#");
        
                a.onclick = function () {
                    var imageViewInstance = KLOS.ImageView(element, menuButton);
                };
                
                img.setAttribute("src", element.thumbURL);
                img.setAttribute("width", element.thumbWidth);
                
                a.appendChild(img);
                li.appendChild(a);
                imageListTag.appendChild(li);

            });

            //Om aktivitetsbild hunnit läggas i statusbar, ta bort den
            if (that.windowStatusBar.contains(activityImage)) {
                that.windowStatusBar.removeChild(activityImage);
            }
        });
        
        this.windowBody.appendChild(imageListTag);
        
        //Meddela KLOS.WM att innehållet har laddats färdigt
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };
    
    //Hanterar visning av enskilda bilder
    KLOS.ImageView = function (image, menuButton) {
        KLOS.WM.call(this, "ImageView", menuButton);
        var instanceReady,
            img = document.createElement("img"),
            toolBarEditMenu = document.createElement("ul"),
            toolBarEdit = document.createElement("li"),
            toolBarEditMenuSetBG = document.createElement("li");
        
        this.windowIcon.setAttribute("src", "img/imageviewer.png");
        
        img.setAttribute("src", image.URL);
        img.setAttribute("width", image.width);
        img.setAttribute("height", image.height);
        
        this.windowBody.appendChild(img);

        //Meddela KLOS.WM att instansen laddats färdigt
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);

        toolBarEdit.textContent = "Redigera";
        toolBarEditMenuSetBG.textContent = "Sätt som bakgrund";
        
        //Menyval för att sätta bild som skrivbordsbakgrund
        toolBarEditMenu.onclick = function () {
            KLOS.desktop.setAttribute("style", "background: url('" + image.URL + "') repeat");
        };
        
        toolBarEditMenu.appendChild(toolBarEditMenuSetBG);
        toolBarEdit.appendChild(toolBarEditMenu);

        this.windowToolBar.appendChild(toolBarEdit);
    };
}(window.KLOS = window.KLOS || {}));
