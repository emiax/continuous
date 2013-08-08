define(['quack', 'mathgl/appearanceNode.js', 'mathgl/exports.js'], function(q, AppearanceNode, MathGL) {
    return MathGL.Fill = q.createAbstractClass(AppearanceNode, {
        /**
         * Constructor.
         */
        constructor: function (spec) {
            MathGL.AppearanceNode.constructor.call(this, spec);
            
            spec = spec || {};
            var blendMode, background;

            blendMode = spec.blendMode || 'normal',
            background = spec.background || null;
            
            this.blendMode(blendMode);
            this.background(background);
        },

        
        blendMode: function (blendMode) {
            if (blendMode !== undefined && blendMode !== this._blendMode) {
                this._blendMode = blendMode;
                this.notifyObservers();
            }
            return this._blendMode;
        },
            
        
        /**
         * Get/set background.
         */
        background: function (node) {
            return this.input('background', node);
        }
        
    });
});
