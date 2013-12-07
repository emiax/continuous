define(function (require) {
    var q = require('quack');
    var exports = require('./exports');

    return exports.Visitor = q.createClass({

        visitExpression: function (expr) {
            console.error("abstract function call");
        },

        visitFunction: function (expr) {
            console.error("abstract function call");
        },

        visitNumber: function (expr) {
            console.error("abstract function call");
        },

        visitUnaryOperator: function (expr) {
            console.error("abstract function call");
        },

        visitBinaryOperator: function (expr) {
            console.error("abstract function call");
        },

        visitVariable: function (expr) {
            console.error("abstract function call");
        },

        visitMatrix: function (expr) {
            console.error("abstract function call");
        },

        visitVector: function (expr) {
            return this.visitMatrix(expr);
        },

        visitPlus: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitMinus: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitUnaryMinus: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitMultiplication: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitDivision: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitPower: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitExp: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitLn: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitTrigonometricFunction: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitSin: function (expr) {
            return this.visitTrigonometricFunction(expr);
        },

        visitCos: function (expr) {
            return this.visitTrigonometricFunction(expr);
        },

        visitTan: function (expr) {
            return this.visitTrigonometricFunction(expr);
        },

        visitArcsin: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitArccos: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitArctan: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitDot: function (expr) {
            return this.visitBinaryOperator(expr);
        },

        visitCross: function (expr) {
            return this.visitBinaryOperator(expr);
        }
    });
    return Visitor;
});
