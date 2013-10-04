define(['quack', 'kalkyl/format/glsl', 'mathgl/engine/exports.js'], function(q, GLSL, Engine) {
    
    /**
     * Shader Formatter Base Class
     */
    return Engine.ShaderFormatter = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: function (expressions, symbolCategorization) {
            this._expressions = expressions;
            this.symbolCategorization(symbolCategorization);
            this._glslFormatter = null;
        },


        /**
         * Get/Set Symbol Categorization.
         */
        symbolCategorization: function (sc) {
            if (sc !== undefined) {
                this._symbolCategorization = sc;
            }
            return this._symbolCategorization;
        },


        /**
         * Get/Set Shader Symbol Dictionary.
         */
        shaderSymbolDictionary: function () {
            if (this._shaderSymbolDictionary === undefined) {
                this._shaderSymbolDictionary = new Engine.ShaderSymbolDictionary();
            }
            return this._shaderSymbolDictionary;
        },

        
        expressions: function () {
            return this._expressions;
        },


        

        /*****************************************
         * Kalkyl GLSL Formatters for internal use
         *****************************************/

        
        /**
         * Return my Kalkyl GLSL Formatter.
         */
        glslFormatter: new q.AbstractMethod(),

        
        /**
         * Return the complete shader code as a string
         */
        format: new q.AbstractMethod()
        
    });
});
