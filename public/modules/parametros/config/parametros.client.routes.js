'use strict';

//Setting up route
angular.module('parametros').config(['$stateProvider',
	function($stateProvider) {
		// Parametros state routing
		$stateProvider.
		state('listParametros', {
			url: '/parametros',
			templateUrl: 'modules/parametros/views/list-parametros.client.view.html'
		}).
		state('createParametro', {
			url: '/parametros/create',
			templateUrl: 'modules/parametros/views/create-parametro.client.view.html'
		}).
		state('configParametro', {
			url: '/parametros/config',
			templateUrl: 'modules/parametros/views/config-parametros.client.view.html'
		}).
		state('viewParametro', {
			url: '/parametros/:parametroId',
			templateUrl: 'modules/parametros/views/view-parametro.client.view.html'
		}).
		state('editParametro', {
			url: '/parametros/:parametroId/edit',
			templateUrl: 'modules/parametros/views/edit-parametro.client.view.html'
		});
	}
]);