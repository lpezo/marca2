'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subclases = require('../../app/controllers/subclases.server.controller');

	// Subclases Routes
	app.route('/subclases')
		.get(subclases.list)
		.post(users.requiresLogin, subclases.create);

	app.route('/subclases/:subclaseId')
		.get(subclases.read)
		.put(users.requiresLogin, subclases.update)
		.delete(users.requiresLogin, subclases.delete);

	app.route('/clases')
		.get(subclases.getClases);

	app.route('/clases/:IdClase')
		.get(subclases.getSubClases);

	// Finish by binding the Subclase middleware
	app.param('subclaseId', subclases.subclaseByID);
};
