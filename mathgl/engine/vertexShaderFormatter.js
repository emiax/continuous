define(['quack', 'kalkyl/format/glsl', 'mathgl/engine/shaderFormatter.js', 'mathgl/engine/exports.js'], function(q, GLSL, ShaderFormatter, Engine) {
    
    /**
     * Vertex shader formatter
     */
    return Engine.VertexShaderFormatter = q.createClass(ShaderFormatter, {
        /**
         * Return glsl code for variable declarations outside main function.
         */
        declarations: function () {
            var glsl = "";
            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();

            cat.uniforms().forEach(function (s) {
                glsl += 'uniform float ' + dict.uniformName(s) + ";\n";
            });

            cat.attributes().forEach(function (s) {
                glsl += 'attribute float ' + dict.attributeName(s) + ";\n";
            });

            cat.varyings().forEach(function (s) {
                glsl += 'varying float ' + dict.varyingName(s) + ";\n";
            });

            glsl += 'uniform mat4 mvpMatrix;\n';

            return glsl;
        },

        
        /**
         * Return glsl code for main function.
         */
        mainFunction: function () {
            var formatter = this.glslFormatter();
            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();
            
            var glsl = "void main() {\n";
            var scope = this;
            console.log(cat.vertexDefinitions());
            cat.vertexDefinitions().forEach(function (s) {
                var expr = scope.expressions()[s];

                glsl += "float " + dict.vertexName(s, cat) + " = " + formatter.format(expr) + ";\n";
            });

            glsl += "vec4 spacePosition = vec4(" +
                dict.vertexName('x', cat) + ', ' + 
                dict.vertexName('y', cat) + ', ' + 
                dict.vertexName('z', cat) + ", 1.0);\n";


            glsl += "gl_Position = " + dict.mvpMatrixName() + " * spacePosition;\n";


            cat.varyings().forEach(function (s) {
                var attr = dict.attributeName(s);
                if (attr) {
                    glsl += dict.varyingName(s, cat) + " = " + attr + ";\n";
                }
            });

            glsl += "}\n"
            return glsl;
        },


        /**
         * Format shader.
         */        
        format: function () {
            var glsl = "";
            glsl += this.declarations();
            glsl += this.mainFunction();
            return glsl;
        },


        /**
         * Vetex glsl formatter.
         */
        glslFormatter: function () {
            if (this._glslFormatter) {
                return this._glslFormatter;
            }

            var formatter = this._glslFormatter = new GLSL.Formatter();

            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();
            var table = dict.vertexTranslationTable(cat);
            formatter.translationTable(table);

            return formatter;
        }

    });
});

