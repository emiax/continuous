define(['quack', 'kalkyl/format/javascript/exports.js', 'kalkyl/visitor.js'], function(q, GLSL, Visitor) {
    return GLSL.Formatter = q.createClass(Visitor, {
        /**
         * Get String.
         */
        format: function (expr) {
            if (!expr) {
                console.error("expr is not set");
            }
            this._dependencies = {};
            var evaluation = this.visit(expr);

//            var code = "function __evaluate(map) {"
            code = "var map = arguments[0];"
            code += 'return ' + evaluation;
//            code += "};"

            return code;

            
/*            Object.keys(this._dependencies).forEach(function (s) {
                
            });*/
            
        },

        /**
         * Visit
         */
        visit: function (expr) {
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
            console.error("Cannot format functions as javascript");
        },


        /**
         * Visit variable.
         */
        visitVariable: function (variable) {
            this._dependencies[variable] = true;
            return 'map.' + variable.symbol();
        },


        /**
         * Visit unary operator.
         */
        visitUnaryOperator: function (operator) {
            console.error("Cannot format generic unary operator as javascript");
        },


        /**
         * Visit binary operator.
         */
        visitBinaryOperator: function (operator) {
            console.error("Cannot format generic binary operator as javascript");
        },


        /**
         * Visit plus.
         */
        visitPlus: function (plus) {
            return "(" + this.visit(plus.left()) + ") + (" +
                this.visit(plus.right()) + ")";
        },


        /**
         * Visit minus.
         */
        visitUnaryMinus: function (minus) {
            return "-(" + this.visit(minus.arg()) + ")";
        },


        /**
         * Visit minus.
         */
        visitMinus: function (minus) {
            return "(" + this.visit(minus.left()) + ") - (" +
                this.visit(minus.right()) + ")";
        },


        /**
         * Visit multiplication.
         */
        visitMultiplication: function (multiplication) {
            return "(" + this.visit(multiplication.left()) + ") * (" +
                this.visit(multiplication.right()) + ")";
        },


        /**
         * Visit power.
         */
        visitPower: function (pow) {
            return "Math.pow(" + this.visit(pow.left()) + ", " +
                this.visit(pow.right()) + ")";
        },



        /**
         * Visit division.
         */
        visitDivision: function (div) {
            return "(" + this.visit(div.left()) + ") / (" +
                this.visit(div.right()) + ")";
        },


        /**
         * Visit cos.
         */
        visitCos: function (cos) {
            return "Math.cos(" + this.visit(cos.arg()) + ")";
        },


        /**
         * Visit sin.
         */
        visitSin: function (sin) {
            return "Math.sin(" + this.visit(sin.arg()) + ")";
        },


        /**
         * Visit tan.
         */
        visitTan: function (tan) {
            return "Math.tan(" + this.visit(tan.arg()) + ")";
        },


        /**
         * Visit cos.
         */
        visitArccos: function (arccos) {
            return "Math.acos(" + this.visit(arccos.arg()) + ")";
        },


        /**
         * Visit sin.
         */
        visitArcsin: function (arcsin) {
            return "Math.asin(" + this.visit(arcsin.arg()) + ")";
        },


        /**
         * Visit tan.
         */
        visitArctan: function (arctan) {
            return "Math.atan(" + this.visit(arctan.arg()) + ")";
        },


        /**
         * Visit vector.
         */
        visitVector: function (vector) {            
            console.error("TODO! Cannot yet format vector as javascript.");
        },


        /**
         * Visit vector.
         */
        visitMatrix: function (matrix) {
            console.error("TODO! Cannot yet format matrix as javascript.");
        }
    });
});
    
