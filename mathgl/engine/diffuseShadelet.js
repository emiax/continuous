define(function (require) {

    var q = require('quack');
    var Shadelet = require('./shadelet');
    var exports = require('./exports');

    return exports.DiffuseShadelet = q.createClass(Shadelet, {
        /**
         * Not implemented yet!
         */
        format: function () {
            var node = this.node();
            var background = node.background();
            var glsl = "";
            var nodeName = this.nodeName();

            if (background) {
                glsl += 'vec4 bg = ' + this.nodeName(node.background()) + ';\n';
                
                glsl += nodeName + " = bg;\n";
                glsl += "vec4 transformedNormal = mvMatrix * vec4(spaceNormal, 1.0);\n";
                glsl += "float multiplier;\n";

                glsl += 'if (gl_FrontFacing) {\n'
                glsl += 'multiplier = 1.0;\n';
                glsl += '} else {';
                glsl += 'multiplier = -1.0;\n';
                glsl += '}\n';

                glsl += 'vec3 lightDirection = normalize(vec3(1.0, 0.0, 1.0));';
                
                glsl += nodeName + ".xyz *= 0.7 + 0.7*clamp(dot(spaceNormal.xyz * multiplier, lightDirection), 0.0, 1.0);\n";
            } else {
                glsl += nodeName + " = vec4(1.0);\n";
            }
            return glsl;
        }
    });
});
