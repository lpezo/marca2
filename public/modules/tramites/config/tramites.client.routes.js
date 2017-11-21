'use strict';

//Setting up route
angular.module('tramites').config(['$stateProvider',
	function($stateProvider) {
		// Tramites state routing
		$stateProvider.
		state('listTramites', {
			url: '/tramites',
			templateUrl: 'modules/tramites/views/list-tramites.client.view.html'
		}).
		state('createTramite', {
			url: '/tramites/create',
			templateUrl: 'modules/tramites/views/create-tramite.client.view.html'
		}).
		state('viewTramite', {
			url: '/tramites/:tramiteId',
			templateUrl: 'modules/tramites/views/view-tramite.client.view.html'
		}).
		state('editTramite', {
			url: '/tramites/:tramiteId/edit',
			templateUrl: 'modules/tramites/views/edit-tramite.client.view.html'
		});
	}
]);