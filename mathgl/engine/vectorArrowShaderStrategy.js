define(function (require) {

    var q = require('quack');
    var EntityShaderStrategy = require('./entityShaderStrategy');
    var exports = require('./exports');

    return exports.VectorArrowShaderStrategy = q.createClass(EntityShaderStrategy, {
        /**
         * Constructor
         */
        constructor: function () {},


        /**
         * Return glsl code for variable declarations
         */
        attributeDeclarations: function () {
            return "attribute vec3 vertexData;\n";
        },

        
        uniformDeclarations: function () {
            return ["uniform float thickness;",
                    "uniform vec3 position;",
                    "uniform vec3 value;"].join('\n');
        },


        /**
         * Return the code nessesary to set space position
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spacePosition: function (cat, dict) {
            
            glsl = "";
            glsl += "float theta = vertexData.x;\n";
            glsl += "float radius = vertexData.y;\n";
            glsl += "float displacement = vertexData.z;\n";
            
            glsl += "vec3 coneTopPosition = value;\n";
            glsl += "vec3 coneBottomPosition = value - 3.0*thickness*normalize(value);\n";
            glsl += "vec3 cylinderBottomPosition = vec3(0.0);\n";

            glsl += "vec3 d = value;\n";
            glsl += "vec3 u = normalize(vec3(d.y + d.z, - d.x + d.z, - d.x - d.y));\n";
            glsl += "vec3 v = normalize(cross(d, u));\n";

            glsl += "vec3 angularDisplacement = radius*thickness*(cos(theta)*u + sin(theta)*v);\n";
            glsl += "vec3 parallelDisplacement = mix(cylinderBottomPosition, coneBottomPosition, step(0.5, displacement));\n";
            glsl += "parallelDisplacement = mix(parallelDisplacement, coneTopPosition, step(1.5, displacement));\n";

            glsl +=  "spacePosition = vec4(position + parallelDisplacement + angularDisplacement, 1.0);\n"; 
            return glsl;
        }
        
    });
});
