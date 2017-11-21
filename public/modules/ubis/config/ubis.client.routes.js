'use strict';

//Setting up route
angular.module('ubis').config(['$stateProvider',
	function($stateProvider) {
		// Ubis state routing
		$stateProvider.
		state('listUbis', {
			url: '/ubis',
			templateUrl: 'modules/ubis/views/list-ubis.client.view.html'
		}).
		state('createUbi', {
			url: '/ubis/:ubiId/:ubiNiv/create',
			templateUrl: 'modules/ubis/views/create-ubi.client.view.html'
		}).
		state('viewUbi', {
			url: '/ubis/:ubiId',
			//url: '/ubis/:ubiNum/view',
			//templateUrl: 'modules/ubis/views/view-ubi.client.view.html'
			templateUrl: 'modules/ubis/views/list-ubis.client.view.html'
		}).
		state('editUbi', {
			url: '/ubis/:ubiId/edit',
			templateUrl: 'modules/ubis/views/edit-ubi.client.view.html'
		});

	}
]);