define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, KL, Visitor, Expression) {
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
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);
            
            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return new KL.Constant(left.value() + right.value());
            }

            if (left instanceof KL.Constant && !left.value()) {
                return right;
            }

            if (right instanceof KL.Constant && !right.value()) {
                return left;
            }

            return new KL.Plus(left, right);
        },

        visitMinus: function(expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left.identicalTo(right)) {
                return new KL.Constant(0);
            }
            
            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated();
            }

            if (left instanceof KL.Constant && !left.value()) {
                return right.negated();
            }

            if (right instanceof KL.Constant && !right.value()) {
                return left;
            }

            return new KL.Minus(left, right);

        },

        visitMultiplication: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return (new KL.Multiplication(left, right)).evaluated();
            }

            if (left instanceof KL.Constant) {
                if (!left.value()) {
                    return left;
                } else {
                    console.log(left.value());
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


            return new KL.Multiplication(left, right);
        },

        visitDivision: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                var evaluated = (new KL.Division(left, right)).evaluated();
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
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left instanceof KL.Constant && right instanceof KL.Constant) {
                return expr.evaluated().simplified(this);
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

        visitTrigonometricFunction: function (expr) {
            return expr.clone();
        },

        visitMatrix: function (expr) {
            var matrix = expr.clone();
            var scope = this;
            matrix.forEachElement(function (v, k) {
                var simplified = v.simplified(scope);
                matrix.element(k, simplified);
            });
            
            return matrix;
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
