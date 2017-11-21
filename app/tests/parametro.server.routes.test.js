'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Parametro = mongoose.model('Parametro'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, parametro;

/**
 * Parametro routes tests
 */
describe('Parametro CRUD tests', function() {
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

		// Save a user to the test db and create new Parametro
		user.save(function() {
			parametro = {
				name: 'Parametro Name'
			};

			done();
		});
	});

	it('should be able to save Parametro instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parametro
				agent.post('/parametros')
					.send(parametro)
					.expect(200)
					.end(function(parametroSaveErr, parametroSaveRes) {
						// Handle Parametro save error
						if (parametroSaveErr) done(parametroSaveErr);

						// Get a list of Parametros
						agent.get('/parametros')
							.end(function(parametrosGetErr, parametrosGetRes) {
								// Handle Parametro save error
								if (parametrosGetErr) done(parametrosGetErr);

								// Get Parametros list
								var parametros = parametrosGetRes.body;

								// Set assertions
								(parametros[0].user._id).should.equal(userId);
								(parametros[0].name).should.match('Parametro Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Parametro instance if not logged in', function(done) {
		agent.post('/parametros')
			.send(parametro)
			.expect(401)
			.end(function(parametroSaveErr, parametroSaveRes) {
				// Call the assertion callback
				done(parametroSaveErr);
			});
	});

	it('should not be able to save Parametro instance if no name is provided', function(done) {
		// Invalidate name field
		parametro.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parametro
				agent.post('/parametros')
					.send(parametro)
					.expect(400)
					.end(function(parametroSaveErr, parametroSaveRes) {
						// Set message assertion
						(parametroSaveRes.body.message).should.match('Please fill Parametro name');
						
						// Handle Parametro save error
						done(parametroSaveErr);
					});
			});
	});

	it('should be able to update Parametro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parametro
				agent.post('/parametros')
					.send(parametro)
					.expect(200)
					.end(function(parametroSaveErr, parametroSaveRes) {
						// Handle Parametro save error
						if (parametroSaveErr) done(parametroSaveErr);

						// Update Parametro name
						parametro.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Parametro
						agent.put('/parametros/' + parametroSaveRes.body._id)
							.send(parametro)
							.expect(200)
							.end(function(parametroUpdateErr, parametroUpdateRes) {
								// Handle Parametro update error
								if (parametroUpdateErr) done(parametroUpdateErr);

								// Set assertions
								(parametroUpdateRes.body._id).should.equal(parametroSaveRes.body._id);
								(parametroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parametros if not signed in', function(done) {
		// Create new Parametro model instance
		var parametroObj = new Parametro(parametro);

		// Save the Parametro
		parametroObj.save(function() {
			// Request Parametros
			request(app).get('/parametros')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Parametro if not signed in', function(done) {
		// Create new Parametro model instance
		var parametroObj = new Parametro(parametro);

		// Save the Parametro
		parametroObj.save(function() {
			request(app).get('/parametros/' + parametroObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', parametro.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Parametro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parametro
				agent.post('/parametros')
					.send(parametro)
					.expect(200)
					.end(function(parametroSaveErr, parametroSaveRes) {
						// Handle Parametro save error
						if (parametroSaveErr) done(parametroSaveErr);

						// Delete existing Parametro
						agent.delete('/parametros/' + parametroSaveRes.body._id)
							.send(parametro)
							.expect(200)
							.end(function(parametroDeleteErr, parametroDeleteRes) {
								// Handle Parametro error error
								if (parametroDeleteErr) done(parametroDeleteErr);

								// Set assertions
								(parametroDeleteRes.body._id).should.equal(parametroSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Parametro instance if not signed in', function(done) {
		// Set Parametro user 
		parametro.user = user;

		// Create new Parametro model instance
		var parametroObj = new Parametro(parametro);

		// Save the Parametro
		parametroObj.save(function() {
			// Try deleting Parametro
			request(app).delete('/parametros/' + parametroObj._id)
			.expect(401)
			.end(function(parametroDeleteErr, parametroDeleteRes) {
				// Set message assertion
				(parametroDeleteRes.body.message).should.match('User is not logged in');

				// Handle Parametro error error
				done(parametroDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Parametro.remove().exec(function(){
				done();
			});	
		});
	});
});
