'use strict';

//Derechos service used to communicate Derechos REST endpoints
angular.module('derechos').factory('Derechos', ['$resource',
	function($resource) {
		return $resource('derechos/:derechoId', { derechoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);