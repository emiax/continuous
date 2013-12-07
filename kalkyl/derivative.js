define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var UnaryOperator = require('./unaryOperator');

    return exports.Derivative = q.createClass(UnaryOperator, {
        
        /**
         * Constructor.
         */
        constructor: function (arg, symbol) {
            this.arg(arg);
            this.symbol(symbol);
        },
        
        /**
         * Get or set symbol.
         */
        symbol: function (symbol) {
            if (symbol !== undefined) {
                this._symbol = symbol;
            }
            return this._symbol;
        },
        
       
        /**
         * Clone.
         */
        clone: function() {
            return new (this.getClass())(this.arg().clone(), this.symbol().clone());
        },
        
        
        /**
         * Identical to expr?
         */
        identicalTo: function(expr) {
            return (expr && expr.getClass() === this.getClass()
                    && expr.arg().identicalTo(this.arg())
                    && expr.symbol().identicalTo(this.symbol()));
        },

        
        /**
         * Evaluated.
         */
        evaluated: function() {
            return this.arg().differentiated(this.symbol()).evaluated();
        },
        
        
        dim: function () {
            return this.arg().dim();
        }


    });
});
