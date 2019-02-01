'use strict';

//Setting up route
angular.module('fichas').config(['$stateProvider',
	function($stateProvider) {
		// Fichas state routing
		$stateProvider.
		state('listFichas', {
			url: '/fichas',
			templateUrl: 'modules/fichas/views/list-fichas.client.view.html'
		}).
		state('createFicha', {
			url: '/fichas/create',
			templateUrl: 'modules/fichas/views/create-ficha.client.view.html'
		}).
		state('viewFicha', {
			url: '/fichas/:fichaId',
			templateUrl: 'modules/fichas/views/view-ficha.client.view.html'
		}).
		state('editFicha', {
			url: '/fichas/:fichaId/edit',
			templateUrl: 'modules/fichas/views/edit-ficha.client.view.html'
		}).
		state('editFechaFicha', {
			url: '/fichas/:fichaId/fecha',
			templateUrl: 'modules/fichas/views/editfecha-ficha.client.view.html'
		}).
		state('report1Ficha', {
			url: '/fichas/reporte/1',
			templateUrl: 'modules/fichas/views/reporte1-ficha.client.view.html'
		}).
		state('pdfFicha', {
			url: '/fichas/pdf/1',
			templateUrl: 'modules/fichas/views/reporte_print-ficha.client.view.html'
		}).
		state('vencimientoFicha', {
			url: '/fichavencimiento',
			templateUrl: 'modules/fichas/views/list-venc.client.view.html'
		});
	}
]);