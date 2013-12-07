define(function (require) {

    var q = require('quack');
    var GLSL = require('kalkyl/format/glsl');
    var exports = require('./exports');
    
    /**
     * Shader Formatter Base Class
     */
    return exports.ShaderFormatter = q.createAbstractClass({
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
                this._shaderSymbolDictionary = new exports.ShaderSymbolDictionary();
            }
            return this._shaderSymbolDictionary;
        },

        
        expressions: function () {
            return this._expressions;
        },
        
        /**
         * Get/Set Entity Strategy (instance of EntityShaderStrategy. SurfaceShaderStragey, CurveShaderStrategy etc)
         */
        entityStrategy: function (strategy) {
            if (strategy !== undefined) {
                this._entityStrategy = strategy;
            }
            return this._entityStrategy;
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
