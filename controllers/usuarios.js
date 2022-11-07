const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    // sacar los query string de la request
    const {limite = 5, desde = 0} = req.query;
    // recupear solo usuarios en status true
    const query = {status: true};
    // const usuarios = await Usuario.find()
    //   .skip(desde)
    //   .limit(limite);

    // const total = await Usuario.countDocuments();

    // modo optimo de hacerlo para evitar dos llamadas secuenciales
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(desde)
        .limit(limite)
    ])

  res.json({total,usuarios})
}

/**
 * POST para crear un nuevo usuario
 * @param {*} req 
 * @param {*} res 
 */
const usuariosPost = async (req, res = response) => {
    //desestructurar el body
    const {nombre, correo, password, rol} = req.body;
    // creamos el usuario a partir de los datos del body (aquellos que no sea parte del modelo Usuario serán ignorados)
    const usuario = new Usuario({nombre, correo, password, rol})    

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en bbdd
    await usuario.save();

    // devolver mensaje de respuesta y los datos del usuario recien creado
    res.json({msg:'post API - usuario creado', usuario})
  }

const usuariosPut = async (req, res = response) => {
    // sacar parámetros de la request
    const {id} = req.params;
    const {_id,password,google,correo, ...restoArgs} = req.body;

    if (password){
      // encriptar
      const salt = bcryptjs.genSaltSync();
      restoArgs.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, restoArgs);

    res.json({msg:'put API - usuario actualizado', usuario})
  }


const usuariosDelete = async (req, res = response) => {
  // recuperar el id
  const {id} = req.params;

  // recuperar el usuario conectado desde la request (asignado en el middleware validar-jwt)
  //const usuarioConectado = req.usuario;

  //borrado lógico
  const usuario = await Usuario.findByIdAndUpdate(id, {status:false});

    res.json(
      {msg:`El usuario con id: ${id} fue eliminado.`,
      usuario
    })
  }

  
const usuariosPatch = (req, res = response) => {
    res.json({msg:'patch API - controlador'})
  }


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}