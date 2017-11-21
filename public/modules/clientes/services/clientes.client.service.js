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
  function(dateFilter) {
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
});

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