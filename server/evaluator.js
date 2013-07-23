define(['quack', 'kalkyl', 'kalkyl/format/sage', 'server/exports.js'], function (q, Kalkyl, SageFormat, Server) {
    return Server.Evaluator = q.createClass({
        /**
         * Constructor.
         */
        constructor: function(sage) {
            this._sage = sage;
        },


        /**
         * Get sage
         */
        sage: function() {
            return this._sage;
        },

        
        /**
         * Evaulate kalkyl expression using sage, and invoke callback(evaluatedKalkylExpr) when done.
         */
        evaluate: function(expr, callback) {
            var sageFormatter = new SageFormat.Formatter();
            var sageParser = new SageFormat.Parser();

            var code = "";
            var variableSymbols = expr.listVariables();

            variableSymbols.forEach(function (s) {
                code += "var('" + s + "'); ";
            });

            // todo! Check if output is symbolic expression
            code += "output = (" + sageFormatter.format(expr) + ").simplify_full();";
            
            console.log("RUNNING CODE: ");
            console.log(code);

            this.sage().run(code, function (err, data) {
                var expr = sageParser.parse(data);
                console.log(data);
                callback(expr);
            });
        }
        

    });
});
