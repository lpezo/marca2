'use strict';

(function() {
	// Fecvens Controller Spec
	describe('Fecvens Controller Tests', function() {
		// Initialize global variables
		var FecvensController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Fecvens controller.
			FecvensController = $controller('FecvensController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fecven object fetched from XHR', inject(function(Fecvens) {
			// Create sample Fecven using the Fecvens service
			var sampleFecven = new Fecvens({
				name: 'New Fecven'
			});

			// Create a sample Fecvens array that includes the new Fecven
			var sampleFecvens = [sampleFecven];

			// Set GET response
			$httpBackend.expectGET('fecvens').respond(sampleFecvens);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fecvens).toEqualData(sampleFecvens);
		}));

		it('$scope.findOne() should create an array with one Fecven object fetched from XHR using a fecvenId URL parameter', inject(function(Fecvens) {
			// Define a sample Fecven object
			var sampleFecven = new Fecvens({
				name: 'New Fecven'
			});

			// Set the URL parameter
			$stateParams.fecvenId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fecvens\/([0-9a-fA-F]{24})$/).respond(sampleFecven);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fecven).toEqualData(sampleFecven);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fecvens) {
			// Create a sample Fecven object
			var sampleFecvenPostData = new Fecvens({
				name: 'New Fecven'
			});

			// Create a sample Fecven response
			var sampleFecvenResponse = new Fecvens({
				_id: '525cf20451979dea2c000001',
				name: 'New Fecven'
			});

			// Fixture mock form input values
			scope.name = 'New Fecven';

			// Set POST response
			$httpBackend.expectPOST('fecvens', sampleFecvenPostData).respond(sampleFecvenResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fecven was created
			expect($location.path()).toBe('/fecvens/' + sampleFecvenResponse._id);
		}));

		it('$scope.update() should update a valid Fecven', inject(function(Fecvens) {
			// Define a sample Fecven put data
			var sampleFecvenPutData = new Fecvens({
				_id: '525cf20451979dea2c000001',
				name: 'New Fecven'
			});

			// Mock Fecven in scope
			scope.fecven = sampleFecvenPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fecvens\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fecvens/' + sampleFecvenPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fecvenId and remove the Fecven from the scope', inject(function(Fecvens) {
			// Create new Fecven object
			var sampleFecven = new Fecvens({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fecvens array and include the Fecven
			scope.fecvens = [sampleFecven];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fecvens\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFecven);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fecvens.length).toBe(0);
		}));
	});
}());