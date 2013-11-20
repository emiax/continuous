define(['quack', 'mathgl/engine/entityShaderStrategy.js', 'mathgl/engine/exports.js'], function (q, EntityShaderStrategy, Engine) {
    return Engine.SurfaceShaderStrategy = q.createClass(EntityShaderStrategy, {
        /**
         * Return the code nessesary to set space position
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spacePosition: function (cat, dict) {
           return "spacePosition = vec4(" + 
                dict.vertexName('x', cat) + ', ' + 
                dict.vertexName('y', cat) + ', ' + 
                dict.vertexName('z', cat) + ', 1.0);\n'; 
        }
        
    });
});
