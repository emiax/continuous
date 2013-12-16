define(['quack', 'communication/server/exports.js'], function (q, Server) {

    return Server.SocketWrapper = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (ws, host, id) {
            this._socket = ws;
            this._host = host;
            this._id = id;
            this._opened = true;

            ws.on('message', this.onMessage.bind(this));
            ws.on('close', this.onClose.bind(this));
            ws.on('error', this.onError.bind(this));
        },


        /**
         * Return requestParser
         */        
        requestParser: function () {
            return this._requestParser;
        },
        

        /**
         * On connection.
         */
        onMessage: function (data) {
            console.log("received message (socket wrapper): \n\t" + data);
            if (this._host) {
                this._host.receiveRequest(data, this._id);
            }
        }, 


        /**
         * On socket close.
         */
        onClose: function (evt) {
            console.log("Socket closed (socket wrapper)");
            this._opened = false;
        },


        /**
         * On socket error.
         */
        onError: function (evt) {
            console.log("Socket error (socket wrapper)");
        },


        /**
         * Write string to socket.
         */
        write: function (message) {
            if (this._opened) {
                this._socket.send(message);
            } else {
                console.log("Client closed connection. Cannot write. (socketWrapper.js)");
            }
        }
        
    });
});
