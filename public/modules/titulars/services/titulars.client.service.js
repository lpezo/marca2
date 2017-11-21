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