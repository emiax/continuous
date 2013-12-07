define(function (require) {

    var exports = require('./exports');
    var q = require('quack');
    var Visitor = require('kalkyl/visitor');

    return exports.Formatter = q.createClass(Visitor, {
        /**
         * Get String.
         */
        format: function (expr) {
            if (!expr) {
                console.error("expr is not set");
            }
            return expr.accept(this);
        },

        
        /**
         * Set translation table. Variables need other names in glsl!
         */
        translationTable: function (map) {
            this._translationTable = map;
        },
        

        /**
         * Visit constant.
         */
        visitNumber: function (constant) {
            var str = constant.value() + "";
            if (str.indexOf('.') === -1) {
                str += '.0';
            } 
            return str;
        },


        /**
         * Visit function.
         */
        visitFunction: function (fn) {
            console.error("Cannot format functions as glsl");
        },


        /**
         * Visit variable.
         */
        visitVariable: function (variable) {
            return this._translationTable[variable.symbol()];
        },


        /**
         * Visit unary operator.
         */
        visitUnaryOperator: function (operator) {
            console.error("Cannot format generic unary operator as glsl");
        },


        /**
         * Visit binary operator.
         */
        visitBinaryOperator: function (operator) {
            console.error("Cannot format generic binary operator as glsl");
        },


        /**
         * Visit plus.
         */
        visitPlus: function (plus) {
            return "(" + this.format(plus.left()) + ") + (" +
                this.format(plus.right()) + ")";
        },


        /**
         * Visit minus.
         */
        visitUnaryMinus: function (minus) {
            return "-(" + this.format(minus.arg()) + ")";
        },


        /**
         * Visit minus.
         */
        visitMinus: function (minus) {
            return "(" + this.format(minus.left()) + ") - (" +
                this.format(minus.right()) + ")";
        },


        /**
         * Visit multiplication.
         */
        visitMultiplication: function (multiplication) {
            return "(" + this.format(multiplication.left()) + ") * (" +
                this.format(multiplication.right()) + ")";
        },


        /**
         * Visit power.
         */
        visitPower: function (pow) {
            return "pow(" + this.format(pow.left()) + ", " +
                this.format(pow.right()) + ")";
        },



        /**
         * Visit division.
         */
        visitDivision: function (div) {
            return "(" + this.format(div.left()) + ") / (" +
                this.format(div.right()) + ")";
        },


        /**
         * Visit cos.
         */
        visitCos: function (cos) {
            return "cos(" + this.format(cos.arg()) + ")";
        },


        /**
         * Visit sin.
         */
        visitSin: function (sin) {
            return "sin(" + this.format(sin.arg()) + ")";
        },


        /**
         * Visit tan.
         */
        visitTan: function (tan) {
            return "tan(" + this.format(tan.arg()) + ")";
        },


        /**
         * Visit cos.
         */
        visitArccos: function (arccos) {
            return "acos(" + this.format(arccos.arg()) + ")";
        },


        /**
         * Visit sin.
         */
        visitArcsin: function (arcsin) {
            return "asin(" + this.format(arcsin.arg()) + ")";
        },


        /**
         * Visit tan.
         */
        visitArctan: function (arctan) {
            return "atan(" + this.format(arctan.arg()) + ")";
        },


        /**
         * Visit vector.
         */
        visitVector: function (vector) {            
            console.error("TODO! Cannot yet format vector as glsl.");
        },


        /**
         * Visit vector.
         */
        visitMatrix: function (matrix) {
            console.error("TODO! Cannot yet format matrix as glsl.");
        }
    });
});
    
