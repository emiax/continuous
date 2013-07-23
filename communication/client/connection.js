define(['quack', 'communication/client/exports.js', 'communication'], function (q, Client, CS) {
    return Client.Connection = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (url) {
            this._url = url;
            this._requestFormatter = new Client.RequestFormatter();
            this._responseParser = new Client.ResponseParser();
            this._callbacks = {};

            var sw = this._socketWrapper = new Client.SocketWrapper(this._url, this);
            this._nextRequestId = 0;

        },
        

        /**
         * Send request via socketWrapper using requestId
         */
        request: function (request, callback) {
            var id = this.newRequestId();
            var requestFormatter = this.requestFormatter();
            var message = requestFormatter.format(request, id);
            this.registerCallback(id, callback);
            this.socketWrapper().write(message);
        },
        

        /***************************************************
         * Methods that should be thought of as private ones.
         ***************************************************/


        /**
         * Return the next request id.
         */
        newRequestId: function () {
            return this._nextRequestId++;
        },


        /**
         * Return the socket wrapper.
         */
        socketWrapper: function () {
            return this._socketWrapper;
        },
        

        /**
         * Return the request formatter.
         */
        requestFormatter: function () {
            return this._requestFormatter;
        },


        /**
         * Return the response parser.
         */
        responseParser: function () {
            return this._responseParser;
        },

        
        /**
         * Register callback.
         */
        registerCallback: function (id, callback) {
            this._callbacks[id] = callback;
        },


        /**
         * Invoke callback method and remove it from callback map
         */        
        executeCallback: function (id, response) {
            console.log(id);
            if (this._callbacks[id]) {
                this._callbacks[id](response);
                delete this._callbacks[id];
            }
        },
       
        
        /**
         * Recieve response
         */
        recieveResponse: function (responseString) {
            var parser = this.responseParser();
            var response = parser.parse(responseString);
            var id = parser.parsedId();

            console.log(id);

            this.executeCallback(id, response);
        }
    });    
});
