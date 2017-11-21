(function() {
    'use strict';

    function factory() {

        var _moduloAct = '';

        //var _params = {};

        var _initial = {
            count: 20,
            page: 1
        };

        var _settings = {
            counts : [20, 50, 100],
        };

        var _moduleConfig = {};
        var _moduleParams = {};

        var getUrl = function(params, asString){
            asString = asString || false;
            //save = save || true;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === 'object') {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== '') {
                                var pname = name + '[' + encodeURIComponent(subkey) + ']';
                                if (asString) {
                                    pairs.push(pname + '=' + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== '') {
                        if (asString) {
                            pairs.push(name + '=' + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        var getUrlTable = function(params, count, page)
        {
            //_params = params;
            _moduleParams[_moduloAct] = params;
            var config = _moduleConfig[_moduloAct];
            if (count)
                config.count = count;
            else
                config.count = _initial.count;
            if (page)
                config.page = page;
            else
                config.page = _initial.page;

            var local = angular.extend(config, params);

            return getUrl(local, false);

        };

        var getParams = function()
        {
            if (!_moduleParams[_moduloAct])
                return {};
            else
                return _moduleParams[_moduloAct];
        };

        var getSettings = function(modulo)
        {
            _moduloAct = modulo;
            return _settings;
        };

        var getConfig = function()
        {
            if (!_moduleConfig[_moduloAct])
                _moduleConfig[_moduloAct] = angular.extend({}, _initial);
            return _moduleConfig[_moduloAct];
        };

        var getNext = function()
        {
            // if (!_params.page)
            //     _params.page = 2;
            // else
            //     _params.page = _params.page + 1;
            // return getUrl(_params);
            // _initial.page = _initial.page + 1;
            var config = getConfig();
            config.page = config.page + 1;
            var local = angular.extend(config, getParams());
            return getUrl(local, false);
        };

        var getPrev = function()
        {
            // if (!_params.page || _params.page === 1)
            //     _params.page = 1;
            // else
            //     _params.page = _params.page - 1;
            // return getUrl(_params);
            var config = getConfig();
            if (config.page > 1)
                config.page = config.page - 1;
            var local = angular.extend(config, getParams());
            return getUrl(local, false);
        };

        var getEqual = function()
        {
            var local = angular.extend(getConfig(), getParams());
            return getUrl(local, false);
        };

      var service = {
        //ini: initial,
        getUrl: getUrl,
        getUrlTable: getUrlTable,
        getParams: getParams,
        getConfig: getConfig,
        getSettings: getSettings,
        getNext: getNext,
        getPrev: getPrev,
        getEqual: getEqual
      };

      return service;

  }

  angular
    .module('core')
    .factory('Path', factory);



})();

