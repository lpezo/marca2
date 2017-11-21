'use strict';

//Feriados service used to communicate Feriados REST endpoints
angular.module('feriados').factory('Feriados', ['$resource',
	function($resource) {
		return $resource('feriados/:feriadoId', { feriadoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);