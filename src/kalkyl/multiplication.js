define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var BinaryOperator = require('./binaryOperator');

    return exports.Multiplication = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            this.left(exports.Number.boxNumber(left));
            this.right(exports.Number.boxNumber(right));
            if (!this.dim()) {
                console.error("Inner matrix dimensions must agree");
            }

        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            if (!this.dim()) console.error("Inner matrix dimensions must agree");
            var left = this.left().evaluated(map);
            var right = this.right().evaluated(map);
        
            if (!left.isEvaluated() || !right.isEvaluated()) {
                return new exports.Multiplication(left, right);
            }
            var type = this.type();

            if (type === 'ss') {
                return new exports.Number(left.value() * right.value());
            } else if (type === 'Ms') {
                return this.evaluateMatrixAndScalar(left, right, map);
            } else if (type === 'sM') {
                return this.evaluateMatrixAndScalar(right, left, map);
            } else { // type ==== 'MM'
                return this.evaluateTwoMatrices(left, right, map);
            }
        },


        evaluateMatrixAndScalar: function (matrix, scalar, map) {
            var output = matrix.toMatrixNM();
            output.forEachElement(function (v, k) {
                var mult = new exports.Multiplication(v, scalar);
                output.element(k, mult.evaluated(map));
            });
            var s = output.toSpecificDim();
            return s;
        },


        evaluateTwoMatrices: function (left, right, map) {
            var first = left.toMatrixNM();
            var second = right.toMatrixNM();
            var output = exports.Matrix.createZeroMatrix(this.dim());

            var innerN = first.dim().y().value();
            output.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();
                for (var i = 0; i < innerN; i++) {
                    
                    var mult = new exports.Multiplication(first.element(new exports.Vector2(r, i)),
                                                 second.element(new exports.Vector2(i, c)));
                    var sum = new exports.Plus(output.element(k), mult);
                    output.element(k, sum.evaluated(map));
                }
            });
            return output.toSpecificDim();
        },

        /**
         * Return this as a Matrix with only scalar operators.
         */
        expanded: function() {

        },


        type: function () {
            var t = "";
            if (this.left().isScalar()) {
                t += 's';
            } else {
                t += 'M'
            }
            if (this.right().isScalar()) {
                t += 's';
            } else {
                t += 'M'
            }
            return t;
        },


        dim: function() {
            var lDim, rDim;
            var type = this.type();

            if (type === 'ss') {
                return new exports.Vector2(1, 1);
            } else if (type === 'sM') {
                return this.right().dim();
            } else if (type === 'Ms') {
                return this.left().dim();
            } else {
                lDim = this.left().dim();
                rDim = this.right().dim();
                if (lDim.y().identicalTo(rDim.x())) {
                    return new exports.Vector2(lDim.x(), rDim.y());
                } else {
                    return false;
                }
            }
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitMultiplication(this);
        },
    });
});
