define(function (require) {

    var q = require('quack');
    var Shadelet = require('./shadelet');
    var exports = require('./exports');

    return exports.CheckerPatternShadelet = q.createClass(Shadelet, {

        format: function () {
            var glsl = "";
            var scope = this;
            var node = this.node();
            var background = node.background();
            if (background) {
                glsl += 'vec4 bg = ' + this.nodeName(background) + ';\n';
            } else {
                glsl += 'vec4 bg = vec4(0.0, 0.0, 0.0, 0.0);\n';
            }

            var inputA = node.inputA();
            var inputB = node.inputB();
            var parameters = node.parameters();


            var aName = inputA ? this.nodeName(inputA) : "vec4(0.0, 0.0, 0.0, 0.0);";
            var bName = inputB ? this.nodeName(inputB) : 'vec4(0.0, 0.0, 0.0, 0.0);';

            glsl += "vec4 color = mix(" + aName + ", " + bName + ", floor(mod(0.0 ";

            Object.keys(parameters).forEach(function (parameter) {
                var stepSize = parameters[parameter];
                glsl += "+ floor(mod(" + scope.symbolName(parameter) + "*" + scope.formatFloat(1/stepSize) + ", 2.0))";
            });

            glsl += ", 2.0)));\n";



            glsl += this.nodeName(node) + " = " + scope.normalBlend('bg', 'color') + ";\n";
//            glsl += this.nodeName(node) + " = vec4(dFdx(v_t), 1.0, 1.0, 1.0);\n";
            glsl += '#ifdef GL_OES_standard_derivatives\n';
            glsl += this.nodeName(node) + " = vec4(0.0, 0.0, 1.0, 1.0);\n";
            glsl += '#endif\n';

            return glsl;
        },
    })
});
