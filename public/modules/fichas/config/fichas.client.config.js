'use strict';

// Configuring the new module
angular.module('fichas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fichas', 'fichas', 'dropdown', '/fichas(/create)?');
		Menus.addSubMenuItem('topbar', 'fichas', 'Nueva Ficha', 'fichas/create');
		Menus.addSubMenuItem('topbar', 'fichas', 'Buscar Ficha', 'fichas');
		Menus.addSubMenuItem('topbar', 'fichas', 'Reporte de Marcas', 'fichas/reporte/1');
	}
]);