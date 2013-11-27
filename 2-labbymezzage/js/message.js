"use strict";
var MessageSystem = MessageSystem || {};
MessageSystem.Message = function (text, date) {
    var f_date, f_text;

    Object.defineProperty(this, "text", {
        get: function () { return f_text; },
        set: function (text) {
            if (text) {
                f_text = text;
            }
        }
    });
    Object.defineProperty(this, "date", {
        get: function () { return f_date; },
        set: function (date) { f_date = date; }
    });
    this.text = text;
    this.date = date;
};

MessageSystem.Message.prototype.toString = function () {
    return this.text + " " + this.date;
};

MessageSystem.Message.prototype.htmlText = function () {
    return this.text.replace(/\n/g, "<br />");
};

MessageSystem.Message.prototype.dateText = function () {
    return "Inlägget skapades " + this.date.toLocaleDateString() + " " + this.date.toLocaleTimeString();       //this.date.toDateString() + " " + this.date.toTimeString();
};