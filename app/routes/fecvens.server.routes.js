'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fecvens = require('../../app/controllers/fecvens.server.controller');

	// Fecvens Routes
	app.route('/fecvens')
		.get(fecvens.list)
		.post(users.requiresLogin, fecvens.create);

	app.route('/fecvens/:fecvenId')
		.get(fecvens.read)
		.put(users.requiresLogin, fecvens.update)
		.delete(users.requiresLogin, fecvens.delete);

	// Finish by binding the Fecven middleware
	app.param('fecvenId', fecvens.fecvenByID);
};
