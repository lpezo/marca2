'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var parametros = require('../../app/controllers/parametros.server.controller');

	// Parametros Routes
	app.route('/parametros')
		.get(parametros.list)
		.post(users.requiresLogin, parametros.create);

	app.route('/parametros/:parametroId')
		.get(parametros.read)
		.put(users.requiresLogin, parametros.update)
		.delete(users.requiresLogin, parametros.delete);

	app.route('/parametros/codigo/:parametroCod')
		.get(parametros.readFecha);

	// Finish by binding the Parametro middleware
	app.param('parametroId', parametros.parametroByID);
	app.param('parametroCod', parametros.parametroByCod);
};
