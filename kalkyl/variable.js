define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Leaf = require('./leaf');

    return exports.Variable = q.createClass(Leaf, {
        /**
         * Constructor
         */
        constructor: function (symbol) {
            this.symbol(symbol);
        },


        /**
         * Get or set symbol
         */
        symbol: function (symbol) {
            if (symbol !== undefined) this._symbol = symbol;
            return this._symbol;
        },


        /**
         * Return evlauated version, using map from symbols to numbers
         */
        evaluated: function (map) {
            //if (map === undefined) console.error("map is undefined");
            var value = map && map[this.symbol()];
            if (value !== undefined) {
                return new exports.Number(value);
            } else {
                return this.clone();
            }
        },


        /**
         * Return true if evaluated. Variables are not evaluated.
         */
        isEvaluated: function () {
            return false;
        },
        

        /**
         * Accept visitor.
         */
        accept: function (visitor) {
            return visitor.visitVariable(this);
        },


        /**
         * Identical to.
         */
        identicalTo: function (expr) {
            return (expr.getClass() === this.getClass()
                    && expr.symbol() === this.symbol());
        },


        /**
         * Clone.
         */
        clone: function () {
            return new exports.Variable(this.symbol());
        },
        
        
        /**
         * To primitive.
         */
        toPrimitive: function () {
            console.error("Cannot convert symbolic variable to primitive");
            return null;
        },

        
        /**
         * Box variable (for static use)
         */
        boxVariable: function (v) {
            if (typeof v === 'string') {
                return new exports.Variable(v);
            } else {
                return v;
            }
        }

    });
});
