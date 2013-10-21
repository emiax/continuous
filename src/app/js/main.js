require.config({
	paths: {

		//angular
		angular: '../../bower_components/angular/angular',
		angularRoute: '../../bower_components/angular-route/angular-route',
		angularMocks: '../../bower_components/angular-mocks/angular-mocks',
		text: '../../bower_components/requirejs-text/text',
		
		graphics: '../../../app'

		// //continuous
		// 'quack':                 '../../core/lib/quack',
  //       'jquery':                '../../core/lib/jquery-2.0.3.min',
  //       'gl-matrix':             '../../core/lib/gl-matrix-min',
        
  //       'kalkyl':                '../../core/kalkyl/package',
  //       'kalkyl/format':         '../../core/kalkyl/format/package',
  //       'kalkyl/format/simple':  '../../core/kalkyl/format/simple/package',
  //       'kalkyl/format/sage':    '../../core/kalkyl/format/sage/package',
  //       'kalkyl/format/glsl':    '../../core/kalkyl/format/glsl/package',
        
  //       'communication':         '../../core/communication/package',
  //       'communication/client':  '../../core/communication/client/package',
        
  //       'mathgl':                '../../core/mathgl/package',
  //       'mathgl/engine':         '../../core/mathgl/engine/package',
  //       'errors':                '../../core/errors/package'
	},

	baseUrl: 'src/app/js',
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

// hey Angular, we're bootstrapping manually!
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
