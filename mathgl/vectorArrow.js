define(function (require) {

    var q = require('quack');
    var Entity = require('./entity');
    var exports = require('./exports');

    return exports.VectorArrow = q.createClass(Entity, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            spec = spec || {};
            Entity.constructor.call(this, spec);
            this.thickness(spec.thickness || 0.1);
            this.appearance(spec.appearance || null);
        }, 


        /**
         * Get/set thickness.
         */
        thickness: function (thickness) {
            if (thickness !== undefined) {
                this._thickness = thickness;
            }
            return this._thickness;
        },


        /**
         * Get/set thickness.
         */
        positionExpr: function () {
            return this.flat('position').evaluated();
        },


        /**
         * Get/set expression.
         */
        valueExpr: function () {
            return this.flat('value').evaluated();
        },


        parameters: function () {
            return [];
        }

    });
});
