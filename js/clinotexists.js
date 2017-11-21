db.fichas.find().forEach(function(fic){
	var cli = db.clientes.findOne({codigo:fic.codcli});
	if (cli == null){
		print (fic.codcli, fic.nomcli);
		db.clientes.insert({codigo:fic.codcli, nombre:fic.nomcli});
	}
})
