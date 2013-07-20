requirejs.config({
    baseUrl: '/continuous/', 
    paths: {
        quack: './lib/quack'
    }
});


requirejs(['kalkyl/package', 'communication/client/package', 'kalkyl/parser/package'], function(KL, C, SP) {





    var constant = new KL.Constant(10);
    var variable = new KL.Variable('x');
    var variable2 = new KL.Variable('x');
    var minus = new KL.Minus(constant, variable);
    var vector = new KL.Vector3(minus, variable, variable2);

    var fun = new KL.Function('f', [minus, variable]);
    var plus2 = fun.evaluated({
        f: function(args) {
            return new KL.Plus(args[0], args[1]);
        }
    });

    fun.dump("function");
    plus2.dump("plus2");



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

    
    var sp = new SP.SimpleParser();
    var expr = sp.parse("a(3* x - 4) + 2");


    
    if (sp.errors()) {
        sp.errors().forEach(function(e) {
            console.log(e);
        });
    } else {
        expr.dump();
    }



    var expr = sp.parse("(cos b(3*(x - 4))) + 2");
    expr.dump();    
    var expr = sp.parse("[[1, 0, cos(cos(4x - 2))],[0 a(y*34)*-3 0],[0 0 1]] * x"); //.evaluated({x: 2, y: 4});
    
    
    if (sp.errors()) {
        sp.errors().forEach(function(e) {
            console.log(e);
        });
    } else {
        expr.dump();
    }


    var errors;
//    var expr = sp.parse("[[1, 0, 0], [0, y, 0],[0, 0, 1]] * [[1, 0, 0],[0, 1, 0],[0, 0, 1]]").evaluated({});


//    var expr = sp.parse('[1 3]');
    if (errors = sp.errors()) {
        errors.forEach(function(e) {
            console.log(e);
        });
    }
    
//    var expr = sp.parse("((0) + ((y) * (0))) + ((0) * (0))");

//    console.log(expr.simpleFormat());
//    console.log(expr.simplified().simpleFormat());

//    var expr = sp.parse("[[1, 0, 0],[0, y, 0],[0, 0, 1]] * [[1, 0, 0],[0, 1, 0],[0, 0, 1]]").evaluated({}).simplified();
   // expr.dump("matrix mult with unit");

/*

    var expr = sp.parse("[[1, 0, 0],[0, y, 0],[0, 0, 1]] * [[1, 0, 0],[0, y, 0],[0, 0, 1]]").evaluated({}).simplified();
    expr.dump("matrix mult");



//    var expr = ld.parse("5xa2 + 2.0 * vector i([32342.234, 4, x])x / 3^.2");
    
    if (expr) {
        expr.dump();
    } else {
        console.log("could not parse expression");
    }*/
        
  
/*    if (tokens) {
        parser.tokens(tokens);
        parser.insertImplicitMultiplications();
        console.log(parser.tokens());*/
        //        var parser = new SP.Parser(tokens);
//        parser.dump();
//        var expr = parser.expression();
//        expr.dump();
//    }

/*    
    var server = new C.MathServer("ws://localhost:8080", function() {

    });
    
    server.connect(function(err) {
        // integration
        server.integrate(mult, 'x', function(err, expr) {
            if (!err) {
                console.log(expr);
            }
        });
    });*/
    //solve equations
//    server.solve([KL.parse('x - 2'), KL.parse('x^2')], ['x'], function(err, map) {
///        if (!err) {
//            console.log(map);
//        }
//    });



    //    console.log(mult.sageFormat());


});
