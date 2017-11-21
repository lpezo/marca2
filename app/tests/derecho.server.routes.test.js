'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Derecho = mongoose.model('Derecho'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, derecho;

/**
 * Derecho routes tests
 */
describe('Derecho CRUD tests', function() {
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

		// Save a user to the test db and create new Derecho
		user.save(function() {
			derecho = {
				name: 'Derecho Name'
			};

			done();
		});
	});

	it('should be able to save Derecho instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Derecho
				agent.post('/derechos')
					.send(derecho)
					.expect(200)
					.end(function(derechoSaveErr, derechoSaveRes) {
						// Handle Derecho save error
						if (derechoSaveErr) done(derechoSaveErr);

						// Get a list of Derechos
						agent.get('/derechos')
							.end(function(derechosGetErr, derechosGetRes) {
								// Handle Derecho save error
								if (derechosGetErr) done(derechosGetErr);

								// Get Derechos list
								var derechos = derechosGetRes.body;

								// Set assertions
								(derechos[0].user._id).should.equal(userId);
								(derechos[0].name).should.match('Derecho Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Derecho instance if not logged in', function(done) {
		agent.post('/derechos')
			.send(derecho)
			.expect(401)
			.end(function(derechoSaveErr, derechoSaveRes) {
				// Call the assertion callback
				done(derechoSaveErr);
			});
	});

	it('should not be able to save Derecho instance if no name is provided', function(done) {
		// Invalidate name field
		derecho.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Derecho
				agent.post('/derechos')
					.send(derecho)
					.expect(400)
					.end(function(derechoSaveErr, derechoSaveRes) {
						// Set message assertion
						(derechoSaveRes.body.message).should.match('Please fill Derecho name');
						
						// Handle Derecho save error
						done(derechoSaveErr);
					});
			});
	});

	it('should be able to update Derecho instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Derecho
				agent.post('/derechos')
					.send(derecho)
					.expect(200)
					.end(function(derechoSaveErr, derechoSaveRes) {
						// Handle Derecho save error
						if (derechoSaveErr) done(derechoSaveErr);

						// Update Derecho name
						derecho.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Derecho
						agent.put('/derechos/' + derechoSaveRes.body._id)
							.send(derecho)
							.expect(200)
							.end(function(derechoUpdateErr, derechoUpdateRes) {
								// Handle Derecho update error
								if (derechoUpdateErr) done(derechoUpdateErr);

								// Set assertions
								(derechoUpdateRes.body._id).should.equal(derechoSaveRes.body._id);
								(derechoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Derechos if not signed in', function(done) {
		// Create new Derecho model instance
		var derechoObj = new Derecho(derecho);

		// Save the Derecho
		derechoObj.save(function() {
			// Request Derechos
			request(app).get('/derechos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Derecho if not signed in', function(done) {
		// Create new Derecho model instance
		var derechoObj = new Derecho(derecho);

		// Save the Derecho
		derechoObj.save(function() {
			request(app).get('/derechos/' + derechoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', derecho.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Derecho instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Derecho
				agent.post('/derechos')
					.send(derecho)
					.expect(200)
					.end(function(derechoSaveErr, derechoSaveRes) {
						// Handle Derecho save error
						if (derechoSaveErr) done(derechoSaveErr);

						// Delete existing Derecho
						agent.delete('/derechos/' + derechoSaveRes.body._id)
							.send(derecho)
							.expect(200)
							.end(function(derechoDeleteErr, derechoDeleteRes) {
								// Handle Derecho error error
								if (derechoDeleteErr) done(derechoDeleteErr);

								// Set assertions
								(derechoDeleteRes.body._id).should.equal(derechoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Derecho instance if not signed in', function(done) {
		// Set Derecho user 
		derecho.user = user;

		// Create new Derecho model instance
		var derechoObj = new Derecho(derecho);

		// Save the Derecho
		derechoObj.save(function() {
			// Try deleting Derecho
			request(app).delete('/derechos/' + derechoObj._id)
			.expect(401)
			.end(function(derechoDeleteErr, derechoDeleteRes) {
				// Set message assertion
				(derechoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Derecho error error
				done(derechoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Derecho.remove().exec(function(){
				done();
			});	
		});
	});
});
