define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angularRoute',
	], function (angular, filters, services, directives, controllers) {
		'use strict';

		return angular.module('continuous', [
			'ngRoute',
			'continuous.controllers',
			'continuous.filters',
			'continuous.services',
			'continuous.directives'
		]);
});
