define(['quack', './exports.js'], function(q, PA) {
    return PA.Token = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (type, string, position) {
            this._type = type;
            this._string = string;
            this._position = position;
        },


        /**
         * Get string.
         */
        string: function () {
            return this._string;
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
         * To string.
         */
        toString: function() {
            var line = this.type();
            while (line.length < 18) { line += " "; }
            line += this.string();
            while (line.length < 30) { line += " "; }
            line += this.position();
            return line;
        }


    });
});
