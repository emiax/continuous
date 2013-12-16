define(['quack', 'errors/exports.js'], function(q, Errors) {
    return Errors.Error = q.createAbstractClass({
        /**
         * Description
         */
        description: new q.AbstractMethod(),


        /**
         * Type (a string identifying the error)
         */
        type: new q.AbstractMethod(),


        /**
         * Code
         */
        code: function () {
            return Errors.codes[this.type()];
        }
    });
});
