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
