define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Expression = require('./expression');
    var InnerNode = require('./innerNode');
    
    return exports.UnaryOperator = q.createAbstractClass(Expression, [InnerNode], {

        /**
         * Constructor.
         */
        constructor: function (arg) {
            arg = exports.Number.boxNumber(arg);
            this.arg(arg);
        },


        /**
         * Get or set arg.
         */
        arg: function(arg) {
            if (arg !== undefined) this._arg = arg;
            return this._arg;
        },


        /**
         * Get or set argument at position i
         */
        argument: function(i, v) {
            if (i === 0) {
                return arg(v);
            } else {
                console.error("accessing outside bounds");
            }
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
            return (expr && expr.getClass() === this.getClass()
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
