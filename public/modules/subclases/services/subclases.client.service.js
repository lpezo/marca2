'use strict';

//Subclases service used to communicate Subclases REST endpoints
angular.module('subclases').factory('Subclases', ['$resource',
	function($resource) {
		return $resource('subclases/:subclaseId', { subclaseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('subclases').factory('Clases', ['$resource',
	function($resource) {
		return $resource('clases/:claseId', { } );
	}
]);