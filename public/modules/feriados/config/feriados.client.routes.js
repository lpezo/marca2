'use strict';

//Setting up route
angular.module('feriados').config(['$stateProvider',
	function($stateProvider) {
		// Feriados state routing
		$stateProvider.
		state('listFeriados', {
			url: '/feriados',
			templateUrl: 'modules/feriados/views/list-feriados.client.view.html'
		}).
		state('createFeriado', {
			url: '/feriados/create',
			templateUrl: 'modules/feriados/views/create-feriado.client.view.html'
		}).
		state('viewFeriado', {
			url: '/feriados/:feriadoId',
			templateUrl: 'modules/feriados/views/view-feriado.client.view.html'
		}).
		state('editFeriado', {
			url: '/feriados/:feriadoId/edit',
			templateUrl: 'modules/feriados/views/edit-feriado.client.view.html'
		});
	}
]);