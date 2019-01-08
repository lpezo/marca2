'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('FichasImg', ['$http', '$q',
	function($http, $q) {
        return {
            loadImages64: function(fichas) {
                var deferred = $q.defer();
                var urlCalls = [];
                angular.forEach(fichas, function(ficha){
                    if (ficha.archivo){
                        var url = '/img/' + ficha.archivo;
                        urlCalls.push($http.get(url));
                    }
                    else
                        urlCalls.push(null);
                });
                
                $q.all(urlCalls).then(function(results){
                    deferred.resolve(results);
                },function(errors){
                    deferred.reject(errors);
                }, function(updates){
                    deferred.update(updates);
                });
                return deferred.promise;
            }
        }
        /*
		return $resource('fichas/:fichaId', { fichaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
        });
        */
	}
]);