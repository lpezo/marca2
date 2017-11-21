'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Parametro = mongoose.model('Parametro'),
	Feriados = mongoose.model('Feriado'),
	_ = require('lodash');

/**
 * Create a Parametro
 */
exports.create = function(req, res) {
	var parametro = new Parametro(req.body);
	parametro.user = req.user;

	parametro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parametro);
		}
	});
};

/**
 * Show the current Parametro
 */
exports.read = function(req, res) {
	res.jsonp(req.parametro);
};

/***
	codigo: codigo del parametro
	fecha: fecha a sumar o restar
	despues: sumar la cantidad de dias o restar
***/
exports.obtenerFecha = function(req, res, next)
{
	var codParam = req.codParam;
	var fecha = new Date(req.fecha);
	var despues = req.despues;

	Parametro.findOne({codigo:codParam}).exec(function(err, parametro) {
		if (err) return next(err);
		if (! parametro) return next(new Error('Failed to load Parametro ' + codParam));
		
		var dias = parametro.diames === 'd' ? parametro.dias : parametro.dias * 30;	
		if (parametro.labo === 'y')
		{
			Feriados.find({}, {dia:1, mes:1}).exec(function(err, feriados){
				var ndias = 0;
				while(ndias < dias)
				{
					if (despues)
						fecha.setDate( fecha.getDate() + 1 );
					else
						fecha.setDate( fecha.getDate() - 1 );
					var day = fecha.getDay();
					if (day !== 0 && day !== 6)
					{
						//averiguar si es feriado
						var esFeriado = false;
						var dia = fecha.getDate();
						var mes = fecha.getMonth()+1;
						for (var i=0; i<feriados.length; i++)
						{
							if (feriados[i].dia === dia && feriados[i].mes === mes)
							{
								esFeriado = true;
								break;
							}
						}
						if (!esFeriado)
							ndias++;
					}
				}
				req.fechaNueva = fecha;
				next();
			});
		}
		else
		{
			if (despues)
				fecha.setDate( fecha.getDate() + dias );
			else
				fecha.setDate( fecha.getDate() - dias );
					req.fechaNueva = fecha;
			next();
		}
	});
};

/**
 * Calcula la fecha
 */
exports.readFecha = function(req, res) {
	//var obj = {fecha: req.query.fecha};
	var fecha = new Date(req.query.fecha);
	var param = req.parametro;
	var dias = param.diames === 'd' ? param.dias : param.dias * 30;
	if (param.labo === 'y')
	{
		//es laborable
		Feriados.find({},{dia:1,mes:1}).exec(function(err, feriados){
			//console.log('readFecha: feriados');
			var ndias = 0;
			while(ndias < dias)
			{
				fecha.setDate( fecha.getDate() + 1 );
				var day = fecha.getDay();
				//console.log('Dia:', ndias, 'Fecha:', fecha);
				//si es domingo o sabado no sumar
				if (day !== 0 && day !== 6)
				{
					//averiguar si es feriado
					var esFeriado = false;
					var dia = fecha.getDate();
					var mes = fecha.getMonth()+1;
					for (var i=0; i<feriados.length; i++)
					{
						if (feriados[i].dia === dia && feriados[i].mes === mes)
						{
							esFeriado = true;
							break;
						}
					}
					if (!esFeriado)
						ndias++;
					//else
					//	console.log('-->Es Feriado');
				}
				//else
				//	console.log('-->Es sabado o domingo');
			}
			var obj = {fecha: fecha};
			res.jsonp(obj);
		});
	}
	else
	{
		//no es laborable
		fecha.setDate( fecha.getDate() + dias );
		var obj = {fecha: fecha};
		res.jsonp(obj);
	}
};

/**
 * Update a Parametro
 */
exports.update = function(req, res) {
	var parametro = req.parametro ;

	parametro = _.extend(parametro , req.body);

	parametro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parametro);
		}
	});
};

/**
 * Delete an Parametro
 */
exports.delete = function(req, res) {
	var parametro = req.parametro ;

	parametro.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parametro);
		}
	});
};

/**
 * List of Parametros
 */
exports.list = function(req, res) {

	var all = req.query.all || 'false';
	if (all === 'true')
	{
		Parametro.find().exec(function(err, parametros){
			res.jsonp(parametros);
		});
		return;
	}

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


	Parametro
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, parametros){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(parametros);
			}
		});

};

/**
 * Parametro middleware
 */
exports.parametroByID = function(req, res, next, id) {
	Parametro.findById(id).populate('user', 'displayName').exec(function(err, parametro) {
		if (err) return next(err);
		if (! parametro) return next(new Error('Failed to load Parametro ' + id));
		req.parametro = parametro ;
		next();
	});
};

/**
 * Parametro middleware
 */
exports.parametroByCod = function(req, res, next, id) {
	Parametro.findOne({codigo:id}).populate('user', 'displayName').exec(function(err, parametro) {
		if (err) return next(err);
		if (! parametro) return next(new Error('Failed to load Parametro ' + id));
		req.parametro = parametro ;
		next();
	});
};


/**
 * Parametro authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.parametro.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
