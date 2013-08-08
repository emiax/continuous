define(['kalkyl', 'kalkyl/format/simple'], function(Kalkyl, SimpleFormat) {
    return function() {

        describe("Dependency Graph", function() {

            var p = new SimpleFormat.Parser();
            var graph = new Kalkyl.DependencyGraph();


            it("can sort expressions", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3 + a');
                expressions.c = p.parse('a + b + e');
                expressions.d = p.parse('b + c + e');
                expressions.e = p.parse('4 + b');
                
                graph.expressions(expressions);

                expect(graph.order()).toEqual(['a', 'b', 'e', 'c', 'd']);
                expect(graph.isComplete()).toBe(true);
            });


            it("returns null if there is a circular dependency", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3');
                expressions.c = p.parse('a + d');
                expressions.d = p.parse('c');

                graph.expressions(expressions);
                expect(graph.order()).toBe(null);
                expect(graph.isComplete()).toBe(true);
            });


            it("can sort expressions, even if some of them refers to variables that are not defined internaly", function () {
                // Variables should still be included in topological order.
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('3');
                expressions.d = p.parse('a + c');

                graph.expressions(expressions);
                expect(graph.order()).toEqual(['a', 'b', 'c', 'd']);
                expect(graph.isComplete()).toBe(false);
                expect(graph.undefinedExpressions()).toEqual({'c': true});
                
            });

            
            it("can fetch a toplogically ordered subset with independent branches", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.aDep = p.parse('a');

                expressions.b = p.parse('2');
                expressions.bDep = p.parse('b');
                
                graph.expressions(expressions);

                expect(graph.orderedSubset('aDep')).toEqual(['a', 'aDep']);
                expect(graph.orderedSubset('bDep')).toEqual(['b', 'bDep']);
                expect(graph.orderedSubset('aDep', 'a')).toEqual(['aDep']);
                expect(graph.orderedSubset(['aDep', 'bDep'])).toEqual(['a', 'aDep', 'b', 'bDep']);
            });


            it("can fetch a toplogically ordered subsets from more complex dependency graphs", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('a');
                expressions.c = p.parse('b + a');
                expressions.d = p.parse('a + b');
                expressions.e = p.parse('c + d');
                
                graph.expressions(expressions);
                
                expect(graph.orderedSubset('b')).toEqual(['a', 'b']);
                expect(graph.orderedSubset('c')).toEqual(['a', 'b', 'c']);
                expect(graph.orderedSubset('d')).toEqual(['a', 'b', 'd']);
                expect(graph.orderedSubset('e')).toEqual(['a', 'b', 'c', 'd', 'e']);
                
                expect(graph.orderedSubset(['b', 'c'])).toEqual(['a', 'b', 'c']);
                expect(graph.orderedSubset(['b', 'c', 'd'])).toEqual(['a', 'b', 'c', 'd']);
                expect(graph.orderedSubset(['b', 'c', 'e'])).toEqual(['a', 'b', 'c', 'd', 'e']);
            });


            it("can fetch a toplogically ordered subsets terminating on sources.", function () {
                var expressions = {};
                expressions.a = p.parse('2');
                expressions.b = p.parse('a');
                expressions.c = p.parse('b + a');
                expressions.d = p.parse('a + b');
                expressions.e = p.parse('c + d');

                graph.expressions(expressions);
                
                expect(graph.orderedSubset(['b', 'c'], 'c')).toEqual(['a', 'b']);
                expect(graph.orderedSubset(['d', 'e'], 'a')).toEqual(['b', 'd', 'c', 'e']);
                expect(graph.orderedSubset(['d', 'e'], ['a', 'b'])).toEqual(['d', 'c', 'e']);
                expect(graph.orderedSubset(['d', 'e'], ['a', 'b', 'c'])).toEqual(['d', 'e']);
                expect(graph.orderedSubset('e', ['a', 'b', 'c'])).toEqual(['d', 'e']);

            });
            

            it("can return sources", function () {
                graph.expressions({
                    a: p.parse('4'),
                    b: p.parse('2 + a'),
                    c: p.parse('b'),
                    d: p.parse('9 + 6'),
                    e: p.parse('foo')
                });
                expect(graph.sources()).toEqual(['a', 'd'])
                expect(graph.undefinedExpressions()).toEqual({'f': true, 'o': true});
            });

            

        });
    };
});
