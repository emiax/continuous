define(['quack', 'kalkyl/format/glsl', 'mathgl/engine/shaderFormatter.js', 'mathgl', 'mathgl/engine/exports.js'], function(q, GLSL, ShaderFormatter, MathGL, Engine) {
    
    /**
     * Fragment shader formatter.
     */
    return Engine.FragmentShaderFormatter = q.createClass(ShaderFormatter, {
        /**
         * Constructor.
         */
        constructor: function (expressions, symbolCategorization, appearance) {
            this._expressions = expressions;
            this.symbolCategorization(symbolCategorization);
            this._glslFormatter = null;
            this._appearance = appearance;
        },


        /**
         * Appearance
         */
        appearance: function() {
            return this._appearance;
        },
        

        /**
         * Return glsl code for variable declarations outside main function.
         */
        declarations: function () {
            var glsl = "";
            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();


            glsl += this.entityStrategy().uniformDeclarations();
            glsl += this.entityStrategy().varyingDeclatations();
            
            
            cat.uniforms().forEach(function (s) {
                glsl += 'uniform float ' + dict.uniformName(s) + ";\n";
            });
            
            cat.varyings().forEach(function (s) {
                glsl += 'varying float ' + dict.varyingName(s) + ";\n";
            });
            
            glsl += 'uniform mat4 mvpMatrix;\n';
            
            return glsl;
        },
        

        /**
         * Return a new shadelet instance that corresponds to the AppearanceNode 'node'.
         */
        shadelet: function (node) {
            var scope = this;
            var shadelet = (function () {
                if (node instanceof MathGL.Color) return new Engine.ColorShadelet(scope, node);
                if (node instanceof MathGL.Gradient) return new Engine.GradientShadelet(scope, node);
                if (node instanceof MathGL.CheckerPattern) return new Engine.CheckerPatternShadelet(scope, node);
            })();
            
            if (shadelet) {
                return shadelet;
            } else {
                return null;
            }
        },


        /**
         * Return glsl code for main function.
         */
        mainFunction: function () {
            var formatter = this.glslFormatter();
            var cat = this.symbolCategorization();
            var dict = this.shaderSymbolDictionary();
            
            var scope = this;
            var glsl = "void main() {\n";
            var formatter = this.glslFormatter();

            cat.fragmentDefinitions().forEach(function (s) {
                var expr = scope.expressions()[s];
                console.log(s);
                glsl += "float " + dict.fragmentName(s, cat) + " = " + formatter.format(expr) + ";\n";
            });
            
            var sinkNode = this.appearance();
            var nodes = sinkNode ? sinkNode.bottomUp() : [];
            var shadelets = [];

            nodes.forEach(function (node) {
                var shadelet = scope.shadelet(node);
                if (shadelet) {
                    shadelets.push(shadelet);
                } else {
                    console.error("no appropriate shadelet available");
                }
            });

            shadelets.forEach(function (shadelet) {
                glsl += "vec4 " + shadelet.nodeName() + ";\n{\n";
                glsl += shadelet.format();
                glsl += "}\n";
            });
            
            var lastShadelet = shadelets[shadelets.length - 1];
            if (lastShadelet) { 
                glsl += "gl_FragColor = " + lastShadelet.nodeName() + ";\n";      
            } else {
                glsl += "gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);\n"        
            }

            glsl += "}\n"
            return glsl;
        },


        /**
         * Format shader.
         */        
        format: function () {
            var glsl = "precision mediump float;\n"; 
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
            var table = dict.fragmentTranslationTable(cat);
            formatter.translationTable(table);

            return formatter;
        }

    });
});

