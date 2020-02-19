'use strict'
var validator = require('validator');

var Articulo = require('../models/articulo');
var fs = require('fs');
var path = require('path');

var controller = {

    datosCursos: (request,response)=>{
        var entrada = request.body.entrada;
        return response.status(200).send({
            curso: 'master en frameworks',
            autor: 'Carlos Vidal', 
            entrada_request: entrada,
            status: 'success'
        });
    },
    test: (request,response)=>{
        return response.status(200).send({
            message: "accion de pruebas",
            status: 'success'
        });
    },
    save: (request, response)=>{
        //recoger los parametros por post
        var params = request.body;
        //validar datos
        try{
            var valida_titulo = !validator.isEmpty(params.titulo);
            var valida_contenido = !validator.isEmpty(params.contenido);

        }catch(err){
            return response.status(200).send({                
                message: "Error en la validación de datos",
                status: 'error'
            });
        }

        if(valida_contenido && valida_titulo){
            //crear el objeto a guardar
            var nuevo_articulo = new Articulo();

            //asignar valores
            nuevo_articulo.titulo = params.titulo;
            nuevo_articulo.contenido = params.contenido;
            nuevo_articulo.imagaen = null;

            //guardar el articulo
            nuevo_articulo.save((err, articulo)=>{

                //devulver una respuesta
                if(err || !articulo){
                    return response.status(500).send({
                        message: "Los datos no se han guardado",
                        status: 'error'
                    });
                }

                return response.status(200).send({
                    message: "Articulo guardado exitosamente",
                    articulo: articulo,
                    status: 'success'
                });

            });

        }else{
            return response.status(200).send({
                message: "Faltan datos por ingresar",
                status: 'error'
            });
        }
    },
    obtenerArticulos: (request,response)=>{
        //Find
        var ultimo = request.params.ultimo;
        var query = Articulo.find();
        if(ultimo || ultimo != undefined){
            query.limit(1);
        }

        query.sort('-id').exec((err,articulos)=>{
            if(err){
                return response.status(500).send({
                    articulos: articulos,
                    status: 'error'
                });
            }

            return response.status(200).send({
                articulos: articulos,
                status: 'success'
            });
        });

        
    },
    obtenerArticulo: (request,response)=>{
        var id = request.params.id;
        try{
            var valida_id = !validator.isEmpty(id);
        }catch(err){
            return response.status(500).send({
                message: "error al procesar la busqueda",
                status: 'error'
            });
        }

        Articulo.findById(id,(err,articulo)=>{
            if(err){
                return response.status(500).send({
                    message: "error al procesar la busqueda",
                    status: 'error'
                });
            }

            if(!articulo){
                return response.status(404).send({
                    message: "No se encontró el articulo con el id ingresado",
                    status: 'error'
                });
            }

            return response.status(200).send({
                articulos: articulo,
                status: 'success'
            });
        });
        

    },
    actualizarArticulo: (request,response)=>{
        var id = request.params.id;
        var params = request.body;
        try{
            var valida_id = !validator.isEmpty(id);
            var valida_titulo = !validator.isEmpty(params.titulo);
            var valida_contenido = !validator.isEmpty(params.contenido);

        }catch(err){
            return response.status(500).send({
                message: "Los datos ingresados para la validación no son validos",
                status: 'error'
            });
        }

        if(!valida_id){
            return response.status(500).send({
                message: "No se han ingresado datos validos para la consulta",
                status: 'error'
            });
        }

        if(valida_titulo && valida_contenido){
            Articulo.findOneAndUpdate({_id:id},params,{new:true},(err,articuloActualizado)=>{
                if(err){
                    return response.status(500).send({
                        message: "Error al actualizar",
                        err:err,
                        status: 'error'
                    });
                }
                if(!articuloActualizado){
                    return response.status(500).send({
                        message: "No existe el articulo que se desea actualizar",
                        status: 'error'
                    });
                }

                return response.status(200).send({
                    message: "Articulo actualizado correctamente",
                    articulo: articuloActualizado,
                    status: 'success'
                });
            });
        }else{
            return response.status(200).send({
                message: "Los datos para la actualización no es correcta",
                status: 'error'
            });
        }
    },
    borrarArticulo: (request,response)=>{
        //obtener el identificador
        var id = request.params.id;
        //validar el dato
        try{
            var valida_id = !validator.isEmpty(id);
        }catch(err){
            return response.status(200).send({
                message: "No se ha especidicado identificador del articulo",
                status: 'error'
            });
        }
        //eliminar el documento y validar que se encuentre el documento
        Articulo.findByIdAndDelete(id,(err,articuloEliminado)=>{
            if(err){
                return response.status(200).send({
                    message: "No se ha podido eliminar ningun articulo",
                    status: 'error'
                });
            }
            if(articuloEliminado){
                return response.status(200).send({
                    message: "Se ha eliminado el articulo exitosamente",
                    articulo: articuloEliminado,
                    status: 'error'
                });
            }
        });
    },
    cargarArchivo: (request,response)=>{
        
        //recoger el fichero de la peticion
        if(!request.files){
            return response.status(200).send({
                message: "No se ha subido ninguna imagen",
                status: 'error'
            });
        }
        //conseguir el nombre y extensión del archivo
        
        var ruta_archivo = request.files.files.path;
        var ruta = ruta_archivo.split('\\');
        //Para linux 
        //var ruta = ruta_archivo.split('/');
        var nombre_archivo = ruta[2];
        var ext_archivo = nombre_archivo.split('.');
        ext_archivo = ext_archivo[1];

        //comprobar la externsión, solo imagenes
        if(ext_archivo != 'png' && ext_archivo != 'jpg' && ext_archivo != 'jpge'){
            fs.unlink(ruta_archivo,(err)=>{
                return response.status(200).send({
                    message: "La extensión que se ha intentado subir no es valida",
                    status: 'error'
                });
            });
        }else{

            Articulo.findOneAndUpdate({_id:request.params.id},{imagen:nombre_archivo},(err,articuloAfectado)=>{
                
                if(err){
                    fs.unlink(ruta_archivo,(err)=>{
                        return response.status(200).send({
                            message: "Error al intentar actualizar la imagen del articulo",
                            status: 'error'
                        });
                    });

                    return;
                }

                if(!articuloAfectado){
                    fs.unlink(ruta_archivo,(err)=>{
                        return response.status(200).send({
                            message: "No se ha actualizado la imagen del articulo",
                            status: 'error'
                        });
                    });

                    return;
                }

                if(articuloAfectado.imagen != null){
                    fs.unlink(ruta[0]+'\\'+ruta[1]+'\\'+articuloAfectado.imagen,()=>{});
                }

                return response.status(200).send({
                    message: "imagen cargada con exito",
                    archivo: request.files.files,
                    artuculo: articuloAfectado,
                    nombre_archivo: nombre_archivo,
                    status: 'success'
                });
                
            });
        }
        //si todo es valido, buscar articulo, asignarle nombre  a la imagen y actualizarlo

    },
    obtenerImagen: (request,response)=>{
        var nombre_archivo = request.params.nombre_imagen;
        var ruta_archivo = "./upload/articulos/"+nombre_archivo;

        fs.exists(ruta_archivo,(exist)=>{
            if(exist){
                return response.sendFile(path.resolve(ruta_archivo));
            }else{
                return response.status(404).send({
                    message: "La imagen no existe",
                    status: 'error'
                });
            }
        });
    },
    buscarArticulo: (request, response)=>{
        var str_busqueda = request.params.str_busqueda;

        Articulo.find({"$or":[
            {titulo: {"$regex": str_busqueda,"$options":"i"}},
            {contenido: {"$regex": str_busqueda,"$options":"i"}}
        ]}).sort('fecha_registro')
            .exec((err,articulos)=>{
                if(err){
                    return response.status(500).send({
                        message: "Error al procesar la busqueda",
                        status: 'error'
                    });
                }

                if(!articulos || articulos.length == 0){
                    return response.status(200).send({
                        message: "No se encontraron articulos",
                        status: 'success'
                    });
                }

                return response.status(200).send({
                    articulos: articulos,
                    status: 'success'
                });

            });
    }
};

module.exports = controller;