define(['kalkyl', 'kalkyl/format/simple'], function(Kalkyl, SimpleFormat) {
    return function() {

        describe("Kalkyl substitutor", function() {
            
            var p = new SimpleFormat.Parser();

            it("can substitute variables with other variables", function () {
                expect(p.parse('x + x').substituted({x: 'y'}).identicalTo(p.parse('y + y'))).toBe(true);
                expect(p.parse('x + y').substituted({x: 'y'}).identicalTo(p.parse('y + y'))).toBe(true);
                expect(p.parse('a + x').substituted({x: 'y'}).identicalTo(p.parse('a + y'))).toBe(true);
                expect(p.parse('x * x').substituted({x: 'y'}).identicalTo(p.parse('y * y'))).toBe(true);

                expect(p.parse('sin(x)').substituted({x: 'y'}).identicalTo(p.parse('sin(y)'))).toBe(true);
                expect(p.parse('[x y z]').substituted({x: 'y', y: 'z', z: 'x'}).identicalTo(p.parse('[y z x]'))).toBe(true);
            });

            it("can substitute variables with expressions", function () {
                expect(p.parse('x + x').substituted({x: p.parse('y/2')}).identicalTo(p.parse('y/2 + y/2'))).toBe(true);

            });


        });
    };
});
