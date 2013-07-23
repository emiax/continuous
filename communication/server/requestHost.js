define(['quack', 'communication', 'communication/server/exports.js', 'kalkyl'], function (q, Communication, Server, Kalkyl) {

    return Server.RequestHost = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (port) {
            var WebSocketServer = require('ws').Server;
            var wss = new WebSocketServer({port: port});
            var scope = this;

            console.log("socket server up and running");
            wss.on('connection', function(ws) {
                scope.onConnection(ws);
            });

            this._sockets = {};
            this._nextSocketId = 0;
            this._requests = [];
            this._requestParser = new Server.RequestParser();
            this._responseFormatter = new Server.ResponseFormatter();
        },
        

        /**
         * Get or set request with socketId and requestId
         */
        request: function (socketId, requestId, request) {
            if (!this._requests[socketId]) {
                this._requests[socketId] = {};
            }
            if (request) {
                this._requests[socketId][requestId] = request; 
            }
            return this._requests[socketId][requestId];
        },
        

        /**
         * On connection.
         */
        onConnection: function (ws) {
            console.log("new connection");
            var socketId = this.nextSocketId();
            var socketWrapper = new Server.SocketWrapper(ws, this, socketId);
            this._sockets[socketId] = socketWrapper;
        },


        /**
         * On connection.
         */
        recieveRequest: function(requestString, socketId) {
            console.log("input from " + socketId);
            var parser = this.requestParser();
            var request = parser.parse(requestString);
            var requestId = parser.parsedId();
            
            var scope = this;

            this.router().request(request, function(response) {
                scope.respond(response), socketId, requestId;
            });
            


            if (request instanceof Communication.EvaluateRequest) {
                var input = request.expression();
                var 
                
                this.respond(new Communication.ExpressionResponse(expr), socketId, requestId);
            }


            this.request(socketId, requestId, request);
        },

        
        socket: function (socketId) {
            return this._sockets[socketId];
        },


        respond: function (response, socketId, requestId) {
            var formatter = this.responseFormatter();
            var message = formatter.format(response, requestId);
            var socket = this.socket(socketId);
            if (socket) {
                socket.write(message);
            }
        },

        /**
         * On disconnect.
         */
        // todo...


        requestParser: function () {
            return this._requestParser;
        },



        responseFormatter: function () {
            return this._responseFormatter;
        },


        /**
         * Return the next request id.
         */
        nextSocketId: function () {
            return this._nextSocketId++;
        }


    });
});
