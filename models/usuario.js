const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El coreo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,        
    },
    rol: {
        type: String,
        required: true,
        //enum: ['ADMIN_ROLE','USER_ROLE']
    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//sobrescribir el método toJSON para evitar devolver el password y el atributo __v
UsuarioSchema.methods.toJSON = function() {
    const {__v,password,...usuario} = this.toObject();
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema );