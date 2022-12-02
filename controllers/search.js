const { response } = require("express");
const {Usuario, Categoria, Producto} = require("../models");
const {ObjectId} = require("mongoose").Types;


// lista de tablas sobre las que se podrá hacer búsquedas
const colecciones = ['usuarios','productos','categorias','roles'];

const search = (req, res=response)=>{
    const {coleccion, termino} = req.params;        

    //validar colecciones permitidas
    if (!colecciones.includes(coleccion)){
        return res.status(400).json({
            msg: `búsqueda no permitida sobre la tabla ${coleccion}`
        })
    }
    // Buscamos en la colección
    switch (coleccion){
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        default:
            return res.status(500).json({
                msg: `Búsqueda no implementada`
            })
    }
}

const buscarUsuarios = async(termino, res=response) => {
    // validar si nos llega un id de mongo
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId){
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: usuario ? [usuario] : []
        })
    }
    // o si nos llega un texto
    if (termino.length > 0){
        // expresión regular para permitir un like en la búsqueda
        const regexp = new RegExp(termino,'i');

        const [total ,usuarios] = await Promise.all([Usuario.count({
            // nombre o correo
            $or: [{nombre: regexp},{correo: regexp}],
            $and: [{estado: true}]
        }),Usuario.find({
            // nombre o correo
            $or: [{nombre: regexp},{correo: regexp}],
            $and: [{estado: true}]
        })])
        return res.json({
            total,
            results: usuarios
        })
    }
}
const buscarCategorias = async(termino, res=response) => {
    // validar si nos llega un id de mongo
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId){
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: categoria ? [categoria] : []
        })
    }
    // o si nos llega un texto
    if (termino.length > 0){
        // expresión regular para permitir un like en la búsqueda
        const regexp = new RegExp(termino,'i');

        const [total, categorias] = await Promise.all([Categoria.count({
            // nombre y estado            
            $and: [{nombre:regexp},{estado: true}]
        }),Categoria.find({
            // nombre y estado            
            $and: [{nombre:regexp},{estado: true}]
        })])
        return res.json({
            total,
            results: categorias
        })
    }
}
const buscarProductos = async(termino, res=response) => {
    // validar si nos llega un id de mongo
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId){
        const productos = await Producto.findById(termino);

        return res.json({
            results: productos ? [productos] : []
        })
    }
    // o si nos llega un texto
    if (termino.length > 0){
        // expresión regular para permitir un like en la búsqueda
        const regexp = new RegExp(termino,'i');

        const [total, productos] = await Promise.all([Producto.count({
            // nombre y estado
            $and: [{nombre:regexp},{estado: true}]
        }),Producto.find({
            // nombre y estado
            $and: [{nombre:regexp},{estado: true}]
        })])
        return res.json({
            total,
            results: productos
        })
    }
}



module.exports = {search}