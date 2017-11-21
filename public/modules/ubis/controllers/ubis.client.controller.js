'use strict';

// Ubis controller
angular.module('ubis').controller('UbisController', ['$scope', '$stateParams', '$location', 'Authentication',
	 'Ubis', 'TableSettings', 'UbisForm',
	function($scope, $stateParams, $location, Authentication, Ubis, TableSettings, UbisForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Ubis);
		$scope.ubi = {};
		$scope.nivel = '';

		$scope.setFormFields = function(disabled) {
			$scope.formFields = UbisForm.getFormFields(disabled);
		};


		// Create new Ubi
		$scope.create = function() {
			var ubi = new Ubis($scope.ubi);
			ubi.pad = $stateParams.ubiId || 0;
			ubi.niv = $stateParams.ubiNiv || 0;
			// Redirect after save
			ubi.$save(function(response) {
				$location.path('ubis/' + response.pad);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		var getNivel = function(niv)
		{
			return niv === 0 ? 'País' : niv === 1 ? 'Departamento' : niv === 2 ? 'Provincia' : niv === 3 ? 'Distrito' : '';
		};

		// Remove existing Ubi
		$scope.remove = function(ubi) {

			if ( ubi ) {
				ubi = Ubis.get({ubiId:ubi.num}, function() {
					var x = ubi.$remove();
					//console.log(x);
					x.then(function(u){
						$scope.tableParams.reload();	
					});
					
				});

			} else {
				$scope.ubi.$remove(function() {
					$location.path('ubis');
				});
			}

		};

		// Update existing Ubi
		$scope.update = function() {
			var ubi = $scope.ubi;

			ubi.$update(function() {
				$location.path('ubis/' + ubi.num);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.toViewUbi = function() {
			if ($stateParams.ubiId === 0)
			{
				$scope.ubi = {};
				$scope.tableParams.parameters({num:0});
				$scope.nivel = '';
			}
			else
			{
				$scope.ubi = Ubis.get( {ubiId: $stateParams.ubiId}, function(ubi) {
				//$scope.$watchCollection('ubi', function (newubi, oldubi){
					//var ubi = newubi;

					//console.log(ubi);
					//console.log(ubi.num);

					//$scope.tableParams.num(ubi.num);
					$scope.nivel = getNivel(ubi.niv);
					$scope.tableParams.parameters({num:ubi.num,page:1,filter:{}});

				});
			}
			$scope.setFormFields(true);

		};

		$scope.toEditUbi = function() {
			$scope.ubi = Ubis.get( {ubiId: $stateParams.ubiId} );
			$scope.setFormFields(false);
		};

		$scope.toCreateUbi = function() {
			$scope.setFormFields(false);

		};



	}

]);
