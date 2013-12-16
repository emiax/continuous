define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Visitor = require('./visitor');
    var Expression = require('./expression');

    exports.SimpleFormatter = q.createClass(Visitor, {
        /**
         * Get String.
         */
        format: function (expr) {
            return expr.accept(this);
        },


        /**
         * Visit constant.
         */
        visitNumber: function (constant) {
            return constant.value();
        },


        /**
         * Visit function.
         */
        visitFunction: function (fn) {
            var str = fn.symbol() + "(";
            var scope = this;
            fn.forEachArgument(function (a) {
                str += a.simpleFormat(scope) + ", ";
            });
            str = str.substr(0, str.length - 2);
            return str + ")";
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
        visitMultiplication: function (multiplication) {
            return "(" + multiplication.left().simpleFormat(this) + ") * (" +
                multiplication.right().simpleFormat(this) + ")";
        },


        /**
         * Visit power.
         */
        visitPower: function (power) {
            return "(" + power.left().simpleFormat(this) + ") ^ (" +
                power.right().simpleFormat(this) + ")";
        },



        /**
         * Visit division.
         */
        visitDivision: function (plus) {
            return "(" + plus.left().simpleFormat(this) + ") / (" +
                plus.right().simpleFormat(this) + ")";
        },


        /**
         * Visit cos.
         */
        visitCos: function (cos) {
            return "cos(" + cos.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit sin.
         */
        visitSin: function (sin) {
            return "sin(" + sin.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit tan.
         */
        visitTan: function (tan) {
            return "tan(" + tan.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit cos.
         */
        visitArccos: function (arccos) {
            return "arccos(" + arccos.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit sin.
         */
        visitArcsin: function (arcsin) {
            return "arcsin(" + arcsin.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit tan.
         */
        visitArctan: function (arctan) {
            return "arctan(" + arctan.arg().simpleFormat(this) + ")";
        },


        /**
         * Visit vector.
         */
        visitVector: function (vector) {            
            var str = '[';
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
            var leftBracket = '&#91;';
            var rightBracket = '&#93;';


            var str = "\n[";
            var dim = matrix.dim();
            var dumper = this;

            var currentRow = 0, currentColumn = 0;
            matrix.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();

                if (currentRow !== r) {
                    str += ";\n "
                }

                str += v.simpleFormat(dumper);
                if (c < dim.y().value() - 1 && r < dim.x().value()) {
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
                formatter = new exports.SimpleFormatter();
            }
            return formatter.format(this);
        }
    });
    
    return exports.SimpleFormatter;
});
    
