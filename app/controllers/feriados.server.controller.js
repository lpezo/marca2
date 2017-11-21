'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feriado = mongoose.model('Feriado'),
	_ = require('lodash');

/**
 * Create a Feriado
 */
exports.create = function(req, res) {
	var feriado = new Feriado(req.body);
	feriado.user = req.user;

	feriado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feriado);
		}
	});
};

/**
 * Show the current Feriado
 */
exports.read = function(req, res) {
	res.jsonp(req.feriado);
};

/**
 * Update a Feriado
 */
exports.update = function(req, res) {
	var feriado = req.feriado ;

	feriado = _.extend(feriado , req.body);

	feriado.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feriado);
		}
	});
};

/**
 * Delete an Feriado
 */
exports.delete = function(req, res) {
	var feriado = req.feriado ;

	feriado.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feriado);
		}
	});
};

/**
 * List of Feriados
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	if (req.query.all)
	{
		Feriado.find().exec(function(err, feriados){
			res.jsonp(feriados);
		});
	}

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
		sortObject.asc = 'mes';
	}

	sort = {
		sort: sortObject
	};


	Feriado
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, feriados){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(feriados);
			}
		});

};

/**
 * Feriado middleware
 */
exports.feriadoByID = function(req, res, next, id) {
	Feriado.findById(id).populate('user', 'displayName').exec(function(err, feriado) {
		if (err) return next(err);
		if (! feriado) return next(new Error('Failed to load Feriado ' + id));
		req.feriado = feriado ;
		next();
	});
};

/**
 * Feriado authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.feriado.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
