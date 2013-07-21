define(['quack', './exports.js', './expression.js', './innerNode.js'], function(q, KL, Expression, InnerNode) {
    return KL.Function = q.createClass(Expression, [InnerNode], {
        /**
         * Constructor
         */
        constructor: function (symbol, args, dim) {
            this.symbol(symbol);
            this._arguments = args;
            this._dim = dim || new KL.Vector2(1, 1);
        },


        /**
         * Get or set symbol
         */
        symbol: function (symbol) {
            if (symbol !== undefined) this._symbol = symbol;
            return this._symbol;
        },


        /**
         * Return evlauated version, using map from symbols to javascript functions
         */
        evaluated: function (map) {
            if (map === undefined) console.error("map is undefined");
            var fn = map[this.symbol()];
            if (typeof fn === 'function') {
                var evaluatedArguments = [];
                this.forEachArgument(function (a, k) {
                    evaluatedArguments[k] = a.evaluated(map);
                });
                
                return fn(evaluatedArguments);
            }
        },


        /**
         * Return true if evaluated. Functions are not evaluated.
         */
        isEvaluated: function () {
            return false;
        },
        

        /**
         * Accept visitor.
         */
        accept: function (visitor) {
            return visitor.visitFunction(this);
        },


        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            this._arguments.forEach(f);
        },

        
        /**
         * Get or set argument. Index is a number.
         */
        argument: function(index, value) {
            if (index >= 0) {
                if (value !== undefined) this._arguments[index] = value;
                return this._arguments[index];
            } else {
                consbole.error("accesing negative argument");
            }
        },


        /**
         * Identical to.
         */
        identicalTo: function (expr) {
            var identicalArguments = true;

            if (expr.getClass() !== this.getClass()) return false;
            if (expr.symbol() !== this.symbol()) return false;
            
            
            var identical = true;
            this.forEachArgument(function (a, k) {
                if (!a.identicalTo(expr.argument(k))) {
                    identical = false;
                }
            });
            return identical;
        },


        /**
         * Clone.
         */
        clone: function () {
            var args = [];
            this.forEachArgument(function (a, k) {
                args[k] = a.clone();
            });
            
            return new KL.Function(this.symbol(), args);
        },
        
        
        /**
         * To primitive.
         */
        toPrimitive: function () {
            console.error("Cannot convert symbolic function to primitive");
            return null;
        }, 


        dim: function () {
            return this._dim;
        }
    });
});
