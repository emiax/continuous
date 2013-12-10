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
         * Return the code nessesary to set space position in the vertex shader
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spacePosition: new q.AbstractMethod(),


        /**
         * Return code to append to the vertex. This can for example set varyings necessary to calculate a space normal in the fs.
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        vertexShaderAppendix: new q.AbstractMethod(),


        /**
         * Return the code necessary to set space normal on fragment shader (should define fragmentSpaceNormal)
         */
        spaceNormal: new q.AbstractMethod()
    });
});

