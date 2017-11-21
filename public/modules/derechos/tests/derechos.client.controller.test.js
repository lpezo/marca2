'use strict';

(function() {
	// Derechos Controller Spec
	describe('Derechos Controller Tests', function() {
		// Initialize global variables
		var DerechosController,
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

			// Initialize the Derechos controller.
			DerechosController = $controller('DerechosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Derecho object fetched from XHR', inject(function(Derechos) {
			// Create sample Derecho using the Derechos service
			var sampleDerecho = new Derechos({
				name: 'New Derecho'
			});

			// Create a sample Derechos array that includes the new Derecho
			var sampleDerechos = [sampleDerecho];

			// Set GET response
			$httpBackend.expectGET('derechos').respond(sampleDerechos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.derechos).toEqualData(sampleDerechos);
		}));

		it('$scope.findOne() should create an array with one Derecho object fetched from XHR using a derechoId URL parameter', inject(function(Derechos) {
			// Define a sample Derecho object
			var sampleDerecho = new Derechos({
				name: 'New Derecho'
			});

			// Set the URL parameter
			$stateParams.derechoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/derechos\/([0-9a-fA-F]{24})$/).respond(sampleDerecho);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.derecho).toEqualData(sampleDerecho);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Derechos) {
			// Create a sample Derecho object
			var sampleDerechoPostData = new Derechos({
				name: 'New Derecho'
			});

			// Create a sample Derecho response
			var sampleDerechoResponse = new Derechos({
				_id: '525cf20451979dea2c000001',
				name: 'New Derecho'
			});

			// Fixture mock form input values
			scope.name = 'New Derecho';

			// Set POST response
			$httpBackend.expectPOST('derechos', sampleDerechoPostData).respond(sampleDerechoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Derecho was created
			expect($location.path()).toBe('/derechos/' + sampleDerechoResponse._id);
		}));

		it('$scope.update() should update a valid Derecho', inject(function(Derechos) {
			// Define a sample Derecho put data
			var sampleDerechoPutData = new Derechos({
				_id: '525cf20451979dea2c000001',
				name: 'New Derecho'
			});

			// Mock Derecho in scope
			scope.derecho = sampleDerechoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/derechos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/derechos/' + sampleDerechoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid derechoId and remove the Derecho from the scope', inject(function(Derechos) {
			// Create new Derecho object
			var sampleDerecho = new Derechos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Derechos array and include the Derecho
			scope.derechos = [sampleDerecho];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/derechos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDerecho);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.derechos.length).toBe(0);
		}));
	});
}());