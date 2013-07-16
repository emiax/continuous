define(['../lib/quack.js', './exports.js', './visitor.js', './expression.js'], function(q, KL, Visitor, Expression) {
    KL.Simplifier = q.createClass(Visitor, {

        simplify: function (expr) {
            return expr.accept(this);
        },

        visitConstant: function (expr) {
            return expr.clone();
        },

        visitVariable: function (expr) {
            return expr.clone();
        },

        visitPlus: function (expr) {
            var left = expr.left().simplified();
            var right = expr.right().simplified();

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated();
            }

            if (left instanceof KL.Constant && !left.value()) {
                return right;
            }

            if (right instanceof KL.Constant && !right.value()) {
                return left;
            }

            return expr.clone();
        },

        visitMinus: function(expr) {
            var left = expr.left().simplified();
            var right = expr.right().simplified();

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated();
            }

            if (left instanceof KL.Constant && !left.value()) {
                return right.negated();
            }

            if (right instanceof KL.Constant && !right.value()) {
                return left;
            }

            return expr.clone();

        },

        visitMultiplication: function (expr) {
            var left = expr.left().simplified();
            var right = expr.right().simplified();

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated();
            }

            if (left instanceof KL.Constant) {
                if (!left.value()) {
                    return left;
                }
                if (left.value() === 1) {
                    return right;
                }
            }
            if (right instanceof KL.Constant) {
                if (!right.value()) {
                    return right;
                }
                if (right.value() === 1) {
                    return left;
                }
            }
            return expr.clone();
        },

        visitDivision: function (expr) {
            var left = expr.left().simplified();
            var right = expr.right().simplified();

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                var evaluated = expr.evaluated();
                if (evaluated.value() === Math.round(evaluated.value())) {
                    return evaluated;
                }
            }

            if (left instanceof KL.Constant) {
                if (!left.value()) {
                    return left;
                }
            } else if (right instanceof KL.Constant) {
                if (right.value() === 1) {
                    return left;
                }
            }
            return expr.clone();
        },

        visitPower: function (expr) {
            var left = expr.left().simplified();
            var right = expr.right().simplified();

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated();
            }

            if (left instanceof KL.Constant) {
                if (!left.value()) {
                    return left;
                }
            }

            if (right instanceof KL.Constant) {
                if (right.value() === 0) {
                    return left;
                }
            }
            return expr.clone();
        },

        visitExp: function (expr) {
            return expr.clone();
        },

        visitLn: function (expr) {
            return expr.clone();
        },

        visitSin: function (expr) {
            return expr.clone();
        },

        visitCos: function (expr) {
            return expr.clone();
        },

        visitMatrix: function (expr) {
            return expr.clone();
        }
    });


    q.patch(Expression, {

        simplified: function(simplifier) {
            if (!simplifier) {
                simplifier = new KL.Simplifier();
            }
            return simplifier.simplify(this);
        }

    });

    return KL.Simplifier;
});
