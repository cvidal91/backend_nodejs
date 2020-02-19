'use strict'

//cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

//ejectar express http
var app = express();

//cargar ficheros rutas
var articulo_routes = require('./routes/articulo');

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//ruta de prueba
/*
app.get('/datos-curso',(request,response)=>{
    var entrada = request.query.entrada;
    return response.status(200).send({
        curso: 'master en frameworks',
        autor: 'Carlos Vidal', 
        entrada_request: entrada
    });
});
*/


//añadir prefijos a rutas y cargue de rutas
app.use('/api/', articulo_routes);

//exportar modulo (fichero actual)
module.exports = app;