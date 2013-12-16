define(function (require) {

    var q = require('quack');
    var AppearanceNode = require('./appearanceNode');
    var exports = require('./exports');

    return exports.Threshold = q.createClass(AppearanceNode, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            AppearanceNode.constructor.call(this, spec);
            
            spec = spec || {};

            this.parameter(spec.parameter);
            this.value(spec.value);
            this.below(spec.below);
            this.above(spec.above);
        },


        /**
         * Get/set parameter
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
            
            var value = this.value();
            if (typeof value === 'string') {
                expressions[this.value()] = true;
            }
            return expressions;
        },


        /**
         * Get/set value (a string or a value)
         */
        value: function (value) {
            if (value !== undefined) {
                this._value = value;
                this.notifyObservers();
            }
            return this._value;
        },

        
        /**
         * Get/set below.
         */
        below: function (node) {
            return this.input('below', node);
        },
        

        /**
         * Get/set above.
         */
        above: function (node) {
            return this.input('above', node);
        }

    });
});
