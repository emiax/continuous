define(function (require) {
    var q = require('quack');
    var Visitor = require('./visitor');
    var Expression = require('./expression');
    var exports = require('./exports');
    
    exports.Differentiator = q.createClass(Visitor, {

        constructor: function (symbol) {
            this.symbol(symbol);
        },

        differentiate: function (expr) {
            return expr.accept(this);
        },

        symbol: function (symbol) {
            if (symbol !== undefined) this._symbol = symbol;
            return this._symbol;
        },

        visitNumber: function (expr) {
            return new exports.Number(0);
        },

        visitVariable: function (expr) {
            if (expr.symbol() === this.symbol()) {
                return new exports.Number(1);
            } else {
                return new exports.Number(0);
            }
        },

        visitPlus: function (expr) {
            return new exports.Plus(
                expr.left().differentiated(this),
                expr.right().differentiated(this)
            );
        },

        visitMinus: function(expr) {
            return new exports.Minus(
                expr.left().differentiated(this),
                expr.right().differentiated(this)
            );
        },


        visitUnaryMinus: function (expr) {
            return new exports.UnaryMinus(expr.arg().differentiated(this));
        },


        visitMultiplication: function (expr) {
            var left = expr.left(), right = expr.right();
            return new exports.Plus(
                new exports.Multiplication(
                    left.differentiated(this),
                    right.clone()
                ),
                new exports.Multiplication(
                    left.clone(),
                    right.differentiated(this)
                )
            );
        },

        visitDivision: function (expr) {
            var left = expr.left(), right = expr.right();
            return new exports.Division(
                new exports.Minus(
                    new exports.Multiplication(
                        left.differentiated(this),
                        right.clone()
                    ),
                    new exports.Multiplication(
                        left.clone(),
                        right.differentiated(this)
                    )
                ),
                new exports.Power(right.clone(), 2)
            );
        },

        visitPower: function (expr) {
            var left = expr.left(), right = expr.right();
            return new exports.Plus(
                new exports.Multiplication(
                    right.clone(),
                    new exports.Multiplication(
                        new exports.Power(
                            left.clone(),
                            new exports.Minus(right.clone(), 1)
                        ),
                        left.differentiated(this)
                    )
                ),
                new exports.Multiplication(
                    new exports.Power(
                        left.clone(),
                        right.clone()
                    ),
                    new exports.Multiplication(
                        new exports.Ln(left.clone()),
                        right.differentiated(this)
                    )
                )
            );
        },

        visitExp: function (expr) {
            return new exports.Multiplication(
                expr.arg().differentiated(this),
                expr.clone()
            );
        },

        visitLn: function (expr) {
            var arg = expr.arg();
            return new exports.Divition(
                arg.differentiated(this),
                arg.clone()
            );
        },

        visitSin: function (expr) {
            var arg = expr.arg();
            return new exports.Multiplication(
                arg.differentiated(this),
                new exports.Cos(arg.clone())
            );
        },

        visitCos: function (expr) {
            var arg = expr.arg();
            return new exports.Multiplication(
                arg.differentiated(this).negated(),
                new exports.Sin(arg.clone())
            );
        },


        visitMatrix: function (expr) {
            expr = expr.toMatrixNM();
            var m = exports.Matrix.createZeroMatrix(expr.dim());
            var differentiator = this;
            expr.forEachElement(function (v, k) {
                m.element(k, v.differentiated(differentiator));
            });
            return m.toSpecificDim();
        }
    });


    q.patch(Expression, {
        /**
         * 
         * Patch all expressions with differentiated-method.
         * Takes a symbol (string) or a differentiator (Differentiator instance)
         */
        differentiated: function (symbolOrDifferentiator) {
            var differentiator;
            if (symbolOrDifferentiator instanceof exports.Differentiator) {
                differentiator = symbolOrDifferentiator;
            } else {
                differentiator = new exports.Differentiator(symbolOrDifferentiator);
            }
            return differentiator.differentiate(this).simplified();
        }

    });

    return exports.Differentiator;
});
