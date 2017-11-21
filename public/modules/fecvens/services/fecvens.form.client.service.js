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
