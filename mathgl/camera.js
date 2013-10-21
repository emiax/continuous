define(['quack', 'gl-matrix', 'kalkyl', 'kalkyl/glmatrix', 'mathgl/scope.js', 'mathgl/exports.js'], function (q, gm, Kalkyl, GLMatrix, Scope, MathGL) {
    /**
     * Until vectors and matrices are fully supprted by Kalkyl:
     * x, y, z determine position
     * a, b, c determine focus point (global coordinates)
     * u, v, w determine vector pointing upwards. (if undefined u = 0, v = 0, w = 1)
     */

    
    return MathGL.Camera = q.createClass(Scope, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            spec = spec || {};
            Scope.constructor.call(this, spec);
        },
        
        
        
        matrix: function () {
            var position = this.positionExpr(); 
            var subject = this.subjectExpr();
            var up = this.upExpr();

            var mat4 = gm.mat4, vec3 = gm.vec3;

            var converter = GLMatrix.Converter;
            
            
            var p = converter.vec3(position);
            var s = converter.vec3(subject);
            var u = converter.vec3(up);

            var mat = mat4.create();
            var mv = mat4.create();
            var ortho = mat4.create();

            mat4.lookAt(mv, p, s, u);

//            mat4.ortho(ortho, -4, 4, -4, 4, -4, 4);
            mat4.perspective(ortho, 1, 16/9, 0.1, 10);

            mat4.multiply(mat, ortho, mv);

            return mat;
        },


        positionExpr: function () {
//            var start = new Date();
            var p = this.flat('position').evaluated()
//            var end = new Date();
//            console.log(end - start);
            return p;
        }, 


        subjectExpr: function () {
            return this.flat('subject').evaluated();
        }, 

        upExpr: function () {
            return this.flat('up').evaluated();
        }, 


    });
});
