'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Titular = mongoose.model('Titular'),
	Ubi = mongoose.model('Ubi'),
	_ = require('lodash');

/**
 * Create a Titular
 */
exports.create = function(req, res) {
	var titular = new Titular(req.body);
	titular.user = req.user;
	//console.log('create:', titular);
	//console.log('create: req.user:', req.user);
	titular.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(titular);
		}
	});
};

/**
 * Show the current Titular
 */
exports.read = function(req, res) {
	res.jsonp(req.titular);
};

/**
 * Update a Titular
 */
exports.update = function(req, res) {
	var titular = req.titular ;
	if (titular.user === undefined)
		titular.user = req.user;
	titular = _.extend(titular , req.body);

	titular.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(titular);
		}
	});
};

/**
 * Delete an Titular
 */
exports.delete = function(req, res) {
	var titular = req.titular ;

	titular.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(titular);
		}
	});
};

/*
var llenaUbicacion = function(titulars)
{
	//console.log(titulars);
	//titulars.results.forEach(function(cli)
	for (var i=0; i<titulars.results.lenght; i++)
	{
		var cli = titulars.results[i];
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
 * List of Titulars
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


	Titular
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, titulars){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//llenaUbicacion(titulars);
				res.jsonp(titulars);
			}
		});

};

/**
 * Titular middleware
 */
exports.titularByID = function(req, res, next, id) {
	Titular.findById(id).populate('user', 'displayName').exec(function(err, titular) {
		if (err) return next(err);
		if (! titular) return next(new Error('Failed to load Titular ' + id));
		req.titular = titular ;
		next();
	});
};

/**
 * Titular middleware
 */
exports.titularByCodigo = function(req, res, next, codcli) {
	Titular.findOne({codigo:codcli}).populate('user', 'displayName').exec(function(err, titular) {
		if (err) return next(err);
		if (! titular) titular = {}; //return next(new Error('Failed to load Titular ' + codcli));
		req.titular = titular ;
		next();
	});
};


/**
 * Titular authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*
	if (req.titular.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	*/
	next();
};

exports.busqTitular = function(req, res)
{
	var texto = req.params.texto;
	var limit = req.query.count || 10;
	if (texto.length > 1)
	{
		Titular.find({nombre: new RegExp(texto.toUpperCase())}, {_id:0, codigo:1, nombre:1})
		.limit(limit)
		.exec(function(err, titulars){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.jsonp(titulars);
		});
	}
	else
		res.jsonp([{codigo:'00', nombre: '--debe tener mas de un caracter'}]);
};
