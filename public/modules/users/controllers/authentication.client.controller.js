'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	'Path',
	function($scope, $http, $location, Authentication, Path) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		// if ($scope.authentication.user) $location.path('/');

		$scope.TableSettings = Path.getSettings('user');
		$scope.config = Path.getConfig();
		$scope.buscando = false;

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// $http.get('/auth/modules').success(function(response) {
					// $scope.authentication.modules = response;
					$location.path('/');
				// });

				// And redirect to the index page
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.iniList = function() {
			$scope.doQuery('i');
		};

		$scope.doQuery = function(comando) {	
			$scope.error = null;
			var url = {};
			//if (siguiente)
			if (comando === 'i')
			{
				url = Path.getUrlTable({}, $scope.config.count);
			}
			else if (comando === '<')
				url = Path.getPrev();
			else if (comando === '>')
				url = Path.getNext();
			else if (comando === '=')
				url = Path.getEqual();
				
			$http.get('/users', url).success(function(users){
				if (!users.results || users.results.length === 0)
					$scope.error = 'No se encontró registros con la condición ingresada';
				$scope.buscando = false;
				$scope.data = users;
				$scope.total = {cant: users.total};
			}).error(function(errorResponse){
				if (errorResponse.data)
					$scope.error = errorResponse.data.message;
				else
					$scope.error = errorResponse.message;
				$scope.buscando = false;
			});
			$scope.buscando = true;
		};

		$scope.remove = function(usu){
			if (usu)
			{
				$http.delete('/users/' + usu._id).success(function(user){
					$scope.doQuery('=');
				}).error(function(errorResponse){
					$scope.error = errorResponse.data.message;
				});
			}
		};

	}
]);