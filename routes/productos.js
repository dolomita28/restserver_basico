const {Router} = require('express');
const {check} = require('express-validator');
const { productoCrear, productosGet, actualizarProducto, productoGet, eliminarProducto } = require('../controllers/productos');
const {esRoleValido, usuarioPorIDExiste,categoriaPorIDExiste, productoPorIDExiste, usuarioEsAdmin} = require('../helpers/db-validators')
const {validarCampos, validarJWT} = require('../middlewares');

const router = Router();

/**
 * Obtener todos los productos
 */
router.get('/',[     
    check('limite','El parámetro límite debe ser un número').optional().isNumeric(),
    check('desde', 'El parámetro desde debe ser un número').optional().isNumeric(),
    validarCampos
], productosGet)

/**
 * Obtener un producto por su id
 */
router.get('/:id',[
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no parece ser un id de MongoDB').isMongoId(),
    validarCampos,
], productoGet)

/**
 * Crear un producto
 */
router.post('/',[
    validarJWT,
    check('nombre','Debe de indicar un nombre').not().isEmpty(),
    check('categoria').custom(categoriaPorIDExiste),
    validarCampos
], productoCrear)

/**
 * Actualizar un producto
 */
router.put('/:id',[
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no parece ser un id de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom(productoPorIDExiste),
    check('nombre','Debe de indicar un nombre').not().isEmpty(),
    check('disponibilidad','Disponibilidad debe ser un valor booleano').optional().isBoolean(),
    check('categoria','Categoria es obligatorio').not().isEmpty(),
    check('categoria','Categoria debe ser un id de MongoDB').isMongoId(),
    validarCampos,
    check('categoria').custom(categoriaPorIDExiste),
    validarCampos,
], actualizarProducto)


/**
 * Eliminar un producto (estado = false)
 */
router.delete('/:id',[
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no parece ser un id de MongoDB').isMongoId(), 
    validarCampos, 
    check('id').custom(productoPorIDExiste),  
    validarCampos,
],eliminarProducto)

module.exports = router;