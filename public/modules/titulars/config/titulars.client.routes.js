'use strict';

//Setting up route
angular.module('titulars').config(['$stateProvider',
	function($stateProvider) {
		// titulars state routing
		$stateProvider.
		state('listtitulars', {
			url: '/titulars',
			templateUrl: 'modules/titulars/views/list-titulars.client.view.html'
		}).
		state('createtitular', {
			url: '/titulars/create',
			templateUrl: 'modules/titulars/views/create-titular.client.view.html'
		}).
		state('viewtitular', {
			url: '/titulars/:titularId',
			templateUrl: 'modules/titulars/views/view-titular.client.view.html'
		}).
		state('edittitular', {
			url: '/titulars/:titularId/edit',
			templateUrl: 'modules/titulars/views/edit-titular.client.view.html'
		});
	}
]);