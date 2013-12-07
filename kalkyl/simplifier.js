define(function (require) {
    var q = require('quack');
    var Visitor = require('./visitor');
    var Expression = require('./expression');
    var exports = require('./exports');

    exports.Simplifier = q.createClass(Visitor, {

        simplify: function (expr) {
            return expr.accept(this);
        },

        visitNumber: function (expr) {
            return expr.clone();
        },

        visitVariable: function (expr) {
            return expr.clone();
        },

        visitPlus: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);
            
            if (left instanceof exports.Number && right instanceof exports.Number) {
                return new exports.Number(left.value() + right.value());
            }

            if (left instanceof exports.Number && !left.value()) {
                return right;
            }

            if (right instanceof exports.Number && !right.value()) {
                return left;
            }

            return new exports.Plus(left, right);
        },

        visitMinus: function(expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left.identicalTo(right)) {
                return new exports.Number(0);
            }
            
            if (left instanceof exports.Number && right instanceof exports.Number) {
                return expr.evaluated();
            }

            if (left instanceof exports.Number && !left.value()) {
                return right.negated();
            }

            if (right instanceof exports.Number && !right.value()) {
                return left;
            }

            return new exports.Minus(left, right);

        },

        visitUnaryPlus: function (expr) {
            return expr.arg().simplified();
        },

        visitUnaryMinus: function (expr) {
            var negated = expr.arg().simplified().negated();
            if (negated instanceof exports.UnaryMinus) {
                if (!negated.arg()) {
                    negated = negated.arg();
                }
            }
            return negated;
        },


        visitMultiplication: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left instanceof exports.Number && right instanceof exports.Number) {
                return (new exports.Multiplication(left, right)).evaluated();
            }

            if (left instanceof exports.Number) {
                if (!left.value()) {
                    return left;
                }
                if (left.value() === 1) {
                    return right;
                }
            }
            if (right instanceof exports.Number) {
                if (!right.value()) {
                    return right;
                }
                if (right.value() === 1) {
                    return left;
                }
            }


            return new exports.Multiplication(left, right);
        },

        visitDivision: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);

            if (left instanceof exports.Number && right instanceof exports.Number) {
                var evaluated = (new exports.Division(left, right)).evaluated();
                if (evaluated.value() === Math.round(evaluated.value())) {
                    return evaluated;
                }
            }

            if (left instanceof exports.Number) {
                if (!left.value()) {
                    return left;
                }
            } else if (right instanceof exports.Number) {
                if (right.value() === 1) {
                    return left;
                }
            }
            return new exports.Division(left, right);
        },

        visitPower: function (expr) {
            var left = expr.left().simplified(this);
            var right = expr.right().simplified(this);
            
            if (left instanceof exports.Number && right instanceof exports.Number) {
                return expr.evaluated().simplified(this);
            }

            if (left instanceof exports.Number) {
                if (!left.value()) {
                    return left;
                }
            }

            if (right instanceof exports.Number) {
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
                simplifier = new exports.Simplifier();
            }
            return simplifier.simplify(this);
        }

    });

    return exports.Simplifier;
});
