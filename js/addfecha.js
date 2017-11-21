db.import.find().forEach(function(imp){
    var xfecha = imp.VENCIMIENTO;
    if (xfecha.substring(1,1) == '.')
        xfecha = '0' + xfecha;
    var strfec = xfecha.substring(6, 10) + '-' +
        xfecha.substring(3, 5) + '-' +
        xfecha.substring(0, 2);
    var dfecha = new Date(strfec);
    dfecha.setHours(5);
    dfecha.setDate(dfecha.getDate()+1);
    print (xfecha, strfec, dfecha);
    db.fichas.update({numcertificado:imp.CERTIFICADO.toString()}, 
        {$set:{'fechas.fecvenc':dfecha, 'fechas.fecvigente':dfecha}});
})
