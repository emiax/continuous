define(function (require) {

    var q = require('quack');
    var gm = require('gl-matrix');
    var Kalkyl = require('kalkyl');
    var Fill = require('./fill');
    var GLMatrix = require('kalkyl/glmatrix');
    var exports = require('./exports');
    var Scope = require('./scope');

    return exports.Camera = q.createClass(Scope, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            spec = spec || {};
            Scope.constructor.call(this, spec);
        },
        
        
        /**
         * Get transformation matrix
         */
        matrix: function (renderer) {
            var mat = mat4.create();
            mat4.multiply(mat, this.pMatrix(renderer), this.mvMatrix());
            return mat;
        },

        
        mvMatrix: function () {
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
            
            mat4.lookAt(mv, p, s, u);
            return mv;
        },


        pMatrix: function (renderer) {
            var mat4 = gm.mat4;
            var p = mat4.create();
            var aspect = renderer.aspect();
            mat4.perspective(p, 1, aspect, 0.1, 100);
            return p;
        },
        
        /**
         * Get position expression
         */
        positionExpr: function () {
            var p = this.flat('position').evaluated()
            return p;
        }, 

        /**
         * Get subject expression
         */
        subjectExpr: function () {
            return this.flat('subject').evaluated();
        }, 


        /**
         * Get up expression
         */
        upExpr: function () {
            return this.flat('up').evaluated();
        }, 


    });
});
