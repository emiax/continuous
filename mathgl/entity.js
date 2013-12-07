define(function (require) {

    var q = require('quack');
    var Scope = require('./scope');
    var exports = require('./exports');

    return exports.Entity = q.createAbstractClass(Scope, {
        /**
         * Get/Set appearance.
         */
        appearance: function (appearance) {
            if (appearance !== undefined) {
                var oldAppearance = this._appearance;
                if (oldAppearance) {
                    oldAppearance.unregisterEntity(this);
                }
                if (appearance) {
                    appearance.registerEntity(this);
                }
                // you can set appearance to null, so this extra check is needed.
                if (appearance !== undefined) {
                    this._appearance = appearance;
                    this.notifyObservers("appearance");
                }
            }
            return this._appearance;
        },
        
        
        /**
         * Retuan array of parameters.
         */
        parameters: new q.AbstractMethod()

    });
});
