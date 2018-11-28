'use strict';

// Clientes controller
angular.module('clientes').controller('ClientesController', ['$scope', '$stateParams', '$location', 
	'Authentication', 'Clientes', 'TableSettings', 'ClientesForm',
	function($scope, $stateParams, $location, Authentication, Clientes, TableSettings, ClientesForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Clientes);
		$scope.cliente = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = ClientesForm.getFormFields(disabled);
			//console.log($scope.formFields);
		};

		// Create new Cliente
		$scope.create = function() {
			var cliente = new Clientes($scope.cliente);
			if (!cliente.codigo || cliente.codigo.length < 4)
			{
				$scope.error = "Longitud de código debe ser mayor o igual a cuatro";
				return;
			}

			// Redirect after save
			cliente.$save(function(response) {
				$location.path('clientes/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cliente
		$scope.remove = function(cliente) {

			if ( cliente ) {
				cliente = Clientes.get({clienteId:cliente._id}, function() {
					cliente.$remove(function(){
						$scope.tableParams.reload();
					});
				});

			} else {
				$scope.cliente.$remove(function() {
					$location.path('clientes');
				});
			}

		};

		// Update existing Cliente
		$scope.update = function() {
			var cliente = $scope.cliente;

			cliente.$update(function() {
				$location.path('clientes/' + cliente._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.toViewCliente = function() {
			$scope.cliente = Clientes.get( {clienteId: $stateParams.clienteId} );
			$scope.setFormFields(true);
		};

		$scope.toEditCliente = function() {
			$scope.cliente = Clientes.get( {clienteId: $stateParams.clienteId} );
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
