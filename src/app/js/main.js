window.name = "NG_DEFER_BOOTSTRAP!";

MathJax.Hub.Config({
  messageStyle: "none"
});


requirejs.config({
    baseUrl: './',

    packages: [
        "quack",
        "kalkyl",
        "kalkyl/format",
        "kalkyl/format/simple",
        "kalkyl/format/glsl",
        "kalkyl/glmatrix",

//        "gl-matrix",
        "mathgl",
        "mathgl/engine"
    ],
    paths: {
        'gl-matrix':      './bower_components/gl-matrix/dist/gl-matrix-min'
    }
});

require(['app/js/app'], function () {
    require(['app/js/routes'], function () {
        angular.bootstrap(document, ['continuousApp']);
    });
});
