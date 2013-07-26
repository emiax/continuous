define(['kalkyl'], function(KL) {
    return function() {

        describe("Basic kalkyl operations", function() {
            
            function testPlus(a, b, reference) {
                a = KL.Number.boxNumber(a);
                b = KL.Number.boxNumber(b);
                var plus = new KL.Plus(a, b);
                var sum = plus.evaluated().toPrimitive();
                expect(sum).toEqual(reference);
            }

            function testMultiplication(a, b, reference) {
                a = KL.Number.boxNumber(a);
                b = KL.Number.boxNumber(b);
                var multiplication = new KL.Multiplication(a, b);
                var product = multiplication.evaluated().toPrimitive();
                expect(product).toEqual(reference);
            }

            function testMatrixMultiplication(a, b, reference) {
                a = new KL.MatrixNM(a);
                b = new KL.MatrixNM(b);
                reference = new KL.MatrixNM(reference);
                var result = (new KL.Multiplication(a, b)).evaluated();
                expect(result.identicalTo(reference)).toBe(true);
            }
            

            it("should be able to perform addition of scalars", function () {
                testPlus(234, 45, 234+45);
                testPlus(234, -45, 234+(-45));
            });

            
            it("should be able to perform multiplication of scalars", function () {
                testMultiplication(234, 45, 234*45);
                testMultiplication(234, -45, 234*(-45));
            });
            

            it("should be able to perform matrix multiplication", function () {
                var a = [[1, 2, 3], [4, 5, 6], [1, 2, 3]];
                var b = [[2, 4, 1], [5, 23, 1], [4, 5, 6]];
                var reference = [[24, 65, 21], [57, 161, 45], [24, 65, 21]];
                testMatrixMultiplication(a, b, reference);
            });



        });
    };
});
