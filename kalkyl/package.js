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
        'kalkyl/ln.js', 
        'kalkyl/variable.js', 
        'kalkyl/number.js', 
        'kalkyl/matrix.js',
        'kalkyl/matrixNM.js', 
        'kalkyl/vector.js',
        'kalkyl/vector2.js',
        'kalkyl/vector3.js',
        'kalkyl/vectorN.js',

        'kalkyl/accessor.js',
        'kalkyl/derivative.js',
        
        // Visitors
        'kalkyl/visitor.js',
        'kalkyl/simplifier.js',
        'kalkyl/substitutor.js',
        'kalkyl/variableLister.js',
        'kalkyl/differentiator.js',
        // Misc.
//        'kalkyl/topologicalSorter.js',
        'kalkyl/dependencyGraph.js',
        'kalkyl/flattener.js',
        // Basic output of expression trees
        'kalkyl/simpleFormatter.js',
        'kalkyl/dumper.js'],
       function(exports) {
           console.log("loaded kalkyl");
           return exports;
       });
