define(function (require) {

    var q = require('quack');
    var Shadelet = require('./shadelet');
    var exports = require('./exports');

    return exports.GradientShadelet = q.createClass(Shadelet, {
        
        format: function () {
            var glsl = "";

            var node = this.node();
            var background = node.background();

            if (background) {
                glsl += 'vec4 bg = ' + this.nodeName(background) + ';\n';
            } else {
                glsl += 'vec4 bg = vec4(0.0, 0.0, 0.0, 0.0);\n';
            }
            
            var stops = node.stops();
            var keys = Object.keys(stops).sort(function(a,b){return a-b});
            var parameter = this.symbolName(node.parameter());
            var nKeys = keys.length;
            
            if (nKeys > 0) {
                glsl += "vec4 color = " + this.nodeName(stops[keys[0]]) + ";\n";
                
                for (var i = 1; i < nKeys; i++) {
                    var lowerKey = this.formatFloat(keys[i - 1]);
                    var distance = this.formatFloat(keys[i] - keys[i - 1]);
                    glsl += "color = mix(color, " + this.nodeName(stops[keys[i]]) + ", " +
                        "clamp((" + parameter + " - " + lowerKey + ")/" + distance + ", 0.0, 1.0));\n";
                }
                glsl += this.nodeName() + " = " + this.normalBlend('color', 'bg') + ";\n";
            }
            
            return glsl;
        }
    });
});
