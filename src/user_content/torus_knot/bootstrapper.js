requirejs.config({
    baseUrl: './user_content/torus_knot/'
});
define(['state', 'gui'],
    function(state, gui) {
        return { state: state, gui: gui };
});
