'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cliente = mongoose.model('Cliente'),
	Ubi = mongoose.model('Ubi'),
	_ = require('lodash');

/**
 * Create a Cliente
 */
exports.create = function(req, res) {
	var cliente = new Cliente(req.body);
	cliente.user = req.user;
	//console.log('create:', cliente);
	//console.log('create: req.user:', req.user);
	cliente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * Show the current Cliente
 */
exports.read = function(req, res) {
	res.jsonp(req.cliente);
};

/**
 * Update a Cliente
 */
exports.update = function(req, res) {
	var cliente = req.cliente ;
	if (cliente.user === undefined)
		cliente.user = req.user;
	cliente = _.extend(cliente , req.body);

	cliente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * Delete an Cliente
 */
exports.delete = function(req, res) {
	var cliente = req.cliente ;

	cliente.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/*
var llenaUbicacion = function(clientes)
{
	//console.log(clientes);
	//clientes.results.forEach(function(cli)
	for (var i=0; i<clientes.results.lenght; i++)
	{
		var cli = clientes.results[i];
		if (cli.pais !== null)
		{
			console.log('cli.pais=' + cli.pais);
			Ubi.findOne({num:cli.pais}).exec(function(err, ubi){
				if (err) {
					cli.nacion = ubi.nom;
				} else {
					console.log('Ubic enc:' + ubi.nom);
					cli.nacion = ubi.nom;//: "value",  !== null ? ubi.nom : '';
				}
			});
		}
	}
};

*/

/**
 * List of Clientes
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.asc = 'codigo';
	}

	sort = {
		sort: sortObject
	};


	Cliente
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, clientes){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//llenaUbicacion(clientes);
				res.jsonp(clientes);
			}
		});

};

/**
 * Cliente middleware
 */
exports.clienteByID = function(req, res, next, id) {
	Cliente.findById(id).populate('user', 'displayName').exec(function(err, cliente) {
		if (err) return next(err);
		if (! cliente) return next(new Error('Failed to load Cliente ' + id));
		req.cliente = cliente ;
		next();
	});
};

/**
 * Cliente middleware
 */
exports.clienteByCodigo = function(req, res, next, codcli) {
	Cliente.findOne({codigo:codcli}).populate('user', 'displayName').exec(function(err, cliente) {
		if (err) return next(err);
		if (! cliente) cliente = {}; //return next(new Error('Failed to load Cliente ' + codcli));
		req.cliente = cliente ;
		next();
	});
};


/**
 * Cliente authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*
	if (req.cliente.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	*/
	next();
};

exports.busqCliente = function(req, res)
{
	var texto = req.params.texto;
	var limit = req.query.count || 10;
	if (texto.length > 1)
	{
		Cliente.find({nombre: new RegExp(texto.toUpperCase())}, {_id:0, codigo:1, nombre:1})
		.limit(limit)
		.exec(function(err, clientes){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.jsonp(clientes);
		});
	}
	else
		res.jsonp([{codigo:'00', nombre: '--debe tener mas de un caracter'}]);
};
