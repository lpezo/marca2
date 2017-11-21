'use strict';

//Fecvens service used to communicate Fecvens REST endpoints
angular.module('fecvens').factory('Fecvens', ['$resource',
	function($resource) {
		return $resource('fecvens/:fecvenId', { fecvenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);