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
    fakeImage = window.document.querySelector("nav img");

window.document.querySelector("nav").setAttribute("style", "display: none");
window.document.querySelector("main").setAttribute("style", "display: none");

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
    },
    tearDown: function () {
//        this.memory = null;
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
    },
    tearDown: function () {
//        this.MessageBoard = null;
    }
});
MineSweeperTestCase = buster.testCase("KLOS.MineSweeper", {
    setUp: function () {
        this.MineSweeper = new KLOS.MineSweeper(fakeImage);
    },
    "MineSweeper should be able to load": function () {
        buster.assert(this.MineSweeper);
    },
    tearDown: function () {
//        this.MineSweeper = null;
    }
});
NotepadTestCase = buster.testCase("KLOS.Notepad", {
    setUp: function () {
        this.Notepad = new KLOS.Notepad(fakeImage);
    },
    "Notepad should be able to load": function () {
        buster.assert(this.Notepad);
    },
    tearDown: function () {
//        this.Notepad = null;
    }
});
RssReaderTestCase = buster.testCase("KLOS.RssReader", {
    setUp: function () {
        this.RssReader = new KLOS.RssReader(fakeImage);
    },
    "RssReader should be able to load": function () {
        buster.assert(this.RssReader);
    },
    tearDown: function () {
//        this.RssReader = null;
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