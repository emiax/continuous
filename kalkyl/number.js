define(['quack', 'kalkyl/exports.js', 'kalkyl/leaf.js'], function(q, KL, Leaf) {
    return KL.Number = q.createClass(KL.Leaf, {
        /**
         * Constructor.
         */
        constructor: function (value) {
            if (value instanceof KL.Number) {
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
            return new KL.Number(this);
        },

        
        /**
         * Box number (for static use)
         */
        boxNumber: function (v) {
            if (typeof v === 'number') {
                return new KL.Number(v);
            } else {
                return v;
            }
        }
    });
});
