'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tramite = mongoose.model('Tramite'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tramite;

/**
 * Tramite routes tests
 */
describe('Tramite CRUD tests', function() {
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

		// Save a user to the test db and create new Tramite
		user.save(function() {
			tramite = {
				name: 'Tramite Name'
			};

			done();
		});
	});

	it('should be able to save Tramite instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tramite
				agent.post('/tramites')
					.send(tramite)
					.expect(200)
					.end(function(tramiteSaveErr, tramiteSaveRes) {
						// Handle Tramite save error
						if (tramiteSaveErr) done(tramiteSaveErr);

						// Get a list of Tramites
						agent.get('/tramites')
							.end(function(tramitesGetErr, tramitesGetRes) {
								// Handle Tramite save error
								if (tramitesGetErr) done(tramitesGetErr);

								// Get Tramites list
								var tramites = tramitesGetRes.body;

								// Set assertions
								(tramites[0].user._id).should.equal(userId);
								(tramites[0].name).should.match('Tramite Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tramite instance if not logged in', function(done) {
		agent.post('/tramites')
			.send(tramite)
			.expect(401)
			.end(function(tramiteSaveErr, tramiteSaveRes) {
				// Call the assertion callback
				done(tramiteSaveErr);
			});
	});

	it('should not be able to save Tramite instance if no name is provided', function(done) {
		// Invalidate name field
		tramite.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tramite
				agent.post('/tramites')
					.send(tramite)
					.expect(400)
					.end(function(tramiteSaveErr, tramiteSaveRes) {
						// Set message assertion
						(tramiteSaveRes.body.message).should.match('Please fill Tramite name');
						
						// Handle Tramite save error
						done(tramiteSaveErr);
					});
			});
	});

	it('should be able to update Tramite instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tramite
				agent.post('/tramites')
					.send(tramite)
					.expect(200)
					.end(function(tramiteSaveErr, tramiteSaveRes) {
						// Handle Tramite save error
						if (tramiteSaveErr) done(tramiteSaveErr);

						// Update Tramite name
						tramite.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tramite
						agent.put('/tramites/' + tramiteSaveRes.body._id)
							.send(tramite)
							.expect(200)
							.end(function(tramiteUpdateErr, tramiteUpdateRes) {
								// Handle Tramite update error
								if (tramiteUpdateErr) done(tramiteUpdateErr);

								// Set assertions
								(tramiteUpdateRes.body._id).should.equal(tramiteSaveRes.body._id);
								(tramiteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tramites if not signed in', function(done) {
		// Create new Tramite model instance
		var tramiteObj = new Tramite(tramite);

		// Save the Tramite
		tramiteObj.save(function() {
			// Request Tramites
			request(app).get('/tramites')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tramite if not signed in', function(done) {
		// Create new Tramite model instance
		var tramiteObj = new Tramite(tramite);

		// Save the Tramite
		tramiteObj.save(function() {
			request(app).get('/tramites/' + tramiteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tramite.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tramite instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tramite
				agent.post('/tramites')
					.send(tramite)
					.expect(200)
					.end(function(tramiteSaveErr, tramiteSaveRes) {
						// Handle Tramite save error
						if (tramiteSaveErr) done(tramiteSaveErr);

						// Delete existing Tramite
						agent.delete('/tramites/' + tramiteSaveRes.body._id)
							.send(tramite)
							.expect(200)
							.end(function(tramiteDeleteErr, tramiteDeleteRes) {
								// Handle Tramite error error
								if (tramiteDeleteErr) done(tramiteDeleteErr);

								// Set assertions
								(tramiteDeleteRes.body._id).should.equal(tramiteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tramite instance if not signed in', function(done) {
		// Set Tramite user 
		tramite.user = user;

		// Create new Tramite model instance
		var tramiteObj = new Tramite(tramite);

		// Save the Tramite
		tramiteObj.save(function() {
			// Try deleting Tramite
			request(app).delete('/tramites/' + tramiteObj._id)
			.expect(401)
			.end(function(tramiteDeleteErr, tramiteDeleteRes) {
				// Set message assertion
				(tramiteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tramite error error
				done(tramiteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Tramite.remove().exec(function(){
				done();
			});	
		});
	});
});
