'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Fecven = mongoose.model('Fecven'),
	_ = require('lodash');

/**
 * Create a Fecven
 */
exports.create = function(req, res) {
	var fecven = new Fecven(req.body);
	fecven.user = req.user;

	fecven.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fecven);
		}
	});
};

/**
 * Show the current Fecven
 */
exports.read = function(req, res) {
	res.jsonp(req.fecven);
};

/**
 * Update a Fecven
 */
exports.update = function(req, res) {
	var fecven = req.fecven ;

	fecven = _.extend(fecven , req.body);

	fecven.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fecven);
		}
	});
};

/**
 * Delete an Fecven
 */
exports.delete = function(req, res) {
	var fecven = req.fecven ;

	fecven.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fecven);
		}
	});
};

/**
 * List of Fecvens
 */
exports.list = function(req, res) {

	Fecven.find().sort('descripcion').exec(function(err, fecvens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(fecvens);
		}
	});

};

/**
 * Fecven middleware
 */
exports.fecvenByID = function(req, res, next, id) {
	Fecven.findById(id).populate('user', 'displayName').exec(function(err, fecven) {
		if (err) return next(err);
		if (! fecven) return next(new Error('Failed to load Fecven ' + id));
		req.fecven = fecven ;
		next();
	});
};

