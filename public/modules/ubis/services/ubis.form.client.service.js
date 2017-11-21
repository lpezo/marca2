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
