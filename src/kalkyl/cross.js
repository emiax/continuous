define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var BinaryOperator = require('./binaryOperator');

    return exports.Cross = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function(left, right) {
            var dim = new exports.Vector2(3, 1);
            if (left.hasDim(dim) && right.hasDim(dim)) {
                this.left(left);
                this.right(right);
            }
        },


        /**
         * Return this as a exports.Vector3 with only scalar operators.
         */
        expanded: function(recursive) {
            var left = this.left();
            var right = this.right();
            if (left instanceof Vector3 && right instanceof Vector3) {
                return new exports.Vector3(
                    new exports.Minus(
                        new exports.Multiplication(left.y(), right.z()),
                        new exports.Multiplication(left.z(), right.y())
                    ),
                    new exports.Minus(
                        new exports.Multiplication(left.z(), right.x()),
                        new exports.Multiplication(left.x(), right.z())
                    ),
                    new exports.Minus(
                        new exports.Multiplication(left.x(), right.y()),
                        new exports.Multiplication(left.y(), right.x())
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
            return new exports.Vector2(3, 1);
        }

    });
});
