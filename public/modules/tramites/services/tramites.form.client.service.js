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
