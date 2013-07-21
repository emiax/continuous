requirejs.config({
    baseUrl: '/continuous/',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package'

    }
});


requirejs(['jquery', 'kalkyl', 'kalkyl/format/simple'], function($, Kalkyl, SimpleFormat) {

    /*    var constant = new Kalkyl.Constant(10);
          var variable = new Kalkyl.Variable('x');
          var variable2 = new Kalkyl.Variable('x');
          var minus = new Kalkyl.Minus(constant, variable);
          var vector = new Kalkyl.Vector3(minus, variable, variable2);

          var fun = new Kalkyl.Function('f', [minus, variable]);
          var plus2 = fun.evaluated({
          f: function(args) {
          return new Kalkyl.Plus(args[0], args[1]);
          }
          });

          fun.dump("function");
          plus2.dump("plus2");
    */

    $('#input').change(function () {
        parse($(this).val());
    });

    $('#input').keyup(function () {
        parse($(this).val());
    });



    var parser = new SimpleFormat.Parser();

    function parse(input) {

//        console.log("PARSING");
        var expr = parser.parse(input);
        var errors;
        if (errors = parser.errors()) {
            var feedback = input;
            var positions = [];
            errors.sort(function(a, b) {
                return b.position() - a.position();
            });
            errors.forEach(function(e) {
//                console.log(e);
                var position = e.position();

                var string = e.token() && e.token().string();
                if (string && string.length) {
                    var pre = feedback.substr(0, position);
                    var post = feedback.substr(position + string.length);
                    var subject = '<span class="error">' + string.replace(/ /gi, '_') + '</span>';
                    feedback = pre + subject + post;
                } else if (position < input.length) {
                    var pre = feedback.substr(0, position);
                    var post = feedback.substr(position + 1);
                    var subject = '<span class="error">' + feedback.substr(position, 1) + '</span>';
                    feedback = pre + subject + post;
                } else {
                    var subject = '<span class="error">_</span>';
                    feedback = feedback + subject;
                }
            });
//            console.log(feedback);
//            $('#console').html(feedback)
        } else {
            if (expr) {
                console.log(expr.dim());
                $('#console').html(expr.simpleFormat() + "<br>" + expr.evaluated().simplified().simpleFormat())
            } else {
                $('#console').html("expression is " + expr + " but no no errors were generated.")                
            }
        }

    }

    var input = "1 + ]2*]xba";



    /*


    //    console.log(constant.sageFormat());

    vector.dump("vector");
    //    console.log(vector.differentiated('x').sageFormat());
    vector.evaluated({x: 2}).dump("vector with x as 2");
    vector.evaluated({x: 4}).dump("vector with x as 4");
    vector.transposed().dump("transposed");

    var matrix = new Kalkyl.Matrix.createIdentityMatrix(3);
    matrix.element(new Kalkyl.Vector2(0, 1), 3);

    var mult = new Kalkyl.Multiplication(
    matrix,
    vector
    );

    mult.dump("generalized");
    mult.evaluated({x: 2}).dump("matrix multiplication");


    var sp = new Simple.Parser();
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
    var expr = sp.parse("[[1, 0, cos(cos x)],[0 a(y*34)*-3 0],[0 0 1]] * x"); //.evaluated({x: 2, y: 4});


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
    */
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
    //    server.solve([Kalkyl.parse('x - 2'), Kalkyl.parse('x^2')], ['x'], function(err, map) {
    ///        if (!err) {
    //            console.log(map);
    //        }
    //    });



    //    console.log(mult.sageFormat());


});
