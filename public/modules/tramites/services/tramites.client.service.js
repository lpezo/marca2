'use strict';

//Tramites service used to communicate Tramites REST endpoints
angular.module('tramites').factory('Tramites', ['$resource',
	function($resource) {
		return $resource('tramites/:tramiteId', { tramiteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);