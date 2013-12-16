define([
    'require',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine',
    'jquery'],

       function(
           require,
           Kalkyl, SimpleFormat, MathGL, Engine, $) {

           var scene = function() {
               var State = require('./state');

               var view = new Engine.View(document.getElementById('canvas'));

               var space = new MathGL.Space();

               // BEGIN DEFINING SPACE.
               var t;
               function update() {
                   t = State.t;
                   scope.primitive('t', t % 20*Math.PI);
                   State.t += 0.01;
               }

               // surface appearance.
               var white = new MathGL.Color(0xffdddddd);
               var transparentWhite = new MathGL.Color(0x44dddddd);
               var red = new MathGL.Color(0xffff0000);
               var diffuseWhite = new MathGL.Diffuse({
                   background: white
               });
               
               var diffuseBlue = new MathGL.Diffuse({
                   background: new MathGL.Color(0xff222288)
               });


               var green = new MathGL.Color(0xff00cc00);
               var blue = new MathGL.Color(0xff4444aa);
               var cyan = new MathGL.Color(0xff0088aa);

               var surfaceGradient = new MathGL.Gradient({
                   parameter: 'z',
                   blendMode: 'normal',
                   stops: {
                       '0': cyan,
                       '1': blue
                   }
               });

               var surfaceDarkOverlay = new MathGL.Color({
                   background: surfaceGradient,
                   color: 0x44000000
               });

               var surfaceChecker = new MathGL.CheckerPattern({
                   parameters: {
                       x: 0.2,
                       y: 0.2
                   },
                   inputA: surfaceGradient,
                   inputB: surfaceDarkOverlay
               });

               var surfaceDiffuse = new MathGL.Diffuse({
                   background: surfaceChecker
               });

               var clippedSurface = new MathGL.Threshold({
                   parameter: 'r',
                   value: 'c',
                   above: null,
                   below: surfaceDiffuse
               });

               var parser = new SimpleFormat.Parser();

               // main scope

               var expr = parser.parse('(2x + 4*sin(t)y)^2/20');
               var dzdx = expr.differentiated('x');
               var dzdy = expr.differentiated('y');

               var scope = new MathGL.Scope({
                   primitives: {
                       t: 0
                   },
                   expressions: {
                       Z: expr
                   }
               });


               // entities
               var surface = new MathGL.Surface({
                   domain: {
                       x: [-2, 2],
                       y: [-2, 2]
                   },
                   expressions: {
                       c: 'sin(t) + 2',
                       r: 'x^2 + y^2',
                       z: 'Z'
                   },
                   thickness: 0.1,
                   appearance: clippedSurface
               });
              
               scope.add(surface);


               var constraint = new MathGL.Scope({
                   expressions: {
                       r: '1',
                       x: 'r*cos(T)',
                       y: 'r*sin(T)'
                   }
               });

               scope.add(constraint);


               var curve = new MathGL.Curve({
                   domain: {
                       T: [0, 2*Math.PI]
                   },
                   expressions: {
                       z: 'Z'
                   },
                   thickness: 0.02,
                   stepSize: 0.01,
                   appearance: white
               });

               constraint.add(curve);


               var cylinder = new MathGL.Surface({
                   domain: {
                       T: [0, 2*Math.PI],
                       z: [-0.5, 2]
                   },
                   thickness: 0.1,
                   appearance: transparentWhite,
                   style: 'wireframe'
               });

               constraint.add(cylinder);
               
               var normalArrow = new MathGL.VectorArrow({
                   expressions: {
                       T: 't',
                       z: 'Z + 0.5',
                       position: '[cos(T), sin(T), z]',
                       value: '[x/2, y/2, 0]',
                   },
                   appearance: diffuseWhite,
                   thickness: 0.025
                     
               });

               constraint.add(normalArrow);

               var gradientArrow = new MathGL.VectorArrow({
                   expressions: {
                       a: dzdx,
                       b: dzdy,
                       T: 't',
                       z: 'Z + 0.4',
                       position: '[cos(T), sin(T), z]',
                       value: '[a/3, b/3, 0]',
                   },
                   appearance: diffuseBlue,
                   thickness: 0.025
                     
               });

               constraint.add(gradientArrow);

               // camera

               var camera = new MathGL.Camera({
                   expressions: {
                       s: 1,
                       position: '3*[cos(t/10), sin(t/10), 1.2]',
                       subject: '[0, 0, 1]',
                       up: '[0, 0, 1]'
                   }
               });

               scope.add(camera);

               // Add erverything to the scene graph.

               space.add(scope);

               view.space(space);
               view.camera(camera);

               var updateDimensions = function (key) {
                   if(key == 'canvasDim') {
                       var newDims = State.canvasDim;
                       view.dimensions(newDims.w, newDims.h);
                   }
               }

               State.subscribe(updateDimensions);

               view.startRendering(update, stats);

               var endTime = new Date();
           };

           return scene;
       });
