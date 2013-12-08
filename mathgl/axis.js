define(function (require) {

    var q = require('quack');
    var Entity = require('./entity');
    var exports = require('./exports');

    return exports.Axis = q.createClass(Entity, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            spec = spec || {};
            Entity.constructor.call(this, spec);

            this.parameter(spec.parameter || 'x');
            this.position(spec.position || '[0 0 0]');
            this.stepSize(spec.stepSize || 0.1);
            this.length(spec.length || 1);
            this.label(spec.label || this.parameter());
        },


        /*
         * Get/set parameter
         */
        parameter: function (parameter) {
            if (parameter !== undefined) {
                this._parameter = parameter;
            }
            return this._parameter;
        },


        /*
         * Get/set position
         */
        position: function (position) {
            if (position !== undefined) {
                this._position = position;
            }
            return this._position;
        },


        /*
         * Get/set stepSize
         */
        stepSize: function (stepSize) {
            if (stepSize !== undefined) {
                this._stepSize = stepSize;
            }
            return this._stepSize;
        },


        /*
         * Get/set length
         */
        length: function (length) {
            if (length !== undefined) {
                this._length = length;
            }
            return this._length;
        }
    });
});
