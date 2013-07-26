define(['quack', 'kalkyl', 'kalkyl/format/sage', 'server/exports.js', 'errors'], function (q, Kalkyl, SageFormat, Server, Errors) {
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

            var tab = "\t";
            variableSymbols.forEach(function (s) {
                code += "var('" + s + "'); ";
            });

            code += "expr = " + sageFormatter.format(expr) + ';\n';
            code += "if (type(expr) == sage.symbolic.expression.Expression):\n";
            code += tab + "return expr.simplify_full();\n";
            code += "else:\n";
            code += tab + "return expr;";

            this.sage().run(code, function (err, data) {
                var expr = sageParser.parse(data);
                if (expr) {
                    callback(false, expr);
                } else {
                    callback(new Errors.SageError("Could not evaluate expression"));
                }
            });
        }
    });
});
