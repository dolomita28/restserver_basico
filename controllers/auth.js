const { response, json } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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

// Valida el GoogleSigIn token
const googleSignIn = async (req, res) => {

    const {id_token} = req.body;

    try {
        const {nombre, correo, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});
        //si el usuario no existe, lo creamos
        if (!usuario){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google:true
            };

            usuario = new Usuario(data); 
            await usuario.save();           
        }


        // controlamos que el usuario este activo
        if (!usuario.status){
            return res.status(401).json({
                msg: 'Por favor contacte con un administrador - Usuario bloqueado'
            })
        }

        // generamos el JWT y devolvemos
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            oK: false,
            msg: 'El token de Google no es válido'
        })
    }
    
}

module.exports = {
    login,
    googleSignIn
}