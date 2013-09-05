define(['quack', 'gl-matrix', 'kalkyl', 'mathgl/scope.js', 'mathgl/exports.js'], function (q, gm, Kalkyl, Scope, MathGL) {
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
            var x = this.xExpr().evaluated().value();
            var y = this.yExpr().evaluated().value();
            var z = this.zExpr().evaluated().value();

            var a = this.aExpr().evaluated().value();
            var b = this.bExpr().evaluated().value();
            var c = this.cExpr().evaluated().value();

            var u = this.uExpr().evaluated().value();
            var v = this.vExpr().evaluated().value();
            var w = this.wExpr().evaluated().value();
            
            var mat4 = gm.mat4, vec3 = gm.vec3;

            var mat = mat4.create();
            mat4.lookAt(mat,
                        vec3.fromValues(x, y, z),
                        vec3.fromValues(a, b, c),
                        vec3.fromValues(u, v, w));
            return mat;
        },


        xExpr: function () {
            return this.flat('x');
        },

        
        yExpr: function () {
            return this.flat('y');
        },


        zExpr: function () {
            return this.flat('z');
        },


        aExpr: function () {
            return this.flat('a');
        },


        bExpr: function () {
            return this.flat('b');
        },


        cExpr: function () {
            return this.flat('c');
        },

        
        uExpr: function () {
            return this.flat('u') || new Kalkyl.Number(0);
        },


        vExpr: function () {
            return this.flat('v') || new Kalkyl.Number(0);
        },


        wExpr: function () {
            return this.flat('w') || new Kalkyl.Number(1);
        }
        
    });
});
