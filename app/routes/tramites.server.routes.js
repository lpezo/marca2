'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tramites = require('../../app/controllers/tramites.server.controller');

	// Tramites Routes
	app.route('/tramites')
		.get(tramites.list)
		.post(users.requiresLogin, tramites.create);

	app.route('/tramites/:tramiteId')
		.get(tramites.read)
		.put(users.requiresLogin, tramites.update)
		.delete(users.requiresLogin, tramites.delete);

	// Finish by binding the Tramite middleware
	app.param('tramiteId', tramites.tramiteByID);
};
