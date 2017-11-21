'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Subclase = mongoose.model('Subclase'),
	_ = require('lodash');

var arregla = function(sub) {
	if (sub.clase.length === 1)
		sub.clase = '0' + sub.clase;
	if (sub.codigo.length === 1)
		sub.codigo = '0' + sub.codigo;
};

/**
 * Create a Subclase
 */
exports.create = function(req, res) {
	var subclase = new Subclase(req.body);
	subclase.user = req.user;

	arregla(subclase);

	subclase.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subclase);
		}
	});
};

/**
 * Show the current Subclase
 */
exports.read = function(req, res) {
	res.jsonp(req.subclase);
};

/**
 * Update a Subclase
 */
exports.update = function(req, res) {
	var subclase = req.subclase ;

	subclase = _.extend(subclase , req.body);

	arregla(subclase);

	subclase.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subclase);
		}
	});
};

/**
 * Delete an Subclase
 */
exports.delete = function(req, res) {
	var subclase = req.subclase ;

	subclase.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(subclase);
		}
	});
};

/**
 * List of Subclases
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
		sortObject.asc = 'clase';
	}

	sort = {
		sort: sortObject
	};


	Subclase
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, subclases){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(subclases);
			}
		});

};

/**
 * Subclase middleware
 */
exports.subclaseByID = function(req, res, next, id) {
	Subclase.findById(id).populate('user', 'displayName').exec(function(err, subclase) {
		if (err) return next(err);
		if (! subclase) return next(new Error('Failed to load Subclase ' + id));
		req.subclase = subclase ;
		next();
	});
};

/**
 * Subclase authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.subclase.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

// exports.getClases = function(req, res) {
// 	Subclase.aggregate(
// 		{$group: {
// 				_id: '$clase', text: {$first: '$name'}
// 			}
// 		},
// 		{$sort: {_id:1 }
// 		},
// 		{$project: {
// 			_id: 1,
// 			desc: { $substr: ['$text', 0, 30]}
// 		}},
// 		{$project:{
// 			_id: 1,
// 			desc: { $concat: ['$_id', ' - ', '$desc', '...']}
// 		}},
// 		function(err, result){
// 			if (err) 
// 				return res.status(400).send({
// 					message: errorHandler.getErrorMessage(err)
// 				});
// 			res.jsonp(result);
// 		}
// 	);
// };

exports.getClases = function(req, res) {
	Subclase.aggregate(
		{$group: {_id: '$clase'}
		},
		{$sort: {_id:1 }
		},
		function(err, result){
			if (err) 
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			var clases = [];
			result.forEach(function(cada){
				clases.push(cada._id);
			});
			res.jsonp(clases);			
		}
	);
};

exports.getSubClases = function(req, res) {
	var clase = req.params.IdClase;
	Subclase.find({clase:clase},{created:0}).exec(function(err, clases){
		if (err) 
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		res.jsonp(clases);
	});
};