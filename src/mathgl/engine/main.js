define(function (require) {

    // Renderer
    require('./view');
    require('./renderer');

        // Tessellations
    require('./planeTessellation');
    require('./tubeTessellation');
    require('./arrowTessellation');

        // Renderables
    require('./renderable');

    require('./renderableSurface');
    require('./renderableCurve');

    require('./renderableVectorArrow');

        // Shaders
    require('./shader');
    require('./vertexShader');
    require('./fragmentShader');
    require('./shaderProgram');
        
    require('./symbolCategorization');
    require('./shaderSymbolDictionary');

    require('./shaderFormatter');
    require('./fragmentShaderFormatter');
    require('./vertexShaderFormatter');

        // Shader strategies
    require('./entityShaderStrategy');
    require('./curveShaderStrategy');
    require('./surfaceShaderStrategy');
    require('./vectorArrowShaderStrategy');

        // Shadelets
    require('./shadelet');
    require('./colorShadelet');
    require('./gradientShadelet');
    require('./checkerPatternShadelet');
    require('./diffuseShadelet');
    require('./thresholdShadelet');


        // Utilities
    require('./triangleSorter');
    
    console.log('loaded mathgl.engine');
    return require('./exports');
})
