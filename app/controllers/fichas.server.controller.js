'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ficha = mongoose.model('Ficha'),
	Cliente = mongoose.model('Cliente'),
	Fecven = mongoose.model('Fecven'),
	async = require('async'),
	_ = require('lodash'),
	Subclase = mongoose.model('Subclase'),
	Schema = mongoose.Schema,
	fs = require('fs'),
	path = require('path');


var parametros = require('./parametros.server.controller');

/**
 * Save Ficha
 */

 var saveFicha = function(ficha, req, res, next)
 {


	async.waterfall([

		function(done) {

			//Comprobar si el codigo del cliente existe

			if (ficha.codcli === '')
				return res.status(400).send({
						message: 'Cliente no debe estar vacío'});

			Cliente.findOne({codigo:ficha.codcli}, function(err, cliente){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)});
				}
				if (!cliente){
					console.log('Cliente no econtrado');

					return res.status(400).send({
						message: 'Cliente no encontrado'});
				}

				ficha.nomcli = cliente.nombre;
				done();
			});

		},
		function(done) {

			//console.log('Save Ficha: ', ficha._id);
			if (ficha.codigo || ficha.codigo > 0)
			{
				//console.log('Save Ficha: ', 'Es Edit');
				done(null, 0);
			}
			else
			Ficha.find({},{codigo:1}).sort({codigo:-1}).limit(1).exec(function(err, fichas){
				if (err) {
					done(err);
					return;
				}
				if (fichas && fichas.length > 0)
				{
					var ultcod = fichas[0].codigo;
					done(err, ultcod+1);
				}
				else
				{
					done(err, 1);
				}
			});

			//done(err, user);
			//return res.status(400).send({
			//	message: 'Passwords do not match'
		},
		function(numero, done) {
			//done(err, emailHTML, user);
			//console.log('numero:', numero);
			if (numero > 0)
			{
				ficha.codigo = numero;
			}

			if (!req.files || !req.files.file)
			{
				done(null, null);
				return;
			}

			 var file = req.files.file;
			 try {
			 	console.log(file.name);
			 	console.log(file.type);
			 	console.log(file.path);
			 }
			 catch(e) {
			      return res.status(400).send({
			            message: errorHandler.getErrorMessage(e)
			        });
			 }
			var nomdestino = numero.toString() + path.extname(file.path);
			var destino = path.join( './public/img', nomdestino);
			console.log('destino:', destino);	
			ficha.archivo = nomdestino;
			try {
				fs.createReadStream(file.path).pipe(fs.createWriteStream(destino));
				done(null, null);
			}
			catch(e) {
				  console.log(e);
			      return res.status(400).send({
			            message: errorHandler.getErrorMessage(e)
			        });
			}

			/* 
			fs.readFile(file.path, function (err,original_data) {
			 if (err) {
			      return res.status(400).send({
			            message: errorHandler.getErrorMessage(err)
			        });
			  } 
			    // save image in db as base64 encoded - this limits the image size
			    // to there should be size checks here and in client
			  var base64Image = original_data.toString('base64');
			  if (!req.borrar || req.borrar === 'si')
			  fs.unlink(file.path, function (err) {
			      if (err)
			      { 
			          console.log('failed to delete ' + file.path);
			      }
			      else{
			        console.log('successfully deleted ' + file.path);
			      }
			  });
			  //ficha.image = base64Image;

			  done(err, base64Image);

			});
			*/
		},
		function (imagen, done)
		{
			//console.log('ficha.save:', ficha, typeof ficha);
			ficha.image = undefined;
			// console.log('ficha: ', ficha);
			if (ficha.tramite === 'null')
				ficha.tramite = null;
			if (ficha.derecho === 'null')
				ficha.derecho = null;

			var toupper = ['deslogo', 'pripais', 'interes', 'estado', 'numcertificado', 'numexpediente', 'prinumero'];
			toupper.forEach(function(cada){
				if (ficha[cada] && ficha[cada] !== null && ficha[cada].constructor === String)
					ficha[cada] = ficha[cada].toUpperCase();
			});

			// if (ficha.clase === 'null')
			// 	ficha.clase = null;
			// console.log('ficha.clases:', ficha.clases, ficha.clases.constructor);
			// ficha.clases = JSON.parse(ficha.clases);

			if (ficha.clases)
			{
				if (ficha.clases.length === 0)
					ficha.clases = null;
				else
				if (ficha.clases.constructor === String)
					ficha.clases = JSON.parse(ficha.clases);
			}
			if (ficha.subclases)
			{
				if (ficha.subclases.length === 0)
					ficha.subclases = null;
				else
				if (ficha.subclases.constructor === String)
					ficha.subclases = JSON.parse(ficha.subclases);
				if (ficha.subclases)
				{
					// ficha.subclases.forEach(function(item){
					// 	delete item.label;
					// });
					for (var k=ficha.subclases.length-1; k>=0; k--){
						if (ficha.subclases[k].codigo === '00')
							ficha.subclases.splice(k, 1);
						else
							delete ficha.subclases[k].label;
					}
				}
			}
			if (ficha._id)
			{
				//console.log('saveFicha: es edit');

				var upd = {codcli: ficha.codcli, nomcli: ficha.nomcli, derecho: ficha.derecho, tramite: ficha.tramite,
					nomsigno: ficha.nomsigno, numexpediente: ficha.numexpediente, numcertificado: ficha.numcertificado,
					clases: ficha.clases, subclases: ficha.subclases, prinumero: ficha.prinumero || '', 
					prifecha: ficha.prifecha || null, pripais: ficha.pripais || '', 
					interes: ficha.interes || '', estado: ficha.estado || '', deslogo: ficha.deslogo || '', finalizado: ficha.finalizado, archivo: ficha.archivo || ''};

				// console.log('upd:',upd);

				if (imagen)
					upd.image = imagen;


				Ficha.update({_id: ficha._id}, upd).exec(function(err){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
					res.jsonp(ficha);
					done(err, 'done');
				});
			}
			else
			{
				//console.log('saveFicha: es nuevo');
				ficha = new Ficha(ficha);
				ficha.user = req.user;
				if (imagen)
					ficha.image = imagen;
				ficha.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: 'Save: ' + errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(ficha);
						done(err, 'done');
					}
				});
			}
		}


	], function(err) {
		if (err) return next(err);
	});

 };


