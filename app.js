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
    
    var scope = new MathGL.Scope({
        expressions: {
            r: "(x^2 + y^2)",
            x: 'R*sin(T)*cos(P)',
            y: 'R*sin(T)*sin(P)',
            z: '5 - r^(1/2)',
            t: 0
        }
    });
   
    var camera = new MathGL.Camera({
        expressions: {
//            position: '[5*cos(t), 5*sin(t), sin(t)]',
            //R: 2,
            //T: '2*t',
            //P: 't/2',
            position: '[sin(10*t), cos(10*t), 0]',
            subject: '[0, 0, 0]',
            up: '[0, 0, 1]'
        }
    });

    scope.add(camera);

    // surface appearance.

    var red = new MathGL.Color(0xffff0000);
    var green = new MathGL.Color(0xff00cc00);
    var blue = new MathGL.Color(0xff0000ff);
//    var transparent = new MathGL.Color(0x33000000);

    var gradient = new MathGL.Gradient({
        parameter: 'z',
        blendMode: 'normal', 
        stops: {
            '0.8': red,
            '0': blue,
            '-0.8': green
        }
    });

    var darkOverlay = new MathGL.Color({
        color: 0x55000000,
        background: gradient
    });

    var checker = new MathGL.CheckerPattern({
        parameters: {
            v: 1,
            u: 1
        },
        inputA: gradient,
        inputB: darkOverlay
    });


    var surface = new MathGL.Surface({
        domain: {
            u: [-0.5, 0.5],
            v: [-0.5, 0.5]
        },
        expressions: {
            x: 'u-1',
            z: 'v',
            y: 'sin(u)*cos(v)'
        },
        appearance: checker
    });


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

  
    

    var curveGradient = new MathGL.Gradient({
        stops: {
            0: red,
            6: blue
        },
        parameter: 'd'
    })
    

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

    var curve = new MathGL.Curve({
        domain: {
            d: [0, 2*Math.PI]
        },
        expressions: {
            p: 3,
            q: -7,
            r: 'cos(qd) + 2',
            x: 'r*cos(pd) * 0.2 * (sin(t*50) + 2)/4',
            y: 'r*sin(pd) * 0.2',
            z: '-sin(qd) * 0.2'
        },
        appearance: curveGradient
    });



    scope.add(curve);
  
//    scope.add(surface);
//    scope.add(surface2);
    space.add(scope);    

    var view = new Engine.View(document.getElementById('canvas'));
    view.space(space);
    view.camera(camera);


    // render loop
    var t = 0;
    function update() {
        scope.set('t', t);
//        camera.set('t', t);
        t += 0.001;
    }

    view.startRendering(update, stats);   

    var endTime = new Date();

    console.log("creating scene took " + (endTime - startTime) + "ms");
});
