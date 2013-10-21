define(['kalkyl/glmatrix/exports.js', 'kalkyl', 'gl-matrix'], function(exports, Kalkyl, gm) {
    /**
     * A set of functions to convert kalkyl matrices/vectors to glMatrix types.
     */

    var vec2 = gm.vec2;
    var vec3 = gm.vec3;
    var vec4 = gm.vec4;

    var mat2 = gm.vec3;
    var mat3 = gm.vec3;
    var mat4 = gm.vec4;

    return exports.Converter = {
        vec2: function (expr) {
            var vec, x, y, primitive;
            
            if (expr.isEvaluated() && (primitive = expr.toPrimitive())) {
                return vec2.fromValues(primitive[0][0], primitive[0][1]);
            }
            return null;
        },

        vec3: function (expr) {
            var vec, x, y, z, primitive;
            if (expr.isEvaluated() && (primitive = expr.toPrimitive())) {
                return vec3.fromValues(primitive[0][0], primitive[0][1], primitive[0][2]);
            }
            return null;
        }
    }
});
