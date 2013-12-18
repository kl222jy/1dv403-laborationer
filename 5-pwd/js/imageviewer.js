/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest*/
(function (KLOS) {
    "use strict";
    
    var makeThumb;
    
    KLOS.ImageViewer = function () {
        KLOS.WM.call(this, "ImageViewer");
        var xhr, images, imageListTag;
        
        imageListTag = document.createElement("ul");
        imageListTag.setAttribute("class", "ImageViewerList");

        xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", function (data) {
            images = JSON.parse(data);
            
            images.forEach(function (element) {
                var li = makeThumb(element);
                
                imageListTag.appendChild(li);
            });
        });
        
        this.windowBody.appendChild(imageListTag);
    };
    
    
    makeThumb = function (image) {
        var a = document.createElement("a"),
            img = document.createElement("img"),
            li = document.createElement("li");

        a.setAttribute("href", "#");

        a.onclick = function () {
            var imageViewInstance = KLOS.ImageView(image);
//            console.log(image);
        };
        
        img.setAttribute("src", image.thumbURL);
        img.setAttribute("width", image.thumbWidth);
        
        a.appendChild(img);
        li.appendChild(a);
        return li;
    };
    
    
    KLOS.ImageView = function (image) {
        KLOS.WM.Call(this, "ImageView");
        var img = document.createElement("img");
        
        img.setAttribute("src", image.URL);
        img.setAttribute("width", image.width);
        img.setAttribute("height", image.height);
        
        this.windowBody.appendChild(img);
    };
    
    
}(window.KLOS = window.KLOS || {}));