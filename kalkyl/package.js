define(['./exports.js',
        './expression.js',
        './function.js',
        './binaryOperator.js',
        './unaryOperator.js', 
        './plus.js', 
        './minus.js',
        './unaryMinus.js',
        './multiplication.js', 
        './cross.js', 
        './cos.js', 
        './variable.js', 
        './constant.js', 
        './matrix.js',
        './matrixNM.js', 
        './vector.js',
        './vector2.js',
        './vector3.js',
        './vectorN.js',
        './visitor.js',
        './dumper.js',
        './simplifier.js',
        './variableLister.js',
        './differentiator.js',
        './simpleFormatter.js',
        './sageFormatter.js'],
       function(exports) {
           console.log("loaded kalkyl.js");
           return exports;
       });
