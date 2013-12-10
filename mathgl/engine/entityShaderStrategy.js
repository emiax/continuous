define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.EntityShaderStrategy = q.createAbstractClass({
        /**
         * Return glsl code for uniform declarations
         */
        uniformDeclarations: function () {
            return "";
        },


        /**
         * Return glsl code for variable declarations
         */
        attributeDeclarations: function () {
            return "";
        },


        /**
         * Return glsl code for varying declarations
         */
        varyingDeclatations: function () {
            return "";
        },


        /**
         * Return the code nessesary to set space position
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spacePosition: new q.AbstractMethod(),


        /**
         * Return the code nessesary to set space normal
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spaceNormal: new q.AbstractMethod()

    });
});

