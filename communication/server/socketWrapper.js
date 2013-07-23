define(['quack', 'communication/server/exports.js'], function (q, Server) {

    return Server.SocketWrapper = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (ws, host, id) {
            this._socket = ws;
            this._host = host;
            this._id = id;
            
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
            console.log("recieved message: " + data);
            if (this._host) {
                this._host.recieveRequest(data, this._id);
            }
        }, 


        /**
         * On socket close.
         */
        onClose: function (evt) {
            console.log("Socket closed");
        },


        /**
         * On socket error.
         */
        onError: function (evt) {
            console.log("Socket error");
        },


        /**
         * Write string to socket.
         */
        write: function (message) {
            this._socket.send(message);
        }
        
    });
});
