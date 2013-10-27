define(['quack', 'mathgl/engine/entityShaderStrategy.js', 'mathgl/engine/exports.js'], function (q, EntityShaderStrategy, Engine) {
    return Engine.CurveShaderStrategy = q.createClass(EntityShaderStrategy, {
        /**
         * Constructor
         */
        constructor: function (tangentSymbol) {
            this._tangentSymbol = tangentSymbol;
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

            var ts = this._tangentSymbol;

            var x = dict.vertexName('x', cat);
            var y = dict.vertexName('y', cat);
            var z = dict.vertexName('z', cat);

            var dxdt = dict.vertexName('dxd' + ts, cat);
            var dydt = dict.vertexName('dyd' + ts, cat);
            var dzdt = dict.vertexName('dzd' + ts, cat);

            var glsl = "";
            glsl += "vec3 tangent = vec3(" + dxdt + ", " + dydt + ", " + dzdt + ");\n";
            glsl += "vec3 nonParallel = vec3(" + dzdt + ", " + dxdt + ", -" + dydt + ");\n";
            
            glsl += "vec3 u = normalize(cross(tangent, nonParallel));\n";
            glsl += "vec3 v = normalize(cross(tangent, u));\n";
            
            glsl += "vec3 displacement = thickness*(cos(theta)*u + sin(theta)*v);\n";


            glsl +=  "spacePosition = vec4(" + 
                x + " + displacement.x, " + 
                y + " + displacement.y, " + 
                z + " + displacement.z, 1.0);\n"; 
            return glsl;
        }
        
    });
});
