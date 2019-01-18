'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fichas = require('../../app/controllers/fichas.server.controller');
	var multiparty = require('connect-multiparty');
	
	var multipartyMiddleware = multiparty();

	// Fichas Routes
	app.route('/fichas')
		.get(fichas.list)
		.post(users.requiresLogin, fichas.create);

	app.route('/fichas/:fichaId')
		.get(fichas.read)
		.put(users.requiresLogin, fichas.update)
		.delete(users.requiresLogin, fichas.delete);

	app.route('/fichas/fecha/:idFicha')
		.get(fichas.read)
		.put(fichas.updateFecha);

	app.route('/fichaupload')
    	.post(users.requiresLogin, multipartyMiddleware, fichas.create);


    app.route('/fichas/reporte/1')
    	.get(fichas.reporte1);

    app.route('/fichavencimiento')
    	.get(fichas.obtenerFechaVenc, fichas.listVencimientos);

    app.route('/fichas/:codFicha/venc/:descarte')
    	.post(fichas.updateDescarte);

    app.route('/fichasimagenes')
		.post(fichas.updateImagen);
		
	app.route('/fichas/img/:nomimg')
		.get(fichas.descargaImagen);

	// Finish by binding the Ficha middleware
	app.param('fichaId', fichas.fichaByID);
	app.param('idFicha', fichas.fichaByIDFecha);
};
