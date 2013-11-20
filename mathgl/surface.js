define(['quack', 'mathgl/entity.js', 'mathgl/exports.js'], function(q, Entity, MathGL) {

    return MathGL.Surface = q.createClass(Entity, {
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
            console.log(Object.keys(this._domain));
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
        }

    });
});
