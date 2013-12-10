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
         * Return glsl code for attribute declarations.
         */
        attributeDeclarations: function () {
            return "attribute float theta;\n";
        },


        /**
         * Return glsl code for uniform declarations.
         */
        uniformDeclarations: function () {
            return "uniform float thickness;\n";
        },
        

        /**
         * Return glsl code for varying declarations.
         */
        varyingDeclarations: function () {
            return "varying vec3 vSpecial_spaceNormal;\n";
        },
        

        /**
         * Return the code necessary to set space position in the vertex shader.
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
         * Return vertex shader appendix. In this case: calculate a normal in the space reference system.
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        vertexShaderAppendix: function (cat, dict) {
            return "vSpecial_spaceNormal = normalize(displacement);\n";
        },


        /**
         * Return code to set space normal in fragment shader.
         * In this case: Just forward the vertex shader's space normal. 
         */
        spaceNormal: function (cat, dict) {
            var spaceNormal = dict.spaceNormalName();
            return "vec3 " + spaceNormal + " = vSpecial_spaceNormal;\n";
        }
    });
});
