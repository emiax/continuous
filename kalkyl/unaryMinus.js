define(['quack', './exports.js', './unaryOperator.js'], function(q, KL, UnaryOperator) {
    KL.UnaryMinus = q.createClass(KL.UnaryOperator, {
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
                            m.element(k, -v);
                    });
                    return m.toSpecificDim();
                } else {
                    return new KL.Constant(-arg.value());
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
            return visitor.visitUnaryMinus(this);
        },
    });

    q.patch(KL.Expression, {

        negated: function() {
            return new KL.UnaryMinus(this.clone());
        }

    });

    return KL.UnaryMinus;

});
