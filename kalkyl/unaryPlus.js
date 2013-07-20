define(['../lib/quack.js', './exports.js', './unaryOperator.js'], function(q, KL, UnaryOperator) {
    return KL.UnaryPlus = q.createClass(KL.UnaryOperator, {

        /**
         * Evaluated.
         */
        evaluated: function(map) {
            return this.arg().evaluated(map);
        },


        /**
         * Return this as a KL.Matrix with only scalar operators.
         */
        expanded: function() {
            return this.arg().expanded();
        },


        dim: function() {
            return this.arg().dim();
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitUnaryPlus(this);
        },
    });b
});