/**
 * Create a Ficha
 */
exports.create = function(req, res, next) {

	//var ficha = new Ficha(req.body);
	//var obj = req.body;
	//if (obj.hasOwnProperty('user') && obj.user.hasOwnProperty('_id'))
	//	obj.user = obj.user._id;

	/*
	if (req.body.hasOwnProperty('user'))
		delete req.body.user;
	var ficha = new Ficha();
	//ficha = _.extend(ficha, obj);
	if (req.body.hasOwnProperty('_id'))
	{
		//ficha = _.extend(ficha , req.body);
		console.log('esedit:', ficha);
	}
	else
	{
		ficha.user = req.user;
		console.log('escreate:', ficha);
	}
	*/
	// console.log('create:', req.body);
	saveFicha(req.body, req, res, next);


};

/**
 * Show the current Ficha
 */
exports.read = function(req, res) {
	var ficha = req.ficha.toObject();
	if (ficha.subclases && ficha.subclases.length > 0)
	{
		async.forEach(ficha.subclases, function(cadaSub, cb){
			Subclase.findOne({clase:cadaSub.clase,codigo:cadaSub.codigo})
			.exec(function(err, subclase){
				if (!err && subclase)
				{
					cadaSub.label = subclase.name;
				}
				cb();
			});
		}, function(err){
			res.jsonp(ficha);
		});
	}
	else
	{
		if (ficha.clases)
		{
			ficha.subclases = [];
			ficha.clases.forEach(function(cadaclase){
				ficha.subclases.push({clase:cadaclase, codigo:'00', label:'No se ha seleccionado una subclase'});
			});
		}
		res.jsonp(ficha);
	}
};

/**
 * Update a Ficha
 */
exports.update = function(req, res, next) {
	//console.log('ficha.update');
	var ficha = req.ficha.toObject() ;

	ficha = _.extend(ficha , req.body);

	//console.log('update:', ficha);

	saveFicha(ficha, req, res, next);
};


exports.updateImagen = function(req, res, next)
{
	/*
	var file = req.files.file;
	 try {
	 	console.log(file.name);
	 	console.log(file.type);
	 	console.log(file.path);
	 }
	*/
	Ficha.find({nomsigno: /.png$/i}).exec(function(err, fichas){
		if (err) 
			return res.status(400).send({
				message: 'update: ' + errorHandler.getErrorMessage(err)
			});
		var ficheros = [];
		async.each(fichas, function(ficha, cb){
			var file = '/home/luis/proy/Imagenes/' + ficha.nomsigno.toLowerCase();
				fs.readFile(file, function (err, original_data) {
				 if (err) {
				 	ficheros.push({codigo:ficha.codigo, signo: file, msg: errorHandler.getErrorMessage(err)});
				 	cb();
				 	return;
				  } 
				    // save image in db as base64 encoded - this limits the image size
				    // to there should be size checks here and in client
				 var image64 = original_data.toString('base64');
				 Ficha.update({codigo:ficha.codigo}, {image: image64}).exec(function(err){
				 	  if (err)
				 	  	ficheros.push({codigo:ficha.codigo, signo: file, msg: errorHandler.getErrorMessage(err)});
				 	  else
					 	ficheros.push({codigo:ficha.codigo, signo: file, msg:'ok'});
					 cb();
				 });
				});
	 	},
	 	function (err){
	 		if (err)
				return res.status(400).send({
					message: 'update: ' + errorHandler.getErrorMessage(err)
				});
			res.jsonp(ficheros);
	 	});
	});
};


