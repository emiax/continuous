define(function (require) {
    var q = require('quack');
    var Visitor = require('./visitor');
    var Expression = require('./expression');
    var exports = require('./exports');

    exports.VariableLister = q.createClass(Visitor, {

        listVariables: function (expr) {
            return Object.keys(this.variableSet(expr));
        },

        variableSet: function (expr) {
            return expr.accept(this);
        },

        visitNumber: function (expr) {
            return {};
        },

        visitVariable: function (expr) {
            var map = {};
            map[expr.symbol()] = true;
            return map;
        },

        visitMatrix: function (expr) {
            var set = {};
            var scope = this;
            expr.forEachElement(function (v) {
                Object.keys(scope.variableSet(v)).forEach(function (s) {
                    set[s] = true;
                });
            });
            return set;
        },

        visitBinaryOperator: function (expr) {
            var set = {};
            var scope = this;
            expr.forEachArgument(function (v) {
                Object.keys(scope.variableSet(v)).forEach(function (s) {
                    set[s] = true;
                });
            });
            return set;
        },


        visitUnaryOperator: function (expr) {
            return this.variableSet(expr.arg());
        }
    });


    q.patch(Expression, {

        listVariables: function(lister) {
            if (!lister) {
                lister = new exports.VariableLister();
            }
            return lister.listVariables(this);
        }

    });

    return exports.VariableLister;
});
