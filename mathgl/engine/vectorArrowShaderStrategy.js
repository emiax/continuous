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


        varyingDeclarations: function () {
            return "varying vec4 vSpecial_vertexData;\n";
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

            glsl += "vec3 cylinderNormal = cos(theta)*u + sin(theta)*v;\n";
            
            glsl += "vec3 angularDisplacement = radius*thickness*cylinderNormal;\n";
            glsl += "vec3 parallelDisplacement = mix(cylinderBottomPosition, coneBottomPosition, step(0.5, displacement));\n";
            glsl += "parallelDisplacement = mix(parallelDisplacement, coneTopPosition, step(1.5, displacement));\n";

            glsl +=  "spacePosition = vec4(position + parallelDisplacement + angularDisplacement, 1.0);\n"; 
            return glsl;
        },


        /**
         * Return the code nessesary to set space normal
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        vertexShaderAppendix: function (cat, dict) {
            glsl = "vSpecial_vertexData = vec4(angularDisplacement, displacement);\n";
            return glsl;
        },

        
        spaceNormal: function (cat, dict) {
            glsl = "";
            glsl += "vec3 fsSpecial_cylinderNormal = normalize(vSpecial_vertexData.xyz);\n";
            glsl += "float fsSpecial_displacement = vSpecial_vertexData.w;\n";

            glsl += "vec3 bottomNormal = -normalize(value);\n";

            var spaceNormal = dict.spaceNormalName();
            glsl += "float epsilon = 0.0001;\n";

            glsl += "vec3 " + spaceNormal + " = mix(bottomNormal, fsSpecial_cylinderNormal, step(epsilon, fsSpecial_displacement));"
//            glsl += "vec3 " + spaceNormal + " = fsSpecial_cylinderNormal;"
            glsl += spaceNormal + " = mix(" + spaceNormal + ", bottomNormal, step(1.0 - epsilon, fsSpecial_displacement));\n"
            glsl += spaceNormal + " = mix(" + spaceNormal + ", fsSpecial_cylinderNormal, step(1.0 + epsilon, fsSpecial_displacement));\n"

//            glsl = "vec3 coneNormal = normalize(cross(coneTopPosition - (coneBottomPosition + );\n";
//            return "spaceNormal = vec3(0.0, 0.0, 1.0);\n";

            return glsl;
//            glsl = "vec3 bottomNormal = -normalize(value);\n";            
            
        }
    });
});
