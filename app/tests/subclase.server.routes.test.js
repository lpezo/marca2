'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subclase = mongoose.model('Subclase'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subclase;

/**
 * Subclase routes tests
 */
describe('Subclase CRUD tests', function() {
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

		// Save a user to the test db and create new Subclase
		user.save(function() {
			subclase = {
				name: 'Subclase Name'
			};

			done();
		});
	});

	it('should be able to save Subclase instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subclase
				agent.post('/subclases')
					.send(subclase)
					.expect(200)
					.end(function(subclaseSaveErr, subclaseSaveRes) {
						// Handle Subclase save error
						if (subclaseSaveErr) done(subclaseSaveErr);

						// Get a list of Subclases
						agent.get('/subclases')
							.end(function(subclasesGetErr, subclasesGetRes) {
								// Handle Subclase save error
								if (subclasesGetErr) done(subclasesGetErr);

								// Get Subclases list
								var subclases = subclasesGetRes.body;

								// Set assertions
								(subclases[0].user._id).should.equal(userId);
								(subclases[0].name).should.match('Subclase Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subclase instance if not logged in', function(done) {
		agent.post('/subclases')
			.send(subclase)
			.expect(401)
			.end(function(subclaseSaveErr, subclaseSaveRes) {
				// Call the assertion callback
				done(subclaseSaveErr);
			});
	});

	it('should not be able to save Subclase instance if no name is provided', function(done) {
		// Invalidate name field
		subclase.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subclase
				agent.post('/subclases')
					.send(subclase)
					.expect(400)
					.end(function(subclaseSaveErr, subclaseSaveRes) {
						// Set message assertion
						(subclaseSaveRes.body.message).should.match('Please fill Subclase name');
						
						// Handle Subclase save error
						done(subclaseSaveErr);
					});
			});
	});

	it('should be able to update Subclase instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subclase
				agent.post('/subclases')
					.send(subclase)
					.expect(200)
					.end(function(subclaseSaveErr, subclaseSaveRes) {
						// Handle Subclase save error
						if (subclaseSaveErr) done(subclaseSaveErr);

						// Update Subclase name
						subclase.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subclase
						agent.put('/subclases/' + subclaseSaveRes.body._id)
							.send(subclase)
							.expect(200)
							.end(function(subclaseUpdateErr, subclaseUpdateRes) {
								// Handle Subclase update error
								if (subclaseUpdateErr) done(subclaseUpdateErr);

								// Set assertions
								(subclaseUpdateRes.body._id).should.equal(subclaseSaveRes.body._id);
								(subclaseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Subclases if not signed in', function(done) {
		// Create new Subclase model instance
		var subclaseObj = new Subclase(subclase);

		// Save the Subclase
		subclaseObj.save(function() {
			// Request Subclases
			request(app).get('/subclases')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Subclase if not signed in', function(done) {
		// Create new Subclase model instance
		var subclaseObj = new Subclase(subclase);

		// Save the Subclase
		subclaseObj.save(function() {
			request(app).get('/subclases/' + subclaseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', subclase.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Subclase instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subclase
				agent.post('/subclases')
					.send(subclase)
					.expect(200)
					.end(function(subclaseSaveErr, subclaseSaveRes) {
						// Handle Subclase save error
						if (subclaseSaveErr) done(subclaseSaveErr);

						// Delete existing Subclase
						agent.delete('/subclases/' + subclaseSaveRes.body._id)
							.send(subclase)
							.expect(200)
							.end(function(subclaseDeleteErr, subclaseDeleteRes) {
								// Handle Subclase error error
								if (subclaseDeleteErr) done(subclaseDeleteErr);

								// Set assertions
								(subclaseDeleteRes.body._id).should.equal(subclaseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Subclase instance if not signed in', function(done) {
		// Set Subclase user 
		subclase.user = user;

		// Create new Subclase model instance
		var subclaseObj = new Subclase(subclase);

		// Save the Subclase
		subclaseObj.save(function() {
			// Try deleting Subclase
			request(app).delete('/subclases/' + subclaseObj._id)
			.expect(401)
			.end(function(subclaseDeleteErr, subclaseDeleteRes) {
				// Set message assertion
				(subclaseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Subclase error error
				done(subclaseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Subclase.remove().exec(function(){
				done();
			});	
		});
	});
});
