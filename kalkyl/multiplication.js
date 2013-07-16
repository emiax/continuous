define(['../lib/quack.js', './exports.js', './binaryOperator.js'], function(q, KL, BinaryOperator) {
    return KL.Multiplication = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            this.left(KL.Constant.boxConstant(left));
            this.right(KL.Constant.boxConstant(right));
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
                console.log("Kalkyl internal error");
            }
            var type = this.type();

            if (type === 'ss') {
                return new KL.Constant(left.value() * right.value());
            } else if (type === 'Ms') {
                return this.evaluateMatrixAndScalar(left, right);
            } else if (type === 'sM') {
                return this.evaluateMatrixAndScalar(right, left);
            } else { // type ==== 'MM'
                return this.evaluateTwoMatrices(left, right);
            }
        },


        evaluateMatrixAndScalar: function (matrix, scalar) {
            var output = matrix.toMatrixNM();
            output.forEachElement(function (v, k) {
                output.element(k, v.value() * scalar.value());
            });
            return output.toSpecificDim();
        },

        evaluateTwoMatrices: function (left, right) {
            var first = left.toMatrixNM();
            var second = right.toMatrixNM();
            var output = KL.Matrix.createZeroMatrix(this.dim());

            var innerN = first.dim().y().value();
            output.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();
                for (var i = 0; i < innerN; i++) {
                    var product = first.element(new KL.Vector2(r, i)).value() * second.element(new KL.Vector2(i, c)).value();
                    output.element(k, output.element(k).value() + product);
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
                return new KL.Vector2(1, 1);
            } else if (type === 'sM') {
                return this.right().dim();
            } else if (type === 'Ms') {
                return this.left().dim();
            } else {
                lDim = this.left().dim();
                rDim = this.right().dim();
                if (lDim.y().identicalTo(rDim.x())) {
                    return new KL.Vector2(lDim.x(), rDim.y());
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
