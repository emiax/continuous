define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Leaf = require('./leaf');

    return exports.Number = q.createClass(Leaf, {
        /**
         * Constructor.
         */
        constructor: function (value) {
            if (value instanceof exports.Number) {
                value = value.value();
            }
            this.value(value);
        },

        
        /**
         * Value.
         */
        value: function (value) {
            if (value !== undefined) {
                this._value = +value;
//                console.log(value + " => " + (+value));
            }
            return this._value;
        },


        /**
         * To primitive.
         */
        toPrimitive: function () {
            return this.value();
        },


        /**
         * Evaluated.
         */
        evaluated: function () {
            return this.clone();
        },


        /**
         * Is evaluated
         */
        isEvaluated: function () {
            return true;
        },

        /**
         * Accept visitor.
         */
        accept: function (visitor) {
            return visitor.visitNumber(this);
        },

        /**
         * Identical to expr
         */
        identicalTo: function (expr) {
            return expr.getClass() === this.getClass()
                && expr.value() === this.value();
        },

        /**
         * Clone
         */
        clone: function () {
            return new exports.Number(this);
        },

        
        /**
         * Box number (for static use)
         */
        boxNumber: function (v) {
            if (typeof v === 'number') {
                return new exports.Number(v);
            } else {
                return v;
            }
        }
    });

    return Number;
});
