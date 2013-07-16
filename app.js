requirejs.config({
    baseUrl: '/continuous/', 
    paths: {
        quack: './lib/quack'
    }
});


requirejs(['kalkyl/package', 'communication/client/package'], function(KL, C) {


    var constant = new KL.Constant(10);
    var variable = new KL.Variable('x');
    var variable2 = new KL.Variable('x');
    var minus = new KL.Minus(constant, variable);
    var vector = new KL.Vector3(minus, variable, variable2);

    console.log(constant.sageFormat());

    vector.dump("vector");
    console.log(vector.differentiated('x').sageFormat());
    vector.evaluated({x: 2}).dump("vector with x as 2");
    vector.evaluated({x: 4}).dump("vector with x as 4");
    vector.transposed().dump("transposed");

    var matrix = new KL.Matrix.createIdentityMatrix(3);
    matrix.element(new KL.Vector2(0, 1), 3);

    var mult = new KL.Multiplication(
        matrix,
        vector
    );

    mult.dump("generalized");
    mult.evaluated({x: 2}).dump("matrix multiplication");

    
    var server = new C.MathServer("ws://localhost:8080", function() {

    });
    
    server.connect(function(err) {
        // integration
        server.integrate(mult, 'x', function(err, expr) {
            if (!err) {
                console.log(expr);
            }
        });
    });
    //solve equations
//    server.solve([KL.parse('x - 2'), KL.parse('x^2')], ['x'], function(err, map) {
///        if (!err) {
//            console.log(map);
//        }
//    });



    //    console.log(mult.sageFormat());


});
