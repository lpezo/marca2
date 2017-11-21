'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.init = function()
		{
			if (!Authentication.user)
				$location.path('signin');
			else
				$location.path('fichavencimiento');
		};

	}
]);