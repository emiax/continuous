define(['quack', 'mathgl/entity.js', 'mathgl/exports.js'], function(q, Entity, MathGL) {

    return MathGL.Curve = q.createClass(Entity, {
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
            var map = {}

            var xDeriv = "dxd" + parameter, yDeriv = "dyd" + parameter, zDeriv = "dzd" + parameter;
            map[xDeriv] = this.get(xDeriv) || this.flatExpression('x').differentiated(parameter);
            map[yDeriv] = this.get(yDeriv) || this.flatExpression('y').differentiated(parameter);
            map[zDeriv] = this.get(zDeriv) || this.flatExpression('z').differentiated(parameter);
            return map;
        }
    });
});
