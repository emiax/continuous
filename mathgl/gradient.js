define(['quack', 'mathgl/fill.js', 'mathgl/exports.js'], function(q, Fill, MathGL) {
    return MathGL.Gradient = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            MathGL.Fill.constructor.call(this, spec);
            
            spec = spec || {};
            var parameter = spec.parameter;
            var stops = spec.stops || {};

            if (parameter) {
                this.parameter(spec.parameter);
            } else {
                console.error("Missing parameter 'parameter'");
            }
            
            this._stops = {};
            this.stops(stops);
        },

        
        /**
         * Set parameter to contol the gradient.
         */
        parameter: function (parameter) {
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
        },

        
        stop: function (value, node) {
            if (node === null) {
                delete this._stops[value];
            } else {
                this._stops[value] = node;
            }
            this.input(value, node);
        },
        
        /**
         * Get/set map from values to nodes
         */
        stops: function (stops) {
            var scope = this;
            if (stops !== undefined) {
                this.clearStops();
                Object.keys(stops).forEach(function (v) {
                    scope.stop(v, stops[v]);
                });
            }
            return this._inputs;
        }

    });
});
