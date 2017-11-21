'use strict';

//Setting up route
angular.module('derechos').config(['$stateProvider',
	function($stateProvider) {
		// Derechos state routing
		$stateProvider.
		state('listDerechos', {
			url: '/derechos',
			templateUrl: 'modules/derechos/views/list-derechos.client.view.html'
		}).
		state('createDerecho', {
			url: '/derechos/create',
			templateUrl: 'modules/derechos/views/create-derecho.client.view.html'
		}).
		state('viewDerecho', {
			url: '/derechos/:derechoId',
			templateUrl: 'modules/derechos/views/view-derecho.client.view.html'
		}).
		state('editDerecho', {
			url: '/derechos/:derechoId/edit',
			templateUrl: 'modules/derechos/views/edit-derecho.client.view.html'
		});
	}
]);