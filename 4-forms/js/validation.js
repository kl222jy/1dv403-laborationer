"use strict";
/*global window, document */

var validation = function () {
    var checkTextbox, checkElement,
        regForm = document.querySelector("#regForm");
    
    //Kopplar kontrollfunktioner till olika fält
    regForm.onsubmit = function () {
        var checkElements = [];
                     
        checkElements.push(checkTextbox(regForm.elements.firstName));
        checkElements.push(checkTextbox(regForm.elements.lastName));
        
        return checkElements.every(checkElement);
    };
    
    checkElement = function (element, index, array) {
        return element;
    };
    
    checkTextbox = function (element) {
        if (element.value.match(/\w{3,}/)) {
            return true;
        } else {
            return false;
        }
    };
};

window.onload = function () {
    validation();
};