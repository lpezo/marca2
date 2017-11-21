'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ubi = mongoose.model('Ubi'),
	_ = require('lodash');

/**
 * Create a Ubi
 */
exports.create = function(req, res, next) {
	var ubi = new Ubi(req.body);
	ubi.user = req.user;
	var count = 0;
	Ubi.find().order({sort:{desc: 'num'}}).limit(1).exec(function(err, ubic) {
		if (!ubic) 
			count = 0;
		else
			count = ubic[0].num;
		ubi.num = count+1;
		ubi.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ubi);
			}
		});
	});
};

/**
 * Show the current Ubi
 */
exports.read = function(req, res) {
	res.jsonp(req.ubi);
	//req.query.num = req.ubi.num;
	//req.query.tableParams.params.num = req.ubi.num;
	//req.body.tableParams.params.num = req.ubi.num;
};

exports.readPad = function(req, res) {
	res.jsonp(req.ubis);
};

/**
 * Update a Ubi
 */
exports.update = function(req, res) {
	var ubi = req.ubi ;

	ubi = _.extend(ubi , req.body);

	ubi.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ubi);
		}
	});
};

/**
 * Delete an Ubi
 */
exports.delete = function(req, res) {
	var ubi = req.ubi ;

	//Asegurarse que no tiene hijos
	//console.log('buscando num ...', ubi.num);
	Ubi.findOne({pad:ubi.num}).exec(function(err, ubix) {
		if (ubix)
		{
			console.log('La ubicación ' + ubi.nom + ' tiene hijos');
			return res.status(400).send({
					message: 'La ubicación ' + ubi.nom + ' tiene hijos'
				});

		}

		//console.log('ubi.remove()');
		ubi.remove(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ubi);
			}
		});
	});
	/*
	console.log("ubi.remove()");
	ubi.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ubi);
		}
	});

	*/
};

/**
 * List of Ubis
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;
	var num = req.query.num || 0;

	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
				//exact: {pad:num}
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
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	Ubi
		.find({pad:num})
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, ubis){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ubis);
			}
		});

};

/**
 * Ubi middleware
 */
exports.ubiByID = function(req, res, next, id) {
	//Ubi.findById(id).populate('user', 'displayName').exec(function(err, ubi) {
	//if (id == 0) id = 1;
	var idx = id || 1;
	if (idx === '0') 
	{
		console.log('Cuidado: idx es cero: ' + idx);
		idx = 1;
		req.ubi = {};
		next();
	}
	else
	Ubi.findOne({num:idx}).populate('user', 'displayName').exec(function(err, ubi) {
		if (err) return next(err);
		if (! ubi) return next(new Error('Failed to load Ubi ' + idx));
		//ubi['tipo'] = ubi.niv === 0 ? 'País' : ubi.niv === 1 ? 'Departamento' : ubi.niv === 2 ? 'Provincia' : 'Distrito';
		req.ubi = ubi ;
		next();
	});
};

exports.ubiByPad = function(req, res, next, pad) {
	Ubi.find({pad:pad},{_id:0, num:1, nom:1}).exec(function(err, ubis) {
		if (err) return next(err);
		if (!ubis) return next(new Error('Failed to load pad:' + pad));
		req.ubis = ubis;
		next();
	});
};

/**
 * Ubi authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ubi.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
