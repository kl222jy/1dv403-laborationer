/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout, escape, clearTimeout, prompt*/
(function (KLOS) {
    "use strict";
    
    KLOS.RssReader = function () {
        KLOS.WM.call(this, "RSS Reader");
        this.windowIcon.setAttribute("src", "img/rss.png");
        
        var xhr, rss, that, imageLoadTimer, activityImage, url, changeFeed, getFeed, baseUrl,
            img = document.createElement("img"),
            toolBarEditMenu = document.createElement("ul"),
            toolBarEdit = document.createElement("li"),
            toolBarEditMenuSetRSS = document.createElement("li");

        toolBarEdit.textContent = "Redigera";
        toolBarEditMenuSetRSS.textContent = "Byt rss-flöde";

        toolBarEdit.onclick = function () {
            toolBarEditMenu.classList.toggle("show");
            return false;
        };
        
        toolBarEditMenuSetRSS.onclick = function () {
            changeFeed();
        };
        
        toolBarEditMenu.appendChild(toolBarEditMenuSetRSS);
        toolBarEdit.appendChild(toolBarEditMenu);

        this.windowToolBar.appendChild(toolBarEdit);
        
        url = "http://www.dn.se/m/rss/senaste-nytt";
        that = this;
        

        
        getFeed = function (url) {
            imageLoadTimer = setTimeout(function () {
                activityImage = document.createElement("img");
                activityImage.setAttribute("src", "img/activity.gif");
                activityImage.setAttribute("class", "activityImage");
    
                that.windowStatusBar.appendChild(activityImage);
            }, 300);
            
            
            xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=" + escape(url), function (data) {
                that.windowBody.innerHTML = data;
                clearTimeout(imageLoadTimer);
                
                if (that.windowStatusBar.contains(activityImage)) {
                    that.windowStatusBar.removeChild(activityImage);
                }
            });
        };
        
        getFeed(url);
        
        changeFeed = function () {
            url = prompt("välj feed");
            console.log(getFeed);
            getFeed(url);
        };

    };
    
}(window.KLOS = window.KLOS || {}));