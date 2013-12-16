define(['quack', 'communication/client/exports.js'], function (q, Client) {
    return Client.RequestFormatter = q.createClass({
        /**
         * Constructor.
         */
        constructor: function () {
            
        },

        
        /**
         * Format request, and give it an id.
         */
        format: function (request, id) {
            return JSON.stringify({
                id: id,
                type: request.requestType(),
                payload: request.jsonEncode()
            });
        }
    });
});
