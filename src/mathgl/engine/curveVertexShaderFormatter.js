define(['quack', 'kalkyl/format/glsl', 'mathgl/engine/shaderFormatter.js', 'mathgl/engine/exports.js'], function(q, GLSL, ShaderFormatter, Engine) {
    
    /**
     * Vertex shader formatter
     */
    return Engine.VertexShaderFormatter = q.createClass(ShaderFormatter, {
        
        /**
         * Entity Specific Vertex Definitions
         */
        entitySpecificAttributeDefinitions: function () {
            return 'attribute float theta;\n';
        }
        
    });
});

