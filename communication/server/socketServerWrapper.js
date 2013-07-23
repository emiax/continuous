define(['quack', 'communication/server/exports.js'], function (q, Server) {

    return Server.RequestHost = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (port, ) {
            var WebSocketServer = require('ws').Server;
            var wss = new WebSocketServer({port: port});
            
            console.log("socket server up and running");
            wss.on('connection', function(ws) {
                scope.onConnection(ws);
            });

            this._sockets = [];

        },


        /**
         * On connection.
         */
        onConnection: function (ws) {
           console.log("new connection");
            var socketWrapper = new Server.SocketWrapper(ws);
            this._sockets.push(socketWrapper);
        },


        /**
         * On disconnect.
         */
        // todo...
    });
});
.
