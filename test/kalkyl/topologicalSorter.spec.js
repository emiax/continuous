define(['kalkyl', 'kalkyl/format/simple'], function(Kalkyl, SimpleFormat) {
    return function() {

        describe("Topological sorter", function() {

            var p = new SimpleFormat.Parser();
            var sorter = new Kalkyl.DependencyGraph();

            it("should be able to sort expressions", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3 + a');
                expressions.c = p.parse('a + b + e');
                expressions.d = p.parse('b + c + e');
                expressions.e = p.parse('4 + b');
                
                expect(sorter.order(expressions)).toEqual(['a', 'b', 'e', 'c', 'd']);
            });

            it("should return null if there is a circular dependency", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3');
                expressions.c = p.parse('a + d');
                expressions.d = p.parse('c');

                expect(sorter.order(expressions)).toBe(null);
            });


            it("should be able to sort expressions, even if some of them refers to variables that are not defined internaly", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3');
                expressions.c = p.parse('a + d');

                expect(sorter.order(expressions)).toEqual(['a', 'b', 'c']);
            });

            
            

        });
    };
});
