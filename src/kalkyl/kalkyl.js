define(['./exports.js',
        './expression.js',
        './binaryOperator.js',
        './unaryOperator.js', 
        './plus.js', 
        './minus.js',
        './multiplication.js', 
        './cross.js', 
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
        './sageFormatter.js'],
       function(exports) {
           console.log("successfully loaded kalkyl.js");
           return exports;
       });