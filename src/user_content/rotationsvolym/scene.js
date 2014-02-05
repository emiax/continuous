define([
    'require',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine'],

       function(
           require,
           Kalkyl, SimpleFormat, MathGL, Engine) {

           var scene = function() {
               var State = require('./state');

               var view = new Engine.View(document.getElementById('canvas'));

               var space = new MathGL.Space({
                   primitives: {
                       t: 0,
                       xCoefficient: 1
                   },
                   expressions: {
                       f: '1 - xCoefficient*X^2'
                   }
               });


               var camera = new MathGL.Camera({
                   primitives: {
                       x: 0,
                       y: 0,
                       z: 3.5
                   },
                   expressions: {
                       position: '[x, y, z]',
                       subject: '[0, 0, 0]',
                       up: '[0, 1, 0]'
                   }
               });

               space.add(camera);

               var t = 0
               function update() {
                   ++t;
                   space.primitive('t', t/100);
               }

               
               var surfaceWhite = new MathGL.Gradient({
                   parameter: 'r', 
                   stops: {
                       '0': new MathGL.Color(0xff999900),
//                       '0.5': new MathGL.Color(0xff999900),
                       1: new MathGL.Color(0xff994400),
                       2: new MathGL.Color(0xffc232a5)
                   }
               })
               var surfaceTransparent = new MathGL.Color(0x00998866);

               var surfaceTone = new MathGL.Gradient({
                   parameter: 'alpha',
                   stops: {
                       0: surfaceTransparent,
                       1: surfaceWhite
                   }
               });

/*               var surfaceThreshold = new MathGL.Threshold({
                   parameter: 'x',
                   value: 'xLimit',
                   above: null,
                   below: surfaceTone
               });*/

               var surfaceToneDiffuse = new MathGL.Diffuse({
                   background: surfaceTone
               });
               
               // appearance.
               var red = new MathGL.Color(0xffcc0000);
               var green = new MathGL.Color(0xff00cc00);
               var darkBlue = new MathGL.Color(0x880000cc);
               var blue = new MathGL.Color(0xff0000ff);
               var white = new MathGL.Color(0xffffffff);

               var curveColor = new MathGL.Color(0xff437bbe);


               var diffuseWhite = new MathGL.Diffuse({
                   background: white
               });

               var diffuseRed = new MathGL.Diffuse({
                   background: red
               });

               var diffuseCurve = new MathGL.Diffuse({
                   background: curveColor
               });

               var curveThreshold = new MathGL.Threshold({
                   parameter: 'x',
                   value: 'xLimit',
                   above: null,
                   below: diffuseCurve
               });

               /**
                * Entities
                */
               var xAxis = new MathGL.VectorArrow({
                   expressions: {
                       position: '[-1.5, 0, 0]',
                       value: '[3.0, 0, 0]'
                   },
                   appearance: diffuseWhite,
                   thickness: 0.01
               });
               space.add(xAxis);

               var yAxis = new MathGL.VectorArrow({
                   expressions: {
                       position: '[0, -1.5, 0]',
                       value: '[0, 3.0, 0]'
                   },
                   appearance: diffuseWhite,
                   thickness: 0.01
               });
               space.add(yAxis);

               var curve = new MathGL.Curve({
                   domain: {
                       s: [0, 1]
                   },
                   primitives: {
                       xLimit: 0.5,
                       theta: 0
                   },
                   expressions: {
                       X: 's',
                       x: 'X',
                       y: 'cos(theta)*f',
                       z: 'sin(theta)*f'
                   },
                   thickness: 0.01,
                   stepSize: 0.001,
                   appearance: curveThreshold
               });
               space.add(curve);

               var halfDistMarker = new MathGL.Curve({
                   primitives: {
                       drawRatio: 0
                   },
                   domain: {
                       d: [0, 1]
                   },
                   expressions: {
                       x: 0.5,
                       z: 0,
                       y: 'd*drawRatio*f',
                       X: 'x'
                   },
                   appearance: diffuseWhite,
                   thickness: 0.005
               });
               space.add(halfDistMarker);
               
               var cylinderCurve = new MathGL.Curve({
                   primitives: {
                       drawRatio: 0
                   },
                   domain: {
                       d: [-0.5, 0.5]
                   },
                   expressions: {
                       X: 0.5,
                       x: 'X + drawRatio*d',
                       y: 'f',
                       z: 0
                   },
                   appearance: diffuseWhite,
                   thickness: 0.005
               })
               
               space.add(cylinderCurve);

               

               /**
                * Skethed volume
                */
               var sketchedVolume = new MathGL.Scope({
                   primitives: {
                       p: 0,
                       theta: 0,
                       alpha: 0
                   }, 
                   expressions: {
                       X: 'u*p',
                       x: 'X'
                   }
               });

               space.add(sketchedVolume);

               
               var sketchedSide = new MathGL.Surface({
                   domain: {
                       u: [0, 1.0001],
                       T: [0, 3]
                   },
                   expressions: {
                       r: 'f*0.999',
                       y: 'r*cos(theta*T/3)',
                       z: 'r*sin(theta*T/3)'
                   },
                   appearance: surfaceToneDiffuse,
//                   style: 'wireframe'

               });
               sketchedVolume.add(sketchedSide);

               var sketchedTop = new MathGL.Surface({
                   domain: {
                       R: [0, 1.00],
                       T: [0, 3]
                   },
                   primitives: {
                       u: 1,
                       x: 1
                   }, 
                   expressions: {
                       r: 'R*f',
                       y: 'r*cos(theta*T/3)',
                       z: 'r*sin(theta*T/3)'
                   },

                   appearance: surfaceToneDiffuse,
//                   style: 'wireframe'

               });
               sketchedVolume.add(sketchedTop);


               var sketchedBottom = new MathGL.Surface({
                   domain: {
                       R: [0, 1.00],
                       T: [0, 3]
                   },
                   primitives: {
                       u: 0,
                       x: 0
                   }, 
                   expressions: {
                       r: 'R*f',
                       y: 'r*cos(theta*T/3)',
                       z: 'r*sin(theta*T/3)'
                   },

                   appearance: surfaceToneDiffuse,
//                   style: 'wireframe'

               });
               sketchedVolume.add(sketchedBottom);
               console.log(sketchedVolume);

               /**
                * Integrated
                */ 
               var riemannSum = new MathGL.Scope({
                   primitives: {
                       dx: 1,
                       xLimit: 1
                   },
                   expressions: {
                       X: '(xStart + xEnd)/2',
                       totalRadius: 'f',
                   }
               });

               space.add(riemannSum);

               var volumeElements = [];

               for (var i = 0; i < 10; i++) {
                   var volumeElement = new MathGL.Scope({
                       primitives: {
                           i: i,
                           width: 2,
                           theta: 2*Math.PI,
                           alpha: 0
                       }, 
                       expressions: {
                           xStart: 'dx*i',
                           xEnd: 'dx*(i+1)',
                           y: 'r*cos(theta*T)',
                           z: 'r*sin(theta*T)'
                       },
                       style: 'wireframe',
                   });
                   volumeElements.push(volumeElement);
                   riemannSum.add(volumeElement);
                   
                   var integratedSide = new MathGL.Surface({
                       domain: {
                           s: [0, 0.0101],
                           T: [0, 1]
                       },
                       expressions: {
                           x: 'xStart*(1 - s*100) + xEnd*s*100',
                           r: 'totalRadius'
                       },
                       style: 'wireframe',
                       appearance: surfaceToneDiffuse,
                       
                   });
                   volumeElement.add(integratedSide);
                   
                   var integratedTop = new MathGL.Surface({
                       domain: {
                           R: [0, 1],
                           T: [0, 1]
                       },
                       expressions: {
                           x: 'xStart',
                           r: 'R*totalRadius'
                       },
                       style: 'wireframe',
                       appearance: surfaceToneDiffuse,
                       
                   });
                   //volumeElement.add(integratedTop);
                   
                   var integratedBottom = new MathGL.Surface({
                       domain: {
                           R: [0, 1],
                           T: [0, 1]
                       },
                       expressions: {
                           x: 'xEnd',
                           r: 'R*totalRadius'
                       },
                       style: 'wireframe',
                       appearance: surfaceToneDiffuse,
                   });
                   //volumeElement.add(integratedBottom);
               }


               view.space(space);
               view.camera(camera);

               /**
                * Subscribers
                */
               function updateDimensions(update) {
                   if(update == 'canvasDim') {
                       var newDims = State.canvasDim;
                       view.dimensions(newDims.w, newDims.h);
                   }
               }
               State.subscribe(updateDimensions);

               function updateCamera(update) {
                   if(update == 'mouseState') {

                       var x = State.mouseState.mouseDiff.x;
                       var y = State.mouseState.mouseDiff.y;

                       var camX = camera.primitive('x');
                       var camY = camera.primitive('z');
                       var camZ = camera.primitive('y');

                       // cartesian => spherical
                       var r = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
                       var phi = Math.atan2(camY, camX);
                       var theta = Math.acos(camZ / r);

                       phi += x/100;

                       theta -= y/100;
                       theta = theta > Math.PI ? Math.PI : theta;
                       theta = theta < 0.001 ? 0.001 : theta;

                       // spherical => cartesian
                       camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
                       camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
                       camera.primitive('y', r*Math.cos(theta));
                   }
               }
               State.subscribe(updateCamera);

               
               function moveCamera(r, phi, theta, duration) {
                   var camX = camera.primitive('x');
                   var camY = camera.primitive('z');
                   var camZ = camera.primitive('y');

                   var oldR = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
                   var oldPhi = Math.atan2(camY, camX);
                   var oldTheta = Math.acos(camZ / r);
                   
//                   console.log(phi);
                   
                   var tween = new TWEEN.Tween( { r: oldR, phi: oldPhi, theta: oldTheta } )
                       .to( { r: r,
                              phi: phi,
                              theta: theta}, duration )
                       .easing( TWEEN.Easing.Quadratic.InOut )
                       .onUpdate( function () {
                           var theta = this.theta;
                           var phi = this.phi;
                           var r = this.r;
                           // spherical => cartesian
                           camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
                           camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
                           camera.primitive('y', r*Math.cos(theta));
                       }).start();
               }
               

               function drawCurve() {
                   var tween = new TWEEN.Tween( { x: 0 } )
                       .to( { x: 1 }, 2000 )
                       .easing( TWEEN.Easing.Quadratic.InOut )
                       .onUpdate( function () {
                           curve.primitive('xLimit', this.x);
                       }).start();
               }


               function fadeVolume() {
                   rotateCurveTween.stop();
                   sketchedVolume.primitive('p', 1);
                   curve.primitive('theta', 0);
                   var tween = new TWEEN.Tween( { x: sketchedVolume.primitive('alpha') } )
                       .to( { x: 0 }, 1000 )
                       .easing( TWEEN.Easing.Quadratic.InOut )
                       .onUpdate( function () {
                           sketchedVolume.primitive('alpha', this.x);
                       }).delay(1000).start();
               }

               function oneCylinder() {
                   
               }
               
               var rotateCurveTween = null;
               function rotateCurve() {
                   sketchedVolume.primitive('p', 1);
                   rotateCurveTween = new TWEEN.Tween( { x: 0 } )
                       .to( { x: 1 }, 3000 )
                       .easing( TWEEN.Easing.Quadratic.InOut )
                       .onUpdate( function () {
                           curve.primitive('theta', -this.x*2*Math.PI);
                           sketchedVolume.primitive('theta', -this.x*2*Math.PI);
                           sketchedVolume.primitive('alpha', this.x);
                       }).delay(1000).start();
               }


               function updateIntegralAlphas() {
                   var dx = riemannSum.primitive('dx');
                   volumeElements.forEach(function (elem, k) {
                       if ((k+1) * dx > 1) {
                           elem.primitive('alpha', 0);
                       } else {
                           elem.primitive('alpha', 1);
                       }
                   });
               }


               function drawHalfMarkers() {
                   var tween = new TWEEN.Tween({ x: 0 })
                       .to({x: 1})
                       .easing(TWEEN.Easing.Quadratic.InOut)
                       .onUpdate(function () {
                           halfDistMarker.primitive('drawRatio', this.x);
                       })
                       .chain(new TWEEN.Tween({x: 0})
                              .to({x: 1})
                              .easing(TWEEN.Easing.Quadratic.InOut)
                              .onUpdate(function () {
                                  cylinderCurve.primitive('drawRatio', this.x);
                              })
                              .chain(new TWEEN.Tween({x: 0})
                                     .to({x: 1})
                                     .easing(TWEEN.Easing.Quadratic.InOut)
                                     .onUpdate(function () {
                                         var elem = volumeElements[0];
                                         elem.primitive('alpha', this.x);
                                         elem.primitive('theta', -this.x*2*Math.PI);
                                         cylinderCurve.primitive('drawRatio', 1-this.x);
                                         halfDistMarker.primitive('drawRatio', 1-this.x);
                                     })))
                       .start();
                   
               }

               function animateDx(destination, duration) {
                   var tween = new TWEEN.Tween({ x: riemannSum.primitive('dx') })
                       .to({x: destination}, duration)
                       .easing(TWEEN.Easing.Quadratic.InOut)
                       .onUpdate(function () {
                           riemannSum.primitive('dx', this.x);
                           updateIntegralAlphas();
                       }).start();
               }

               function showEntities(update) {
                   if(update == 'activeStep') {
                       switch(State.activeStep) {
                       case 1:
                           moveCamera(3.5, Math.PI/4, Math.PI/4); 
                           rotateCurve();
                           break;
                       case 2:
                           fadeVolume();
                           moveCamera(3.5, Math.PI/2, Math.PI/2); 
                           drawHalfMarkers();
                           setTimeout(function () {
                               moveCamera(3.5, Math.PI/4, Math.PI/4); 
                           }, 2000)
                           break;
                       case 3:
                           // two cylinders
                           animateDx(0.5, 1000);
                           break;
                       case 4:
                           // ten cylinders
                           animateDx(0.1, 3000);
                           break;
                       case 5: 
                           moveCamera(3.5, Math.PI/2, 0); 
                           hideVolume();
                           showArea();
                           break;
                       case 6: 
                           hideArea();
                           moveCamera(3.5, 0, 0);
                           drawCircle();
                           break;
                       case 7:
                           drawVolume();
//                           moveCamera(3, Math.PI/4, Math.PI/4); 
                           // user can change integration borders.
                           break;
                       }
                   }
               }
               State.subscribe(showEntities);

               function updateVolumeElementPos(update) {
                   if(update == 'elementPos') {
                       riemannSum.primitive('dx', State.elementPos);
                       updateIntegralAlphas();
                   }
               }
               State.subscribe(updateVolumeElementPos);

               function xCoefficientUpdate(update) {
                   if(update == 'xCoefficient') {
                      var newValue = parseFloat(State.xCoefficient);
                      space.primitive('xCoefficient', newValue);
                   }
               }
               State.subscribe(xCoefficientUpdate);

               function updateIntegratedVolume(update) {
                   if(update == 'integrationUpperBound') {
//                       integratedVolume.primitive('p', State.integrationUpperBound);
//                       integratedTop.primitive('p', State.integrationUpperBound);
                   }
               }

               State.subscribe(updateIntegratedVolume);

               view.startRendering(update, stats);

               var endTime = new Date();

               drawCurve();
//               updateIntegralAlphas();
               




           };

           return scene;
       });
