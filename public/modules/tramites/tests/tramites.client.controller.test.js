'use strict';

(function() {
	// Tramites Controller Spec
	describe('Tramites Controller Tests', function() {
		// Initialize global variables
		var TramitesController,
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

			// Initialize the Tramites controller.
			TramitesController = $controller('TramitesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tramite object fetched from XHR', inject(function(Tramites) {
			// Create sample Tramite using the Tramites service
			var sampleTramite = new Tramites({
				name: 'New Tramite'
			});

			// Create a sample Tramites array that includes the new Tramite
			var sampleTramites = [sampleTramite];

			// Set GET response
			$httpBackend.expectGET('tramites').respond(sampleTramites);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tramites).toEqualData(sampleTramites);
		}));

		it('$scope.findOne() should create an array with one Tramite object fetched from XHR using a tramiteId URL parameter', inject(function(Tramites) {
			// Define a sample Tramite object
			var sampleTramite = new Tramites({
				name: 'New Tramite'
			});

			// Set the URL parameter
			$stateParams.tramiteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tramites\/([0-9a-fA-F]{24})$/).respond(sampleTramite);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tramite).toEqualData(sampleTramite);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tramites) {
			// Create a sample Tramite object
			var sampleTramitePostData = new Tramites({
				name: 'New Tramite'
			});

			// Create a sample Tramite response
			var sampleTramiteResponse = new Tramites({
				_id: '525cf20451979dea2c000001',
				name: 'New Tramite'
			});

			// Fixture mock form input values
			scope.name = 'New Tramite';

			// Set POST response
			$httpBackend.expectPOST('tramites', sampleTramitePostData).respond(sampleTramiteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tramite was created
			expect($location.path()).toBe('/tramites/' + sampleTramiteResponse._id);
		}));

		it('$scope.update() should update a valid Tramite', inject(function(Tramites) {
			// Define a sample Tramite put data
			var sampleTramitePutData = new Tramites({
				_id: '525cf20451979dea2c000001',
				name: 'New Tramite'
			});

			// Mock Tramite in scope
			scope.tramite = sampleTramitePutData;

			// Set PUT response
			$httpBackend.expectPUT(/tramites\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tramites/' + sampleTramitePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tramiteId and remove the Tramite from the scope', inject(function(Tramites) {
			// Create new Tramite object
			var sampleTramite = new Tramites({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tramites array and include the Tramite
			scope.tramites = [sampleTramite];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tramites\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTramite);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tramites.length).toBe(0);
		}));
	});
}());