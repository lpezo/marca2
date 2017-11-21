'use strict';

(function() {
	// Feriados Controller Spec
	describe('Feriados Controller Tests', function() {
		// Initialize global variables
		var FeriadosController,
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

			// Initialize the Feriados controller.
			FeriadosController = $controller('FeriadosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Feriado object fetched from XHR', inject(function(Feriados) {
			// Create sample Feriado using the Feriados service
			var sampleFeriado = new Feriados({
				name: 'New Feriado'
			});

			// Create a sample Feriados array that includes the new Feriado
			var sampleFeriados = [sampleFeriado];

			// Set GET response
			$httpBackend.expectGET('feriados').respond(sampleFeriados);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.feriados).toEqualData(sampleFeriados);
		}));

		it('$scope.findOne() should create an array with one Feriado object fetched from XHR using a feriadoId URL parameter', inject(function(Feriados) {
			// Define a sample Feriado object
			var sampleFeriado = new Feriados({
				name: 'New Feriado'
			});

			// Set the URL parameter
			$stateParams.feriadoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/feriados\/([0-9a-fA-F]{24})$/).respond(sampleFeriado);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.feriado).toEqualData(sampleFeriado);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Feriados) {
			// Create a sample Feriado object
			var sampleFeriadoPostData = new Feriados({
				name: 'New Feriado'
			});

			// Create a sample Feriado response
			var sampleFeriadoResponse = new Feriados({
				_id: '525cf20451979dea2c000001',
				name: 'New Feriado'
			});

			// Fixture mock form input values
			scope.name = 'New Feriado';

			// Set POST response
			$httpBackend.expectPOST('feriados', sampleFeriadoPostData).respond(sampleFeriadoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Feriado was created
			expect($location.path()).toBe('/feriados/' + sampleFeriadoResponse._id);
		}));

		it('$scope.update() should update a valid Feriado', inject(function(Feriados) {
			// Define a sample Feriado put data
			var sampleFeriadoPutData = new Feriados({
				_id: '525cf20451979dea2c000001',
				name: 'New Feriado'
			});

			// Mock Feriado in scope
			scope.feriado = sampleFeriadoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/feriados\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/feriados/' + sampleFeriadoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid feriadoId and remove the Feriado from the scope', inject(function(Feriados) {
			// Create new Feriado object
			var sampleFeriado = new Feriados({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Feriados array and include the Feriado
			scope.feriados = [sampleFeriado];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/feriados\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFeriado);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.feriados.length).toBe(0);
		}));
	});
}());