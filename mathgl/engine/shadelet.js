define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.Shadelet = q.createAbstractClass({
        /**
         * Constructor
         */
        constructor: function (formatter, node) {
            this._formatter = formatter;
            this._node = node;
        },


        formatter: function () {
            return this._formatter;
        },


        /**
         * Return the appearance node that is the origin of this shadelet.
         */
        node: function () {
            return this._node;
        },



        /**
         * Return glsl identifier of node.
         * If no node is specified, then get name of this node.
         */
        nodeName: function (node) {
            node = node || this.node();
            return 'node' + node.id() + '';
        }, 


        symbolName: function (symbol) {
            console.log(this.formatter());
            var cat = this.formatter().symbolCategorization();
            var dict = this.formatter().shaderSymbolDictionary();
            console.log(dict.fragmentName(symbol, cat));
            return dict.fragmentName(symbol, cat);
        },


        formatFloat: function (f) {
            var f = f + "";
            if (f.indexOf('.') === -1) {
                f += '.0';
            }
            return f;
        },


        /**
         * Return glsl code that blends a over b, normal blend mode. a and b are strings (glsl references)
         *
         * color = front.rgb + back.rgb*(1.0 - front.a)*back.a
         * alpha = front.a + back.a*(1.0 - front.a)
         *
         */
        normalBlend: function (a, b) {
            return 'vec4(' + a + '.rgb + ' + b + '.rgb*(1.0 - ' + a + '.a)* ' + b + '.a , '
                + a + '.a + ' + b + '.a*(1.0 - ' + a + '.a))';
        },


        format: new q.AbstractMethod()

    });
});
