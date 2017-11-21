'use strict';

//Setting up route
angular.module('fecvens').config(['$stateProvider',
	function($stateProvider) {
		// Fecvens state routing
		$stateProvider.
		state('listFecvens', {
			url: '/fecvens',
			templateUrl: 'modules/fecvens/views/list-fecvens.client.view.html'
		}).
		state('createFecven', {
			url: '/fecvens/create',
			templateUrl: 'modules/fecvens/views/create-fecven.client.view.html'
		}).
		state('viewFecven', {
			url: '/fecvens/:fecvenId',
			templateUrl: 'modules/fecvens/views/view-fecven.client.view.html'
		}).
		state('editFecven', {
			url: '/fecvens/:fecvenId/edit',
			templateUrl: 'modules/fecvens/views/edit-fecven.client.view.html'
		});
	}
]);