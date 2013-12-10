define(function (require) {

    var q = require('quack');
    var GLSL = require('kalkyl/format/glsl');
    var ShaderFormatter = require('./shaderFormatter');
    var exports = require('./exports');

    /**
     * Vertex shader formatter
     */
    return exports.VertexShaderFormatter = q.createAbstractClass(ShaderFormatter, {
        /**
         * Return glsl code for variable declarations outside main function.
         */
        declarations: function () {
            var glsl = "";
            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();

            glsl += this.entityStrategy().uniformDeclarations();
            glsl += this.entityStrategy().attributeDeclarations();
            glsl += this.entityStrategy().varyingDeclarations();
            
//            glsl += this.entitySpecificAttributeDefinitions();
            
            cat.uniforms().forEach(function (s) {
                glsl += 'uniform float ' + dict.uniformName(s) + ";\n";
            });

            cat.attributes().forEach(function (s) {
                glsl += 'attribute float ' + dict.attributeName(s) + ";\n";
            });

            cat.varyings().forEach(function (s) {
                glsl += 'varying float ' + dict.varyingName(s) + ";\n";
            });
            
            glsl += 'uniform mat4 ' + dict.mvMatrixName() + ';\n';
            glsl += 'uniform mat4 ' + dict.pMatrixName() + ';\n';
            
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

            cat.vertexDefinitions().forEach(function (s) {
                var expr = scope.expressions()[s];
                glsl += "float " + dict.vertexName(s, cat) + " = " + formatter.format(expr) + ";\n";
            });
            
            glsl += "vec4 spacePosition;\n";
            glsl += this.entityStrategy().spacePosition(cat, dict);
            glsl += this.entityStrategy().vertexShaderAppendix(cat, dict);
/*
            glsl += "vec4 spacePosition = vec4(" +
                dict.vertexName('x', cat) + '+theta/100.0' + ', ' + 
                dict.vertexName('y', cat) + ', ' + 
                dict.vertexName('z', cat) + ", 1.0);\n";

            glsl += this.entityStrategy().displace('spacePosition');
*/

            glsl += "gl_Position = " + dict.pMatrixName() + "*" + dict.mvMatrixName() + " * spacePosition;\n";


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
            var glsl = '#ifdef GL_ES\n';
            glsl += 'precision mediump float;\n'
            glsl += '#endif\n';
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

