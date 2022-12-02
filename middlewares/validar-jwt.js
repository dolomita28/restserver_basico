const jwt = require('jsonwebtoken');
const { response, request } = require("express");
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next)=> {
    const token = req.header('x-token');

    // comprobamos que llega el token
    if (!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    // validar el jwt
    try{
        const {uid} = jwt.verify(token, process.env.SECRETJWTKEY);

        // obtener el usuario conectado
        const usuario = await Usuario.findById(uid);

        console.log(usuario)
        // verificar que el usuario conectado está activo
        if(!usuario.status){
            return res.status(401).json({
                mgs: 'Token no válido - usuario no activo'
            })
        }

        // verificar que el usuario conectado está activo
        if(!usuario.status){
            return res.status(401).json({
                mgs: 'Token no válido - usuario no activo'
            })
        }
        
        // guardar el usuario autenticado
        req.usuario = usuario;
        next();
    }
    catch(err){
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }    
    
}

module.exports = {validarJWT}