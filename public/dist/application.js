'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'marca';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  
		'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ngTable', 'formly', 'formlyBootstrap', 
		'ngFileUpload', 'ui.bootstrap.datetimepicker', 'angularjs-dropdown-multiselect'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};
	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('clientes', ['core']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('derechos', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('fecvens', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('feriados', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('fichas', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('parametros', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('subclases', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('titulars', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('tramites', ['core']);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('ubis', ['core']);


'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider',
	function($stateProvider) {
		// Clientes state routing
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			templateUrl: 'modules/clientes/views/list-clientes.client.view.html'
		}).
		state('createCliente', {
			url: '/clientes/create',
			templateUrl: 'modules/clientes/views/create-cliente.client.view.html'
		}).
		state('viewCliente', {
			url: '/clientes/:clienteId',
			templateUrl: 'modules/clientes/views/view-cliente.client.view.html'
		}).
		state('editCliente', {
			url: '/clientes/:clienteId/edit',
			templateUrl: 'modules/clientes/views/edit-cliente.client.view.html'
		});
	}
]);
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

'use strict';

//Clientes service used to communicate Clientes REST endpoints
angular.module('clientes').factory('Clientes', ['$resource',
	function($resource) {
		return $resource('clientes/:clienteId', { clienteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.directive(
  'dateInput',
  ["dateFilter", function(dateFilter) {
    return {
      require: 'ngModel',
      template: '<input type="date" class="form-control"></input>',
      replace: true,
      link: function(scope, elm, attrs, ngModelCtrl) {
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          return dateFilter(modelValue, 'yyyy-MM-dd');
        });

        ngModelCtrl.$parsers.push(function(modelValue){
           return angular.toJson(modelValue,true)
          .substring(1,angular.toJson(modelValue).length-1);
        });

      }
    };
}]);

angular.module('clientes').factory('ClientesCod', ['$resource',
    function($resource){
      return $resource('clientes/codigo/:codcli', {codcli: '@codigo'});
    }
]);

angular.module('clientes').factory('ClientesBusq', ['$resource',
    function($resource){
      return $resource('clientes/busq/:texto');
    }
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            className: 'row',
            fieldGroup: [
      				{
                className: 'col-md-2 upper-case',
      					key: 'codigo',
      					type: 'input',
      					templateOptions: {
      			      label: '(*) Código:',
      						disabled: disabled
      			    }
      				},
              {
                className: 'col-md-4 upper-case',
                key: 'nombre',
                type: 'input',
                templateOptions: {
                  label: '(*) Nombre:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'ruc',
                type: 'input',
                templateOptions: {
                  label: 'Ruc:',
                  disabled: disabled
                }        
              }
            ]
          },
          {
            key: 'direccion',
            type: 'input',
            templateOptions: {
              label: 'Dirección:',
              disabled: disabled
            }
          },
          {
             className: 'section-label',
             template: '<div><strong>UBICACIÓN:</strong></div>'
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'distrito',
                type: 'input',
                templateOptions: {
                  label: 'Distrito:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'provincia',
                type: 'input',
                templateOptions: {
                  label: 'Pronvicia:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'departamen',
                type: 'input',
                templateOptions: {
                  label: 'Departamento:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'pais',
                type: 'input',
                templateOptions: {
                  label: 'País:',
                  disabled: disabled
                }
              }
            ]
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'telefono',
                type: 'input',
                templateOptions: {
                  label: 'Teléfono:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'fax',
                type: 'input',
                templateOptions: {
                  label: 'Fax:',
                  disabled: disabled
                }
              }
            ]
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'propietari',
                type: 'input',
                templateOptions: {
                  label: 'Propietario:',
                  disabled: disabled
                }        
              },
              {
                className: 'col-md-3',
                key: 'e_mail',
                type: 'input',
                templateOptions: {
                  label: 'Email:',
                  disabled: disabled
                }        
              }
            ]
          }
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('clientes')
    .factory('ClientesForm', factory);

})();

'use strict';

// Configuring the new module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tablas', 'core', 'dropdown', '');
		Menus.addSubMenuItem('topbar', 'core', 'Clientes', 'clientes');
		Menus.addSubMenuItem('topbar', 'core', 'Titulares', 'titulars');
		Menus.addSubMenuItem('topbar', 'core', 'Derechos', 'derechos');
		Menus.addSubMenuItem('topbar', 'core', 'Sub Clases', 'subclases');
		Menus.addSubMenuItem('topbar', 'core', 'Trámites', 'tramites');
		Menus.addSubMenuItem('topbar', 'core', 'Ubicación', 'ubis');
		Menus.addSubMenuItem('topbar', 'core', 'Feriados', 'feriados');
		Menus.addSubMenuItem('topbar', 'core', 'Parámetros', 'parametros/config');
		Menus.addSubMenuItem('topbar', 'core', 'Parámetros Edit', 'parametros', null, true, ['admin']);
		Menus.addSubMenuItem('topbar', 'core', 'Fechas de Vencimiento', 'fecvens', null, true, ['admin']);
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.init = function()
		{
			if (!Authentication.user)
				$location.path('signin');
			else
				$location.path('fichavencimiento');
		};

	}
]);
'use strict';

angular.module('core')
  .directive('capitalizeFirst', ["$parse", function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if (inputValue === undefined) { inputValue = ''; }
           //var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         };
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
   };
}]);
'use strict';

