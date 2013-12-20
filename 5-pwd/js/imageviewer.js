/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout, clearTimeout*/
(function (KLOS) {
    "use strict";
    
    var makeThumb;
    
    KLOS.ImageViewer = function () {
        KLOS.WM.call(this, "ImageViewer");
        var xhr, images, imageListTag, max, i, imageLoadTimer, activityImage, that, instanceReady;
        
        this.windowIcon.setAttribute("src", "img/imageviewer.png");
        
        imageListTag = document.createElement("ul");
        imageListTag.setAttribute("class", "ImageViewerList");

        that = this;
        
        imageLoadTimer = setTimeout(function () {
            activityImage = document.createElement("img");
            activityImage.setAttribute("src", "img/activity.gif");
            activityImage.setAttribute("class", "activityImage");

            that.windowStatusBar.appendChild(activityImage);
        }, 300);
        
        xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", function (data) {
            images = JSON.parse(data);
            
            clearTimeout(imageLoadTimer);
            
            max = -Infinity;
            
            for (i = 0; i < images.length; i += 1) {
                if (images[i].thumbWidth > max) {
                    max = images[i].thumbWidth;
                }
            }
            
            
            images.forEach(function (element) {
                var a = document.createElement("a"),
                    img = document.createElement("img"),
                    li = document.createElement("li");
                li.setAttribute("style", "width: " + max + "px");
                a.setAttribute("href", "#");
        
                a.onclick = function () {
                    var imageViewInstance = KLOS.ImageView(element);
        //            console.log(image);
                };
                
                img.setAttribute("src", element.thumbURL);
                img.setAttribute("width", element.thumbWidth);
                
                a.appendChild(img);
                li.appendChild(a);
                imageListTag.appendChild(li);

            });

            if (that.windowStatusBar.contains(activityImage)) {
                that.windowStatusBar.removeChild(activityImage);
            }
            

        });
        
        this.windowBody.appendChild(imageListTag);
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };
    
    KLOS.ImageView = function (image) {
        KLOS.WM.call(this, "ImageView");
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

        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);

        toolBarEdit.textContent = "Redigera";
        toolBarEditMenuSetBG.textContent = "Sätt som bakgrund";

        toolBarEdit.onclick = function () {
            toolBarEditMenu.classList.toggle("show");
            return false;
        };
        
        toolBarEditMenu.onclick = function () {
            KLOS.desktop.setAttribute("style", "background: url('" + image.URL + "') repeat");
        };
        
        toolBarEditMenu.appendChild(toolBarEditMenuSetBG);
        toolBarEdit.appendChild(toolBarEditMenu);

        this.windowToolBar.appendChild(toolBarEdit);
        
    };
    
    
}(window.KLOS = window.KLOS || {}));