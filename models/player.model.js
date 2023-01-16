
const { Schema, model } = require('mongoose')

const PlayerSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
    number: {
        type: Number,
        default: 0
    },
    birthday: {
        type: String,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    height: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        default: null,
    },
    positions: [{
        keyname: {
            type: String,
            required: true
        },
        favorite: {
            type: Boolean,
            default: false
        }
    }],
    foot: {
        type: String,
        default: 'derecho'
    },
    registerDate: {
        type: String,
        required: [true, 'La fecha de registro es obligatoria']
    },
    registerUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    userAccount: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

});

module.exports = model( 'Player', PlayerSchema )