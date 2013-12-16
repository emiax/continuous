define(function (require) {

    var q = require('quack');
    var exports = require('./exports');
    
    /**
     * Shader Symbol Dictionary
     * Translates mathematical kalkyl symbols (strings) to glsl variable names (strings)
     * A mathematical symbol may get different names in different contexts in glsl code (x -> vs_x, or x -> fs_s) 
     */

    return exports.ShaderSymbolDictionary = q.createClass({
        /**
         * Constructor.
         */
        constructor: function () {},


        /**
         * Vertex Translation Table (return a map from symbol to name)
         */
        vertexTranslationTable: function (symbolCategorization) {
            var cat = symbolCategorization;
            var dict = this._vertexDictionary = {};
            var scope = this;

            cat.uniforms().forEach(function (symbol) {
                dict[symbol] = scope.uniformName(symbol);
            });

            cat.attributes().forEach(function (symbol) {
                dict[symbol] = scope.attributeName(symbol);
            });

            cat.vertexDefinitions().forEach(function (symbol) {
                dict[symbol] = scope.vertexDefinitionName(symbol);
            });

            return dict;
        }, 


        /**
         * Fragment Translation Table (return a map from symbol to name)
         */
        fragmentTranslationTable: function(symbolCategorization) {
            if (this._fragmentDictionary) {
                return this._fragmentDictionary;
            }

            var cat = symbolCategorization;
            var dict = this._fragmentDictionary = {};
            var scope = this;

            cat.uniforms().forEach(function (symbol) {
                dict[symbol] = scope.uniformName(symbol);
            });

            cat.varyings().forEach(function (symbol) {
                dict[symbol] = scope.varyingName(symbol);
            });

            cat.fragmentDefinitions().forEach(function (symbol) {
                dict[symbol] = scope.fragmentDefinitionName(symbol);
            });

            return dict;
        },
        

        /**
         * Get the variable name of a symbol,
         * in the context of the vertex shader.
         * cat is an instance of SymbolCategorization.
         */
        vertexName: function (symbol, cat) {
            switch (true) {
                case cat.uniform(symbol): return this.uniformName(symbol);
                case cat.attribute(symbol): return this.attributeName(symbol);
                case cat.vertexDefinition(symbol): return this.vertexDefinitionName(symbol);
            }
        },


        /**
         * Get the variable name of a symbol,
         * in the context of the fragment shader. 
         * cat is an instance of SymbolCategorization.
         */
        fragmentName: function (symbol, cat) {
            if (!cat) {
                console.error("missing parameter symbolCategorization");
            }
            switch (true) {
                case cat.uniform(symbol): return this.uniformName(symbol);
                case cat.varying(symbol): return this.varyingName(symbol);
                case cat.fragmentDefinition(symbol): return this.fragmentDefinitionName(symbol);
            }
        },
        
        
        /**************************************
         * Return symbol names in glsl code
         **************************************/

        /**
         * Return the name of the symbol referenced as a uniform.
         */
        uniformName: function (symbol) {
            return 'u_' + symbol;
        },

        
        /**
         * Return the name of the symbol referenced as an attribute.
         */
        attributeName: function (symbol) {
            return 'a_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as a varying.
         */
        varyingName: function (symbol) {
            return 'v_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        vertexDefinitionName: function (symbol) {
            return 'vs_' + symbol;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        fragmentDefinitionName: function (symbol) {
            return 'fs_' + symbol;
        },

        
        /**
         * mvMatrixName
         */
        mvMatrixName: function() {
            return "uSpecial_mvMatrix";
        },


        /**
         * pMatrixName
         */
        pMatrixName: function() {
            return "uSpecial_pMatrix";
        },

        
        /**
         * Return the name of a derivative dydx.
         */
        derivativeName: function (x) {
            return 'vsDerivative_' + x;
        },


        /**
         * Return the name of the space position in the vertex shader.
         */
        spacePositionName: function () {
            return 'vsSpecial_spacePosition'
        },

        
        /*
         * Return the name of the the space normal. This is defined in the fragment shader.
         */
        spaceNormalName: function () {
            return 'fsSpecial_spaceNormal';
        }

    });

});
