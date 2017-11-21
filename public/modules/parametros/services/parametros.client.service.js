'use strict';

//Parametros service used to communicate Parametros REST endpoints
angular.module('parametros').factory('Parametros', ['$resource',
	function($resource) {
		return $resource('parametros/:parametroId', { parametroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Parametros service used to communicate Parametros REST endpoints
angular.module('parametros').factory('ParametrosCod', ['$resource',
	function($resource) {
		return $resource('parametros/codigo/:parametroCod', { parametroId: '@codigo'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);