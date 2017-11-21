'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user,
			modules: {reniec: false, sunat: false, essalud: false, telefonica: false}
		};

		return _this._data;
	}
]);