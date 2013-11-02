define(['mathgl', 'kalkyl/format/simple'], function(MathGL, SimpleFormat) {
    return function() {

        describe("mathgl scope", function() {

            it("can be constructed", function () {
                var node = new MathGL.Scope();
            });


            it("can be constructed with variable definitions", function () {
                var node = new MathGL.Scope({
                    expressions: {
                        a: 1
                    }
                });
            });


            it("can set expressions using strings", function () {
                var node = new MathGL.Scope({
                    expressions: {
                        a: 1,
                        b: 0
                    }
                });
                node.expressions({
                    a: '3 + 6',
                    b: 'sin(y)'
                });

                var p = new SimpleFormat.Parser();
                var a = p.parse('3 + 6');
                var b = p.parse('sin(y)');

                expect(node.expression('a').identicalTo(a)).toBe(true);
                expect(node.expression('b').identicalTo(b)).toBe(true);
            });

            it("can set one variable using strings", function () {
                var node = new MathGL.Scope({
                    expressions: {
                        a: 1
                    }
                });
                var p = new SimpleFormat.Parser();
                
                node.expression('a', '100 / 3');
                var a = p.parse('100 / 3');

                expect(node.expression('a').identicalTo(a)).toBe(true);
            });

            
            it("can define expressions", function () {
                var node = new MathGL.Scope({});
                node.defineExpression('x', 3);
                var p = new SimpleFormat.Parser();
                expect(node.expression('x').identicalTo(p.parse(3))).toBe(true);
                
            });
            
            it("can set multiple expressions using kalkyl expressions", function () {
                var node = new MathGL.Scope({
                    expressions: {
                        a: 0,
                        b: 0
                    }
                });
                var p = new SimpleFormat.Parser();

                node.expressions({
                    a: p.parse('100 / 4'),
                    b: p.parse('sin(y)')
                });

                var a = p.parse('100 / 4');
                var c = p.parse('cos(x)');

                expect(node.expression('a').identicalTo(a)).toBe(true);
                expect(node.expression('b').identicalTo(c)).toBe(false);
            });


            it("can set one variable using kalkyl expressions", function () {
                var node = new MathGL.Scope({
                    expressions: {
                        a: 0,
                        b: 3
                    }
                });
                var p = new SimpleFormat.Parser();
                
                node.expression('a', p.parse('100 / 4'));
                var a = p.parse('100 / 4');

                expect(node.expression('a').identicalTo(a)).toBe(true);
            });
            
            it("can have children and one parent", function () {
                var a = new MathGL.Scope();
                var b = new MathGL.Scope();

                expect(b.parent()).toBe(null);
                expect(a.children().length).toEqual(0);

                a.add(b);

                expect(b.parent()).toBe(a);
                expect(a.children().length).toEqual(1);
                expect(a.children()[0]).toBe(b);
            });

            it("can inherit expressions from parents", function () {
                var a = new MathGL.Scope({
                    expressions: {
                        x: 4
                    }
                });
                var b = new MathGL.Scope();
                a.add(b);
                var p = new SimpleFormat.Parser();
                expect(b.expression('x').identicalTo(p.parse('4'))).toBe(true);
                expect(b.expression('x').identicalTo(a.expression('x'))).toBe(true);
                
                b.defineExpression('x', 10);
                expect(a.expression('x').identicalTo(b.expression('x'))).toBe(false);
                b.undefine('x');

                var c = new MathGL.Scope();
                b.add(c);
                expect(c.expression('x').identicalTo(p.parse('4'))).toBe(true);
                expect(c.expression('x').identicalTo(b.expression('x'))).toBe(true);
                expect(c.expression('x').identicalTo(a.expression('x'))).toBe(true);

                a.expression('x', 5);

                expect(c.expression('x').identicalTo(p.parse('4'))).toBe(false);
                expect(c.expression('x').identicalTo(p.parse('5'))).toBe(true);
                expect(c.expression('x').identicalTo(b.expression('x'))).toBe(true);
                expect(c.expression('x').identicalTo(a.expression('x'))).toBe(true);

                c.defineExpression('x', 'y - 5');
                a.undefine('x');
                
                expect(a.expression('x')).toBe(undefined);
                expect(b.expression('x')).toBe(undefined);
                expect(c.expression('x').identicalTo(p.parse('y - 5'))).toBe(true);
                expect(c.expression('x').identicalTo(p.parse('y - 6'))).toBe(false);
                
                b.defineExpression('x', 2);
                c.undefine('x')
                expect(c.expression('x').identicalTo(b.expression('x'))).toBe(true);
                
                b.undefine('x');
                expect(c.expression('x')).toBe(undefined);
                
                
            });

            it ("can return flat expressions, derived from defintions in its ancestors", function () {

                var p = new SimpleFormat.Parser();
                var a = new MathGL.Scope({
                    expressions: {
                        t: 'x*2'
                    }
                });

                var b = new MathGL.Scope({
                    expressions: {
                        x: 1
                    }
                });

                var c = new MathGL.Scope({
                    expressions: {
                        x: 2
                    }
                });

                a.add(b).add(c);
                expect(b.flat('t').identicalTo(p.parse('1*2'))).toBe(true);
                expect(c.flat('t').identicalTo(p.parse('2*2'))).toBe(true);
            });
        });
    };
});
