window.name = "NG_DEFER_BOOTSTRAP!";

require(['src/app/js/app'], function () {
    require(['src/app/js/routes'], function () {
        angular.bootstrap(document, ['continuousApp']);
    });
});
