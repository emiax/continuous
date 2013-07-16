define(['../lib/quack.js', './exports.js', './binaryOperator.js'], function(q, KL, BinaryOperator) {
    return KL.Cross = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function(left, right) {
            var dim = new KL.Vector2(3, 1);
            if (left.hasDim(dim) && right.hasDim(dim)) {
                this.left(left);
                this.right(right);
            }
        },


        /**
         * Return this as a KL.Vector3 with only scalar operators.
         */
        expanded: function(recursive) {
            var left = this.left();
            var right = this.right();
            if (left instanceof Vector3 && right instanceof Vector3) {
                return new KL.Vector3(
                    new KL.Minus(
                        new KL.Multiplication(left.y(), right.z()),
                        new KL.Multiplication(left.z(), right.y())
                    ),
                    new KL.Minus(
                        new KL.Multiplication(left.z(), right.x()),
                        new KL.Multiplication(left.x(), right.z())
                    ),
                    new KL.Minus(
                        new KL.Multiplication(left.x(), right.y()),
                        new KL.Multiplication(left.y(), right.x())
                    )
                );
            }
        },


        /**
         * Evaluated.
         */
        evaluated: function(values) {
            var expanded = this.expanded();
            return expanded.evaluated();
        },


        /**
         * Dimension.
         */
        dim: function () {
            return new KL.Vector2(3, 1);
        }

    });
});
