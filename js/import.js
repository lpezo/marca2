{
	//db.clientes.createIndex({nombre:1});
	var fichas = db.fichas.find().sort({codigo:-1}).limit(1).toArray();
	if (fichas.length){
		var ultficha = fichas[0];
		var ultcodigo = ultficha.codigo;
	}
	else
		var ultcodigo = 0;
	db.import.find().forEach(function(imp){
		print('---IMPORT----')
		printjson(imp);
		ultcodigo++;
		var doc = {codigo:ultcodigo};
		var cli = db.clientes.findOne({codigo:imp.CODCLI});
		if (cli == null){
			//throw '[ERROR] NO se encontró cliente: ' + imp.CLIENTE;
			db.clientes.insert({codigo:doc.CODCLI,nombre:doc.NOMCLI});
		}
		doc.codcli = imp.CODCLI;
		doc.nomcli = imp.NOMCLI;
		doc.codtit = imp.CODTIT;
		doc.nomtit = imp.NOMTIT;
		doc.nomsigno = imp.MARCA;
		doc.clases = [];
		imp.CLASE.toString().split(',').forEach(function(cla){
			var clas = cla.trim();
			if (clas.length == 1)
				clas = '0' + clas;
			doc.clases.push(clas);
		});
		doc.numcertificado = imp.CERTIFICADO.toString();
		doc.fechas = {};
		if (imp.VENCIMIENTO && imp.VENCIMIENTO.length > 6)
		{
			var xfecha = imp.VENCIMIENTO;
			if (xfecha.substring(1, 2) == ".")
				xfecha = "0" + xfecha;
			var strfec = xfecha.substring(6, 10) + '-' + 
				xfecha.substring(3, 5) + '-' +
				xfecha.substring(0, 2);
			doc.fechavenc = new Date(strfec);
		}
		if (imp.VIGENCIA && imp.VIGENCIA.length > 6)
		{
			var xfecha = imp.VIGENCIA;
			if (xfecha.substring(1, 2) == ".")
				xfecha = "0" + xfecha;
			var strfec = xfecha.substring(6, 10) + '-' + 
				xfecha.substring(3, 5) + '-' +
				xfecha.substring(0, 2);
			doc.fechas.fecvigente = new Date(strfec);
		}
		doc.estado = imp.ESTADO;
		doc.obs = imp.OBSERVACIONES;
		doc.deslogo = imp.DESLOGO;
		doc.archivo = imp.ARCHIVO;
		doc.numexpediente = imp.EXPEDIENTE;
		print('=>ficha')
		printjson(doc);
		db.fichas.insert(doc);
	});
}
