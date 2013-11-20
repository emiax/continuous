require.config({
	paths: {

		//angular
		angular: 'src/bower_components/angular/angular',
        app: 'src/app/js/app',
        routes: 'src/app/js/routes',
        directives: 'src/app/js/directives',
        controllers: 'src/app/js/controllers',
        services: 'src/app/js/services',
		angularRoute: 'src/bower_components/angular-route/angular-route',
		angularMocks: 'src/bower_components/angular-mocks/angular-mocks',
		text: 'src/bower_components/requirejs-text/text'
	},

	baseUrl: '',
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	priority: [
		"angular"
	]
});

// bootstrap manually!
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes'
], function(angular, app, routes) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		$html.addClass('ng-app');
		angular.bootstrap($html, [app['name']]);
	});
});
