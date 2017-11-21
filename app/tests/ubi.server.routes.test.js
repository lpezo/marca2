'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ubi = mongoose.model('Ubi'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ubi;

/**
 * Ubi routes tests
 */
describe('Ubi CRUD tests', function() {
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

		// Save a user to the test db and create new Ubi
		user.save(function() {
			ubi = {
				name: 'Ubi Name'
			};

			done();
		});
	});

	it('should be able to save Ubi instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ubi
				agent.post('/ubis')
					.send(ubi)
					.expect(200)
					.end(function(ubiSaveErr, ubiSaveRes) {
						// Handle Ubi save error
						if (ubiSaveErr) done(ubiSaveErr);

						// Get a list of Ubis
						agent.get('/ubis')
							.end(function(ubisGetErr, ubisGetRes) {
								// Handle Ubi save error
								if (ubisGetErr) done(ubisGetErr);

								// Get Ubis list
								var ubis = ubisGetRes.body;

								// Set assertions
								(ubis[0].user._id).should.equal(userId);
								(ubis[0].name).should.match('Ubi Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ubi instance if not logged in', function(done) {
		agent.post('/ubis')
			.send(ubi)
			.expect(401)
			.end(function(ubiSaveErr, ubiSaveRes) {
				// Call the assertion callback
				done(ubiSaveErr);
			});
	});

	it('should not be able to save Ubi instance if no name is provided', function(done) {
		// Invalidate name field
		ubi.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ubi
				agent.post('/ubis')
					.send(ubi)
					.expect(400)
					.end(function(ubiSaveErr, ubiSaveRes) {
						// Set message assertion
						(ubiSaveRes.body.message).should.match('Please fill Ubi name');
						
						// Handle Ubi save error
						done(ubiSaveErr);
					});
			});
	});

	it('should be able to update Ubi instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ubi
				agent.post('/ubis')
					.send(ubi)
					.expect(200)
					.end(function(ubiSaveErr, ubiSaveRes) {
						// Handle Ubi save error
						if (ubiSaveErr) done(ubiSaveErr);

						// Update Ubi name
						ubi.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ubi
						agent.put('/ubis/' + ubiSaveRes.body._id)
							.send(ubi)
							.expect(200)
							.end(function(ubiUpdateErr, ubiUpdateRes) {
								// Handle Ubi update error
								if (ubiUpdateErr) done(ubiUpdateErr);

								// Set assertions
								(ubiUpdateRes.body._id).should.equal(ubiSaveRes.body._id);
								(ubiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ubis if not signed in', function(done) {
		// Create new Ubi model instance
		var ubiObj = new Ubi(ubi);

		// Save the Ubi
		ubiObj.save(function() {
			// Request Ubis
			request(app).get('/ubis')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ubi if not signed in', function(done) {
		// Create new Ubi model instance
		var ubiObj = new Ubi(ubi);

		// Save the Ubi
		ubiObj.save(function() {
			request(app).get('/ubis/' + ubiObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ubi.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ubi instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ubi
				agent.post('/ubis')
					.send(ubi)
					.expect(200)
					.end(function(ubiSaveErr, ubiSaveRes) {
						// Handle Ubi save error
						if (ubiSaveErr) done(ubiSaveErr);

						// Delete existing Ubi
						agent.delete('/ubis/' + ubiSaveRes.body._id)
							.send(ubi)
							.expect(200)
							.end(function(ubiDeleteErr, ubiDeleteRes) {
								// Handle Ubi error error
								if (ubiDeleteErr) done(ubiDeleteErr);

								// Set assertions
								(ubiDeleteRes.body._id).should.equal(ubiSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ubi instance if not signed in', function(done) {
		// Set Ubi user 
		ubi.user = user;

		// Create new Ubi model instance
		var ubiObj = new Ubi(ubi);

		// Save the Ubi
		ubiObj.save(function() {
			// Try deleting Ubi
			request(app).delete('/ubis/' + ubiObj._id)
			.expect(401)
			.end(function(ubiDeleteErr, ubiDeleteRes) {
				// Set message assertion
				(ubiDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ubi error error
				done(ubiDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Ubi.remove().exec(function(){
				done();
			});	
		});
	});
});
