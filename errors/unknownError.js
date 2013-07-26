define(['quack', 'errors/exports.js', 'errors/error.js'], function(q, Errors, Error) {
    return Errors.UnknownError = q.createClass(Error, {
        /**
         * Constructor.
         */
        constructor: function (description) {
           return this.description();
        },

        /**
         * Description.
         */
        description: function () {
            return this._description;
        },


        /**
         * Type. (a string identifying the error)
         */
        type: function () {
            return 'unknown';
        }
    });
});
