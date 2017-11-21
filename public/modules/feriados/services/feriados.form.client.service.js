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
