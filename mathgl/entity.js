define(['quack', 'mathgl/scope.js', 'mathgl/exports.js'], function(q, Scope, MathGL) {

    return MathGL.Entity = q.createAbstractClass(Scope, {
        /**
         * Get/Set appearance.
         */
        appearance: function (appearance) {
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
            return this._appearance;
        },
        
        
        /**
         * Retuan array of parameters.
         */
        parameters: new q.AbstractMethod()

    });
});
