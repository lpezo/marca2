'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fecven Schema
 */
var FecvenSchema = new Schema({
	campo: {
		type: String,
		default: '',
		required: 'Por favor llene campo',
		trim: true
	},
	descarte: {
		type: String,
		default: '',
		trim: true
	},
	descripcion: {
		type: String,
		default: '',
		trim: true
	},
	dias: {
		type: Number,
		default: 5
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

mongoose.model('Fecven', FecvenSchema);