const { response, request } = require('express')

const getUsers = (req = request, res = response) => {

    // const query = req.query
    const {nombre, a, apikey = 'no api key'} = req.query
    res.json({
        msg: "Get API - Controller",
        nombre,
        a,
        apikey
    })
}

const putUsers = (req, res = response) => {

    const id = req.params.id

    res.json({
        msg: "Put API - Controller",
        id
    })
}

const postUsers = (req, res = response) => {

    const body = req.body

    res.json({
        msg: "Post API - Controller",
        body
    })
}

const delUsers = (req, res = response) => {
    res.json({
        msg: "Delete API - Controller"
    })
}

const patchUsers = (req, res = response) => {
    res.json({
        msg: "Patch API - Controller"
    })
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    delUsers,
    patchUsers
}