'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Derecho = mongoose.model('Derecho'),
	_ = require('lodash');

/**
 * Create a Derecho
 */
exports.create = function(req, res) {
	var derecho = new Derecho(req.body);
	derecho.user = req.user;

	derecho.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(derecho);
		}
	});
};

/**
 * Show the current Derecho
 */
exports.read = function(req, res) {
	res.jsonp(req.derecho);
};

/**
 * Update a Derecho
 */
exports.update = function(req, res) {
	var derecho = req.derecho ;

	derecho = _.extend(derecho , req.body);

	derecho.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(derecho);
		}
	});
};

/**
 * Delete an Derecho
 */
exports.delete = function(req, res) {
	var derecho = req.derecho ;

	derecho.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(derecho);
		}
	});
};

/**
 * List of Derechos
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var all = req.query.all || false;
	if (all)
	{
		Derecho.find({},{codigo:1,name:1}).sort({codigo:1}).exec(function(err, derechos){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(derechos);
			}
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
		sortObject.asc = 'codigox';
	}

	sort = {
		sort: sortObject
	};


	Derecho
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, derechos){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(derechos);
			}
		});

};

/*
exports.listall = function(req, res)
{
	Derecho.find({},{codigo:1,name:1}).sort({codigo:1}).exec(function(err, derechos){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(derechos);
		}
	});
};

*/
/**
 * Derecho middleware
 */
exports.derechoByID = function(req, res, next, id) {
	Derecho.findById(id).populate('user', 'displayName').exec(function(err, derecho) {
		if (err) return next(err);
		if (! derecho) return next(new Error('Failed to load Derecho ' + id));
		req.derecho = derecho ;
		next();
	});
};

/**
 * Derecho authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.derecho.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
