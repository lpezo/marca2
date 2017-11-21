'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feriado = mongoose.model('Feriado'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, feriado;

/**
 * Feriado routes tests
 */
describe('Feriado CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Feriado
		user.save(function() {
			feriado = {
				name: 'Feriado Name'
			};

			done();
		});
	});

	it('should be able to save Feriado instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feriado
				agent.post('/feriados')
					.send(feriado)
					.expect(200)
					.end(function(feriadoSaveErr, feriadoSaveRes) {
						// Handle Feriado save error
						if (feriadoSaveErr) done(feriadoSaveErr);

						// Get a list of Feriados
						agent.get('/feriados')
							.end(function(feriadosGetErr, feriadosGetRes) {
								// Handle Feriado save error
								if (feriadosGetErr) done(feriadosGetErr);

								// Get Feriados list
								var feriados = feriadosGetRes.body;

								// Set assertions
								(feriados[0].user._id).should.equal(userId);
								(feriados[0].name).should.match('Feriado Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Feriado instance if not logged in', function(done) {
		agent.post('/feriados')
			.send(feriado)
			.expect(401)
			.end(function(feriadoSaveErr, feriadoSaveRes) {
				// Call the assertion callback
				done(feriadoSaveErr);
			});
	});

	it('should not be able to save Feriado instance if no name is provided', function(done) {
		// Invalidate name field
		feriado.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feriado
				agent.post('/feriados')
					.send(feriado)
					.expect(400)
					.end(function(feriadoSaveErr, feriadoSaveRes) {
						// Set message assertion
						(feriadoSaveRes.body.message).should.match('Please fill Feriado name');
						
						// Handle Feriado save error
						done(feriadoSaveErr);
					});
			});
	});

	it('should be able to update Feriado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feriado
				agent.post('/feriados')
					.send(feriado)
					.expect(200)
					.end(function(feriadoSaveErr, feriadoSaveRes) {
						// Handle Feriado save error
						if (feriadoSaveErr) done(feriadoSaveErr);

						// Update Feriado name
						feriado.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Feriado
						agent.put('/feriados/' + feriadoSaveRes.body._id)
							.send(feriado)
							.expect(200)
							.end(function(feriadoUpdateErr, feriadoUpdateRes) {
								// Handle Feriado update error
								if (feriadoUpdateErr) done(feriadoUpdateErr);

								// Set assertions
								(feriadoUpdateRes.body._id).should.equal(feriadoSaveRes.body._id);
								(feriadoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Feriados if not signed in', function(done) {
		// Create new Feriado model instance
		var feriadoObj = new Feriado(feriado);

		// Save the Feriado
		feriadoObj.save(function() {
			// Request Feriados
			request(app).get('/feriados')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Feriado if not signed in', function(done) {
		// Create new Feriado model instance
		var feriadoObj = new Feriado(feriado);

		// Save the Feriado
		feriadoObj.save(function() {
			request(app).get('/feriados/' + feriadoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', feriado.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Feriado instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feriado
				agent.post('/feriados')
					.send(feriado)
					.expect(200)
					.end(function(feriadoSaveErr, feriadoSaveRes) {
						// Handle Feriado save error
						if (feriadoSaveErr) done(feriadoSaveErr);

						// Delete existing Feriado
						agent.delete('/feriados/' + feriadoSaveRes.body._id)
							.send(feriado)
							.expect(200)
							.end(function(feriadoDeleteErr, feriadoDeleteRes) {
								// Handle Feriado error error
								if (feriadoDeleteErr) done(feriadoDeleteErr);

								// Set assertions
								(feriadoDeleteRes.body._id).should.equal(feriadoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Feriado instance if not signed in', function(done) {
		// Set Feriado user 
		feriado.user = user;

		// Create new Feriado model instance
		var feriadoObj = new Feriado(feriado);

		// Save the Feriado
		feriadoObj.save(function() {
			// Try deleting Feriado
			request(app).delete('/feriados/' + feriadoObj._id)
			.expect(401)
			.end(function(feriadoDeleteErr, feriadoDeleteRes) {
				// Set message assertion
				(feriadoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Feriado error error
				done(feriadoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Feriado.remove().exec(function(){
				done();
			});	
		});
	});
});
