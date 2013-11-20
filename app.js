requirejs.config({
    baseUrl: './',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'stats':                './lib/stats.min',
        'gl-matrix':             './lib/gl-matrix-min',
        
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/javascript':  './kalkyl/format/javascript/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'kalkyl/format/glsl':    './kalkyl/format/glsl/package',
        'kalkyl/glmatrix':       './kalkyl/glmatrix/package',
        
        'communication':         './communication/package',
        'communication/client':  './communication/client/package',
        
        'mathgl':                './mathgl/package',
        'mathgl/engine':         './mathgl/engine/package',
        'errors':                './errors/package'
    }
});


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
    
    // BEGIN DEFINING SPACE.
    
//    var Z = parser.parse('(sin(40(y-1)x*(sin(4t)+0.1))+1.1)/30');
    var Z = parser.parse('(sin(6x + 20t)*sin(6y + 20t))/6 + (x^2 + y^2)/2');

    var map = {x: 'a', y: 'b'};
    var sample = Z.substituted(map);
    var dzdx = Z.differentiated('x').substituted(map);
    var dzdy = Z.differentiated('y').substituted(map);
    
    sample.dump();

    
    var scope = new MathGL.Scope({
        primitives: {
            a: 0,
            b: 0,
            t: 0
        },
        expressions: {
            R: "(sin(10*t)+1)*(x^2 + y^2)^(1/2)",
            dzdx: dzdx, 
            dzdy: dzdy,
            r: '(x^2 + y^2)^(1/2)',
            Z: Z,
            D: new Kalkyl.Plus(sample, new Kalkyl.Plus(
                new Kalkyl.Multiplication(parser.parse('x-a'), new Kalkyl.Variable('dzdx')),
                new Kalkyl.Multiplication(parser.parse('y-b'), new Kalkyl.Variable('dzdy'))
            ))
//            D: new Kalkyl.Plus(sample, 0.001)
        }
    });
   
    var camera = new MathGL.Camera({
        expressions: {
            position: '[2sin(t)*sin(10*t), 2cos(10t)*cos(10*t), 0.9]',
//            position: '[a, b, 0.3]',
            subject: '[a, b, 0]',
            up: '[0, 0, 1]'
        }
    });

    scope.add(camera);

    // surface appearance.

    var red = new MathGL.Color(0xffff0000);
    var orange = new MathGL.Color(0x66d85c00);
    var green = new MathGL.Color(0xff00cc00);
//    var blue = new MathGL.Color(0xff0000ff);
    var blue = new MathGL.Color(0xff003463);
    var cyan = new MathGL.Color(0xff105477);
    var white = new MathGL.Color(0xffffffff);
    var transparent = new MathGL.Color(0);
    
//    var transparent = new MathGL.Color(0x33000000);

    var gradient = new MathGL.Gradient({
        parameter: 'z',
        blendMode: 'normal', 
        stops: {
            '0.6': cyan,
            '0': blue,
//            '-0.8': green
        }
    });

    var darkOverlay = new MathGL.Color({
        color: 0x22000000,
        background: gradient
    });



    var orangeOverlay = new MathGL.Color(0x66b24800);
//    var orangeOverlay = new MathGL.Color(0x);

    var orangeChecker = new MathGL.CheckerPattern({
        parameters: {
            x: 0.05,
            y: 0.05
        },
        inputA: orange,
        inputB: orangeOverlay
    });




    var darkerOverlay = new MathGL.Color({
        color: 0xff151515,
        background: gradient
    });

    

    var checker = new MathGL.CheckerPattern({
        parameters: {
            x: 0.05,
            y: 0.05
        },
        inputA: gradient,
        inputB: darkOverlay
    });


    var shade = new MathGL.Gradient({
        parameter: 'r',
        blendMode: 'normal',
        background: checker,
        stops: {
            '-1': darkerOverlay,
            0: transparent,
            1: darkerOverlay
        }
    });


    var surface = new MathGL.Surface({
        domain: {
            x: [-1, 1],
            y: [-1, 1]
        },
        expressions: {
            z: 'Z'
        },
        appearance: checker
    });

    var square = new MathGL.Surface({
        domain: {
            u: [-1, 1],
            v: [-1, 1]
        },
        expressions: {
            x: 'a + u/100',
            y: 'b + v/100',
            z: 'Z + 0.002'
        }, 
        appearance: white
    });



    
 //   for (var i = 0; i < 1; i+=3) {
/*        var curve = new MathGL.Curve({
            domain: {
                u: [-1, 1]
            },
            expressions: {
                x: 'u',
                Y: 0,
                y: 'Y/10',
                z: 'Z + 0.001'
        },
            thickness: 0.001,
            stepSize: 0.01,
            appearance: white
        });
        scope.add(curve);*/
