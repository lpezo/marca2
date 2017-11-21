'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tramite Schema
 */
var TramiteSchema = new Schema({
	codigo: {
		type: String,
		default: '',
		required: 'Llene el código de trámite',
		trim: true,
		unique: true
	},
	name: {
		type: String,
		default: '',
		required: 'Llene el nombre de trámite',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tramite', TramiteSchema);