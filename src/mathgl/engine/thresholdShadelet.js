define(function (require) {

    var q = require('quack');
    var Shadelet = require('./shadelet');
    var exports = require('./exports');

    return exports.ThresholdShadelet = q.createClass(Shadelet, {
        /**
         * Format
         */
        format: function () {
            var glsl = "";

            var node = this.node();
            
            var parameter = this.symbolName(node.parameter());
            var value = node.value();
            if (typeof value === 'string') {
                value = this.symbolName(node.value());
            } else {
                value = this.formatFloat(node.value());
            }
            

            var below = node.below();
            if (below) {
                glsl += "vec4 below = " + this.nodeName(node.below()) + ";\n";
            } else {
                glsl += "vec4 below = vec4(0.0, 0.0, 0.0, 0.0);\n";
            }

            var above = node.above();
            if (above) {
                glsl += "vec4 above = " + this.nodeName(above) + ";\n";
            } else {
                glsl += "vec4 above = vec4(0.0, 0.0, 0.0, 0.0);\n";
            }

            glsl += this.nodeName() + " = mix(below, above, step(" + value + ", " + parameter + "));\n";
                    
            return glsl;
        }
    });
});
