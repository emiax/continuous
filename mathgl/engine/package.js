define(['mathgl/engine/exports.js',
        // View
        'mathgl/engine/view.js',
        // Renderer
        'mathgl/engine/renderer.js',

        // Tessellations
        'mathgl/engine/planeTessellation.js',

        // Renderables
        'mathgl/engine/renderable.js',
        'mathgl/engine/renderableSurface.js',

        // Shaders
        'mathgl/engine/shader.js',
        'mathgl/engine/vertexShader.js',
        'mathgl/engine/fragmentShader.js',
        'mathgl/engine/shaderProgram.js',

        'mathgl/engine/shaderGenerator.js'

       ],
       function(exports) {
           console.log("loaded mathgl.engine");
           return exports;
       });


