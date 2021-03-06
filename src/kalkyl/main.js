define(function (require) {

    require('./expression');
    require('./function');
    require('./binaryOperator');
    require('./unaryOperator');
    require('./plus');

    require('./minus');
    require('./unaryMinus');
    require('./multiplication');
    require('./power');
    require('./division');
    require('./cross');

    require('./trigonometricFunction');
    require('./sin');
    require('./cos');
    require('./tan');

    require('./ln');
    require('./variable');
    require('./number');
    require('./matrix');
    require('./matrixNM');
    require('./vector');
    require('./vector2');
    require('./vector3');
    require('./vectorN');
    require('./accessor');
    require('./derivative');

    require('./visitor');
    require('./simplifier');
    require('./substitutor');
    require('./variableLister');
    require('./differentiator');
    require('./dependencyGraph');
    require('./flattener');
    require('./simpleFormatter');
    require('./dumper');

    console.log("loaded kalkyl");

    return require('./exports');
});
