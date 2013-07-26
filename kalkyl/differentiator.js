define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, KL, Visitor, Expression) {
    KL.Differentiator = q.createClass(Visitor, {

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
            return new KL.Number(0);
        },

        visitVariable: function (expr) {
            if (expr.symbol() === this.symbol()) {
                return new KL.Number(1);
            } else {
                return new KL.Number(0);
            }
        },

        visitPlus: function (expr) {
            return new KL.Plus(
                expr.left().differentiated(this),
                expr.right().differentiated(this)
            );
        },

        visitMinus: function(expr) {
            return new KL.Minus(
                expr.left().differentiated(this),
                expr.right().differentiated(this)
            );
        },

        visitMultiplication: function (expr) {
            var left = expr.left(), right = expr.right();
            return new KL.Plus(
                new KL.Multiplication(
                    left.differentiated(this),
                    right.clone()
                ),
                new KL.Multiplication(
                    left.clone(),
                    right.differentiate(this)
                )
            );
        },

        visitDivision: function (expr) {
            var left = expr.left(), right = expr.right();
            return new KL.Division(
                new KL.Minus(
                    new KL.Multiplication(
                        left.differentiated(this),
                        right.clone()
                    ),
                    new KL.Multiplication(
                        left.clone(),
                        right.differentiated(this)
                    )
                ),
                new KL.Power(right.clone(), 2)
            );
        },

        visitPower: function (expr) {
            var left = expr.left(), right = expr.right();
            return new KL.Plus(
                new KL.Multiplication(
                    right.clone(),
                    new KL.Multiplication(
                        new KL.Power(
                            left.clone(),
                            new KL.Minus(right.clone(), 1)
                        ),
                        left.differentiated(this)
                    )
                ),
                new KL.Multiplication(
                    new KL.Power(
                        left.clone(),
                        right.clone()
                    ),
                    new Multiplication(
                        new KL.Ln(left.clone()),
                        right.differentiated(this)
                    )
                )
            );
        },

        visitExp: function (expr) {
            return new KL.Multiplication(
                expr.arg().differentiated(this),
                expr.clone()
            );
        },

        visitLn: function (expr) {
            var arg = expr.arg();
            return new KL.Divition(
                arg.differentiated(this),
                arg.clone()
            );
        },

        visitSin: function (expr) {
            var arg = expr.arg();
            return new KL.Multiplication(
                arg.differentiated(this),
                new KL.Cos(arg.clone())
            );
        },

        visitCos: function (expr) {
            var arg = expr.arg();
            return new KL.Multiplication(
                arg.differentiated(this).negated(),
                new KL.Sin(arg.clone())
            );
        },


        visitMatrix: function (expr) {
            expr = expr.toMatrixNM();
            var m = KL.Matrix.createZeroMatrix(expr.dim());
            var differentiator = this;
            expr.forEachElement(function (v, k) {
                m.element(k, v.differentiated(differentiator));
            });
            return m.toSpecificDim();
        }
    });


    q.patch(Expression, {

        differentiated: function (symbolOrDifferentiator) {
            var differentiator;
            if (symbolOrDifferentiator instanceof KL.Differentiator) {
                differentiator = symbolOrDifferentiator;
            } else {
                differentiator = new KL.Differentiator(symbolOrDifferentiator);
            }
            return differentiator.differentiate(this).simplified();
        }

    });

    return KL.Differentiator;
});
