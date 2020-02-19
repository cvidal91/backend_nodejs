'use strick'

var express = require('express');
var artuculoController = require('../controllers/articulo');

var router = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir:'./upload/articulos'});

router.get('/datos-curso', artuculoController.datosCursos);
router.get('/test-controlador', artuculoController.test);
router.post('/save', artuculoController.save);
router.get('/articulos/:ultimo?', artuculoController.obtenerArticulos);
router.get('/articulo/:id', artuculoController.obtenerArticulo);
router.put('/articulo/:id?', artuculoController.actualizarArticulo);
router.delete('/articulo/:id?', artuculoController.borrarArticulo);
router.post('/articulo/cargar_archivo/:id',md_upload,artuculoController.cargarArchivo);
router.get('/articulo/obtener_imagen/:nombre_imagen',md_upload,artuculoController.obtenerImagen);
router.get('/articulos/busqueda/:str_busqueda',md_upload,artuculoController.buscarArticulo);

module.exports = router;