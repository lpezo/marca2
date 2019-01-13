'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('FichasImg', ['$http', '$q',
	function($http, $q) {
        return {
            loadImages64: function(fichas) {
                var deferred = $q.defer();
                var urlCalls = [];
                angular.forEach(fichas, function(ficha){
                    console.log(ficha.archivo);
                    if (ficha.archivo && ficha.archivo.length > 0){
                        var url = '/img/' + ficha.archivo;
                        urlCalls.push($http.get(url));
                    }
                    else
                        urlCalls.push(null);
                });
                
                $q.all(urlCalls).then(function(results){
                    for (var i in results){
                        if (results[i] && results[i].data ){
                            results[i].base64 = btoa(results[i].data);
                        }
                    }
                    deferred.resolve(results);
                },function(errors){
                    deferred.reject(errors);
                }, function(updates){
                    deferred.update(updates);
                });
                return deferred.promise;
            }
        };
	}
]);