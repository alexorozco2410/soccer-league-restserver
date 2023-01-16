
const { Schema, model } = require('mongoose')

const TeamSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del equipo es obligatorio']
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        default: null
    },
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
    }],
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    registerDate: {
        type: String,
        required: [true, 'La fecha de registro es obligatoria']
    },
    registerUser: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        // required: true
    },
    category: {
        type: String,
        default: 'FUT11',
        required: true
    },
    logo: {
        type: String,
        default: null,
    }

});

module.exports = model( 'Team', TeamSchema )