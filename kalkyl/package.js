define(['kalkyl/exports.js',
        // Expresison tree
        'kalkyl/expression.js',
        'kalkyl/function.js',
        'kalkyl/binaryOperator.js',
        'kalkyl/unaryOperator.js', 
        'kalkyl/plus.js', 
        'kalkyl/minus.js',
        'kalkyl/unaryMinus.js',
        'kalkyl/multiplication.js', 
        'kalkyl/power.js', 
        'kalkyl/division.js', 
        'kalkyl/cross.js', 
        'kalkyl/trigonometricFunction.js', 
        'kalkyl/sin.js', 
        'kalkyl/cos.js', 
        'kalkyl/tan.js', 
        'kalkyl/variable.js', 
        'kalkyl/constant.js', 
        'kalkyl/matrix.js',
        'kalkyl/matrixNM.js', 
        'kalkyl/vector.js',
        'kalkyl/vector2.js',
        'kalkyl/vector3.js',
        'kalkyl/vectorN.js',
        // Visitors
        'kalkyl/visitor.js',
        'kalkyl/simplifier.js',
        'kalkyl/variableLister.js',
        'kalkyl/differentiator.js',
        // Basic output of expression trees
        'kalkyl/simpleFormatter.js',
        'kalkyl/dumper.js'],
       function(exports) {
           console.log("loaded kalkyl");
           return exports;
       });
