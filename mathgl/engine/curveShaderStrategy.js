define(function (require) {

    var q = require('quack');
    var EntityShaderStrategy = require('./entityShaderStrategy');
    var exports = require('./exports');
    var GLSLFormat = require('kalkyl/format/glsl');

    return exports.CurveShaderStrategy = q.createClass(EntityShaderStrategy, {
        /**
         * Constructor
         */
        constructor: function (derivativeExpressions) {
            this._derivativeExpressions = derivativeExpressions;
        },


        /**
         * Return glsl code for variable declarations
         */
        attributeDeclarations: function () {
            return "attribute float theta;\n";
        },

        
        uniformDeclarations: function () {
            return "uniform float thickness;\n"
        },


        /**
         * Return the code nessesary to set space position
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spacePosition: function (cat, dict) {
            var dxdt = dict.derivativeName("dxdt");
            var dydt = dict.derivativeName("dydt");
            var dzdt = dict.derivativeName("dzdt");
            
            var derivativeExpressions = this._derivativeExpressions;

            var formatter = new GLSLFormat.Formatter(dict.vertexTranslationTable(cat));

            var glsl = "";            
            glsl += "float " + dxdt + " = " + formatter.format(derivativeExpressions.x) + ";\n";
            glsl += "float " + dydt + " = " + formatter.format(derivativeExpressions.y) + ";\n";
            glsl += "float " + dzdt + " = " + formatter.format(derivativeExpressions.z) + ";\n";

            glsl += "vec3 tangent = vec3(" + dxdt + ", " + dydt + ", " + dzdt + ");\n";
            glsl += "vec3 u = normalize(vec3(" + dydt + " + " + dzdt + ", -" + dxdt + " + " + dzdt + ", -" + dxdt + " - " + dydt + "));\n";
            glsl += "vec3 v = normalize(cross(tangent, u));\n";
            
            glsl += "vec3 displacement = thickness*(cos(theta)*u + sin(theta)*v);\n";

            var x = dict.vertexName('x', cat);
            var y = dict.vertexName('y', cat);
            var z = dict.vertexName('z', cat);

            glsl +=  "spacePosition = vec4(" + 
                x + " + displacement.x, " + 
                y + " + displacement.y, " + 
                z + " + displacement.z, 1.0);\n"; 
            return glsl;
        }, 


        /**
         * Return the code nessesary to set space normal
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        spaceNormal: function (cat, dict) {
            return "spaceNormal = normalize(displacement);\n";
        }        
    });
});
