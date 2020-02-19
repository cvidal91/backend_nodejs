'use strict'

var mongoose = require('mongoose');
var app =  require('./app');
var port =  3900;

var url = "mongodb://localhost:27017/api_rest_blog";
var options = {useNewUrlParser:true,useUnifiedTopology: true};

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url, options).then(()=>{
    console.log('Conexión establecida con exito');

    //Crear servidor y poner a escuchar peticiones
    app.listen(port, ()=>{
        console.log('Servidor corriendo');
    });
});
