define(['quack', 'mathgl/engine/exports.js'], function(q, Engine) {
    

    return Engine.ShaderSymbolDictionary = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (symbolCategorization) {
            this.symbolCategorization(symbolCategorization);
        },


        /**
         * Symbol categorization
         */
        symbolCategorization: function (categorization) {
            if (categorization !== undefined) {
                this._symbolCategorization = categorization;
            }
            return this._symbolCategorization;
        }


        /**
         * Get the variable name of a symbol,
         * in the context of the vertex shader.
         */
        vertexContext: function (symbol) {
            var cat = this.symbolCategorization();
            if (cat.uniform(symbol))
                return this.uniformReference(symbol);
            if (cat.attribute(symbol)) {
                return this.attributeReference(symbol);
            } else if (cat.vertexShaderDefinition(symbol)) {
                return this.vertexShaderReference(symbol);
            }
            console.error("Symbol is not defined.");
        }


        /**
         * Get the variable name of a symbol,
         * in the context of the fragment shader. 
         */
        fragmentContext: function (symbol) {
            if (cat.uniform(symbol))
                return this.uniformReference(symbol);
            if (cat.varying(symbol))
                return this.varyingReferene(symbol);
            if (cat.fragmentShaderDefinition(symbol))
                return this.fragmentShaderReference(symbol);
            console.error("Symbol is not defined.");
        },
        
        


        /****************************************
         * Return symbol names in glsl code
         ****************************************

        
        /**
         * Return the name of the symbol referenced as a uniform.
         */
        uniformReference: function (symbol) {
            return 'u_' + symbol;
        },

        
        /**
         * Return the name of the symbol referenced as an attribute.
         */
        attributeReference: function (symbol) {
            return 'a_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as a varying.
         */
        varyingReference: function (symbol) {
            return 'v_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        vertexDefinitionReference: function (symbol) {
            return 'vs_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        fragmentDefinitionReference: function (symbol) {
            return 'fs_' + symbol;
        }
    });

});
