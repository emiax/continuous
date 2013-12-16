define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var UnaryOperator = require('./unaryOperator');

    return exports.TrigonometricFunction = q.createAbstractClass(UnaryOperator, {
        /**
         * Evaluated.
         */
        javaScriptFunction: new q.AbstractMethod(),


        evaluated: function(map) {
            var dim = this.dim();

            var arg = this.arg().evaluated(map);

            if (arg.isEvaluated()) {
                if (arg instanceof exports.Matrix) {
                    var m = arg.toMatrixNM();
                    m.forEachArgument(function (v, k) {
                        m.element(k, Math.cos(v));
                    });
                    return m.toSpecificDim();
                } else {
                    var f = this.javaScriptFunction();
                    return new exports.Number(f(arg.value()));
                }
            } else {
                return this.clone();
            }
        },


        /**
         * Return this as a Matrix with only scalar operators.
         */
        expanded: function() {

        },


        dim: function() {
            return this.arg().dim();
        }
    });
});
