'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fecven = mongoose.model('Fecven'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fecven;

/**
 * Fecven routes tests
 */
describe('Fecven CRUD tests', function() {
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

		// Save a user to the test db and create new Fecven
		user.save(function() {
			fecven = {
				name: 'Fecven Name'
			};

			done();
		});
	});

	it('should be able to save Fecven instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fecven
				agent.post('/fecvens')
					.send(fecven)
					.expect(200)
					.end(function(fecvenSaveErr, fecvenSaveRes) {
						// Handle Fecven save error
						if (fecvenSaveErr) done(fecvenSaveErr);

						// Get a list of Fecvens
						agent.get('/fecvens')
							.end(function(fecvensGetErr, fecvensGetRes) {
								// Handle Fecven save error
								if (fecvensGetErr) done(fecvensGetErr);

								// Get Fecvens list
								var fecvens = fecvensGetRes.body;

								// Set assertions
								(fecvens[0].user._id).should.equal(userId);
								(fecvens[0].name).should.match('Fecven Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fecven instance if not logged in', function(done) {
		agent.post('/fecvens')
			.send(fecven)
			.expect(401)
			.end(function(fecvenSaveErr, fecvenSaveRes) {
				// Call the assertion callback
				done(fecvenSaveErr);
			});
	});

	it('should not be able to save Fecven instance if no name is provided', function(done) {
		// Invalidate name field
		fecven.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fecven
				agent.post('/fecvens')
					.send(fecven)
					.expect(400)
					.end(function(fecvenSaveErr, fecvenSaveRes) {
						// Set message assertion
						(fecvenSaveRes.body.message).should.match('Please fill Fecven name');
						
						// Handle Fecven save error
						done(fecvenSaveErr);
					});
			});
	});

	it('should be able to update Fecven instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fecven
				agent.post('/fecvens')
					.send(fecven)
					.expect(200)
					.end(function(fecvenSaveErr, fecvenSaveRes) {
						// Handle Fecven save error
						if (fecvenSaveErr) done(fecvenSaveErr);

						// Update Fecven name
						fecven.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fecven
						agent.put('/fecvens/' + fecvenSaveRes.body._id)
							.send(fecven)
							.expect(200)
							.end(function(fecvenUpdateErr, fecvenUpdateRes) {
								// Handle Fecven update error
								if (fecvenUpdateErr) done(fecvenUpdateErr);

								// Set assertions
								(fecvenUpdateRes.body._id).should.equal(fecvenSaveRes.body._id);
								(fecvenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fecvens if not signed in', function(done) {
		// Create new Fecven model instance
		var fecvenObj = new Fecven(fecven);

		// Save the Fecven
		fecvenObj.save(function() {
			// Request Fecvens
			request(app).get('/fecvens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fecven if not signed in', function(done) {
		// Create new Fecven model instance
		var fecvenObj = new Fecven(fecven);

		// Save the Fecven
		fecvenObj.save(function() {
			request(app).get('/fecvens/' + fecvenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fecven.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fecven instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fecven
				agent.post('/fecvens')
					.send(fecven)
					.expect(200)
					.end(function(fecvenSaveErr, fecvenSaveRes) {
						// Handle Fecven save error
						if (fecvenSaveErr) done(fecvenSaveErr);

						// Delete existing Fecven
						agent.delete('/fecvens/' + fecvenSaveRes.body._id)
							.send(fecven)
							.expect(200)
							.end(function(fecvenDeleteErr, fecvenDeleteRes) {
								// Handle Fecven error error
								if (fecvenDeleteErr) done(fecvenDeleteErr);

								// Set assertions
								(fecvenDeleteRes.body._id).should.equal(fecvenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fecven instance if not signed in', function(done) {
		// Set Fecven user 
		fecven.user = user;

		// Create new Fecven model instance
		var fecvenObj = new Fecven(fecven);

		// Save the Fecven
		fecvenObj.save(function() {
			// Try deleting Fecven
			request(app).delete('/fecvens/' + fecvenObj._id)
			.expect(401)
			.end(function(fecvenDeleteErr, fecvenDeleteRes) {
				// Set message assertion
				(fecvenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fecven error error
				done(fecvenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Fecven.remove().exec(function(){
				done();
			});	
		});
	});
});
