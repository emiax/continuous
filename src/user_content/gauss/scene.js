define([
  'require',
  'kalkyl',
  'kalkyl/format/simple',
  'mathgl',
  'mathgl/engine'],

function(require, Kalkyl, SimpleFormat, MathGL, Engine) {

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
        0: new MathGL.Color(0xff999900),
        1: new MathGL.Color(0xff994400),
        2: new MathGL.Color(0xffc232a5)
      }
    });
    var surfaceTransparent = new MathGL.Color(0x00998866);

    var surfaceTone = new MathGL.Gradient({
      parameter: 'alpha',
      stops: {
        0: surfaceTransparent,
        1: surfaceWhite
      }
    });

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

    /**
     * Scene Entities
     */

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
  };

  return scene;
});