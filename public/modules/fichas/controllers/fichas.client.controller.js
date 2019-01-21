'use strict';

// Fichas controller
angular.module('fichas').controller('FichasController', ['$scope', '$stateParams', '$location', 
		'$resource', 'Authentication', 'Fichas', 'TableSettings', 'FichasForm', 'ClientesBusq', 
		'Derechos', 'Tramites', 'Clases', 'Subclases', '$timeout', 'Upload', 'ParametrosCod', 'Fecvens', 'TitularsBusq', 'FichasImg',
	function($scope, $stateParams, $location, 
		$resource, Authentication, Fichas, TableSettings, FichasForm, ClientesBusq,
		Derechos, Tramites, Clases, SubClases, $timeout, Upload, ParametrosCod, Fecvens, TitularsBusq, FichasImg) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Fichas, 'ficha');
		$scope.ficha = {};

		// $scope.buscandoCliente = false;
		$scope.buscandoFichas = false;

		$scope.setFormFields = function(disabled) {
			$scope.formFields = FichasForm.getFormFields(disabled);
		};

	    $scope.uploadPic = function(file, cliente, titular) {


			if (cliente)
			{
				$scope.ficha.codcli = cliente.codigo;
				$scope.ficha.nomcli = cliente.nombre;
			}

			/*
			if (titular)
			{
				$scope.ficha.codtit = titular.codigo;
				$scope.ficha.nomtit = titular.nombre;
			}
			*/

			var ficha = new Fichas($scope.ficha);
			ficha.derecho = $scope.derecho._id;
			ficha.tramite = $scope.tramite._id;
			// ficha.subclases = [];
			// console.log('uploadPic: ', $scope.clase);
			ficha.clases = [];
			if ($scope.ficha.subclases)
			{
				$scope.ficha.subclases.forEach(function(item){
					if (ficha.clases.indexOf(item.clase) < 0)
						ficha.clases.push(item.clase);
				});
			}
			// if ($scope.clase)
			// 	$scope.clase.forEach(function(cada){
			// 		var str = '0' + cada.id;
			// 		ficha.clases.push(str.substring(str.length-2));
			// 	});

			console.log('uploadpic:', ficha);

			/*
			if (idClase)
			{
				if ($scope.ficha.clases)
				{
					var pos = $scope.ficha.clases.indexOf(idClase);
					if (pos < 0)
						$scope.ficha.clases.push(idClase);
				}
				else
					$scope.ficha.clases = [idClase];
			}
			*/

			if (file)
			{
				// console.log('uploadPic:ficha', ficha);
				console.log('uploadPic:file.name', file.name);

			    file.upload = Upload.upload({
			      url: 'fichaupload',
			      fields: ficha,
			      file: file,
		   		});

			    file.upload.then(function (response) {
			      $timeout(function () {
			        file.result = response.data;
			        $location.path('fichas');
			      });
			    }, function (response) {
			      console.log('response: ', response);
			      if (response.status > 0)
			        $scope.error = response.status + ': ' + (response.data ? response.data.message : response.message);
			    });

			    file.upload.progress(function (evt) {
			      // Math.min is to fix IE which reports 200% sometimes
			      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			    });
			}
			else
			{
				
				if (ficha._id){
					ficha.$update(function() {
						$location.path('fichas');
					}, function(response) {
						console.log('response err:', response);
					if (response.status > 0)
			        	$scope.error = response.status + ': ' + (response.data ? response.data.message : response.message);
					});
				}
				else
				{
					ficha.$save(function(response) {
						$location.path('fichas');
					}, function(err) {
						if (err.data)
							$scope.error = err.data.message;
						else
							$scope.error = err.message;
					});
				}
			}

	    };

	    $scope.borrarimagen = function()
	    {
	    	$scope.picFile = null;
	    };

		// Update existing Ficha
		$scope.update = function() {
			var ficha = $scope.ficha;
			ficha.derecho = $scope.derecho._id;
			ficha.tramite = $scope.tramite._id;
			ficha.$update(function() {
				$location.path('fichas');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ficha
		$scope.remove = function(ficha) {

			if ( ficha ) {
				ficha = Fichas.get({fichaId:ficha._id}, function() {
					ficha.$remove(function(){
						$scope.tableParams.reload();						
					});
				});

			} else {
				$scope.ficha.$remove(function() {
					$location.path('fichas');
				});
			}

		};


		$scope.toViewFicha = function() {
			$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId} );
			$scope.setFormFields(true);
		};

		$scope.toCreateFicha = function()
		{
			// $scope.buscandoCliente = false;
			$scope.ficha = {};
			$scope.derecho = {_id:null};
			$scope.derechos = Derechos.query({all:true});
			$scope.tramite = {_id:null};
			$scope.tramites = Tramites.query({all:true});
			$scope.clases = Clases.query();
			$scope.subclase = {};

		};

		$scope.toEditFicha = function() {
			//$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId} );
			//$scope.setFormFields(false);
			// $scope.buscandoCliente = false;
			$scope.clases = Clases.query();
			$scope.subclase = {};
			// Clases.query({}, function(clas){
			// 	clas.forEach(function(cadacla){
			// 		cadacla.id = parseInt(cadacla._id);
			// 		cadacla.label = cadacla.desc;
			// 	});
			// 	$scope.clases = clas;
			// });

			$scope.ficha = Fichas.get( {fichaId: $stateParams.fichaId}, function(ficha) {
				//console.log('toEditFicha get: ', ficha);
				$scope.derecho = ficha.derecho || {_id:null};
				$scope.derechos = Derechos.query({all:true});
				$scope.tramite = ficha.tramite || {_id:null};
				$scope.tramites = Tramites.query({all:true});

				// if (ficha.clases)
				// {
				// 	ficha.clases.forEach(function(cada){
				// 		$scope.clase.push({id:parseInt(cada)});
				// 	});
				// }

				$scope.cliente = {codigo: ficha.codcli, nombre: ficha.nomcli};
				//$scope.titular = {codigo: ficha.codtit, nombre: ficha.nomtit};
				// console.log('editficha:', ficha);
				// console.log('scope.clase:', $scope.clase);
				// console.log('scope.clases:', $scope.clases);
				//console.log('toEditFicha: scope.derecho', $scope.derecho);
			});
		};

		$scope.changeClase = function(unaClase){
			$scope.subclases = [];
			$scope.subclase = [];
			Clases.query({claseId: unaClase}, function(lista){
				var i = 0;
				if (lista)
				{
					lista.forEach(function(lis){
						var ele = {id:i++, label: lis.codigo + '-' + lis.name, clase: lis.clase, codigo: lis.codigo};
						$scope.subclases.push(ele); 
						if ($scope.ficha.subclases){
							$scope.ficha.subclases.forEach(function(cadasub){
								if (cadasub.clase === lis.clase && cadasub.codigo === lis.codigo)
									$scope.subclase.push(ele);
							});
						}
					});
				}
			});
		};



		$scope.toEditFecha = function(){
			var Fich = $resource('fichas/fecha/:idFicha', {idFicha: '@_id'});
			Fich.get({idFicha: $stateParams.fichaId}, function(ficha){
				if (ficha.fechas === undefined)
					ficha.fechas = {fecpre:null};
				$scope.ficha = ficha;
				//console.log('toEditFecha: ', ficha);

			});
		};

		$scope.uploadFechas = function()
		{
			var ficha = new Fichas($scope.ficha);
			console.log('uploadFechas:', ficha);
			var Fich = $resource('fichas/fecha/:idFicha', null, 
				{
					'update': {method: 'PUT'}
				});
			Fich.update({idFicha: ficha._id}, ficha, function(ficha){
					$location.path('fichas');
				}, function(errorResponse){
					$scope.error = errorResponse.data.message;
				});

		};

		$scope.iniList = function()
		{
			$scope.clases =	Clases.query();
			var param = $scope.tableParams.parameters();
			if (param.query)
			{
				$scope.query = param.query;
			}
		};

		$scope.doQuery = function()
		{
			var param = $scope.tableParams.parameters();
			param.query = $scope.query;
			param.page = 1;
			console.log('param:', param);
			$scope.tableParams.parameters(param);
			$scope.tableParams.reload();
		};

		$scope.queryVencFecha = function(fecha1, fecha2)
		{
			if (!fecha2 || fecha1 > fecha2) 
			{
				if ($scope.query)
					$scope.query.vencfecha2 = fecha1;
				else
					$scope.query = {vencfecha2: fecha1};
			}
			$scope.doQuery();
		};

		$scope.queryVencFecha2 = function(fecha1, fecha2)
		{
			if (!fecha1 || fecha1 > fecha2) 
			{
				if ($scope.query)
					$scope.query.vencfecha1 = fecha2;
				else
					$scope.query = {vencfecha1: fecha2};
			}
			$scope.doQuery();
		};

		// $scope.$on('ngTableBeforeReloadData', function () {
  //            $scope.buscandoFichas = true;
  //       });
        
		// $scope.$on('ngTableAfterReloadData', function () {
  //            $scope.buscandoFichas = false;
  //       });


		$scope.iniVenc = function()
		{
			var venc = $resource('fichavencimiento', {});
			venc.query({},function(fichas){
				$scope.fichas = fichas;
			}, function(error){
				$scope.error = error.data.message;
			});
		};

		$scope.descartar = function(fichaFecha)
		{
			var UpdDescarte = $resource('fichas/:codFicha/venc/:descarte', {codFicha: '@codigo', descarte: '@descarte'});
			var updDescarte = new UpdDescarte(fichaFecha);
			updDescarte.$save(function(){
				//$route.reload();
				for (var i=0; i<$scope.fichas.length; i++)
				{
					if ($scope.fichas[i].codigo === fichaFecha.codigo)
					{
						$scope.fichas.splice(i, 1);
						break;
					}
				}
			}, function(error){
				$scope.error = error.data.message;
			});
		};

		$scope.iniReporte = function()
		{
			// $scope.buscandoCliente = false;
			$scope.ficha = {codcli: '', nomcli:''};
			/*
			$scope.tiposDeFecha = [
				{id:'fecpub', name:'Fecha de Publicación'},
				{id:'fecvenc', name:'Fecha de Vencimiento'}
			];
			*/

			$scope.tiposDeFecha = Fecvens.query();

			$scope.desde = new Date();
			$scope.desde.setHours(0,0,0,0);
			$scope.hasta = new Date();
			$scope.hasta.setHours(0,0,0,0);
			$scope.tipoFecha = 'fecpub';

			$scope.modoReporte = false;
		};
		
		$scope.changeDesde = function()
		{
			// console.log('changedesde');
			if ($scope.desde > $scope.hasta)
				$scope.hasta = $scope.desde;
		};

		$scope.reporte1 = function()
		{
			$scope.error = '';
			if ($scope.desde > $scope.hasta)
			{
				$scope.error = 'Fecha desde no puede mayor que fecha hasta';
				return;
			}
			var rep1 = $resource('fichas/reporte/1', {});
			var codcli = null;
			if ($scope.cliente)
				codcli = $scope.cliente.codigo;
			rep1.query({ codcli: codcli, tipoFecha: $scope.tipoFecha, desde: $scope.desde, hasta: $scope.hasta }, function(result){

				for(var i in $scope.tiposDeFecha)
				{
					if ($scope.tiposDeFecha[i].campo === $scope.tipoFecha)
					{
						$scope.tituloReporte = $scope.tiposDeFecha[i].descripcion;
						break;
					}
				}
				$scope.result = result;
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});

		};

		$scope.changeFecpre = function()
		{
			ParametrosCod.get({parametroCod:'01', fecha:$scope.ficha.fechas.fecpre}, function(obj){
				$scope.ficha.fechas.fecnoti = obj.fecha;
			});
		};

		$scope.changePub = function()
		{
			ParametrosCod.get({parametroCod:'02', fecha:$scope.ficha.fechas.fecpub}, function(obj){
				$scope.ficha.fechas.fecvencplazo = obj.fecha;
				$scope.ficha.fechas.fecpubDescarte = false;	
			});
		};

		$scope.changeFecOrdPub = function()
		{
			ParametrosCod.get({parametroCod:'10', fecha:$scope.ficha.fechas.fecordpub}, function(obj){
				$scope.ficha.fechas.fecvencplapub = obj.fecha;
				//$scope.ficha.fechas.fecpubDescarte = false;	
			});
		};


		$scope.change_fecnotopo = function()
		{
			ParametrosCod.get({parametroCod:'03', fecha:$scope.ficha.fechas.fecnotopo}, function(obj){
				$scope.ficha.fechas.fecplazocont = obj.fecha;
			});
		};

		$scope.change_fecnotresol = function()
		{
			ParametrosCod.get({parametroCod:'04', fecha:$scope.ficha.fechas.fecnotresol}, function(obj){
				$scope.ficha.fechas.fecplareco = obj.fecha;
			});

			ParametrosCod.get({parametroCod:'05', fecha:$scope.ficha.fechas.fecnotresol}, function(obj){
				$scope.ficha.fechas.fecvencplaape = obj.fecha;
			});

		};

		$scope.change_fecnotresoreco = function()
		{
			ParametrosCod.get({parametroCod:'06', fecha:$scope.ficha.fechas.fecnotresoreco}, function(obj){
				$scope.ficha.fechas.fecvencplaape = obj.fecha;
			});

			ParametrosCod.get({parametroCod:'07', fecha:$scope.ficha.fechas.fecnotresoreco}, function(obj){
				$scope.ficha.fechas.fecvencplazdem = obj.fecha;
			});
		};

		// $scope.addclase = function(idClase){
		// 	if (!$scope.ficha.clases)
		// 		$scope.ficha.clases = [idClase];
		// 	else
		// 	{
		// 		if ($scope.ficha.clases.indexOf(idClase) < 0)
		// 		{
		// 			$scope.ficha.clases.push(idClase);
		// 			$scope.ficha.clases.sort();
		// 		}
		// 	}
		// };

		// $scope.restclase = function(idClase){
		// 	if ($scope.ficha.clases)
		// 	{
		// 		var pos = $scope.ficha.clases.indexOf(idClase);
		// 		if (pos >= 0)
		// 		{
		// 			$scope.ficha.clases.splice(pos, 1);
		// 		}
		// 	}
		// };

		$scope.setclase = {
		    smartButtonMaxItems: 10,
		    scrollableHeight: '250px',
		    scrollable: true
		    // smartButtonTextConverter: function(itemText, originalItem) {
		    // 	return itemText.substring(0, 20);
		    // }
		};

		$scope.setsubclase = {
		    smartButtonMaxItems: 10,
		    scrollableHeight: '250px',
		    scrollable: true,
		    externalIdProp: '',
		    smartButtonTextConverter: function(itemText, originalItem) {
		    	return itemText.substring(0, 2);
		    }
		};

		$scope.setsubclaseevent = {
			onItemSelect: function(item) {
				if (!$scope.ficha.subclases)
					$scope.ficha.subclases = [];
				$scope.ficha.subclases.push({clase:item.clase,codigo:item.codigo,label:item.label.substring(3)});
				$scope.ficha.subclases.sort(function(a, b){
					var cmp = a.clase.localeCompare(b.clase);
					if (cmp === 0)
						cmp = a.codigo.localeCompare(b.codigo);
					return cmp;
				});
			},
			onItemDeselect: function(item) {
				if (!$scope.subclases)
					return;
				var itemx = $scope.subclases[item.id];
				var sc = $scope.ficha.subclases;
				var pos = -1;
				for(var i=0; i < sc.length; i++){
					if (sc[i].clase === itemx.clase && sc[i].codigo === itemx.codigo)
					{
						pos = i;
						break;
					}
				}
				if (pos >= 0)
					sc.splice(pos, 1);
			},
			onDeselectAll: function() {
				if (!$scope.subclases)
					return;
				if ($scope.subclases.length === 0)
					return;
				var itemx = $scope.subclases[0];
				var sc = $scope.ficha.subclases;
				for (var i=sc.length-1; i >= 0; i--){
					if (sc[i].clase === itemx.clase)
						sc.splice(i, 1);
				}
			}
		};

		$scope.borrarSubClase = function(item)
		{
			var sc = $scope.ficha.subclases;
			for (var i=0; i < sc.length; i++){
				if (sc[i].clase === item.clase && sc[i].codigo === item.codigo){
					sc.splice(i, 1);
					break;
				}
			}
			sc = $scope.subclase;
			for (var j=0; j < sc.length; j++){
				if (sc[j].clase === item.clase && sc[j].codigo === item.codigo){
					sc.splice(j, 1);
					break;
				}
			}
		};

		$scope.modelOptions = {
		    debounce: {
		      default: 500,
		      blur: 250
		    },
		    getterSetter: true
	  	};

	  	$scope.getCliente = function(valor)
	  	{
			var promise = ClientesBusq.query({texto: valor, count: 20});
			return promise.$promise.then(function(res){
				return res;
				});	  		
	  	};

	  	$scope.getTitular = function(valor)
	  	{
			var promise = TitularsBusq.query({texto: valor, count: 20});
			return promise.$promise.then(function(res){
				return res;
				});	  		
	  	};

	  	$scope.iralista = function()
	  	{
	  		$location.path('fichas');
	  	};
	  	
	  	$scope.creapdf = function()
	  	{
	  	    console.log($scope.result);
	  	    
			var docDefinition = {
				content: [
					{
					table: {
						headerRows: 1,
						widths: [ 50, 100, 100, 100, 100 ],
						body: [
						[ 'Código', 'Marca', 'Clase', 'Logo', 'Certificado']
						]
					},
					layout: {
						fillColor: function (rowIndex, node, columnIndex) {
						return (rowIndex === 0) ? '#FF7F00' : null;
						}
					}
					}
				],
				defaultStyle: {
					fontSize: 10
				}
			};
			  
			FichasImg.loadImages64($scope.result).then(function(response){
				console.log('response:',response);
				
				
    			// open the PDF in a new window
    			for (var ificha in $scope.result){
    				var ficha = $scope.result[ificha];
    				var clase = '';
    				for (var cadaclase in ficha.clases){
    				if (clase === '')
    					clase = ficha.clases[cadaclase];
    				else
    					clase = clase + ', ' + ficha.clases[cadaclase];
    				}
    				var image = {image: ficha.base64, width:100};
    				if (!ficha.archivo)
    				image = '';
    				if (ficha.codigo){
    				    docDefinition.content[0].table.body.push( [ficha.codigo, ficha.nomsigno, clase, image, ficha.numcertificado || ''] );
    				}
    			}
    						
    			//console.log(docDefinition);
                
    			pdfMake.createPdf(docDefinition).open();
    	
    			// print the PDF
    			//pdfMake.createPdf(docDefinition).print();
    	
    			// download the PDF
    			pdfMake.createPdf(docDefinition);
    	  	    
    	  	    //alert('pendiente');
				
			}).catch(function(err){
			    console.log('err:', err);
			});


	



	  	};

	}

]);
