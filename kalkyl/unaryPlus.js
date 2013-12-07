define(function (require, exports) {
    var q = require('quack');
    var UnaryOperator = require('./unaryOperator');

    return q.createClass(UnaryOperator, {

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


        /**
          * Return dimension.
          */
        dim: function() {
            return this.arg().dim();
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitUnaryPlus(this);
        },
    });
});
