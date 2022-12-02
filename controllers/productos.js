const { response } = require("express");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");

/**
 * Obtiene todos los productos
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const productosGet = async (req, res=response) =>{
    const query = {estado:true};
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
    ])
    return res.json({
        Total: `Se encontraron ${total} productos`,
        productos
    })
}

/**
 * Obtener un producto a partir de su id
 * @param {*} req 
 * @param {*} res 
 */
const productoGet = async (req, res) => {

    const {id} = req.params;

    const producto = await Producto.findById(id);

    if(!producto)
        return res.status(400).json({msg: 'No se encontró ningun producto para este id'})

    return res.json({producto});
}

/**
 * Crear un nuevo producto
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const productoCrear = async (req, res) => {
    let {nombre, ...data} = req.body;

    nombre = nombre.toUpperCase();

    // comprobar que no existe ya ese producto
    const productoExiste = await Producto.findOne({nombre});

    if(productoExiste){
        return res.status(400).json({
            msg: `Ya existe un producto con el nombre: ${nombre}`
        })
    }

    // recuperar el usuario que crea el producto del usuario conectado
    data.nombre = nombre;
    data.usuario = req.usuario._id;
    data.precio = +data.precio;

    const producto = new Producto(data);
    await producto.save();

    return res.json({
        msg: 'producto creado correctamente',
        producto        
    })

}

/**
 * Actualizar producto 
 */
const actualizarProducto = async (req, res) => {
    const {id} = req.params;

    const {...data} = req.body;

    // completar data con el usuario
    data.usuario = req.usuario._id;
    data.estado = true; // para evitar que lo marquen  como inactivo

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

    return res.json({
        msg: 'producto actualizado correctamente',
        producto
    })
}

const eliminarProducto = async (req, res) => {
    const {id} = req.params;

    //comprobar si el usuario es administrador
    const usuario = await Usuario.findById(req.usuario._id);
    const rol = usuario.rol;

    if (!usuario || rol !== 'ADMIN_ROLE')
        return res.status(401).json({msg: 'No tiene permisos para realizar esta acción'})

    await Producto.findByIdAndUpdate(id, {estado:false});

    return res.json({msg: `El producto con id: ${id} fue eliminado correctamente.`})
}

module.exports = {productosGet, productoCrear, actualizarProducto, productoGet, eliminarProducto}