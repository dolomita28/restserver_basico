const { response } = require("express");
const { Categoria } = require("../models");

/**
 * Recuperar todas las categorías
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const categoriasGet = async (req, res= response) => {
    const {limite = 5, desde = 0} = req.query;

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find()
            .skip(desde)
            .limit(limite)
    ])
    return res.status(200).json({
        total,
        categorias
            
    })
}

/**
 * Recuperar una categoría por su Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const categoriaById = async(req, res) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id);

    if(Categoria){
        return res.status(200).json({categoria})
    }
    else {
        return res.status(200).json({msg:`No se encontró ninguna categoría con el id: ${id}`})
    }

}

/**
 * Crear una categoría
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearCategoria = async(req, res) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    
    if (categoriaDB){
        return res.status(400).json({
            msg: 'La categoría ya existe'
        })
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json({
        msg: 'Categoría creada correctamente',
        categoria
    })
}

/**
 * Actualiza una categoría a partir del Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarCategoria = async (req, res) => {
    const {id} = req.params;    
    const {estado, usuario, ...data} = req.body;


    data.nombre = data.nombre.toUpperCase();    
    data.usuario = req.usuario._id;

    let categoria = await Categoria.findById(id);

    // no existe categoria
    if (!categoria)
        return res.status(400).json({
            msg: `No existe ninguna categoría con id: ${id}`
        })

    // actualizar en db    
    categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});    

    // devolver respuesta
    return res.status(200).json({
        msg: 'Categoría actualizada correctamente',
        categoria
    })
} 

const eliminarCategoria = async (req, res) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id);
    if (!categoria){
        return res.status(400).json({
            msg: `No hay ninguna categoría con el id: ${id}`
        })
    }

    // borramos categoría
    await Categoria.findByIdAndDelete(id);

    return res.status(200).json({
        msg: `La categoría ${categoria.nombre} ha sido eliminada`
    })
}

module.exports = {categoriasGet,crearCategoria, categoriaById, actualizarCategoria, eliminarCategoria}