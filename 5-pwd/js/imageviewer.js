/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest*/
(function (KLOS) {
    "use strict";
    
    var makeThumb;
    
    KLOS.ImageViewer = function () {
        KLOS.WM.call(this, "ImageViewer");
        var xhr, images, imageListTag, max, i;
        
        imageListTag = document.createElement("ul");
        imageListTag.setAttribute("class", "ImageViewerList");

        xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", function (data) {
            images = JSON.parse(data);
            
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
        });
        
        this.windowBody.appendChild(imageListTag);
    };
    
    KLOS.ImageView = function (image) {
        KLOS.WM.call(this, "ImageView");
        var img = document.createElement("img");
        
        img.setAttribute("src", image.URL);
        img.setAttribute("width", image.width);
        img.setAttribute("height", image.height);
        
        this.windowBody.appendChild(img);
    };
    
    
}(window.KLOS = window.KLOS || {}));