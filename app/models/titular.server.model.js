'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Titular Schema
 */
var TitularSchema = new Schema({
	codigo: {
		type: String,
		default: '',
		required: 'Ingrese el código de titular',
		trim: true,
		unique: true,
		index: true
	},
	nombre: {
		type: String,
		default: '',
		required: 'Ingrese el nombre',
		trim: true
	},
	direccion: {
		type: String,
		default: '',
		trim: true
	},
	distrito: {
		type: String,
		default: '',
		trim: true
	},
	provincia: {
		type: String,
		default: '',
		trim: true
	},
	departamen: {
		type: String,
		default: '',
		trim: true
	},
	pais: String,
	telefono: String,
	fax: String,
	e_mail: String,
	ruc: String,
	propietari: String,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Titular', TitularSchema);