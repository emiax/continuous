define(function (require) {
    var q = require('quack');
    var Expression = require('./expression');
    var exports = require('./exports');

    return exports.Dumper = q.createClass({
        /**
         * Dump expression.
         */
        dump: function (expr, label) {
            if (label) {
                console.log(label + " : " + expr.simpleFormat());
            } else {
                console.log(expr.simpleFormat());
            }
        }
    });

    
    q.patch(Expression, {
        dump: function(label, dumper) {
            if (!dumper) {
                dumper = new exports.Dumper();
            }
            dumper.dump(this, label);
        },
    });


    return Dumper;
});

