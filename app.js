requirejs.config({
    baseUrl: 'http://localhost/continuous/',

    packages: [
        "quack",
        "kalkyl",
        "kalkyl/format",
        "kalkyl/format/simple",
        "kalkyl/format/glsl",
        "kalkyl/glmatrix",

        "gl-matrix",
        "mathgl",
        "mathgl/engine"
    ],

    paths: {
        // List of all Continuous packages
        'jquery':                './lib/jquery-2.0.3.min',
        'stats':                './lib/stats.min',
        'gl-matrix':             './lib/gl-matrix-min'

        /*        'kalkyl':                './kalkyl', CHECK
                  'kalkyl/format':         './kalkyl/format', CHECK
                  'kalkyl/format/simple':  './kalkyl/format/simple', CHECK
                  'kalkyl/format/javascript':  './kalkyl/format/javascript',
                  'kalkyl/format/sage':    './kalkyl/format/sage',
                  'kalkyl/format/glsl':    './kalkyl/format/glsl', CHECK
                  'kalkyl/glmatrix':       './kalkyl/glmatrix',*/

        /*        'communication':         './communication',
                  'communication/client':  './communication/client',*/

        /*        'mathgl':                'mathgl',
                  'mathgl/engine':         './mathgl/engine/package',
                  'errors':                './errors/package'*/
    }
});

/*
  define(function (require) {
  var mathgl = require('./mathgl/package');
  console.log(mathgl);
  });
*/

/*requirejs(['mathgl'], function (MathGL) {
  console.log("loaded mathgl");
  });
*/


define(function (require) {

    var Kalkyl = require('kalkyl');
    var Format = require('kalkyl/format');
    var SimpleFormat = require('kalkyl/format/simple');
    var GLSLFormat = require('kalkyl/format/glsl');

    var MathGL = require('mathgl');

    var Engine = require('mathgl/engine');
    console.log(Engine);

    var number = new Kalkyl.Plus(new Kalkyl.Number(2), new Kalkyl.Number(3)).evaluated();
    console.log(number);

    var parser = new SimpleFormat.Parser();
    console.log(parser.parse('x + y/2x').simpleFormat());

    console.log(MathGL);

    var space = new MathGL.Space();
    var scope = new MathGL.Scope({
        primitives: {
            l: 0
        }
    });
    space.add(scope);

    var green = new MathGL.Color(0xff00ff00);
    var red = new MathGL.Color(0xffff0000);

    var gradient = new MathGL.Gradient({
        parameter: 's',
        stops: {
            '-40': red,
            40: green
        }
    });

    var invGradient = new MathGL.Gradient({
        parameter: 's',
        stops: {
            '-40': green,
            40: red
        }
    });

    var checker = new MathGL.CheckerPattern({
        parameters: {
            a: 0.1
        },
        inputA: gradient,
        inputB: invGradient
    });

    var curve = new MathGL.Curve({
        domain: {
            s: [-20*Math.PI, 20*Math.PI]
        },
        primitives: {
            r: 1,
            t: 0

        },
        expressions: {
            x: 't(sin(s/10))',
            y: 's*sin(s/10)/20',
            a: 'cos(x)',
            z: 's/20'

            //            r: 'cos(qt) + 2',
            //            x: 'r*cos(pt)',
            ///           y: 'r*sin(pt)',
            //          z: '-sin(qt)'
        },
        appearance: checker,
        thickness: 0.01,
        stepSize: 0.1
    });

    /*    var surface = new MathGL.Surface({
          domain: {
          t: [0, 10],
          s: [0, 10]
          },
          expressions: {
          x: 's',
          y: 't',
          z: 0
          },
          appearance: red
          });*/

    var camera = new MathGL.Camera({
        primitives: {
            t: 0
        },
        expressions: {
            position: '[4t*cos(4t), 4t*sin(4t), 6*sin(2t) + 8]',
            subject: '[0, 0, 0]',
            up: '[0, 0, 1]'
        }
    });

/*    var axis = new MathGL.Axis({
        parameter: 'x',
        position: '[0 0 0]',
        stepSize: 0.1,
        length: 1,
        label: 'x'
    });
*/

    for (var a = -2; a < 3; a++) {
        for (var b = -2; b < 3; b++) {
            var arrow = new MathGL.VectorArrow({
                primitives: {
                    a: a + Math.random()/20,
                    b: b + Math.random()/20,
                    c: 0
                },
                expressions: {
                    s: '10*(x^2) - 60',
                    x: 'a+sin(5(b + l))',
                    y: 'b',
                    z: '3',
                    position: '[a, b, c]',
                    value: '[x, y, z]'
                },
                appearance: gradient
            });
            scope.add(arrow);
        }
    }

    console.log(arrow.appearance());



    var surface = new MathGL.Surface({
        domain: {
            x: [-1, 1],
            z: [-1, 1]
        },
        expressions: {
            s: '30*y',
            y: 'cos(2z)*sin(3x)'
        },
        appearance: gradient
    });


//    scope.add(surface);

    scope.add(camera);
//    scope.add(curve);

    var canvas = document.getElementById('canvas');
    var view = new Engine.View(canvas);
    view.space(space);
    view.camera(camera);

    console.log(surface.id());

    var t = 0;

    // render loop
    function update() {
       t += 0.001;
        scope.primitive('l', Math.sin(10*t));
        camera.primitive('t', t);
        curve.primitive('t', Math.abs((t % 2) - 1) );
    }

    view.startRendering(update, stats);

    var endTime = new Date();

    //    console.log("creating scene took " + (endTime - startTime) + "ms");


    var updateSize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        view.updateDimensions();
    }

    window.onresize = updateSize;

    updateSize();
});

