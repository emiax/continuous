define(['mathgl'], function(MathGL) {
    return function() {

        describe("mathgl node", function() {
            
            it("should be able to create a new mathgl node", function () {
                var node = new 
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
