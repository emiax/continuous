define(['quack', 'communication/server/exports.js'], function (q, Server) {
    return Server.ResponseFormatter = q.createClass({
        /**
         * Constructor.
         */
        constructor: function () {
            
        },


        /**
         * Format response, and give it an id.
         */
        format: function (response, id) {
            console.log("format response with id " + id);
            return JSON.stringify({
                id: id,
                type: response.responseType(),
                payload: response.jsonEncode()
            });
        }
    });
});
