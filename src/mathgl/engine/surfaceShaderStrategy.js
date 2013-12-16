define(function (require) {

    var q = require('quack');
    var EntityShaderStrategy = require('./entityShaderStrategy');
    var exports = require('./exports');
    var GLSLFormat = require('kalkyl/format/glsl');

    return exports.SurfaceShaderStrategy = q.createClass(EntityShaderStrategy, {
        /**
         * Constructor
         */
        constructor: function (derivativeExpressions) {
            this._derivativeExpressions = derivativeExpressions;
        },


        /**
         * Return glsl code for varying declarations.
         */
        varyingDeclarations: function () {
            return "varying vec3 vSpecial_spaceNormal;\n";
        },
        

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
        },


        /**
         * Return vertex shader appendix. In this case: calculate a normal in the space reference system.
         * cat is a SymbolCategorization
         * dict is a ShaderSymbolDictionary
         */
        vertexShaderAppendix: function (cat, dict) {            
            var dxds = dict.derivativeName("dxds");
            var dyds = dict.derivativeName("dyds");
            var dzds = dict.derivativeName("dzds");

            var dxdt = dict.derivativeName("dxdt");
            var dydt = dict.derivativeName("dydt");
            var dzdt = dict.derivativeName("dzdt");
            
            var derivativeExpressions = this._derivativeExpressions;
            
            var formatter = new GLSLFormat.Formatter(dict.vertexTranslationTable(cat));

            var glsl = "";
            
            var parameters = Object.keys(derivativeExpressions);
            var s = parameters[0];
            var t = parameters[1];

            glsl += "float " + dxds + " = " + formatter.format(derivativeExpressions[s].x) + ";\n";
            glsl += "float " + dyds + " = " + formatter.format(derivativeExpressions[s].y) + ";\n";
            glsl += "float " + dzds + " = " + formatter.format(derivativeExpressions[s].z) + ";\n";

            glsl += "float " + dxdt + " = " + formatter.format(derivativeExpressions[t].x) + ";\n";
            glsl += "float " + dydt + " = " + formatter.format(derivativeExpressions[t].y) + ";\n";
            glsl += "float " + dzdt + " = " + formatter.format(derivativeExpressions[t].z) + ";\n";

            glsl += "vec3 tangent1 = vec3(" + dxds + ", " + dyds + ", " + dzds + ");\n";
            glsl += "vec3 tangent2 = vec3(" + dxdt + ", " + dydt + ", " + dzdt + ");\n";

            glsl += "vSpecial_spaceNormal = normalize(-cross(tangent1, tangent2));\n";
            return glsl;
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
