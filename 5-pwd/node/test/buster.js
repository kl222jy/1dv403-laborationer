/*jslint node: true */
var config = module.exports;

config["Browser tests"] = {
    rootPath : "../../",
    environment: "browser",         //"browser"/"node"
    sources: [
        "js/notepad.js",
        "js/minesweeper.js",
        "js/rssreader.js",
        "js/imageviewer.js",
        "js/messageboard.js",
        "js/messageboard.message.js",
        "js/socket.io.min.js",
        "js/memorywithnode.js",
        "js/memory.random.js",
        "js/klos.js"
    ],
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
