const { request, response } = require("express")

const esAdminRole = (req=request,res=response, next) => {
    // req.usuario viene inicializado en el middleware de validar-jwt
    if (!req.usuario){
        return res.status(500).json({
            msg:'Es necesario validar el token previo a validar el role'
        })
    }

    //extraer el nombre y el rol del usuario conectado
    const {nombre, rol} = req.usuario;

    if(rol !=='ADMIN_ROLE'){
        return res.status(401).json({
            msg:`El usuario ${nombre} no tiene privilegios de Administrador para poder realizar esta acción.`
        })
    }

    next();
}

/**
 * Función que comprueba que el usuario tenga ciertos roles para poder permitir la ejecución
 */
const tieneRoles = (...roles) => {
    return (req,res, next) => {
        // comprobar que hay usuario
        if (!req.usuario){
            return res.status(500).json({
                msg:'Es necesario validar el token previo a validar el role'
            })
        } 
       
        // comprobar que el role sea uno de los recibidos
        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El usuario ${req.usuario.nombre} no tiene privilegios para realizar esta acción`
            })
        }
        next();        
    }
}

module.exports = {esAdminRole, tieneRoles}