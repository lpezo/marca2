'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Derecho Schema
 */
var DerechoSchema = new Schema({
	codigo: {
		type: String,
		default: '',
		required: 'Ingrese código de derecho',
		trim: true,
		index: true,
		unique: true
	},
	name: {
		type: String,
		default: '',
		required: 'Ingrese nombre de derecho',
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

mongoose.model('Derecho', DerechoSchema);