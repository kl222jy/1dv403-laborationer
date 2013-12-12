"use strict";
/*global window, document, console */

var validation = function () {
    var check, checkElements, checkEmail, checkPostalCode, checkTextbox, checkElement,
        regForm = document.querySelector("#regForm");
    
    //Kopplar kontrollfunktioner till olika fält
    regForm.onsubmit = function () {
        var postals = [],
            texts = [],
            emails = [],
            inputs,
            i;

        inputs = regForm.querySelectorAll("input");
        
//        console.log(inputs);
//        
//        inputs.forEach(function (element) {
//            console.log(element.attribute("type").value);
//        });
        
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
        
        if (texts.every(checkTextbox) && postals.every(checkPostalCode) && emails.every(checkEmail)) {
            return true;
        } else {
            return false;
        }
//        return checkElements();
    };
    
    regForm.onchange = function (e) {
        console.log(e.target.attributes.getNamedItem("type").nodeValue === "text");
        
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
                
//        checkElements();
    };
    
    checkElements = function () {

        
        
//        var checkedElements = [];
//                     
//        checkedElements.push(checkTextbox(regForm.elements.firstName));
//        checkedElements.push(checkTextbox(regForm.elements.lastName));
//        checkedElements.push(checkEmail(regForm.elements.email));
//        checkedElements.push(checkPostalCode(regForm.elements.postalCode));
//        
//        return checkedElements.every(checkElement);
    };
    
    
    checkElement = function (element, index, array) {
        return element;
    };
    
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
            
//            descTag = document.createTextNode(desc);
            
            element.parentNode.appendChild(descTag);
            
            element.parentNode.classList.remove("valid");
            element.parentNode.classList.add("invalid");
            return false;
        }
    };
    
    checkEmail = function (element) {
        return check(element, /^(?!\.)(\w|-|\.|#){1,64}(?!\.)@(?!\.)[\-.a-zåäö0-9]{4,253}$/, "Du har inte angivit en giltig e-post.");          // /^(?!\.)(\w|-|\.|#){1,64}(?!\.)@(?!\.)[-.a-zåäö0-9]{4,253}$/
    };
    checkPostalCode = function (element) {
        return check(element, /^\d{5}$/, "Ditt postnummer verkar inte korrekt, det ska bestå av 5 siffror(ex. 12345).");
    };
    checkTextbox = function (element) {
        return check(element, /\w{3,}/, "Du måste ange minst 3 tecken.");
    };
};

window.onload = function () {
    validation();
};