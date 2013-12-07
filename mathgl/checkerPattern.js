define(function (require) {

    var q = require('quack');
    var Fill = require('./fill');
    var exports = require('./exports');

    return exports.CheckerPattern = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            Fill.constructor.call(this, spec);
            
            spec = spec || {};

            this.inputA(spec.inputA === undefined ? 0xffff0000 : spec.inputA);
            this.inputB(spec.inputB === undefined ? 0xffff0000 : spec.inputB);
            
            this.parameters(spec.parameters || {});
        },

        
        /**
         * Get/set parameter
         */
        parameter: function (parameter, stepSize) {
            if (step !== undefined) {
                this._parameters[parameter] = stepSize;
                this.notifyObservers();
            }
            return this._parameters[parameter];
        },


        /**
         * Set multiple parameters. (Map from symbol to step size)
         */
        parameters: function (parameters) {
            if (parameters !== undefined) {
                this._parameters = parameters;
                this.notifyObservers();
            }
            return this._parameters;
        },

        
        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        symbols: function () {
            var keys = Object.keys(this._parameters);
            console.log(keys);
            var set = {};
            keys.forEach(function (k) {
                console.log(k);
                set[k] = true;
            });
            return set;
        },

        
        /**
         * Get/set input A.
         */
        inputA: function (node) {
            return this.input('A', node);
        },


        /**
         * Get/Set input B.
         */
        inputB: function (node) {
            return this.input('B', node);
        }
    });
});

