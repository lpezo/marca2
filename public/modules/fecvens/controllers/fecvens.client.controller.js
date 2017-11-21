'use strict';

// Fecvens controller
angular.module('fecvens').controller('FecvensController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fecvens', 'TableSettings', 'FecvensForm',
	function($scope, $stateParams, $location, Authentication, Fecvens, TableSettings, FecvensForm ) {
		$scope.authentication = Authentication;
		//$scope.tableParams = TableSettings.getParams(Fecvens);
		$scope.fecven = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = FecvensForm.getFormFields(disabled);
		};


		// Create new Fecven
		$scope.create = function() {
			var fecven = new Fecvens($scope.fecven);

			// Redirect after save
			fecven.$save(function(response) {
				$location.path('fecvens/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fecven
		$scope.remove = function(fecven) {

			if ( fecven ) {
				fecven = Fecvens.get({fecvenId:fecven._id}, function() {
					fecven.$remove(function(){
						for (var i in $scope.data) {
							if ($scope.data [i] === fecven) {
								$scope.data.splice(i, 1);
							}
						}
					});
				});

			} else {
				$scope.fecven.$remove(function() {
					$location.path('fecvens');
				});
			}

		};

		// Update existing Fecven
		$scope.update = function() {
			var fecven = $scope.fecven;

			fecven.$update(function() {
				$location.path('fecvens/' + fecven._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.toViewFecven = function() {
			$scope.fecven = Fecvens.get( {fecvenId: $stateParams.fecvenId} );
			$scope.setFormFields(true);
		};

		$scope.toEditFecven = function() {
			$scope.fecven = Fecvens.get( {fecvenId: $stateParams.fecvenId} );
			$scope.setFormFields(false);
		};

		$scope.find = function() {
			$scope.data = Fecvens.query();
		};

	}

]);
