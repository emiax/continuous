define([
    'require',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine'],

       function(
           require,
           Kalkyl, SimpleFormat, MathGL, Engine, $) {

           var scene = function() {
               var State = require('./state');

               var view = new Engine.View(document.getElementById('canvas'));

               var space = new MathGL.Space({
                   primitives: {
                       a: 0,
                       t: 0
                   },
                   expressions: {
                       r: 'sin(x*2) + x^2/3'
                   }
               });


               var camera = new MathGL.Camera({
                   expressions: {
                       position: '[3, 0, -4]',
                       subject: '[a/2, 0, 0]',
                       up: '[cos(0.8a), -sin(0.8a), 0]'
                   }
               });

               space.add(camera);
               view.space(space);
               view.camera(camera);

               var red = new MathGL.Color(0x55ff0000);
               var green = new MathGL.Color(0xffff5555);
               var white = new MathGL.Color(0xffffffff);
               var diffuseWhite = new MathGL.Diffuse({
                   background: white
               });

               var gradient = new MathGL.Gradient({
                   parameter: 'x',
                   stops: {
                       '1': red,
                       '2': green
                   }
               });

               var darker = new MathGL.Color({
                   color: 0x55000000,
                   background: gradient
               });


               var curve = new MathGL.Curve({
                   domain: {
                       s: [0, 1]
                   },
                   expressions: {
                       T: '3.14a',
                       x: 'as',
                       y: 'r*cos(T)',
                       z: 'r*sin(T)'
                   },
                   thickness: 0.01,
                   stepSize: 0.01,
                   appearance: gradient
               });
               
               var xAxis = new MathGL.VectorArrow({
                   expressions: {
                       position: '[0, 0, 0]',
                       value: '[a+0.4, 0, 0]'
                   },
                   appearance: diffuseWhite,
                   thickness: 0.01
               });

               space.add(xAxis);


               var yAxis = new MathGL.VectorArrow({
                   expressions: {
                       position: '[0, 0, 0]',
                       value: '[0, 1.5, 0]'
                   },
                   appearance: diffuseWhite,
                   thickness: 0.01
               });

               var circle = new MathGL.Curve({
                   domain: {
                       T: [0, 2*Math.PI]
                   },
                   expressions: {
                       x: 'a',
                       y: 'r*cos(aT/2)',
                       z: 'r*sin(aT/2)'
                   },
                   thickness: 0.01,
                   appearance: white
               });

               var checkerPattern = new MathGL.CheckerPattern({
                   parameters: {
                       x: 0.02,
                       T: 0.2
                   },
                   inputA: gradient,
                   inputB: darker
               });

               var diffuseRed = new MathGL.Diffuse({
                   background: checkerPattern
               });

               var surface = new MathGL.Surface({
                   domain: {
                       s: [0, 1],
                       T: [0, 2*Math.PI]
                   },
                   expressions: {
                       x: 'as',
                       y: 'r*cos(aT/2)',
                       z: 'r*sin(aT/2)'
                   },
                   appearance: diffuseRed,
                   style: 'diffuseRed'
               });

               

               space.add(circle);
               space.add(surface);
               space.add(xAxis);
               space.add(yAxis);

               space.add(curve);
               

               // BEGIN DEFINING SPACE.
               var t;
               function update() {
                   State.t += 0.02
                   t = State.t;
                   var a = 1 - Math.cos(t);

                   space.primitive('a', a);
                   space.primitive('t', t);
               }


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
