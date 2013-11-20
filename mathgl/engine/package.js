define(['mathgl/engine/exports.js',
        // View
        'mathgl/engine/view.js',
        // Renderer
        'mathgl/engine/renderer.js',

        // Tessellations
        'mathgl/engine/planeTessellation.js',
        'mathgl/engine/tubeTessellation.js',

        // Renderables
        'mathgl/engine/renderable.js',
        'mathgl/engine/renderableSurface.js',
        'mathgl/engine/renderableCurve.js',

        // Shaders
        'mathgl/engine/shader.js',
        'mathgl/engine/vertexShader.js',
        'mathgl/engine/fragmentShader.js',
        'mathgl/engine/shaderProgram.js',
        
        'mathgl/engine/symbolCategorization.js',
        'mathgl/engine/shaderSymbolDictionary.js',

        'mathgl/engine/shaderFormatter.js',
        'mathgl/engine/fragmentShaderFormatter.js',
        'mathgl/engine/vertexShaderFormatter.js',

        // Shader strategies
        'mathgl/engine/entityShaderStrategy.js',
        'mathgl/engine/curveShaderStrategy.js',
        'mathgl/engine/surfaceShaderStrategy.js',

        // Shadelets
        'mathgl/engine/shadelet.js',
        'mathgl/engine/colorShadelet.js',
        'mathgl/engine/gradientShadelet.js',
        'mathgl/engine/checkerPatternShadelet.js',
        'mathgl/engine/thresholdShadelet.js',


        // Utilities
        'mathgl/engine/triangleSorter.js'
        
       ],
       function(exports) {
           console.log("loaded mathgl.engine");
           return exports;
       });


