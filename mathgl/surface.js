define(function (require) {

    var q = require('quack');
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
            console.log(Object.keys(this._domain));
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
        }

    });
});
