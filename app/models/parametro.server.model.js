'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Parametro Schema
 */
var ParametroSchema = new Schema({
	codigo: {
		type: String,
		default: '',
		required: 'Ingrese el código',
		trim: true,
		unique: true
	},
	desc: {
		type: String,
		default: '',
		required: 'Ingrese la descripción',
		trim: true
	},
	dias: {
		type: Number,
		default: 0
	},
	diames: {
		type: String,
		default: 'd'
	},
	labo: {
		type: String,
		default: 'y'
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

mongoose.model('Parametro', ParametroSchema);