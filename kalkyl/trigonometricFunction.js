define(['quack', './exports.js', './unaryOperator.js'], function(q, KL, UnaryOperator) {
    return KL.TrigonometricFunction = q.createAbstractClass(KL.UnaryOperator, {
        /**
         * Evaluated.
         */
        javaScriptFunction: new q.AbstractMethod(),


        evaluated: function(map) {
            var dim = this.dim();

            var arg = this.arg().evaluated(map);

            if (arg.isEvaluated()) {
                if (arg instanceof KL.Matrix) {
                    var m = arg.toMatrixNM();
                    m.forEachArgument(function (v, k) {
                            m.element(k, Math.cos(v));
                    });
                    return m.toSpecificDim();
                } else {
                    var f = this.javaScriptFunction();
                    return new KL.Number(f(arg.value()));
                }
            } else {
                return this.clone();
            }
        },


        /**
         * Return this as a KL.Matrix with only scalar operators.
         */
        expanded: function() {

        },


        dim: function() {
            return this.arg().dim();
        }
    });
});
