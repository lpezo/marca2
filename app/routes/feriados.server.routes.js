'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var feriados = require('../../app/controllers/feriados.server.controller');

	// Feriados Routes
	app.route('/feriados')
		.get(feriados.list)
		.post(users.requiresLogin, feriados.create);

	app.route('/feriados/:feriadoId')
		.get(feriados.read)
		.put(users.requiresLogin, feriados.update)
		.delete(users.requiresLogin, feriados.delete);

	// Finish by binding the Feriado middleware
	app.param('feriadoId', feriados.feriadoByID);
};
