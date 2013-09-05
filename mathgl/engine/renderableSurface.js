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

            var programGenerator = new Engine.ShaderProgramGenerator(this.gl(), this.scope());
            this._shaderProgram = programGenerator.generate();
            this._shaderProgram.link();

            var attributes = programGenerator.attributes();
            var scope = this;

            var s, ref;
            if (attributes.length === 2) {
                s = attributes[0];
                ref = programGenerator.attributeReference(s);
                scope._uLocation = scope._shaderProgram.attributeLocation(ref);

                console.log(scope._uLocation);

                s = attributes[1];
                ref = programGenerator.attributeReference(s);
                scope._vLocation = scope._shaderProgram.attributeLocation(ref);
            } else {
                console.log("should not have more than 2 attribs.");
            }

            var uniforms = programGenerator.uniforms();
            this._uniformLocations = {};
            uniforms.forEach(function (s) {
                ref = programGenerator.uniformReference(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            ref = programGenerator.mvpMatrixReference();
            this._mvpMatrixLocation = scope._shaderProgram.uniformLocation(ref)

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
/*            var t = 0;
            var sin = Math.sin, cos = Math.cos;

            var eulerVector = {
                x: this._r*0.3,
                y: this._r+=0.01,
                z: this._r*0.8
            }

            var x = eulerVector.x, y = eulerVector.y, z = eulerVector.z;
            var cos = Math.cos, sin = Math.sin;

            var cx = cos(x), sx = sin(x),
            cy = cos(y), sy = sin(y),
            cz = cos(z), sz = sin(z);

            var cxcz = cx*cz, cxsz = cx*sz, sxcz = sx*cz, sxsz = sx*sz;

            e[0] = cy * cz;
            e[1] = cxsz + sxcz * sy;
            e[2] = sxsz - cxcz * sy;
            e[4] = 0;

            e[4] = - cy * sz;
            e[5] = cxcz - sxsz * sy;
            e[6] = sxcz + cxsz * sy;
            e[7] = 0;

            e[8] = sy;
            e[9] = - sx * cy;
            e[10] = cx * cy;
            e[11] = 0;

            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;*/

            e = camera.matrix();
//            console.log(e);

            gl.uniformMatrix4fv(location, false, e);



            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.drawElements(gl.TRIANGLES, this._triangleCount, gl.UNSIGNED_SHORT, 0);
            //todo!

        }

    });
});
