'use strict';

// Titulars controller
angular.module('titulars').controller('TitularsController', ['$scope', '$stateParams', '$location', 
	'Authentication', 'Titulars', 'TableSettings', 'TitularsForm',
	function($scope, $stateParams, $location, Authentication, Titulars, TableSettings, TitularsForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Titulars);
		$scope.titular = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = TitularsForm.getFormFields(disabled);
			//console.log($scope.formFields);
		};

		// Create new Titular
		$scope.create = function() {
			var titular = new Titulars($scope.titular);

			// Redirect after save
			titular.$save(function(response) {
				$location.path('titulars/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Titular
		$scope.remove = function(titular) {

			if ( titular ) {
				titular = Titulars.get({titularId:titular._id}, function() {
					titular.$remove(function(){
						$scope.tableParams.reload();
					});
				});

			} else {
				$scope.titular.$remove(function() {
					$location.path('titulars');
				});
			}

		};

		// Update existing Titular
		$scope.update = function() {
			var titular = $scope.titular;

			titular.$update(function() {
				$location.path('titulars/' + titular._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.toViewTitular = function() {
			$scope.titular = Titulars.get( {titularId: $stateParams.titularId} );
			$scope.setFormFields(true);
		};

		$scope.toEditTitular = function() {
			$scope.titular = Titulars.get( {titularId: $stateParams.titularId} );
			$scope.setFormFields(false);
		};

		$scope.iniList = function() {
			$scope.tableParams.parameters({filter:{}});
		};

		// $scope.$on('reload_cli', function(event, data){
		// 	var codcli = data[0];
		// 	$scope.tableParams.parameters({filter:{codigo:codcli}});
		// 	$scope.tableParams.reload();

		// });

	}

]);
