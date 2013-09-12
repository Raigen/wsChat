'use strict';

var WebSocketServer = require('websocket').server,
    http = require('http'),
    server = http.createServer(function (request, response) {

    }),
    wsServer;

server.listen(1337, function () {});

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log(message);
        }
    });

    connection.on('close', function (connection) {

    });
});

