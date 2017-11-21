'use strict';

(function() {
	// Subclases Controller Spec
	describe('Subclases Controller Tests', function() {
		// Initialize global variables
		var SubclasesController,
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

			// Initialize the Subclases controller.
			SubclasesController = $controller('SubclasesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Subclase object fetched from XHR', inject(function(Subclases) {
			// Create sample Subclase using the Subclases service
			var sampleSubclase = new Subclases({
				name: 'New Subclase'
			});

			// Create a sample Subclases array that includes the new Subclase
			var sampleSubclases = [sampleSubclase];

			// Set GET response
			$httpBackend.expectGET('subclases').respond(sampleSubclases);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subclases).toEqualData(sampleSubclases);
		}));

		it('$scope.findOne() should create an array with one Subclase object fetched from XHR using a subclaseId URL parameter', inject(function(Subclases) {
			// Define a sample Subclase object
			var sampleSubclase = new Subclases({
				name: 'New Subclase'
			});

			// Set the URL parameter
			$stateParams.subclaseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/subclases\/([0-9a-fA-F]{24})$/).respond(sampleSubclase);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subclase).toEqualData(sampleSubclase);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Subclases) {
			// Create a sample Subclase object
			var sampleSubclasePostData = new Subclases({
				name: 'New Subclase'
			});

			// Create a sample Subclase response
			var sampleSubclaseResponse = new Subclases({
				_id: '525cf20451979dea2c000001',
				name: 'New Subclase'
			});

			// Fixture mock form input values
			scope.name = 'New Subclase';

			// Set POST response
			$httpBackend.expectPOST('subclases', sampleSubclasePostData).respond(sampleSubclaseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Subclase was created
			expect($location.path()).toBe('/subclases/' + sampleSubclaseResponse._id);
		}));

		it('$scope.update() should update a valid Subclase', inject(function(Subclases) {
			// Define a sample Subclase put data
			var sampleSubclasePutData = new Subclases({
				_id: '525cf20451979dea2c000001',
				name: 'New Subclase'
			});

			// Mock Subclase in scope
			scope.subclase = sampleSubclasePutData;

			// Set PUT response
			$httpBackend.expectPUT(/subclases\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/subclases/' + sampleSubclasePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid subclaseId and remove the Subclase from the scope', inject(function(Subclases) {
			// Create new Subclase object
			var sampleSubclase = new Subclases({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Subclases array and include the Subclase
			scope.subclases = [sampleSubclase];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/subclases\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSubclase);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.subclases.length).toBe(0);
		}));
	});
}());