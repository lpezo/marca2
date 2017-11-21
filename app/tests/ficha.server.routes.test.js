'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ficha = mongoose.model('Ficha'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ficha;

/**
 * Ficha routes tests
 */
describe('Ficha CRUD tests', function() {
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

		// Save a user to the test db and create new Ficha
		user.save(function() {
			ficha = {
				name: 'Ficha Name'
			};

			done();
		});
	});

	it('should be able to save Ficha instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ficha
				agent.post('/fichas')
					.send(ficha)
					.expect(200)
					.end(function(fichaSaveErr, fichaSaveRes) {
						// Handle Ficha save error
						if (fichaSaveErr) done(fichaSaveErr);

						// Get a list of Fichas
						agent.get('/fichas')
							.end(function(fichasGetErr, fichasGetRes) {
								// Handle Ficha save error
								if (fichasGetErr) done(fichasGetErr);

								// Get Fichas list
								var fichas = fichasGetRes.body;

								// Set assertions
								(fichas[0].user._id).should.equal(userId);
								(fichas[0].name).should.match('Ficha Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ficha instance if not logged in', function(done) {
		agent.post('/fichas')
			.send(ficha)
			.expect(401)
			.end(function(fichaSaveErr, fichaSaveRes) {
				// Call the assertion callback
				done(fichaSaveErr);
			});
	});

	it('should not be able to save Ficha instance if no name is provided', function(done) {
		// Invalidate name field
		ficha.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ficha
				agent.post('/fichas')
					.send(ficha)
					.expect(400)
					.end(function(fichaSaveErr, fichaSaveRes) {
						// Set message assertion
						(fichaSaveRes.body.message).should.match('Please fill Ficha name');
						
						// Handle Ficha save error
						done(fichaSaveErr);
					});
			});
	});

	it('should be able to update Ficha instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ficha
				agent.post('/fichas')
					.send(ficha)
					.expect(200)
					.end(function(fichaSaveErr, fichaSaveRes) {
						// Handle Ficha save error
						if (fichaSaveErr) done(fichaSaveErr);

						// Update Ficha name
						ficha.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ficha
						agent.put('/fichas/' + fichaSaveRes.body._id)
							.send(ficha)
							.expect(200)
							.end(function(fichaUpdateErr, fichaUpdateRes) {
								// Handle Ficha update error
								if (fichaUpdateErr) done(fichaUpdateErr);

								// Set assertions
								(fichaUpdateRes.body._id).should.equal(fichaSaveRes.body._id);
								(fichaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fichas if not signed in', function(done) {
		// Create new Ficha model instance
		var fichaObj = new Ficha(ficha);

		// Save the Ficha
		fichaObj.save(function() {
			// Request Fichas
			request(app).get('/fichas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ficha if not signed in', function(done) {
		// Create new Ficha model instance
		var fichaObj = new Ficha(ficha);

		// Save the Ficha
		fichaObj.save(function() {
			request(app).get('/fichas/' + fichaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ficha.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ficha instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ficha
				agent.post('/fichas')
					.send(ficha)
					.expect(200)
					.end(function(fichaSaveErr, fichaSaveRes) {
						// Handle Ficha save error
						if (fichaSaveErr) done(fichaSaveErr);

						// Delete existing Ficha
						agent.delete('/fichas/' + fichaSaveRes.body._id)
							.send(ficha)
							.expect(200)
							.end(function(fichaDeleteErr, fichaDeleteRes) {
								// Handle Ficha error error
								if (fichaDeleteErr) done(fichaDeleteErr);

								// Set assertions
								(fichaDeleteRes.body._id).should.equal(fichaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ficha instance if not signed in', function(done) {
		// Set Ficha user 
		ficha.user = user;

		// Create new Ficha model instance
		var fichaObj = new Ficha(ficha);

		// Save the Ficha
		fichaObj.save(function() {
			// Try deleting Ficha
			request(app).delete('/fichas/' + fichaObj._id)
			.expect(401)
			.end(function(fichaDeleteErr, fichaDeleteRes) {
				// Set message assertion
				(fichaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ficha error error
				done(fichaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Ficha.remove().exec(function(){
				done();
			});	
		});
	});
});