angular.module('core')
  .directive('ngReallyClick', ['$modal',
    function($modal) {

      var ModalInstanceCtrl = ["$scope", "$modalInstance", function($scope, $modalInstance) {
        $scope.ok = function() {
          $modalInstance.close();
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      }];

      return {
        restrict: 'A',
        scope: {
          ngReallyClick: '&'
        },
        link: function(scope, element, attrs) {

          element.bind('click', function() {
            var message = attrs.ngReallyMessage || '¿ Está seguro ?';

            var modalHtml = '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $modal.open({
              template: modalHtml,
              controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function() {
              scope.ngReallyClick();
            }, function() {
              //Modal dismissed
            });

          });

        }

      };

    }

  ]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
(function() {
    'use strict';

    function factory() {

        var _moduloAct = '';

        //var _params = {};

        var _initial = {
            count: 20,
            page: 1
        };

        var _settings = {
            counts : [20, 50, 100],
        };

        var _moduleConfig = {};
        var _moduleParams = {};

        var getUrl = function(params, asString){
            asString = asString || false;
            //save = save || true;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === 'object') {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== '') {
                                var pname = name + '[' + encodeURIComponent(subkey) + ']';
                                if (asString) {
                                    pairs.push(pname + '=' + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== '') {
                        if (asString) {
                            pairs.push(name + '=' + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        var getUrlTable = function(params, count, page)
        {
            //_params = params;
            _moduleParams[_moduloAct] = params;
            var config = _moduleConfig[_moduloAct];
            if (count)
                config.count = count;
            else
                config.count = _initial.count;
            if (page)
                config.page = page;
            else
                config.page = _initial.page;

            var local = angular.extend(config, params);

            return getUrl(local, false);

        };

        var getParams = function()
        {
            if (!_moduleParams[_moduloAct])
                return {};
            else
                return _moduleParams[_moduloAct];
        };

        var getSettings = function(modulo)
        {
            _moduloAct = modulo;
            return _settings;
        };

        var getConfig = function()
        {
            if (!_moduleConfig[_moduloAct])
                _moduleConfig[_moduloAct] = angular.extend({}, _initial);
            return _moduleConfig[_moduloAct];
        };

        var getNext = function()
        {
            // if (!_params.page)
            //     _params.page = 2;
            // else
            //     _params.page = _params.page + 1;
            // return getUrl(_params);
            // _initial.page = _initial.page + 1;
            var config = getConfig();
            config.page = config.page + 1;
            var local = angular.extend(config, getParams());
            return getUrl(local, false);
        };

        var getPrev = function()
        {
            // if (!_params.page || _params.page === 1)
            //     _params.page = 1;
            // else
            //     _params.page = _params.page - 1;
            // return getUrl(_params);
            var config = getConfig();
            if (config.page > 1)
                config.page = config.page - 1;
            var local = angular.extend(config, getParams());
            return getUrl(local, false);
        };

        var getEqual = function()
        {
            var local = angular.extend(getConfig(), getParams());
            return getUrl(local, false);
        };

      var service = {
        //ini: initial,
        getUrl: getUrl,
        getUrlTable: getUrlTable,
        getParams: getParams,
        getConfig: getConfig,
        getSettings: getSettings,
        getNext: getNext,
        getPrev: getPrev,
        getEqual: getEqual
      };

      return service;

  }

  angular
    .module('core')
    .factory('Path', factory);



})();


(function() {
    'use strict';

    function factory(ngTableParams) {

      var getData = function(Entity) {
        return function($defer, params) {
          // settings.$scope.$emit('inidata');
          params.settings().$scope.$emit('ngTableBeforeReloadData');
  				Entity.get(params.url(), function(response) {
  					params.total(response.total);
  					$defer.resolve(response.results);
            //$rootScope.$broadcast('findata');
  				});
  			};

      };

      var params = {
        page: 1,
        count: 10
      };

      var settings = {
        total: 0,
        counts: [10, 20, 30],
        filterDelay: 0,
      };

      var tableParams = new ngTableParams(params, settings);
      var tableParamByType = {};

      var getParams = function(Entity, type) {
        if (type)
        {
          if (!tableParamByType[type])
            tableParamByType[type] = new ngTableParams(params, settings);
          tableParamByType[type].settings({getData: getData(Entity)});
          return tableParamByType[type];
        }
        else
        {
          tableParams.settings({getData: getData(Entity)});
          return tableParams;
        }
      };

      var service = {
        getParams: getParams
      };

      return service;

  }

  angular
    .module('core')
    .factory('TableSettings', factory);

    factory.$inject = ['ngTableParams'];

})();

'use strict';

//Setting up route
angular.module('derechos').config(['$stateProvider',
	function($stateProvider) {
		// Derechos state routing
		$stateProvider.
		state('listDerechos', {
			url: '/derechos',
			templateUrl: 'modules/derechos/views/list-derechos.client.view.html'
		}).
		state('createDerecho', {
			url: '/derechos/create',
			templateUrl: 'modules/derechos/views/create-derecho.client.view.html'
		}).
		state('viewDerecho', {
			url: '/derechos/:derechoId',
			templateUrl: 'modules/derechos/views/view-derecho.client.view.html'
		}).
		state('editDerecho', {
			url: '/derechos/:derechoId/edit',
			templateUrl: 'modules/derechos/views/edit-derecho.client.view.html'
		});
	}
]);
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

'use strict';

//Derechos service used to communicate Derechos REST endpoints
angular.module('derechos').factory('Derechos', ['$resource',
	function($resource) {
		return $resource('derechos/:derechoId', { derechoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            key: 'codigo',
            type: 'input',
            templateOptions: {
              label: 'Código:',
              disabled: disabled
            }
          },
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nombre:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('derechos')
    .factory('DerechosForm', factory);

})();

'use strict';

//Setting up route
angular.module('fecvens').config(['$stateProvider',
	function($stateProvider) {
		// Fecvens state routing
		$stateProvider.
		state('listFecvens', {
			url: '/fecvens',
			templateUrl: 'modules/fecvens/views/list-fecvens.client.view.html'
		}).
		state('createFecven', {
			url: '/fecvens/create',
			templateUrl: 'modules/fecvens/views/create-fecven.client.view.html'
		}).
		state('viewFecven', {
			url: '/fecvens/:fecvenId',
			templateUrl: 'modules/fecvens/views/view-fecven.client.view.html'
		}).
		state('editFecven', {
			url: '/fecvens/:fecvenId/edit',
			templateUrl: 'modules/fecvens/views/edit-fecven.client.view.html'
		});
	}
]);
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

'use strict';

//Fecvens service used to communicate Fecvens REST endpoints
angular.module('fecvens').factory('Fecvens', ['$resource',
	function($resource) {
		return $resource('fecvens/:fecvenId', { fecvenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'campo',
  					type: 'input',
  					templateOptions: {
  			      label: 'Campo:',
  						disabled: disabled
  			    }
  				},
          {
            key: 'descarte',
            type: 'input',
            templateOptions: {
              label: 'Campo Descarte',
              disabled: disabled
            }
          },
          {
            key: 'descripcion',
            type: 'input',
            templateOptions: {
              label: 'Descripción',
              disabled: disabled
            }
          },
          {
            key: 'dias',
            type: 'input',
            templateOptions: {
              label: 'Días',
              disabled: disabled
            }
          }
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
      .module('fecvens')
      .factory('FecvensForm', factory);

})();

'use strict';

//Setting up route
angular.module('feriados').config(['$stateProvider',
	function($stateProvider) {
		// Feriados state routing
		$stateProvider.
		state('listFeriados', {
			url: '/feriados',
			templateUrl: 'modules/feriados/views/list-feriados.client.view.html'
		}).
		state('createFeriado', {
			url: '/feriados/create',
			templateUrl: 'modules/feriados/views/create-feriado.client.view.html'
		}).
		state('viewFeriado', {
			url: '/feriados/:feriadoId',
			templateUrl: 'modules/feriados/views/view-feriado.client.view.html'
		}).
		state('editFeriado', {
			url: '/feriados/:feriadoId/edit',
			templateUrl: 'modules/feriados/views/edit-feriado.client.view.html'
		});
	}
]);
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

'use strict';

//Feriados service used to communicate Feriados REST endpoints
angular.module('feriados').factory('Feriados', ['$resource',
	function($resource) {
		return $resource('feriados/:feriadoId', { feriadoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';


    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-1',
                key: 'dia',
                type: 'input',
                templateOptions: {
                  label: 'Día:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'mes',
                type: 'select',
                templateOptions: {
                  label: 'Mes:',
                  options: [
                    { value: 1, name: 'Enero' },
                    { value: 2, name: 'Febrero' },
                    { value: 3, name: 'Marzo' },
                    { value: 4, name: 'Abril' },
                    { value: 5, name: 'Mayo' },
                    { value: 6, name: 'Junio' },
                    { value: 7, name: 'Julio' },
                    { value: 8, name: 'Agosto' },
                    { value: 9, name: 'Setiembre' },
                    { value: 10, name: 'Octubre' },
                    { value: 11, name: 'Novienbre' },
                    { value: 12, name: 'Diciembre' }
                  ]
                }
              }
            ]
          },
  				{
  					key: 'glosa',
  					type: 'input',
  					templateOptions: {
  			      label: 'Glosa:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('feriados')
    .factory('FeriadosForm', factory);


})();

'use strict';

// Configuring the new module
angular.module('fichas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fichas', 'fichas', 'dropdown', '/fichas(/create)?');
		Menus.addSubMenuItem('topbar', 'fichas', 'Nueva Ficha', 'fichas/create');
		Menus.addSubMenuItem('topbar', 'fichas', 'Buscar Ficha', 'fichas');
		Menus.addSubMenuItem('topbar', 'fichas', 'Reporte de Marcas', 'fichas/reporte/1');
	}
]);
'use strict';

//Setting up route
angular.module('fichas').config(['$stateProvider',
	function($stateProvider) {
		// Fichas state routing
		$stateProvider.
		state('listFichas', {
			url: '/fichas',
			templateUrl: 'modules/fichas/views/list-fichas.client.view.html'
		}).
		state('createFicha', {
			url: '/fichas/create',
			templateUrl: 'modules/fichas/views/create-ficha.client.view.html'
		}).
		state('viewFicha', {
			url: '/fichas/:fichaId',
			templateUrl: 'modules/fichas/views/view-ficha.client.view.html'
		}).
		state('editFicha', {
			url: '/fichas/:fichaId/edit',
			templateUrl: 'modules/fichas/views/edit-ficha.client.view.html'
		}).
		state('editFechaFicha', {
			url: '/fichas/:fichaId/fecha',
			templateUrl: 'modules/fichas/views/editfecha-ficha.client.view.html'
		}).
		state('report1Ficha', {
			url: '/fichas/reporte/1',
			templateUrl: 'modules/fichas/views/reporte1-ficha.client.view.html'
		}).
		state('vencimientoFicha', {
			url: '/fichavencimiento',
			templateUrl: 'modules/fichas/views/list-venc.client.view.html'
		});
	}
]);
'use strict';

// Fichas controller
angular.module('fichas').controller('FichasController', ['$scope', '$stateParams', '$location', 
		'$resource', 'Authentication', 'Fichas', 'TableSettings', 'FichasForm', 'ClientesBusq', 
		'Derechos', 'Tramites', 'Clases', 'Subclases', '$timeout', 'Upload', 'ParametrosCod', 'Fecvens', 'TitularsBusq', 'FichasImg',
	function($scope, $stateParams, $location, 
		$resource, Authentication, Fichas, TableSettings, FichasForm, ClientesBusq,
		Derechos, Tramites, Clases, SubClases, $timeout, Upload, ParametrosCod, Fecvens, TitularsBusq, FichasImg) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Fichas, 'ficha');
		$scope.ficha = {};

		// $scope.buscandoCliente = false;
		$scope.buscandoFichas = false;

		$scope.setFormFields = function(disabled) {
			$scope.formFields = FichasForm.getFormFields(disabled);
		};

	    $scope.uploadPic = function(file, cliente, titular) {


			if (cliente)
			{
				$scope.ficha.codcli = cliente.codigo;
				$scope.ficha.nomcli = cliente.nombre;
			}

			/*
			if (titular)
			{
				$scope.ficha.codtit = titular.codigo;
				$scope.ficha.nomtit = titular.nombre;
			}
			*/

			var ficha = new Fichas($scope.ficha);
			ficha.derecho = $scope.derecho._id;
			ficha.tramite = $scope.tramite._id;
			// ficha.subclases = [];
			// console.log('uploadPic: ', $scope.clase);
			ficha.clases = [];
			if ($scope.ficha.subclases)
			{
				$scope.ficha.subclases.forEach(function(item){
					if (ficha.clases.indexOf(item.clase) < 0)
						ficha.clases.push(item.clase);
				});
			}
			// if ($scope.clase)
			// 	$scope.clase.forEach(function(cada){
			// 		var str = '0' + cada.id;
			// 		ficha.clases.push(str.substring(str.length-2));
			// 	});

			console.log('uploadpic:', ficha);

			/*
			if (idClase)
			{
				if ($scope.ficha.clases)
				{
					var pos = $scope.ficha.clases.indexOf(idClase);
					if (pos < 0)
						$scope.ficha.clases.push(idClase);
				}
				else
					$scope.ficha.clases = [idClase];
			}
			*/

			if (file)
			{
				// console.log('uploadPic:ficha', ficha);
				console.log('uploadPic:file.name', file.name);

			    file.upload = Upload.upload({
			      url: 'fichaupload',
			      fields: ficha,
			      file: file,
		   		});

			    file.upload.then(function (response) {
			      $timeout(function () {
			        file.result = response.data;
			        $location.path('fichas');
			      });
			    }, function (response) {
			      console.log('response: ', response);
			      if (response.status > 0)
			        $scope.error = response.status + ': ' + (response.data ? response.data.message : response.message);
			    });

			    file.upload.progress(function (evt) {
			      // Math.min is to fix IE which reports 200% sometimes
			      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			    });
			}
			else
			{
				
				if (ficha._id){
					ficha.$update(function() {
						$location.path('fichas');
					}, function(response) {
						console.log('response err:', response);
					if (response.status > 0)
			        	$scope.error = response.status + ': ' + (response.data ? response.data.message : response.message);
					});
				}
				else
				{
					ficha.$save(function(response) {
						$location.path('fichas');
					}, function(err) {
						if (err.data)
							$scope.error = err.data.message;
						else
							$scope.error = err.message;
					});
				}
			}

	    };

	    $scope.borrarimagen = function()
	    {
	    	$scope.picFile = null;
	    };

		// Update existing Ficha
		$scope.update = function() {
			var ficha = $scope.ficha;
			ficha.derecho = $scope.derecho._id;
			ficha.tramite = $scope.tramite._id;
			ficha.$update(function() {
				$location.path('fichas');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ficha
		$scope.remove = function(ficha) {

			if ( ficha ) {
				ficha = Fichas.get({fichaId:ficha._id}, function() {
					ficha.$remove(function(){
						$scope.tableParams.reload();						
					});
				});

			} else {
				$scope.ficha.$remove(function() {
					$location.path('fichas');
				});
			}

		};


		$scope.toViewFicha = function() {
			$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId} );
			$scope.setFormFields(true);
		};

		$scope.toCreateFicha = function()
		{
			// $scope.buscandoCliente = false;
			$scope.ficha = {};
			$scope.derecho = {_id:null};
			$scope.derechos = Derechos.query({all:true});
			$scope.tramite = {_id:null};
			$scope.tramites = Tramites.query({all:true});
			$scope.clases = Clases.query();
			$scope.subclase = {};

		};

		$scope.toEditFicha = function() {
			//$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId} );
			//$scope.setFormFields(false);
			// $scope.buscandoCliente = false;
			$scope.clases = Clases.query();
			$scope.subclase = {};
			// Clases.query({}, function(clas){
			// 	clas.forEach(function(cadacla){
			// 		cadacla.id = parseInt(cadacla._id);
			// 		cadacla.label = cadacla.desc;
			// 	});
			// 	$scope.clases = clas;
			// });

			$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId}, function(ficha) {
				//console.log('toEditFicha get: ', ficha);
				$scope.derecho = ficha.derecho || {_id:null};
				$scope.derechos = Derechos.query({all:true});
				$scope.tramite = ficha.tramite || {_id:null};
				$scope.tramites = Tramites.query({all:true});

				// if (ficha.clases)
				// {
				// 	ficha.clases.forEach(function(cada){
				// 		$scope.clase.push({id:parseInt(cada)});
				// 	});
				// }

				$scope.cliente = {codigo: ficha.codcli, nombre: ficha.nomcli};
				//$scope.titular = {codigo: ficha.codtit, nombre: ficha.nomtit};
				// console.log('editficha:', ficha);
				// console.log('scope.clase:', $scope.clase);
				// console.log('scope.clases:', $scope.clases);
				//console.log('toEditFicha: scope.derecho', $scope.derecho);
			});
		};

		$scope.changeClase = function(unaClase){
			$scope.subclases = [];
			$scope.subclase = [];
			Clases.query({claseId: unaClase}, function(lista){
				var i = 0;
				if (lista)
				{
					lista.forEach(function(lis){
						var ele = {id:i++, label: lis.codigo + '-' + lis.name, clase: lis.clase, codigo: lis.codigo};
						$scope.subclases.push(ele); 
						if ($scope.ficha.subclases){
							$scope.ficha.subclases.forEach(function(cadasub){
								if (cadasub.clase === lis.clase && cadasub.codigo === lis.codigo)
									$scope.subclase.push(ele);
							});
						}
					});
				}
			});
		};



		$scope.toEditFecha = function(){
			var Fich = $resource('fichas/fecha/:idFicha', {idFicha: '@_id'});
			Fich.get({idFicha: $stateParams.fichaId}, function(ficha){
				if (ficha.fechas === undefined)
					ficha.fechas = {fecpre:null};
				$scope.ficha = ficha;
				//console.log('toEditFecha: ', ficha);

			});
		};

		$scope.uploadFechas = function()
		{
			var ficha = new Fichas($scope.ficha);
			console.log('uploadFechas:', ficha);
			var Fich = $resource('fichas/fecha/:idFicha', null, 
				{
					'update': {method: 'PUT'}
				});
			Fich.update({idFicha: ficha._id}, ficha, function(ficha){
					$location.path('fichas');
				}, function(errorResponse){
					$scope.error = errorResponse.data.message;
				});

		};

		$scope.iniList = function()
		{
			$scope.clases =	Clases.query();
			var param = $scope.tableParams.parameters();
			if (param.query)
			{
				$scope.query = param.query;
			}
		};

		$scope.doQuery = function()
		{
			var param = $scope.tableParams.parameters();
			param.query = $scope.query;
			param.page = 1;
			console.log('param:', param);
			$scope.tableParams.parameters(param);
			$scope.tableParams.reload();
		};

		$scope.queryVencFecha = function(fecha1, fecha2)
		{
			if (!fecha2 || fecha1 > fecha2) 
			{
				if ($scope.query)
					$scope.query.vencfecha2 = fecha1;
				else
					$scope.query = {vencfecha2: fecha1};
			}
			$scope.doQuery();
		};

		$scope.queryVencFecha2 = function(fecha1, fecha2)
		{
			if (!fecha1 || fecha1 > fecha2) 
			{
				if ($scope.query)
					$scope.query.vencfecha1 = fecha2;
				else
					$scope.query = {vencfecha1: fecha2};
			}
			$scope.doQuery();
		};

		// $scope.$on('ngTableBeforeReloadData', function () {
  //            $scope.buscandoFichas = true;
  //       });
        
		// $scope.$on('ngTableAfterReloadData', function () {
  //            $scope.buscandoFichas = false;
  //       });


		$scope.iniVenc = function()
		{
			var venc = $resource('fichavencimiento', {});
			venc.query({},function(fichas){
				$scope.fichas = fichas;
			}, function(error){
				$scope.error = error.data.message;
			});
		};

		$scope.descartar = function(fichaFecha)
		{
			var UpdDescarte = $resource('fichas/:codFicha/venc/:descarte', {codFicha: '@codigo', descarte: '@descarte'});
			var updDescarte = new UpdDescarte(fichaFecha);
			updDescarte.$save(function(){
				//$route.reload();
				for (var i=0; i<$scope.fichas.length; i++)
				{
					if ($scope.fichas[i].codigo === fichaFecha.codigo)
					{
						$scope.fichas.splice(i, 1);
						break;
					}
				}
			}, function(error){
				$scope.error = error.data.message;
			});
		};

		$scope.iniReporte = function()
		{
			// $scope.buscandoCliente = false;
			$scope.ficha = {codcli: '', nomcli:''};
			/*
			$scope.tiposDeFecha = [
				{id:'fecpub', name:'Fecha de Publicación'},
				{id:'fecvenc', name:'Fecha de Vencimiento'}
			];
			*/

			$scope.tiposDeFecha = Fecvens.query();

			$scope.desde = new Date();
			$scope.desde.setHours(0,0,0,0);
			$scope.hasta = new Date();
			$scope.hasta.setHours(0,0,0,0);
			$scope.tipoFecha = 'fecpub';

			$scope.modoReporte = false;
		};
		
		$scope.changeDesde = function()
		{
			// console.log('changedesde');
			if ($scope.desde > $scope.hasta)
				$scope.hasta = $scope.desde;
		};

		$scope.reporte1 = function()
		{
			$scope.error = '';
			if ($scope.desde > $scope.hasta)
			{
				$scope.error = 'Fecha desde no puede mayor que fecha hasta';
				return;
			}
			var rep1 = $resource('fichas/reporte/1', {});
			var codcli = null;
			if ($scope.cliente)
				codcli = $scope.cliente.codigo;
			rep1.query({ codcli: codcli, tipoFecha: $scope.tipoFecha, desde: $scope.desde, hasta: $scope.hasta }, function(result){

				for(var i in $scope.tiposDeFecha)
				{
					if ($scope.tiposDeFecha[i].campo === $scope.tipoFecha)
					{
						$scope.tituloReporte = $scope.tiposDeFecha[i].descripcion;
						break;
					}
				}
				$scope.result = result;
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});

		};

		$scope.changeFecpre = function()
		{
			ParametrosCod.get({parametroCod:'01', fecha:$scope.ficha.fechas.fecpre}, function(obj){
				$scope.ficha.fechas.fecnoti = obj.fecha;
			});
		};

		$scope.changePub = function()
		{
			ParametrosCod.get({parametroCod:'02', fecha:$scope.ficha.fechas.fecpub}, function(obj){
				$scope.ficha.fechas.fecvencplazo = obj.fecha;
				$scope.ficha.fechas.fecpubDescarte = false;	
			});
		};

		$scope.changeFecOrdPub = function()
		{
			ParametrosCod.get({parametroCod:'10', fecha:$scope.ficha.fechas.fecordpub}, function(obj){
				$scope.ficha.fechas.fecvencplapub = obj.fecha;
				//$scope.ficha.fechas.fecpubDescarte = false;	
			});
		};


		$scope.change_fecnotopo = function()
		{
			ParametrosCod.get({parametroCod:'03', fecha:$scope.ficha.fechas.fecnotopo}, function(obj){
				$scope.ficha.fechas.fecplazocont = obj.fecha;
			});
		};

		$scope.change_fecnotresol = function()
		{
			ParametrosCod.get({parametroCod:'04', fecha:$scope.ficha.fechas.fecnotresol}, function(obj){
				$scope.ficha.fechas.fecplareco = obj.fecha;
			});

			ParametrosCod.get({parametroCod:'05', fecha:$scope.ficha.fechas.fecnotresol}, function(obj){
				$scope.ficha.fechas.fecvencplaape = obj.fecha;
			});

		};

		$scope.change_fecnotresoreco = function()
		{
			ParametrosCod.get({parametroCod:'06', fecha:$scope.ficha.fechas.fecnotresoreco}, function(obj){
				$scope.ficha.fechas.fecvencplaape = obj.fecha;
			});

			ParametrosCod.get({parametroCod:'07', fecha:$scope.ficha.fechas.fecnotresoreco}, function(obj){
				$scope.ficha.fechas.fecvencplazdem = obj.fecha;
			});
		};

		// $scope.addclase = function(idClase){
		// 	if (!$scope.ficha.clases)
		// 		$scope.ficha.clases = [idClase];
		// 	else
		// 	{
		// 		if ($scope.ficha.clases.indexOf(idClase) < 0)
		// 		{
		// 			$scope.ficha.clases.push(idClase);
		// 			$scope.ficha.clases.sort();
		// 		}
		// 	}
		// };

		// $scope.restclase = function(idClase){
		// 	if ($scope.ficha.clases)
		// 	{
		// 		var pos = $scope.ficha.clases.indexOf(idClase);
		// 		if (pos >= 0)
		// 		{
		// 			$scope.ficha.clases.splice(pos, 1);
		// 		}
		// 	}
		// };

		$scope.setclase = {
		    smartButtonMaxItems: 10,
		    scrollableHeight: '250px',
		    scrollable: true
		    // smartButtonTextConverter: function(itemText, originalItem) {
		    // 	return itemText.substring(0, 20);
		    // }
		};

		$scope.setsubclase = {
		    smartButtonMaxItems: 10,
		    scrollableHeight: '250px',
		    scrollable: true,
		    externalIdProp: '',
		    smartButtonTextConverter: function(itemText, originalItem) {
		    	return itemText.substring(0, 2);
		    }
		};

		$scope.setsubclaseevent = {
			onItemSelect: function(item) {
				if (!$scope.ficha.subclases)
					$scope.ficha.subclases = [];
				$scope.ficha.subclases.push({clase:item.clase,codigo:item.codigo,label:item.label.substring(3)});
				$scope.ficha.subclases.sort(function(a, b){
					var cmp = a.clase.localeCompare(b.clase);
					if (cmp === 0)
						cmp = a.codigo.localeCompare(b.codigo);
					return cmp;
				});
			},
			onItemDeselect: function(item) {
				if (!$scope.subclases)
					return;
				var itemx = $scope.subclases[item.id];
				var sc = $scope.ficha.subclases;
				var pos = -1;
				for(var i=0; i < sc.length; i++){
					if (sc[i].clase === itemx.clase && sc[i].codigo === itemx.codigo)
					{
						pos = i;
						break;
					}
				}
				if (pos >= 0)
					sc.splice(pos, 1);
			},
			onDeselectAll: function() {
				if (!$scope.subclases)
					return;
				if ($scope.subclases.length === 0)
					return;
				var itemx = $scope.subclases[0];
				var sc = $scope.ficha.subclases;
				for (var i=sc.length-1; i >= 0; i--){
					if (sc[i].clase === itemx.clase)
						sc.splice(i, 1);
				}
			}
		};

		$scope.borrarSubClase = function(item)
		{
			var sc = $scope.ficha.subclases;
			for (var i=0; i < sc.length; i++){
				if (sc[i].clase === item.clase && sc[i].codigo === item.codigo){
					sc.splice(i, 1);
					break;
				}
			}
			sc = $scope.subclase;
			for (var j=0; j < sc.length; j++){
				if (sc[j].clase === item.clase && sc[j].codigo === item.codigo){
					sc.splice(j, 1);
					break;
				}
			}
		};

		$scope.modelOptions = {
		    debounce: {
		      default: 500,
		      blur: 250
		    },
		    getterSetter: true
	  	};

	  	$scope.getCliente = function(valor)
	  	{
			var promise = ClientesBusq.query({texto: valor, count: 20});
			return promise.$promise.then(function(res){
				return res;
				});	  		
	  	};

	  	$scope.getTitular = function(valor)
	  	{
			var promise = TitularsBusq.query({texto: valor, count: 20});
			return promise.$promise.then(function(res){
				return res;
				});	  		
	  	};

	  	$scope.iralista = function()
	  	{
	  		$location.path('fichas');
	  	};
	  	
	  	$scope.creapdf = function()
	  	{
	  	    console.log($scope.result);
	  	    
			var docDefinition = {
				content: [
					{
					table: {
						headerRows: 1,
						widths: [ 50, 100, 100, 100, 100 ],
						body: [
						[ 'Código', 'Marca', 'Clase', 'Logo', 'Certificado']
						]
					},
					layout: {
						fillColor: function (rowIndex, node, columnIndex) {
						return (rowIndex === 0) ? '#FF7F00' : null;
						}
					}
					}
				],
				defaultStyle: {
					fontSize: 10
				}
			};
			  
			FichasImg.loadImages64($scope.result).then(function(response){
				console.log('response:',response);
			});

				// open the PDF in a new window
			for (var ificha in $scope.result){
				var ficha = $scope.result[ificha];
				var clase = '';
				for (var cadaclase in ficha.clases){
				if (clase === '')
					clase = ficha.clases[cadaclase];
				else
					clase = clase + ', ' + ficha.clases[cadaclase];
				}
				var image = '/img/'+ficha.archivo;
				if (!ficha.archivo)
				image = '';
				if (ficha.codigo){
				docDefinition.content[0].table.body.push( [ficha.codigo, ficha.nomsigno, clase, image, ficha.numcertificado || ''] );
				}
			}
	


			console.log(docDefinition);

                
			pdfMake.createPdf(docDefinition).open();
	
			// print the PDF
			//pdfMake.createPdf(docDefinition).print();
	
			// download the PDF
			pdfMake.createPdf(docDefinition);
	  	    
	  	    //alert('pendiente');
	  	};

	}

]);

'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('Fichas', ['$resource',
	function($resource) {
		return $resource('fichas/:fichaId', { fichaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'codcli',
  					type: 'input',
  					templateOptions: {
  			      label: 'Codigo de Cliente:',
  						disabled: disabled
  			    }
  				}
          /*
          ,
          {
            key: 'derecho.id',
            type: 'select',
            templateOptions: {
              label: 'Derecho',
              options: [],
              valueprop: 'id',
              labelprop: 'name',
              disabled: disabled
            },
            controller: function($scope, DerechoService){
              $scope.to.loading = DerechoService.valores().then(function(response){
                $scope.to.options = response;
              });
            }
          }
          */

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('fichas')
    .factory('FichasForm', factory);
    /*
    .factory('DerechoService', function DerechoService($resource, $q){

      function valores() {
        var deferred = $q.defer();
        var Der = $resource('derecho/list/all');
        var derechos = Der.query({}, function(derechos){
          //console.log('ubis:');
          //console.log(ubis);
          deferred.resolve(derechos);
        });
        
        return deferred.promise;
      }

      return {
        valores: valores
      };

    
    
    });
    */

})();

'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('FichasImg', ['$http', '$q',
	function($http, $q) {
        return {
            loadImages64: function(fichas) {
                var deferred = $q.defer();
                var urlCalls = [];
                angular.forEach(fichas, function(ficha){
                    console.log(ficha.archivo);
                    if (ficha.archivo && ficha.archivo.length > 0){
                        var url = '/img/' + ficha.archivo;
                        urlCalls.push($http.get(url));
                    }
                    else
                        urlCalls.push(null);
                });
                
                $q.all(urlCalls).then(function(results){
                    for (var i in results){
                        if (results[i] && results[i].data ){
                            results[i].base64 = btoa(new Uint8Array(results[i].data).reduce(function(data, byte) {return data + String.fromCharCode(byte)}, ''));
                            delete results[i].data;
                        }
                    }
                    deferred.resolve(results);
                },function(errors){
                    deferred.reject(errors);
                }, function(updates){
                    deferred.update(updates);
                });
                return deferred.promise;
            }
        };
	}
]);
'use strict';

//Setting up route
angular.module('parametros').config(['$stateProvider',
	function($stateProvider) {
		// Parametros state routing
		$stateProvider.
		state('listParametros', {
			url: '/parametros',
			templateUrl: 'modules/parametros/views/list-parametros.client.view.html'
		}).
		state('createParametro', {
			url: '/parametros/create',
			templateUrl: 'modules/parametros/views/create-parametro.client.view.html'
		}).
		state('configParametro', {
			url: '/parametros/config',
			templateUrl: 'modules/parametros/views/config-parametros.client.view.html'
		}).
		state('viewParametro', {
			url: '/parametros/:parametroId',
			templateUrl: 'modules/parametros/views/view-parametro.client.view.html'
		}).
		state('editParametro', {
			url: '/parametros/:parametroId/edit',
			templateUrl: 'modules/parametros/views/edit-parametro.client.view.html'
		});
	}
]);
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

'use strict';

//Parametros service used to communicate Parametros REST endpoints
angular.module('parametros').factory('Parametros', ['$resource',
	function($resource) {
		return $resource('parametros/:parametroId', { parametroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Parametros service used to communicate Parametros REST endpoints
angular.module('parametros').factory('ParametrosCod', ['$resource',
	function($resource) {
		return $resource('parametros/codigo/:parametroCod', { parametroId: '@codigo'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'codigo',
  					type: 'input',
  					templateOptions: {
  			      label: 'Código:',
  						disabled: disabled
  			    }
  				},
          {
            key: 'desc',
            type: 'input',
            templateOptions: {
              label: 'Descripción;',
              disabled: disabled
            }
          },
          {
            key: 'dias',
            type: 'input',
            templateOptions: {
              label: 'Días:',
              disabled: disabled
            }
          },
          {
            key: 'diames',
            type: 'radio',
            templateOptions: {
              label: '',
              disabled: disabled,
              options: [
                {
                  name: 'Dias:',
                  value: 'd'
                },
                {
                  name: 'Meses',
                  value: 'm'
                }
              ]
            }
          },
          {
            key: 'labo',
            type: 'radio',
            templateOptions: {
              label: '',
              disabled: disabled,
              options: [
                {
                  name: 'Días laborables',
                  value: 'y'
                },
                {
                  name: 'Días no laborables',
                  value: 'n'
                }
              ]
            }
          }

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  
  angular
      .module('parametros')
      .factory('ParametrosForm', factory);

})();

'use strict';

//Setting up route
angular.module('subclases').config(['$stateProvider',
	function($stateProvider) {
		// Subclases state routing
		$stateProvider.
		state('listSubclases', {
			url: '/subclases',
			templateUrl: 'modules/subclases/views/list-subclases.client.view.html'
		}).
		state('createSubclase', {
			url: '/subclases/create',
			templateUrl: 'modules/subclases/views/create-subclase.client.view.html'
		}).
		state('viewSubclase', {
			url: '/subclases/:subclaseId',
			templateUrl: 'modules/subclases/views/view-subclase.client.view.html'
		}).
		state('editSubclase', {
			url: '/subclases/:subclaseId/edit',
			templateUrl: 'modules/subclases/views/edit-subclase.client.view.html'
		});
	}
]);
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

'use strict';

//Subclases service used to communicate Subclases REST endpoints
angular.module('subclases').factory('Subclases', ['$resource',
	function($resource) {
		return $resource('subclases/:subclaseId', { subclaseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('subclases').factory('Clases', ['$resource',
	function($resource) {
		return $resource('clases/:claseId', { } );
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            className: 'row',
            fieldGroup: [
      				{
                className: 'col-md-1',
      					key: 'clase',
      					type: 'input',
      					templateOptions: {
      			      label: 'Clase:',
      						disabled: disabled
      			    }
      				},
              {
                className: 'col-md-1',
                key: 'codigo',
                type: 'input',
                templateOptions: {
                  label: 'SubClase:',
                  disabled: disabled
                }
              }
            ]
          },
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: 'Nombre:',
              disabled: disabled
            }
          }
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('subclases')
    .factory('SubclasesForm', factory);

})();

'use strict';

//Setting up route
angular.module('titulars').config(['$stateProvider',
	function($stateProvider) {
		// titulars state routing
		$stateProvider.
		state('listtitulars', {
			url: '/titulars',
			templateUrl: 'modules/titulars/views/list-titulars.client.view.html'
		}).
		state('createtitular', {
			url: '/titulars/create',
			templateUrl: 'modules/titulars/views/create-titular.client.view.html'
		}).
		state('viewtitular', {
			url: '/titulars/:titularId',
			templateUrl: 'modules/titulars/views/view-titular.client.view.html'
		}).
		state('edittitular', {
			url: '/titulars/:titularId/edit',
			templateUrl: 'modules/titulars/views/edit-titular.client.view.html'
		});
	}
]);
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

'use strict';

//Titulars service used to communicate Titulars REST endpoints
angular.module('titulars').factory('Titulars', ['$resource',
	function($resource) {
		return $resource('titulars/:titularId', { titularId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.directive(
  'dateInput',
  ["dateFilter", function(dateFilter) {
    return {
      require: 'ngModel',
      template: '<input type="date" class="form-control"></input>',
      replace: true,
      link: function(scope, elm, attrs, ngModelCtrl) {
        ngModelCtrl.$formatters.unshift(function (modelValue) {
          return dateFilter(modelValue, 'yyyy-MM-dd');
        });

        ngModelCtrl.$parsers.push(function(modelValue){
           return angular.toJson(modelValue,true)
          .substring(1,angular.toJson(modelValue).length-1);
        });

      }
    };
}]);

angular.module('titulars').factory('TitularsCod', ['$resource',
    function($resource){
      return $resource('titulars/codigo/:codcli', {codcli: '@codigo'});
    }
]);

angular.module('titulars').factory('TitularsBusq', ['$resource',
    function($resource){
      return $resource('titulars/busq/:texto');
    }
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            className: 'row',
            fieldGroup: [
      				{
                className: 'col-md-2 upper-case',
      					key: 'codigo',
      					type: 'input',
      					templateOptions: {
      			      label: '(*) Código:',
      						disabled: disabled
      			    }
      				},
              {
                className: 'col-md-4 upper-case',
                key: 'nombre',
                type: 'input',
                templateOptions: {
                  label: '(*) Nombre:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'ruc',
                type: 'input',
                templateOptions: {
                  label: 'Ruc:',
                  disabled: disabled
                }        
              }
            ]
          },
          {
            key: 'direccion',
            type: 'input',
            templateOptions: {
              label: 'Dirección:',
              disabled: disabled
            }
          },
          {
             className: 'section-label',
             template: '<div><strong>UBICACIÓN:</strong></div>'
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'distrito',
                type: 'input',
                templateOptions: {
                  label: 'Distrito:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'provincia',
                type: 'input',
                templateOptions: {
                  label: 'Pronvicia:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'departamen',
                type: 'input',
                templateOptions: {
                  label: 'Departamento:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'pais',
                type: 'input',
                templateOptions: {
                  label: 'País:',
                  disabled: disabled
                }
              }
            ]
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'telefono',
                type: 'input',
                templateOptions: {
                  label: 'Teléfono:',
                  disabled: disabled
                }
              },
              {
                className: 'col-md-2',
                key: 'fax',
                type: 'input',
                templateOptions: {
                  label: 'Fax:',
                  disabled: disabled
                }
              }
            ]
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-md-2',
                key: 'propietari',
                type: 'input',
                templateOptions: {
                  label: 'Propietario:',
                  disabled: disabled
                }        
              },
              {
                className: 'col-md-3',
                key: 'e_mail',
                type: 'input',
                templateOptions: {
                  label: 'Email:',
                  disabled: disabled
                }        
              }
            ]
          }
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('titulars')
    .factory('TitularsForm', factory);

})();

'use strict';

//Setting up route
angular.module('tramites').config(['$stateProvider',
	function($stateProvider) {
		// Tramites state routing
		$stateProvider.
		state('listTramites', {
			url: '/tramites',
			templateUrl: 'modules/tramites/views/list-tramites.client.view.html'
		}).
		state('createTramite', {
			url: '/tramites/create',
			templateUrl: 'modules/tramites/views/create-tramite.client.view.html'
		}).
		state('viewTramite', {
			url: '/tramites/:tramiteId',
			templateUrl: 'modules/tramites/views/view-tramite.client.view.html'
		}).
		state('editTramite', {
			url: '/tramites/:tramiteId/edit',
			templateUrl: 'modules/tramites/views/edit-tramite.client.view.html'
		});
	}
]);
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

'use strict';

//Tramites service used to communicate Tramites REST endpoints
angular.module('tramites').factory('Tramites', ['$resource',
	function($resource) {
		return $resource('tramites/:tramiteId', { tramiteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
          {
            key: 'codigo',
            type: 'input',
            templateOptions: {
              label: 'Código',
              disabled: disabled
            }
          },
  				{
  					key: 'name',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nombre:',
  						disabled: disabled
  			    }
  				}
  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }
  angular
      .module('tramites')
      .factory('TramitesForm', factory);
})();

'use strict';

//Setting up route
angular.module('ubis').config(['$stateProvider',
	function($stateProvider) {
		// Ubis state routing
		$stateProvider.
		state('listUbis', {
			url: '/ubis',
			templateUrl: 'modules/ubis/views/list-ubis.client.view.html'
		}).
		state('createUbi', {
			url: '/ubis/:ubiId/:ubiNiv/create',
			templateUrl: 'modules/ubis/views/create-ubi.client.view.html'
		}).
		state('viewUbi', {
			url: '/ubis/:ubiId',
			//url: '/ubis/:ubiNum/view',
			//templateUrl: 'modules/ubis/views/view-ubi.client.view.html'
			templateUrl: 'modules/ubis/views/list-ubis.client.view.html'
		}).
		state('editUbi', {
			url: '/ubis/:ubiId/edit',
			templateUrl: 'modules/ubis/views/edit-ubi.client.view.html'
		});

	}
]);
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

'use strict';

//Ubis service used to communicate Ubis REST endpoints
angular.module('ubis').factory('Ubis', ['$resource',
	function($resource) {
		return $resource('ubis/:ubiId', { ubiId: '@num'
		}, {
			update: { method: 'PUT'}
			}
		);
	}
]);




(function() {
    'use strict';

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'nom',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nombre:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

  angular
    .module('ubis')
    .factory('UbisForm', factory);

})();

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('list', {
			url: '/users',
			templateUrl: 'modules/users/views/authentication/list.client.view.html'
		});
	}
]);
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
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user,
			modules: {reniec: false, sunat: false, essalud: false, telefonica: false}
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);