(function() {
    'use strict';

    function factory(ngTableParams) {

      var getData = function(Entity) {
        return function($defer, params) {
          // settings.$scope.$emit('inidata');
          params.settings().$scope.$emit('ngTableBeforeReloadData');
  				Entity.get(params.url(), function(response) {
  					params.total(response.total);
  					$defer.resolve(response.results);
            //$rootScope.$broadcast('findata');
  				});
  			};

      };

      var params = {
        page: 1,
        count: 10
      };

      var settings = {
        total: 0,
        counts: [10, 20, 30],
        filterDelay: 0,
      };

      var tableParams = new ngTableParams(params, settings);
      var tableParamByType = {};

      var getParams = function(Entity, type) {
        if (type)
        {
          if (!tableParamByType[type])
            tableParamByType[type] = new ngTableParams(params, settings);
          tableParamByType[type].settings({getData: getData(Entity)});
          return tableParamByType[type];
        }
        else
        {
          tableParams.settings({getData: getData(Entity)});
          return tableParams;
        }
      };

      var service = {
        getParams: getParams
      };

      return service;

  }

  angular
    .module('core')
    .factory('TableSettings', factory);

    factory.$inject = ['ngTableParams'];

})();
