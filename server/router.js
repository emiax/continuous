define(['quack', 'communication', 'server/exports.js'], function (q, Communication, Server) {
    return Server.Router = q.createClass({
        /**
         * Constructor.
         */
        constructor: function(sage) {
            this._sage = sage;
        },

        
        sage: function () {
            return this._sage;
        },

        
        /**
         * Request.
         */
        request: function (request, callback) {
            var sage = this.sage();


            switch (request.getClass()) {
                /**
                 * Evaluate
                 */
            case Communication.EvaluateRequest:
                var evaluator = new Server.Evaluator(sage);
                evaluator.evaluate(request.expression(), function(expr) {
                    callback(new Communication.ExpressionResponse(expr));
                });                
                break;
                /**
                 * Integrate
                 */
            case Communication.IntegralRequest:
                var integrator = new Server.Integrator(sage);
                ingtegrator.integrate(request.expression(), request.symbol(), function(expr) {
                    callback(new Communication.ExpressionResponse(expr));
                });                
                break;
                
            default:
                console.log("No routing rule for that request.");
            }
        }


    });
});
