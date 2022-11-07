const {Router} = require('express');
const {check} = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, usuarioPorIDExiste } = require('../helpers/db-validators');
// const {validarCampos} = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRoles } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,tieneRoles
} = require('../middlewares');

const router = Router();

router.get('/',[
    check('limite','El parámetro límite debe ser un número').optional().isNumeric(),
    check('desde', 'El parámetro desde debe ser un número').optional().isNumeric(),
    validarCampos
],usuariosGet)

/**
 * ruta
 * array de middlewares para validar la request
 * controlador
 */
router.post('/',[
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('correo','El correo no es válido').notEmpty().isEmail(),
    check('correo').custom((correo)=> emailExiste(correo)),
    check('password','El password debe de ser más de 6 letras').isLength({min:6}),
    //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom((rol)=>esRoleValido(rol)),
    validarCampos
], usuariosPost)

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(usuarioPorIDExiste), // normalmente harías .custom((id)=> usuarioPorIDExiste(id)) pero como es recibir el mismo argumento, se puede abreviar y poner unicamente la referencia a la función
    check('rol').custom((rol)=>esRoleValido(rol)),
    validarCampos
],usuariosPut)

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRoles('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(usuarioPorIDExiste),
    validarCampos
],usuariosDelete)

router.patch('/',usuariosPatch)



module.exports = router;