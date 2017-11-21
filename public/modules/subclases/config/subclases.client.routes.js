'use strict';

//Setting up route
angular.module('subclases').config(['$stateProvider',
	function($stateProvider) {
		// Subclases state routing
		$stateProvider.
		state('listSubclases', {
			url: '/subclases',
			templateUrl: 'modules/subclases/views/list-subclases.client.view.html'
		}).
		state('createSubclase', {
			url: '/subclases/create',
			templateUrl: 'modules/subclases/views/create-subclase.client.view.html'
		}).
		state('viewSubclase', {
			url: '/subclases/:subclaseId',
			templateUrl: 'modules/subclases/views/view-subclase.client.view.html'
		}).
		state('editSubclase', {
			url: '/subclases/:subclaseId/edit',
			templateUrl: 'modules/subclases/views/edit-subclase.client.view.html'
		});
	}
]);