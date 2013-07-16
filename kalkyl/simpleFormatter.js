define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, KL, Visitor, Expression) {
    KL.SimpleFormatter = q.createClass(Visitor, {
        /**
         * Get String.
         */
        simpleFormat: function (expr) {
            return expr.accept(this);
        },


        /**
         * Visit constant.
         */
        visitConstant: function (constant) {
            return constant.value();
        },


        /**
         * Visit variable.
         */
        visitVariable: function (variable) {
            return variable.symbol();
        },


        /**
         * Visit unary operator.
         */
        visitUnaryOperator: function (operator) {
            return "unaryOperator, arg=" + operator.arg().simpleFormat(this);
        },


        /**
         * Visit binary operator.
         */
        visitBinaryOperator: function (operator) {
            return "binaryOperation: left=(" + operator.left().simpleFormat(this) +
                "), right=(" + operator.right().simpleFormat(this) + ")";
        },


        /**
         * Visit plus.
         */
        visitPlus: function (plus) {
            return "(" + plus.left().simpleFormat(this) + ") + (" +
                plus.right().simpleFormat(this) + ")";
        },


        /**
         * Visit minus.
         */
        visitUnaryMinus: function (minus) {
            return "-(" + minus.arg().simpleFormat() + ")";
        },


        /**
         * Visit minus.
         */
        visitMinus: function (plus) {
            return "(" + plus.left().simpleFormat(this) + ") - (" +
                plus.right().simpleFormat(this) + ")";
        },


        /**
         * Visit multiplication.
         */
        visitMultiplication: function (plus) {
            return "(" + plus.left().simpleFormat(this) + ") * (" +
                plus.right().simpleFormat(this) + ")";
        },


        /**
         * Visit division.
         */
        visitDivision: function (plus) {
            return "(" + plus.left().simpleFormat(this) + ") / (" +
                plus.right().simpleFormat(this) + ")";
        },


        /**
         * Visit vector.
         */
        visitVector: function (vector) {
            var str = "[";
            var dim = vector.dim();
            var dumper = this;
            vector.forEachArgument(function (v, k) {
                str += v.simpleFormat(dumper);
                if (k < dim.x().value() - 1) {
                    str += ", ";
                }
            });
            str += "]'";
            return str;
        },


        /**
         * Visit vector.
         */
        visitMatrix: function (matrix) {
            var str = "\n[";
            var dim = matrix.dim();
            var dumper = this;

            var currentRow = 0, currentColumn = 0;
            matrix.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();

                if (currentRow !== r) {
                    str += "\n "
                }

                str += v.simpleFormat(dumper);
                if (c < dim.y().value() - 1 || r < dim.x().value() - 1) {
                    str += ", ";
                }

                currentRow = r;
                currentColumn = c;
            });
            str += "]\n";
            return str;
        }
    });


    q.patch(Expression, {
        simpleFormat: function(formatter) {
            if (!formatter) {
                formatter = new KL.SimpleFormatter();
            }
            return formatter.simpleFormat(this);
        }
    });
    
    return KL.SimpleFormatter;
});
    
