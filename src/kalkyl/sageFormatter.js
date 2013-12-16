define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, KL, Visitor, Expression) {
    KL.SageFormatter = q.createClass(Visitor, {
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
         * Visit variable.
         */
        visitVariable: function (variable) {
            return variable.symbol();
        },


        /**
         * Visit unary operator.
         */
        visitUnaryOperator: function (operator) {
            console.error("unknown operator");
            return '';
        },


        /**
         * Visit binary operator.
         */
        visitBinaryOperator: function (operator) {
            console.error("unknown operator");
            return '';
        },


        /**
         * Visit plus.
         */
        visitPlus: function (plus) {
            return "(" + plus.left().sageFormat(this) + ") - (" +
                plus.right().sageFormat(this) + ")";
        },


        /**
         * Visit minus.
         */
        visitUnaryMinus: function (minus) {
            return "-(" + minus.arg().sageFormat() + ")";
        },


        /**
         * Visit minus.
         */
        visitMinus: function (plus) {
            return "(" + plus.left().sageFormat(this) + ") - (" +
                plus.right().sageFormat(this) + ")";
        },


        /**
         * Visit multiplication.
         */
        visitMultiplication: function (plus) {
            return "(" + plus.left().sageFormat(this) + ") * (" +
                plus.right().sageFormat(this) + ")";
        },


        /**
         * Visit division.
         */
        visitDivision: function (plus) {
            return "(" + plus.left().sageFormat(this) + ") / (" +
                plus.right().sageFormat(this) + ")";
        },


        /**
         * Visit vector.
         */
        visitVector: function (vector) {
            var str = "vector([";
            var dim = vector.dim();
            var dumper = this;
            vector.forEachArgument(function (v, k) {
                str += v.sageFormat(dumper);
                if (k < dim.x().value() - 1) {
                    str += ", ";
                }
            });
            str += "])";
            return str;
        },


        /**
         * Visit vector.
         */
        visitMatrix: function (matrix) {
            var str = "Matrix[[";
            var dim = matrix.dim();
            var dumper = this;

            var currentRow = 0, currentColumn = 0;
            matrix.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();

                if (currentRow !== r) {
                    str += "]"
                }

                str += v.sageFormat(dumper);
                if (currentRow !== r) {
                    str += "["
                }

                if (c < dim.y().value() - 1 || r < dim.x().value() - 1) {
                    str += ",";
                }



                currentRow = r;
                currentColumn = c;
            });
            str += "]]";
            return str;
        }



    });


    q.patch(Expression, {

        sageFormat: function(formatter) {
            if (!formatter) {
                formatter = new KL.SageFormatter();
            }
            return formatter.format(this);
        }
    });
    
    return KL.SageFormatter;
});
    
