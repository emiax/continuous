define(['quack', './exports.js'], function (q, C) {

    return C.SocketWrapper = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (url) {
            this._url = url;
            this._socket = null;
        },

        
        connect: function (callback) {
            var socket;
            try {
                socket = this._socket = new WebSocket(this._url);
            } catch(e) {
                console.error("could not connect to url");
                console.error(e);
            }
            
            socket.onopen = callback; //this.onOpen.bind(this);
            socket.onclose = this.onClose.bind(this);
            socket.onmessage = this.onMessage.bind(this);
            socket.onerror = this.onError.bind(this);
        },
        

        /**
         * On socket open.
         */
        onOpen: function (evt) {
            console.log("Socket open");
        },


        /**
         * On socket close.
         */
        onClose: function (evt) {
            console.log("Socket closed");
        },


        /**
         * On socket message
         */
        onMessage: function (evt) {
            console.log("Socket message");
            console.log(evt.data);
        },


        /**
         * On socket error.
         */
        onError: function (evt) {
            console.log("Socket error");
        },


        /**
         * Write to socket.
         */
        write: function(data) {
            this._socket.send(data);
        }
    });    
});
