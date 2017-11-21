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
