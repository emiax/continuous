define(function (require) {

    var q = require('quack');
    var Kalkyl = require('kalkyl');
    var Entity = require('./entity');
    var exports = require('./exports');

    return exports.Surface = q.createClass(Entity, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            spec = spec || {};
            Entity.constructor.call(this, spec);
            
            this.domain(spec.domain || {
                u: [0, 1],
                v: [0, 1]
            });
            
            this.appearance(spec.appearance || null);
            this.style(spec.style || 'solid');
        }, 


        /**
         * Get/set domain (map from symbols to arrays with two values, start and end)
         */
        domain: function (domain) {
            if (domain !== undefined) {
                if (Object.keys(domain).length === 2) {
                    this._domain = domain;
                } else {
                    console.error("Surface must have two domain variables");
                }
            }
            return this._domain;
        },
        
        
        parameters: function () {
            return Object.keys(this._domain);
        },
        

        style: function (style) {
            if (style !== undefined) {
                this._style = style;
            }
            return this._style;
        },


        xExpr: function () {
            return this.flat('x');
        },

        
        yExpr: function () {
            return this.flat('y');
        },


        zExpr: function () {
            return this.flat('z');
        },


        /**
         * Tangent expression map
         */
        tangentExpressions: function () {
            var parameters = this.parameters();
            var map = {};
            
            var u = parameters[0];
            var v = parameters[1];
            
            var zero = new Kalkyl.Number(0);
            var one = new Kalkyl.Number(1);
            
            map[u] = {};
            map[v] = {};

            var scope = this;
            ['x', 'y', 'z'].forEach(function (k) {
                switch (k) {
                case u: map[u][k] = one; map[v][k] = zero; break;
                case v: map[u][k] = zero; map[v][k] = one; break;
                default:
                    map[u][k] = scope.flatExpression(k).differentiated(u);
                    map[v][k] = scope.flatExpression(k).differentiated(v);
                }
            });

            return map;
        }

    });
});
