'use strict';

// Parametros controller
angular.module('parametros').controller('ParametrosController', ['$scope', '$q', '$stateParams', '$location', 'Authentication', 'Parametros', 'TableSettings', 'ParametrosForm',
	function($scope, $q, $stateParams, $location, Authentication, Parametros, TableSettings, ParametrosForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Parametros);
		$scope.parametro = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = ParametrosForm.getFormFields(disabled);
		};


		// Create new Parametro
		$scope.create = function() {
			var parametro = new Parametros($scope.parametro);

			// Redirect after save
			parametro.$save(function(response) {
				$location.path('parametros/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Parametro
		$scope.remove = function(parametro) {

			if ( parametro ) {
				parametro = Parametros.get({parametroId:parametro._id}, function() {
					parametro.$remove(function(){
						$scope.tableParams.reload();						
					});
				});

			} else {
				$scope.parametro.$remove(function() {
					$location.path('parametros');
				});
			}

		};

		// Update existing Parametro
		$scope.update = function() {
			var parametro = $scope.parametro;

			parametro.$update(function() {
				$location.path('parametros/' + parametro._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.updateParametros = function(parametros)
		{
			//console.log('updateParametros-->', parametros);
			$scope.error = '';

			/*
			parametros.forEach(function(param)
			{
				console.log(param.codigo, '-->', param.change);
				if (param && param.change && param.change === '*')
				{
					var params = new Parametros(param);
					params.$update(function() {

					}, function(error) {
						$scope.error = error.data.message;
						return;
					});
				}
			});
			*/
			var promises = [];

			angular.forEach(parametros, function(param) {
				//var deffered = $q.defer();
				//console.log(param.codigo, '-->', param.change);
				if (param && param.change && param.change === '*')
				{
					var params = new Parametros(param);
					var promise = params.$update();
					promises.push(promise);
				}
			});

			$q.all(promises)
				.then(function(data){
					console.log(data);
					$location.path('#!');
				}, function(error){
					$scope.error = error.data.message;
					//console.log('error:', error);
				});

			//Inverstigar ejecutar luego del foreach

		};

		$scope.find = function() {
			$scope.parametros = Parametros.query({all:true});
		};

		$scope.change = function(param){
			param.change = '*';
		};

		$scope.toViewParametro = function() {
			$scope.parametro = Parametros.get( {parametroId: $stateParams.parametroId} );
			$scope.setFormFields(true);
		};

		$scope.toEditParametro = function() {
			$scope.parametro = Parametros.get( {parametroId: $stateParams.parametroId} );
			$scope.setFormFields(false);
		};

	}

]);
