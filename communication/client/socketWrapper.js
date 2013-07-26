define(['quack', 'communication/client/exports.js'], function (q, C) {

    return C.SocketWrapper = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (url, connection) {
            this._url = url;
            this._connected = false;
            this._socket = null;
            this._connecting = false;
            this.connect();
            this._connection = connection;
            this._queue = [];
        },

        
        /**
         * On socket open.
         */
        onOpen: function (evt) {
            console.log("Socket open");
            this._connected = true;
            this._connecting = false;
            var sentMessages = this.writeQueue();
            if (sentMessages) {
                console.log("socket catching up! sent " + sentMessages + " messages.");
            }
        },


        /**
         * On socket close.
         */
        onClose: function (evt) {
            console.log("Socket closed");
            this._connected = false;
        },


        /**
         * On socket message
         */
        onMessage: function (evt) {
            console.log("Socket message");
            console.log(evt.data);
            if (this._connection) {
                this._connection.receiveResponse(evt.data);
            }
        },


        /**
         * On socket error.
         */
        onError: function (evt) {
            console.log("Socket error");
            console.log(evt);
        },

        
        /**
         * Connect to server.
         */
        connect: function () {
            if (!this._connecting) {
                this._connecting = true;
                var socket = this._socket = new WebSocket(this._url);
                socket.onopen = this.onOpen.bind(this);
                socket.onclose = this.onClose.bind(this);
                socket.onmessage = this.onMessage.bind(this);
                socket.onerror = this.onError.bind(this);
            }
        },


        /**
         * Write to socket. Queue message and try to reconnect if disconnected
         */
        write: function (message) {
            this.enqueue(message);
            if (this.connected()) {
                this.writeQueue();
            } else {
                this.connect();
            }
        },

        
        connected: function() {
            return this._connected;
        },
        

        enqueue: function (message) {
            this._queue.push(message);
        },


        /**
         * Write queue to socket
         */
        writeQueue: function() {
            var sentMessages = 0;
            var scope = this;
            this._queue.forEach(function (m) {
                scope._socket.send(m);
                console.log("writing '" + m + "'");
                sentMessages++;
            });
            this._queue = [];
            return sentMessages;
        }
    });    
});
