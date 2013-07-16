define(['../lib/quack.js', './exports.js', './expression.js', './innerNode.js'], function (q, KL, Expression, InnerNode) {
    return KL.BinaryOperator = q.createAbstractClass(Expression, [InnerNode], {

        /**
         * Constructor.
         */
        constructor: function (left, right) {
            this.left(left);
            this.right(right);
        },


        /**
         * Get or set left argument
         */
        left: function (left) {
            if (left !== undefined) this._left = left;
            return this._left;
        },


        /**
         * Get or set right argument
         */
        right: function (right) {
            if (right !== undefined) this._right = right;
            return this._right;
        },


        argument: function (index, value) {
            if (index === 0) {
                return this.left(value);
            } else if (index === 1) {
                return this.right(value);
            } else {
                console.error(index + " is out of bounds. this is a binary operator");
            }
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitBinaryOperator(this);
        },


        /**
         * Clone.
         */
        clone: function () {
            return new (this.getClass())(this.left().clone(), this.right().clone());
        },


        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            f(this.left(), 0);
            f(this.right(), 1);
        },


        /**
         * Identical to.
         */
        identicalTo: function (expr) {
            return (expr.getClass() === this.getClass()
                    && expr.left().identicalTo(this.left())
                    && expr.right().identicalTo(this.right()));
        },


        /**
         * Is evaluated.
         */
        isEvaluated: function () {
            return false;
        },


        /**
         * To primitive
         */
        toPrimitive: function () {
            console.error("Cannot convert binary operator to primitive");
            return null;
        }


    });

});
