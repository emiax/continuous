define(['quack', './exports.js'], function (q, S) {

    return S.SocketServerWrapper = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (port) {
            var WebSocketServer = require('ws').Server;
            var wss = new WebSocketServer({port: port});
            console.log("socket server up and running");
            wss.on('connection', function(ws) {
                console.log("new connection");
                ws.on('message', function(message) {
                    /*                    sage.stdin.write(message);
                    //        console.log('received: %s', message);
                    sage.on('data', function (data) {
                    console.log(data);
                    sage.on('data', function () {});
                    });*/
                    console.log("data recieved: " + message);
                    console.log(S);
                    var parser = new S.RequestParser();
                    var request = parser.parse(message);
                    console.log(request);
                });
            });
        }

    });
});
