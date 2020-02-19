'use strict'

var mongoose = require('mongoose');

var articuloSchema = mongoose.Schema({
    titulo: String,
    contenido: String,
    fecha_registro: { type: Date, default: Date.now },
    imagen: String
});

module.exports = mongoose.model('Articulo',articuloSchema);