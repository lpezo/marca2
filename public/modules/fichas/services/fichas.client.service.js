'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('Fichas', ['$resource',
	function($resource) {
		return $resource('fichas/:fichaId', { fichaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);