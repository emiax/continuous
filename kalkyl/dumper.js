define(['quack', './exports.js', './expression.js'], function(q, KL, Expression) {
    KL.Dumper = q.createClass({

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
                dumper = new KL.Dumper();
            }
            dumper.dump(this, label);
        },
    });


    return KL.Dumper;
});