/*
  requirejs(['jquery', 'kalkyl', 'kalkyl/format/simple', 'kalkyl/format/javascript', 'kalkyl/format/sage', 'communication', 'communication/client', 'mathgl', 'mathgl/engine', 'stats'], function($, Kalkyl, SimpleFormat, JavascriptFormat, SageFormat, Communication, Client, MathGL, Engine, Stats) {


  var startTime = new Date();
  var port = 8080;
  var connection = new Client.Connection('ws://localhost:' + port);
  var parser = new SimpleFormat.Parser();

  var jsFormatter = new JavascriptFormat.Formatter();
  var tree = parser.parse('34 + sin(x)/3');
  //    console.log();

  var code = jsFormatter.format(tree);
  //    console.log(code);
  var fn = new Function(code);

  //    console.log(fn);
  //    console.log(fn({x: 0}));

  var space = new MathGL.Space();
  var scope = new MathGL.Scope();
  space.add(scope);

  var green = new MathGL.Color(0xff00ff00);
  var red = new MathGL.Color(0xffff0000);

  var gradient = new MathGL.Gradient({
  parameter: 't',
  stops: {
  0: red,
  6: green
  }
  });

  var invGradient = new MathGL.Gradient({
  parameter: 't',
  stops: {
  0: green,
  3: red,
  6: green
  }
  });

  var checker = new MathGL.CheckerPattern({
  parameters: {
  t: 0.1
  },
  inputA: gradient,
  inputB: invGradient
  });

  var curve = new MathGL.Curve({
  domain: {
  t: [0, 2*Math.PI]
  },
  primitives: {
  r: 1,

  },
  expressions: {
  x: 'cos(t)',
  y: 'sin(t)',
  a: 'cos(x)',
  z: 0

  //            r: 'cos(qt) + 2',
  //            x: 'r*cos(pt)',
  ///           y: 'r*sin(pt)',
  //          z: '-sin(qt)'
  },
  appearance: checker,
  thickness: 0.1,
  stepSize: 0.001
  });

  var surface = new MathGL.Surface({
  domain: {
  t: [0, 10],
  s: [0, 10]
  },
  expressions: {
  x: 's',
  y: 't',
  z: 0
  },
  appearance: red
  });

  var camera = new MathGL.Camera({
  primitives: {
  t: 0
  },
  expressions: {
  position: '[4cos(t) 0 4sin(t)]',
  subject: '[0, 0, 0]',
  up: '[0, 1, 0]'
  }
  });

  scope.add(camera);
  //    scope.add(surface);
  scope.add(curve);

  var view = new Engine.View(document.getElementById('canvas'));
  view.space(space);
  view.camera(camera);

  var t = 0;

  // render loop
  function update() {
  t += 0.01;
  camera.primitive('t', t);
  }

  view.startRendering(update, stats);

  var endTime = new Date();

  console.log("creating scene took " + (endTime - startTime) + "ms");
  });
*/
