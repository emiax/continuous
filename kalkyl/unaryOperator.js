define(['../lib/quack.js', './exports.js', './expression.js', './innerNode.js'], function(q, KL, Expression, InnerNode) {
    return KL.UnaryOperator = q.createAbstractClass(Expression, [InnerNode], {

        /**
         * Constructor.
         */
        constructor: function (arg) {
            this._arg = arg;
        },


        /**
         * Get or set arg.
         */
        arg: function(arg) {
            if (arg !== undefined) this._arg = arg;
            return this._arg;
        },


        /**
         * Accept ExpressionVisitor.
         */
        accept: function (visitor) {
            return visitor.visitUnaryOperator(this);
        },


        /**
         * Clone.
         */
        clone: function () {
            return new (this.getClass())(this.arg().clone());
        },


        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            f(this.arg(), 0);
        },


        /**
         * Is evaluated.
         */
        isEvaluated: function () {
            return false;
        },


        /**
         * Identical to.
         */
        identicalTo: function (expr) {
            return (expr.getClass() === this.getClass()
                    && expr.arg().identicalTo(this.arg()))
        },


        /*
         * Accept.
         */
        accept: function (visitor) {
            return visitor.visitUnaryOperator(this);
        }, 


        /**
         * To primitive
         */
        toPrimitive: function () {
            console.error("Cannot convert unary operator to primitive");
            return null;
        }


    });
});
