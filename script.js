//eliminar clientes duplicados
db.clientes.aggregate([
{$group:
	{_id: '$codigo', cant: {$sum:1}, id: {$min:'$_id'}}
},
{$match:
	{cant: {$gt: 1}}
}
]).forEach(function(doc){
	print(doc._id);
	db.clientes.remove({_id:doc.id});
})
