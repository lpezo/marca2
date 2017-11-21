'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ubi Schema
 */
var UbiSchema = new Schema({
	nom: {
		type: String,
		default: '',
		required: 'No se ha ingresado el Nombre',
		trim: true,
	},
	pad: {
		type: Number,
		default: 0
	},
	num: {
		type: Number,
		default: 0,
		index:true
	},
	niv: {
		type: Number,
		default: 0
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

mongoose.model('Ubi', UbiSchema);