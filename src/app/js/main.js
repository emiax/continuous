window.name = "NG_DEFER_BOOTSTRAP!";

MathJax.Hub.Config({
  messageStyle: "none"
});

require(['src/app/js/app'], function () {
    require(['src/app/js/routes'], function () {
        angular.bootstrap(document, ['continuousApp']);
    });
});
