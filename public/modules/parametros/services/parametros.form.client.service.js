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
