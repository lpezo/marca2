'use strict';

// Tramites controller
angular.module('tramites').controller('TramitesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tramites', 'TableSettings', 'TramitesForm',
	function($scope, $stateParams, $location, Authentication, Tramites, TableSettings, TramitesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Tramites);
		$scope.tramite = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = TramitesForm.getFormFields(disabled);
		};


		// Create new Tramite
		$scope.create = function() {
			var tramite = new Tramites($scope.tramite);

			// Redirect after save
			tramite.$save(function(response) {
				$location.path('tramites/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tramite
		$scope.remove = function(tramite) {

			if ( tramite ) {
				tramite = Tramites.get({tramiteId:tramite._id}, function() {
					tramite.$remove(function(){
						$scope.tableParams.reload();
					});
				});

			} else {
				$scope.tramite.$remove(function() {
					$location.path('tramites');
				});
			}

		};

		// Update existing Tramite
		$scope.update = function() {
			var tramite = $scope.tramite;

			tramite.$update(function() {
				$location.path('tramites/' + tramite._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewTramite = function() {
			$scope.tramite = Tramites.get( {tramiteId: $stateParams.tramiteId} );
			$scope.setFormFields(true);
		};

		$scope.toEditTramite = function() {
			$scope.tramite = Tramites.get( {tramiteId: $stateParams.tramiteId} );
			$scope.setFormFields(false);
		};

	}

]);