//    }
 //   for (var i = 0; i < 1; i+=3) {
/*        var curve = new MathGL.Curve({
            domain: {
                u: [-1, 1]
            },
            expressions: {
                x: 'u',
                Y: 0,
                y: 'Y/10',
                z: 'Z + 0.03'
        },
            thickness: 0.0025,
            stepSize: 0.01,
            appearance: white
        });
        scope.add(curve);*/
//    }

//    for (var i = 0; i < 1; i+=3) {
        var curve1 = new MathGL.Curve({
            domain: {
                u: [-1, 1]
            },
            expressions: {
                x: 'u',
                y: 'b',
                z: 'Z + 0.001'
        },
            thickness: 0.001,
            stepSize: 0.01,
            appearance: white
        });

        var curve2 = new MathGL.Curve({
            domain: {
                u: [-1, 1]
            },
            expressions: {
                x: 'a',
                y: 'u',
                z: 'Z + 0.001'
        },
            thickness: 0.001,
            stepSize: 0.01,
            appearance: white
        });
//        scope.add(curve);


//    }


/*    for (var i = 0; i < 10; i+=3) {
        var curve = new MathGL.Curve({
            domain: {
                u: [-1, 1]
            },
            expressions: {
                x: '(X-5)/10',
                X: i,
                y: 'u',
                z: 'Z + 0.05'
        },
            thickness: 0.005,
            stepSize: 0.01,
            appearance: white
        });
        scope.add(curve);
    }*/

    
    
/*
    var surface2 = new MathGL.Surface({
        domain: {
            u: [-0.5, 0.5],
            v: [-0.5, 0.5]
        },
        expressions: {
            x: 'u-3',
            z: 'v',
            y: 'sin(u)*cos(v)'
        },
        appearance: checker
    });
*/

    var plane = new MathGL.Surface({
        domain: {
            x: [-1, 1],
            y: [-1, 1]
        },
        expressions: {
            z: 'D+0.0001'
        },
        appearance: orangeChecker
    });
  
    

    var curveGradient = new MathGL.Gradient({
        stops: {
            0: red,
            2: green,
            3: blue,
            5: green,
            6: red
        },
        parameter: 'd'
    })
  

    var clip = new MathGL.Threshold({
        parameter: 'd',
        value: 'b',
        below: curveGradient
    });

    var clip2 = new MathGL.Threshold({
        parameter: 'd',
        value: 'c',
        above: clip
    });



/*    var curve = new MathGL.Curve({
        domain: {
            d: [0, 100]
        },
        expressions: {
            x: 'z*cos(d)',
            y: 'z*sin(d)',
            z: 'd/100 - 0.5'
        },
        appearance: curveGradient
    });*/

    
/*    for (var i = 2; i < 4; i++) {
        var curve = new MathGL.Curve({
            domain: {
                d: [0, 2*Math.PI]
            },
            stepSize: 0.01,
            thickness: i*0.0002,
            expressions: {
                b: '(sin(p^2*t/10)+1)/2*((sin(t*8)+1)*3.14)',
                c: '(sin(p^2*t/10)+1)/2*((sin(t*8)+1)*3.14)-0.2',
                p: i,
                q: -7,
                r: 'cos(qd) + 2',
                x: 'r*cos(pd + tp) * (cos(20*t)+2.1)*0.1',
                y: 'r*sin(pd) * (cos(20*t)+2.1)*0.1',
//                z: '(-sin(qd) + cos(dt30)/2) * (cos(20*t)+1.1)*0.1'
                z: '(-sin(qd)) * (cos(20*t)+2.1)*0.1'
            },
            //        visible: false,
            appearance: clip2
        });
    
        scope.add(curve);
    }
*/

        


    scope.add(surface);
    scope.add(curve1);
    scope.add(curve2);
    scope.add(plane);
    scope.add(square);
    space.add(scope);    

    var view = new Engine.View(document.getElementById('canvas'));
    view.space(space);
    view.camera(camera);


    // render loop
    var t = -0.4;
    var xSpeed = 0.025;
    var ySpeed = 0.015;

    function update() {
        scope.primitive('t', t);

//        console.log(scope.flat('dzdx').evaluated());
//        console.log(scope.flat('dzdy').evaluated());
//        console.log(scope.get('a'));
//        console.log(scope.get('b'));
        
        xSpeed -= scope.flat('dzdx').evaluated().value()*0.0015;
        ySpeed -= scope.flat('dzdy').evaluated().value()*0.0015;

        scope.primitive('a', scope.primitive('a') + xSpeed);
        scope.primitive('b', scope.primitive('b') + ySpeed);
        t += 0.001;
    }

    view.startRendering(update, stats);   

    var endTime = new Date();

    console.log("creating scene took " + (endTime - startTime) + "ms");
});