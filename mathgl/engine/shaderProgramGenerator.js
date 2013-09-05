define(['quack', 'kalkyl', 'kalkyl/format/glsl', 'mathgl', 'mathgl/engine/exports.js'], function(q, Kalkyl, GLSL, MathGL, Engine) {

    /**
     * Attributes are composed from:
     *   Parameters.
     * Uniforms are composed from:
     *   CPU-evaluated 'uniform expressions'.
     * Varyings are composed from:
     *   GLSL-formatted 'varying expressions' that are evaluated on the GPU.
     */

    return Engine.ShaderProgramGenerator = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (gl, entity) {
            this._gl = gl;
            this._entity = entity;

            this._uniforms = null;
            this._attributes = null;
            this._varyings = null;
            this._vertexShaderDefinitions = null;
            this._fragmentShaderDefinitions = null;

            this._glslFormatter = null;
            this._dependencyGraph = null;
        },


        /**
         * Return gl machine.
         */
        gl: function () {
            return this._gl;
        },


        /**
         * Dependency graph containing expressions defined on entity.
         * Parameters are NOT defined in the graph, but may be referred to.
         * This means that graph MAY HAVE undefined expressions.
         */
        dependencyGraph: function () {
            if (this._dependencyGraph === null) {
                this._dependencyGraph = new Kalkyl.DependencyGraph(this.expressions());
            }
            return this._dependencyGraph;
        },


        /**
         * Return the set of symbols required by the vertex shader. Shallow.
         */
        vertexShaderSinks: function () {
            return {
                x: true,
                y: true,
                z: true
            };
        },


        /**
         * Return the set of symbols required by the fragment shader. Shallow.
         */
        fragmentShaderSinks: function () {
            var a = this.appearance();
            var symbols = {};
            if (a) {
                a.traverse(function (node) {
                    var newSymbols = node.symbols();
                    Object.keys(newSymbols).forEach(function (k) {
                        symbols[k] = true;
                    });
                });
            }
            return symbols;
        },


        /**
         * Find out where to define all the variables required by the vertex and fragment shader.
         */
        categorizeSymbols: function () {
            var graph = this.dependencyGraph();

            var vertexSinks = Object.keys(this.vertexShaderSinks());
            var fragmentSinks = Object.keys(this.fragmentShaderSinks());

            var parameters = this.parameterSymbols();
            var independents = this.independentSymbols();

            var vertexSymbols = graph.orderedSubset(vertexSinks);
            var fragmentSymbols = graph.orderedSubset(fragmentSinks);

            var uniforms = {};            
            var attributes = [];
            var varyings = [];
            var vertexShaderDefinitions = [];
            var fragmentShaderDefinitions = [];

            vertexSymbols.forEach(function (s) {
                if (parameters[s]) {
                    attributes.push(s);
                } else if (independents[s]) {
                    uniforms[s] = true;
                } else {
                    vertexShaderDefinitions.push(s);
                }
            });

            fragmentSymbols.forEach(function (s) {
                if (parameters[s]) {
                    varyings.push(s);
                } else if (independents[s]) {
                    uniforms[s] = true;
                } else {
                    fragmentShaderDefinitions.push(s);
                }
            });

            this._uniforms = Object.keys(uniforms);
            this._attributes = attributes;
            this._varyings = varyings;
            this._vertexShaderDefinitions = vertexShaderDefinitions;
            this._fragmentShaderDefinitions = fragmentShaderDefinitions;
        },


        /**
         * Return all the expressions defined for the entity.
         */
        expressions: function () {
            return this.entity().getAll();
        },


        /**
         * ParameterSymbols. (set of symbols)
         */
        parameterSymbols: function () {
            var set = {};
            this.entity().parameters().forEach(function (s) {
                set[s] = true;
            });
            return set;
        },


        /**
         * Return a set of all parameter independent symbols available in scope.
         */
        independentSymbols: function () {
            var graph = this.dependencyGraph();
            var expressions = this.expressions();
            var parameters = Object.keys(this.parameterSymbols());

            var independentSymbols = {};
            Object.keys(expressions).forEach(function (symbol) {
                if (!graph.dependsOnAny(symbol, parameters)) {
                    independentSymbols[symbol] = true;
                }
            });
            return independentSymbols;
        },


        /**
         * Generate shader program.
         */
        generate: function () {
            var gl = this.gl();
            var vs = this.vertexShader(gl);
            var fs = this.fragmentShader(gl);

            return new Engine.ShaderProgram(vs, fs);
        },


        /**
         * Return all uniform symbols
         */
        uniforms: function () {
            if (!this._uniforms) {
                this.categorizeSymbols();
            }
            return this._uniforms;
        },
        
        
        /**
         * Return true if symbol is defined as a uniform.
         */
        uniform: function (symbol) {
            return this.uniforms().indexOf(symbol) !== -1;
        },

        
        /**
         * Return the name of the symbol referenced as a uniform.
         */
        uniformReference: function (symbol) {
            return 'u_' + symbol;
        },


        /**
         * Return all uniform symbols
         */
        attributes: function () {
            if (!this._attributes) {
                this.categorizeSymbols();
            }
            return this._attributes;
        },
        
        
        /**
         * Return true if symbol is defined as a attribute.
          */
        attribute: function (symbol) {
            return this.attributes().indexOf(symbol) !== -1;
        },

        
        /**
         * Return the name of the symbol referenced as an attribute.
         */
        attributeReference: function (symbol) {
            return 'a_' + symbol;
        },


        /**
         * Return all uniform symbols
         */
        varyings: function () {
            if (!this._varyings) {
                this.categorizeSymbols();
            }
            return this._varyings;
        },


        /**
         * Return true if symbol is defined as a varying.
         */
        varying: function (symbol) {
            return this.varyings().indexOf(symbol) !== -1;
        },

        
        /**
         * Return the name of the symbol referenced as a varying.
         */
        varyingReference: function (symbol) {
            return 'v_' + symbol;
        },


        /**
         * Return all uniform symbols
         */
        vertexShaderDefinitions: function () {
            if (!this._vertexShaderDefinitions) {
                this.categorizeSymbols();
            }
            return this._vertexShaderDefinitions;
        },


        /**
         * Return true if symbol is defined as a vertex shader definition.
         */
        vertexShaderDefinition: function (symbol) {
            return this.vertexShaderDefinitions().indexOf(symbol) !== -1;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        vertexShaderReference: function (symbol) {
            return 'vs_' + symbol;
        },

        
        /**
         * Return all uniform symbols
         */
        fragmentShaderDefinitions: function () {
            if (!this._fragmentShaderDefinitions) {
                this.categorizeSymbols();
            }
            return this._fragmentShaderDefinitions;
        },


        /**
         * Return true if symbol is defined as a fragment shader definition.
         */
        fragmentShaderDefinition: function (symbol) {
            return this.fragmentShaderDefinitions().indexOf(symbol) !== -1;
        },


        /**
         * Return the name of the symbol referenced as if defined in vertex shader.
         */
        fragmentShaderReference: function (symbol) {
            return 'fs_' + symbol;
        },


        /**
         * Get the shader variable name of a symbol. context may be 'vertex' or 'fragment'
         */
        reference: function (symbol, context) {
            if (this.uniform(symbol))
                return this.uniformReference(symbol);
            if (context === 'vertex') {
                if (this.attribute(symbol)) {
                    return this.attributeReference(symbol);
                } else if (this.vertexShaderDefinition(symbol)) {
                    return this.vertexShaderReference(symbol);
                }
                console.error("Symbol is not defined.");
            } else if (context === 'fragment') {
                if (this.varying(symbol))
                    return this.varyingReferene(symbol);
                if (this.fragmentShaderDefinition(symbol))
                    return this.fragmentShaderReference(symbol);
                console.error("Symbol is not defined.");
            }
            console.error("Invalid context.");
            return '0';
        },

        
        /**
         * Get my glsl formatter! Context may be 'vertex' or 'fragment'
         */
        glslFormatter: function (context) {
            if (!this._glslFormatter) {
                this._glslFormatter = new GLSL.Formatter();
            }
            var glslFormatter = this._glslFormatter;
            
            var scope = this;
            var table = {};

            this.uniforms().forEach(function (s) {
                table[s] = scope.uniformReference(s);
            });
            
            if (context === 'vertex') {
                this.attributes().forEach(function (s) {
                    table[s] = scope.attributeReference(s);
                });
                this.vertexShaderDefinitions().forEach(function (s) {
                    table[s] = scope.vertexShaderReference(s);
                });
            } else if (context === 'fragment') {
                this.varying().forEach(function (s) {
                    table[s] = scope.varyingReference(s);
                });
                this.fragmentShaderDefinitions().forEach(function (s) {
                    table[s] = scope.fragmentShaderReference(s);
                });
            } else {
                console.error("invalid context.");
            }      
            glslFormatter.translationTable(table);

            return glslFormatter;
        },


        mvpMatrixReference: function () {
            return 'mvpMatrix';
        },

        /**
         * Generate vertex shader
         */
        vertexShader: function () {
            var scope = this;
            var glsl = "";

            this.uniforms().forEach(function (s) {
                glsl += 'uniform float ' + scope.uniformReference(s) + ';\n';
            });

            this.attributes().forEach(function (s) {
                glsl += 'attribute float ' + scope.attributeReference(s) + ";\n";
            });

            this.varyings().forEach(function (s) {
                glsl += 'varying float ' + scope.varyingReference(s) + ";\n";
            });


            glsl += 'uniform mat4 mvpMatrix;\n'

            glsl += "void main() {\n";

            var formatter = this.glslFormatter('vertex');
            this.vertexShaderDefinitions().forEach(function (s) {
                var expr = scope.expressions()[s];
                glsl += "float " + scope.vertexShaderReference(s) + " = " + formatter.format(expr) + ';\n';
            });

            glsl += "vec4 spacePosition = vec4(" +
                scope.reference('x', 'vertex') + ', ' + 
                scope.reference('y', 'vertex') + ', ' + 
                scope.reference('z', 'vertex') + ", 1.0);\n";


            glsl += "gl_Position = " + this.mvpMatrixReference() + " * spacePosition;\n";

            // PROJECTION BESTORP STYLE:
//            glsl += "gl_Position.z = 1.0;\n";

            this.varyings().forEach(function (s) {
                var attr = scope.attributeReference(s);
                if (attr) {
                    glsl += scope.varyingReference(s) + " = " + attr + ";\n";
                }
            });

            glsl += "}\n";

            console.log(glsl);

            return new Engine.VertexShader(this.gl(), glsl);
        },


        nodeReference: function (node) {
            return 'node' + node.id() + '()';
        },


        appearanceNodes: function () {
            var nodes = {};
            this.entity().appearance().traverse(function (node) {
                var id = node.id();
                nodes[id] = node;
            });
            return nodes;
        },


        formatFloat: function (f) {
            var f = f + "";
            if (f.indexOf('.') === -1) {
                f += '.0';
            }
            return f;
        },


        /**
         * Return glsl code that blends a over b, normal blend mode. a and b are strings (glsl references)
         */
        normalBlend: function (a, b) {
            return 'vec4(' + a + '.rgb + ' + b + '.rgb*(1.0 - ' + a + '.a), '
                + a + '.a + ' + b + '.a*(1.0 - ' + a + '.a))';
        },


        /**
         * Generate fragment shader.
         */
        fragmentShader: function () {

            var glsl = 'precision mediump float;\n'; 
            var scope = this;
            
            this.uniforms().forEach(function (s) {
                glsl += 'uniform float ' + scope.uniformReference(s) + ';\n';
            });

            this.varyings().forEach(function (s) {
                glsl += 'varying float ' + scope.varyingReference(s) + ";\n";
            });
            
            var nodes = this.appearanceNodes();
            Object.keys(nodes).forEach(function (id) {
                var node = nodes[id];
                glsl += "vec4 " + scope.nodeReference(node) + ";\n"
            });
            
            Object.keys(nodes).forEach(function (id) {
                var node = nodes[id];
                if (node instanceof MathGL.Color) {
                    glsl += 'vec4 ' + scope.nodeReference(node) + ' {\n';
                    
                    var f = node.floatVector();
                    var a = scope.formatFloat(f.a);
                    var r = scope.formatFloat(f.r);
                    var g = scope.formatFloat(f.g);
                    var b = scope.formatFloat(f.b);
                    var background = node.background();
                    if (background) {
                        glsl += 'vec4 bg = ' + scope.nodeReference(node.background()) + ';\n';
                        glsl += "vec4 color = vec4(" + r + ", " + g + " , " + b + ", " +  a + ");\n"
                        glsl += "return " + scope.normalBlend('color', 'bg') + ";\n";
                    } else {
                        glsl += "return vec4(" + r + ", " + g + " , " + b + ", " +  a + ");\n";
                    }
                    glsl += "}\n"
                } else if (node instanceof MathGL.Gradient) {
                    glsl += 'vec4 ' + scope.nodeReference(node) + ' {\n';
                    glsl += 'vec4 bg = ' + scope.nodeReference(node.background()) + ';\n';
                    
                    var stops = node.stops();
                    var keys = Object.keys(stops).sort();
                    var parameter = node.parameter();

                    keys.forEach(function (key, i) {
                        glsl += 'vec4 color' + i + ' = ' + scope.nodeReference(stops[key]) + ';\n';
                    });
                    
                    glsl += 'vec4 color = color0;\n'
                    
                    keys.forEach(function (key, i) {
                        if (i === 0) return;
                        var a = stops[i - 1];
                        var b = stops[i];
                        console.log(scope.reference(parameter, 'fragment'));
                        console.log("woot");
                        
//                        glsl += "color = mix(color, color" + i + ", " + 
                    });

                    glsl += "return " + scope.normalBlend('color', 'bg') + ";\n";
                    glsl += "}\n"                        
                } else {
                    console.log("unsupported node");
                }
            });

//            console.log(this.entity().appearance());


            glsl += [
                'void main() {',
                '   gl_FragColor = node' + this.entity().appearance().id() + '();\n',
//                '   gl_FragColor = vec4(v_u, v_v, 0.0. 1.0);\n',
                '}'].join('\n');


            console.log(glsl);
            return new Engine.FragmentShader(this.gl(), glsl);
        },



        /**
         * Get Entity
         */
        entity: function () {
            return this._entity;
        },


        /**
         * Get appearance
         */
        appearance: function () {
            return this.entity().appearance();
        },


        /**
         * Return an array of the symbols whose expressions are inside the shader as code,
         * If any of these expressions changes, the shader will need to be recompiled.
         */
        expressionsInProgram: function () {

        }



    });
});


