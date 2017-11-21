'use strict';

// Derechos controller
angular.module('derechos').controller('DerechosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Derechos', 'TableSettings', 'DerechosForm',
	function($scope, $stateParams, $location, Authentication, Derechos, TableSettings, DerechosForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Derechos);
		$scope.derecho = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = DerechosForm.getFormFields(disabled);
		};


		// Create new Derecho
		$scope.create = function() {
			var derecho = new Derechos($scope.derecho);

			// Redirect after save
			derecho.$save(function(response) {
				$location.path('derechos/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Derecho
		$scope.remove = function(derecho) {

			if ( derecho ) {
				derecho = Derechos.get({derechoId:derecho._id}, function() {
					derecho.$remove(function(){
						$scope.tableParams.reload();						
					});
				});

			} else {
				$scope.derecho.$remove(function() {
					$location.path('derechos');
				});
			}

		};

		// Update existing Derecho
		$scope.update = function() {
			var derecho = $scope.derecho;

			derecho.$update(function() {
				$location.path('derechos/' + derecho._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewDerecho = function() {
			$scope.derecho = Derechos.get( {derechoId: $stateParams.derechoId} );
			$scope.setFormFields(true);
		};

		$scope.toEditDerecho = function() {
			$scope.derecho = Derechos.get( {derechoId: $stateParams.derechoId} );
			$scope.setFormFields(false);
		};

	}

]);
