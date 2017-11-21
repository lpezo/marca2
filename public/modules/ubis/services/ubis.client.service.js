'use strict';

//Ubis service used to communicate Ubis REST endpoints
angular.module('ubis').factory('Ubis', ['$resource',
	function($resource) {
		return $resource('ubis/:ubiId', { ubiId: '@num'
		}, {
			update: { method: 'PUT'}
			}
		);
	}
]);



