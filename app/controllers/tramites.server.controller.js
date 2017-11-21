'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tramite = mongoose.model('Tramite'),
	_ = require('lodash');

/**
 * Create a Tramite
 */
exports.create = function(req, res) {
	var tramite = new Tramite(req.body);
	tramite.user = req.user;

	tramite.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tramite);
		}
	});
};

/**
 * Show the current Tramite
 */
exports.read = function(req, res) {
	res.jsonp(req.tramite);
};

/**
 * Update a Tramite
 */
exports.update = function(req, res) {
	var tramite = req.tramite ;

	tramite = _.extend(tramite , req.body);

	tramite.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tramite);
		}
	});
};

/**
 * Delete an Tramite
 */
exports.delete = function(req, res) {
	var tramite = req.tramite ;

	tramite.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tramite);
		}
	});
};

/**
 * List of Tramites
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	if (req.query.all)
	{
		Tramite.find({},{'codigo':1, 'name':1}).sort({'codigo':1}).exec(function(err, tramites){
			res.jsonp(tramites);
		});
		return;
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
		sortObject.asc = 'codigo';
	}

	sort = {
		sort: sortObject
	};


	Tramite
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, tramites){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tramites);
			}
		});

};

/**
 * Tramite middleware
 */
exports.tramiteByID = function(req, res, next, id) {
	Tramite.findById(id).populate('user', 'displayName').exec(function(err, tramite) {
		if (err) return next(err);
		if (! tramite) return next(new Error('Failed to load Tramite ' + id));
		req.tramite = tramite ;
		next();
	});
};

/**
 * Tramite authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tramite.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
