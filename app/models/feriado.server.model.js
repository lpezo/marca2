'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Feriado Schema
 */
var FeriadoSchema = new Schema({
	dia: {
		type: Number,
		default: 1,
		required: 'Ingrese el día',
		min: 1, max: 31
	},
	mes: {
		type: Number,
		default: 1,
		required: 'Ingrese el mes',
		min: 1, max: 12
	},
	glosa: {
		type: String,
		default: '',
		required: 'Ingrese la glosa',
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
}).index({dia:1, mes:1});

mongoose.model('Feriado', FeriadoSchema);