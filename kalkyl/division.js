define(['quack', './exports.js', './binaryOperator.js'], function(q, KL, BinaryOperator) {
    return KL.Division = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            this.left(KL.Number.boxNumber(left));
            this.right(KL.Number.boxNumber(right));
            if (!this.dim()) {
                console.error("Can only divide by scalars");
            }
        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            if (!this.dim()) console.error("Can only divide by scalars");
            var left = this.left().evaluated(map);
            var right = this.right().evaluated(map);

            if (!left.isEvaluated() || !right.isEvaluated()) {
                return this.clone();
            }
            var type = this.type();

            if (type === 'ss') {
                return new KL.Number(left.value() / right.value());
            } else if (type === 'Ms') {
                return this.evaluateMatrixAndScalar(left, right, map);
            } else {
                console.error("Can only divide by scalars");
            }
        },


        evaluateMatrixAndScalar: function (matrix, scalar, map) {
            var output = matrix.toMatrixNM();
            output.forEachElement(function (v, k) {
                var div = new KL.Division(v, scalar);
                output.element(k, div.evaluated(map));
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
            } else if (type === 'Ms') {
                return this.left().dim();
            } else {
                return false;
            }
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitDivision(this);
        },
    });
});
