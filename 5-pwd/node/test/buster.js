/*jslint node: true */
var config = module.exports;

config["Browser tests"] = {
    rootPath : "../../",
    environment: "browser",         //"browser"/"node"
//    sources: [
//        "js/*.js"
//    ],
    tests: [
        "test/*-test.js"
    ],
    "resources": [{
        "path": "/",
        "file": "index.html",
        "headers": {
            "Content-Type": "text/html"
        }
    }]
};
