'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ficha Fechas Schema
 */ 
var FichasFechaSchema = 
{
	//fecha de presentacion
	fecpre: {
		type: Date
	},
	//fecha de notificacion
	fecnoti: {
		type: Date
	},
	//notificacion
	noti: {
		type: String,
		default: '',
		trim: true
	},
	//fecha de publicacion
	fecabs: {
		type: Date
	},
	fecpub: {
		type: Date
	},
	fecpubDescarte: {
		type: Boolean,
		default: false
	},
	//fecha vencimiento plazo de observación
	fecvencplazo: {
		type: Date
	},
	//observacion
	obs: {
		type: String,
		default: '',
		trim: true
	},
	//fech notificacion de oposicion
	fecnotopo: {
		type: Date
	},
	//fecha plazo de contestacion de oposicion
	fecplazocont: {
		type: Date
	},
	//fecha de informe legal
	fecinflegal: {
		type: Date
	},
	//fecha de resolucion
	fecresol: {
		type: Date
	},
	//fecha de noticacion de resolucion
	fecnotresol: {
		type: Date
	},
	//Venc Plazo de Reconsideración
	fecplareco: {
		type: Date
	},
	//Notificacion Resolución
	fecnotresoreco: {
		type: Date
	},
	//vencimeinteo de plazo de apelación
	fecvencplaape: {
		type: Date
	},
	//Notificación de Resolucióin
	fecnotresoape: {
		type: Date
	},
	//Venc. Plazo de demanda
	fecvencplazdem: {
		type: Date
	},
	//Resolución Judicial
	fecresojud: {
		type: Date
	},
	//Fecha de Vencimiento
	fecvenc: {
		type: Date
	},
	fecvencDescarte: {
		type: Boolean,
		default: false
	},
	//Vigente Hasta
	fecvigente: {
		type: Date
	},
	fecvigenteDescarte: {
		type: Boolean,
		default: false
	},
	//notif orden de publicacion
	fecordpub: {
		type: Date
	},
	//venc plazo para publicar
	fecvencplapub: {
		type: Date
	}
};
 

/**
 * Ficha Schema
 */
var FichaSchema = new Schema({
	codigo: {
		type: Number,
		unique: true
	},
	codcli: {
		type: String,
		default: '',
		trim: true,
		require: 'Ingrese un cliente'
	},
	nomcli: {
		type: String,
		default: ''
	},
	codtit: {
		type: String,
		default: '',
		trim: true,
		require: 'Ingrese un titular'
	},
	nomtit: {
		type: String,
		default: ''
	},
	derecho: {
		type: Schema.ObjectId,
		ref: 'Derecho'
	},
	tramite: {
		type: Schema.ObjectId,
		ref: 'Tramite'
	},
	image: {
		type: String,
		default: ''
	},
	nomsigno: {
		type: String,
		default: ''
	},
	numexpediente: {
		type: String,
		default: ''
	},
	numcertificado: {
		type: String,
		default: ''
	},
	clases: {
		type: [String],
		index: true
	},
	subclases: {
		type: [{clase:String, codigo:String}]
	},
	prinumero: {
		type: String
	},
	prifecha: {
		type: Date
	},
	pripais: {
		type: String
	},
	interes: {
		type: String
	},
	estado: {
		type: String
	},
	deslogo: {
		type: String
	},
	fechas: FichasFechaSchema,
	finalizado: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	obs: {
		type: String
	},
	archivo: {
		type: String
	},
	fechavenc: {
		type: Date
	},
	fechavencDescarte: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Ficha', FichaSchema);
