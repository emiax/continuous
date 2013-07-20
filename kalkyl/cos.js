define(['../lib/quack.js', './exports.js', './unaryOperator.js'], function(q, KL, UnaryOperator) {
    return KL.Cos = q.createClass(KL.UnaryOperator, {
        /**
         * Evaluated.
         */
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
                    return new KL.Constant(Math.cos(arg.value()));
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
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitCos(this);
        },
    });
});
