define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, Kalkyl, Visitor, Expression) {
    Kalkyl.Substitutor = q.createClass(Visitor, {

        constructor: function (map) {
            this._substitutes = {};
            var scope = this;
            Object.keys(map).forEach(function (s) {
                var v = map[s];
                if (typeof v === 'number') {
                    scope._substitutes[s] = Kalkyl.Number.boxNumber(v);
                } else if (typeof v === 'string') {
                    scope._substitutes[s] = Kalkyl.Variable.boxVariable(v);
                } else if (v instanceof Kalkyl.Expression) {
                    scope._substitutes[s] = v;
                }
            });
        },

        substitute: function (expr) {
            this._performedSubstitutions = {};
            return expr.accept(this);
        },

        performedSubstitutions: function () {
            return this._perfoemdSubstitutions;
        },
        
        getSubstitute: function (s) {
            if (s instanceof Kalkyl.Variable) {
                s = s.symbol();
            }
            return this._substitutes[s];
        },
        
        substitutes: function () {
            return this._substitutes;
        },

        visitNumber: function (expr) {
            return expr.clone();
        },


        visitVariable: function (expr) {
            var scope = this;
            var substitute = null;
            Object.keys(this.substitutes()).forEach(function (symbol) {
                var sub = scope.getSubstitute(symbol);
                if (expr.symbol() === symbol) {
                    substitute = sub;
                    scope.performedSubstitutions[symbol] = substitute;
                }
            });
            
            return substitute || expr.clone();
        },

        
        visitUnaryOperator: function (expr) {
            var Operator = expr.getClass();
            var arg = this.substitute(expr.arg());
            return new Operator(arg);
        },
        

        visitBinaryOperator: function (expr) {
            var Operator = expr.getClass();
            var left = this.substitute(expr.left());
            var right = this.substitute(expr.right());
            return new Operator(left, right);
        },
       
 
        visitMatrix: function (expr) {
            var matrix = expr.clone();
            var scope = this;
            matrix.forEachElement(function (v, k) {
                var substituted = scope.substitute(v);
                matrix.element(k, substituted);
            });
            
            return matrix;
        }
        
    });


    function substitutor(substitutorOrMap) {
        var substitutor = null;
        if (substitutorOrMap instanceof Kalkyl.Substitutor) {
            substitutor = substitutorOrMap;
        } else {
            substitutor = new Kalkyl.Substitutor(substitutorOrMap);
        }
        return substitutor;
    }

    q.patch(Expression, {

        substituted: function (substitutorOrMap) {
            return substitutor(substitutorOrMap).substitute(this);
        }

    });

    return Kalkyl.Substitutor;
});
