define(function (require) {

    var q = require('quack');
    var PlaneTessellation = require('./planeTessellation');
    var exports = require('./exports');

    /**
     * A tube tessellation is a plane tessellation with the second paramater always going form 0 to 2*pi
     */
    return exports.TubeTessellation = q.createClass(PlaneTessellation, {
        /**
         * Constructor.
         *
         * domain = [min, max]
         * Step size. the step size for the parameter.
         */
        constructor: function (domain, stepSize) {
            PlaneTessellation.constructor.call(this, domain, [0, 2*Math.PI], [stepSize, 0.2]);
        },
    });
    
});

