const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol='')=>{
    const existeRol = await Role.findOne({rol});       
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la bbdd.`)
    }
}

// verificar si el correo indicado ya está en uso
const emailExiste = async (email) => {
    // verificar si el correo existe
    const existeMail = await Usuario.findOne({correo: email});    
    if (existeMail)
      throw new Error(`El correo indicado ${email} ya está en uso.`)
}

// Verificar si existe un usuario para el id enviado
const usuarioPorIDExiste = async (id) => {
    // verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);    
    if (!existeUsuario)
      throw new Error(`No hay ningún usuario para el id: ${id}.`)
}

module.exports = {esRoleValido,emailExiste,usuarioPorIDExiste}