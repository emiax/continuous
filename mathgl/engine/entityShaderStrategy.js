define(['quack', 'mathgl/exports.js'], function (q, Engine) {
    return Engine.EntityShaderStrategy = q.createAbstractClass({
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
        spacePosition: new q.AbstractMethod()
    });
});

