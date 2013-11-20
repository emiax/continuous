define(['quack', 'mathgl/fill.js', 'mathgl/exports.js'], function(q, Fill, MathGL) {
    return MathGL.Gradient = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            MathGL.Fill.constructor.call(this, spec);
            
            spec = spec || {};
            var parameter = spec.parameter;

            if (normal) {
                this.normal(spec.normal);
            } else {
                this.normal(null);
            }
            
            this._stops = {};
            this.stops(stops);
        },

        
        /**
         * Set normal expression. A Kalkyl Vector3
         */
        normal: function (parameter) {
            if (parameter !== undefined) {
                this._parameter = parameter;
                this.notifyObservers();
            }
            return this._parameter;
        },
        

        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        symbols: function () {
            var expressions = {};
            expressions[this.parameter()] = true;
            return expressions;
        },
        

        clearStops: function() {
            var scope = this;
            Object.keys(this._stops).forEach(function (value) {
                scope.stop(value, null);
            });
        }

    });
});
