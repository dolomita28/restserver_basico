const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try{
    //Verificar que el usuario existe
    const usuario = await Usuario.findOne({correo});
    
    if (!usuario){
        return res.status(400).json({
            msg: 'Usuario o password incorrecto - Correo'
        })
    }
    // Verificar si el usuario está activo
    if (!usuario.status)
    {
        return res.status(400).json({
            msg: 'Usuario o password incorrecto - estado: false'
        })
    }

    //Verificar el password
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword)
    {
        return res.status(400).json({
            msg: 'Usuario o password incorrecto - password: invalid'
        })
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    // caso todo bien
    res.json({
        msg:'Login OK',
        usuario,
        token
    })

    }
    catch (err){
        console.log(err);
        res.status(500).json({
            msg: 'Se produjo un error - contacte con su administrador'
        })
    }    
}

module.exports = {
    login
}