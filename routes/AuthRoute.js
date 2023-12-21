const express = require('express')

//controllers
const AuthController = require('../controllers/AuthController')

const route = express.Router()

route.post('/auth/register', AuthController.register)
route.post('/auth/login', AuthController.login)

module.exports = route;