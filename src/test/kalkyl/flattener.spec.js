define(['kalkyl', 'kalkyl/format/simple'], function(Kalkyl, SimpleFormat) {
    return function() {

        describe("Flattener", function() {

            var p = new SimpleFormat.Parser();
            var flattener = new Kalkyl.Flattener();

            it("should be able to flatten expressions", function () {
                var expressions = {};
                expressions.a = p.parse('b + d');
                expressions.b = p.parse('c * 2');
                expressions.c = p.parse('3');
                expressions.d = p.parse('c/2');
                
                flattener.map(expressions);
                expect(flattener.flatten(p.parse('a + b + c + d')).evaluated().identicalTo(p.parse('15')));
            });

        });
    };
});
