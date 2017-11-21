'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var titulars = require('../../app/controllers/titulars.server.controller');

	// Titulars Routes
	app.route('/titulars')
		.get(titulars.list)
		.post(users.requiresLogin, titulars.create);

	app.route('/titulars/:titularId')
		.get(titulars.read)
		.put(users.requiresLogin, titulars.update)
		.delete(users.requiresLogin, titulars.delete);

	app.route('/titulars/codigo/:codcli')
		.get(titulars.read);

	app.route('/titulars/busq/:texto')
		.get(titulars.busqTitular);

	// Finish by binding the Titular middleware
	app.param('titularId', titulars.titularByID);
	app.param('codcli', titulars.titularByCodigo);
};
