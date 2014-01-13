/*jslint node: true*/
/*global buster, window, HTMLCollection*/
"use strict";

var KLOS = window.KLOS,
    RandomGeneratorTestCase,
    MemoryTestCase,
    TestingTestCase,
    MineSweeperTestCase,
    WindowManagerTestCase,
    MessageBoardTestCase,
    NotepadTestCase,
    RssReaderTestCase,
    KLOSTestCase,
    XhrConTestCase,
    fakeImage = window.document.querySelector("nav img");

window.document.querySelector("nav").setAttribute("style", "display: none");
window.document.querySelector("main").setAttribute("style", "display: none");

KLOSTestCase = buster.testCase("KLOS", {
    "//desktop should be object": function () {
        buster.assert.equals(typeof KLOS.desktop, "object");
    },
    "desktopWidth should be number": function () {
        buster.assert(Number(KLOS.desktopWidth));
    },
    "desktopHeight should be number": function () {
        buster.assert(Number(KLOS.desktopHeight));
    },
    "counter should be number": function () {
        buster.assert(Number(KLOS.counter));
    },
    "top should be number": function () {
        buster.assert(Number(KLOS.top));
    },
    "left should be number": function () {
        buster.assert(Number(KLOS.left));
    },
    "right should be number": function () {
        buster.assert(Number(KLOS.right));
    },
    "menuItems should be object": function () {
        buster.assert.equals(typeof KLOS.menuItems, "object");
    },
    "//menuItems should contain links": function () {
        buster.assert(KLOS.menuItems);
    },
    "WM should be able to run": function () {
        var windowManager = new KLOS.WM("name", fakeImage);
        buster.assert(windowManager);
    },
    "//CustomEvent should be event": function () {
        buster.assert.equals(typeof KLOS.CustomEvent, "function");
    },
    "showModal should be able to run": function () {
        KLOS.showModal(window.document.createElement("div"));
        buster.assert(KLOS.showModal);
    },
    "removeModal should be able to run": function () {
        KLOS.showModal(window.document.createElement("div"));
        KLOS.removeModal();
        buster.assert(KLOS.removeModal);
    }
});

//http://docs.busterjs.org/en/latest/overview/#testing-ajax
XhrConTestCase = buster.testCase("KLOS.XhrCon", {
    setUp: function () {
        this.server = window.sinon.fakeServer.create();
    },
    "XhrCon should deliver data on callback": function () {
        var callback = this.spy();
        KLOS.XhrCon(this.server, callback, false);
        this.server.requests[0].respond(200, {"content-type": "application/json"}, JSON.stringify({id: 1, text: "test"}));

        buster.assert(callback.calledOnce);
        buster.assert.equals(JSON.parse(callback.getCall(0).args[0]), {id: 1, text: "test"});
    }
});

MemoryTestCase = buster.testCase("KLOS.Memory", {
    setUp: function () {
        this.memory = new KLOS.Memory("1", fakeImage);
    },
    "Memory should be able to load": function () {
        buster.assert(this.memory);
        
    },
    "//renderGame should return HTMLCollection": function () {
//        buster.assert.equals(this.memory.renderGame(), HTMLCollection);
    },
    "//test private functions": function () {
        buster.assert(false);
    }
});

RandomGeneratorTestCase = buster.testCase("KLOS.Memory.RandomGenerator", {
    "2, 2 should return array size 4": function () {
        var arr = KLOS.Memory.RandomGenerator.getPictureArray(2, 2);
        
        buster.assert.equals(arr.length, 4);
    },
    "2 Random arrays should not be the same": function () {
        var arr1 = KLOS.Memory.RandomGenerator.getPictureArray(4, 4),
            arr2 = KLOS.Memory.RandomGenerator.getPictureArray(4, 4);
        buster.refute.equals(arr1, arr2);
    }
});

MessageBoardTestCase = buster.testCase("KLOS.MessageBoard", {
    setUp: function () {
        this.MessageBoard = new KLOS.MessageBoard("1", fakeImage);
    },
    "MessageBoard should be able to load": function () {
        buster.assert(this.MessageBoard);
    }
});
MineSweeperTestCase = buster.testCase("KLOS.MineSweeper", {
    setUp: function () {
        this.MineSweeper = new KLOS.MineSweeper(fakeImage);
    },
    "MineSweeper should be able to load": function () {
        buster.assert(this.MineSweeper);
    }
});
NotepadTestCase = buster.testCase("KLOS.Notepad", {
    setUp: function () {
        this.Notepad = new KLOS.Notepad(fakeImage);
    },
    "Notepad should be able to load": function () {
        buster.assert(this.Notepad);
    }
});
RssReaderTestCase = buster.testCase("KLOS.RssReader", {
    setUp: function () {
        this.RssReader = new KLOS.RssReader(fakeImage);
    },
    "RssReader should be able to load": function () {
        buster.assert(this.RssReader);
    }
});

TestingTestCase = buster.testCase("TestCase Testing", {
    "KLOS should be fully loaded": function () {
        buster.assert(KLOS);
        buster.assert(KLOS.WM);
        buster.assert(KLOS.Memory);
        buster.assert(KLOS.ImageViewer);
        buster.assert(KLOS.MessageBoard);
        buster.assert(KLOS.MineSweeper);
        buster.assert(KLOS.RssReader);
        
    },
    "does buster work?": function () {
        buster.assert(true);
    }
});