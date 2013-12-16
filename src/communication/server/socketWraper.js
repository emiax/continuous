define(['quack', 'communication/server/exports.js'], function (q, Server) {

    return Server.SocketWrapper = q.createClass({
                
        /**
         * Constructor.
         */
        constructor: function (ws) {
            var scope = this;
            this._ws = ws;
            ws.on('message', function(message) {
                scope.onMessage(message)
            });
            this._requestParser = new Server.RequestParser();
            
        }


        /**
         * Return requestParser
         */        
        requestParser: function () {
            return this._requestParser;
        }
        

        /**
         * On connection.
         */
        onMessage: function (message) {
            console.log("recieved message");
            var parser = this.requestParser();
            var request = parser.parse(message);
            // request is an instance of Communication.Request or null
            if (request) {
                //handle request
            }
        }, 


        write: function (message) {
            this._ws.send(message);
        }
        
    });
});
