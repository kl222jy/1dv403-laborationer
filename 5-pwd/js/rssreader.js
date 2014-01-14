/*global window, event, document, console, alert, object, confirm, getComputedStyle, XMLHttpRequest, setTimeout, escape, clearTimeout, prompt, clearInterval, setInterval*/
(function (KLOS) {
    "use strict";
    
    //Programinstans för visning av rss feeds
    KLOS.RssReader = function (menuButton) {
        KLOS.WM.call(this, "RSS Reader", menuButton);
        this.windowIcon.setAttribute("src", "img/rss.png");
        
        var xhr, rss, that, imageLoadTimer, activityImage, url, changeFeed, getFeed, baseUrl, instanceReady, setFeedUpdate, setUpdate, feedUpdate,
            img = document.createElement("img"),
            toolBarEditMenu = document.createElement("ul"),
            toolBarEdit = document.createElement("li"),
            toolBarEditMenuSetRSS = document.createElement("li"),
            toolBarEditMenuUpdate = document.createElement("li"),
            toolBarEditMenuUpdateFreq = document.createElement("li"),
            lastUpdate = document.createElement("p");

        toolBarEdit.textContent = "Inställningar";
        toolBarEditMenuSetRSS.textContent = "Välj källa..";
        toolBarEditMenuUpdate.textContent = "Uppdatera nu";
        toolBarEditMenuUpdateFreq.textContent = "Uppdateringsfrekvens..";

        toolBarEditMenuSetRSS.onclick = function () {
            changeFeed();
        };
        
        toolBarEditMenuUpdate.onclick = function () {
            getFeed(url);
        };

        toolBarEditMenuUpdateFreq.onclick = function () {
            setFeedUpdate();
        };
        
        toolBarEditMenu.appendChild(toolBarEditMenuSetRSS);
        toolBarEditMenu.appendChild(toolBarEditMenuUpdate);
        toolBarEditMenu.appendChild(toolBarEditMenuUpdateFreq);
        toolBarEdit.appendChild(toolBarEditMenu);

        this.windowToolBar.appendChild(toolBarEdit);
        
        url = "http://www.dn.se/m/rss/senaste-nytt";
        that = this;
        

        //Hämtning av feed via xhr
        getFeed = function () {
            var now = new Date();
            //Timeout, efter 300ms läggs aktivitetsvisare i statusfält
            imageLoadTimer = setTimeout(function () {
                activityImage = document.createElement("img");
                activityImage.setAttribute("src", "img/activity.gif");
                activityImage.setAttribute("class", "activityImage");
    
                that.windowStatusBar.appendChild(activityImage);
            }, 300);
            
            if (!KLOS.desktop.contains(that.windowBody)) {
                clearInterval(feedUpdate);
                return;
            }
            
            xhr = KLOS.XhrCon("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=" + escape(url), function (data) {
                that.windowBody.innerHTML = data;
                //Ta bort timeout för aktivitetsvisare, trist om den läggs på efter borttagning
                clearTimeout(imageLoadTimer);
                
                //Text för senaste uppdatering i statusfält
                lastUpdate.textContent = now.toLocaleTimeString();
                
                //Tar bort aktivitetsvisaren om den laddats i statusfältet
                if (that.windowStatusBar.contains(activityImage)) {
                    that.windowStatusBar.removeChild(activityImage);
                }
                
                //Tar bort visning av senaste uppdatering om den finns
                if (that.windowStatusBar.contains(lastUpdate)) {
                    that.windowStatusBar.removeChild(lastUpdate);
                }
                
                //Lägger till information för senaste uppdatering i statusfältet
                that.windowStatusBar.appendChild(lastUpdate);
                
            });
        };
        
        //Ställer uppdateringsfrekvens för hämtning av feed
        setUpdate = function (updateTimer) {
            //Ta bort föregående timer så att det inte blir flera interval
            clearInterval(feedUpdate);
            feedUpdate = setInterval(getFeed, updateTimer * 60000);
        };
        
        //Hämtar feed
        getFeed(url);
        
        //Sätter uppdateringsfrekvens till 1 minut
        setUpdate(1);
        
        //Hanterar val av feed som ska hämtas
        changeFeed = function () {
            var pTag = document.createElement("p"),
                radioLH = document.createElement("input"),
                feedChooser = document.createElement("form"),
                divLH = document.createElement("div"),
                descLH = document.createElement("p"),
                radioTNW = document.createElement("input"),
                divTNW = document.createElement("div"),
                descTNW = document.createElement("p"),
                innerModal = document.createElement("section"),
                radioCustom = document.createElement("input"),
                divCustom = document.createElement("div"),
                textboxCustom = document.createElement("input"),
                chooseFeed = document.createElement("button");

            pTag.textContent =  "Välj ett flöde i listan eller skriv in ett eget.";
            
            radioLH.setAttribute("type", "radio");
            radioLH.setAttribute("value", "http://feeds.gawker.com/lifehacker/full.xml");
            radioLH.setAttribute("name", "feed");
            descLH.textContent = "Lifehacker";
            divLH.appendChild(radioLH);
            divLH.appendChild(descLH);
            
            radioTNW.setAttribute("type", "radio");
            radioTNW.setAttribute("value", "http://thenextweb.com/feed/");
            radioTNW.setAttribute("name", "feed");
            descTNW.textContent = "The Next Web";
            divTNW.appendChild(radioTNW);
            divTNW.appendChild(descTNW);
            
            radioCustom.setAttribute("type", "radio");
            radioCustom.setAttribute("value", "custom");
            radioCustom.setAttribute("name", "feed");
            textboxCustom.setAttribute("type", "text");
            textboxCustom.setAttribute("placeholder", "Annat rss-flöde");
            divCustom.appendChild(radioCustom);
            divCustom.appendChild(textboxCustom);
            
            chooseFeed.textContent = "Välj flöde";
            
            chooseFeed.onclick = function (e) {
                e = e || event;
                e.preventDefault();
                var i;

                //Loopar igenom inputfält för att se vilket som är valt
                for (i = 0; i < feedChooser.feed.length; i += 1) {
                    if (feedChooser.feed[i].checked === true) {
                        //Om det valda fältet är custom fältet ska värdet från textrutan läsas in och användas
                        if (feedChooser.feed[i].value === "custom") {
                            url = textboxCustom.value;
                        //Annars hämtas värdet från den radiobox som är vald
                        } else {
                            url = feedChooser.feed[i].value;
                        }
                    }
                }
                
                //Hämta feed för vald url
                getFeed(url);
                
                //Ta bort popup
                KLOS.removeModal();
            };
            
            
            
            feedChooser.appendChild(divLH);
            feedChooser.appendChild(divTNW);
            feedChooser.appendChild(divCustom);
            feedChooser.appendChild(chooseFeed);

            innerModal.appendChild(pTag);
            innerModal.appendChild(feedChooser);
            
            //Visa popup
            KLOS.showModal(innerModal);
        };
        
        //Hanterar uppdateringsintervall
        setFeedUpdate = function () {
            var pTag = document.createElement("p"),
                selectUpdate = document.createElement("select"),
                option1min = document.createElement("option"),
                option2min = document.createElement("option"),
                option3min = document.createElement("option"),
                option4min = document.createElement("option"),
                option5min = document.createElement("option"),
                innerModal = document.createElement("section"),
                formUpdate = document.createElement("form"),
                chooseUpdateFreq = document.createElement("button");
                
            pTag.textContent = "Nedan kan du välja hur ofta rss-flödet ska uppdateras. Välj frekvens.";
            option1min.setAttribute("value", "1");
            option1min.textContent = "1 Minut";
            option2min.setAttribute("value", "2");
            option2min.textContent = "2 Minuter";
            option3min.setAttribute("value", "3");
            option3min.textContent = "3 Minuter";
            option4min.setAttribute("value", "4");
            option4min.textContent = "4 Minuter";
            option5min.setAttribute("value", "5");
            option5min.textContent = "5 Minuter";
            
            selectUpdate.appendChild(option1min);
            selectUpdate.appendChild(option2min);
            selectUpdate.appendChild(option3min);
            selectUpdate.appendChild(option4min);
            selectUpdate.appendChild(option5min);
            
            chooseUpdateFreq.textContent = "Välj";
            
            chooseUpdateFreq.onclick = function () {
                setUpdate(selectUpdate.options[selectUpdate.selectedIndex].value);
                KLOS.removeModal();
            };
            
            formUpdate.appendChild(selectUpdate);
            formUpdate.appendChild(chooseUpdateFreq);
            innerModal.appendChild(pTag);
            innerModal.appendChild(formUpdate);
            
            KLOS.showModal(innerModal);
        };

        //Meddela KLOS.WM att programinstansen har laddats färdigt
        instanceReady = new KLOS.CustomEvent("instanceReady");
        this.fullWindow.dispatchEvent(instanceReady);
    };
    
}(window.KLOS = window.KLOS || {}));