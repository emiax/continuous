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
    var xExpr = parser.parse('2*x');
    var yExpr = parser.parse('-y');

    var xExprDx = xExpr.differentiated('x');
    var yExprDy = yExpr.differentiated('y');

    var space = new MathGL.Space({
      primitives: {
        circlePosX: 0,
        circlePosY: 0,
        vectorFieldOpacity: 1,
        showDivergenceZone: 0,
        showFluxColor: 0,
        showFluxNormals: 0,
        showContourVectorField: 0,
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

    function update() {
      vectorField.forEach(function (fieldVector) {
        var x = fieldVector.primitive('x');
        var y = fieldVector.primitive('y');
        var lifetime = fieldVector.primitive('lifetime');

        var dx = xExpr.evaluated({
          x: x,
          y: y
        });

        var dy = yExpr.evaluated({
          x: x,
          y: y
        });

        var newX = (x + dx.value()*0.0025);
        var newY = (y + dy.value()*0.0025);
        var newLifetime = lifetime + 1;

        if (newX < -1.0 || newX > 1.0 || newY < -2 || newY > 2) {
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
    var transparentRed = new MathGL.Color(0x00ff0000);
    var translucentRed = new MathGL.Gradient({
      parameter: 'opacity',
      stops: {
        '0': transparentRed,
        '1': red
      }
    });

    var pink = new MathGL.Color(0xffffaaaa);
    var transparentPink = new MathGL.Color(0x00ffaaaa);
    var translucentPink = new MathGL.Gradient({
      parameter: 'opacity',
      stops: {
        '0': transparentPink,
        '1': pink
      }
    });

    var green = new MathGL.Color(0xff00cc00);

    var blue = new MathGL.Color(0xff0011ff);
    var transparentBlue = new MathGL.Color(0x000011ff);
    var translucentBlue = new MathGL.Gradient({
      parameter: 'opacity',
      stops: {
        '0': transparentBlue,
        '1': blue
      }
    });

    var lightBlue = new MathGL.Color(0xffaaccff);
    var transparentLightBlue = new MathGL.Color(0x00aaccff);
    var translucentLightBlue = new MathGL.Gradient({
      parameter: 'opacity',
      stops: {
        '0': transparentLightBlue,
        '1': lightBlue
      }
    });

    var white = new MathGL.Color(0xffffffff);
    var transparentWhite = new MathGL.Color(0x00ffffff);
    var translucentWhite = new MathGL.Gradient({
      parameter: 'opacity',
      stops: {
        '0': transparentWhite,
        '1': white
      }
    });

    var translucentGray = new MathGL.Color(0x77999999);

    var curveColor = new MathGL.Color(0xff437bbe);
    var gray = new MathGL.Color(0xff555555);

    var diffuseWhite = new MathGL.Diffuse({
      background: white
    });

    var diffuseTranslucentWhite = new MathGL.Diffuse({
      background: translucentWhite
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

    var lifeTimeGradient = new MathGL.Gradient({
      parameter: 'lifetime',
      stops: {
        '0': transparentArrowColor,
        '100': arrowColor
      }
    });

    var fieldArrowAppearance = new MathGL.Gradient({
      parameter: 'vectorFieldOpacity',
      stops: {
        '0': transparentArrowColor,
        '1': new MathGL.Gradient({
          parameter: 'x',
          stops: {
            '-1.0': transparentArrowColor,
            '-0.7': lifeTimeGradient,
            '0.7' : lifeTimeGradient,
            '1.0': transparentArrowColor
          }
        })
      }
    });

    var contourNormalAppearance = new MathGL.Gradient({
      parameter: 'showFluxNormals',
      stops: {
        '0': transparentArrowColor,
        '1': green
      }
    });

    var contourVectorFieldAppearance = new MathGL.Gradient({
      parameter: 'showContourVectorField',
      stops: {
        '0': transparentArrowColor,
        '1': white
      }
    });

    var divergenceApperance = new MathGL.Gradient({
      parameter: 'showDivergenceZone',
      stops: {
        '0': transparentRed,
        '1': new MathGL.Gradient({
          parameter: 'div',
          stops: {
            '-7': blue,
            '0': white,
            '7': red
          }
        })
      }
    });

    var fluxApperance = new MathGL.Gradient({
      parameter: 'showFluxColor',
      stops: {
        '0': white,
        '1': new MathGL.Gradient({
          parameter: 'flux',
          stops: {
            '-3': blue,
            '-0.5': lightBlue,
            '0': white,
            '0.5': pink,
            '3': red
          }
        })
      }
    });

    var translucentFluxAppearence = new MathGL.Gradient({
      parameter: 'showFluxColor',
      stops: {
        '0': translucentWhite,
        '1': new MathGL.Gradient({
          parameter: 'flux',
          stops: {
            '-7': translucentBlue,
            '-0.5': translucentLightBlue,
            '0': translucentWhite,
            '0.5': translucentPink,
            '7': translucentRed
          }
        })
      }
    });

    /**
     * Scene Entities
     */
    var divergenceZone = new MathGL.Surface({
      domain: {
        r: [0, 0.5],
        theta: [0, 2*Math.PI]
      },
      expressions: {
        x: 'circlePosX + r*cos(theta)',
        y: 'circlePosY + r*sin(theta)',
        z: '0.01',
        div: 'AxDx + AyDy'
      },
      appearance: divergenceApperance
    });
    space.add(divergenceZone);

    var fluxContour = new MathGL.Curve({
      domain: {
        theta: [0, 2*Math.PI]
      },
      expressions: {
        x: 'circlePosX + r*cos(contourArcT*theta)',
        y: 'circlePosY + r*sin(contourArcT*theta)',
        z: '0.01',
        flux: 'Ax*cos(contourArcT*theta) + Ay*sin(contourArcT*theta)'
      },
      primitives: {
        r: 0.5,
        t: 0
      },
      appearance: fluxApperance,
      thickness: 0.01,
      stepSize: 0.1
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
    for (var i = -2; i <= 2; i++) {
      for (var j = -1; j <= 1; j++) {
        var fieldVector = new MathGL.VectorArrow({
          expressions: {
            position: '[x, y, 0.01]',
            value: '[Ax*0.2, Ay*0.2, 0]',
          },
          primitives: {
            x: i*0.33 + Math.random() * 0.3 - 0.15,
            y: j*0.33 + Math.random() * 0.3 - 0.15,
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
    for (var i = 1; i < 8; i += 2) {
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

    var contourVectorField = [];
    for (var i = 1; i < 8; i += 2) {
      var contourFieldVector = new MathGL.VectorArrow({
        expressions: {
          position: '[x, y, 0.01]',
          value: '[Ax*0.2, Ay*0.2, 0]',
          x: 'circlePosX + r*cos(contourArcT*radians)',
          y: 'circlePosY + r*sin(contourArcT*radians)',
        },
        primitives: {
          r: 0.5 + 0.005,
          radians: i*2*Math.PI/8
        },
        appearance: contourVectorFieldAppearance,
        thickness: 0.01
      });
      contourVectorField.push(contourFieldVector);
      space.add(contourFieldVector);
    }

    var fluxSphere = new MathGL.Surface({
      domain: {
        T: [0, Math.PI],
        P: [0, 2*Math.PI]
      },
      primitives: {
        r: 0.5,
        opacity: 0
      },
      expressions: {
        x: 'circlePosX + r*sin(T)*cos(P)',
        y: 'circlePosY + r*sin(T)*sin(P)',
        z: 'r*cos(T)',
        flux: 'Ax*cos(P) + Ay*sin(P)'
      },
      appearance: translucentFluxAppearence
    });
    space.add(fluxSphere);

    view.space(space);
    view.camera(camera);

    /**
     * Utilities
     */

    var width = 0.5;
    var height = 1;
    var wRes = 4;
    var hRes = 6;
    var densityMap = new Float32Array(wRes*hRes);

    function updateDensityMap() {
      for (var j = 0; j < hRes; j++) {
        for (var i = 0; i < wRes; i++) {
          var idx = i + j*wRes;
          densityMap[idx] = 0;
        }
      }

      vectorField.forEach(function (fieldVector) {
        var x = fieldVector.primitive('x');
        var y = fieldVector.primitive('y');

        for (var j = 0; j < hRes; j++) {
          for (var i = 0; i < wRes; i++) {
            var idx = i + j*wRes;
            var worldX = width*(i/(wRes-1) - 0.5);
            var worldY = height*(j/(hRes-1) - 0.5);
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
      for (var j = 0; j < hRes; j++) {
        for (var i = 0; i < wRes; i++) {
          var idx = i + j*wRes;
          var sample = densityMap[idx];
          if (sample < min) {
            min = sample;
            minPos = {x: width*(i/(wRes-1) - 0.5), y: height*(j/(hRes-1) - 0.5)};
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
      }
    }
    State.subscribe(updateCamera);

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

    function toggleDivergenceZone(update) {
      if (update == 'showDivergenceZone') {
        if (State.showDivergenceZone) {
          space.primitive('showDivergenceZone', 1);
        } else {
          space.primitive('showDivergenceZone', 0);
        }
      }
    }
    State.subscribe(toggleDivergenceZone);

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

    function toggleContourVectorField(update) {
      if (update == 'showContourVectorField' || update == 'showFluxContour') {
        if (State.showContourVectorField && State.showFluxContour) {
          space.primitive('showContourVectorField', 1);
        } else {
          space.primitive('showContourVectorField', 0);
        }
      }
    }
    State.subscribe(toggleContourVectorField);

    function moveCamera(r, phi, theta, duration) {
      var camX = camera.primitive('x');
      var camY = camera.primitive('z');
      var camZ = camera.primitive('y');

      var oldR = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
      var oldPhi = Math.atan2(camY, camX);
      var oldTheta = Math.acos(camZ / oldR);

      var tween = new TWEEN.Tween({ r: oldR, phi: oldPhi, theta: oldTheta })
        .to({ r: r,
          phi: phi,
          theta: theta
        }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
          var theta = this.theta;
          var phi = this.phi;
          var r = this.r;
          // spherical => cartesian
          camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
          camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
          camera.primitive('y', r*Math.cos(theta));
        }).start();
    }

    function toggle3D(update) {
      if (update == 'view3D') {
        if (State.view3D) {
          moveCamera(2, Math.PI/2, 5*Math.PI/6, 1000);
          var tween = new TWEEN.Tween( { x: 0 } )
            .to({ x: 0.7 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
              fluxSphere.primitive('opacity', this.x);
            }).start();
        } else {
          moveCamera(3.5, Math.PI/2, Math.PI/2, 1000);
          var tween = new TWEEN.Tween( { x: 0.7 } )
            .to({ x: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
              fluxSphere.primitive('opacity', this.x);
            }).start();
        }
      }
    }
    State.subscribe(toggle3D);

    view.startRendering(update, stats);
  };

  return scene;
});
