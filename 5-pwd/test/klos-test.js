/*jslint node: true*/
/*global buster, window*/
"use strict";

var KLOS = window.KLOS,
    RandomGeneratorTestCase,
    MemoryTestCase,
    TestingTestCase;

RandomGeneratorTestCase = buster.testCase("KLOS.Memory.RandomGenerator", {
    "Randoms should not be the same": function () {
        var //mem = new KLOS.Memory("board1", "button.png"),
            arr1 = KLOS.Memory.RandomGenerator.getPictureArray(4, 4),
            arr2 = KLOS.Memory.RandomGenerator.getPictureArray(4, 4);
        buster.refute.equals(arr1, arr1);
    }
});

MemoryTestCase = buster.testCase("KLOS.Memory", {
    "memory should be object": function () {
        var memory = new KLOS.Memory("memory1", "img.png");
        buster.assert.equals(memory, {});
    }
});

TestingTestCase = buster.testCase("TestCase Testing", {
    "KLOS should be fully loaded": function () {
        buster.assert(KLOS);
        buster.assert(KLOS.WM);
        buster.assert(KLOS.Menu);
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