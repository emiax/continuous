define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js', 'mathgl/engine/renderable.js'], function(q, Kalkyl, MathGL, Engine, Renderable) {
    return Engine.RenderableSurface = q.createClass(Renderable, {
        /**
         * Constructor.
         */
        constructor: function (gl, scope) {
            this._scope = scope;
            this._gl = gl;
            this._uBuffer = null;
            this._vBuffer = null;
            this._uLocation = null;
            this._vLocation = null;

            this._uniformLocations = null;

            this._r = 0;
        },


        surface: function () {
            return this._scope;
        },


        /**
         * Initialize.
         */
        initialize: function () {
            console.log("Initializing " + this.scope().id());
            this.initializeParameterBuffer();

            this._shaderProgram = this.generateShaderProgram();//programGenerator.generate();
            this._shaderProgram.link();

            var cat = this.symbolCategorization();
            var dict = new Engine.ShaderSymbolDictionary();

            var attributes = cat.attributes();

            var symbol
            var scope = this;

            var s, ref;
            if (attributes.length === 2) {
                s = attributes[0];
                ref = dict.attributeName(s);
                scope._uLocation = scope._shaderProgram.attributeLocation(ref);

                s = attributes[1];
                ref = dict.attributeName(s);
                scope._vLocation = scope._shaderProgram.attributeLocation(ref);
            } else {
                console.log("should not have more than 2 attribs.");
            }

            var uniforms = cat.uniforms();
            this._uniformLocations = {};
            uniforms.forEach(function (s) {
                ref = dict.uniformName(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            ref = dict.mvpMatrixName();
            this._mvpMatrixLocation = scope._shaderProgram.uniformLocation(ref)

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
         * ParameterSymbols. (set of symbols)
         */
        parameterSymbols: function () {
            var set = {};
            this.surface().parameters().forEach(function (s) {
                set[s] = true;
            });
            return set;
        },


        symbolCategorization: function () {
            if (this._symbolCategorization == undefined) {
                this._symbolCategorization = new Engine.SymbolCategorization(this.vertexShaderSinks(),            
                                                                         this.fragmentShaderSinks(),
                                                                         this.parameterSymbols(),
                                                                         this.expressions());
            } 
            return this._symbolCategorization;
        },


        expressions: function () {
            return this.surface().getAll();
        },

        
        appearance: function () {
            return this.surface().appearance();
        },

        /**
         * Generate shader program.
         */
        generateShaderProgram: function () {
            var gl = this.gl();

          
            var vertexShaderFormatter = new Engine.VertexShaderFormatter(this.expressions(),
                                                                      this.symbolCategorization());

            var fragmentShaderFormatter = new Engine.FragmentShaderFormatter(this.expressions(),
                                                                             this.symbolCategorization(),
                                                                             this.appearance());

            var vertexShaderGLSL = vertexShaderFormatter.format();
            console.log(vertexShaderGLSL);
            var fragmentShaderGLSL = fragmentShaderFormatter.format()
            console.log(fragmentShaderGLSL);

            var vs = new Engine.VertexShader(gl, vertexShaderGLSL);
            var fs = new Engine.FragmentShader(gl, fragmentShaderGLSL);

            return new Engine.ShaderProgram(vs, fs);
        },


        /**
         * Destroy.
         */
        destroy: function () {
            // TODO: deallocating
        },


        /**
         * Refresh.
         */
        refresh: function (spec) {
            /*            var refreshUniforms = {};
                          var refreshAttributes = {};
                          var refreshVertexShader = false;
                          var refreshFragmentShader = false;

                          console.log(spec);
                          spec = spec || {};
                          var expressions = spec.expressions || {};


                          if (spec.appearance) {

                          }*/
        },



        initializeParameterBuffer: function () {
            var gl = this.gl();

            var surface = this.scope();

            var parameters = surface.parameters();
            var domain = surface.domain();
            var u = parameters[0], v = parameters[1];
            var uDomain = domain[u];
            var vDomain = domain[v];

            var tessellation = new Engine.PlaneTessellation(uDomain, vDomain, 50);
            var uData = tessellation.uArray();
            var vData = tessellation.vArray();

            // var vertexData = tessellation.vertexArray();
            var triangleData = tessellation.triangleArray();


            var uBuffer = this._uBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, uData, gl.STATIC_DRAW);

            var vBuffer = this._vBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vData, gl.STATIC_DRAW);

            var triangleBuffer = this._triangleBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);

            this._triangleCount = triangleData.length;
        },


        /**
         * Render.
         */
        render: function (camera) {
            var gl = this.gl();
            //            this.bindParameterBuffer();
            this.useProgram();

            /*
              Object.keys(this._parameterLocations).forEach(function (s) {
              gl.bindBuffer(gl.ARRAY_BUFFER, this._attributeBuffer[s]);
              gl.enableVertexAttribArray(this._parameterLocations[s]);
              gl.vertexAttribPointer(this._parameterLocations[s], 1, gl.FLOAT, false, 0, 0);
              });
            */
            gl.bindBuffer(gl.ARRAY_BUFFER, this._uBuffer);
            gl.enableVertexAttribArray(this._uLocation);
            gl.vertexAttribPointer(this._uLocation, 1, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vBuffer);
            gl.enableVertexAttribArray(this._vLocation);
            gl.vertexAttribPointer(this._vLocation, 1, gl.FLOAT, false, 0, 0);


            var scope = this;
            var surface = this.surface();

            Object.keys(this._uniformLocations).forEach(function (s) {

                var location = scope._uniformLocations[s];
                var value = surface.flat(s).evaluated().value();
                
                gl.uniform1f(location, value);
            });

            var location = this._mvpMatrixLocation;

            var e = new Float32Array(16);

            e = camera.matrix();
            gl.uniformMatrix4fv(location, false, e);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.drawElements(gl.TRIANGLES, this._triangleCount, gl.UNSIGNED_SHORT, 0);
            //todo!

        }

    });
});
