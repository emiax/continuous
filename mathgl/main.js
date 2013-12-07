define(function (require) {

    require('./scope');
    require('./entity');
    require('./space');
    require('./surface');
    require('./curve');
    require('./vectorArrow');
    require('./appearanceNode');
    require('./threshold');
    require('./fill');
    require('./color');
    require('./gradient');
    require('./checkerPattern');
    require('./spaceObserver');
    require('./camera');

    console.log("loaded mathgl");
    
    return require('./exports');
});
