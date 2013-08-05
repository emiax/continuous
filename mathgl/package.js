define(['mathgl/exports.js',
        // Scoping system / Scene graph
        'mathgl/scope.js',
        'mathgl/entity.js',
        'mathgl/space.js',
        'mathgl/surface.js',

        // Appearance nodes
        'mathgl/appearanceNode.js',
        'mathgl/fill.js',
        'mathgl/color.js',
        'mathgl/gradient.js',
        
        // Misc
        'mathgl/spaceObserver.js'],
       function(exports) {
           console.log("loaded mathgl");
           return exports;
       });


