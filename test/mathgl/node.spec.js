define(['mathgl', 'kalkyl/format/simple'], function(MathGL, SimpleFormat) {
    return function() {

        describe("mathgl node", function() {

            it("can be constructed", function () {
                var node = new MathGL.Node();
            });


            it("can be constructed with variable definitions", function () {
                var node = new MathGL.Node({
                    expressions: {
                        a: 1
                    }
                });
            });


            it("can set expressions using strings", function () {
                var node = new MathGL.Node({
                    expressions: {
                        a: 1,
                        b: 0
                    }
                });
                node.set({
                    a: '3 + 6',
                    b: 'sin(y)'
                });

                var p = new SimpleFormat.Parser();
                var a = p.parse('3 + 6');
                var b = p.parse('sin(y)');

                expect(node.get('a').identicalTo(a)).toBe(true);
                expect(node.get('b').identicalTo(b)).toBe(true);
            });

            it("can set one variable using strings", function () {
                var node = new MathGL.Node({
                    expressions: {
                        a: 1
                    }
                });
                var p = new SimpleFormat.Parser();
                
                node.set('a', '100 / 3');
                var a = p.parse('100 / 3');

                expect(node.get('a').identicalTo(a)).toBe(true);
            });

            
            it("can define expressions", function () {
                var node = new MathGL.Node({});
                node.define('x', 3);
                var p = new SimpleFormat.Parser();
                expect(node.get('x').identicalTo(p.parse(3))).toBe(true);
                
            });
            
            it("can set multiple expressions using kalkyl expressions", function () {
                var node = new MathGL.Node({
                    expressions: {
                        a: 0,
                        b: 0
                    }
                });
                var p = new SimpleFormat.Parser();

                node.set({
                    a: p.parse('100 / 4'),
                    b: p.parse('sin(y)')
                });

                var a = p.parse('100 / 4');
                var c = p.parse('cos(x)');

                expect(node.get('a').identicalTo(a)).toBe(true);
                expect(node.get('b').identicalTo(c)).toBe(false);
            });


            it("can set one variable using kalkyl expressions", function () {
                var node = new MathGL.Node({
                    expressions: {
                        a: 0,
                        b: 3
                    }
                });
                var p = new SimpleFormat.Parser();
                
                node.set('a', p.parse('100 / 4'));
                var a = p.parse('100 / 4');

                expect(node.get('a').identicalTo(a)).toBe(true);
            });
            
            it("can have children and one parent", function () {
                var a = new MathGL.Node();
                var b = new MathGL.Node();

                expect(b.parent()).toBe(null);
                expect(a.children().length).toEqual(0);

                a.add(b);

                expect(b.parent()).toBe(a);
                expect(a.children().length).toEqual(1);
                expect(a.children()[0]).toBe(b);
            });

            it("can inherit expressions from parents", function () {
                var a = new MathGL.Node({
                    expressions: {
                        x: 4
                    }
                });
                var b = new MathGL.Node();
                a.add(b);
                var p = new SimpleFormat.Parser();
                expect(b.get('x').identicalTo(p.parse('4'))).toBe(true);
                expect(b.get('x').identicalTo(a.get('x'))).toBe(true);
                
                b.define('x', 10);
                expect(a.get('x').identicalTo(b.get('x'))).toBe(false);
                b.undefine('x');

                var c = new MathGL.Node();
                b.add(c);
                expect(c.get('x').identicalTo(p.parse('4'))).toBe(true);
                expect(c.get('x').identicalTo(b.get('x'))).toBe(true);
                expect(c.get('x').identicalTo(a.get('x'))).toBe(true);

                a.set('x', 5);

                expect(c.get('x').identicalTo(p.parse('4'))).toBe(false);
                expect(c.get('x').identicalTo(p.parse('5'))).toBe(true);
                expect(c.get('x').identicalTo(b.get('x'))).toBe(true);
                expect(c.get('x').identicalTo(a.get('x'))).toBe(true);

                c.define('x', 'y - 5');
                a.undefine('x');
                
                expect(a.get('x')).toBe(undefined);
                expect(b.get('x')).toBe(undefined);
                expect(c.get('x').identicalTo(p.parse('y - 5'))).toBe(true);
                expect(c.get('x').identicalTo(p.parse('y - 6'))).toBe(false);
                
                b.define('x', 2);
                c.undefine('x')
                expect(c.get('x').identicalTo(b.get('x'))).toBe(true);
                
            });

        });
    };
});
