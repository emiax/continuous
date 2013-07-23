define(['quack', 'communication', 'communication/server/exports.js', 'Server'], function (q, Communication, ServerCommunication, Server) {
    return ServerCommunication.Router = q.createClass({
        
        constructor: function(sage) {
            this._sage = sage;
        }
        
        /**
         * Constructor.
         */
        request: function (request) {
            switch (request) {
            case Communication.EvaluateRequest:
                new Sage.Evaluator(sage);
                break;
                
            }
        }


    });
});
