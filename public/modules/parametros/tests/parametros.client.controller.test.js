'use strict';

(function() {
	// Parametros Controller Spec
	describe('Parametros Controller Tests', function() {
		// Initialize global variables
		var ParametrosController,
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

			// Initialize the Parametros controller.
			ParametrosController = $controller('ParametrosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Parametro object fetched from XHR', inject(function(Parametros) {
			// Create sample Parametro using the Parametros service
			var sampleParametro = new Parametros({
				name: 'New Parametro'
			});

			// Create a sample Parametros array that includes the new Parametro
			var sampleParametros = [sampleParametro];

			// Set GET response
			$httpBackend.expectGET('parametros').respond(sampleParametros);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parametros).toEqualData(sampleParametros);
		}));

		it('$scope.findOne() should create an array with one Parametro object fetched from XHR using a parametroId URL parameter', inject(function(Parametros) {
			// Define a sample Parametro object
			var sampleParametro = new Parametros({
				name: 'New Parametro'
			});

			// Set the URL parameter
			$stateParams.parametroId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/parametros\/([0-9a-fA-F]{24})$/).respond(sampleParametro);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parametro).toEqualData(sampleParametro);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Parametros) {
			// Create a sample Parametro object
			var sampleParametroPostData = new Parametros({
				name: 'New Parametro'
			});

			// Create a sample Parametro response
			var sampleParametroResponse = new Parametros({
				_id: '525cf20451979dea2c000001',
				name: 'New Parametro'
			});

			// Fixture mock form input values
			scope.name = 'New Parametro';

			// Set POST response
			$httpBackend.expectPOST('parametros', sampleParametroPostData).respond(sampleParametroResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Parametro was created
			expect($location.path()).toBe('/parametros/' + sampleParametroResponse._id);
		}));

		it('$scope.update() should update a valid Parametro', inject(function(Parametros) {
			// Define a sample Parametro put data
			var sampleParametroPutData = new Parametros({
				_id: '525cf20451979dea2c000001',
				name: 'New Parametro'
			});

			// Mock Parametro in scope
			scope.parametro = sampleParametroPutData;

			// Set PUT response
			$httpBackend.expectPUT(/parametros\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/parametros/' + sampleParametroPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid parametroId and remove the Parametro from the scope', inject(function(Parametros) {
			// Create new Parametro object
			var sampleParametro = new Parametros({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Parametros array and include the Parametro
			scope.parametros = [sampleParametro];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/parametros\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleParametro);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.parametros.length).toBe(0);
		}));
	});
}());