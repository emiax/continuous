define(function (require) {

    var q = require('quack');
    var Fill = require('./fill');
    var exports = require('./exports');

    return exports.Color = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            Fill.constructor.call(this, spec);
            
            if (spec === undefined) {
                spec = {};
            }
            if (typeof spec === 'number') {
                this.color(spec);
            } else {
                if (spec.color === undefined) {
                    this.color(0xffff0000);
                } else {
                    this.color(spec.color);
                }
            }
        },

        
        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        symbols: function () {
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
        },

        
        floatVector: function () {
            var color = this.color();
            var a = (0xff000000 & color) >>> 24;
            var r = (0xff0000 & color) >>> 16;
            var g = (0xff00 & color) >>> 8;
            var b = (0xff & color);
            return {
                a: a/255,
                r: r/255,
                g: g/255,
                b: b/255
            };
        }
        
    });
});

