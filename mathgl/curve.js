define(function (require) {

    var q = require('quack');
    var Entity = require('./entity');
    var exports = require('./exports');
    var Kalkyl = require('kalkyl');

    return exports.Curve = q.createClass(Entity, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            spec = spec || {};
            Entity.constructor.call(this, spec);
            
            this.domain(spec.domain || {
                t: [0, 1]
            });
            
//            console.log(spec.stepSize);
            this.stepSize(spec.stepSize || 0.2);
            this.thickness(spec.thickness || 0.1);
            this.appearance(spec.appearance || null);
        }, 


        domain: function (domain) {
            if (domain !== undefined) {
                if (Object.keys(domain).length === 1) {
                    this._domain = domain;
                } else {
                    console.error("Curve must have excacly one domain variable");
                }
            }
            return this._domain;
        },
        

        thickness: function (thickness) {
            if (thickness !== undefined) {
                this._thickness = thickness;
            }
            return this._thickness;
        },


        stepSize: function(stepSize) {
            if (stepSize !== undefined) {
                if (typeof stepSize === 'object') {
                    this._stepSize = stepSize;
                } else if (typeof stepSize === 'number') {
                    this._stepSize = {};
                    this._stepSize[this.parameter()] = stepSize;
                }
            }
            return this._stepSize;
        },


        parameter: function () {
            return this.parameters()[0];
        },

        
        parameters: function () {
            return Object.keys(this._domain);
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
            var parameter = this.parameter();
            var map = {};
            
            var zero = new Kalkyl.Number(0);
            var one = new Kalkyl.Number(1);

            // todo: allow for user to set tangent expression manually
            // to improve unnecessarily complicated derivative expressions
            
            map.x = (parameter === 'x') ? one : this.flatExpression('x').differentiated(parameter);
            map.y = (parameter === 'y') ? one : this.flatExpression('y').differentiated(parameter);
            map.z = (parameter === 'z') ? one : this.flatExpression('z').differentiated(parameter);
            return map;
        }
    });
});
