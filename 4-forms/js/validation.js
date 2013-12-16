"use strict";
/*global window, document, console */

var validation = function () {
    var confirm, check, checkEmail, checkPostalCode, checkTextbox, checkElement,
        regForm = document.querySelector("#regForm");
    
    regForm.elements[0].select();
    
    //Kopplar kontrollfunktioner till olika fält
    regForm.onsubmit = function () {
        var postals = [],
            texts = [],
            emails = [],
            inputs,
            i;

        inputs = regForm.querySelectorAll("input");

        //Avgör vilka kontroller som ska köras baserat på type
        for (i = 0; i < inputs.length; i += 1) {
            switch (inputs[i].attributes.getNamedItem("type").nodeValue) {
            case "text":
                texts.push(inputs[i]);
                break;
            case "postal":
                postals.push(inputs[i]);
                break;
            case "email":
                emails.push(inputs[i]);
                break;
            }
        }
        
        //Kör alla kontroller
        if (texts.every(checkTextbox) && postals.every(checkPostalCode) && emails.every(checkEmail)) {
            return confirm();
        } else {
            return false;
        }
    };
    
    //Visa dialogruta för bekräftelse
    confirm = function () {
        var bodyTag, popupTag, headerTag, h2Tag, sectionTag, footerTag, i, dlTag, ddTag, dtTag, inputs, labels, cancelButton, confirmButton, selects, deactivator;
        
        deactivator = document.createElement("section");
        deactivator.setAttribute("class", "deactivator");
                
        popupTag = document.createElement("article");
        popupTag.setAttribute("class", "popupConfirm");
        
        headerTag = document.createElement("header");
        h2Tag = document.createElement("h2");
        h2Tag.textContent = "Vänligen bekräfta ditt köp";
        sectionTag = document.createElement("section");
        footerTag = document.createElement("footer");
        cancelButton = document.createElement("button");
        cancelButton.textContent = "Avbryt";
        confirmButton = document.createElement("button");
        confirmButton.textContent = "Genomför";
        
        //Avbryt
        cancelButton.onclick = function () {
            var popup, deactivator;
            
            for (i = 0; i < inputs.length; i += 1) {
                inputs[i].removeAttribute("disabled");
            }
            
            for (i = 0; i < selects.length; i += 1) {
                selects[i].removeAttribute("disabled");
            }
            
            popup = document.querySelector("article.popupConfirm");
            deactivator = document.querySelector(".deactivator");
            document.querySelector("main").removeChild(popup);
            document.querySelector("main").removeChild(deactivator);
        };
        
        //Bekräfta
        confirmButton.onclick = function () {
            for (i = 0; i < inputs.length; i += 1) {
                inputs[i].removeAttribute("disabled");
            }
            
            for (i = 0; i < selects.length; i += 1) {
                selects[i].removeAttribute("disabled");
            }
            
            regForm.submit();
        };
        
        dlTag = document.createElement("dl");
        
        inputs = regForm.querySelectorAll("input");
        for (i = 0; i < inputs.length; i += 1) {

            inputs[i].setAttribute("disabled");

            if (inputs[i].getAttribute("type") !== "submit") {
                dtTag = document.createElement("dt");
                ddTag = document.createElement("dd");
                dtTag.textContent = inputs[i].parentNode.querySelector("label").textContent;
                ddTag.textContent = inputs[i].value;
                
                dlTag.appendChild(dtTag);
                dlTag.appendChild(ddTag);
            }
        }
        
        selects = regForm.querySelectorAll("select");          //ändra till all om fler än 1
        
        for (i = 0; i < selects.length; i += 1) {
            
            selects[i].setAttribute("disabled");
            
            dtTag = document.createElement("dt");
            ddTag = document.createElement("dd");
            
            dtTag.textContent = selects[i].parentNode.querySelector("label").textContent;
            ddTag.textContent = selects[i].options[selects[i].selectedIndex].textContent;
            
            dlTag.appendChild(dtTag);
            dlTag.appendChild(ddTag);
        }

        footerTag.appendChild(confirmButton);
        footerTag.appendChild(cancelButton);
        
        sectionTag.appendChild(dlTag);
        headerTag.appendChild(h2Tag);
        popupTag.appendChild(headerTag);
        popupTag.appendChild(sectionTag);
        popupTag.appendChild(footerTag);
        
        
        document.querySelector("main").appendChild(popupTag);
        document.querySelector("main").appendChild(deactivator);

        return false;
    };
    
    regForm.onchange = function (e) {
        
        //Kontroller baserat på type
        if (e.target.hasAttribute("type")) {
            switch (e.target.attributes.getNamedItem("type").nodeValue) {
            case "text":
                checkTextbox(e.target);
                break;
            case "postal":
                checkPostalCode(e.target);
                break;
            case "email":
                checkEmail(e.target);
                break;
            }
        }
    };
    
    checkElement = function (element, index, array) {
        return element;
    };
    
    //Generaliserad kontrollfunktion
    check = function (element, rgx, desc) {
        var descTag, divTag, pTag;

        divTag = element.parentNode;
        pTag = divTag.querySelector("p");
        if (pTag) {
            divTag.removeChild(pTag);
        }
        
        if (element.value.match(rgx)) {

            element.parentNode.classList.remove("invalid");
            element.parentNode.classList.add("valid");
            return true;
        } else {
            descTag = document.createElement("p");
            descTag.textContent = desc;

            element.parentNode.appendChild(descTag);
            
            element.parentNode.classList.remove("valid");
            element.parentNode.classList.add("invalid");
            return false;
        }
    };
    
    checkEmail = function (element) {
//        return check(element, /^(?!\.)(\w|-|\.|#){1,64}(?!\.)@(?!\.)[-.a-zåäö0-9]{4,253}$/, "Du har inte angivit en giltig e-post.");
        return check(element, /[\-0-9a-zA-Z.+_]+@[\-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/, "Du har inte angivit en giltig e-post.");
    };
    checkPostalCode = function (element) {
        
        //Om första 2 tecken är annat än siffror, ta bort
        if (element.value.match(/^\D{2}/)) {
            element.value = element.value.slice(2);
        }
        
        //Om första tecken är mellanslag, ta bort
        if (element.value.match(/^ /)) {
            element.value = element.value.slice(1);
        }
        
        //Om fjärde tecknet är - eller mellanslag, ta bort
        if (element.value.match(/\d{3}[ |\-]\d{2}/)) {
            element.value = element.value.slice(0, 3) + element.value.slice(4);
        }
        
        //Kontrollera att det är korrekt
        return check(element, /^\d{5}$/, "Ditt postnummer verkar inte korrekt, det ska bestå av 5 siffror(ex. 12345).");
    };
    checkTextbox = function (element) {
        return check(element, /\w{2,}/, "Du måste ange minst 2 tecken.");
    };
};

window.onload = function () {
    validation();
};