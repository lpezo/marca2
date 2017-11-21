'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ubis = require('../../app/controllers/ubis.server.controller');

	// Ubis Routes
	app.route('/ubis')
		.get(ubis.list)
		.post(users.requiresLogin, ubis.create);

	app.route('/ubis/:ubiId')
		.get(ubis.read)
		.put(users.requiresLogin, ubis.update)
		.delete(users.requiresLogin, ubis.delete);

	app.route('/ubis/list/:ubiPad')
		.get(ubis.readPad);

	// Finish by binding the Ubi middleware
	app.param('ubiId', ubis.ubiByID);
	app.param('ubiPad', ubis.ubiByPad);
};
