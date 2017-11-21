'use strict';

(function() {
	// Fichas Controller Spec
	describe('Fichas Controller Tests', function() {
		// Initialize global variables
		var FichasController,
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

			// Initialize the Fichas controller.
			FichasController = $controller('FichasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ficha object fetched from XHR', inject(function(Fichas) {
			// Create sample Ficha using the Fichas service
			var sampleFicha = new Fichas({
				name: 'New Ficha'
			});

			// Create a sample Fichas array that includes the new Ficha
			var sampleFichas = [sampleFicha];

			// Set GET response
			$httpBackend.expectGET('fichas').respond(sampleFichas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fichas).toEqualData(sampleFichas);
		}));

		it('$scope.findOne() should create an array with one Ficha object fetched from XHR using a fichaId URL parameter', inject(function(Fichas) {
			// Define a sample Ficha object
			var sampleFicha = new Fichas({
				name: 'New Ficha'
			});

			// Set the URL parameter
			$stateParams.fichaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fichas\/([0-9a-fA-F]{24})$/).respond(sampleFicha);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ficha).toEqualData(sampleFicha);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fichas) {
			// Create a sample Ficha object
			var sampleFichaPostData = new Fichas({
				name: 'New Ficha'
			});

			// Create a sample Ficha response
			var sampleFichaResponse = new Fichas({
				_id: '525cf20451979dea2c000001',
				name: 'New Ficha'
			});

			// Fixture mock form input values
			scope.name = 'New Ficha';

			// Set POST response
			$httpBackend.expectPOST('fichas', sampleFichaPostData).respond(sampleFichaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ficha was created
			expect($location.path()).toBe('/fichas/' + sampleFichaResponse._id);
		}));

		it('$scope.update() should update a valid Ficha', inject(function(Fichas) {
			// Define a sample Ficha put data
			var sampleFichaPutData = new Fichas({
				_id: '525cf20451979dea2c000001',
				name: 'New Ficha'
			});

			// Mock Ficha in scope
			scope.ficha = sampleFichaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fichas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fichas/' + sampleFichaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fichaId and remove the Ficha from the scope', inject(function(Fichas) {
			// Create new Ficha object
			var sampleFicha = new Fichas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fichas array and include the Ficha
			scope.fichas = [sampleFicha];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fichas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFicha);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fichas.length).toBe(0);
		}));
	});
}());