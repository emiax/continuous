define(function (require) {
    var q = require('quack');
    var Fill = require('./fill')
    var exports = require('./exports')

    return exports.Diffuse = q.createClass(Fill, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            exports.Fill.constructor.call(this, spec);
        },

        
        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        symbols: function () {
            return {};
        }

    });
});
