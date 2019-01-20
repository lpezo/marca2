'use strict';

//Fichas service used to communicate Fichas REST endpoints
angular.module('fichas').factory('FichasImg', ['$resource', '$q',
	function($resource, $q) {
        return {
            loadImages64: function(fichas) {
                var deferred = $q.defer();
                var urlCalls = [];
                var resoimg = $resource('/fichas/img/:imagen', {imagen:'@id'});
                angular.forEach(fichas, function(ficha){
                    console.log(ficha.archivo);
                    if (ficha.archivo && ficha.archivo.length > 0){
                        //var url = '/fichas/img/:imagen';
                        urlCalls.push(resoimg.get({imagen: ficha.archivo}).$promise);
                    }
                    else
                        urlCalls.push(null);
                });
                
                $q.all(urlCalls).then(function(results){
                    for (var i in results){
                        if (results[i] && results[i].data ){
                            //results[i].base64 = btoa(results[i].data);
                            results[i].base64 = results[i].data;
                        }
                    }
                    deferred.resolve(results);
                },function(errors){
                    console.log('errors: ', errors);
                    deferred.reject(errors);
                }, function(updates){
                    deferred.update(updates);
                });
                return deferred.promise;
            }
        };
	}
]);