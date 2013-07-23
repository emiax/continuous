define(['quack', './exports.js', './binaryOperator.js'], function(q, KL, BinaryOperator) {
    return KL.Minus = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            left = KL.Constant.boxConstant(left);
            right = KL.Constant.boxConstant(right);
            this._dim = left.dim();

            if (this.dim().identicalTo(right.dim())) {
                this.left(left);
                this.right(right);
            } else {
                console.error("Dimensions must agree");
            }
        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            var dim = this.dim();

            var left = this.left().evaluated(map);
            var right = this.right().evaluated(map);

            if (left.isEvaluated() && right.isEvaluated()) {
                if (left instanceof KL.Matrix) {
                    var first = left.toMatrixNM();
                    var second = right.toMatrixNM();
                    first.forEachArgument(function (v, k) {
                        first.element(k, v.value() - second.element(k).value());
                    });
                    return first.toSpecificDim();
                } else {
                    return new KL.Constant(left.value() - right.value());
                }
            } else {
                return new KL.Minus(left, right);
            }
        },


        /**
         * Return this as a KL.Matrix with only scalar operators.
         */
        expanded: function() {
            // todo
        },


        dim: function() {
            return this._dim;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitMinus(this);
        },
    });
});
