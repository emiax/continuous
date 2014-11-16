define([
  'require',
  'kalkyl',
  'kalkyl/format/simple',
  'mathgl',
  'mathgl/engine'],

function(require, Kalkyl, SimpleFormat, MathGL, Engine) {

  var scene = function() {
    var State = require('./state');
    var canvas = document.getElementById('canvas');
    var view = new Engine.View(canvas);

    var parser = new SimpleFormat.Parser();
    var xExpr = parser.parse('y + x');
    var yExpr = parser.parse('-x');

    var xExprDx = xExpr.differentiated('x');
    var yExprDy = yExpr.differentiated('y');

    var space = new MathGL.Space({
      primitives: {
        time: 0,
        circlePosX: 0,
        circlePosY: 0,
        vectorFieldOpacity: 1,
        showFluxColor: 0,
        showFluxNormals: 0,
        fluxNormalsStretch: 0,
        contourArcT: 0
      },
      expressions: {
        Ax: xExpr,
        Ay: yExpr,
        AxDx: xExprDx,
        AyDy: yExprDy
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

    var t = 0;
    function update() {
      ++t;
      space.primitive('time', t/100);
      vectorField.forEach(function (fieldVector) {
        var x = fieldVector.primitive('x');
        var y = fieldVector.primitive('y');
        var lifetime = fieldVector.primitive('lifetime');


        var dx = xExpr.evaluated({
          x: x,
          y: y,
          time: t/100
        });

        var dy = yExpr.evaluated({
          x: x,
          y: y,
          time: t/100
        });

        var newX = (x + dx.value()*0.0025);
        var newY = (y + dy.value()*0.0025);
        var newLifetime = lifetime + 1;

        if (newX < -2 || newX > 2 || newY < -2 || newY > 2) {
          updateDensityMap();

          var pos = findMinDensity();

          newX = pos.x + Math.random() * 0.1 - 0.05;
          newY = pos.y + Math.random() * 0.1 - 0.05;
          newLifetime = 0;
        }
        fieldVector.primitive('x', newX);
        fieldVector.primitive('y', newY);
        fieldVector.primitive('lifetime', newLifetime)
      });
    }

    // appearance.
    var red = new MathGL.Color(0xffff0000);
    var pink = new MathGL.Color(0xffff4444);
    var transparentRed = new MathGL.Color(0x00cc0000);
    var green = new MathGL.Color(0xff00cc00);
    var darkBlue = new MathGL.Color(0x880000cc);
    var blue = new MathGL.Color(0xff0000ff);
    var lightBlue = new MathGL.Color(0xff7799ff);
    var transparentBlue = new MathGL.Color(0x000000ff);
    var white = new MathGL.Color(0xffffffff);

    var curveColor = new MathGL.Color(0xff437bbe);
    var gray = new MathGL.Color(0xff555555);

    var diffuseWhite = new MathGL.Diffuse({
      background: white
    });

    var diffuseGray = new MathGL.Diffuse({
      background: gray
    });

    var diffuseRed = new MathGL.Diffuse({
      background: red
    });

    var diffuseCurve = new MathGL.Diffuse({
      background: curveColor
    });

    // var arrowColor = new MathGL.Gradient({
    //   parameter: 'magnitude2',
    //   stops: {
    //     0: blue,
    //     2: red
    //   }
    // });

    // var transparentArrowColor = new MathGL.Gradient({
    //   parameter: 'magnitude2',
    //   stops: {
    //     0: transparentBlue,
    //     2: transparentRed
    //   }
    // });

    var arrowColor = new MathGL.Color(0xffffffff);
    var transparentArrowColor = new MathGL.Color(0x00ffffff);

    var fieldArrowAppearance = new MathGL.Gradient({
      parameter: 'vectorFieldOpacity',
      stops: {
        '0': transparentArrowColor,
        '1': new MathGL.Gradient({
          parameter: 'r2',
          stops: {
            '1.5': new MathGL.Gradient({
              parameter: 'lifetime',
              stops: {
                '0': transparentArrowColor,
                '100': arrowColor
              }
            }),
            '2.0': transparentArrowColor
          }
        })
      }
    });

    var contourNormalAppearance = new MathGL.Gradient({
      parameter: 'showFluxNormals',
      stops: {
        '0': transparentArrowColor,
        '1': lightBlue
      }
    });

    var divergenceApperance = new MathGL.Gradient({
      parameter: 'div',
      stops: {
        '-0.5': blue,
        '0.5': red
      }
    });

    var fluxApperance = new MathGL.Gradient({
      parameter: 'showFluxColor',
      stops: {
        '0': white,
        '1': new MathGL.Gradient({
          parameter: 'flux',
          stops: {
            // '-0.5': blue,
            '0': white,
            '0.5': pink,
            '2': red
          }
        })
      }
    });

    /**
     * Scene Entities
     */
    var divergenceZone = new MathGL.Surface({
      domain: {
        r: [0, 1],
        theta: [0, 2*Math.PI]
      },
      expressions: {
        x: 'r*cos(theta)',
        y: 'r*sin(theta)',
        z: '0',
        div: 'AxDx + AyDy'
      },
      appearance: divergenceApperance
    });
    // space.add(divergenceZone);

    var fluxContour = new MathGL.Curve({
      domain: {
        theta: [0, 2*Math.PI]
      },
      expressions: {
        x: 'circlePosX + r*cos(contourArcT*theta)',
        y: 'circlePosY + r*sin(contourArcT*theta)',
        z: '0',
        flux: 'Ax*x + Ay*y'
      },
      primitives: {
        r: 0.5,
        t: 0
      },
      appearance: fluxApperance,
      thickness: 0.01,
      stepSize: 0.01
    });
    space.add(fluxContour);

    var xAxis = new MathGL.VectorArrow({
      expressions: {
        position: '[-1.5, 0, 0]',
        value: '[3.0, 0, 0]'
      },
      appearance: diffuseGray,
      thickness: 0.005
    });
    space.add(xAxis);

    var yAxis = new MathGL.VectorArrow({
      expressions: {
        position: '[0, -1.5, 0]',
        value: '[0, 3.0, 0]'
      },
      appearance: diffuseGray,
      thickness: 0.005
    });
    space.add(yAxis);

    var vectorField = [];
    for (var i = -3; i <= 3; i++) {
      for (var j = -3; j <= 3; j++) {
        var fieldVector = new MathGL.VectorArrow({
          expressions: {
            position: '[x, y, 0.01]',
            value: '[Ax*0.2, Ay*0.2, 0]',
            magnitude2: 'Ax*Ax + Ay*Ay',
            r2: 'x*x + y*y'
          },
          primitives: {
            x: i*0.33 + Math.random() * 0.1 - 0.05,
            y: j*0.33 + Math.random() * 0.1 - 0.05,
            lifetime: 0
          },
          appearance: fieldArrowAppearance,
          thickness: 0.01
        });
        vectorField.push(fieldVector);
        space.add(fieldVector);
      }
    }

    var contourNormals = [];
    for (var i = 0; i < 8; i++) {
      var contourNormal = new MathGL.VectorArrow({
        expressions: {
          position: '[circlePosX + x, circlePosY + y, 0.01]',
          value: '[x*0.2*(fluxNormalsStretch + 0.3), y*0.2*(fluxNormalsStretch + 0.3), 0]',
          x: 'r*cos(contourArcT*radians)',
          y: 'r*sin(contourArcT*radians)',
        },
        primitives: {
          r: 0.5 + 0.005,
          radians: i*2*Math.PI/8
        },
        appearance: contourNormalAppearance,
        thickness: 0.01
      });
      contourNormals.push(contourNormal);
      space.add(contourNormal);
    }

    var width = 10;
    var height = 10;
    var densityMap = new Float32Array(width*height);

    view.space(space);
    view.camera(camera);

    /**
     * Utilities
     */
    function updateDensityMap() {
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          var idx = i + j*width;
          densityMap[idx] = 0;
        }
      }

      vectorField.forEach(function (fieldVector) {
        var x = fieldVector.primitive('x');
        var y = fieldVector.primitive('y');

        for (var j = 0; j < height; j++) {
          for (var i = 0; i < width; i++) {
            var idx = i + j*width;
            var worldX = i/width - 0.5;
            var worldY = j/height - 0.5;
            var dx = 10*(x - worldX);
            var dy = 10*(y - worldY);
            var density = dx*dx + dy*dy + 1;

            densityMap[idx] += 1/(density*density);
          }
        }
      });
    }

    function findMinDensity() {
      var min = Number.MAX_VALUE;
      var minPos;
      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          var idx = i + j*width;
          var sample = densityMap[idx];
          if (sample < min) {
            min = sample;
            minPos = {x: i/width - 0.5, y: j/height - 0.5};
            //console.log(minPos);
          }
        }
      }
      return minPos;
    }

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

        var scaleFactor = 4/canvas.height;

        var currentX = space.primitive('circlePosX');
        var currentY = space.primitive('circlePosY');
        space.primitive('circlePosX', currentX + x*scaleFactor);
        space.primitive('circlePosY', currentY - y*scaleFactor);

        // var camX = camera.primitive('x');
        // var camY = camera.primitive('z');
        // var camZ = camera.primitive('y');

        // // cartesian => spherical
        // var r = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
        // var phi = Math.atan2(camY, camX);
        // var theta = Math.acos(camZ / r);

        // phi += x/100;

        // theta -= y/100;
        // theta = theta > Math.PI ? Math.PI : theta;
        // theta = theta < 0.001 ? 0.001 : theta;

        // // spherical => cartesian
        // camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
        // camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
        // camera.primitive('y', r*Math.cos(theta));
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

      var tween = new TWEEN.Tween( { r: oldR, phi: oldPhi, theta: oldTheta } )
        .to({ r: r, phi: phi, theta: theta}, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate( function () {
           var theta = this.theta;
           var phi = this.phi;
           var r = this.r;
               // spherical => cartesian
               camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
               camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
               camera.primitive('y', r*Math.cos(theta));
             })
        .start();
    }

    function showEntities(update) {
      if(update == 'activeStep') {
        switch(State.activeStep) {
          case 1:
            drawContour();
            break;
          case 2:
          break;
          case 3:
          break;
          case 4:
          break;
          case 5:
          break;
          case 6:
          break;
          case 7:
          break;
        }
      }
    }
    State.subscribe(showEntities);

    function toggleVectorField(update) {
      if (update == 'showVectorField') {
        if (State.showVectorField) {
          space.primitive('vectorFieldOpacity', 1);
        } else {
          space.primitive('vectorFieldOpacity', 0);
        }
      }
    }
    State.subscribe(toggleVectorField);

    function toggleFluxContour(update) {
      if (update == 'showFluxContour') {
        if (State.showFluxContour) {
          var tween = new TWEEN.Tween( { x: 0 } )
             .to({ x: 1 }, 1000)
             .easing(TWEEN.Easing.Quadratic.InOut)
             .onUpdate( function () {
                 space.primitive('contourArcT', this.x);
             }).start();
        } else {
          space.primitive('contourArcT', 0);
        }
      }
    }
    State.subscribe(toggleFluxContour);

    function toggleFluxColor(update) {
      if (update == 'showFluxColor') {
        if (State.showFluxColor) {
          space.primitive('showFluxColor', 1);
        } else {
          space.primitive('showFluxColor', 0);
        }
      }
    }
    State.subscribe(toggleFluxColor);

    function toggleFluxNormals(update) {
      if (update == 'showFluxNormals' || update == 'showFluxContour') {
        if (State.showFluxNormals && State.showFluxContour) {
          space.primitive('showFluxNormals', 1);
          var tween = new TWEEN.Tween( { x: 0 } )
             .to({ x: 1 }, 300)
             .easing(TWEEN.Easing.Quadratic.InOut)
             .onUpdate( function () {
                 space.primitive('fluxNormalsStretch', this.x);
             }).start();
        } else {
          space.primitive('showFluxNormals', 0);
          space.primitive('fluxNormalsStretch', 0);
        }
      }
    }
    State.subscribe(toggleFluxNormals);

    view.startRendering(update, stats);
  };

  return scene;
});