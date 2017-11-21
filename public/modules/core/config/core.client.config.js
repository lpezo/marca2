'use strict';

// Configuring the new module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tablas', 'core', 'dropdown', '');
		Menus.addSubMenuItem('topbar', 'core', 'Clientes', 'clientes');
		Menus.addSubMenuItem('topbar', 'core', 'Titulares', 'titulars');
		Menus.addSubMenuItem('topbar', 'core', 'Derechos', 'derechos');
		Menus.addSubMenuItem('topbar', 'core', 'Sub Clases', 'subclases');
		Menus.addSubMenuItem('topbar', 'core', 'Trámites', 'tramites');
		Menus.addSubMenuItem('topbar', 'core', 'Ubicación', 'ubis');
		Menus.addSubMenuItem('topbar', 'core', 'Feriados', 'feriados');
		Menus.addSubMenuItem('topbar', 'core', 'Parámetros', 'parametros/config');
		Menus.addSubMenuItem('topbar', 'core', 'Parámetros Edit', 'parametros', null, true, ['admin']);
		Menus.addSubMenuItem('topbar', 'core', 'Fechas de Vencimiento', 'fecvens', null, true, ['admin']);
	}
]);