define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var BinaryOperator = require('./binaryOperator');

    return exports.Plus = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            left = exports.Number.boxNumber(left);
            right = exports.Number.boxNumber(right);
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
                if (left instanceof exports.Matrix) {
                    var first = left.toMatrixNM();
                    var second = right.toMatrixNM();
                    first.forEachArgument(function (v, k) {
                        first.element(k, v.value() + second.element(k).value());
                    });
                    return first.toSpecificDim();
                } else {
                    return new exports.Number(left.value() + right.value());
                }
            } else {
                return new exports.Plus(left, right);
            }
        },


        /**
         * Return this as a Matrix with only scalar operators.
         */
        expanded: function() {
            // TODO
        },


        dim: function() {
            return this._dim;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitPlus(this);
        },
    });
});
