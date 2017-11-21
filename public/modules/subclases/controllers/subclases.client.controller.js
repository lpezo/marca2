'use strict';

// Subclases controller
angular.module('subclases').controller('SubclasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subclases', 'TableSettings', 'SubclasesForm',
	function($scope, $stateParams, $location, Authentication, Subclases, TableSettings, SubclasesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Subclases);
		$scope.subclase = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = SubclasesForm.getFormFields(disabled);
		};


		// Create new Subclase
		$scope.create = function() {
			var subclase = new Subclases($scope.subclase);

			// Redirect after save
			subclase.$save(function(response) {
				$location.path('subclases/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subclase
		$scope.remove = function(subclase) {

			if ( subclase ) {
				subclase = Subclases.get({subclaseId:subclase._id}, function() {
					subclase.$remove(function(){
						$scope.tableParams.reload();
					});
				});

			} else {
				$scope.subclase.$remove(function() {
					$location.path('subclases');
				});
			}

		};

		// Update existing Subclase
		$scope.update = function() {
			var subclase = $scope.subclase;

			subclase.$update(function() {
				$location.path('subclases/' + subclase._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewSubclase = function() {
			$scope.subclase = Subclases.get( {subclaseId: $stateParams.subclaseId} );
			$scope.setFormFields(true);
		};

		$scope.toEditSubclase = function() {
			$scope.subclase = Subclases.get( {subclaseId: $stateParams.subclaseId} );
			$scope.setFormFields(false);
		};

	}

]);
