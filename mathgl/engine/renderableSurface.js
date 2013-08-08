define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js', 'mathgl/engine/renderable.js'], function(q, Kalkyl, MathGL, Engine, Renderable) {
    return Engine.RenderableSurface = q.createClass(Renderable, {
        /**
          * Constructor.
          */
        constructor: function (gl, scope) {
            this._scope = scope;
            this._gl = gl;
            this._parameterBuffer = null;

            
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
            this._parameterLocation = this._shaderProgram.attributeLocation("aParameters");
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
            
            console.log(uDomain);
            console.log(vDomain);

            var tessellation = new Engine.PlaneTessellation(uDomain, vDomain, 20);
            var vertexData = tessellation.vertexArray();
            var triangleData = tessellation.triangleArray();
            
            console.log(vertexData);
            console.log(triangleData);

            var vertexBuffer = this._vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

            var triangleBuffer = this._triangleBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);
            
            
            this._triangleCount = triangleData.length;

            
        },



        bindParameterBuffer: function () {
            var gl = this.gl();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._parameterBuffer);
            
        },


        /**
         * Render.
         */
        render: function () {
            var gl = this.gl();
            this.bindParameterBuffer();
            this.useProgram();

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.enableVertexAttribArray(this._parameterLocation);

            gl.vertexAttribPointer(this._parameterLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawElements(gl.TRIANGLES, this._triangleCount, gl.UNSIGNED_SHORT, 0);


            //todo!
        }
        
    });
});
