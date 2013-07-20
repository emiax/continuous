define(['../lib/quack.js', './exports.js', './leaf.js'], function(q, KL, Leaf) {
    return KL.Constant = q.createClass(KL.Leaf, {


        /**
         * Constructor.
         */
        constructor: function (value) {
            if (value instanceof KL.Constant) {
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
            return visitor.visitConstant(this);
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
            return new KL.Constant(this);
        },

        
        /**
         * Box constant (for static use)
         */
        boxConstant: function (v) {
            if (typeof v === 'number') {
                return new KL.Constant(v);
            } else {
                return v;
            }
        }
    });
});
