const express = require('express')

//controllers
const UserController = require('../controllers/UserController')

const route = express.Router()

route.get('/users', UserController.index)
route.get('/properti', UserController.getRumah)
route.get('/properti/detail/:rumah_id', UserController.editRumah);
route.get('/properti/detail-foto/:rumah_id', UserController.fotoRumah);

module.exports = route;

