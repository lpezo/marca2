'use strict';

// Feriados controller
angular.module('feriados').controller('FeriadosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Feriados', 'TableSettings', 'FeriadosForm',
	function($scope, $stateParams, $location, Authentication, Feriados, TableSettings, FeriadosForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Feriados);
		$scope.feriado = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = FeriadosForm.getFormFields(disabled);
		};


		// Create new Feriado
		$scope.create = function() {
			var feriado = new Feriados($scope.feriado);

			// Redirect after save
			feriado.$save(function(response) {
				$location.path('feriados/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Feriado
		$scope.remove = function(feriado) {

			if ( feriado ) {
				feriado = Feriados.get({feriadoId:feriado._id}, function() {
					feriado.$remove(function(){
						$scope.tableParams.reload();
					});
				});

			} else {
				$scope.feriado.$remove(function() {
					$location.path('feriados');
				});
			}

		};

		// Update existing Feriado
		$scope.update = function() {
			var feriado = $scope.feriado;

			feriado.$update(function() {
				$location.path('feriados/' + feriado._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewFeriado = function() {
			$scope.feriado = Feriados.get( {feriadoId: $stateParams.feriadoId} );
			$scope.setFormFields(true);
		};

		$scope.toEditFeriado = function() {
			$scope.feriado = Feriados.get( {feriadoId: $stateParams.feriadoId} );
			$scope.setFormFields(false);
		};

	}

]);
