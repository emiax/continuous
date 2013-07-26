define(['quack', 'errors/exports.js', 'errors/error.js'], function(q, Errors, Error) {
    return Errors.SageError = q.createClass(Error, {
        /**
         * Constructor.
         */
        constructor: function (description) {
            this._description = description;
        },

        /**
         * Description
         */
        description: function () {
            return this._description;
        },


        /**
         * Type (a string identifying the error)
         */
        type: function () {
            return 'sage';
        }
    });
});
