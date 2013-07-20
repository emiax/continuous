define(['quack', './exports.js'], function(q, PA) {
    return PA.ParseError = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (type, position, token) {
            this._type = type;
            this._position = position;
            this._token = token;
        },


        /**
         * Get type.
         */
        type: function () {
            return this._type;
        },


        /**
         * Get position.
         */
        position: function () {
            return this._position;
        },


        /**
         * Get position.
         */
        token: function () {
            return this._token;
        }
    });
});
