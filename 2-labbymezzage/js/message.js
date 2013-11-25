"use strict";
function Message(text, date) {
    var f_date = date, f_text = text;
    
    Object.defineProperty(this, "text", {
        get: function () { return f_text; },
        set: function (text) { f_text = text; }
    });
    Object.defineProperty(this, "date", {
        get: function () { return f_date; },
        set: function (date) { f_date = date; }
    });
}

Message.prototype.toString = function () {
    return this.text + " " + this.date;
};

Message.prototype.htmlText = function () {
    return this.text.replace("\n", "<br />");
};

Message.prototype.dateText = function () {
    return this.date.toDateString;
};