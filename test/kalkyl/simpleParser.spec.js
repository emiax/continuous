define(['../kalkyl/kalkyl'], function(KL) {
    return function() {

        describe("kalkyl simple parser", function() {
            
            it("should be able to parse addition", function () {
                var reference = new KL.Plus(new KL.Number(4), new KL.Number(5));
                var parser = new KL.Format.SimpleParser();
                var parsed = parser.parse('4 + 5');
                expect(reference.identicalTo(parsed)).toBe(true);
            });

        });
    };
});
