define(['quack', 'mathgl/fill.js', 'mathgl/exports.js'], function(q, Fill, MathGL) {
    return MathGL.Color = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            MathGL.Fill.constructor.call(this, spec);
            
            spec = spec || {};
            if (typeof spec === 'number') {
                this.color(spec);
            } else {
                this.color(spec.color || 0xffff0000)
            }
        },

        
        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        expressions: function () {
            return {};
        },
        

        /**
         * Get/set color
         */        
        color: function (color) {
            if (color !== undefined) {
                var oldColor = this._color;
                this._color = color;
                if (color !== oldColor) {
                    this.notifyObservers();
                }
            }
            return this._color;
        }
    });
});

