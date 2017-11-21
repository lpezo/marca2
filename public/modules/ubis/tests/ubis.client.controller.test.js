'use strict';

(function() {
	// Ubis Controller Spec
	describe('Ubis Controller Tests', function() {
		// Initialize global variables
		var UbisController,
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

			// Initialize the Ubis controller.
			UbisController = $controller('UbisController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ubi object fetched from XHR', inject(function(Ubis) {
			// Create sample Ubi using the Ubis service
			var sampleUbi = new Ubis({
				name: 'New Ubi'
			});

			// Create a sample Ubis array that includes the new Ubi
			var sampleUbis = [sampleUbi];

			// Set GET response
			$httpBackend.expectGET('ubis').respond(sampleUbis);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ubis).toEqualData(sampleUbis);
		}));

		it('$scope.findOne() should create an array with one Ubi object fetched from XHR using a ubiId URL parameter', inject(function(Ubis) {
			// Define a sample Ubi object
			var sampleUbi = new Ubis({
				name: 'New Ubi'
			});

			// Set the URL parameter
			$stateParams.ubiId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ubis\/([0-9a-fA-F]{24})$/).respond(sampleUbi);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ubi).toEqualData(sampleUbi);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ubis) {
			// Create a sample Ubi object
			var sampleUbiPostData = new Ubis({
				name: 'New Ubi'
			});

			// Create a sample Ubi response
			var sampleUbiResponse = new Ubis({
				_id: '525cf20451979dea2c000001',
				name: 'New Ubi'
			});

			// Fixture mock form input values
			scope.name = 'New Ubi';

			// Set POST response
			$httpBackend.expectPOST('ubis', sampleUbiPostData).respond(sampleUbiResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ubi was created
			expect($location.path()).toBe('/ubis/' + sampleUbiResponse._id);
		}));

		it('$scope.update() should update a valid Ubi', inject(function(Ubis) {
			// Define a sample Ubi put data
			var sampleUbiPutData = new Ubis({
				_id: '525cf20451979dea2c000001',
				name: 'New Ubi'
			});

			// Mock Ubi in scope
			scope.ubi = sampleUbiPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ubis\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ubis/' + sampleUbiPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ubiId and remove the Ubi from the scope', inject(function(Ubis) {
			// Create new Ubi object
			var sampleUbi = new Ubis({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ubis array and include the Ubi
			scope.ubis = [sampleUbi];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ubis\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUbi);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ubis.length).toBe(0);
		}));
	});
}());