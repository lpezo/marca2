'use strict';

module.exports = {
	app: {
		title: 'MARCA',
		description: 'Gestor de Marcas',
		keywords: 'marcas'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ng-table/ng-table.min.css',
				'public/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
				],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-table/ng-table.js',
				'public/lib/api-check/dist/api-check.min.js',
	            'public/lib/ng-file-upload/FileAPI.js', 
	            'public/lib/ng-file-upload/ng-file-upload-shim.js',
	            'public/lib/ng-file-upload/ng-file-upload.js',
	            'public/lib/jquery/dist/jquery.js',
	            'public/lib/bootstrap/dist/js/bootstrap.js',
	            'public/lib/moment/moment.js',
	            'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
				'public/lib/angular-formly/dist/formly.js',
				'public/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
				'public/lib/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
				'public/lib/lodash/dist/lodash.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
