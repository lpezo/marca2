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
