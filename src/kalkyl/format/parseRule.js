define(function (require) {
    var exports = require('./exports');
    var q = require('quack');

    return exports.ParseRule = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (spec) {
            spec = spec || {};
            this._nud = spec.nud || function () {};
            this._led = spec.led || function () {};
            this._lbp = spec.lbp || 0;
        },
        
        
        /**
         * Return a null denotation function (arg1: parser, arg2: token)
         */ 
        nud: function (nud) {
            if (typeof nud === 'function') {
                this._nud = nud;
            }
            return this._nud;
        },


        /**
         * Return a left denotation function (arg1: parser. arg2: this token, arg3: left token)
         */
        led: function (led) {
            if (typeof led === 'function') {
                this._led = led;
            }
            return this._led;
        },


        /**
         * Return the left binding power (a number)
         */        
        lbp: function (lbp) {
            if (typeof lbp === 'number') {
                this._lbp = lbp;
            }
            return this._lbp;
        }
    });
});
