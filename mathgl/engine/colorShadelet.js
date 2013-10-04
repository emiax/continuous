define(['quack', 'mathgl/engine/shadelet.js', 'mathgl/engine/exports.js'], function (q, Shadelet, Engine) {

    return Engine.ColorShadelet = q.createClass(Shadelet, {
        
        format: function () {
            var node = this.node();
            var f = node.floatVector();

            var a = this.formatFloat(f.a);
            var r = this.formatFloat(f.r);
            var g = this.formatFloat(f.g);
            var b = this.formatFloat(f.b);

            var background = node.background();
            var glsl = "";

            if (background) {
                glsl += 'vec4 bg = ' + this.nodeName(node.background()) + ';\n';
                glsl += "vec4 color = vec4(" + r + ", " + g + " , " + b + ", " +  a + ");\n"
                glsl += this.nodeName() + " = " + this.normalBlend('color', 'bg') + ";\n";
            } else {
                glsl += this.nodeName() + " = vec4(" + r + ", " + g + " , " + b + ", " +  a + ");\n";
            }
            return glsl;
        }
    });
});
