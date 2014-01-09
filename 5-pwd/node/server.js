/*jslint node: true*/
"use strict";
var io = require('socket.io').listen(12345),
    level = require("level"),
    sub = require("level-sublevel"),
    db = sub(level("./db")),
    memorytime = db.sublevel("memorytime"),
    memoryscore = db.sublevel("memoryscore");

io.set("log level", 1);

io.sockets.on('connection', function (socket) {
    socket.on("memoryload", function () {
        var bestTime = Infinity,
            bestScore = Infinity;
        memorytime.createReadStream()
            .on("data", function (data) {
                if (data.value < bestTime) {
                    bestTime = data.value;
                }
            })
            .on("error", function (err) {
                if (err) {
                    console.error("Error on data retrieval");
                }
            })
            .on("end", function () {
                socket.emit("memorytime", bestTime);
            });
        memoryscore.createReadStream()
            .on("data", function (data) {
                if (data.value < bestScore) {
                    bestScore = data.value;
                }
            })
            .on("error", function (err) {
                if (err) {
                    console.error("Error on data retrieval");
                }
            })
            .on("end", function () {
                socket.emit("memoryscore", bestScore);
            });
    });
    socket.on('highscoretime', function (name, time) {
        console.log("Name: " + name + " Time: " + time);
        memorytime.put(name, time, function (err) {
            if (err) {
                console.error("fel vid försök att spara värdet");
            } else {
                socket.emit("newrecordtime", time);
                socket.broadcast.emit("newrecordtime", time);
            }
        });
    });
    socket.on("highscoretries", function (name, score) {
        console.log("Name: " + name + " Score: " + score);
        memoryscore.put(name, score, function (err) {
            if (err) {
                console.error("fel vid försök att spara värdet");
            } else {
                socket.emit("newrecordscore", score);
                socket.broadcast.emit("newrecordscore", score);
            }
        });
    });
});
