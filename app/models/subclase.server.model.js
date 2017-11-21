'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Subclase Schema
 */
var SubclaseSchema = new Schema({
	clase: {
		type: String,
		default: '',
		required: 'Ingrese el campo Clase',
		trim: true
	},
	codigo: {
		type: String,
		default: '',
		required: 'Ingrese el campo Subclase',
		trim: true
	},
	name: {
		type: String,
		default: '',
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
}, {index: {clase: 1, codigo:1}});

mongoose.model('Subclase', SubclaseSchema);