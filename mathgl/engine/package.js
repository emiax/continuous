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
        
        // Shader generators
        'mathgl/engine/shaderProgramGenerator.js',
        'mathgl/engine/vertexShaderGenerator.js',
        'mathgl/engine/fragmentShaderGenerator.js',

        'mathgl/engine/symbolCategorization.js',
        'mathgl/engine/shaderSymbolDictionary.js',

        'mathgl/engine/shaderFormatter.js',
        'mathgl/engine/fragmentShaderFormatter.js',
        'mathgl/engine/vertexShaderFormatter.js',

        // Shadelets
        'mathgl/engine/shadelet.js',
        'mathgl/engine/colorShadelet.js',
        'mathgl/engine/gradientShadelet.js',
        'mathgl/engine/checkerPatternShadelet.js'
        
       ],
       function(exports) {
           console.log("loaded mathgl.engine");
           return exports;
       });


