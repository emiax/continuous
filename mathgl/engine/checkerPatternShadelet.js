define(['quack', 'mathgl/engine/shadelet.js', 'mathgl/engine/exports.js'], function (q, Shadelet, Engine) {

    return Engine.CheckerPatternShadelet = q.createClass(Shadelet, {

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
                glsl += "+ floor(mod(" + scope.symbolName(parameter) + "/" + scope.formatFloat(stepSize) + ", 2.0))";
            });

            glsl += ", 2.0)));\n";

            glsl += this.nodeName(node) + " = " + scope.normalBlend('bg', 'color') + ";\n";
            return glsl;
        },
    })
});
