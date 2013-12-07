define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var UnaryOperator = require('./unaryOperator');
    var Expression = require('./expression');

    exports.UnaryMinus =  q.createClass(UnaryOperator, {
        /**
         * Evaluated.
         */
        evaluated: function(map) {
            var dim = this.dim();

            var arg = this.arg().evaluated(map);

            if (arg.isEvaluated()) {
                if (arg instanceof exports.Matrix) {
                    var m = arg.toMatrixNM();
                    m.forEachArgument(function (v, k) {
                            m.element(k, -v);
                    });
                    return m.toSpecificDim();
                } else {
                    return new exports.Number(-arg.value());
                }
            } else {
                return this.clone();
            }
        },


        /**
         * Return this as a exports.Matrix with only scalar operators.
         */
        expanded: function() {

        },


        dim: function() {
            return this.arg().dim();
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitUnaryMinus(this);
        },
    });

    q.patch(Expression, {

        negated: function() {
            return new exports.UnaryMinus(this.clone());
        }

    });
});
