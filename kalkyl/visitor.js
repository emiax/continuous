define(['../lib/quack.js', './exports.js'], function(q, KL) {
    return KL.Visitor = q.createClass({

        visitExpression: function (expr) {
            throw "abstract function call";
        },

        visitConstant: function (expr) {
            throw "abstract function call";
        },

        visitUnaryOperator: function (expr) {
            throw "abstract function call";
        },

        visitBinaryOperator: function (expr) {
            throw "abstract function call";
        },

        visitVariable: function (expr) {
            throw "abstract function call";
        },


        visitMatrix: function (expr) {
            throw "abstract function call";
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

        visitSin: function (expr) {
            return this.visitUnaryOperator(expr);
        },

        visitCos: function (expr) {
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
