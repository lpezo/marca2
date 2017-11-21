'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var derechos = require('../../app/controllers/derechos.server.controller');

	// Derechos Routes
	app.route('/derechos')
		.get(derechos.list)
		.post(users.requiresLogin, derechos.create);

	app.route('/derechos/:derechoId')
		.get(derechos.read)
		.put(users.requiresLogin, derechos.update)
		.delete(users.requiresLogin, derechos.delete);

	/*
	app.route('/derechos/list/all')
		.get(derechos.listall);
	*/
	// Finish by binding the Derecho middleware
	app.param('derechoId', derechos.derechoByID);
};