exports.updateFecha = function(req, res, next)
{
	var ficha = req.ficha.toObject();
	ficha = _.extend(ficha, req.body);
	console.log('updateFecha:', ficha.fechas);
	Ficha.update({_id:ficha._id}, {fechas: ficha.fechas}).exec(function(err){
		if (err) {
			return res.status(400).send({
				message: 'update: ' + errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(ficha.fechas);
	});
};

/**
 * Delete an Ficha
 */
exports.delete = function(req, res) {
	var ficha = req.ficha;

	ficha.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ficha);
		}
	});
};

/**
 * List of Fichas
 */
exports.list = function(req, res, next) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var q = req.query.query;


	var qfilter = req.query.filter;
	var qcodigo = {};
	var gte = null;
	var lte = null;

	if (qfilter && qfilter.hasOwnProperty('codigo'))
	{
		qcodigo = {codigo: qfilter.codigo};
		delete qfilter.codigo;
	}

	if (q)
	{
		if (q.clase && q.clase !== null)
		{
			qcodigo.clases = q.clase;
		}
		if (q.vencfecha1 && q.vencfecha1 !== null && q.vencfecha2 && q.vencfecha2 !== null)
		{
			console.log('vencfecha:', q.vencfecha1, q.vencfecha2);
			// q.codigo.fechas = {fecvenc : q.vencfecha1};
			gte = {'fechas.fecvenc': q.vencfecha1};
			lte = {'fechas.fecvenc': q.vencfecha2};
		}
	}

	var filter = {
		filters : {
			field: ['codigo', 'codcli', 'nomcli', 'nomsigno', 'numcertificado', 'clases', 'fechas.fecvenc', 'archivo'],
			mandatory : {
				contains: qfilter,
				exact: qcodigo,
				greaterThanEqual: gte,
				lessThanEqual: lte
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

	//async.waterfall([
	//	function (done){

	Ficha
	.find()
	.field(filter)
	.filter(filter)
	.order(sort)
	.page(pagination, function(err, fichas){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
			//done(err);
		} else {
			res.jsonp(fichas);
			//done(err, fichas);
		}
	});
};

exports.reporte1 = function(req, res, next) {
	var codcli = req.query.codcli;
	var tipoFecha = req.query.tipoFecha;
	var desde = req.query.desde;
	var hasta = req.query.hasta;

	console.log('codcli: ', codcli);
	console.log('tipoFecha:', tipoFecha);
	console.log('Desde:', desde, ' - Hasta: ', hasta);

	
	var query = {};
	if (codcli && codcli !== null)
		query.codcli = codcli;
	//var key = 'fechas.' + tipoFecha;
	//var key = tipoFecha;
	if (!desde || !hasta)
	{
		return res.status(400).send({
			message: 'Falta ingresar alguna fecha'});
	}
	query[tipoFecha] = {'$gte': desde, '$lte': hasta};
	console.log('query:', query);
	Ficha.find(query, 
		{codigo:1, nomsigno:1, clases:1, numcertificado:1, image: 1, fechas:1, archivo:1})
		.exec(function(err, fichas){
			if (err)
			{
				console.log('error:', errorHandler.getErrorMessage(err));
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			else
			{
				/*
				console.log('fichas antes:', fichas);
				var afichas = [];
				async.each(fichas, function(item, callback){
					var oitem = item.toObject();
					var pos = tipoFecha.indexOf('.');
					if (pos >= 0)
					oitem.fecha = oitem.fechas[tipoFecha.substr(pos+1)];
					afichas.push(oitem);
					callback();
				},function(err){
					console.log('fichas:despues', afichas);
					if (err)
					{
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});						
					}
					res.jsonp(afichas);
				});
				*/
				var afichas = [];
				for (var i in fichas)
				{
					var oitem = fichas[i].toObject();
					var pos = tipoFecha.indexOf('.');
					if (pos >= 0)
						oitem.fecha = oitem.fechas[tipoFecha.substr(pos+1)];
					oitem.num = parseInt(i)+1;
					afichas.push(oitem);
				}
				res.jsonp(afichas);
			}
		});

};

/*

exports.obtenerFecha = function(req, res, next)
{
	req.codParam = '20';
	req.fecha = new Date();
	req.fecha.setHours(0,0,0,0);
	req.despues = false;

	parametros.obtenerFecha(req, res, next);

};

*/

exports.obtenerFechaVenc = function(req, res, next)
{
	Fecven.find().exec(function(err, fechas){
		if (err)
		{
			console.log('Error:', errorHandler.getErrorMessage(err));
			if (! fechas) return next(new Error('Failed to load Fechas Vencimientos '));
		}
		else
		{
			req.fechasVenc = fechas;
			next();
		}
	});
};

exports.listVencimientos = function(req, res, next)
{
	var afichas = [];

	var hasta = new Date();
	hasta.setHours(0,0,0,0);

	var iNum = 0;

	/*
	var busquedas = [ 
		{campo:'fechas.fecpub', descarte: 'fechas.fecpubDescarte', motivo: 'Fecha de Publicación'}, 
		{campo:'fechas.fecvenc', descarte: 'fechas.fecvencDescarte', motivo: 'Fecha de Vencimiento'}
	];
	*/
	var busquedas = req.fechasVenc;
	console.log('listVencimientos');
	console.log('hasta:', hasta);
	async.each(busquedas, function(busq, callback){

		var qfinalizado = { $or: [{finalizado: false},{finalizado:{$exists:false}}] } ;

		//var qdescarte = {$or: [{[busq.descarte]:false}, {[busq.descarte]:{$exists:false}}]};
		var qdescarte = {$or: [{}, {}]};
		qdescarte.$or[0][busq.descarte] = false;
		qdescarte.$or[1][busq.descarte] = {$exists:false};
		//query[busq.descarte] = false;
		//var qrango = {[busq.campo]: {'$gte': desde, '$lte': hasta}};
		var desde = new Date();
		desde.setHours(0,0,0,0);
		desde.setDate(desde.getDate() - busq.dias);
		var hastax = new Date();
		hastax.setHours(0,0,0,0);
		hastax.setDate(hastax.getDate() + busq.dias);
		var qrango = {};
		qrango[busq.campo] = {'$gte': desde, '$lte': hastax};
		console.log('desde:', desde, 'hasta:', hastax);
		var query = {$and:[qfinalizado, qdescarte, qrango]};
		var proy = {codigo:1, codcli:1, nomcli:1, nomsigno:1, numexpediente:1, numcertificado:1, archivo:1};
		proy[busq.campo] = 1;

		console.log('query:', query);

		Ficha.find(query, proy).exec(function(err, fichas){
			if (err)
			{
				console.log('Error:', errorHandler.getErrorMessage(err));
			}
			else
			{
				fichas.forEach(function(fich){
					//console.log('fich:', fich);
					var obj = fich.toObject();
					obj.motivo = busq.descripcion;
					var pos = busq.campo.indexOf('.');
					obj.fecha = obj[busq.campo.substr(0, pos)][busq.campo.substr(pos+1)];
					//obj.fecha = obj['fechas'][busq.campo];
					if (obj.fecha > hasta)
						obj.motivo = obj.motivo + ' (vencido)';
					obj.descarte = busq.descarte;
					iNum++;
					obj.num = iNum;
					afichas.push(obj);
					//console.log('obj:', obj);
				});
			}
			callback();
		});


	},function(err){
		if (err)
		{
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else
		{
			res.jsonp(afichas);
		}
	});
};

/**
 * Ficha middleware
 */
exports.fichaByID = function(req, res, next, id) {
	Ficha.findById(id).populate('user', 'displayName')
	.populate('derecho', 'codigo name')
	.populate('tramite', 'codigo name')
	.populate('clase', 'codigo name')
	.exec(function(err, ficha) {
		if (err) return next(err);
		if (! ficha) return next(new Error('Failed to load Ficha ' + id));
		req.ficha = ficha;	//.toObject();

		next();
	});
};

exports.fichaByIDFecha = function(req, res, next, id) {
	Ficha.findById(id,{codigo:1,fechas:1})
	.exec(function(err, ficha) {
		if (err) return next(err);
		if (! ficha) return next(new Error('Failed to load Ficha ' + id));
		req.ficha = ficha ;
		next();
	});
};

/**
 * Ficha authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*
	if (req.ficha.user.id !== req.user.id) {
		return res.status(400).send({
			message: "Usuario no autorizado"
		});
	}
	*/
	next();
};

exports.updateDescarte = function(req, res, next)
{
	var codFicha = req.params.codFicha;
	var descarte = req.params.descarte;
	var upd = {};
	upd[descarte] = true;

	Ficha.update({codigo:codFicha}, upd).exec(function(err, ficha){
		if (err) return next(err);
		res.jsonp(ficha);
	});
};
