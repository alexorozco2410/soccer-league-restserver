
const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    userName: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        unique: true
    },
    img: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    discriminator: {
        type: String,
        default: '0000'
    },
    age: {
        type: Number,
        default: 18
    }
})

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user} = this.toObject()
    return user
}

module.exports = model('User', UserSchema)